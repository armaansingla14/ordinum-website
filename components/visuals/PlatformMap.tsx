import { MaturityLegend, MaturityMarker, MonoTag, maturityBox, mono, pad } from "@/components/sections/technology/shared";
import { cn } from "@/lib/cn";
import { FACT_SOURCE, MATURITY_LABELS, technology, type ArchitectureNode, type Maturity } from "@/lib/content";

/*
 * Visual: the one-page architecture overview for /technology section 1.
 * Three tiers, top to bottom: systems through their adapters -> shared engine -> engineering
 * workflows. Every node carries its maturity label as text (no counts, no "N of M built"
 * ratios). Server component, no motion: the tiers are an ordered list, so the flow reads
 * without the connectors and works without JavaScript.
 */

const arch = technology.architecture;
type TierId = (typeof arch.tiers)[number]["id"];

/** Node grid per tier, tuned so every label stays legible from 320px up. */
const TIER_GRID: Record<TierId, string> = {
  adapters: "grid-cols-1 min-[440px]:grid-cols-2 xl:grid-cols-3",
  core: "grid-cols-1 min-[440px]:grid-cols-2 lg:grid-cols-4",
  workflows: "grid-cols-1 min-[440px]:grid-cols-2",
};

const USED: readonly Maturity[] = Array.from(
  new Set(arch.tiers.flatMap((t) => (t.nodes as readonly ArchitectureNode[]).map((n) => n.maturity))),
);

function Connector() {
  return (
    <div aria-hidden="true" className="grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
      <div className="hidden lg:block" />
      <div className="flex h-8 justify-center md:h-10">
        <span className="relative block w-px bg-line-2">
          <span className="absolute -bottom-px left-1/2 size-[7px] -translate-x-1/2 rotate-45 border-r border-b border-line-2" />
        </span>
      </div>
    </div>
  );
}

function Node({ node, compact }: { node: ArchitectureNode; compact: boolean }) {
  const built = node.maturity === "validated" || node.maturity === "experimental";
  return (
    <li className={cn("flex min-w-0 flex-col gap-2 p-3.5 sm:p-4", maturityBox(node.maturity))}>
      <p
        className={cn(
          "text-[14.5px] leading-[1.3] font-[550] tracking-[-0.02em] text-balance",
          built ? "text-text" : "text-muted",
        )}
      >
        {node.name}
      </p>
      <p className={cn(mono, "flex items-center gap-2", node.maturity === "planned" ? "text-subtle" : "text-lime")}>
        <MaturityMarker maturity={node.maturity} className="size-[8px]" />
        {MATURITY_LABELS[node.maturity]}
      </p>
      {!compact && node.note && <p className="text-[12.5px] leading-[1.55] text-subtle">{node.note}</p>}
    </li>
  );
}

type PlatformMapProps = {
  /** "home" hides per-node notes (kept for callers that still pass it). Default "technology". */
  variant?: "home" | "technology";
  className?: string;
};

export default function PlatformMap({ variant = "technology", className }: PlatformMapProps) {
  const compact = variant === "home";
  return (
    <figure className={cn("border border-[#3c4749] bg-window", className)}>
      <div className="flex flex-col gap-3 border-b border-line px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between md:px-5">
        <MaturityLegend only={USED} />
        <MonoTag className="self-start sm:self-auto">Schematic · as of {FACT_SOURCE.commitShort}</MonoTag>
      </div>

      <ol aria-label="Architecture tiers, top to bottom" className="px-4 py-5 sm:px-5 md:px-6 md:py-7">
        {arch.tiers.map((tier, ti) => {
          const core = tier.id === "core";
          return (
            <li key={tier.id}>
              {ti > 0 && <Connector />}
              <section
                aria-labelledby={`arch-tier-${tier.id}`}
                className={cn(
                  "relative grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8",
                  core && "border border-lime/30 p-3.5 sm:p-5",
                )}
              >
                {core && (
                  <>
                    <div aria-hidden="true" className="grid-bg-flat pointer-events-none absolute inset-0" />
                    <span aria-hidden="true" className="absolute -top-px -left-px size-3 border-t border-l border-lime" />
                    <span aria-hidden="true" className="absolute -right-px -bottom-px size-3 border-r border-b border-lime" />
                  </>
                )}
                <header className="relative lg:pt-1">
                  <p className={cn(mono, "text-subtle")}>
                    <span className="text-lime">Tier {pad(ti + 1)}</span>
                  </p>
                  <h3
                    id={`arch-tier-${tier.id}`}
                    className="mt-2.5 text-[18px] leading-[1.2] font-[550] tracking-title text-balance text-text md:text-[20px]"
                  >
                    {tier.name}
                  </h3>
                </header>
                <ul className={cn("relative grid gap-[6px]", TIER_GRID[tier.id])}>
                  {tier.nodes.map((n) => (
                    <Node key={n.name} node={n} compact={compact} />
                  ))}
                </ul>
              </section>
            </li>
          );
        })}
      </ol>

      <figcaption className="border-t border-line px-4 py-3.5 text-[13px] leading-[1.6] text-subtle md:px-5">
        {arch.note}
      </figcaption>
    </figure>
  );
}
