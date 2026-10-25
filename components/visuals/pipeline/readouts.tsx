/**
 * Per-stage readouts under (desktop) or beside (mobile) each of the four pipeline nodes.
 * Text is HTML so it stays crisp at any width; all state changes are opacity/transform.
 */

import { motion, useReducedMotion, useTransform } from "motion/react";
import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { hero } from "@/lib/content";
import { useTrack, type Clock } from "./marks";
import {
  FAIL,
  READOUT,
  RERUN_COUNT,
  RERUN_MISSES,
  persistFrom,
  rerunTime,
  stressBar,
  track,
  type PacketDef,
} from "./script";

/** Crossfades are sequenced: idle fades out over [0, IDLE_OUT], the result fades in over [IDLE_OUT, 1]. */
const IDLE_OUT = 0.4;
const fadeIn = (v: number) => Math.min(1, Math.max(0, (v - IDLE_OUT) / (1 - IDLE_OUT)));
const fadeOut = (v: number) => Math.min(1, Math.max(0, 1 - v / IDLE_OUT));

const tag = "font-mono text-[10px] leading-[1.35] tracking-[0.12em] uppercase";

/** Two layers stacked in the same grid cell, for crossfades without layout shift. */
function Stack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid *:col-start-1 *:row-start-1", className)}>
      {children}
    </div>
  );
}

function Idle({
  clock,
  until,
  children,
}: {
  clock: Clock;
  until: ReturnType<typeof persistFrom>;
  children: ReactNode;
}) {
  const shown = useTrack(clock, until);
  // Sequenced, not overlapped: the idle label is gone before the result starts to appear.
  const opacity = useTransform(shown, [0, IDLE_OUT], [1, 0]);
  return (
    <motion.span style={{ opacity }} className={cn(tag, "text-subtle")}>
      {children}
    </motion.span>
  );
}

/* CONNECT: the adapters that exist today, by name (their maturity is in the hero status line). */
export function SystemsReadout({
  targets,
  align = "start",
}: {
  targets: string;
  align?: "start" | "end";
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", align === "end" && "items-end text-right")}>
      <span className={cn(tag, "text-subtle")}>Adapters</span>
      <span className="font-mono text-[11px] leading-[1.35] tracking-[0.04em] text-text">{targets}</span>
    </div>
  );
}

/* STRESS-TEST: a run bar that sweeps while each scenario runs under injected faults. */
export function StressReadout({
  clock,
  packets,
  align = "start",
}: {
  clock: Clock;
  packets: PacketDef[];
  align?: "start" | "end";
}) {
  const kf = useMemo(() => stressBar(packets), [packets]);
  const tracked = useTrack(clock, kf);
  // Reduced motion freezes the loop on a frame between scenarios; show the bar full instead of empty.
  const reduce = useReducedMotion();
  const scaleX = reduce ? 1 : tracked;
  return (
    <div className={cn("flex w-full max-w-[112px] flex-col gap-2", align === "end" && "items-end")}>
      <span className={cn(tag, "text-subtle")}>Faults injected</span>
      <div className="relative h-[3px] w-full bg-line">
        <motion.div style={{ scaleX }} className="absolute inset-0 origin-left bg-lime" />
      </div>
    </div>
  );
}

/* VERIFY: checking -> PROPERTY VIOLATED (orange is reserved for this). */
export function VerifyReadout({
  clock,
  align = "start",
}: {
  clock: Clock;
  align?: "start" | "end";
}) {
  const shown = useTrack(clock, READOUT.violation);
  const resultOpacity = useTransform(shown, fadeIn);
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        align === "end" && "items-end text-right",
      )}
    >
      {align === "start" && (
        <span className={cn(tag, "text-subtle")}>Properties</span>
      )}
      <Stack className={cn(align === "end" && "justify-items-end")}>
        <Idle clock={clock} until={READOUT.violation}>
          Checking
        </Idle>
        <motion.div
          style={{ opacity: resultOpacity }}
          className={cn(
            "flex flex-col gap-1.5",
            align === "end" && "items-end",
          )}
        >
          <span
            className={cn(
              tag,
              "border border-orange/70 bg-orange/10 px-1.5 py-[3px] whitespace-nowrap text-orange",
            )}
          >
            Violation
          </span>
          <span className="font-mono text-[10px] tracking-[0.04em] whitespace-nowrap text-orange/80">
            claimed ≠ actual
          </span>
        </motion.div>
      </Stack>
    </div>
  );
}

/*
 * REPRODUCE & PREVENT: repeated re-runs (most, not all, reproduce), a smaller fault schedule,
 * then the reduced scenario is kept as a regression case. Fixed, generic labels: no numbered IDs
 * and nothing that counts up between loops (this figure is conceptual).
 */
export function ReproduceReadout({
  clock,
  align = "start",
}: {
  clock: Clock;
  align?: "start" | "end";
}) {
  const active = useTrack(clock, READOUT.reproduceNode);
  const reduced = useTrack(clock, READOUT.reduced);
  const saved = useTrack(clock, NEWEST);
  const savedY = useTrack(clock, NEWEST_Y);
  const idle = useTransform(active, fadeOut);
  const reducedOpacity = useTransform(reduced, fadeIn);
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", align === "end" && "items-end text-right")}>
      <span className="flex gap-[3px]" aria-hidden="true">
        {Array.from({ length: RERUN_COUNT }, (_, i) => (
          <Rerun key={i} i={i} clock={clock} />
        ))}
      </span>
      <Stack className={cn(align === "end" && "justify-items-end")}>
        <motion.span style={{ opacity: idle }} className={cn(tag, "text-subtle")}>
          Re-runs
        </motion.span>
        <motion.span style={{ opacity: reducedOpacity }} className={cn(tag, "whitespace-nowrap text-text")}>
          Fewer faults
        </motion.span>
      </Stack>
      <motion.span
        style={{ opacity: saved, y: savedY }}
        className="flex items-center gap-1.5 font-mono text-[10px] leading-[1.35] tracking-[0.04em] whitespace-nowrap text-text"
      >
        {hero.visual.regressionLabel}
        <Check className="text-lime" />
      </motion.span>
    </div>
  );
}

function Rerun({ i, clock }: { i: number; clock: Clock }) {
  const kf = useMemo(() => persistFrom(rerunTime(i), 0.08), [i]);
  const opacity = useTrack(clock, kf);
  const miss = RERUN_MISSES.has(i);
  return (
    <span className="relative size-[5px] bg-line">
      <motion.span
        style={{ opacity }}
        className={cn("absolute inset-0", miss ? "border border-muted bg-window" : "bg-lime")}
      />
    </span>
  );
}

/** Regression row: appears when the failure is saved and holds until the loop restarts. */
const NEWEST = persistFrom(FAIL.saved, 0.3);
const NEWEST_Y = track([
  [FAIL.saved - 0.001, 4],
  [FAIL.saved + 0.4, 0],
]);

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" aria-hidden="true" className={cn("size-[9px] shrink-0", className)}>
      <path d="M1.5 5.2 4 7.6 8.6 2.4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}
