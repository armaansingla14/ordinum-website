"use client";

import { motion, useInView, useReducedMotion, type Transition } from "motion/react";
import { useRef } from "react";
import type { Step } from "@/lib/content";
import { cn } from "@/lib/cn";

type LoopRailProps = {
  steps: readonly Step[];
  loopNote: string;
  className?: string;
};

/* Step indices (0-based) for the feedback loop and node roles. */
const LOOP_FROM = 3; // 04 Track behavioral coverage
const LOOP_TO = 1; // 02 Generate scenarios and faults
const FAILURE = 4; // 05 Discover failure paths
const TERMINAL = 6; // 07 Emit a regression test

const PHASES = [
  { label: "Discover", span: 5 },
  { label: "Reproduce", span: 1 },
  { label: "Prevent", span: 1 },
] as const;

/** Runs a few loops, then rests: no motion that lasts indefinitely without a pause control. */
const DOT_TRANSITION: Transition = {
  duration: 3.2,
  times: [0, 0.12, 0.88, 1],
  ease: "linear",
  repeat: 3,
  repeatDelay: 0.8,
};

function nodeClass(i: number) {
  if (i === FAILURE) return "border-orange bg-charcoal";
  if (i === TERMINAL) return "border-lime bg-lime";
  if (i === LOOP_FROM || i === LOOP_TO) return "border-lime bg-charcoal";
  return "border-line-2 bg-charcoal";
}

/**
 * The seven-step Ordinum loop.
 * - lg+: a horizontal overview rail (decorative) with a square feedback bracket from
 *   coverage (04) back to generation (02), phase brackets, and a 4-column hairline grid of steps.
 * - < lg: a vertical rail down the left edge of the step list, with the feedback loop drawn
 *   as a lime return line from 04 up to 02.
 */
export default function LoopRail({ steps, loopNote, className }: LoopRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const inView = useInView(railRef, { amount: 0.4 });
  const reduce = useReducedMotion();
  const n = steps.length;
  const animateDot = inView && !reduce;

  return (
    <div className={className}>
      {/* ------------------------------------------------------------------ */}
      {/* Desktop overview rail                                                */}
      {/* ------------------------------------------------------------------ */}
      <div ref={railRef} aria-hidden="true" className="relative hidden lg:block">
        {/* Feedback bracket: from node 04 up, back over, and down into node 02 */}
        <div className="relative h-[64px]">
          <div
            className="absolute bottom-[6px] top-[14px] border-x border-t border-lime/70"
            style={{
              left: `${((LOOP_TO + 0.5) / n) * 100}%`,
              width: `${((LOOP_FROM - LOOP_TO) / n) * 100}%`,
            }}
          >
            <span className="label-mono absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-charcoal px-3 text-[10px] text-lime">
              ↺ Feedback / coverage → generation
            </span>
            {/* arrowhead into node 02 */}
            <svg
              viewBox="0 0 9 6"
              className="absolute -bottom-[6px] left-0 h-[6px] w-[9px] -translate-x-1/2 text-lime"
              fill="currentColor"
            >
              <path d="M0 0 H9 L4.5 6 Z" />
            </svg>
            {animateDot && (
              // Transform-only path: the outer wrapper travels up/down, the inner one left/right.
              // Translate percentages resolve against the wrapper, i.e. the bracket's own size.
              <motion.span
                className="absolute inset-0"
                initial={{ y: "0%", opacity: 0 }}
                animate={{ y: ["0%", "-100%", "-100%", "0%"], opacity: [0, 1, 1, 0] }}
                transition={DOT_TRANSITION}
              >
                <motion.span
                  className="absolute inset-0"
                  initial={{ x: "0%" }}
                  animate={{ x: ["0%", "0%", "-100%", "-100%"] }}
                  transition={DOT_TRANSITION}
                >
                  <span className="absolute right-0 bottom-0 size-[5px] translate-x-1/2 translate-y-1/2 bg-lime shadow-[0_0_10px_var(--color-lime)]" />
                </motion.span>
              </motion.span>
            )}
          </div>
        </div>

        {/* Main rail */}
        <div className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          <span
            className="absolute top-[5px] h-px bg-line-2"
            style={{ left: `${(0.5 / n) * 100}%`, right: `${(0.5 / n) * 100}%` }}
          />
          {steps.map((s, i) => (
            <div key={s.n} className="relative flex flex-col items-center px-2 text-center">
              <span className={cn("relative z-10 size-[11px] border", nodeClass(i))} />
              <span className={cn("mt-4 font-mono text-[11px] tracking-[0.08em]", i === FAILURE ? "text-orange" : "text-lime")}>
                {s.n}
              </span>
            </div>
          ))}
        </div>

        {/* Phase brackets */}
        <div className="mt-8 grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {PHASES.map((p) => (
            <div key={p.label} className="px-2" style={{ gridColumn: `span ${p.span} / span ${p.span}` }}>
              <div className="h-[7px] border-x border-b border-line-2" />
              <p className="label-mono mt-3 text-[10px] text-muted">{p.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Loop note (all breakpoints) */}
      <p className="flex items-start gap-3 border-l border-lime/70 pl-4 text-[15px] leading-[1.7] text-muted lg:mt-14 lg:max-w-[640px]">
        <span className="label-mono shrink-0 pt-[3px] text-lime">Loop</span>
        <span>{loopNote}</span>
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* Steps: vertical rail on mobile/tablet, hairline grid on desktop      */}
      {/* ------------------------------------------------------------------ */}
      <ol className="mt-12 lg:hairline-grid lg:mt-10 lg:grid-cols-4" aria-label="The Ordinum loop, step by step">
        {steps.map((s, i) => {
          const first = i === 0;
          const last = i === n - 1;
          const inLoop = i >= LOOP_TO && i <= LOOP_FROM;
          return (
            <li
              key={s.n}
              className={cn(
                "relative grid grid-cols-[40px_minmax(0,1fr)] lg:flex lg:flex-col lg:bg-surface lg:p-7 xl:p-8",
                i === TERMINAL && "lg:col-span-2",
              )}
            >
              {/* Vertical rail gutter (< lg) */}
              <div aria-hidden="true" className="relative lg:hidden">
                <span
                  className={cn(
                    "absolute left-[23px] w-px bg-line-2",
                    first ? "top-[8px]" : "top-0",
                    last ? "h-[8px]" : "bottom-0",
                  )}
                />
                <span className={cn("absolute left-[18px] top-[3px] z-10 size-[11px] border", nodeClass(i))} />
                {inLoop && (
                  <>
                    <span
                      className={cn(
                        "absolute left-[4px] w-px bg-lime/70",
                        i === LOOP_TO && "bottom-0 top-[8px]",
                        i === LOOP_FROM && "top-0 h-[8px]",
                        i > LOOP_TO && i < LOOP_FROM && "inset-y-0",
                      )}
                    />
                    {(i === LOOP_TO || i === LOOP_FROM) && (
                      <span className="absolute left-[4px] top-[8px] h-px w-[13px] bg-lime/70" />
                    )}
                    {i === LOOP_TO && (
                      <svg viewBox="0 0 5 7" className="absolute left-[13px] top-[5px] h-[7px] w-[5px] text-lime" fill="currentColor">
                        <path d="M0 0 L5 3.5 L0 7 Z" />
                      </svg>
                    )}
                  </>
                )}
              </div>

              <div className={cn("pb-11 lg:flex lg:flex-1 lg:flex-col lg:pb-0", last && "pb-0")}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className={cn("font-mono text-[12px] tracking-[0.08em]", i === FAILURE ? "text-orange" : "text-lime")}>
                    {s.n}
                  </span>
                  <span className="label-mono text-right text-[10px] text-subtle">{s.tag}</span>
                </div>
                <h3 className="mt-3 text-[21px] font-semibold leading-[1.2] tracking-title text-text lg:mt-10 lg:text-[20px]">
                  {s.title}
                </h3>
                <p className={cn("mt-3 text-[14.5px] leading-[1.75] text-muted lg:mt-4", i === TERMINAL && "lg:max-w-[440px]")}>
                  {s.body}
                </p>
                {i === LOOP_FROM && (
                  <p className="label-mono mt-4 text-[10px] text-lime lg:hidden">↺ Loops back to 02</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
