"use server";

import { cta } from "@/lib/content";
import {
  DEMO_FIELDS,
  MIN_FILL_MS,
  demoRequestSchema,
  toFieldErrors,
  type DemoFormState,
  type DemoValues,
} from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";

const ERROR_MESSAGE = cta.form.error;
const TOO_FAST_MESSAGE = cta.form.tooFast;
const INVALID_MESSAGE = cta.form.invalid;

function readText(formData: FormData, name: string): string | null {
  const value = formData.get(name);
  return typeof value === "string" ? value : null;
}

/**
 * Demo request server action, used with useActionState.
 * Works without JavaScript (progressive enhancement): Next.js posts the form and
 * renders the returned state.
 */
export async function requestDemo(_prev: DemoFormState, formData: FormData): Promise<DemoFormState> {
  // Honeypot: real visitors never see or fill "website". Report success so bots learn nothing.
  const honeypot = readText(formData, "website");
  if (honeypot && honeypot.trim() !== "") {
    return { status: "success", message: cta.form.success };
  }

  const values: DemoValues = {};
  for (const field of DEMO_FIELDS) {
    const raw = readText(formData, field);
    if (raw !== null) values[field] = raw.slice(0, 4000);
  }

  // Minimum fill time. startedAt is set client-side after hydration; it is absent
  // without JavaScript, in which case this check is skipped. A negative delta means
  // client clock skew, so only a small positive delta counts as "too fast".
  // Known trade-off: the value is client-supplied, so a bot that drops or forges it skips
  // this check. It only filters naive bots; the honeypot and the unique email index do the rest.
  const startedAt = Number(readText(formData, "startedAt"));
  if (Number.isFinite(startedAt) && startedAt > 0) {
    const elapsed = Date.now() - startedAt;
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) {
      return { status: "error", message: TOO_FAST_MESSAGE, values };
    }
  }

  const parsed = demoRequestSchema.safeParse({
    email: values.email ?? "",
    company: values.company,
    role: values.role,
    message: values.message,
  });

  if (!parsed.success) {
    return { status: "invalid", message: INVALID_MESSAGE, fieldErrors: toFieldErrors(parsed.error), values };
  }

  const { email, company, role, message } = parsed.data;

  try {
    const supabase = createClient();
    // No .select(): RLS allows INSERT only, so asking for the row back would fail.
    const { error } = await supabase.from("waitlist").insert({ email, company, role, message });

    if (error) {
      if (error.code === "23505") {
        return { status: "duplicate", message: cta.form.duplicate };
      }
      console.error("[request-demo] insert failed", { code: error.code, message: error.message });
      return { status: "error", message: ERROR_MESSAGE, values };
    }
  } catch (err) {
    console.error("[request-demo] unexpected failure", err instanceof Error ? err.message : err);
    return { status: "error", message: ERROR_MESSAGE, values };
  }

  return { status: "success", message: cta.form.success };
}
