import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { integration, technology } from "@/lib/content";
import { Disclosure, MaturityChip, MaturityLegend, SECTION_PAD, SectionIntro, mono } from "./shared";

/**
 * Section 2: implemented vs planned adapters. Built integrations get one row each with their
 * exact maturity label (detail and limits behind a native disclosure); in-progress and planned
 * ones share one compact block. Then "One engine, four targets": what was
 * reused and what needed engine changes (no percentages).
 */
export default function Adapters() {
  const a = technology.adapters;
  const items = a.items.map(integration);
  const isBuilt = (m: string) => m === "validated" || m === "experimental";
  const built = items.filter((it) => isBuilt(it.maturity));
  const notBuilt = items.filter((it) => !isBuilt(it.maturity));
  const r = a.reuse;

  return (
    <Section id={a.id} variant="charcoal" aria-labelledby={`${a.id}-title`} className={SECTION_PAD}>
      <SectionIntro
        kicker={a.kicker}
        title={a.title}
        titleMuted={a.titleMuted}
        titleId={`${a.id}-title`}
        lede={a.lede}
        aside={<MaturityLegend />}
      />

      <Reveal as="ul" stagger={0.04} amount={0.02} className="mt-12 border-t border-line md:mt-16">
        {built.map((it) => (
          <RevealItem
            as="li"
            key={it.id}
            className="grid gap-x-10 gap-y-3 border-b border-line py-6 md:grid-cols-[230px_minmax(0,1fr)] md:py-7"
          >
            <div className="flex flex-col items-start gap-2.5 md:pt-[3px]">
              <MaturityChip maturity={it.maturity} />
              {"maturityNote" in it && it.maturityNote && <span className={cn(mono, "text-subtle")}>{it.maturityNote}</span>}
            </div>
            <div className="min-w-0">
              <h3 className="text-[18px] leading-[1.3] font-[550] tracking-[-0.025em] text-text">{it.name}</h3>
              {"targetKind" in it && it.targetKind && <p className={cn(mono, "mt-2 text-subtle")}>{it.targetKind}</p>}
              <p className="mt-2 max-w-[760px] text-[15px] leading-[1.7] text-muted">{it.summary}</p>
              <Disclosure summary="How it works and its limits" className="mt-2">
                <div className="max-w-[760px] space-y-3">
                  <p className="text-[14px] leading-[1.7] text-muted">{it.detail}</p>
                  {it.limits.length > 0 && (
                    <ul className="space-y-1.5">
                      {it.limits.map((l) => (
                        <li key={l} className="flex gap-3 text-[13.5px] leading-[1.6] text-subtle">
                          <span aria-hidden="true" className="mt-[9px] h-px w-3 shrink-0 bg-line-2" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Disclosure>
            </div>
          </RevealItem>
        ))}
      </Reveal>

      {/* Not yet built or not yet stable: one compact block, no per-row disclosure. */}
      <Reveal className="mt-8 border border-dashed border-line-2 px-5 py-5 md:px-7 md:py-6">
        <h3 className={cn(mono, "text-muted")}>{a.notBuiltTitle}</h3>
        <ul className="mt-4 grid gap-x-10 gap-y-4 md:grid-cols-2">
          {notBuilt.map((it) => (
            <li key={it.id} className="min-w-0">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <MaturityChip maturity={it.maturity} />
                <span className="text-[15px] leading-[1.35] font-[550] tracking-[-0.02em] text-muted">{it.name}</span>
              </p>
              <p className="mt-1.5 text-[13.5px] leading-[1.6] text-subtle">{it.summary}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* One engine, four targets -------------------------------------------------- */}
      <Reveal className="mt-16 md:mt-20">
        <div className="border border-line-2 bg-window">
          <div className="border-b border-line px-5 py-6 md:px-8 md:py-7">
            <h3 className="text-[24px] leading-[1.15] font-semibold tracking-title text-text md:text-[28px]">{r.title}</h3>
            <p className="mt-3 max-w-[760px] text-[15px] leading-[1.7] text-muted">{r.body}</p>
          </div>
          <div className="grid gap-px bg-line md:grid-cols-2">
            {[
              { group: r.reused, tone: "lime" as const },
              { group: r.changed, tone: "steel" as const },
            ].map(({ group, tone }) => (
              <div key={group.label} className="bg-window px-5 py-6 md:px-8 md:py-7">
                <p className={cn(mono, tone === "lime" ? "text-lime" : "text-muted")}>{group.label}</p>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 text-[14.5px] leading-[1.7] text-muted">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-[8px] size-[6px] shrink-0",
                          tone === "lime" ? "bg-lime" : "border border-line-2",
                        )}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
