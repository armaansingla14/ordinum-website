import { WorkflowSteps } from "@/components/sections/home/Workflow";
import { Caveat, SECTION_PAD, SectionIntro, mono } from "@/components/sections/technology/shared";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { platform } from "@/lib/content";

/** /products#how-it-works (redirect target of /how-it-works): the three workflow steps. */
export default function HowItWorks() {
  const h = platform.howItWorks;
  return (
    <Section id={h.id} aria-labelledby={`${h.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={h.kicker} title={h.title} titleMuted={h.titleMuted} titleId={`${h.id}-title`} lede={h.lede} />
      <WorkflowSteps className="mt-12 md:mt-16" />
    </Section>
  );
}

/** /products#install: what you install and configure today, and that it runs on your machine. */
export function Delivery() {
  const d = platform.delivery;
  return (
    <Section id={d.id} variant="charcoal" aria-labelledby={`${d.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={d.kicker} title={d.title} titleMuted={d.titleMuted} titleId={`${d.id}-title`} />
      <Reveal as="ul" stagger={0.04} amount={0.05} className="mt-12 border-t border-line md:mt-14">
        {d.items.map((it) => (
          <RevealItem key={it.term} as="li" className="grid gap-x-8 gap-y-2 border-b border-line py-5 sm:grid-cols-[220px_minmax(0,1fr)]">
            <h3 className={cn(mono, "pt-[5px] text-lime")}>{it.term}</h3>
            <p className="max-w-[760px] text-[15.5px] leading-[1.7] text-text">{it.detail}</p>
          </RevealItem>
        ))}
      </Reveal>
      <Caveat className="mt-8 max-w-[760px]">{d.local}</Caveat>
    </Section>
  );
}
