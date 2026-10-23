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
  type DemoField,
  type DemoFieldErrors,
  type DemoFormState,
} from "@/lib/schema";

const INVALID_MESSAGE = cta.form.invalid;

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
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
};

function FieldShell({ id, label, required, error, hint, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="label-mono text-[#b4c7bb]">
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-lime">
              *
            </span>
          )}
          {required && <span className="sr-only"> (required)</span>}
        </label>
        {hint ?? (!required && <span className="label-mono text-[10px] text-[#7d958a]">Optional</span>)}
      </div>
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
      {pending ? "Sending" : cta.form.submit}
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
          <path d="M12 20.5l5.5 5.5L28.5 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
        </svg>
        <p className="label-mono mt-8 text-lime">{duplicate ? "Already on the list" : "Request received"}</p>
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 max-w-[22ch] text-[clamp(28px,3vw,38px)] font-semibold leading-[1.12] tracking-title text-[#f0f5ec] focus:outline-none"
        >
          {state.message ?? (duplicate ? cta.form.duplicate : cta.form.success)}
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
 * Demo request form. Progressive enhancement: it posts to the server action without
 * JavaScript; with JavaScript it validates inline, shows a pending state, and swaps
 * to a confirmation on success.
 */
export default function DemoForm({ className }: { className?: string }) {
  const [state, formAction, isPending] = useActionState(requestDemo, initialDemoState);
  const uid = useId();
  const ids = Object.fromEntries(DEMO_FIELDS.map((f) => [f, `${uid}-${f}`])) as Record<DemoField, string>;

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
    const result = demoRequestSchema.safeParse({
      email: data.get("email") ?? "",
      company: data.get("company"),
      role: data.get("role"),
      message: data.get("message"),
    });
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
    if (clientErrors && Object.keys(errors).length > 0) statusMessage = INVALID_MESSAGE;
    else if (!clientErrors && (state.status === "error" || state.status === "invalid")) {
      statusMessage = state.message ?? INVALID_MESSAGE;
    }
  }

  const describedBy = (f: DemoField, extra?: string) =>
    [errors[f] ? `${ids[f]}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  const values = state.values ?? {};

  return (
    <div
      className={cn(
        "relative border border-sage-ink bg-sage-ink text-[#f0f5ec] shadow-[0_40px_90px_-40px_rgba(11,23,20,0.65)]",
        className,
      )}
    >
      {/* Window bar */}
      <div className="flex h-[47px] items-center justify-between gap-4 border-b border-[#23352e] px-5 md:px-6">
        <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-[#b4c7bb]">
          <span aria-hidden="true" className="size-[6px] bg-lime" />
          Request / Demo
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
        <Confirmation state={state} />
      ) : (
        <form
          action={formAction}
          onSubmit={handleSubmit}
          onChange={handleChange}
          noValidate
          aria-busy={isPending}
          aria-label="Request a demo"
          className="p-6 md:p-9"
        >
          <div key={version} className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
            <FieldShell id={ids.email} label={cta.form.emailLabel} required error={errors.email} className="sm:col-span-2">
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

            <FieldShell id={ids.company} label={cta.form.companyLabel} error={errors.company}>
              <input
                id={ids.company}
                name="company"
                type="text"
                autoComplete="organization"
                maxLength={DEMO_LIMITS.company}
                placeholder="Company or lab"
                defaultValue={values.company}
                aria-invalid={errors.company ? true : undefined}
                aria-describedby={describedBy("company")}
                className={controlClass}
              />
            </FieldShell>

            <FieldShell id={ids.role} label={cta.form.roleLabel} error={errors.role}>
              <input
                id={ids.role}
                name="role"
                type="text"
                autoComplete="organization-title"
                maxLength={DEMO_LIMITS.role}
                placeholder="e.g. Autonomy engineer"
                defaultValue={values.role}
                aria-invalid={errors.role ? true : undefined}
                aria-describedby={describedBy("role")}
                className={controlClass}
              />
            </FieldShell>

            <MessageField
              id={ids.message}
              label={cta.form.messageLabel}
              error={errors.message}
              defaultValue={values.message}
              describedBy={describedBy}
            />
          </div>

          {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
          <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
            <label htmlFor={`${uid}-website`}>Website (leave empty)</label>
            <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>
          <input type="hidden" name="startedAt" value={startedAt} />

          <div className="mt-8 flex flex-col gap-4 border-t border-[#23352e] pt-7 sm:flex-row sm:items-center sm:justify-between">
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
        </form>
      )}
    </div>
  );
}

function MessageField({
  id,
  label,
  error,
  defaultValue,
  describedBy,
}: {
  id: string;
  label: string;
  error?: string;
  defaultValue?: string;
  describedBy: (f: DemoField, extra?: string) => string | undefined;
}) {
  const [count, setCount] = useState(defaultValue?.length ?? 0);
  const countId = `${id}-count`;
  const over = count > DEMO_LIMITS.message;

  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      className="sm:col-span-2"
      hint={
        <span
          id={countId}
          className={cn("label-mono shrink-0 whitespace-nowrap text-[10px] tabular-nums", over ? "text-orange" : "text-[#7d958a]")}
        >
          <span className="sr-only">Optional. </span>
          <span aria-hidden="true" className="hidden sm:inline">
            Optional ·{" "}
          </span>
          {count.toLocaleString("en-US")} / {DEMO_LIMITS.message.toLocaleString("en-US")}
          <span className="sr-only"> characters</span>
        </span>
      }
    >
      <textarea
        id={id}
        name="message"
        rows={4}
        maxLength={DEMO_LIMITS.message}
        placeholder="The system, the stack, and the failure you cannot pin down."
        defaultValue={defaultValue}
        onInput={(e) => setCount(e.currentTarget.value.length)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy("message", countId)}
        className={cn(controlClass, "min-h-[132px] resize-y")}
      />
    </FieldShell>
  );
}
