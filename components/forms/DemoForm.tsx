"use client";

import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useFormStatus } from "react-dom";
import { submitInquiry } from "@/app/actions/request-demo";
import Button from "@/components/ui/Button";
import { contact, site } from "@/lib/content";
import { cn } from "@/lib/cn";
import {
  INQUIRY_DETAIL_FIELDS,
  INQUIRY_FIELDS,
  INQUIRY_LIMITS,
  initialInquiryState,
  inquirySchema,
  toFieldErrors,
  toSchemaInput,
  type InquiryField,
  type InquiryFieldErrors,
  type InquiryFormState,
} from "@/lib/schema";

const { form: copy } = contact;

/* -------------------------------------------------------------------------- */
/* Field styling (dark ink panel on the sage band)                             */
/* -------------------------------------------------------------------------- */

const controlClass =
  // 16px below sm so iOS Safari does not zoom on focus. Border #5a7268 is ~3:1 on the ink panel (WCAG 1.4.11).
  "mt-2.5 block w-full rounded-none border border-[#5a7268] bg-[#0f1f1b] px-4 py-[13px] text-[16px] leading-[1.5] sm:text-[15px] " +
  "tracking-[-0.01em] text-[#f0f5ec] placeholder:text-[#7d958a] transition-[border-color,background-color] duration-200 " +
  "hover:border-[#7a9488] focus:border-lime focus:bg-[#10221d] " +
  "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-lime " +
  "aria-[invalid=true]:border-orange disabled:opacity-60";

type FieldShellProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  /** Replaces the default "Optional" tag on the right of the label row. */
  aside?: ReactNode;
  /** Helper line under the label (give it the id `${id}-hint` and reference it in aria-describedby). */
  hint?: string;
  className?: string;
  children: ReactNode;
};

function FieldShell({ id, label, required, error, aside, hint, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="label-mono leading-[1.5] text-[#b4c7bb]">
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-lime">
              *
            </span>
          )}
          {required && <span className="sr-only"> (required)</span>}
        </label>
        {aside ??
          (!required && (
            <span className="label-mono shrink-0 text-[10px] text-[#7d958a]">
              {copy.optional}
            </span>
          ))}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] leading-[1.5] text-[#8fa699]">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex gap-2 text-[13px] leading-[1.5] text-orange">
          <span aria-hidden="true" className="font-mono">
            !
          </span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Submit button (needs useFormStatus, so it lives inside the <form>)          */
/* -------------------------------------------------------------------------- */

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="primary"
      // aria-disabled (not disabled) so focus stays on the button while the request is pending.
      aria-disabled={pending}
      onClick={(e) => {
        if (pending) e.preventDefault();
      }}
      icon={pending ? <PendingDots /> : "→"}
      className="w-full focus-visible:outline-lime sm:w-auto sm:min-w-[232px] sm:justify-between"
    >
      {pending ? copy.pending : copy.submit}
    </Button>
  );
}

function PendingDots() {
  return (
    <span className="inline-flex gap-[3px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-[3px] animate-pulse bg-current motion-reduce:animate-none"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Confirmation (replaces the form once the inquiry is stored)                 */
/* -------------------------------------------------------------------------- */

function Confirmation({ state }: { state: InquiryFormState }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex min-h-[380px] flex-col justify-between gap-12 p-6 md:p-9">
      <div>
        <svg aria-hidden="true" viewBox="0 0 40 40" className="size-10 text-lime" fill="none">
          <rect x="0.5" y="0.5" width="39" height="39" stroke="currentColor" strokeOpacity="0.45" />
          <path d="M12 20.5l5.5 5.5L28.5 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
        </svg>
        <p className="label-mono mt-8 text-lime">{copy.successKicker}</p>
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 max-w-[26ch] text-[clamp(24px,2.6vw,32px)] font-semibold leading-[1.18] tracking-title text-[#f0f5ec] focus:outline-none"
        >
          {state.message ?? copy.messages.success}
        </h3>
        <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.75] text-[#a9bdb1]">
          {copy.successFollowUp}
        </p>
      </div>
      <div className="flex flex-col gap-5 border-t border-[#23352e] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          href={contact.talk.calCta.href}
          variant="secondary"
          size="sm"
          className="border-[#4a6157] focus-visible:outline-lime"
        >
          {contact.talk.calCta.label}
        </Button>
        <a
          href={`mailto:${site.email}`}
          className="break-all font-mono text-[12px] tracking-[0.02em] text-[#a9bdb1] underline decoration-[#41584e] underline-offset-4 transition-colors hover:text-lime hover:decoration-lime focus-visible:outline-lime"
        >
          {site.email}
        </a>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Form                                                                        */
/* -------------------------------------------------------------------------- */

/** Focus a field, opening the "More details" disclosure first if the field lives inside it. */
function focusField(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const details = el.closest("details");
  if (details && !details.open) details.open = true;
  el.focus();
}

/**
 * "Send an inquiry" form. Progressive enhancement: it posts to the server action without
 * JavaScript; with JavaScript it validates inline, shows a pending state, and swaps to a
 * confirmation only after the server reports a stored submission.
 *
 * Visible fields: work email (required), company, what you are working on, message.
 * Technology category and request type sit in a closed <details> ("More details (optional)").
 */
export default function DemoForm({ className }: { className?: string }) {
  const [state, formAction, isPending] = useActionState(submitInquiry, initialInquiryState);
  const uid = useId();
  const ids = Object.fromEntries(INQUIRY_FIELDS.map((f) => [f, `${uid}-${f}`])) as Record<InquiryField, string>;
  const noticeId = `${uid}-notice`;

  // Client-side validation errors take precedence until the next server response.
  const [clientErrors, setClientErrors] = useState<InquiryFieldErrors | null>(null);
  // Fields the visitor has edited since the last validation (their error is hidden).
  const [edited, setEdited] = useState<ReadonlySet<InquiryField>>(new Set());
  // Bumped on every new server state so uncontrolled fields remount with echoed values.
  const [version, setVersion] = useState(0);
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    setClientErrors(null);
    setEdited(new Set());
    setVersion((v) => v + 1);
  }

  // Render timestamp for the minimum-fill-time check (client clock, set after hydration).
  const [startedAt, setStartedAt] = useState("");
  useEffect(() => {
    setStartedAt(String(Date.now()));
  }, []);

  const rawErrors = clientErrors ?? state.fieldErrors ?? {};
  const errors: InquiryFieldErrors = {};
  for (const f of INQUIRY_FIELDS) if (rawErrors[f] && !edited.has(f)) errors[f] = rawErrors[f];

  // Move focus to the first invalid field after a server-side validation failure.
  useEffect(() => {
    if (state.status !== "invalid" || !state.fieldErrors) return;
    const first = INQUIRY_FIELDS.find((f) => state.fieldErrors?.[f]);
    if (first) focusField(ids[first]);
    // ids are stable for the component's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    const result = inquirySchema.safeParse(
      toSchemaInput((f) => {
        const v = data.get(f);
        return typeof v === "string" ? v : null;
      }),
    );
    setEdited(new Set());
    if (result.success) {
      setClientErrors(null);
      return;
    }
    event.preventDefault();
    const next = toFieldErrors(result.error);
    setClientErrors(next);
    const first = INQUIRY_FIELDS.find((f) => next[f]);
    if (first) focusField(ids[first]);
  }

  function handleChange(event: ChangeEvent<HTMLFormElement>) {
    const name = (event.target as { name?: string }).name as InquiryField | undefined;
    if (name && (INQUIRY_FIELDS as readonly string[]).includes(name) && rawErrors[name] && !edited.has(name)) {
      setEdited((prev) => new Set(prev).add(name));
    }
  }

  const done = state.status === "success";

  let statusMessage = "";
  if (!done) {
    if (clientErrors && Object.keys(errors).length > 0) statusMessage = copy.messages.invalid;
    else if (!clientErrors && (state.status === "error" || state.status === "invalid" || state.status === "rateLimited")) {
      statusMessage = state.message ?? copy.messages.error;
    }
  }

  const describedBy = (f: InquiryField, ...extra: (string | null | undefined)[]) =>
    [errors[f] ? `${ids[f]}-error` : null, ...extra].filter(Boolean).join(" ") || undefined;

  const values = state.values ?? {};
  // Server-rendered open state (works without JS): open when a detail field has a value or an error.
  const detailsOpen = INQUIRY_DETAIL_FIELDS.some((f) => values[f] || errors[f]);

  return (
    <div
      id={copy.anchorId}
      className={cn(
        "relative scroll-mt-[88px] border border-sage-ink bg-sage-ink text-[#f0f5ec] shadow-[0_40px_90px_-40px_rgba(11,23,20,0.65)]",
        className,
      )}
    >
      {/* Window bar */}
      <div className="flex min-h-[47px] flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-[#23352e] px-5 py-2 md:px-6">
        <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-[#b4c7bb]">
          <span aria-hidden="true" className="size-[6px] bg-lime" />
          Inquiry
          <span aria-hidden="true" className="hidden text-[#5a7268] sm:inline">
            /
          </span>
          <span className="hidden sm:inline">Ordinum</span>
        </p>
        {!done && (
          <p className="font-mono text-[10px] whitespace-nowrap uppercase tracking-[0.13em] text-[#7d958a]">
            <span aria-hidden="true" className="text-lime">
              *
            </span>{" "}
            Required
          </p>
        )}
      </div>

      {done ? (
        // Focus moves to the confirmation heading, which announces it.
        <Confirmation state={state} />
      ) : (
        <form
          action={formAction}
          onSubmit={handleSubmit}
          onChange={handleChange}
          noValidate
          aria-busy={isPending}
          aria-label="Send an inquiry"
          className="p-6 md:p-9"
        >
          <div key={version} className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
            <FieldShell id={ids.email} label={copy.emailLabel} required error={errors.email}>
              <input
                id={ids.email}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                autoCapitalize="none"
                required
                maxLength={INQUIRY_LIMITS.email}
                placeholder="name@company.com"
                defaultValue={values.email}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describedBy("email")}
                className={controlClass}
              />
            </FieldShell>

            <FieldShell id={ids.company} label={copy.companyLabel} error={errors.company}>
              <input
                id={ids.company}
                name="company"
                type="text"
                autoComplete="organization"
                maxLength={INQUIRY_LIMITS.company}
                defaultValue={values.company}
                aria-invalid={errors.company ? true : undefined}
                aria-describedby={describedBy("company")}
                className={controlClass}
              />
            </FieldShell>

            <TextareaField
              id={ids.workingOn}
              name="workingOn"
              label={copy.workingOnLabel}
              hint={copy.workingOnHint}
              max={INQUIRY_LIMITS.workingOn}
              singleLine
              rows={1}
              error={errors.workingOn}
              defaultValue={values.workingOn}
              describedBy={(countId) => describedBy("workingOn", `${ids.workingOn}-hint`, noticeId, countId)}
            />

            <TextareaField
              id={ids.message}
              name="message"
              label={copy.messageLabel}
              max={INQUIRY_LIMITS.message}
              rows={3}
              error={errors.message}
              defaultValue={values.message}
              describedBy={(countId) => describedBy("message", noticeId, countId)}
            />

            <details open={detailsOpen || undefined} className="group/details w-full border-y border-[#23352e] sm:col-span-2">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 font-mono text-[11px] uppercase tracking-[0.13em] text-[#b4c7bb] transition-colors hover:text-[#f0f5ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime [&::-webkit-details-marker]:hidden">
                {copy.moreDetails.summary}
                <span
                  aria-hidden="true"
                  className="text-[14px] leading-none text-lime transition-transform duration-200 group-open/details:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <div className="grid gap-x-5 gap-y-6 pb-6 pt-3 sm:grid-cols-2">
                <SelectField
                  id={ids.technologyCategory}
                  name="technologyCategory"
                  label={copy.moreDetails.technologyCategoryLabel}
                  placeholder={copy.moreDetails.technologyCategoryPlaceholder}
                  options={copy.technologyCategories}
                  defaultValue={values.technologyCategory}
                  error={errors.technologyCategory}
                  describedBy={describedBy("technologyCategory")}
                />
                <SelectField
                  id={ids.requestType}
                  name="requestType"
                  label={copy.moreDetails.requestTypeLabel}
                  placeholder={copy.moreDetails.requestTypePlaceholder}
                  options={copy.requestTypes}
                  defaultValue={values.requestType}
                  error={errors.requestType}
                  describedBy={describedBy("requestType")}
                />
              </div>
            </details>

            {/* One notice block, read before Send: what not to include, and how submissions are handled. */}
            <div className="space-y-2 border-l border-[#5a7268] py-0.5 pl-4 text-[13px] leading-[1.6] text-[#a9bdb1] sm:col-span-2">
              <p id={noticeId}>{copy.confidentialityWarning}</p>
              <p>
                {copy.privacy.text}{" "}
                <a
                  href={copy.privacy.link.href}
                  className="text-[#f0f5ec] underline decoration-[#5a7268] underline-offset-4 transition-colors hover:text-lime hover:decoration-lime focus-visible:outline-lime"
                >
                  {copy.privacy.link.label}
                </a>
                .
              </p>
            </div>
          </div>

          {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
          <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
            <label htmlFor={`${uid}-website`}>Website (leave empty)</label>
            <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>
          <input type="hidden" name="startedAt" value={startedAt} />

          <div className="mt-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SubmitButton />
              <p
                role="status"
                aria-live="polite"
                className={cn(
                  "min-h-[1.5em] text-[13px] leading-[1.55] sm:max-w-[52%] sm:text-right",
                  statusMessage ? "text-orange" : "text-[#7d958a]",
                )}
              >
                {statusMessage}
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Select and textarea fields                                                  */
/* -------------------------------------------------------------------------- */

function SelectField({
  id,
  name,
  label,
  placeholder,
  options,
  defaultValue,
  error,
  describedBy,
}: {
  id: string;
  name: InquiryField;
  label: string;
  placeholder: string;
  options: readonly { value: string; label: string }[];
  defaultValue?: string;
  error?: string;
  describedBy?: string;
}) {
  // Echoed values that are not in the list (tampered input) fall back to the placeholder.
  const initial = defaultValue && options.some((o) => o.value === defaultValue) ? defaultValue : "";
  return (
    <FieldShell id={id} label={label} error={error}>
      <div className="relative">
        <select
          id={id}
          name={name}
          defaultValue={initial}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            controlClass,
            "cursor-pointer appearance-none pr-11 [&:has(option[value='']:checked)]:text-[#7d958a]",
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#0f1f1b] text-[#f0f5ec]">
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 10 6"
          className="pointer-events-none absolute right-4 top-1/2 mt-[5px] h-[6px] w-[10px] -translate-y-1/2 text-[#b4c7bb]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      </div>
    </FieldShell>
  );
}

function TextareaField({
  id,
  name,
  label,
  hint,
  max,
  rows,
  singleLine = false,
  error,
  defaultValue,
  describedBy,
}: {
  id: string;
  name: InquiryField;
  label: string;
  hint?: string;
  max: number;
  rows: number;
  /** Render a one-line input (same name, limit and counter) instead of a textarea. */
  singleLine?: boolean;
  error?: string;
  defaultValue?: string;
  describedBy: (countId: string) => string | undefined;
}) {
  const [count, setCount] = useState(defaultValue?.length ?? 0);
  const countId = `${id}-count`;
  const over = count > max;

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      className="sm:col-span-2"
      aside={
        <span
          id={countId}
          className={cn("label-mono shrink-0 whitespace-nowrap text-[10px] tabular-nums", over ? "text-orange" : "text-[#7d958a]")}
        >
          {copy.optional}
          {/* The counter appears once typing starts. */}
          {count > 0 && (
            <>
              {" · "}
              {count.toLocaleString("en-US")} / {max.toLocaleString("en-US")}
              <span className="sr-only"> characters</span>
            </>
          )}
        </span>
      }
    >
      {singleLine ? (
        <input
          id={id}
          name={name}
          type="text"
          maxLength={max}
          defaultValue={defaultValue}
          onInput={(e) => setCount(e.currentTarget.value.length)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(countId)}
          className={controlClass}
        />
      ) : (
        <textarea
          id={id}
          name={name}
          rows={rows}
          maxLength={max}
          defaultValue={defaultValue}
          onInput={(e) => setCount(e.currentTarget.value.length)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(countId)}
          className={cn(controlClass, "min-h-[108px] resize-y")}
        />
      )}
    </FieldShell>
  );
}
