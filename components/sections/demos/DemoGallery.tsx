import { EvidenceLabel } from "@/components/sections/demo/parts";
import { ArrowLink } from "@/components/sections/home/shared";
import { SECTION_PAD, SectionIntro, mono } from "@/components/sections/technology/shared";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { demos, type DemoCard } from "@/lib/content";
import FlagshipBlock from "./FlagshipBlock";

/**
 * /demos #demo-flagship: the recorded run, rendered inside the page header so it is the first
 * thing on the page, with the before/after result card (which carries the planted-defect label)
 * and the five-step strip (FlagshipBlock, shared with the home page); then the case study link.
 */
export function FlagshipDemo() {
  const f = demos.flagship;
  return (
    <article id={`demo-${f.id}`} aria-labelledby={`demo-${f.id}-title`} className="mt-8 md:mt-10">
      <h2 id={`demo-${f.id}-title`} className="sr-only">
        {f.title}
      </h2>
      <FlagshipBlock />
      <div className="mt-3 flex flex-wrap gap-x-8">
        {f.links
          .filter((l) => !l.href.startsWith("/evidence/"))
          .map((l) => (
            <ArrowLink key={l.href} href={l.href}>
              {l.label}
            </ArrowLink>
          ))}
      </div>
    </article>
  );
}

/** /demos #more-runs: the other recorded runs as compact cards linking to their evidence. */
export default function MoreRuns() {
  const o = demos.others;
  return (
    <Section id="more-runs" variant="charcoal" aria-labelledby="more-runs-title" className={SECTION_PAD}>
      <SectionIntro kicker={o.kicker} title={o.title} titleMuted={o.titleMuted} titleId="more-runs-title" />
      <Reveal className="hairline-grid mt-12 grid-cols-1 md:mt-14 md:grid-cols-2" amount={0.05}>
        {o.cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </Reveal>
    </Section>
  );
}

function Card({ card }: { card: DemoCard }) {
  return (
    <article id={`demo-${card.id}`} aria-labelledby={`demo-${card.id}-title`} className="flex min-w-0 flex-col bg-bg p-6 sm:p-8">
      <EvidenceLabel text={card.label} classes={card.classes} className="self-start" />
      <h3 id={`demo-${card.id}-title`} className="mt-5 text-[22px] leading-[1.25] font-semibold tracking-title text-balance text-text">
        {card.title}
      </h3>
      <p className="mt-3 max-w-[620px] text-[15px] leading-[1.7] text-muted">{card.body}</p>
      <p className={cn(mono, "mt-5 text-subtle")}>{card.status}</p>
      <span aria-hidden="true" className="min-h-4 flex-1" />
      <div className="mt-4 flex flex-wrap gap-x-8">
        {card.links.map((l) => (
          <ArrowLink key={l.href} href={l.href}>
            {l.label}
          </ArrowLink>
        ))}
      </div>
    </article>
  );
}
