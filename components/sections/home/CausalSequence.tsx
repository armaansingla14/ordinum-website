import { cn } from "@/lib/cn";
import type { CausalStep } from "@/lib/content";
import { MonoTag } from "./shared";

type CausalSequenceProps = {
  tag: string;
  ariaLabel: string;
  steps: readonly CausalStep[];
  caption: string;
  className?: string;
};

/** Marker per tone: normal event = steel square, injected disturbance = lime outline, violation = orange (only place orange appears). */
function Mark({ tone }: { tone: CausalStep["tone"] }) {
  return (
    <span aria-hidden="true" className="relative flex size-[20px] shrink-0 items-center justify-center bg-window">
      {tone === "violation" && <span className="absolute inset-0 border border-orange/45 bg-orange/10" />}
      <span
        className={cn(
          "relative inline-block",
          tone === "info" && "size-[7px] bg-subtle",
          tone === "fault" && "size-[9px] border border-lime",
          tone === "violation" && "size-[8px] bg-orange",
        )}
      />
    </span>
  );
}

/**
 * Home problem visual: one conceptual chain of events across components, read left to right
 * (top to bottom on small screens). Static, server-rendered; every word comes from content.ts.
 */
export default function CausalSequence({ tag, ariaLabel, steps, caption, className }: CausalSequenceProps) {
  return (
    <figure className={cn("border border-line-2 bg-window", className)}>
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
        <MonoTag>{tag}</MonoTag>
      </div>

      <ol aria-label={ariaLabel} className="grid grid-cols-1 px-4 py-6 sm:px-6 sm:py-7 lg:grid-cols-5 lg:px-7 lg:py-8">
        {steps.map((step, i) => {
          const last = i === steps.length - 1;
          const violation = step.tone === "violation";
          return (
            <li
              key={step.n}
              className="relative grid grid-cols-[20px_minmax(0,1fr)] gap-x-4 pb-6 last:pb-0 lg:block lg:pr-5 lg:pb-0"
            >
              {!last && (
                <span
                  aria-hidden="true"
                  className="absolute top-[24px] bottom-[4px] left-[9.5px] w-px bg-line-2 lg:top-[9.5px] lg:right-[4px] lg:bottom-auto lg:left-[24px] lg:h-px lg:w-auto"
                />
              )}
              <Mark tone={step.tone} />
              <div className="min-w-0 lg:mt-5">
                <p
                  className={cn(
                    "font-mono text-[10px] leading-[1.4] tracking-[0.12em] uppercase",
                    violation ? "text-orange/85" : step.tone === "fault" ? "text-lime" : "text-subtle",
                  )}
                >
                  <span className="text-quiet/70">{step.n.padStart(2, "0")}</span> {step.actor}
                </p>
                <p
                  className={cn(
                    "mt-1.5 text-[15px] leading-[1.45] tracking-[-0.012em] text-balance",
                    violation ? "text-orange" : "text-text",
                  )}
                >
                  {step.event}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <figcaption className="border-t border-line px-4 py-4 text-[14px] leading-[1.65] text-muted sm:px-6 lg:px-7">
        {caption}
      </figcaption>
    </figure>
  );
}
