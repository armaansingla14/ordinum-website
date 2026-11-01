import { EvidenceLabel } from "@/components/sections/demo/parts";
import { ArrowLink } from "@/components/sections/home/shared";
import { SECTION_PAD, SectionIntro } from "@/components/sections/technology/shared";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { demos, type DemoCard } from "@/lib/content";
import FlagshipVideo from "./FlagshipVideo";

/**
 * /demos gallery. The flagship card plays the recorded run (FlagshipVideo) above its real
 * numbers; the other cards link to their walkthrough and evidence packages.
 */
export default function DemoGallery() {
  const [flagship, ...rest] = demos.cards as readonly DemoCard[];
  return (
    <Section id="gallery" aria-labelledby="gallery-title" className={SECTION_PAD}>
      <SectionIntro kicker={demos.kicker} title={demos.title} titleMuted={demos.titleMuted} titleId="gallery-title" />

      <Reveal className="mt-12 md:mt-16" amount={0.05}>
        <Card card={flagship} featured />
      </Reveal>
      <Reveal className="hairline-grid mt-px grid-cols-1 md:grid-cols-2" amount={0.05}>
        {rest.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </Reveal>

      <p className="mt-8 max-w-[760px] text-[13.5px] leading-[1.65] text-subtle">{demos.note}</p>
    </Section>
  );
}

function Card({ card, featured = false }: { card: DemoCard; featured?: boolean }) {
  return (
    <article
      id={`demo-${card.id}`}
      aria-labelledby={`demo-${card.id}-title`}
      className={cn("flex min-w-0 flex-col p-6 sm:p-8", featured ? "border border-lime/30 bg-surface" : "bg-bg")}
    >
      {featured && card.id === "flagship" && <FlagshipVideo className="mb-10" />}
      <div className={cn("grid gap-8", featured && "lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-12")}>
        <div className="flex min-w-0 flex-col">
          <EvidenceLabel text={card.label} classes={card.classes} className="self-start" />
          <h2
            id={`demo-${card.id}-title`}
            className={cn(
              "mt-5 font-semibold text-balance text-text",
              featured ? "text-[clamp(28px,3.2vw,40px)] leading-[1.1] tracking-display" : "text-[22px] leading-[1.25] tracking-title",
            )}
          >
            {card.title}
          </h2>
          <p className="mt-4 max-w-[620px] text-[15.5px] leading-[1.7] text-muted">{card.body}</p>
          <p className="mt-6 inline-flex items-center gap-2.5 self-start border border-dashed border-line-2 px-3 py-2 font-mono text-[10.5px] tracking-[0.12em] text-[#c9d1cf] uppercase">
            <span aria-hidden="true" className="size-[7px] shrink-0 border border-dashed border-[#9aa8ab]" />
            {card.status}
          </p>
          <span aria-hidden="true" className="min-h-4 flex-1" />
          <div className="mt-4 flex flex-wrap gap-x-8">
            {card.links.map((l) => (
              <ArrowLink key={l.href} href={l.href}>
                {l.label}
              </ArrowLink>
            ))}
          </div>
        </div>
        {card.stats && (
          <dl className="min-w-0 self-start border-t border-line">
            {card.stats.map((s) => (
              <div key={s.k} className="grid grid-cols-1 gap-1 border-b border-line py-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
                <dt className="font-mono text-[10px] tracking-[0.12em] text-subtle uppercase sm:pt-[3px]">{s.k}</dt>
                <dd className="text-[14.5px] leading-[1.55] text-text">{s.v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}
