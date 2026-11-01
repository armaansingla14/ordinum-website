import { EvidenceLabel } from "@/components/sections/demo/parts";
import { ArrowLink } from "@/components/sections/home/shared";
import { SECTION_PAD, SectionIntro, mono } from "@/components/sections/technology/shared";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { demos, type DemoCard } from "@/lib/content";
import FlagshipVideo from "./FlagshipVideo";

/**
 * /demos #demo-flagship: the recorded run, rendered inside the page header so it is the first
 * thing on the page. FlagshipVideo shows the planted-defect label before playback; beside it, the
 * failure and the result in plain words, then the evidence links.
 */
export function FlagshipDemo() {
  const f = demos.flagship;
  return (
    <article id={`demo-${f.id}`} aria-labelledby={`demo-${f.id}-title`} className="mt-10 md:mt-12">
      <h2 id={`demo-${f.id}-title`} className="sr-only">
        {f.title}
      </h2>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-10">
        <FlagshipVideo className="min-w-0" />
        <div className="flex min-w-0 flex-col gap-6 lg:pt-[30px]">
          {[f.failure, f.result].map((b) => (
            <div key={b.label}>
              <h3 className={cn(mono, "text-lime")}>{b.label}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-[#c9d1ce]">{b.text}</p>
            </div>
          ))}
          <div className="flex flex-wrap gap-x-8">
            {f.links.map((l) => (
              <ArrowLink key={l.href} href={l.href}>
                {l.label}
              </ArrowLink>
            ))}
          </div>
        </div>
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
