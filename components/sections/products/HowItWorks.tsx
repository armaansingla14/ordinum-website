import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { SECTION_PAD, SectionIntro, mono } from "@/components/sections/technology/shared";
import { cn } from "@/lib/cn";
import { WORKFLOW_STAGES, platform } from "@/lib/content";

/** /products#how-it-works (redirect target of /how-it-works): the four-stage workflow in full. */
export default function HowItWorks() {
  const h = platform.howItWorks;
  return (
    <Section id={h.id} aria-labelledby={`${h.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={h.kicker} title={h.title} titleMuted={h.titleMuted} titleId={`${h.id}-title`} lede={h.lede} />
      <Reveal as="ol" stagger={0.06} amount={0.05} className="hairline-grid mt-12 grid-cols-1 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
        {WORKFLOW_STAGES.map((s) => (
          <RevealItem key={s.id} as="li" className="flex flex-col bg-surface p-6">
            <span className={cn(mono, "text-lime")}>{s.n}</span>
            <h3 className="mt-5 text-[21px] leading-[1.2] font-semibold tracking-title text-text">{s.label}</h3>
            <p className="mt-3 text-[14.5px] leading-[1.7] text-muted">{s.body}</p>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
