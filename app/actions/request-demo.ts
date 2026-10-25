"use server";

import { after } from "next/server";
import { contact } from "@/lib/content";
import { notifyInquiry } from "@/lib/notify.server";
import {
  INQUIRY_FIELDS,
  MIN_FILL_MS,
  RAW_FIELD_CAP,
  inquirySchema,
  toFieldErrors,
  toSchemaInput,
  type InquiryFormState,
  type InquiryValues,
} from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

const { messages } = contact.form;

/** SQLSTATE raised by the inquiries rate-limit trigger (supabase/migrations/20261024000000_inquiries.sql). */
const RATE_LIMIT_CODE = "P0429";

function readText(formData: FormData, name: string): string | null {
  const value = formData.get(name);
  return typeof value === "string" ? value : null;
}

/**
 * "Send an inquiry" server action, used with useActionState. Works without JavaScript
 * (progressive enhancement): Next.js posts the form and renders the returned state.
 *
 * A successful submission is a new row in `public.inquiries` (RLS: INSERT only; repeat
 * inquiries from the same email are stored). Success is reported only after that insert
 * succeeds. The founders' email notification runs after the response and can never turn
 * a stored submission into an error.
 *
 * Logging: only error codes and names. Submission content is never logged.
 */
export async function submitInquiry(_prev: InquiryFormState, formData: FormData): Promise<InquiryFormState> {
  // Honeypot: real visitors never see or fill "website". Report success so bots learn nothing.
  // Nothing is stored or sent for these submissions.
  const honeypot = readText(formData, "website");
  if (honeypot && honeypot.trim() !== "") {
    return { status: "success", message: messages.success };
  }

  const values: InquiryValues = {};
  for (const field of INQUIRY_FIELDS) {
    const raw = readText(formData, field);
    if (raw !== null) values[field] = raw.slice(0, RAW_FIELD_CAP);
  }

  // Minimum fill time. startedAt is set client-side after hydration; it is absent without
  // JavaScript, in which case this check is skipped. A negative delta means client clock skew,
  // so only a small positive delta counts as "too fast".
  // Known trade-off: the value is client-supplied, so a bot that drops or forges it skips this
  // check. It only filters naive bots; the honeypot and the per-email database limit do the rest.
  const startedAt = Number(readText(formData, "startedAt"));
  if (Number.isFinite(startedAt) && startedAt > 0) {
    const elapsed = Date.now() - startedAt;
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) {
      return { status: "error", message: messages.tooFast, values };
    }
  }

  const parsed = inquirySchema.safeParse(toSchemaInput((f) => values[f]));
  if (!parsed.success) {
    return { status: "invalid", message: messages.invalid, fieldErrors: toFieldErrors(parsed.error), values };
  }

  const inquiry = parsed.data;
  const row: TablesInsert<"inquiries"> = {
    email: inquiry.email,
    company: inquiry.company,
    working_on: inquiry.workingOn,
    message: inquiry.message,
    technology_category: inquiry.technologyCategory,
    request_type: inquiry.requestType,
    source: "website",
  };

  let supabase: ReturnType<typeof createClient>;
  try {
    supabase = createClient();
  } catch {
    // Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY (the thrown message names which; no user data).
    console.error("[inquiry] supabase client not configured");
    return { status: "error", message: messages.error, values };
  }

  try {
    // No .select(): RLS allows INSERT only, so asking for the row back would fail.
    const { error } = await supabase.from("inquiries").insert(row);

    if (error) {
      if (error.code === RATE_LIMIT_CODE) {
        return { status: "rateLimited", message: messages.rateLimited, values };
      }
      // Code only: Postgres messages/details can echo submitted values.
      console.error("[inquiry] insert failed", { code: error.code });
      return { status: "error", message: messages.error, values };
    }
  } catch (err) {
    console.error("[inquiry] unexpected failure", { error: err instanceof Error ? err.name : "UnknownError" });
    return { status: "error", message: messages.error, values };
  }

  // Stored. Notify after the response is sent; notifyInquiry never throws.
  const receivedAt = new Date();
  after(async () => {
    await notifyInquiry(inquiry, receivedAt);
  });

  return { status: "success", message: messages.success };
}
