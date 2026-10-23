import { z } from "zod";

/**
 * Demo request schema, shared by the client form (instant feedback) and the
 * server action (source of truth). Limits mirror the `waitlist` table constraints.
 */

export const DEMO_LIMITS = {
  email: 255,
  company: 120,
  role: 120,
  message: 2000,
} as const;

/** Minimum time between form render and submit. Faster than this is treated as automated. */
export const MIN_FILL_MS = 2500;

/** Optional free text: trimmed, length-capped, and stored as null when empty. */
const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max.toLocaleString("en-US")} characters or fewer.`)
    .nullish()
    .transform((value) => (value ? value : null));

export const demoRequestSchema = z.object({
  email: z
    .string({ error: "Enter your work email." })
    .trim()
    .toLowerCase()
    .min(1, "Enter your work email.")
    .max(DEMO_LIMITS.email, `Email must be ${DEMO_LIMITS.email} characters or fewer.`)
    .pipe(z.email("Enter a valid email address, like name@company.com.")),
  company: optionalText(DEMO_LIMITS.company, "Company"),
  role: optionalText(DEMO_LIMITS.role, "Role"),
  message: optionalText(DEMO_LIMITS.message, "Message"),
});

export type DemoRequest = z.output<typeof demoRequestSchema>;
export type DemoField = keyof DemoRequest;
export const DEMO_FIELDS = ["email", "company", "role", "message"] as const satisfies readonly DemoField[];

export type DemoFieldErrors = Partial<Record<DemoField, string>>;

/** Raw values echoed back so the form can repopulate after a failed submit. */
export type DemoValues = Partial<Record<DemoField, string>>;

export type DemoStatus = "idle" | "success" | "duplicate" | "error" | "invalid";

export type DemoFormState = {
  status: DemoStatus;
  message?: string;
  fieldErrors?: DemoFieldErrors;
  values?: DemoValues;
};

export const initialDemoState: DemoFormState = { status: "idle" };

/** First error message per field, in a shape the form can render directly. */
export function toFieldErrors(error: z.ZodError): DemoFieldErrors {
  const flat = z.flattenError(error).fieldErrors as Partial<Record<string, string[]>>;
  const out: DemoFieldErrors = {};
  for (const field of DEMO_FIELDS) {
    const first = flat[field]?.[0];
    if (first) out[field] = first;
  }
  return out;
}
