import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { home, integration } from "@/lib/content";
import { ArrowLink, MaturityChip, SectionIntro } from "./shared";

const { progress } = home;
const items = progress.items.map(integration);

const ROW =
  "grid items-start gap-x-8 gap-y-3 border-b border-line py-5 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)_minmax(0,5fr)]";

/**
 * Home section 4: what exists today, each integration with its own maturity label (they are
 * not equally mature; the pilot scope is in each summary), one named row for what is planned,
 * the one-line platform ambition, and one sourced "why now" line (full version on /vision).
 * Details per integration live on /technology#adapters.
 */
export default function WhatWorksToday() {
  return (
    <Section id="progress" variant="charcoal" aria-labelledby="progress-title">
      <SectionIntro
        kicker={progress.kicker}
        title={progress.title}
        titleMuted={progress.titleMuted}
        titleId="progress-title"
      />

      <Reveal as="ul" stagger={0.04} className="mt-12 border-t border-line-2 md:mt-16">
        {items.map((item) => (
          <RevealItem key={item.id} as="li" className={ROW}>
            <h3 className="text-[17px] leading-[1.35] font-semibold tracking-title text-text">{item.name}</h3>
            <div className="md:col-start-2 md:row-start-1 lg:col-start-2">
              <MaturityChip maturity={item.maturity} />
            </div>
            <p className="text-[14.5px] leading-[1.65] text-muted md:col-start-2 lg:col-start-3 lg:row-start-1">
              {item.summary}
            </p>
          </RevealItem>
        ))}
        <RevealItem as="li" className={ROW}>
          <h3 className="text-[17px] leading-[1.35] font-semibold tracking-title text-muted">{progress.planned.name}</h3>
          <div className="md:col-start-2 md:row-start-1 lg:col-start-2">
            <MaturityChip maturity="planned" />
          </div>
          <p className="text-[14.5px] leading-[1.65] text-subtle md:col-start-2 lg:col-start-3 lg:row-start-1">
            {progress.planned.text}
          </p>
        </RevealItem>
      </Reveal>

      <Reveal className="mt-14 grid gap-8 md:mt-20 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <p className="border-l border-lime/70 pl-5 text-[clamp(20px,2vw,26px)] leading-[1.45] tracking-[-0.03em] text-balance text-text">
            {progress.vision}
          </p>
          <p className="mt-6 max-w-[640px] pl-5 text-[14.5px] leading-[1.65] text-muted">
            <span className="mr-2 font-mono text-[11px] tracking-[0.12em] text-lime uppercase">{progress.whyNow.label}</span>
            {progress.whyNow.text}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-1 lg:col-span-4 lg:flex-col lg:items-start">
          {progress.links.map((l) => (
            <ArrowLink key={l.href} href={l.href}>
              {l.label}
            </ArrowLink>
          ))}
          <ArrowLink href={progress.whyNow.link.href}>{progress.whyNow.link.label}</ArrowLink>
        </div>
      </Reveal>
    </Section>
  );
}
