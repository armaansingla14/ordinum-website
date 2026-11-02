import Link from "next/link";
import { ChannelTag, Caveat, MaturityChip, SECTION_PAD, SectionIntro, mono } from "@/components/sections/technology/shared";
import { MaturityMarker } from "@/components/ui/MaturityMarker";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import WorkflowDiagram from "@/components/visuals/WorkflowDiagram";
import { cn } from "@/lib/cn";
import { MATURITY_LABELS, platform, plannedAreas, testingAreas } from "@/lib/content";

/** /products#how-it-works (redirect target of /how-it-works): the five-step workflow diagram, with each step explained. */
export default function HowItWorks() {
  const h = platform.howItWorks;
  return (
    <Section id={h.id} aria-labelledby={`${h.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={h.kicker} title={h.title} titleMuted={h.titleMuted} titleId={`${h.id}-title`} lede={h.lede} />
      <Reveal className="mt-8 md:mt-10" amount={0.05}>
        <WorkflowDiagram detail />
      </Reveal>
    </Section>
  );
}

/** /products#engine: one shared engine behind the four product areas, plus the planned row. */
export function Engine() {
  const e = platform.engine;
  return (
    <Section id={e.id} variant="charcoal" aria-labelledby={`${e.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={e.kicker} title={e.title} titleMuted={e.titleMuted} titleId={`${e.id}-title`} lede={e.lede} />
      <Reveal as="ul" stagger={0.04} amount={0.05} className="mt-8 border-t border-line md:mt-10">
        {testingAreas.map((a) => (
          <RevealItem key={a.key} as="li" className="grid gap-x-8 gap-y-3 border-b border-line py-5 md:grid-cols-[minmax(0,4fr)_minmax(0,5fr)_minmax(0,4fr)]">
            <h3 className="text-[17px] leading-[1.35] font-semibold tracking-[-0.02em]">
              <Link href={a.href} className="group text-text hover:text-lime">
                {a.label}
                <span aria-hidden="true" className="ml-2 inline-block text-lime transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </h3>
            <p className="text-[14.5px] leading-[1.6] text-muted">{a.body}</p>
            <ul className="flex flex-col gap-2.5">
              {a.integrations.map((i) => (
                <li key={i.name} className="flex flex-col items-start gap-1.5">
                  <span className="text-[13.5px] leading-[1.4] text-text">{i.name}</span>
                  <MaturityChip maturity={i.maturity} note={i.note} />
                  <ChannelTag channel={i.channel} />
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
        <li className="grid gap-x-8 gap-y-2 border-b border-dashed border-line-2 py-5 md:grid-cols-[minmax(0,4fr)_minmax(0,9fr)]">
          <p className="text-[17px] leading-[1.35] font-semibold tracking-[-0.02em] text-muted">{plannedAreas.label}</p>
          <p className={cn(mono, "flex items-center gap-2 text-muted")}>
            <MaturityMarker maturity="planned" />
            {MATURITY_LABELS.planned} · not built
          </p>
        </li>
      </Reveal>
    </Section>
  );
}

/** /products#delivery: how Ordinum is delivered today. No install commands: evaluations are guided by the founders. */
export function Delivery() {
  const d = platform.delivery;
  return (
    <Section id={d.id} aria-labelledby={`${d.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={d.kicker} title={d.title} titleMuted={d.titleMuted} titleId={`${d.id}-title`} />
      <Reveal as="ul" stagger={0.04} amount={0.05} className="mt-8 border-t border-line md:mt-10">
        {d.items.map((it) => (
          <RevealItem key={it.term} as="li" className="grid gap-x-8 gap-y-2 border-b border-line py-4 sm:grid-cols-[220px_minmax(0,1fr)]">
            <h3 className={cn(mono, "pt-[5px] text-lime")}>{it.term}</h3>
            <p className="max-w-[760px] text-[15.5px] leading-[1.65] text-text">{it.detail}</p>
          </RevealItem>
        ))}
      </Reveal>
      <Caveat className="mt-6 max-w-[760px]">{d.local}</Caveat>
    </Section>
  );
}
