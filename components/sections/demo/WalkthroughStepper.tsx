"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import type { DemoStepId } from "@/lib/content";
import { ReplaySquares, SourceLine } from "./parts";
import RunPanel from "./RunPanel";
import type { DemoStepView } from "./types";

/* -------------------------------------------------------------------------- */
/* The seven-step walkthrough. Every step is in the server-rendered HTML as an */
/* ordered list, so the page reads top to bottom without JS or interaction.    */
/* From lg up, a run panel is pinned beside the list: scrolling (or the         */
/* Previous/Next controls, or the arrow keys on them) moves the active step,   */
/* and the panel lights the part of the run that step is about. Below lg the   */
/* panel is not rendered and the steps are a plain scroll.                     */
/* -------------------------------------------------------------------------- */

const stepDomId = (id: DemoStepId) => `step-${id}`;
const DESKTOP = "(min-width: 1024px)";

export default function WalkthroughStepper({ steps }: { steps: readonly DemoStepView[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  /** Live-region text: set only by Previous/Next and the arrow keys, never by scrolling or focus. */
  const [announce, setAnnounce] = useState("");
  /** While a control-driven scroll is in flight, ignore the scroll observer. */
  const lockUntil = useRef(0);
  const listRef = useRef<HTMLOListElement>(null);

  /* Scroll sync: the step crossing the middle band of the viewport becomes active (desktop only). */
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof IntersectionObserver === "undefined") return;
    const mq = window.matchMedia(DESKTOP);
    let io: IntersectionObserver | null = null;

    const start = () => {
      io?.disconnect();
      if (!mq.matches) return;
      io = new IntersectionObserver(
        (entries) => {
          if (Date.now() < lockUntil.current) return;
          const hit = entries.find((e) => e.isIntersecting);
          if (!hit) return;
          const i = Number((hit.target as HTMLElement).dataset.index);
          if (!Number.isNaN(i)) setActive(i);
        },
        { rootMargin: "-45% 0px -50% 0px" },
      );
      list.querySelectorAll<HTMLElement>("[data-index]").forEach((el) => io?.observe(el));
    };

    start();
    mq.addEventListener("change", start);
    return () => {
      io?.disconnect();
      mq.removeEventListener("change", start);
    };
  }, []);

  const go = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(steps.length - 1, i));
      setActive(next);
      setAnnounce(`Step ${next + 1} of ${steps.length}: ${steps[next].label}`);
      lockUntil.current = Date.now() + (reduce ? 100 : 900);
      const el = document.getElementById(stepDomId(steps[next].id));
      el?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    },
    [reduce, steps],
  );

  /** Activate a step the reader moved to directly (focus or click on its heading link). */
  const pick = (i: number) => {
    lockUntil.current = Date.now() + 600;
    setActive(i);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") go(active + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(active - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(steps.length - 1);
    else return;
    e.preventDefault();
  };

  const current = steps[active];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <ol ref={listRef} aria-label="Walkthrough steps" className="border-t border-line lg:col-span-6 xl:col-span-6">
        {steps.map((step, i) => {
          const on = i === active;
          return (
            <li
              key={step.id}
              id={stepDomId(step.id)}
              data-index={i}
              aria-current={on ? "step" : undefined}
              className={cn(
                "grid scroll-mt-28 grid-cols-[34px_minmax(0,1fr)] gap-x-3 border-b border-line py-7 sm:grid-cols-[44px_minmax(0,1fr)] sm:gap-x-4 lg:border-l-2 lg:pl-5 lg:transition-colors lg:duration-300 lg:motion-reduce:transition-none",
                on ? "lg:border-l-lime" : "lg:border-l-transparent",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "pt-[5px] font-mono text-[12px] tabular-nums",
                  on ? "text-lime" : "text-lime lg:text-subtle",
                )}
              >
                {step.n}
              </span>
              <div className="min-w-0">
                <h3 className="text-[19px] font-semibold leading-[1.3] tracking-[-0.02em] text-text sm:text-[21px]">
                  {/* Self-link: every step is reachable with Tab and deep-linkable (/demo#step-…). */}
                  <a
                    href={`#${stepDomId(step.id)}`}
                    onFocus={() => pick(i)}
                    onClick={() => pick(i)}
                    className="inline-block min-h-6 py-0.5 decoration-lime/60 underline-offset-4 hover:underline focus-visible:underline"
                  >
                    <span className="sr-only">Step {step.n}: </span>
                    {step.label}
                  </a>
                </h3>
                <p className="mt-3 text-[15px] leading-[1.7] break-words text-muted">{step.detail}</p>

                <dl className="mt-4 border border-line bg-window px-3.5 py-2.5">
                  {step.excerpt.map((row) => (
                    <div
                      key={`${row.k}-${row.v}`}
                      className="grid grid-cols-1 gap-x-4 gap-y-0.5 py-1 sm:grid-cols-[108px_minmax(0,1fr)]"
                    >
                      <dt className="font-mono text-[11px] leading-[1.6] tracking-[0.08em] text-quiet uppercase">{row.k}</dt>
                      <dd
                        className={cn(
                          "min-w-0 font-mono text-[11.5px] leading-[1.55] break-words",
                          row.tone === "violation" && "text-orange",
                          row.tone === "removed" && "text-quiet",
                          row.tone === "kept" && "text-text",
                          row.tone === undefined && "text-[#d6dedb]",
                        )}
                      >
                        {/* Removed faults read "… removed by ddmin" in plain, unstruck text. */}
                        {row.v}
                      </dd>
                    </div>
                  ))}
                  {step.replay && (
                    <div className="py-1.5">
                      <dt className="sr-only">Re-runs</dt>
                      <dd>
                        <ReplaySquares failures={step.replay.failures} trials={step.replay.trials} />
                      </dd>
                    </div>
                  )}
                </dl>
                <SourceLine className="mt-2.5">{step.source}</SourceLine>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Pinned run panel: desktop only. Purely visual; the steps above carry every value. */}
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-[104px]">
          <RunPanel active={current.id} />
          <div
            role="group"
            aria-label="Step through the walkthrough"
            onKeyDown={onKey}
            className="mt-3 flex items-center justify-between gap-3 border border-line px-2 py-1.5"
          >
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-disabled={active === 0}
              className="min-h-11 px-3 font-mono text-[11px] tracking-[0.1em] text-text uppercase transition-colors duration-200 hover:text-lime aria-disabled:text-subtle aria-disabled:opacity-60 aria-disabled:hover:text-subtle"
            >
              <span aria-hidden="true">← </span>Previous
            </button>
            <p aria-hidden="true" className="min-w-0 truncate text-center font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
              <span className="text-lime tabular-nums">
                {current.n} / {String(steps.length).padStart(2, "0")}
              </span>{" "}
              {current.label}
            </p>
            <p aria-live="polite" className="sr-only">
              {announce}
            </p>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-disabled={active === steps.length - 1}
              className="min-h-11 px-3 font-mono text-[11px] tracking-[0.1em] text-text uppercase transition-colors duration-200 hover:text-lime aria-disabled:text-subtle aria-disabled:opacity-60 aria-disabled:hover:text-subtle"
            >
              Next<span aria-hidden="true"> →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
