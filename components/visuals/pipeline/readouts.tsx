/**
 * Per-stage readouts under (desktop) or beside (mobile) each pipeline node.
 * Text is HTML so it stays crisp at any width; all state changes are opacity/transform.
 */

import { motion, useTransform } from "motion/react";
import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { hero, type Status } from "@/lib/content";
import { useTrack, type Clock } from "./marks";
import {
  FAIL,
  READOUT,
  RERUN_COUNT,
  RERUN_MISSES,
  cellOpacity,
  executeBar,
  feedbackTimes,
  persistFrom,
  rerunTime,
  track,
  type CellPlan,
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

/* SYSTEMS: the kinds of systems the platform is meant to connect, with honest status. */
export type SystemSource = { id: string; name: string; status: Status };

function SourceMark({ status }: { status: Status }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-[6px] shrink-0",
        status === "implemented" && "bg-lime",
        status === "in-development" && "border border-dashed border-lime",
        status === "planned" && "border border-dashed border-subtle",
      )}
    />
  );
}

export function SystemsReadout({
  sources,
  compact = false,
  align = "start",
}: {
  sources: readonly SystemSource[];
  compact?: boolean;
  align?: "start" | "end";
}) {
  const built = sources.filter((d) => d.status === "implemented").length;
  if (compact) {
    return (
      <div className={cn("flex flex-col gap-2", align === "end" && "items-end")}>
        <span className="flex gap-[4px]">
          {sources.map((d) => (
            <SourceMark key={d.id} status={d.status} />
          ))}
        </span>
        <span className={cn(tag, "text-subtle")}>
          <span className="text-lime">{built} built</span> · {sources.length - built} planned
        </span>
      </div>
    );
  }
  return (
    <ul className={cn("flex flex-wrap gap-x-2.5 gap-y-[5px]", align === "end" && "justify-end")}>
      {sources.map((d) => (
        <li
          key={d.id}
          className={cn(
            tag,
            "flex items-center gap-1.5 text-[9.5px] tracking-[0.1em]",
            d.status === "implemented" ? "text-lime" : "text-subtle",
          )}
        >
          <SourceMark status={d.status} />
          {d.name}
        </li>
      ))}
    </ul>
  );
}

/* ENGINES: the scenario pool grows by one entry each time new behavior feeds back. */
export function ScenarioReadout({
  clock,
  packets,
  seeds,
  align = "start",
}: {
  clock: Clock;
  packets: PacketDef[];
  seeds: number;
  align?: "start" | "end";
}) {
  const fed = packets.filter((p) => p.newCells > 0);
  return (
    <div className={cn("flex flex-col gap-2", align === "end" && "items-end")}>
      <span className={cn(tag, "text-subtle")}>Scenarios</span>
      <div
        className={cn(
          "flex max-w-[112px] flex-wrap gap-[3px]",
          align === "end" && "justify-end",
        )}
      >
        {Array.from({ length: seeds }, (_, i) => (
          <span key={`s${i}`} className="size-[5px] bg-muted/70" />
        ))}
        {fed.map((p) => (
          <ScenarioEntry key={p.id} p={p} clock={clock} />
        ))}
      </div>
    </div>
  );
}

function ScenarioEntry({ p, clock }: { p: PacketDef; clock: Clock }) {
  const kf = useMemo(() => persistFrom(feedbackTimes(p).up, 0.15), [p]);
  const opacity = useTrack(clock, kf);
  return (
    <span className="relative size-[5px] bg-line">
      <motion.span style={{ opacity }} className="absolute inset-0 bg-lime" />
    </span>
  );
}

/* EXECUTE: a run bar that sweeps while each scenario executes. */
export function ExecuteReadout({
  clock,
  packets,
  align = "start",
}: {
  clock: Clock;
  packets: PacketDef[];
  align?: "start" | "end";
}) {
  const kf = useMemo(() => executeBar(packets), [packets]);
  const scaleX = useTrack(clock, kf);
  return (
    <div
      className={cn(
        "flex w-full max-w-[112px] flex-col gap-2",
        align === "end" && "items-end",
      )}
    >
      <span className={cn(tag, "text-subtle")}>Supervised</span>
      <div className="relative h-[3px] w-full bg-line">
        <motion.div
          style={{ scaleX }}
          className="absolute inset-0 origin-left bg-lime"
        />
      </div>
    </div>
  );
}

/* EVIDENCE: a behavior map that fills as new behavior is observed. */
export function CoverageReadout({
  clock,
  plan,
  cell = 6,
  gap = 2,
  align = "start",
}: {
  clock: Clock;
  plan: CellPlan;
  cell?: number;
  gap?: number;
  align?: "start" | "end";
}) {
  const { cols, rows, seeds, lit } = plan;
  const w = cols * cell + (cols - 1) * gap;
  const h = rows * cell + (rows - 1) * gap;
  const seedSet = useMemo(() => new Set(seeds), [seeds]);
  return (
    <div className={cn("flex flex-col gap-2", align === "end" && "items-end")}>
      <span className={cn(tag, "text-subtle")}>Observed</span>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        aria-hidden="true"
        className="block shrink-0"
      >
        {Array.from({ length: cols * rows }, (_, i) => {
          const x = (i % cols) * (cell + gap);
          const y = Math.floor(i / cols) * (cell + gap);
          const on = lit.get(i);
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <rect
                width={cell}
                height={cell}
                className={seedSet.has(i) ? "fill-lime/45" : "fill-line/70"}
              />
              {on !== undefined && <Cell clock={clock} on={on} size={cell} />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Cell({ clock, on, size }: { clock: Clock; on: number; size: number }) {
  const kf = useMemo(() => cellOpacity(on), [on]);
  const opacity = useTrack(clock, kf);
  return (
    <motion.rect
      width={size}
      height={size}
      className="fill-lime"
      style={{ opacity }}
    />
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

/* REPRODUCE: repeated re-runs (most, not all, reproduce), then a smaller fault schedule. */
export function ReproduceReadout({
  clock,
  align = "start",
}: {
  clock: Clock;
  align?: "start" | "end";
}) {
  const active = useTrack(clock, READOUT.reproduceNode);
  const done = useTrack(clock, READOUT.minimized);
  const idle = useTransform(active, fadeOut);
  const doneOpacity = useTransform(done, fadeIn);
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "end" && "items-end text-right",
      )}
    >
      <span className={cn(tag, "text-subtle")}>Re-runs</span>
      <span className="flex gap-[3px]">
        {Array.from({ length: RERUN_COUNT }, (_, i) => (
          <Rerun key={i} i={i} clock={clock} />
        ))}
      </span>
      <Stack className={cn(align === "end" && "justify-items-end")}>
        <motion.span style={{ opacity: idle }} className={cn(tag, "text-subtle")}>
          —
        </motion.span>
        <motion.span
          style={{ opacity: doneOpacity }}
          className={cn(tag, "whitespace-nowrap text-text")}
        >
          Fewer faults
        </motion.span>
      </Stack>
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

/** Newest regression row: appears when the failure is saved and holds until the loop restarts. */
const NEWEST = track([
  [FAIL.saved - 0.001, 0],
  [FAIL.saved + 0.3, 1],
]);
const NEWEST_Y = track([
  [FAIL.saved - 0.001, 4],
  [FAIL.saved + 0.4, 0],
]);

function Check({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 10 10"
      aria-hidden="true"
      className={cn("size-[9px] shrink-0", className)}
    >
      <path
        d="M1.5 5.2 4 7.6 8.6 2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

/*
 * REGRESS: the reduced failure is kept as a regression case. A fixed, generic label: no
 * numbered IDs and nothing that counts up between loops (this figure is conceptual).
 */
export function RegressionReadout({
  clock,
  align = "start",
}: {
  clock: Clock;
  align?: "start" | "end";
}) {
  const opacity = useTrack(clock, NEWEST);
  const y = useTrack(clock, NEWEST_Y);
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", align === "end" && "items-end")}>
      <motion.span
        style={{ opacity, y }}
        className="flex items-center gap-1.5 font-mono text-[10px] leading-[1.35] tracking-[0.04em] whitespace-nowrap text-text"
      >
        {hero.visual.regressionLabel}
        <Check className="text-lime" />
      </motion.span>
    </div>
  );
}
