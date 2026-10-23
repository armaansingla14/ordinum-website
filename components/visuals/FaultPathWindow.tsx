"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { FaultEvent } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;
const STEP_MS = 1050;

const CELL = 32;
const N = 9;
const SIZE = CELL * N;
const c = (v: number) => v * CELL + CELL / 2;

type Pt = readonly [number, number];

/**
 * Illustrative scene, one frame per console event (t0, t3, t4, t6, t10, t11, t12).
 * Cell coordinates on a 9 × 9 grid.
 */
const START: Pt = [1, 7];
const GOAL: Pt = [7, 2];
const OBSTACLE_A: Pt = [4, 5];
const OBSTACLE_B: Pt = [5, 4];
const PLAN_A: readonly Pt[] = [START, [4, 7], [4, 2], GOAL];
const PLAN_B: readonly Pt[] = [[3, 7], [5, 7], [5, 2], GOAL];

const FRAMES: readonly {
  robot: Pt;
  /** Extra path vertices travelled to reach this frame. */
  via?: readonly Pt[];
  /** Where the planner believes the robot is (stale observation). */
  ghost?: Pt;
}[] = [
  { robot: START },
  { robot: [3, 7] },
  { robot: [4, 7] },
  { robot: [5, 6], via: [[5, 7]], ghost: [4, 7] },
  { robot: [5, 5], ghost: [5, 7] },
  { robot: [5, 5], ghost: [5, 6] },
  { robot: [5, 4.42], ghost: [5, 6] },
];

/** Approximate rendered widths of the SVG callouts (DM Mono: 0.6em advance + 0.06em tracking at 10px). */
const MONO_ADV = 6.6;
const STALE_W = "STALE OBSERVATION".length * MONO_ADV;
const VIOLATION_W = "NO_COLLISION VIOLATED".length * MONO_ADV;
const STALL_W = "ACTUATOR STALL".length * MONO_ADV;

const pts = (p: readonly Pt[]) => p.map(([x, y]) => `${c(x)},${c(y)}`).join(" ");

type FaultPathWindowProps = {
  title: string;
  events: readonly FaultEvent[];
  note: string;
  className?: string;
  /** Simulation only: the fault sequence collapses to one live line (the trace beside it lists every fault). */
  compact?: boolean;
};

export default function FaultPathWindow({ title, events, note, className, compact = false }: FaultPathWindowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const last = Math.min(events.length, FRAMES.length) - 1;
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= last) window.clearInterval(id);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [reduce, inView, run, last]);

  const s = reduce ? last : step;
  const frame = FRAMES[s];
  const travelled: Pt[] = [];
  FRAMES.slice(0, s + 1).forEach((f) => {
    if (f.via) travelled.push(...f.via);
    travelled.push(f.robot);
  });

  const replanned = s >= 1;
  const noisy = s >= 2;
  const stall = s >= 5;
  const collided = s >= last;
  const done = s >= last;
  const clock = events[s]?.t ?? 0;

  const restart = () => {
    setStep(0);
    setRun((r) => r + 1);
  };

  const ariaLabel =
    "Illustrative simulated grid world. A robot replans around an obstacle that appears on its path, " +
    "keeps acting on a noisy, delayed observation, stalls mid-maneuver and collides with a second obstacle. " +
    "Fault kinds and timings are representative, not a recorded trace. " +
    "The no_collision invariant is violated at the end of the trace.";

  return (
    <figure ref={ref} className={cn("flex flex-col", className)}>
      <div className="overflow-hidden border border-line-2 bg-window shadow-[0_28px_70px_rgb(0_0_0/0.34)]">
        {/* Window bar */}
        <div className="flex h-[47px] items-center justify-between gap-4 border-b border-line px-4 font-mono text-[10px] tracking-[0.08em] text-[#a5b1ad] uppercase sm:px-5">
          <span className="truncate">
            Example <span className="text-line-2">/</span> {title}
          </span>
          <span aria-hidden="true" className="flex gap-1.5">
            <i className="block size-[7px] rounded-full border border-[#798982]" />
            <i className="block size-[7px] rounded-full border border-[#798982]" />
            <i className="block size-[7px] rounded-full border border-[#798982]" />
          </span>
        </div>

        <div className={cn("grid", !compact && "lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]")}>
          {/* Simulation */}
          <div className={cn("px-4 pt-5 sm:px-6 lg:pt-6", compact ? "pb-5" : "border-b border-line pb-6 lg:border-r lg:border-b-0 lg:px-7 lg:pb-7")}>
            <div className="flex items-center justify-between">
              <span className="label-mono text-[10px] text-[#8a9894]">Robot / grid world</span>
              <span className="font-mono text-[11px] tabular-nums text-muted" aria-hidden="true">
                T+{String(clock).padStart(2, "0")}
              </span>
            </div>

            <svg
              viewBox={`-6 -6 ${SIZE + 28} ${SIZE + 12}`}
              role="img"
              aria-label={ariaLabel}
              className={cn("mx-auto mt-4 block w-full", compact ? "max-w-[340px]" : "max-w-[460px]")}
            >
              <defs>
                <pattern id="fpw-grid" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
                  <path d={`M${CELL} 0H0V${CELL}`} stroke="#2a3235" strokeWidth="1" fill="none" />
                </pattern>
                <pattern id="fpw-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <path d="M0 0V6" stroke="#5d6b6c" strokeWidth="1.2" />
                </pattern>
              </defs>

              <rect x="0" y="0" width={SIZE} height={SIZE} fill="url(#fpw-grid)" />
              <rect x="0.5" y="0.5" width={SIZE - 1} height={SIZE - 1} fill="none" stroke="#3b474b" />

              {/* Start + goal */}
              <rect x={c(START[0]) - 9} y={c(START[1]) - 9} width="18" height="18" fill="none" stroke="#5d6b6c" />
              <rect x={c(GOAL[0]) - 11} y={c(GOAL[1]) - 11} width="22" height="22" fill="none" stroke="#c1e29e" strokeOpacity="0.8" />
              <rect x={c(GOAL[0]) - 3} y={c(GOAL[1]) - 3} width="6" height="6" fill="#c1e29e" />
              <text x={c(GOAL[0]) - 11} y={c(GOAL[1]) - 18} className="fill-[#a8b1b0] font-mono" fontSize="10" letterSpacing="0.08em">
                GOAL
              </text>
              <text x={c(START[0]) - 9} y={c(START[1]) + 26} className="fill-[#8a9894] font-mono" fontSize="10" letterSpacing="0.08em">
                START
              </text>

              {/* Plans */}
              <motion.polyline
                points={pts(PLAN_A)}
                fill="none"
                stroke="#9fd5b1"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                initial={false}
                animate={{ opacity: replanned ? 0.16 : 0.75 }}
                transition={{ duration: 0.5 }}
              />
              <AnimatePresence>
                {replanned && (
                  <motion.polyline
                    key="planB"
                    points={pts(PLAN_B)}
                    fill="none"
                    stroke="#9fd5b1"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.75 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                  />
                )}
              </AnimatePresence>

              {/* Obstacles */}
              <AnimatePresence>
                {s >= 1 && (
                  <motion.g key="obsA" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <rect
                      x={OBSTACLE_A[0] * CELL + 3}
                      y={OBSTACLE_A[1] * CELL + 3}
                      width={CELL - 6}
                      height={CELL - 6}
                      fill="url(#fpw-hatch)"
                      stroke="#8a9894"
                    />
                  </motion.g>
                )}
                {s >= 4 && (
                  <motion.g key="obsB" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <rect
                      x={OBSTACLE_B[0] * CELL + 3}
                      y={OBSTACLE_B[1] * CELL + 3}
                      width={CELL - 6}
                      height={CELL - 6}
                      fill={collided ? "#ffa779" : "url(#fpw-hatch)"}
                      fillOpacity={collided ? 0.32 : 1}
                      stroke={collided ? "#ffa779" : "#8a9894"}
                      strokeWidth={collided ? 1.5 : 1}
                    />
                  </motion.g>
                )}
              </AnimatePresence>

              {/* Travelled path */}
              <polyline points={pts(travelled)} fill="none" stroke="#c1e29e" strokeWidth="2.5" strokeLinejoin="miter" />

              {/* Stale observation ghost */}
              <AnimatePresence>
                {frame.ghost && (
                  <motion.g
                    key="ghost"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.g
                      initial={false}
                      animate={{ x: c(frame.ghost[0]), y: c(frame.ghost[1]) }}
                      transition={{ duration: 0.7, ease: EASE }}
                    >
                      <circle r="10" fill="none" stroke="#d6dedb" strokeDasharray="3 3" />
                    </motion.g>
                    <g transform={`translate(${SIZE - 8} ${SIZE - 13})`}>
                      <circle cx={-STALE_W - 14} cy={-3.5} r="5" fill="none" stroke="#d6dedb" strokeDasharray="2 2" />
                      <text textAnchor="end" className="fill-[#d6dedb] font-mono" fontSize="10" letterSpacing="0.06em">
                        STALE OBSERVATION
                      </text>
                    </g>
                  </motion.g>
                )}
              </AnimatePresence>

              {/* Robot */}
              <motion.g
                initial={false}
                animate={{ x: c(frame.robot[0]), y: c(frame.robot[1]) }}
                transition={{ duration: 0.75, ease: EASE }}
              >
                {noisy && !collided && (
                  <circle r="19" fill="none" stroke="#a8b1b0" strokeOpacity="0.55" strokeDasharray="1.5 4" />
                )}
                {stall && !collided && (
                  <circle r="15" fill="none" stroke="#ffa779" strokeWidth="1.25" />
                )}
                <circle r="21" fill="none" stroke="#c1e29e" strokeOpacity="0.35" />
                <circle r="9.5" fill={collided ? "#ffa779" : "#c1e29e"} />
              </motion.g>

              {/* Violation callout */}
              <AnimatePresence>
                {collided && (
                  <motion.g key="hit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
                    <path
                      d={`M${c(OBSTACLE_B[0]) + 13} ${c(OBSTACLE_B[1]) - 8} L${c(OBSTACLE_B[0]) + 34} ${c(OBSTACLE_B[1]) - 34} L${SIZE + 12} ${c(OBSTACLE_B[1]) - 34}`}
                      fill="none"
                      stroke="#ffa779"
                      strokeDasharray="3 3"
                    />
                    <path d={`M${SIZE + 12} ${c(OBSTACLE_B[1]) - 37.5}v7`} stroke="#ffa779" strokeWidth="1.5" />
                    <rect
                      x={SIZE + 12 - VIOLATION_W - 6}
                      y={c(OBSTACLE_B[1]) - 52}
                      width={VIOLATION_W + 6}
                      height={14}
                      fill="#0c1113"
                    />
                    <text
                      x={SIZE + 12}
                      y={c(OBSTACLE_B[1]) - 41}
                      textAnchor="end"
                      className="fill-[#ffa779] font-mono"
                      fontSize="10"
                      letterSpacing="0.06em"
                    >
                      NO_COLLISION VIOLATED
                    </text>
                  </motion.g>
                )}
                {stall && !collided && (
                  <motion.g
                    key="stall"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <rect
                      x={c(frame.robot[0]) + 23}
                      y={c(frame.robot[1]) - 7}
                      width={STALL_W + 6}
                      height={14}
                      fill="#0c1113"
                    />
                    <text
                      x={c(frame.robot[0]) + 26}
                      y={c(frame.robot[1]) + 4}
                      className="fill-[#ffa779] font-mono"
                      fontSize="10"
                      letterSpacing="0.06em"
                    >
                      ACTUATOR STALL
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>

            {compact ? (
              <>
                <p
                  aria-hidden="true"
                  className={cn(
                    "mt-4 min-h-[44px] border-l py-1 pl-3 font-mono text-[11.5px] leading-[1.5]",
                    events[s]?.problem ? "border-orange text-[#ffd0b9]" : "border-lime text-text",
                  )}
                >
                  <span className={cn("block text-[10px] tracking-[0.08em]", events[s]?.problem ? "text-orange" : "text-[#8a9894]")}>
                    T+{String(clock).padStart(2, "0")} / {events[s]?.layer}
                  </span>
                  {events[s]?.text}
                </p>
                <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-3">
                  <p className="font-mono text-[10px] tracking-[0.1em] text-[#8a9894] uppercase">
                    Simulated world <span className="text-line-2">/</span> Illustrative
                  </p>
                  {!reduce && (
                    <button
                  type="button"
                  onClick={() => {
                    if (done) restart();
                  }}
                  aria-disabled={!done}
                  className="label-mono inline-flex min-h-11 items-center gap-2 border border-line-2 px-3 py-2 text-[10px] text-muted transition-colors hover:border-lime hover:text-lime aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:border-line-2 aria-disabled:hover:text-muted"
                >
                  <span aria-hidden="true">↻</span> Replay
                </button>
                  )}
                </div>
              </>
            ) : (
              <p className="mt-4 font-mono text-[10px] tracking-[0.1em] text-[#8a9894] uppercase">
                Simulated world <span className="text-line-2">/</span> Illustrative
              </p>
            )}
          </div>

          {/* Console */}
          {!compact && (
          <div className="flex flex-col px-4 pt-5 pb-5 sm:px-6 lg:px-7 lg:pt-6">
            <span className="label-mono text-[10px] text-[#8a9894]">Fault sequence</span>
            <ol className="mt-5 flex-1 space-y-1">
              {events.map((e, i) => {
                const reached = i <= s;
                const current = i === s;
                return (
                  <li
                    key={`${e.t}-${e.layer}`}
                    className={cn(
                      "border-l py-[7px] pl-3.5 font-mono text-[11.5px] leading-[1.55] transition-[opacity,border-color,color] duration-500",
                      reached ? "opacity-100" : "opacity-35",
                      e.problem && reached
                        ? "border-orange text-[#ffd0b9]"
                        : current
                          ? "border-lime text-text"
                          : "border-[#46534e] text-[#b7c4bf]",
                    )}
                  >
                    <span
                      className={cn(
                        "mb-1 block text-[10px] tracking-[0.08em]",
                        e.problem && reached ? "text-orange" : "text-[#8a9894]",
                      )}
                    >
                      T+{String(e.t).padStart(2, "0")} / {e.layer}
                    </span>
                    {e.text}
                  </li>
                );
              })}
            </ol>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-4">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.08em] text-lime uppercase">
                <span aria-hidden="true" className="size-[6px] rounded-full bg-lime" />
                Illustrative scenario
              </span>
              {!reduce && (
                <button
                  type="button"
                  onClick={() => {
                    if (done) restart();
                  }}
                  aria-disabled={!done}
                  className="label-mono inline-flex min-h-11 items-center gap-2 border border-line-2 px-3 py-2 text-[10px] text-muted transition-colors hover:border-lime hover:text-lime aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:border-line-2 aria-disabled:hover:text-muted"
                >
                  <span aria-hidden="true">↻</span> Replay
                </button>
              )}
            </div>
          </div>
          )}
        </div>
      </div>

      <figcaption className="mt-4 max-w-[720px] font-mono text-[11px] leading-[1.7] text-[#8a9894]">{note}</figcaption>
    </figure>
  );
}
