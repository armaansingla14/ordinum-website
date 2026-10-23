/**
 * Per-stage readouts under (desktop) or beside (mobile) each pipeline node.
 * Text is HTML so it stays crisp at any width; all state changes are opacity/transform.
 */

import { motion, useTransform } from "motion/react";
import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useTrack, type Clock } from "./marks";
import {
  FAIL,
  READOUT,
  cellOpacity,
  executeBar,
  feedbackTimes,
  persistFrom,
  regressionName,
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

/* SCENARIO: the corpus grows by one entry each time new coverage feeds back. */
export function CorpusReadout({
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
      <span className={cn(tag, "text-subtle")}>Corpus</span>
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
          <CorpusEntry key={p.id} p={p} clock={clock} />
        ))}
      </div>
    </div>
  );
}

function CorpusEntry({ p, clock }: { p: PacketDef; clock: Clock }) {
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
      <span className={cn(tag, "text-subtle")}>Sim / seeded</span>
      <div className="relative h-[3px] w-full bg-line">
        <motion.div
          style={{ scaleX }}
          className="absolute inset-0 origin-left bg-lime"
        />
      </div>
    </div>
  );
}

/* COVERAGE: a behavior map that fills as new behavior is found. */
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
      <span className={cn(tag, "text-subtle")}>Behavior map</span>
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

/* FAILURE: searching -> INVARIANT VIOLATION (orange is reserved for this). */
export function FailureReadout({
  clock,
  invariant,
  align = "start",
}: {
  clock: Clock;
  invariant: string;
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
        <span className={cn(tag, "text-subtle")}>Invariants</span>
      )}
      <Stack className={cn(align === "end" && "justify-items-end")}>
        <Idle clock={clock} until={READOUT.violation}>
          Searching
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
              "border border-orange/70 bg-orange/10 px-1.5 py-[3px] text-orange",
            )}
          >
            Invariant violation
          </span>
          <span className="font-mono text-[10px] tracking-[0.04em] text-orange/80">
            {invariant}
          </span>
        </motion.div>
      </Stack>
    </div>
  );
}

/* MINIMIZE: ddmin 6 -> 5 faults. */
export function MinimizeReadout({
  clock,
  align = "start",
}: {
  clock: Clock;
  align?: "start" | "end";
}) {
  const six = useTrack(clock, READOUT.faultsSix);
  const active = useTrack(clock, READOUT.minimizeNode);
  const done = useTrack(clock, READOUT.minimized);
  // Three layers, never two at once: idle -> "fault set" -> "reduced". Illustrative, no real counts.
  const sixOpacity = useTransform([six, active, done], ([s, a, d]: number[]) =>
    Math.min(s, fadeIn(a), fadeOut(d)),
  );
  const doneOpacity = useTransform(done, fadeIn);
  const idle = useTransform(active, fadeOut);
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        align === "end" && "items-end text-right",
      )}
    >
      <span className={cn(tag, "text-subtle")}>ddmin</span>
      <Stack className={cn(align === "end" && "justify-items-end")}>
        <motion.span
          style={{ opacity: idle }}
          className={cn(tag, "text-subtle")}
        >
          —
        </motion.span>
        <motion.span
          style={{ opacity: sixOpacity }}
          className={cn(tag, "text-muted")}
        >
          Fault set
        </motion.span>
        <motion.span style={{ opacity: doneOpacity }} className={cn(tag, "text-text")}>
          Fault set <span className="text-subtle">→</span>{" "}
          <span className="text-lime">reduced</span>
        </motion.span>
      </Stack>
    </div>
  );
}

/* REPLAY: the re-run overlays the original exactly. */
export function ReplayReadout({
  clock,
  align = "start",
}: {
  clock: Clock;
  align?: "start" | "end";
}) {
  const shown = useTrack(clock, READOUT.replay);
  const resultOpacity = useTransform(shown, fadeIn);
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        align === "end" && "items-end text-right",
      )}
    >
      <span className={cn(tag, "text-subtle")}>Trace</span>
      <Stack className={cn(align === "end" && "justify-items-end")}>
        <Idle clock={clock} until={READOUT.replay}>
          —
        </Idle>
        <motion.span
          style={{ opacity: resultOpacity }}
          className={cn(tag, "text-lime")}
        >
          Replay 1:1
        </motion.span>
      </Stack>
    </div>
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

/* REGRESSION: the minimized failure becomes a permanent test. Earlier ones stay in the suite. */
export function RegressionReadout({
  clock,
  cycle,
  history = 2,
  align = "start",
}: {
  clock: Clock;
  /** Completed loops; the newest row is regression_{cycle + 1}. */
  cycle: number;
  /** How many earlier rows to keep visible. */
  history?: number;
  align?: "start" | "end";
}) {
  const opacity = useTrack(clock, NEWEST);
  const y = useTrack(clock, NEWEST_Y);
  const n = cycle + 1;
  const earlier = Array.from(
    { length: Math.min(history, n - 1) },
    (_, k) => n - 1 - k,
  ).reverse();
  const row = cn(
    "flex items-center gap-1.5 font-mono text-[10px] leading-[1.35] tracking-[0.04em]",
  );
  return (
    <div className={cn("flex flex-col gap-1", align === "end" && "items-end")}>
      {earlier.map((k) => (
        <span key={k} className={cn(row, "text-subtle")}>
          {regressionName(k)}
          <Check className="text-subtle" />
        </span>
      ))}
      <motion.span style={{ opacity, y }} className={cn(row, "text-text")}>
        {regressionName(n)}
        <Check className="text-lime" />
      </motion.span>
    </div>
  );
}
