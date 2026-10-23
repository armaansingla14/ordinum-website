"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { FaultChip, Invariant } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;
const LAST_PHASE = 3;
const PHASE_MS = 1250;

type MinimizationTraceProps = {
  chips: readonly FaultChip[];
  faultsBefore: number;
  faultsAfter: number;
  invariant: Invariant;
  /** Tick at which the invariant is violated (end of the trace). */
  violationTick: number;
  regressionLabel: string;
  replay: string;
  note: string;
  className?: string;
};

const PHASES = [
  { n: "01", label: "Found", detail: (p: MinimizationTraceProps) => `${p.faultsBefore} faults` },
  { n: "02", label: "ddmin", detail: (p: MinimizationTraceProps) => `${p.faultsBefore - p.faultsAfter} removed` },
  { n: "03", label: "Replay", detail: () => "Identical trace" },
  { n: "04", label: "Regression", detail: () => "Emitted" },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Six injected faults on a tick timeline. ddmin strikes the one that is not needed,
 * replay rings lock onto the five that remain, and a regression test is emitted.
 * Plays once when scrolled into view; reduced motion shows the final frame.
 */
export default function MinimizationTrace(props: MinimizationTraceProps) {
  const { chips, faultsBefore, faultsAfter, invariant, violationTick, regressionLabel, replay, note, className } =
    props;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setPhase(i);
      if (i >= LAST_PHASE) window.clearInterval(id);
    }, PHASE_MS);
    return () => window.clearInterval(id);
  }, [reduce, inView, run]);

  const shown = reduce ? LAST_PHASE : phase;
  const minimized = shown >= 1;
  const replayed = shown >= 2;
  const emitted = shown >= 3;

  const lanes = [...chips].sort((a, b) => a.tick - b.tick);
  const ticks = Array.from({ length: violationTick + 1 }, (_, i) => i);
  const at = (t: number) => `${(t / violationTick) * 100}%`;

  const restart = () => {
    setPhase(0);
    setRun((r) => r + 1);
  };

  return (
    <figure ref={ref} className={cn("flex flex-col", className)}>
      <div className="border border-line-2 bg-window shadow-[0_28px_70px_rgb(0_0_0/0.34)]">
        {/* Window bar */}
        <div className="flex min-h-[47px] flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line px-4 py-3 font-mono text-[10px] tracking-[0.08em] text-[#a5b1ad] uppercase sm:px-5">
          <span>
            Minimization trace <span className="text-line-2">/</span> {invariant}
          </span>
          <span className="text-[#8a9894]">Illustrative / representative faults</span>
        </div>

        {/* Phase stepper */}
        <ol className="grid grid-cols-2 gap-px border-b border-line bg-line sm:grid-cols-4">
          {PHASES.map((p, i) => {
            const state = i < shown ? "done" : i === shown ? "active" : "pending";
            return (
              <li key={p.n} className="relative bg-window px-4 py-3.5 sm:px-5" aria-current={state === "active" ? "step" : undefined}>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 top-0 h-px origin-left transition-transform duration-700 ease-out-expo",
                    "bg-lime",
                    state === "pending" ? "scale-x-0" : "scale-x-100",
                  )}
                />
                <span
                  className={cn(
                    "label-mono block transition-colors duration-300",
                    state === "pending" ? "text-[#8a9894]" : "text-lime",
                  )}
                >
                  {p.n} / {p.label}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-[13px] tracking-[-0.01em] transition-colors duration-300",
                    state === "pending" ? "text-[#8a9894]" : "text-text",
                  )}
                >
                  {p.detail(props)}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Lanes */}
        <div className="px-4 pt-5 pb-6 sm:px-5" aria-hidden="true">
          <div className="grid grid-cols-[136px_minmax(0,1fr)] gap-x-3 sm:grid-cols-[150px_minmax(0,1fr)_88px] sm:gap-x-4">
            {/* Axis header */}
            <span className="label-mono pb-3 text-[10px] text-[#8a9894]">Fault</span>
            <div className="relative mx-[7px] h-6">
              {ticks.map((t) => (
                <span
                  key={t}
                  className={cn(
                    "absolute top-0 -translate-x-1/2 font-mono text-[10px] tabular-nums text-[#8a9894]",
                    t % 3 !== 0 && "hidden sm:inline",
                  )}
                  style={{ left: at(t) }}
                >
                  {t === 0 ? "t0" : pad(t)}
                </span>
              ))}
            </div>
            <span className="label-mono hidden pb-3 text-right text-[10px] text-[#8a9894] sm:block">ddmin</span>

            {lanes.map((chip, i) => {
              const gone = minimized && chip.removed;
              return (
                <Lane key={`${chip.kind}-${chip.tick}`} index={i}>
                  <span
                    className={cn(
                      "min-w-0 self-center truncate font-mono text-[11px] transition-colors duration-500 sm:text-[12px]",
                      gone ? "text-[#8a9894]" : "text-text",
                    )}
                  >
                    <span className="relative inline-block max-w-full">
                      <span className="mr-2 text-[#8a9894] tabular-nums">{pad(chip.tick)}</span>
                      {chip.kind}
                      <motion.span
                        className="absolute top-1/2 left-0 h-px w-full origin-left bg-[#8a9894]"
                        initial={false}
                        animate={{ scaleX: gone ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    </span>
                  </span>
                  <Track ticks={ticks} at={at}>
                    <span
                      className="absolute top-1/2 left-0 h-px bg-line-2"
                      style={{ width: at(chip.tick) }}
                    />
                    <span
                      className={cn(
                        "absolute top-1/2 size-[11px] -translate-x-1/2 -translate-y-1/2 border transition-colors duration-500",
                        gone ? "border-[#5d6b6c] bg-transparent" : "border-text bg-text",
                      )}
                      style={{ left: at(chip.tick) }}
                    />
                    <AnimatePresence>
                      {replayed && !chip.removed && (
                        <motion.span
                          key="ring"
                          className="absolute top-1/2 size-[21px] -translate-x-1/2 -translate-y-1/2 border border-lime"
                          style={{ left: at(chip.tick) }}
                          initial={{ opacity: 0, scale: 1.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
                        />
                      )}
                    </AnimatePresence>
                  </Track>
                  <span
                    className={cn(
                      "label-mono hidden self-center text-right text-[10px] transition-colors duration-500 sm:block",
                      gone ? "text-text" : "text-[#8a9894]",
                    )}
                  >
                    {gone ? "Removed" : minimized ? "Kept" : "—"}
                  </span>
                </Lane>
              );
            })}

            {/* Violation lane */}
            <Lane index={lanes.length} last>
              <span className="self-center truncate font-mono text-[11px] text-orange sm:text-[12px]">
                <span className="mr-2 tabular-nums text-orange/70">{pad(violationTick)}</span>
                {invariant}
              </span>
              <Track ticks={ticks} at={at}>
                <span
                  className="absolute top-1/2 h-px border-t border-dashed border-orange/50"
                  style={{ left: 0, width: at(violationTick) }}
                />
                <span
                  className="absolute top-1/2 size-[13px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-orange"
                  style={{ left: at(violationTick) }}
                />
                <AnimatePresence>
                  {replayed && (
                    <motion.span
                      key="ring"
                      className="absolute top-1/2 size-[23px] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-orange"
                      style={{ left: at(violationTick) }}
                      initial={{ opacity: 0, scale: 1.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE, delay: lanes.length * 0.06 }}
                    />
                  )}
                </AnimatePresence>
              </Track>
              <span className="label-mono hidden self-center text-right text-[10px] text-orange sm:block">Violated</span>
            </Lane>
          </div>

          {/* Legend */}
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.08em] text-[#8a9894] uppercase">
            <span className="inline-flex items-center gap-2">
              <span className="size-[9px] bg-text" /> Injected fault
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-[9px] border border-[#5d6b6c]" /> Removed by ddmin
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-[11px] border border-lime" /> Replay
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-[8px] rotate-45 bg-orange" /> Invariant violation
            </span>
          </div>
        </div>

        {/* Footer: counts + regression card */}
        <div className="grid border-t border-line sm:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          <dl className="grid grid-cols-2 gap-px bg-line sm:border-r sm:border-line">
            <div className="bg-window px-4 py-4 sm:px-5">
              <dt className="label-mono text-[10px] text-[#8a9894]">Faults</dt>
              <dd className="mt-1.5 font-mono text-[22px] leading-none tracking-[-0.02em] text-text tabular-nums">
                <span className={cn("transition-colors duration-500", minimized && "text-[#8a9894] line-through decoration-1")}>
                  {faultsBefore}
                </span>
                <span className={cn("transition-opacity duration-500", minimized ? "opacity-100" : "opacity-0")}>
                  <span className="mx-2 text-[#8a9894]">→</span>
                  <span className="text-lime">{faultsAfter}</span>
                </span>
              </dd>
            </div>
            <div className="bg-window px-4 py-4 sm:px-5">
              <dt className="label-mono text-[10px] text-[#8a9894]">Replay</dt>
              <dd
                className={cn(
                  "mt-1.5 font-mono text-[12px] leading-[1.45] tracking-[0.02em] transition-colors duration-500",
                  replayed ? "text-lime" : "text-[#8a9894]",
                )}
              >
                {replayed ? replay : "Pending"}
              </dd>
            </div>
          </dl>

          <div className="relative min-h-[118px] border-t border-line px-4 py-4 sm:border-t-0 sm:px-5">
            <AnimatePresence mode="wait" initial={false}>
              {emitted ? (
                <motion.div
                  key="emitted"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[13px] text-text">{regressionLabel}</span>
                    <span className="label-mono border border-lime px-2 py-1 text-[10px] text-lime">Test emitted</span>
                  </div>
                  <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[11px] leading-[1.6]">
                    <dt className="text-[#8a9894]">faults</dt>
                    <dd className="text-muted">{faultsAfter}</dd>
                    <dt className="text-[#8a9894]">asserts</dt>
                    <dd className="text-muted">{invariant} holds</dd>
                    <dt className="text-[#8a9894]">replay</dt>
                    <dd className="text-muted">deterministic</dd>
                  </dl>
                </motion.div>
              ) : (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-[86px] items-center border border-dashed border-line-2 px-4"
                >
                  <span className="label-mono text-[10px] text-[#8a9894]">Regression test / pending</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <figcaption className="mt-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <span className="max-w-[520px] font-mono text-[11px] leading-[1.7] text-[#8a9894]">{note}.</span>
        {!reduce && (
          <button
            type="button"
            onClick={() => {
              if (emitted) restart();
            }}
            aria-disabled={!emitted}
            className="label-mono inline-flex min-h-11 items-center gap-2 border border-line-2 px-3 py-2 text-[10px] text-muted transition-colors hover:border-lime hover:text-lime aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:border-line-2 aria-disabled:hover:text-muted"
          >
            <span aria-hidden="true">↻</span> Replay sequence
          </button>
        )}
      </figcaption>

      {/* Text equivalent of the trace */}
      <div className="sr-only">
        <p>
          Illustrative injected faults by tick (kinds and timings representative). ddmin removed {faultsBefore - faultsAfter} of {faultsBefore}; {faultsAfter} remain.
        </p>
        <ol>
          {lanes.map((c) => (
            <li key={`${c.kind}-${c.tick}`}>
              t={c.tick}: {c.kind}
              {c.removed ? ", removed by ddmin" : ", kept"}
            </li>
          ))}
          <li>
            t={violationTick}: {invariant} violated
          </li>
        </ol>
        <p>
          Replay: {replay}. Emitted as {regressionLabel}.
        </p>
      </div>
    </figure>
  );
}

function Lane({ children, index, last = false }: { children: ReactNode; index: number; last?: boolean }) {
  return (
    <div
      className={cn(
        "col-span-full grid grid-cols-subgrid border-t border-line py-[9px]",
        last && "border-b",
      )}
      data-lane={index}
    >
      {children}
    </div>
  );
}

function Track({ ticks, at, children }: { ticks: number[]; at: (t: number) => string; children: ReactNode }) {
  return (
    <div className="relative mx-[7px] h-[25px]">
      {ticks.map((t) => (
        <span key={t} className="absolute inset-y-0 w-px bg-line/60" style={{ left: at(t) }} />
      ))}
      {children}
    </div>
  );
}
