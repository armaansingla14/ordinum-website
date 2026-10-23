import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { FACT_SOURCE, STATUS_LABELS, product, type Status } from "@/lib/content";
import { SectionIntro, StatusChip, StatusLegend, StatusMarker } from "./shared";

const COUNT_ORDER = ["implemented", "in-development", "planned"] as const satisfies readonly Status[];

/** "2 implemented · 4 planned" (statuses with zero items are omitted). */
function statusSummary(items: readonly { status: Status }[]) {
  return COUNT_ORDER.map((s) => [s, items.filter((i) => i.status === s).length] as const)
    .filter(([, n]) => n > 0)
    .map(([s, n]) => `${n} ${STATUS_LABELS[s].toLowerCase()}`)
    .join(" · ");
}

/** Vertical hairline + chevron between two layers (decorative). */
function Connector() {
  return (
    <div aria-hidden="true" className="flex h-12 justify-start pl-[40px] sm:pl-[44px] md:h-14 md:pl-[49px] lg:pl-[57px]">
      <span className="relative block w-px bg-line-2">
        <span className="absolute -bottom-px left-1/2 size-[7px] -translate-x-1/2 rotate-45 border-r border-b border-line-2" />
      </span>
    </div>
  );
}

/**
 * Three conceptual layers: A systems under test, B specialized testing engines, C the shared
 * Ordinum infrastructure. Every item carries a status chip; each layer summarises its counts.
 * Server-rendered and static: nothing here is interactive.
 */
export default function PlatformLayers() {
  const { layers } = product;

  return (
    <Section id="platform-layers" variant="charcoal" aria-labelledby="platform-layers-title">
      <SectionIntro
        kicker={layers.kicker}
        title={layers.title}
        titleId="platform-layers-title"
        lede={layers.lede}
        aside={<StatusLegend conceptual />}
      />

      <Reveal as="ol" stagger={0.1} amount={0.05} className="mt-14 md:mt-20">
        {layers.items.map((layer, li) => {
          const total = layer.items.length;
          const allBuilt = layer.items.every((i) => i.status === "implemented");
          return (
            <RevealItem as="li" key={layer.id}>
              {li > 0 && <Connector />}
              <article
                aria-labelledby={`layer-${layer.id}-title`}
                className="grid border border-line bg-bg lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]"
              >
                {/* Layer header ------------------------------------------------ */}
                <header className="relative border-b border-line bg-surface p-6 sm:p-7 lg:border-r lg:border-b-0 lg:p-9">
                  {allBuilt && (
                    <span aria-hidden="true" className="absolute inset-x-0 -top-px h-px bg-lime/70" />
                  )}
                  <div className="flex items-start gap-5">
                    <span
                      aria-hidden="true"
                      className="relative grid size-[34px] shrink-0 place-items-center border border-line-2 bg-window font-mono text-[14px] text-lime md:size-[44px] md:text-[16px]"
                    >
                      <span className="absolute -top-px -left-px size-1.5 border-t border-l border-lime" />
                      {layer.id}
                    </span>
                    <div className="min-w-0">
                      <p aria-hidden="true" className="font-mono text-[10px] tracking-[0.13em] text-subtle uppercase">
                        Layer <span className="text-lime">{layer.id}</span>
                      </p>
                      <h3
                        id={`layer-${layer.id}-title`}
                        className="mt-2 text-[21px] leading-[1.2] font-[550] tracking-title text-balance text-text md:text-[23px]"
                      >
                        <span className="sr-only">Layer {layer.id}: </span>
                        {layer.name}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-5 text-[14.5px] leading-[1.75] text-muted">{layer.body}</p>

                  {/* Status meter: one square per item */}
                  <div className="mt-6 border-t border-line pt-5">
                    <div aria-hidden="true" className="flex flex-wrap gap-[5px]">
                      {layer.items.map((item) => (
                        <StatusMarker key={item.name} status={item.status} className="size-[10px]" />
                      ))}
                    </div>
                    <p className="mt-3 font-mono text-[10px] leading-[1.6] tracking-[0.12em] text-subtle uppercase">
                      {total} items <span aria-hidden="true">/</span>
                      <span className="sr-only">:</span> {statusSummary(layer.items)}
                    </p>
                  </div>
                </header>

                {/* Items ------------------------------------------------------- */}
                <ul className="divide-y divide-line">
                  {layer.items.map((item) => {
                    const built = item.status === "implemented";
                    return (
                      <li
                        key={item.name}
                        className={cn(
                          "grid gap-x-8 gap-y-2.5 px-6 py-5 sm:px-7 md:grid-cols-[150px_minmax(0,1fr)] md:py-6 lg:px-9 xl:grid-cols-[150px_minmax(0,0.9fr)_minmax(0,1.3fr)]",
                          built ? "bg-surface-2/60" : "bg-transparent",
                        )}
                      >
                        <div className="md:pt-[3px]">
                          <StatusChip status={item.status} />
                        </div>
                        <p
                          className={cn(
                            "text-[16px] leading-[1.45] font-[550] tracking-[-0.02em]",
                            built ? "text-text" : "text-muted",
                          )}
                        >
                          {item.name}
                        </p>
                        <p
                          className={cn(
                            "text-[14px] leading-[1.7] md:col-start-2 xl:col-start-auto",
                            built ? "text-muted" : "text-subtle",
                          )}
                        >
                          {item.note}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </article>
            </RevealItem>
          );
        })}
      </Reveal>

      <Reveal>
        <p className="mt-10 max-w-[760px] font-mono text-[11px] leading-[1.7] tracking-[0.04em] text-subtle md:mt-12">
          {FACT_SOURCE.note}
        </p>
      </Reveal>
    </Section>
  );
}
