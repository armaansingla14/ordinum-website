"use client";

import { useInView, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { hero } from "@/lib/content";
import {
  FailingPacket,
  Packet,
  RailStructure,
  StageNodes,
  type Clock,
  type Geometry,
} from "./pipeline/marks";
import { ReproduceReadout, StressReadout, SystemsReadout, VerifyReadout } from "./pipeline/readouts";
import { LOOP, PACKETS, STAGE, STAGE_COUNT, STATIC_T, type PacketDef } from "./pipeline/script";
import { PIPELINE_STAGES as stages } from "./pipeline/stages";

const { ariaLabel, note } = hero.visual;

/* -------------------------------------------------------------------------- */
/* Clock                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * One looping clock (seconds, 0..LOOP) drives every mark. It starts on the fully resolved
 * frame (also the server / no-JS / reduced-motion frame), runs only while the figure is on
 * screen, and freezes on that frame when the visitor prefers reduced motion.
 */
function useLoopClock(active: boolean, reduce: boolean) {
  const clock = useMotionValue(STATIC_T);

  useEffect(() => {
    if (reduce) clock.set(STATIC_T);
  }, [reduce, clock]);

  useEffect(() => {
    if (!active || reduce) return;
    let raf = 0;
    let last: number | null = null;
    const step = (now: number) => {
      // Cap the step so a backgrounded tab resumes smoothly instead of jumping.
      const dt = last === null ? 0 : Math.min((now - last) / 1000, 0.1);
      last = now;
      let next = clock.get() + dt;
      if (next >= LOOP) next -= LOOP;
      clock.set(next);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, reduce, clock]);

  return clock;
}

/** True from `query` once mounted; null on the server and first client render. */
function useMedia(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/* -------------------------------------------------------------------------- */
/* Shared chrome                                                               */
/* -------------------------------------------------------------------------- */

const label = "font-mono text-[10px] leading-none tracking-[0.14em] uppercase";
const pad = (n: number) => String(n + 1).padStart(2, "0");

function WindowBar({
  paused,
  onTogglePause,
  showToggle,
}: {
  paused: boolean;
  onTogglePause: () => void;
  showToggle: boolean;
}) {
  return (
    <div className="flex h-9 items-center justify-between gap-4 border-b border-line pl-4 md:pl-5">
      <span className={cn(label, "flex items-center gap-2.5 text-muted")}>
        <span aria-hidden="true" className="flex gap-[5px]">
          <i className="block size-[6px] rounded-full border border-subtle/80" />
          <i className="block size-[6px] rounded-full border border-subtle/80" />
          <i className="block size-[6px] rounded-full border border-subtle/80" />
        </span>
        <span>Four stages</span>
      </span>
      <span className="flex h-full items-center">
        <span className={cn(label, "pr-4 text-subtle md:pr-5")}>
          <span className="sm:hidden">Conceptual</span>
          <span className="max-sm:hidden">{note}</span>
        </span>
        {showToggle && (
          <button
            type="button"
            onClick={onTogglePause}
            aria-pressed={paused}
            aria-label={paused ? "Play animation" : "Pause animation"}
            className="flex h-full w-10 items-center justify-center border-l border-line text-muted transition-colors hover:text-lime focus-visible:outline-offset-[-2px]"
          >
            <svg viewBox="0 0 10 10" aria-hidden="true" className="size-[10px]">
              {paused ? (
                <path d="M2 1 9 5 2 9Z" fill="currentColor" />
              ) : (
                <path d="M2 1h2v8H2zM6 1h2v8H6z" fill="currentColor" />
              )}
            </svg>
          </button>
        )}
      </span>
    </div>
  );
}

type Readouts = {
  clock: Clock;
  packets: PacketDef[];
  compact?: boolean;
};

function readoutFor(index: number, { clock, packets, compact }: Readouts): ReactNode {
  const align = compact ? "end" : "start";
  switch (index) {
    case STAGE.connect:
      return <SystemsReadout targets={hero.visual.targets} align={align} />;
    case STAGE.stress:
      return <StressReadout clock={clock} packets={packets} align={align} />;
    case STAGE.verify:
      return <VerifyReadout clock={clock} align={align} />;
    default:
      return <ReproduceReadout clock={clock} align={align} />;
  }
}

function Marks({ geo, clock, packets }: { geo: Geometry; clock: Clock; packets: PacketDef[] }) {
  return (
    <>
      <RailStructure geo={geo} />
      <StageNodes geo={geo} clock={clock} packets={packets} />
      {packets
        .filter((p) => !p.failing)
        .map((p) => (
          <Packet key={p.id} p={p} clock={clock} geo={geo} />
        ))}
      <FailingPacket clock={clock} geo={geo} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Desktop: horizontal band                                                    */
/* -------------------------------------------------------------------------- */

const H_W = 980;
const H_H = 34;
const H_STEP = H_W / STAGE_COUNT;
const H_GEO: Geometry = { axis: "x", at: (s) => H_STEP / 2 + H_STEP * s, rail: 17 };

function Horizontal({ clock }: { clock: Clock }) {
  return (
    <div className="relative">
      <div className="relative grid grid-cols-4">
        {stages.map((s, i) => (
          <div key={s.id} className="flex items-center justify-center gap-2 px-2 pt-4">
            <span className={cn(label, "text-lime")}>{pad(i)}</span>
            <span className={cn(label, "text-text")}>{s.label}</span>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${H_W} ${H_H}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
        <Marks geo={H_GEO} clock={clock} packets={PACKETS} />
      </svg>

      {/* Column dividers live only in the readout band, so the rail reads as one continuous flow. */}
      <div className="relative grid grid-cols-4 border-t border-line/70">
        {stages.map((s, i) => (
          <div key={s.id} className={cn("flex flex-col gap-3 px-5 pt-4 pb-4 xl:px-6", i > 0 && "border-l border-line/70")}>
            <div className="min-h-[62px]">{readoutFor(i, { clock, packets: PACKETS })}</div>
            <p className="font-sans text-[13px] leading-[1.4] tracking-[-0.01em] text-balance text-muted">{s.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile / tablet: vertical column                                            */
/* -------------------------------------------------------------------------- */

const ROW = 84;
const V_W = 40;
const V_GEO: Geometry = { axis: "y", at: (s) => ROW / 2 + ROW * s, rail: 20 };
const V_PACKETS = PACKETS.filter((p) => p.compact);

function Vertical({ clock }: { clock: Clock }) {
  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${V_W} ${ROW * STAGE_COUNT}`}
        width={V_W}
        height={ROW * STAGE_COUNT}
        className="absolute top-0 left-1 overflow-visible sm:left-3"
        aria-hidden="true"
      >
        <Marks geo={V_GEO} clock={clock} packets={V_PACKETS} />
      </svg>
      <ol className="relative">
        {stages.map((s, i) => (
          <li
            key={s.id}
            className={cn(
              "grid items-center gap-3 pr-4 pl-[52px] sm:pr-5 sm:pl-[68px]",
              "grid-cols-[minmax(0,1fr)_auto]",
              i > 0 && "border-t border-line/60",
            )}
            style={{ height: ROW }}
          >
            <div className="min-w-0">
              <p className="flex items-baseline gap-2">
                <span className={cn(label, "text-lime")}>{pad(i)}</span>
                <span className={cn(label, "text-text")}>{s.label}</span>
              </p>
              <p className="mt-1.5 text-[12px] leading-snug text-muted">{s.caption}</p>
            </div>
            <div className="flex max-w-[132px] justify-end">
              {readoutFor(i, { clock, packets: V_PACKETS, compact: true })}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PipelineHero                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Ordinum's four stages as a conceptual product diagram: systems connect through a target
 * adapter (the adapters that exist today are named; maturity is in the hero status line), scenarios run with injected faults, independent
 * checks pass most runs and flag one, which is re-run (most re-runs reproduce, not all),
 * reduced to fewer faults and kept as a regression case. Labeled CONCEPTUAL: not recorded
 * data, and no claim of exact replay.
 */
export default function PipelineHero({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.1 });
  const reduce = useReducedMotion() ?? false;
  // WCAG 2.2.2: the loop runs indefinitely, so visitors get an explicit pause control.
  const [paused, setPaused] = useState(false);
  const clock = useLoopClock(inView && !paused, reduce || paused);

  // Only the visible layout follows the live clock; the hidden one stays on a frozen frame.
  const isDesktop = useMedia("(min-width: 1024px)");
  const frozen = useMotionValue(STATIC_T);
  const hClock = isDesktop === false ? frozen : clock;
  const vClock = isDesktop === true ? frozen : clock;

  return (
    <div
      ref={ref}
      className={cn(
        "relative border border-line-2 bg-window/90 shadow-[0_28px_80px_rgb(0_0_0/0.38)] backdrop-blur-[2px]",
        className,
      )}
    >
      <WindowBar paused={paused} onTogglePause={() => setPaused((p) => !p)} showToggle={!reduce} />
      <div role="img" aria-label={ariaLabel}>
        <div className="hidden lg:block">
          <Horizontal clock={hClock} />
        </div>
        <div className="lg:hidden">
          <Vertical clock={vClock} />
        </div>
      </div>
    </div>
  );
}
