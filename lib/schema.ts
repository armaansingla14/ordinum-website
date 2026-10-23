import { z } from "zod";
import { REQUEST_TYPES, TECHNOLOGY_CATEGORIES, type RequestType, type TechnologyCategory } from "@/lib/content";

/**
 * Contact form schema, shared by the client form (instant feedback) and the
 * server action (source of truth). Limits mirror the `waitlist` table constraints
 * (see supabase/migrations/*_waitlist_role_message.sql and *_contact_form_fields.sql).
 */

export const DEMO_LIMITS = {
  email: 255,
  company: 120,
  role: 120,
  technologyCategory: 80,
  requestType: 60,
  hardestFailure: 2000,
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

/**
 * Optional select: only values from the allowlist in lib/content.ts are accepted.
 * An empty string (the placeholder option) or a missing field is stored as null.
 */
function optionalChoice<const T extends string>(allowed: readonly T[], message: string) {
  const set: ReadonlySet<string> = new Set(allowed);
  return z
    .string()
    .trim()
    .nullish()
    .refine((value) => !value || set.has(value), { message })
    .transform((value) => (value ? (value as T) : null));
}

const REQUEST_TYPE_VALUES = REQUEST_TYPES.map((t) => t.value) satisfies readonly RequestType[];
const TECHNOLOGY_CATEGORY_VALUES = TECHNOLOGY_CATEGORIES.map((c) => c.value) satisfies readonly TechnologyCategory[];

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
  technologyCategory: optionalChoice(TECHNOLOGY_CATEGORY_VALUES, "Choose a category from the list."),
  requestType: optionalChoice(REQUEST_TYPE_VALUES, "Choose a request type from the list."),
  hardestFailure: optionalText(DEMO_LIMITS.hardestFailure, "This answer"),
  message: optionalText(DEMO_LIMITS.message, "Message"),
});

export type DemoRequest = z.output<typeof demoRequestSchema>;
export type DemoField = keyof DemoRequest;

/** Form field names, in visual (and focus) order. */
export const DEMO_FIELDS = [
  "email",
  "company",
  "role",
  "technologyCategory",
  "requestType",
  "hardestFailure",
  "message",
] as const satisfies readonly DemoField[];

/** Upper bound on raw text read from FormData before validation (longer input is cut, then rejected by max). */
export const RAW_FIELD_CAP = 4000;

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

/** Build the schema input from FormData-like raw values (shared by client and server). */
export function toSchemaInput(read: (field: DemoField) => string | null | undefined) {
  return Object.fromEntries(DEMO_FIELDS.map((f) => [f, read(f) ?? (f === "email" ? "" : null)])) as Record<
    DemoField,
    string | null
  >;
}

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
