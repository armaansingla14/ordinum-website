import Link from "next/link";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { PLAN_BASIS_LABELS, today, type PlanBasis } from "@/lib/content";
import { SectionIntro, StatusMarker } from "./shared";

const pad = (n: number) => String(n + 1).padStart(2, "0");

/** Planned items grouped by basis, in the same two sub-labels /technology uses. */
const plannedGroups = (["roadmap", "vision"] as const satisfies readonly PlanBasis[])
  .map((basis) => ({ basis, items: today.planned.filter((p) => p.basis === basis) }))
  .filter((g) => g.items.length > 0);

/**
 * Home section 5: a compact, unambiguous split between what exists in code and tests and
 * what does not yet. The full inventory lives on /technology#status (one source of truth).
 */
export default function WhatWorksToday() {
  return (
    <Section id="today" variant="charcoal" aria-labelledby="today-title">
      <SectionIntro
        kicker={today.kicker}
        title={today.title}
        titleMuted={today.titleMuted}
        titleId="today-title"
        lede={today.lede}
      />

      <div className="hairline-grid mt-12 grid-cols-1 md:mt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        {/* Implemented: the column header carries the status, so cards don't repeat it. */}
        <div className="relative bg-surface">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-lime" />
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <h3 className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] text-lime uppercase">
              <StatusMarker status="implemented" className="size-[8px]" />
              {today.implementedLabel}
            </h3>
            <span className="font-mono text-[11px] tracking-[0.1em] text-subtle">
              {String(today.implemented.length).padStart(2, "0")}
            </span>
          </div>
          <Reveal as="ol" stagger={0.04} className="grid grid-cols-1 sm:grid-cols-2">
            {today.implemented.map((item, i) => (
              <RevealItem
                key={item.title}
                as="li"
                className={cn(
                  "relative border-line p-5 sm:p-6",
                  i > 0 && "border-t",
                  i === 1 && "sm:border-t-0",
                  i % 2 === 1 && "sm:border-l",
                  // Odd count: the last card spans both columns.
                  i === today.implemented.length - 1 && i % 2 === 0 && "sm:col-span-2",
                )}
              >
                <span aria-hidden="true" className="absolute top-5 bottom-5 left-0 w-[2px] bg-lime/70 sm:top-6 sm:bottom-6" />
                <span className="font-mono text-[11px] tracking-[0.08em] text-lime">{pad(i)}</span>
                <h4 className="mt-3 text-[17px] leading-[1.3] font-semibold tracking-title text-text">{item.title}</h4>
                <p className="mt-2.5 text-[14px] leading-[1.7] text-muted">{item.body}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>

        {/* Planned: names only, grouped by basis; details on /technology. */}
        <div className="flex flex-col bg-bg">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <h3 className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] text-text uppercase">
              <StatusMarker status="planned" className="size-[8px]" />
              {today.plannedLabel}
            </h3>
            <span className="font-mono text-[11px] tracking-[0.1em] text-subtle">
              {String(today.planned.length).padStart(2, "0")}
            </span>
          </div>
          <Reveal className="flex-1 px-5 py-5 sm:px-6 sm:py-6">
            {plannedGroups.map((g, gi) => (
              <div key={g.basis} className={cn(gi > 0 && "mt-6")}>
                <p className="font-mono text-[11px] tracking-[0.12em] text-subtle uppercase">{PLAN_BASIS_LABELS[g.basis]}</p>
                <ul className="mt-3 grid gap-2.5">
                  {g.items.map((item) => (
                    <li key={item.title} className="flex gap-3 text-[15px] leading-[1.5] text-[#d5dbd8]">
                      <StatusMarker status="planned" className="mt-[7px]" />
                      <span>
                        {item.title}
                        {item.body && <span className="mt-1 block text-[13.5px] leading-[1.6] text-muted">{item.body}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
          <div className="border-t border-line px-5 py-4 sm:px-6">
            <Link
              href={today.statusLink.href}
              className="group inline-flex min-h-11 items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime uppercase underline-offset-4 hover:underline"
            >
              {today.statusLink.label}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      <Reveal className="mt-8 max-w-[860px] border-l border-lime/70 pl-5">
        <p className="text-[15.5px] leading-[1.75] text-[#c9d1ce]">{today.partnerNote}</p>
      </Reveal>

      <p className="mt-6 max-w-[860px] font-mono text-[11px] leading-[1.7] tracking-[0.06em] text-subtle">{today.footnote}</p>
    </Section>
  );
}
