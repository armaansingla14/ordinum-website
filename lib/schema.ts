import { z } from "zod";
import { REQUEST_TYPES, TECHNOLOGY_CATEGORIES, type RequestType, type TechnologyCategory } from "@/lib/content";

/**
 * Contact form ("Send an inquiry") schema, shared by the client form (instant feedback)
 * and the server action (source of truth). Limits mirror the `public.inquiries` table
 * constraints (supabase/migrations/20261024000000_inquiries.sql).
 */

export const INQUIRY_LIMITS = {
  email: 255,
  company: 120,
  workingOn: 500,
  message: 2000,
  technologyCategory: 80,
  requestType: 60,
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

export const inquirySchema = z.object({
  email: z
    .string({ error: "Enter your work email." })
    .trim()
    .toLowerCase()
    .min(1, "Enter your work email.")
    .max(INQUIRY_LIMITS.email, `Email must be ${INQUIRY_LIMITS.email} characters or fewer.`)
    .pipe(z.email("Enter a valid email address, like name@company.com.")),
  company: optionalText(INQUIRY_LIMITS.company, "Company"),
  workingOn: optionalText(INQUIRY_LIMITS.workingOn, "This answer"),
  message: optionalText(INQUIRY_LIMITS.message, "Message"),
  technologyCategory: optionalChoice(TECHNOLOGY_CATEGORY_VALUES, "Choose a category from the list."),
  requestType: optionalChoice(REQUEST_TYPE_VALUES, "Choose a request type from the list."),
});

export type Inquiry = z.output<typeof inquirySchema>;
export type InquiryField = keyof Inquiry;

/** Form field names, in visual (and focus) order. The last two sit inside "More details". */
export const INQUIRY_FIELDS = [
  "email",
  "company",
  "workingOn",
  "message",
  "technologyCategory",
  "requestType",
] as const satisfies readonly InquiryField[];

/** Fields rendered inside the collapsed "More details (optional)" disclosure. */
export const INQUIRY_DETAIL_FIELDS = ["technologyCategory", "requestType"] as const satisfies readonly InquiryField[];

/** Upper bound on raw text read from FormData before validation (longer input is cut, then rejected by max). */
export const RAW_FIELD_CAP = 4000;

export type InquiryFieldErrors = Partial<Record<InquiryField, string>>;

/** Raw values echoed back so the form can repopulate after a failed submit. */
export type InquiryValues = Partial<Record<InquiryField, string>>;

/**
 * idle: nothing submitted yet. success: the row is stored. rateLimited: the database refused
 * the row (5 or more inquiries from this email in the last hour). invalid: field errors.
 * error: anything else (nothing stored).
 */
export type InquiryStatus = "idle" | "success" | "rateLimited" | "error" | "invalid";

export type InquiryFormState = {
  status: InquiryStatus;
  message?: string;
  fieldErrors?: InquiryFieldErrors;
  values?: InquiryValues;
};

export const initialInquiryState: InquiryFormState = { status: "idle" };

/** Build the schema input from FormData-like raw values (shared by client and server). */
export function toSchemaInput(read: (field: InquiryField) => string | null | undefined) {
  return Object.fromEntries(INQUIRY_FIELDS.map((f) => [f, read(f) ?? (f === "email" ? "" : null)])) as Record<
    InquiryField,
    string | null
  >;
}

/** First error message per field, in a shape the form can render directly. */
export function toFieldErrors(error: z.ZodError): InquiryFieldErrors {
  const flat = z.flattenError(error).fieldErrors as Partial<Record<string, string[]>>;
  const out: InquiryFieldErrors = {};
  for (const field of INQUIRY_FIELDS) {
    const first = flat[field]?.[0];
    if (first) out[field] = first;
  }
  return out;
}
