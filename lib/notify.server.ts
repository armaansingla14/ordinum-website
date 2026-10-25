import "server-only";
import { REQUEST_TYPES, TECHNOLOGY_CATEGORIES, site } from "@/lib/content";
import type { Inquiry } from "@/lib/schema";

/**
 * New-inquiry email to the founders, sent through the Resend HTTP API with plain fetch (no SDK).
 *
 * Degrades safely:
 *   - without RESEND_API_KEY it does nothing and logs one line with no submission content;
 *   - it never throws, so a notification problem can never fail a stored submission;
 *   - logs carry only an HTTP status or an error name, never what the visitor wrote.
 *
 * Env (server-only; see .env.example):
 *   RESEND_API_KEY       required to send
 *   INQUIRY_NOTIFY_TO    recipient, default armaan@ordinum.org (comma-separated list allowed)
 *   INQUIRY_NOTIFY_FROM  sender, default "Ordinum Website <onboarding@resend.dev>" (Resend's
 *                        shared test sender; use an address on a verified domain in production)
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TIMEOUT_MS = 5000;
const DEFAULT_FROM = "Ordinum Website <onboarding@resend.dev>";
const SUBJECT = "New Ordinum inquiry";

export type NotifyResult = { sent: true } | { skipped: true } | { failed: true; status?: number };

function labelFor(list: readonly { value: string; label: string }[], value: string | null): string {
  if (!value) return "-";
  return list.find((o) => o.value === value)?.label ?? value;
}

function buildText(inquiry: Inquiry, receivedAt: Date): string {
  const line = (label: string, value: string | null) => `${label}: ${value ?? "-"}`;
  return [
    "A new inquiry was submitted through the contact form on ordinum.org.",
    "",
    line("Received", receivedAt.toISOString()),
    line("Work email", inquiry.email),
    line("Company", inquiry.company),
    line("Technology category", labelFor(TECHNOLOGY_CATEGORIES, inquiry.technologyCategory)),
    line("Request type", labelFor(REQUEST_TYPES, inquiry.requestType)),
    "",
    "What are you working on?",
    inquiry.workingOn ?? "-",
    "",
    "Message",
    inquiry.message ?? "-",
    "",
    "Stored in Supabase: public.inquiries. Reply to this email to answer the sender.",
  ].join("\n");
}

export async function notifyInquiry(inquiry: Inquiry, receivedAt: Date = new Date()): Promise<NotifyResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.info("inquiry notification skipped: RESEND_API_KEY not set");
    return { skipped: true };
  }

  const from = process.env.INQUIRY_NOTIFY_FROM?.trim() || DEFAULT_FROM;
  const to = (process.env.INQUIRY_NOTIFY_TO?.trim() || site.email)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        subject: SUBJECT,
        text: buildText(inquiry, receivedAt),
        // The address was validated by the zod schema (lib/schema.ts) before the insert.
        reply_to: inquiry.email,
      }),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("inquiry notification failed", { status: res.status });
      return { failed: true, status: res.status };
    }
    return { sent: true };
  } catch (err) {
    const name = err instanceof Error ? err.name : "UnknownError";
    console.error("inquiry notification failed", { error: name === "AbortError" ? "timeout" : name });
    return { failed: true };
  } finally {
    clearTimeout(timer);
  }
}
