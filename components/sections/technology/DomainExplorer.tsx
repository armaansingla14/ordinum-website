"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/cn";
import type { DomainCard } from "@/lib/content";
import { MonoTag, StatusChip, StatusMarker, pad } from "./shared";

/* Local copy (requested move to lib/content.ts as technology.domains.labels). */
const LABELS = {
  listCaption: "System categories",
  hintMobile: "Tap a category",
  hintDesktop: "Select a category",
  adapterYes: "Adapter: yes",
  adapterNo: "Adapter: not yet",
  failureModes: "Potential failure modes",
  enginesToday: "Engines in use today",
  enginesProposed: "Proposed testing engines",
  evidence: "Available evidence",
  conceptual: "Conceptual · not built",
  evidenceLink: { label: "See the research", href: "/research" },
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;
const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** List + side panel on desktop, accordion on mobile. Server snapshot is "mobile"; CSS handles first paint. */
function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

function AdapterTag({
  exists,
  className,
}: {
  exists: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 font-mono text-[10px] leading-none tracking-[0.12em] whitespace-nowrap uppercase",
        exists ? "text-lime" : "text-muted",
        className,
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 10 10" className="size-[10px]">
        {exists ? (
          <path
            d="M1.5 5.2 4 7.5 8.5 2.5"
            fill="none"
            className="stroke-lime"
            strokeWidth="1.5"
          />
        ) : (
          <path
            d="M1.5 5h7"
            fill="none"
            className="stroke-subtle"
            strokeWidth="1.5"
          />
        )}
      </svg>
      {exists ? LABELS.adapterYes : LABELS.adapterNo}
    </span>
  );
}

function DetailList({
  items,
  status,
}: {
  items: readonly string[];
  status: DomainCard["status"];
}) {
  return (
    <ul className="mt-3 grid gap-2">
      {items.map((m) => (
        <li
          key={m}
          className={cn(
            "flex items-start gap-3 px-3 py-[9px] text-[14px] leading-[1.5] tracking-[-0.01em]",
            status === "implemented"
              ? "border border-line bg-surface text-text"
              : "border border-dashed border-line-2 text-muted",
          )}
        >
          <StatusMarker status={status} className="mt-[5px]" />
          {m}
        </li>
      ))}
    </ul>
  );
}

function Details({
  card,
  compact = false,
}: {
  card: DomainCard;
  compact?: boolean;
}) {
  const built = card.status === "implemented";
  return (
    <div className={cn("grid", compact ? "gap-6" : "gap-7")}>
      {!built && (
        <p>
          <MonoTag>{LABELS.conceptual}</MonoTag>
        </p>
      )}
      <div>
        <h4 className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
          {LABELS.failureModes}
        </h4>
        <DetailList items={card.failureModes} status={card.status} />
      </div>
      <div>
        <h4 className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
          {built ? LABELS.enginesToday : LABELS.enginesProposed}
        </h4>
        <DetailList items={card.proposedEngines} status={card.status} />
      </div>
      <div className="border-t border-line pt-5">
        <h4 className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
          {LABELS.evidence}
        </h4>
        <p
          className={cn(
            "mt-2.5 text-[14px] leading-[1.7]",
            built ? "text-text" : "text-muted",
          )}
        >
          {card.evidence}
        </p>
        {card.note && (
          <p className="mt-3 text-[13px] leading-[1.65] text-subtle">
            {card.note}
          </p>
        )}
        {built && (
          <Link
            href={LABELS.evidenceLink.href}
            className="group mt-4 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime uppercase"
          >
            <span className="border-b border-lime/40 pb-0.5 transition-colors duration-200 group-hover:border-lime">
              {LABELS.evidenceLink.label}
            </span>
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

/** "+" on mobile (becomes "−" when open), "→" on desktop when selected. */
function Indicator({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="relative grid size-4 shrink-0 place-items-center"
    >
      <svg
        viewBox="0 0 12 12"
        className="size-3 text-muted lg:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
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

/**
 * Interactive domain cards: one row per system category with status and whether an adapter
 * exists; details (failure modes, engines, evidence) in a side panel on desktop or inline on mobile.
 * Semantics follow the old LayerStack: buttons with aria-expanded (mobile accordion) or
 * aria-current + a shared region (desktop). Arrow keys / Home / End move between rows.
 */
export default function DomainExplorer({
  cards,
}: {
  cards: readonly DomainCard[];
}) {
  const uid = useId();
  const isDesktop = useIsDesktop();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const shown = active ?? 0;
  const btnId = (i: number) => `${uid}-domain-${i}`;
  const regionId = (i: number) => `${uid}-domain-region-${i}`;
  const panelId = `${uid}-domain-panel`;

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
      const last = cards.length - 1;
      let next: number | null = null;
      if (e.key === "ArrowDown") next = i === last ? 0 : i + 1;
      else if (e.key === "ArrowUp") next = i === 0 ? last : i - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = last;
      if (next === null) return;
      e.preventDefault();
      buttons.current[next]?.focus();
    },
    [cards.length],
  );

  const panelCard = cards[shown];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-12 xl:gap-16">
      {/* List ------------------------------------------------------------------------ */}
      <div>
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-line pb-4">
          <p className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
            {LABELS.listCaption} / {pad(cards.length)}
          </p>
          <p className="font-mono text-[10px] tracking-[0.12em] text-subtle uppercase">
            <span className="lg:hidden">{LABELS.hintMobile}</span>
            <span className="hidden lg:inline">{LABELS.hintDesktop}</span>
          </p>
        </div>

        <ul className="grid gap-2">
          {cards.map((card, i) => {
            const built = card.status === "implemented";
            const open = isDesktop ? shown === i : active === i;
            return (
              <li
                key={card.id}
                className={cn(
                  "group/card relative transition-colors duration-200",
                  built
                    ? "border border-lime/35 bg-surface"
                    : "border border-dashed border-line-2 bg-bg/40",
                  "hover:border-[#54665b]",
                  open && "border-[#54665b] bg-surface-2",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -top-px -bottom-px -left-px w-[2px] origin-top bg-lime transition-transform duration-300 ease-out-expo",
                    open ? "scale-y-100" : "scale-y-0",
                  )}
                />
                <h3 className="m-0">
                  <button
                    ref={(el) => {
                      buttons.current[i] = el;
                    }}
                    id={btnId(i)}
                    type="button"
                    aria-expanded={isDesktop ? undefined : open}
                    aria-current={isDesktop && open ? "true" : undefined}
                    tabIndex={isDesktop ? (open ? 0 : -1) : undefined}
                    aria-controls={isDesktop ? panelId : regionId(i)}
                    onClick={() =>
                      setActive(isDesktop ? i : active === i ? null : i)
                    }
                    onFocus={() => {
                      if (isDesktop) setActive(i);
                    }}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className="grid w-full cursor-pointer grid-cols-[22px_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2.5 px-4 py-4 text-left outline-offset-[-2px] sm:gap-x-4 md:px-6 md:py-5"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pt-[3px] font-mono text-[11px] tracking-[0.04em]",
                        built ? "text-lime" : "text-muted",
                      )}
                    >
                      {pad(i + 1)}
                    </span>
                    <span
                      className={cn(
                        "text-[16px] leading-snug font-[550] tracking-[-0.026em] text-balance md:text-[18px]",
                        built || open
                          ? "text-text"
                          : "text-muted group-hover/card:text-text",
                      )}
                    >
                      {card.category}
                    </span>
                    <span className="row-span-2 pt-[3px]">
                      <Indicator open={open} />
                    </span>
                    <span className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <StatusChip status={card.status} />
                      {card.scope && (
                        <span className="font-mono text-[11px] tracking-[0.1em] text-lime/90 uppercase">{card.scope}</span>
                      )}
                      <AdapterTag exists={card.adapterExists} />
                    </span>
                  </button>
                </h3>

                {/* Mobile: inline detail (opacity only; no layout animation). */}
                {!isDesktop && active === i && (
                  <motion.div
                    id={regionId(i)}
                    role="region"
                    aria-labelledby={btnId(i)}
                    className="lg:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                  >
                    <div className="border-t border-line px-4 pt-5 pb-6 md:px-6">
                      <Details card={card} compact />
                    </div>
                  </motion.div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Desktop panel ----------------------------------------------------------------- */}
      <div className="hidden lg:block">
        <div
          id={panelId}
          role="region"
          aria-labelledby={btnId(shown)}
          className="sticky top-[104px] border border-[#3c4749] bg-window shadow-[0_28px_70px_rgba(0,0,0,0.34)]"
        >
          <div className="flex h-[47px] items-center justify-between gap-4 border-b border-line px-6">
            <p className="font-mono text-[10px] tracking-[0.1em] text-[#a5b1ad] uppercase">
              Category {pad(shown + 1)}{" "}
              <span className="text-subtle">/ {pad(cards.length)}</span>
            </p>
            <AdapterTag exists={panelCard.adapterExists} />
          </div>
          <motion.div
            key={panelCard.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
            className="grid gap-7 px-7 pt-7 pb-8 xl:px-8"
          >
            <div className="grid gap-4">
              <p className="text-[28px] leading-[1.12] font-semibold tracking-title text-balance text-text xl:text-[32px]">
                {panelCard.category}
              </p>
              <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <StatusChip status={panelCard.status} />
                {panelCard.scope && (
                  <span className="font-mono text-[11px] tracking-[0.1em] text-lime/90 uppercase">{panelCard.scope}</span>
                )}
              </p>
            </div>
            <Details card={panelCard} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
