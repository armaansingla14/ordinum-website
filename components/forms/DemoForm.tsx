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
import { requestDemo } from "@/app/actions/request-demo";
import Button from "@/components/ui/Button";
import { cta, site } from "@/lib/content";
import { cn } from "@/lib/cn";
import {
  DEMO_FIELDS,
  DEMO_LIMITS,
  demoRequestSchema,
  initialDemoState,
  toFieldErrors,
  toSchemaInput,
  type DemoField,
  type DemoFieldErrors,
  type DemoFormState,
} from "@/lib/schema";

const { form: copy } = cta;

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
/* Confirmation (replaces the form on success / duplicate)                    */
/* -------------------------------------------------------------------------- */

function Confirmation({ state }: { state: DemoFormState }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const duplicate = state.status === "duplicate";

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex min-h-[420px] flex-col justify-between gap-12 p-6 md:p-9">
      <div>
        <svg aria-hidden="true" viewBox="0 0 40 40" className="size-10 text-lime" fill="none">
          <rect x="0.5" y="0.5" width="39" height="39" stroke="currentColor" strokeOpacity="0.45" />
          {duplicate ? (
            // Neutral "already have it" mark: not a failure, not a new submission.
            <path d="M12 16.5h16M12 23.5h16" stroke="currentColor" strokeWidth="1.6" />
          ) : (
            <path d="M12 20.5l5.5 5.5L28.5 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
          )}
        </svg>
        <p className="label-mono mt-8 text-lime">{duplicate ? "Already received" : "Message received"}</p>
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 max-w-[26ch] text-[clamp(24px,2.6vw,32px)] font-semibold leading-[1.18] tracking-title text-[#f0f5ec] focus:outline-none"
        >
          {state.message ?? (duplicate ? copy.duplicate : copy.success)}
        </h3>
        <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.75] text-[#a9bdb1]">
          If you would rather talk now, pick a time that works for you.
        </p>
      </div>
      <div className="flex flex-col gap-5 border-t border-[#23352e] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          href={cta.bookCall.href}
          variant="secondary"
          size="sm"
          className="border-[#4a6157] focus-visible:outline-lime"
        >
          {cta.bookCall.label}
        </Button>
        <a
          href={`mailto:${site.email}`}
          className="font-mono text-[12px] tracking-[0.02em] text-[#a9bdb1] underline decoration-[#41584e] underline-offset-4 transition-colors hover:text-lime hover:decoration-lime focus-visible:outline-lime"
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

/**
 * Contact form. Progressive enhancement: it posts to the server action without
 * JavaScript; with JavaScript it validates inline, shows a pending state, and swaps
 * to a confirmation only after the server reports a stored submission.
 */
export default function DemoForm({ className }: { className?: string }) {
  const [state, formAction, isPending] = useActionState(requestDemo, initialDemoState);
  const uid = useId();
  const ids = Object.fromEntries(DEMO_FIELDS.map((f) => [f, `${uid}-${f}`])) as Record<DemoField, string>;
  const privacyId = `${uid}-privacy`;

  // Client-side validation errors take precedence until the next server response.
  const [clientErrors, setClientErrors] = useState<DemoFieldErrors | null>(null);
  // Fields the visitor has edited since the last validation (their error is hidden).
  const [edited, setEdited] = useState<ReadonlySet<DemoField>>(new Set());
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
  const errors: DemoFieldErrors = {};
  for (const f of DEMO_FIELDS) if (rawErrors[f] && !edited.has(f)) errors[f] = rawErrors[f];

  // Move focus to the first invalid field after a server-side validation failure.
  useEffect(() => {
    if (state.status !== "invalid" || !state.fieldErrors) return;
    const first = DEMO_FIELDS.find((f) => state.fieldErrors?.[f]);
    if (first) document.getElementById(ids[first])?.focus();
    // ids are stable for the component's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    const result = demoRequestSchema.safeParse(
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
    const first = DEMO_FIELDS.find((f) => next[f]);
    if (first) document.getElementById(ids[first])?.focus();
  }

  function handleChange(event: ChangeEvent<HTMLFormElement>) {
    const name = (event.target as { name?: string }).name as DemoField | undefined;
    if (name && (DEMO_FIELDS as readonly string[]).includes(name) && rawErrors[name] && !edited.has(name)) {
      setEdited((prev) => new Set(prev).add(name));
    }
  }

  const done = state.status === "success" || state.status === "duplicate";

  let statusMessage = "";
  if (!done) {
    if (clientErrors && Object.keys(errors).length > 0) statusMessage = copy.invalid;
    else if (!clientErrors && (state.status === "error" || state.status === "invalid")) {
      statusMessage = state.message ?? copy.invalid;
    }
  }

  const describedBy = (f: DemoField, ...extra: (string | null | undefined)[]) =>
    [errors[f] ? `${ids[f]}-error` : null, ...extra].filter(Boolean).join(" ") || undefined;

  const values = state.values ?? {};

  return (
    <div
      id={copy.anchorId}
      className={cn(
        "relative border border-sage-ink bg-sage-ink text-[#f0f5ec] shadow-[0_40px_90px_-40px_rgba(11,23,20,0.65)]",
        className,
      )}
    >
      {/* Window bar */}
      <div className="flex h-[47px] items-center justify-between gap-4 border-b border-[#23352e] px-5 md:px-6">
        <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-[#b4c7bb]">
          <span aria-hidden="true" className="size-[6px] bg-lime" />
          Contact <span aria-hidden="true" className="text-[#5a7268]">/</span> Ordinum
        </p>
        {!done && (
          <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#7d958a]">
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
          aria-label="Contact Ordinum"
          className="p-6 md:p-9"
        >
          <div key={version} className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
            <FieldShell id={ids.email} label={copy.emailLabel} required error={errors.email} className="sm:col-span-2">
              <input
                id={ids.email}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                autoCapitalize="none"
                required
                maxLength={DEMO_LIMITS.email}
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
                maxLength={DEMO_LIMITS.company}
                defaultValue={values.company}
                aria-invalid={errors.company ? true : undefined}
                aria-describedby={describedBy("company")}
                className={controlClass}
              />
            </FieldShell>

            <FieldShell id={ids.role} label={copy.roleLabel} error={errors.role}>
              <input
                id={ids.role}
                name="role"
                type="text"
                autoComplete="organization-title"
                maxLength={DEMO_LIMITS.role}
                defaultValue={values.role}
                aria-invalid={errors.role ? true : undefined}
                aria-describedby={describedBy("role")}
                className={controlClass}
              />
            </FieldShell>

            <SelectField
              id={ids.technologyCategory}
              name="technologyCategory"
              label={copy.technologyCategoryLabel}
              placeholder={copy.technologyCategoryPlaceholder}
              options={copy.technologyCategories}
              defaultValue={values.technologyCategory}
              error={errors.technologyCategory}
              describedBy={describedBy("technologyCategory")}
            />

            <SelectField
              id={ids.requestType}
              name="requestType"
              label={copy.requestTypeLabel}
              placeholder={copy.requestTypePlaceholder}
              options={copy.requestTypes}
              defaultValue={values.requestType}
              error={errors.requestType}
              describedBy={describedBy("requestType")}
            />

            {/* Shown before the free-text fields so it is read before anyone types details. */}
            <p
              id={privacyId}
              className="border-l border-[#5a7268] py-0.5 pl-4 text-[13px] leading-[1.6] text-[#a9bdb1] sm:col-span-2"
            >
              {copy.confidentialityWarning}
            </p>

            <TextareaField
              id={ids.hardestFailure}
              name="hardestFailure"
              label={copy.hardestFailureLabel}
              hint={copy.hardestFailureHint}
              max={DEMO_LIMITS.hardestFailure}
              rows={3}
              error={errors.hardestFailure}
              defaultValue={values.hardestFailure}
              describedBy={(countId) => describedBy("hardestFailure", `${ids.hardestFailure}-hint`, privacyId, countId)}
            />

            <TextareaField
              id={ids.message}
              name="message"
              label={copy.messageLabel}
              max={DEMO_LIMITS.message}
              rows={3}
              error={errors.message}
              defaultValue={values.message}
              describedBy={(countId) => describedBy("message", privacyId, countId)}
            />
          </div>

          {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
          <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
            <label htmlFor={`${uid}-website`}>Website (leave empty)</label>
            <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>
          <input type="hidden" name="startedAt" value={startedAt} />

          <div className="mt-8 border-t border-[#23352e] pt-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SubmitButton />
              <p
                role="status"
                aria-live="polite"
                className={cn(
                  "min-h-[1.5em] text-[13px] leading-[1.55] sm:max-w-[46%] sm:text-right",
                  statusMessage ? "text-orange" : "text-[#7d958a]",
                )}
              >
                {statusMessage}
              </p>
            </div>
            <p className="mt-5 font-mono text-[11px] leading-[1.7] tracking-[0.02em] text-[#8fa699]">{copy.dataNote}</p>
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
  name: DemoField;
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
  error,
  defaultValue,
  describedBy,
}: {
  id: string;
  name: DemoField;
  label: string;
  hint?: string;
  max: number;
  rows: number;
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
          <span className="sr-only">{copy.optional}. </span>
          <span aria-hidden="true" className="hidden sm:inline">
            {copy.optional} ·{" "}
          </span>
          {count.toLocaleString("en-US")} / {max.toLocaleString("en-US")}
          <span className="sr-only"> characters</span>
        </span>
      }
    >
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
    </FieldShell>
  );
}
