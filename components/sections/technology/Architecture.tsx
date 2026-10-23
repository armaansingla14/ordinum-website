import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import {
  FACT_SOURCE,
  STATUS_LABELS,
  technology,
  type ArchitectureNode,
  type Status,
} from "@/lib/content";
import {
  MonoTag,
  STATUS_ORDER,
  SectionIntro,
  StatusMarker,
  countStatus,
  pad,
  statusBox,
} from "./shared";

/*
 * Local copy (requested move to lib/content.ts as technology.architecture.legend / tierCount).
 * Kept here because this builder does not own content.ts.
 */
const LEGEND_NOTES: Record<Status, string> = {
  implemented: "Code and tests exist in the product repo.",
  "in-development": "Verified work not yet merged. None today.",
  planned: "Not built. Shown to explain the design.",
};

type TierId = (typeof technology.architecture.tiers)[number]["id"];

/** Node grid columns per tier, tuned so every label stays legible from 320px up. */
const TIER_GRID: Record<TierId, string> = {
  systems: "grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-4",
  adapters: "grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-3",
  core: "grid-cols-2 md:grid-cols-4",
  workflows: "grid-cols-1 sm:grid-cols-3",
};

/** Vertical hairline + chevron between tiers (decorative: the order is in the <ol>). */
function Connector() {
  return (
    <div
      aria-hidden="true"
      className="grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10"
    >
      <div className="hidden lg:block" />
      <div className="flex h-11 justify-center md:h-12">
        <span className="relative block w-px bg-line-2">
          <span className="absolute -bottom-px left-1/2 size-[7px] -translate-x-1/2 rotate-45 border-r border-b border-line-2" />
        </span>
      </div>
    </div>
  );
}

function Node({ node, compact }: { node: ArchitectureNode; compact: boolean }) {
  const built = node.status === "implemented";
  return (
    <li
      className={cn(
        "relative flex min-w-0 flex-col",
        statusBox(node.status),
        compact ? "p-3.5 sm:p-4" : "p-4 sm:p-5",
      )}
    >
      {built && (
        <span
          aria-hidden="true"
          className="absolute -top-px -left-px size-2 border-t border-l border-lime"
        />
      )}
      <div className="flex items-start gap-2.5">
        <StatusMarker status={node.status} className="mt-[5px]" />
        <p
          className={cn(
            "min-w-0 leading-[1.3] font-[550] tracking-[-0.02em] text-balance",
            compact
              ? "text-[14px] sm:text-[15px]"
              : "text-[15px] sm:text-[16px]",
            built ? "text-text" : "text-muted",
          )}
        >
          {node.name}
          <span className="sr-only">, {STATUS_LABELS[node.status]}</span>
        </p>
      </div>
      {node.note && (
        <p className="mt-2.5 pl-[19px] text-[13px] leading-[1.6] text-subtle">
          {node.note}
        </p>
      )}
    </li>
  );
}

/**
 * Visual: four-tier architecture. Systems under test feed specialized adapters and engines,
 * which run on shared Ordinum infrastructure, which feeds engineering workflows.
 * Every node carries its implementation status (marker shape + border style + sr-only label).
 * Static, server-rendered; the tiers are an ordered list so the flow reads without the arrows.
 */
export default function Architecture() {
  const a = technology.architecture;
  const all: readonly ArchitectureNode[] = a.tiers.flatMap(
    (t): readonly ArchitectureNode[] => t.nodes,
  );

  return (
    <Section id="architecture" aria-labelledby="architecture-title">
      <SectionIntro
        kicker={a.kicker}
        title={a.title}
        titleMuted={a.titleMuted}
        titleId="architecture-title"
        lede={a.lede}
      />

      {/* Legend --------------------------------------------------------------------- */}
      <Reveal className="mt-12 md:mt-16">
        <div className="flex flex-col gap-4 border-y border-line py-5 md:flex-row md:items-center md:justify-between">
          <ul
            aria-label="Status legend"
            className="grid gap-x-8 gap-y-3 sm:grid-cols-2 md:flex md:flex-wrap"
          >
            {STATUS_ORDER.filter((s) => s !== "in-development" || countStatus(all, s) > 0).map((s) => (
              <li key={s} className="flex items-start gap-3">
                <StatusMarker status={s} className="mt-[3px]" />
                <span>
                  <span
                    className={cn(
                      "block font-mono text-[10px] tracking-[0.12em] uppercase",
                      s === "planned" ? "text-muted" : "text-lime",
                    )}
                  >
                    {STATUS_LABELS[s]} / {pad(countStatus(all, s))}
                  </span>
                  <span className="mt-1 block text-[13px] leading-snug text-subtle">
                    {LEGEND_NOTES[s]}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <MonoTag className="self-start md:self-center">
            Status as of {FACT_SOURCE.commitShort}
          </MonoTag>
        </div>
      </Reveal>

      {/* Tiers ---------------------------------------------------------------------- */}
      {/* Reveal does not forward aria props, so the labelled <ol> sits inside it. */}
      <Reveal stagger={0.1} amount={0.05} className="mt-10 md:mt-14">
        <ol aria-label="Architecture tiers, top to bottom">
          {a.tiers.map((tier, ti) => {
            const core = tier.id === "core";
            return (
              <RevealItem as="li" key={tier.id}>
                {ti > 0 && <Connector />}
                <section
                  aria-labelledby={`tier-${tier.id}`}
                  className={cn(
                    "relative grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10",
                    core
                      ? "border border-lime/30 bg-window p-4 sm:p-6 lg:p-8"
                      : "py-1",
                  )}
                >
                  {core && (
                    <>
                      <div
                        aria-hidden="true"
                        className="grid-bg-flat pointer-events-none absolute inset-0"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute -top-px -left-px size-3 border-t border-l border-lime"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute -right-px -bottom-px size-3 border-r border-b border-lime"
                      />
                    </>
                  )}
                  <header className="relative lg:pt-1">
                    <p className="font-mono text-[10px] tracking-[0.13em] text-subtle uppercase">
                      <span className="text-lime">Tier {pad(ti + 1)}</span>
                      <span aria-hidden="true"> / </span>
                      <span className="sr-only">, </span>
                      {pad(a.tiers.length)}
                    </p>
                    <h3
                      id={`tier-${tier.id}`}
                      className="mt-2.5 text-[20px] leading-[1.2] font-[550] tracking-title text-balance text-text md:text-[22px]"
                    >
                      {tier.name}
                    </h3>
                    <p className="mt-3 font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
                      {STATUS_ORDER.filter(
                        (s) => countStatus(tier.nodes, s) > 0,
                      ).map((s, i) => (
                        <span key={s}>
                          {i > 0 && <span aria-hidden="true"> · </span>}
                          {i > 0 && <span className="sr-only">, </span>}
                          <span
                            className={
                              s === "planned" ? undefined : "text-lime"
                            }
                          >
                            {pad(countStatus(tier.nodes, s))}{" "}
                            {STATUS_LABELS[s].toLowerCase()}
                          </span>
                        </span>
                      ))}
                    </p>
                  </header>
                  <ul
                    className={cn(
                      "relative grid gap-[6px]",
                      TIER_GRID[tier.id],
                    )}
                  >
                    {tier.nodes.map((n) => (
                      <Node key={n.name} node={n} compact={core} />
                    ))}
                  </ul>
                </section>
              </RevealItem>
            );
          })}
        </ol>
      </Reveal>

      <Reveal className="mt-10 grid gap-4 border-t border-line pt-6 md:mt-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-10">
        <p className="max-w-[760px] text-[14px] leading-[1.7] text-muted">
          {a.note}
        </p>
        <p className="max-w-[420px] text-[12px] leading-[1.6] text-subtle md:text-right">
          {FACT_SOURCE.note}
        </p>
      </Reveal>
    </Section>
  );
}
