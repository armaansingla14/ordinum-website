"use client";

import { AnimatePresence, motion, useInView, useReducedMotion, type Transition } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import {
  STATUS_LABELS,
  platformVision,
  technology,
  type ArchitectureNode,
  type Domain,
  type DomainCard,
  type Status,
} from "@/lib/content";

/* -------------------------------------------------------------------------- */
/* Data                                                                        */
/* -------------------------------------------------------------------------- */

type Variant = "home" | "technology";

const domains: readonly Domain[] = platformVision.domains;
const cards: readonly DomainCard[] = technology.domains.cards;
const core = platformVision.core;

/** platformVision.domains[].id -> technology.domains.cards[].id */
const CARD_FOR_DOMAIN: Record<string, string> = {
  applications: "software",
  ai: "ai",
  cloud: "cloud",
  os: "os",
  firmware: "firmware",
  robotics: "robotics",
};

function cardFor(d: Domain): DomainCard | undefined {
  const id = CARD_FOR_DOMAIN[d.id] ?? d.id;
  return cards.find((c) => c.id === id);
}

/** Every node of the technology architecture, by name (status source for the spine). */
const archNodes = new Map<string, ArchitectureNode>(
  technology.architecture.tiers.flatMap((t) => t.nodes as readonly ArchitectureNode[]).map((n) => [n.name, n]),
);

/** The verification spine: five stages, grouping architecture nodes (copy and grouping in lib/content.ts). */
const SPINE = platformVision.spine;

const spine = SPINE.map((s) => ({
  ...s,
  nodes: s.nodes.map((name) => archNodes.get(name)).filter((n): n is ArchitectureNode => n !== undefined),
}));

/** Legend shows "In development" only once something on the map has that status. */
const USED_STATUSES = new Set<Status>([
  core.status,
  ...domains.map((d) => d.status),
  ...spine.flatMap((s) => s.nodes.map((n) => n.status)),
]);

const totalNodes = spine.reduce((n, s) => n + s.nodes.length, 0);
const builtNodes = spine.reduce((n, s) => n + s.nodes.filter((x) => x.status === "implemented").length, 0);

const pad = (n: number) => String(n).padStart(2, "0");
const EASE = [0.16, 1, 0.3, 1] as const;
const mono = "font-mono text-[10px] leading-none tracking-[0.14em] uppercase";

/* -------------------------------------------------------------------------- */
/* Status primitives (exported so other visuals can share one vocabulary)      */
/* -------------------------------------------------------------------------- */

/**
 * Square status marker.
 * implemented = solid lime; in development = dashed lime outline; planned = dashed steel outline.
 */
export function StatusMark({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-[8px] shrink-0",
        status === "implemented" && "bg-lime",
        status === "in-development" && "border border-dashed border-lime",
        status === "planned" && "border border-dashed border-[#8a9897]",
        className,
      )}
    />
  );
}

/** Mono status chip: marker + "IMPLEMENTED" / "IN DEVELOPMENT" / "PLANNED". */
export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        mono,
        "inline-flex shrink-0 items-center gap-2 border px-[7px] py-[5px]",
        status === "implemented" && "border-lime/45 text-lime",
        status === "in-development" && "border-dashed border-lime/60 text-lime",
        status === "planned" && "border-dashed border-line-2 text-muted",
        className,
      )}
    >
      <StatusMark status={status} className="size-[7px]" />
      {STATUS_LABELS[status]}
    </span>
  );
}

/** Legend for the three statuses. */
function Legend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)} aria-label="Status legend">
      {(Object.keys(STATUS_LABELS) as Status[]).filter((s) => s !== "in-development" || USED_STATUSES.has(s)).map((s) => (
        <li key={s} className={cn(mono, "flex items-center gap-2", s === "planned" ? "text-muted" : "text-lime")}>
          <StatusMark status={s} />
          {STATUS_LABELS[s]}
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* Routes                                                                      */
/* -------------------------------------------------------------------------- */

/** Two passes (about 5 s) once in view, then still: under the WCAG 2.2.2 five-second limit. */
const PULSE: Transition = { duration: 2.4, ease: [0.45, 0, 0.55, 1], repeat: 1, repeatDelay: 0 };

/**
 * Horizontal hairline between a domain node and the spine. Implemented routes are solid lime
 * with a packet travelling domain -> spine; planned routes are dashed steel.
 */
function Route({
  status,
  side,
  active,
  animate,
}: {
  status: Status;
  side: "left" | "right";
  active: boolean;
  animate: boolean;
}) {
  const built = status === "implemented";
  return (
    <div aria-hidden="true" className="relative flex items-center">
      <span
        className={cn(
          "block w-full border-t transition-[border-color] duration-300",
          built
            ? active
              ? "border-lime"
              : "border-lime/60"
            : cn("border-dashed", active ? "border-[#8a9897]" : "border-line-2"),
        )}
      />
      {/* Port on the spine edge */}
      <span
        className={cn(
          "absolute top-1/2 size-[5px] -translate-y-1/2",
          side === "left" ? "right-0" : "left-0",
          built ? "bg-lime" : "border border-line-2 bg-window",
        )}
      />
      {built && animate && (
        <motion.span
          className="absolute inset-0"
          initial={{ x: "0%", opacity: 0 }}
          animate={{ x: side === "left" ? ["0%", "100%"] : ["0%", "-100%"], opacity: [0, 1, 1, 0] }}
          transition={PULSE}
        >
          <span
            className={cn(
              "absolute top-1/2 size-[5px] -translate-y-1/2 bg-lime shadow-[0_0_10px_var(--color-lime)]",
              side === "left" ? "left-0" : "right-0",
            )}
          />
        </motion.span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Spine                                                                       */
/* -------------------------------------------------------------------------- */

function Spine({ variant, className }: { variant: Variant; className?: string }) {
  const detailed = variant === "technology";
  return (
    <div className={cn("relative border border-[#3c4749] bg-surface", className)}>
      <div className="border-b border-line px-4 py-4 md:px-5">
        <p className={cn(mono, "text-subtle")}>Shared layer</p>
        <p className="mt-2.5 text-[17px] leading-tight font-semibold tracking-title text-text md:text-[19px]">
          {core.layerName}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className={cn(mono, "inline-flex max-w-full items-center gap-2 border border-lime/45 px-[7px] py-[5px] leading-snug text-lime")}>
            <StatusMark status={core.status} className="size-[7px]" />
            {core.badge}
          </span>
          <span className={cn(mono, "text-subtle")}>
            {builtNodes} / {totalNodes} parts built
          </span>
        </div>
        <p className="mt-2.5 text-[12.5px] leading-snug text-muted">{core.statusNote}</p>
      </div>

      <ol className="relative px-4 py-4 md:px-5" aria-label="Verification layer stages">
        {/* Flow hairline through the stage markers */}
        <span aria-hidden="true" className="absolute top-[26px] bottom-[26px] left-[20.5px] w-px bg-line-2 md:left-[24.5px]" />
        {spine.map((s, i) => {
          const built = s.nodes.filter((n) => n.status === "implemented").length;
          const partial = built > 0 && built < s.nodes.length;
          const stageStatus: Status = built > 0 ? "implemented" : s.nodes.some((n) => n.status === "in-development") ? "in-development" : "planned";
          return (
            <li key={s.id} className={cn("relative grid grid-cols-[18px_minmax(0,1fr)] gap-x-3", i > 0 && "mt-3.5")}>
              <span className="relative z-10 mt-[3px] flex size-[10px] items-center justify-center bg-surface">
                {partial ? (
                  // Split marker: part built, part planned
                  <span aria-hidden="true" className="flex size-[10px] border border-lime">
                    <span className="h-full w-1/2 bg-lime" />
                  </span>
                ) : (
                  <StatusMark status={stageStatus} className="size-[10px]" />
                )}
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-[14px] leading-tight font-[550] tracking-[-0.02em] text-text">
                    <span className="mr-2 font-mono text-[10px] tracking-[0.08em] text-lime">{pad(i + 1)}</span>
                    {s.label}
                  </span>
                  <span className={cn(mono, "text-[9.5px] text-subtle")}>
                    {built}/{s.nodes.length} built
                  </span>
                </p>
                <ul className={cn("mt-1.5 grid gap-1", !detailed && "max-lg:hidden")}>
                  {s.nodes.map((n) => (
                    <li
                      key={n.name}
                      className={cn(
                        "flex items-start gap-2 text-[12.5px] leading-snug",
                        n.status === "implemented" ? "text-muted" : "text-subtle",
                      )}
                    >
                      <StatusMark status={n.status} className="mt-[4px] size-[6px]" />
                      <span>
                        {n.name}
                        <span className="sr-only">: {STATUS_LABELS[n.status]}</span>
                        {detailed && n.note && <span className="block text-[11.5px] text-subtle">{n.note}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Domain detail                                                               */
/* -------------------------------------------------------------------------- */

function DetailBody({ domain, variant }: { domain: Domain; variant: Variant }) {
  const card = cardFor(domain);
  const built = domain.status === "implemented";
  const col = "bg-window px-5 py-5 md:px-6 md:py-6";
  const head = cn(mono, "mb-3.5 text-subtle");
  return (
    <div className={cn("hairline-grid border-0 md:grid-cols-2", variant === "technology" ? "xl:grid-cols-4" : "lg:grid-cols-4")}>
      <div className={col}>
        <p className={head}>Status</p>
        <StatusBadge status={domain.status} />
        {domain.scope && <p className={cn(mono, "mt-2.5 text-[10px] tracking-[0.1em] text-lime/90")}>{domain.scope}</p>}
        <p className={cn("mt-3.5 text-[14px] leading-[1.65]", built ? "text-text" : "text-muted")}>{domain.statusNote}</p>
        <p className="mt-2 text-[13px] leading-[1.6] text-subtle">{domain.examples}</p>
      </div>
      <div className={col}>
        <p className={head}>Example failure modes</p>
        <ul className="grid gap-2">
          {(card?.failureModes ?? []).map((f) => (
            <li key={f} className="flex gap-2.5 text-[14px] leading-[1.55] text-muted">
              <span aria-hidden="true" className="mt-[8px] h-px w-2.5 shrink-0 bg-line-2" />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className={col}>
        <p className={head}>{built ? "Engines in use" : "Intended engines"}</p>
        <ul className="grid gap-2">
          {(card?.proposedEngines ?? []).map((e) => (
            <li key={e} className="flex gap-2.5 text-[14px] leading-[1.55] text-muted">
              <StatusMark status={domain.status} className="mt-[6px] size-[6px]" />
              {e}
            </li>
          ))}
        </ul>
      </div>
      <div className={col}>
        <p className={head}>Adapter &amp; evidence</p>
        <p className="flex items-center gap-2.5 text-[14px] text-text">
          <span className={cn(mono, card?.adapterExists ? "text-lime" : "text-muted")}>Adapter</span>
          <span className={card?.adapterExists ? "text-text" : "text-muted"}>{card?.adapterExists ? "Yes" : "Not yet"}</span>
        </p>
        <p className="mt-3 text-[13.5px] leading-[1.6] text-muted">{card?.evidence}</p>
        {card?.note && <p className="mt-3 text-[13px] leading-[1.6] text-subtle">{card.note}</p>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Domain node                                                                 */
/* -------------------------------------------------------------------------- */

function NodeFace({ domain, index, variant, active }: { domain: Domain; index: number; variant: Variant; active: boolean }) {
  const built = domain.status === "implemented";
  return (
    <>
      <span className="flex items-center justify-between gap-3">
        <span className={cn("font-mono text-[11px] tracking-[0.06em]", built ? "text-lime" : "text-subtle")}>{pad(index + 1)}</span>
        <StatusBadge status={domain.status} className="py-[4px] text-[9.5px]" />
      </span>
      <span
        className={cn(
          "mt-3 block text-[16px] leading-[1.25] font-[550] tracking-[-0.026em] transition-colors duration-200",
          built || active ? "text-text" : "text-[#cfd6d3]",
          variant === "technology" && "xl:text-[17px]",
        )}
      >
        {domain.name}
      </span>
      {domain.scope && (
        <span className={cn(mono, "mt-2 block text-[10px] leading-snug tracking-[0.1em] text-lime/90")}>{domain.scope}</span>
      )}
      {variant === "technology" && (
        <span className="mt-1.5 block text-[13px] leading-snug text-subtle">{domain.examples}</span>
      )}
    </>
  );
}

function nodeShell(status: Status, active: boolean) {
  const built = status === "implemented";
  return cn(
    "group/node relative block w-full cursor-pointer border text-left transition-[background-color,border-color] duration-200",
    "outline-offset-[-2px]",
    built ? "border-lime/45 bg-surface-2" : "border-dashed border-line-2 bg-bg/60",
    !active && "hover:border-[#54665b]",
    active && (built ? "border-lime bg-[#18201c]" : "border-solid border-[#6d7d7b] bg-surface"),
  );
}

/* -------------------------------------------------------------------------- */
/* PlatformMap                                                                 */
/* -------------------------------------------------------------------------- */

type PlatformMapProps = { variant?: Variant; className?: string };

/**
 * Visual 1: cross-system architecture. Six system domains route into one shared Ordinum
 * verification layer (orchestration -> engines -> evidence -> verification -> regression).
 * Status comes from lib/content.ts; only robotics (ROS 2 / Nav2) and the core are implemented.
 *
 * - lg+: domains in two columns either side of the spine, joined by hairline routes; selecting a
 *   domain (click or focus; one tab stop, arrow keys move) fills the shared detail panel below
 *   (aria-current + aria-controls).
 * - < lg: a vertical list feeding a bus into the spine; tapping a domain expands it inline
 *   (aria-expanded). No hover needed.
 * Arrow keys / Home / End move between domains.
 */
export default function PlatformMap({ variant = "home", className }: PlatformMapProps) {
  const uid = useId();
  const reduce = useReducedMotion();
  const figureRef = useRef<HTMLElement>(null);
  const inView = useInView(figureRef, { amount: 0.35, once: true });
  const animate = inView && !reduce;

  const defaultIndex = Math.max(
    0,
    domains.findIndex((d) => d.status === "implemented"),
  );
  const [selected, setSelected] = useState(defaultIndex);
  const [open, setOpen] = useState<number | null>(null);

  const desktopButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const panelId = `${uid}-panel`;
  const regionId = (i: number) => `${uid}-region-${i}`;
  const mBtnId = (i: number) => `${uid}-m-${i}`;
  const dBtnId = (i: number) => `${uid}-d-${i}`;

  const half = Math.ceil(domains.length / 2);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number, refs: typeof desktopButtons) {
    const last = domains.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    refs.current[next]?.focus();
  }

  const selectedDomain = domains[selected];

  return (
    <figure
      ref={figureRef}
      className={cn("relative border border-[#3c4749] bg-window shadow-[0_28px_70px_rgba(0,0,0,0.3)]", className)}
      aria-labelledby={`${uid}-caption`}
    >
      {/* Window bar */}
      <div className="flex min-h-10 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-2.5 md:px-5">
        <span className={cn(mono, "flex items-center gap-2.5 text-muted")}>
          <span aria-hidden="true" className="flex gap-[5px]">
            <i className="block size-[6px] rounded-full border border-subtle/80" />
            <i className="block size-[6px] rounded-full border border-subtle/80" />
            <i className="block size-[6px] rounded-full border border-subtle/80" />
          </span>
          Platform map
        </span>
        <span className={cn(mono, "border border-line-2 px-[7px] py-[5px] text-subtle")}>Conceptual</span>
      </div>

      <div className="relative">
        <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0" />

        {/* ---------------------------------------------------------------- */}
        {/* Desktop: two columns of domains around the spine                 */}
        {/* ---------------------------------------------------------------- */}
        <div
          className={cn(
            "relative hidden lg:grid lg:grid-cols-[minmax(0,1fr)_44px_minmax(0,1.12fr)_44px_minmax(0,1fr)] lg:gap-y-4",
            variant === "technology" ? "lg:p-8 xl:p-10 xl:grid-cols-[minmax(0,1fr)_64px_minmax(0,1.1fr)_64px_minmax(0,1fr)]" : "lg:p-7 xl:p-8",
          )}
          style={{ gridTemplateRows: `repeat(${half}, minmax(0, 1fr))` }}
        >
          <div className="flex items-center" style={{ gridRow: "1 / -1", gridColumn: 3 }}>
            <Spine variant={variant} className="w-full" />
          </div>
          {domains.map((d, i) => {
            const left = i < half;
            const row = (left ? i : i - half) + 1;
            const active = selected === i;
            return (
              <div key={d.id} className="contents">
                <div className="flex items-center" style={{ gridRow: row, gridColumn: left ? 1 : 5 }}>
                  <button
                    ref={(el) => {
                      desktopButtons.current[i] = el;
                    }}
                    id={dBtnId(i)}
                    type="button"
                    aria-current={active ? "true" : undefined}
                    tabIndex={active ? 0 : -1}
                    aria-controls={panelId}
                    onClick={() => setSelected(i)}
                    onFocus={() => setSelected(i)}
                    onKeyDown={(e) => onKeyDown(e, i, desktopButtons)}
                    className={cn(nodeShell(d.status, active), "px-4 py-4 xl:px-5")}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute -top-px -bottom-px w-[2px] origin-top transition-transform duration-300 ease-out-expo",
                        left ? "-right-px" : "-left-px",
                        d.status === "implemented" ? "bg-lime" : "bg-[#8a9897]",
                        active ? "scale-y-100" : "scale-y-0",
                      )}
                    />
                    <NodeFace domain={d} index={i} variant={variant} active={active} />
                  </button>
                </div>
                <div style={{ gridRow: row, gridColumn: left ? 2 : 4 }} className="flex">
                  <div className="w-full self-center">
                    <Route status={d.status} side={left ? "left" : "right"} active={active} animate={animate} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Mobile / tablet: list -> bus -> spine                             */}
        {/* ---------------------------------------------------------------- */}
        <div className="relative px-4 pt-5 pb-5 md:px-6 md:pt-6 lg:hidden">
          <p className={cn(mono, "mb-4 flex justify-between gap-4 text-subtle")}>
            <span>Systems / {pad(domains.length)}</span>
            <span>Tap for detail</span>
          </p>
          <ul className="relative grid gap-2 pl-[22px]">
            {domains.map((d, i) => {
              const built = d.status === "implemented";
              const isOpen = open === i;
              const lastIdx = domains.length - 1;
              return (
                <li key={d.id} className="relative">
                  {/* Bus: from this node's tick down to the next tick (or into the spine).
                      Lime once an implemented system has joined the bus, dashed steel before. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-[26px] -left-[16px] w-0 border-l",
                      i === lastIdx ? "-bottom-[22px]" : "-bottom-[34px]",
                      domains.slice(0, i + 1).some((x) => x.status === "implemented")
                        ? "border-lime/70"
                        : "border-dashed border-line-2",
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-[26px] -left-[16px] w-[16px] border-t",
                      built ? "border-lime/70" : "border-dashed border-line-2",
                    )}
                  />
                  <h3 className="m-0">
                    <button
                      ref={(el) => {
                        mobileButtons.current[i] = el;
                      }}
                      id={mBtnId(i)}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={regionId(i)}
                      onClick={() => setOpen(isOpen ? null : i)}
                      onKeyDown={(e) => onKeyDown(e, i, mobileButtons)}
                      className={cn(nodeShell(d.status, isOpen), "px-3.5 py-3.5 sm:px-4")}
                    >
                      <NodeFace domain={d} index={i} variant={variant} active={isOpen} />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="region"
                        id={regionId(i)}
                        role="region"
                        aria-labelledby={mBtnId(i)}
                        className="border-x border-b border-line"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
                      >
                        <DetailBody domain={d} variant={variant} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
          <div className="relative mt-[22px]">
            <Spine variant={variant} />
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Desktop detail panel                                             */}
        {/* ---------------------------------------------------------------- */}
        <div
          id={panelId}
          role="region"
          aria-labelledby={dBtnId(selected)}
          className="relative hidden border-t border-line lg:block"
        >
          <div className="flex items-center justify-between gap-4 border-b border-line bg-window px-6 py-3.5">
            <p className="text-[15px] font-[550] tracking-[-0.02em] text-text">
              <span className="mr-3 font-mono text-[11px] tracking-[0.06em] text-subtle">
                {pad(selected + 1)} / {pad(domains.length)}
              </span>
              {selectedDomain.name}
            </p>
            <p className={cn(mono, "text-subtle")}>Select a system · arrow keys to move</p>
          </div>
          <motion.div
            key={selectedDomain.id}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
          >
            <DetailBody domain={selectedDomain} variant={variant} />
          </motion.div>
        </div>
      </div>

      {/* Caption + legend (all breakpoints) */}
      <figcaption className="flex flex-col gap-3 border-t border-line px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6 md:px-5">
        <span id={`${uid}-caption`} className="text-[13.5px] leading-snug text-muted">
          {platformVision.label}
        </span>
        <Legend />
      </figcaption>
    </figure>
  );
}
