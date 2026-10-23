"use client";

import { motion, useReducedMotion, useScroll } from "motion/react";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { lifecycle, type LifecycleStage } from "@/lib/content";

/* -------------------------------------------------------------------------- */
/* Data                                                                        */
/* -------------------------------------------------------------------------- */

const stages: readonly LifecycleStage[] = lifecycle.stages;
const { guidance } = lifecycle;

/** Optional guidance loop: observed signals may steer what gets generated next. */
const LOOP_FROM = stages.findIndex((s) => s.id === "observe");
const LOOP_TO = stages.findIndex((s) => s.id === "generate");

const EASE = [0.16, 1, 0.3, 1] as const;
const mono = "font-mono text-[10px] leading-none tracking-[0.14em] uppercase";

/* -------------------------------------------------------------------------- */
/* Pieces                                                                      */
/* -------------------------------------------------------------------------- */

/** Window bar: title and the single CONCEPTUAL tag for this figure. */
function WindowBar() {
  return (
    <div className="flex min-h-10 items-center justify-between gap-4 border-b border-line px-4 py-2.5 md:px-5">
      <span className={cn(mono, "flex items-center gap-2.5 text-muted")}>
        <span aria-hidden="true" className="flex gap-[5px]">
          <i className="block size-[6px] rounded-full border border-subtle/80" />
          <i className="block size-[6px] rounded-full border border-subtle/80" />
          <i className="block size-[6px] rounded-full border border-subtle/80" />
        </span>
        Testing lifecycle
      </span>
      <span className={cn(mono, "border border-line-2 px-[7px] py-[5px] text-subtle")}>Conceptual</span>
    </div>
  );
}

function ArtifactBlock({ stage, className }: { stage: LifecycleStage; className?: string }) {
  const a = stage.artifact;
  return (
    <div className={className}>
      <p className={cn(mono, "text-subtle")}>Produces</p>
      <p className="mt-2.5 flex items-start gap-2.5 text-[15px] leading-snug font-[550] tracking-[-0.02em] text-text">
        <span aria-hidden="true" className="mt-[6px] size-[6px] shrink-0 border border-lime" />
        {a.name}
      </p>
      <p className="mt-2 text-[13.5px] leading-[1.65] text-muted">{a.detail}</p>
    </div>
  );
}

function TodayBlock({ stage, className }: { stage: LifecycleStage; className?: string }) {
  return (
    <div className={className}>
      <p className={cn(mono, "text-lime")}>In the engine today</p>
      <p className="mt-2.5 text-[13.5px] leading-[1.65] text-muted">{stage.today}</p>
    </div>
  );
}

function GuidanceNote({ className }: { className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1 border-l border-lime/70 pl-4 text-[14px] leading-[1.7] text-muted", className)}>
      <span className={cn(mono, "shrink-0 text-lime")}>{guidance.label}</span>
      <span>{guidance.text}</span>
      <Link
        href={guidance.link.href}
        className="inline-flex min-h-11 items-center gap-1.5 text-lime underline decoration-lime/40 underline-offset-4 hover:decoration-lime sm:min-h-0"
      >
        {guidance.link.label}
        <span aria-hidden="true">→</span>
      </Link>
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* Desktop: click-to-step rail + detail                                         */
/* -------------------------------------------------------------------------- */

function Stepper() {
  const uid = useId();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const n = stages.length;
  const panelId = `${uid}-panel`;
  const btnId = (i: number) => `${uid}-stage-${i}`;
  const stage = stages[active];

  const go = (i: number, focus = false) => {
    const next = (i + n) % n;
    setActive(next);
    if (focus) buttons.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    go(next, true);
  };

  const col = (i: number) => `${((i + 0.5) / n) * 100}%`;

  return (
    <div className="hidden lg:block">
      <div className="relative px-5 pt-5 xl:px-6">
        {/* Guidance bracket: Observe -> Generate (optional) */}
        {LOOP_FROM > LOOP_TO && LOOP_TO >= 0 && (
          <div aria-hidden="true" className="relative h-[46px]">
            <div
              className="absolute top-[12px] bottom-0 border-x border-t border-dashed border-lime/50"
              style={{ left: col(LOOP_TO), width: `${((LOOP_FROM - LOOP_TO) / n) * 100}%` }}
            >
              <span className={cn(mono, "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-window px-3 whitespace-nowrap text-lime/80")}>
                ↺ Optional guidance signal
              </span>
              <svg viewBox="0 0 9 6" className="absolute -bottom-[1px] left-0 h-[6px] w-[9px] -translate-x-1/2 text-lime/70" fill="currentColor">
                <path d="M0 0 H9 L4.5 6 Z" />
              </svg>
            </div>
          </div>
        )}

        {/* Rail */}
        <div className="relative">
          <span aria-hidden="true" className="absolute top-[30px] h-px bg-line-2" style={{ left: col(0), right: col(0) }} />
          <motion.span
            aria-hidden="true"
            className="absolute top-[30px] h-px origin-left bg-lime"
            style={{ left: col(0), right: col(0) }}
            initial={false}
            animate={{ scaleX: active / (n - 1) }}
            transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
          />
          <div
            role="tablist"
            aria-label="Lifecycle stages"
            aria-orientation="horizontal"
            className="relative grid"
            style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
          >
            {stages.map((s, i) => {
              const on = i === active;
              const done = i < active;
              return (
                <div key={s.id} className="flex">
                  <button
                    ref={(el) => {
                      buttons.current[i] = el;
                    }}
                    id={btnId(i)}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    tabIndex={on ? 0 : -1}
                    aria-controls={panelId}
                    onClick={() => go(i)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className="group/stage flex w-full cursor-pointer flex-col items-center px-1.5 pb-4 text-center outline-offset-[-2px]"
                  >
                    <span className={cn("font-mono text-[11px] tracking-[0.08em]", on || done ? "text-lime" : "text-subtle")}>{s.n}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "relative z-10 mt-[9px] size-[11px] border transition-colors duration-300",
                        on ? "border-lime bg-lime shadow-[0_0_14px_rgb(193_226_158/0.5)]" : done ? "border-lime bg-window" : "border-line-2 bg-window group-hover/stage:border-[#8a9897]",
                      )}
                    />
                    <span
                      className={cn(
                        "mt-3.5 text-[15px] leading-tight font-[550] tracking-[-0.02em] transition-colors duration-200",
                        on ? "text-text" : "text-muted group-hover/stage:text-text",
                      )}
                    >
                      {s.short}
                    </span>
                    <span className={cn("mt-1.5 text-[12px] leading-snug transition-colors duration-200", on ? "text-muted" : "text-subtle")}>
                      {s.artifact.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail */}
      <div id={panelId} role="tabpanel" aria-labelledby={btnId(active)} className="border-t border-line">
        <motion.div
          key={stage.id}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
          className="grid grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,4fr)]"
        >
          <div className="px-6 py-7 xl:px-7">
            <p className={cn(mono, "text-subtle")}>
              Stage <span className="text-lime">{stage.n}</span> / {String(n).padStart(2, "0")}
            </p>
            <h3 className="mt-4 text-[26px] leading-[1.12] font-semibold tracking-title text-balance text-text xl:text-[28px]">{stage.title}</h3>
            <p className="mt-3.5 text-[15px] leading-[1.75] text-muted">{stage.body}</p>
          </div>
          <ArtifactBlock stage={stage} className="border-l border-line px-6 py-7" />
          <TodayBlock stage={stage} className="border-l border-line px-6 py-7" />
        </motion.div>
        <div className="flex items-center justify-between gap-4 border-t border-line">
          <button
            type="button"
            onClick={() => active > 0 && go(active - 1)}
            aria-disabled={active === 0}
            className={cn(
              mono,
              "flex h-11 items-center gap-2 border-r border-line px-5 transition-colors focus-visible:outline-offset-[-2px]",
              active === 0 ? "cursor-default text-subtle/60" : "cursor-pointer text-muted hover:text-lime",
            )}
          >
            <span aria-hidden="true">←</span> Previous
          </button>
          <p className={cn(mono, "text-subtle")} aria-hidden="true">
            Select a stage or use arrow keys
          </p>
          <button
            type="button"
            onClick={() => go(active + 1)}
            className={cn(mono, "flex h-11 cursor-pointer items-center gap-2 border-l border-line px-5 text-muted transition-colors hover:text-lime focus-visible:outline-offset-[-2px]")}
          >
            {active === n - 1 ? "Back to start" : "Next"} <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile / tablet: every stage, vertical, scroll-linked rail                   */
/* -------------------------------------------------------------------------- */

function VerticalList() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.6"] });

  return (
    <ol ref={listRef} className="relative px-4 pt-6 pb-2 md:px-6 lg:hidden" aria-label="Lifecycle stages">
      {/* Rail: steel base, lime fill tied to scroll (static and full under reduced motion) */}
      <span aria-hidden="true" className="absolute top-[34px] bottom-[34px] left-[21px] w-px bg-line-2 md:left-[29px]" />
      <motion.span
        aria-hidden="true"
        className="absolute top-[34px] bottom-[34px] left-[21px] w-px origin-top bg-lime/80 md:left-[29px]"
        style={reduce ? undefined : { scaleY: scrollYProgress }}
      />
      {stages.map((s, i) => (
        <li key={s.id} className={cn("relative grid grid-cols-[28px_minmax(0,1fr)] gap-x-3", i < stages.length - 1 && "pb-9")}>
          <span aria-hidden="true" className="relative z-10 mt-[5px] size-[11px] border border-lime bg-window" />
          <div className="min-w-0">
            <p className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] tracking-[0.08em] text-lime">{s.n}</span>
              <span className={cn(mono, "text-subtle")}>{s.short}</span>
            </p>
            <h3 className="mt-2.5 text-[20px] leading-[1.2] font-semibold tracking-title text-text">{s.title}</h3>
            <p className="mt-2.5 text-[14.5px] leading-[1.7] text-muted">{s.body}</p>
            <div className="mt-4 grid gap-px border border-line bg-line sm:grid-cols-2">
              <ArtifactBlock stage={s} className="bg-window p-4" />
              <TodayBlock stage={s} className="bg-window p-4" />
            </div>
            {i === LOOP_FROM && LOOP_TO >= 0 && (
              <p className={cn(mono, "mt-3.5 text-lime/80")}>↺ May guide stage {stages[LOOP_TO].n} (optional)</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/* Lifecycle                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Visual 2: the adversarial testing lifecycle, Define -> Generate -> Execute -> Observe ->
 * Verify -> Reproduce -> Regress, with the artifact each stage produces. Domain-neutral.
 * - lg+: click-to-step rail (tabs with roving tabindex, arrow keys, Home/End) and a tab panel.
 * - < lg: every stage listed vertically; the rail fills with scroll (static under reduced motion).
 * The rail always names every stage and its artifact, so nothing depends on interaction.
 */
export default function Lifecycle({ className }: { className?: string }) {
  return (
    <div className={className}>
      <figure className="border border-[#3c4749] bg-window shadow-[0_28px_70px_rgba(0,0,0,0.3)]">
        <figcaption className="sr-only">
          The Ordinum testing lifecycle in seven stages, with the artifact each stage produces.
        </figcaption>
        <WindowBar />
        <Stepper />
        <VerticalList />
      </figure>
      <GuidanceNote className="mt-8 max-w-[720px]" />
    </div>
  );
}
