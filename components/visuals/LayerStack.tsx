"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import type { Layer, LayerStatus } from "@/lib/content";

type LayerStackProps = {
  layers: readonly Layer[];
  wedge: { readonly today: string; readonly tomorrow: string };
};

const EASE = [0.16, 1, 0.3, 1] as const;
const DESKTOP_QUERY = "(min-width: 1024px)";

/* -------------------------------------------------------------------------- */
/* Breakpoint hook: the stack is an accordion on mobile and a list + detail    */
/* panel on desktop. Server snapshot is "mobile"; CSS handles the first paint. */
/* -------------------------------------------------------------------------- */

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/* -------------------------------------------------------------------------- */
/* Small pieces                                                                */
/* -------------------------------------------------------------------------- */

/** TODAY is an outline chip by default; solid lime only marks the selected layer. */
function StatusChip({ status, solid = false, className }: { status: LayerStatus; solid?: boolean; className?: string }) {
  return status === "today" ? (
    <span
      className={cn(
        "inline-flex shrink-0 items-center border px-[7px] py-[3px] font-mono text-[10px] leading-none tracking-[0.12em] uppercase transition-colors duration-200",
        solid ? "border-lime bg-lime text-bg" : "border-lime/40 bg-transparent text-lime",
        className,
      )}
    >
      Today
    </span>
  ) : (
    <span
      className={cn(
        "inline-flex shrink-0 items-center border border-dashed border-line-2 px-[7px] py-[3px] font-mono text-[10px] leading-none tracking-[0.12em] text-muted uppercase",
        className,
      )}
    >
      Roadmap
    </span>
  );
}

function FaultList({ layer, compact = false }: { layer: Layer; compact?: boolean }) {
  const today = layer.status === "today";
  return (
    <div>
      <p className="label-mono flex items-center justify-between gap-4 text-[10px] text-muted">
        <span>{today ? "Fault kinds / implemented" : "Fault surfaces / planned"}</span>
        <span aria-hidden="true" className="text-subtle">
          {pad(layer.faults.length)}
        </span>
      </p>
      {today ? (
        <ul className={cn("flex flex-wrap gap-2", compact ? "mt-3" : "mt-4")}>
          {layer.faults.map((f) => (
            <li key={f}>
              <code className="inline-flex items-center gap-2 border border-lime/30 bg-lime/[0.06] px-2.5 py-[7px] font-mono text-[12px] leading-none text-lime">
                <span aria-hidden="true" className="size-[5px] bg-lime" />
                {f}
              </code>
            </li>
          ))}
        </ul>
      ) : (
        <ul className={cn("grid gap-2", compact ? "mt-3" : "mt-4")}>
          {layer.faults.map((f) => (
            <li
              key={f}
              className="flex items-center gap-3 border border-dashed border-line-2 px-3 py-[9px] text-[14px] leading-snug tracking-[-0.01em] text-muted"
            >
              <span aria-hidden="true" className="size-[5px] shrink-0 border border-subtle" />
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusLine({ status }: { status: LayerStatus }) {
  return status === "today" ? (
    <p className="label-mono flex items-center gap-2.5 text-[10px] text-lime">
      <span aria-hidden="true" className="size-[6px] rounded-full bg-lime shadow-[0_0_12px_var(--color-lime)]" />
      Implemented in the prototype, in simulation
    </p>
  ) : (
    <p className="label-mono flex items-center gap-2.5 text-[10px] text-muted">
      <span aria-hidden="true" className="size-[6px] rounded-full border border-muted" />
      Not built yet / roadmap
    </p>
  );
}

/** Horizontal 8-segment map: where the selected layer sits, and the today/roadmap split. */
function StackMap({ layers, selected }: { layers: readonly Layer[]; selected: number }) {
  const todayCount = layers.filter((l) => l.status === "today").length;
  const total = layers.length;
  return (
    <div aria-hidden="true">
      <div className="flex gap-[3px] font-mono text-[10px] tracking-[0.12em] uppercase">
        <div style={{ flexGrow: todayCount }} className="basis-0">
          <div className="h-[6px] border-x border-t border-lime" />
          <p className="mt-1.5 text-lime">Today / {pad(todayCount)}</p>
        </div>
        <div style={{ flexGrow: total - todayCount }} className="basis-0">
          <div className="h-[6px] border-x border-t border-dashed border-line-2" />
          <p className="mt-1.5 text-muted">Roadmap / {pad(total - todayCount)}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-[3px]">
        {layers.map((l, i) => {
          const on = i === selected;
          const today = l.status === "today";
          return (
            <div key={l.id} className="flex-1">
              <div
                className={cn(
                  "h-[10px] transition-colors duration-300",
                  today ? (on ? "bg-lime" : "bg-lime/20") : on ? "border border-lime" : "border border-dashed border-line-2",
                )}
              />
              <p
                className={cn(
                  "mt-2 text-center font-mono text-[10px] tracking-[0.08em] transition-colors duration-300",
                  on ? "text-text" : "text-subtle",
                )}
              >
                {pad(i + 1)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** "+" on mobile (rotates to "−" when open), "→" on desktop when selected. */
function Indicator({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative ml-1 grid size-4 shrink-0 place-items-center">
      <svg viewBox="0 0 12 12" className="size-3 text-muted lg:hidden" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M0 6h12" />
        <path
          d="M6 0v12"
          className="origin-center transition-transform duration-300 ease-out-expo"
          style={{ transform: open ? "scaleY(0)" : "scaleY(1)" }}
        />
      </svg>
      <svg
        viewBox="0 0 14 12"
        className={cn(
          "hidden h-3 w-[14px] text-lime transition-[opacity,transform] duration-300 ease-out-expo lg:block",
          open ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M0 6h12M7 1l5 5-5 5" />
      </svg>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* LayerStack                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Eight layers of an autonomous system, split into the slice Ordinum exercises today
 * and the roadmap. Accordion semantics (button + aria-expanded + aria-controls):
 *  - mobile: tap a layer to expand its fault surfaces inline (toggle).
 *  - desktop: focus or click selects a layer (aria-current); details show in a sticky side panel.
 * Arrow keys / Home / End move between layers.
 */
export default function LayerStack({ layers, wedge }: LayerStackProps) {
  const uid = useId();
  const isDesktop = useIsDesktop();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const shown = active ?? 0; // desktop panel always shows something
  const btnId = (i: number) => `${uid}-layer-${i}`;
  const regionId = (i: number) => `${uid}-region-${i}`;
  const panelId = `${uid}-panel`;

  const groups: { status: LayerStatus; label: string; caption: string; items: { layer: Layer; i: number }[] }[] = [
    { status: "today", label: "Today", caption: wedge.today, items: [] },
    { status: "roadmap", label: "Roadmap", caption: wedge.tomorrow, items: [] },
  ];
  layers.forEach((layer, i) => groups[layer.status === "today" ? 0 : 1].items.push({ layer, i }));

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
      const last = layers.length - 1;
      let next: number | null = null;
      if (e.key === "ArrowDown") next = i === last ? 0 : i + 1;
      else if (e.key === "ArrowUp") next = i === 0 ? last : i - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = last;
      if (next === null) return;
      e.preventDefault();
      buttons.current[next]?.focus();
    },
    [layers.length],
  );

  const panelLayer = layers[shown];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12 xl:gap-16">
      {/* ------------------------------------------------------------------ */}
      {/* Layer list                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div>
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-4">
          <p className="label-mono text-[10px] text-muted">Autonomous system / {pad(layers.length)} layers</p>
          <p className="label-mono text-[10px] text-subtle">
            <span className="lg:hidden">Tap a layer</span>
            <span className="hidden lg:inline">Select a layer</span>
          </p>
        </div>

        <div className="grid gap-9">
          {groups.map((g) => {
            const today = g.status === "today";
            const first = g.items[0]?.i ?? 0;
            const lastI = g.items[g.items.length - 1]?.i ?? 0;
            return (
              <div key={g.status} className="relative pl-[26px] md:pl-9">
                {/* Wedge bracket: solid hairline for today's slice, dashed for the roadmap. Lime is reserved for the selection. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute top-[7px] bottom-0 left-0 w-[10px] border-y border-l md:w-[14px]",
                    today ? "border-line-2" : "border-dashed border-line-2",
                  )}
                />

                <div className="mb-4 flex flex-col gap-1.5 md:mb-5 md:flex-row md:items-baseline md:justify-between md:gap-6">
                  <p className={cn("label-mono shrink-0", today ? "text-lime" : "text-muted")}>
                    {g.label} <span aria-hidden="true">/</span>
                    <span className="sr-only">, layers</span> {pad(first + 1)}
                    <span aria-hidden="true">–</span>
                    <span className="sr-only"> to </span>
                    {pad(lastI + 1)}
                  </p>
                  <p className={cn("text-[14px] leading-snug tracking-[-0.01em] md:text-right", today ? "text-muted" : "text-subtle")}>
                    {g.caption}
                  </p>
                </div>

                <ul className="grid gap-2">
                  {g.items.map(({ layer, i }) => {
                    const isToday = layer.status === "today";
                    const open = isDesktop ? shown === i : active === i;
                    const highlighted = isDesktop ? shown === i : active === i;
                    return (
                      <li
                        key={layer.id}
                        className={cn(
                          "group/card relative border transition-colors duration-200",
                          isToday ? "border-line bg-surface" : "border-dashed border-line-2 bg-bg/40",
                          "hover:border-[#54665b]",
                          isToday && "hover:bg-[#19211f]",
                          highlighted && (isToday ? "border-[#54665b] bg-surface-2" : "border-[#54665b] bg-surface"),
                        )}
                      >
                        {/* Active rail */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none absolute -top-px -bottom-px -left-px w-[2px] origin-top bg-lime transition-transform duration-300 ease-out-expo",
                            highlighted ? "scale-y-100" : "scale-y-0",
                          )}
                        />
                        <h3 className="m-0">
                          <button
                            ref={(el) => {
                              buttons.current[i] = el;
                            }}
                            id={btnId(i)}
                            type="button"
                            // Desktop is single-selection (one shared panel): aria-current, not aria-expanded.
                            aria-expanded={isDesktop ? undefined : open}
                            aria-current={isDesktop && open ? "true" : undefined}
                            aria-controls={isDesktop ? panelId : regionId(i)}
                            onClick={() => setActive(isDesktop ? i : active === i ? null : i)}
                            onFocus={() => {
                              if (isDesktop) setActive(i);
                            }}
                            onKeyDown={(e) => onKeyDown(e, i)}
                            className="flex w-full cursor-pointer items-center gap-3 px-4 py-[17px] text-left outline-offset-[-2px] sm:gap-4 md:px-[26px] md:py-[22px]"
                          >
                            <span
                              className={cn(
                                "w-[22px] shrink-0 font-mono text-[11px] tracking-[0.04em]",
                                isToday ? "text-lime" : "text-muted",
                              )}
                            >
                              {pad(i + 1)}
                            </span>
                            <span
                              className={cn(
                                "min-w-0 flex-1 text-[16px] leading-snug font-[550] tracking-[-0.026em] md:text-[18px]",
                                isToday ? "text-text" : "text-muted group-hover/card:text-text",
                                highlighted && "text-text",
                              )}
                            >
                              {layer.name}
                            </span>
                            <span className="hidden font-mono text-[10px] tracking-[0.1em] text-quiet uppercase sm:inline">
                              {pad(layer.faults.length)} {isToday ? (layer.faults.length === 1 ? "fault kind" : "fault kinds") : "surfaces"}
                            </span>
                            <StatusChip status={layer.status} solid={highlighted} />
                            <Indicator open={open} />
                          </button>
                        </h3>

                        {/* Mobile: inline detail */}
                        <AnimatePresence initial={false}>
                          {!isDesktop && active === i && (
                            <motion.div
                              key="region"
                              id={regionId(i)}
                              role="region"
                              aria-labelledby={btnId(i)}
                              className="overflow-hidden lg:hidden"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                            >
                              <div className="grid gap-5 border-t border-line px-4 pt-5 pb-6 md:px-[26px]">
                                <FaultList layer={layer} compact />
                                <p className="text-[14px] leading-[1.7] text-muted">{layer.note}</p>
                                <StatusLine status={layer.status} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Desktop detail panel                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="hidden lg:block">
        <div
          id={panelId}
          role="region"
          aria-labelledby={btnId(shown)}
          className="sticky top-[104px] border border-[#3c4749] bg-window shadow-[0_28px_70px_rgba(0,0,0,0.34)]"
        >
          <div className="flex h-[47px] items-center justify-between gap-4 border-b border-line px-5">
            <p className="font-mono text-[10px] tracking-[0.1em] text-[#a5b1ad] uppercase">
              Layer {pad(shown + 1)} <span className="text-subtle">/ {pad(layers.length)}</span>
            </p>
            <StatusChip status={panelLayer.status} solid />
          </div>

          <motion.div
            key={panelLayer.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
            className="grid gap-7 px-7 pt-7 pb-8 xl:px-8"
          >
            <p className="text-[30px] leading-[1.1] font-semibold tracking-title text-balance text-text xl:text-[34px]">
              {panelLayer.name}
            </p>
            <FaultList layer={panelLayer} />
            <p className="text-[15px] leading-[1.75] text-muted">{panelLayer.note}</p>
            <StatusLine status={panelLayer.status} />
          </motion.div>

          <div className="border-t border-line px-7 pt-6 pb-6 xl:px-8">
            <p className="label-mono mb-4 text-[10px] text-subtle">Position in stack</p>
            <StackMap layers={layers} selected={shown} />
          </div>
        </div>
      </div>
    </div>
  );
}
