import Link from "next/link";
import CtaBand from "@/components/sections/CtaBand";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import { ArrowLink } from "@/components/sections/home/shared";
import { Bullets } from "@/components/sections/research/shared";
import { MaturityChip, SECTION_PAD, SectionIntro, mono } from "@/components/sections/technology/shared";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SequenceDiagram from "@/components/visuals/SequenceDiagram";
import { cn } from "@/lib/cn";
import { productAreas, type Link as LinkT, type ProductArea as ProductAreaT, type ProductAreaKey } from "@/lib/content";

/**
 * Product-area page template (/products/software, /products/agents, /products/robotics). Each
 * section answers one question: what can I test (and which failures it checks), what do I
 * connect, one concrete example with one visual (SequenceDiagram), what do I get, what works
 * today, and how do I try it. All copy from lib/content.ts `productAreas`.
 */
export default function ProductArea({ area: key }: { area: ProductAreaKey }) {
  const area: ProductAreaT = productAreas[key];
  return (
    <>
      <PageHeader page={key}>
        <div className="mt-8 md:mt-10">
          <MaturityChip maturity={area.maturity} note={area.maturityNote} />
        </div>
      </PageHeader>
      <WhatYouCanTest area={area} />
      <Connect area={area} />
      <Example area={area} />
      <Outputs area={area} />
      <Today area={area} />
      <TryIt area={area} />
      <NextPage current={key} />
      <CtaBand current={key} copy={area.cta} />
    </>
  );
}

function WhatYouCanTest({ area }: { area: ProductAreaT }) {
  const t = area.test;
  return (
    <Section id="test" aria-labelledby="test-title" className={SECTION_PAD}>
      <SectionIntro kicker={t.kicker} title={t.title} titleMuted={t.titleMuted} titleId="test-title" lede={t.who} />
      <Reveal className="mt-12 border border-line bg-surface p-6 sm:p-8 md:mt-14">
        <h3 className={cn(mono, "text-lime")}>Failures it checks</h3>
        <Bullets items={t.failures} className="mt-5 [&_li]:text-[15.5px] [&_li]:text-text" />
      </Reveal>
    </Section>
  );
}

function Connect({ area }: { area: ProductAreaT }) {
  const c = area.connect;
  return (
    <Section id="connect" variant="charcoal" aria-labelledby="connect-title" className={SECTION_PAD}>
      <SectionIntro kicker={c.kicker} title={c.title} titleId="connect-title" />
      <Reveal as="ul" stagger={0.04} amount={0.1} className="mt-12 border-t border-line md:mt-14">
        {c.items.map((it) => (
          <RevealItem
            key={it.term}
            as="li"
            className="grid gap-x-8 gap-y-1.5 border-b border-line py-5 sm:grid-cols-[220px_minmax(0,1fr)]"
          >
            <h3 className="text-[16px] leading-[1.4] font-semibold tracking-[-0.02em] text-text">{it.term}</h3>
            <p className="max-w-[760px] text-[15px] leading-[1.7] text-muted">{it.detail}</p>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}

function Example({ area }: { area: ProductAreaT }) {
  const e = area.example;
  return (
    <Section id="example" aria-labelledby="example-title" className={SECTION_PAD}>
      <SectionIntro kicker={e.kicker} title={e.title} titleMuted={e.titleMuted} titleId="example-title" lede={e.body} />
      {e.steps && (
        <Reveal as="ol" stagger={0.04} amount={0.1} className="hairline-grid mt-12 grid-cols-1 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {e.steps.map((s) => (
            <RevealItem key={s.label} as="li" className="bg-surface p-5">
              <p className={cn(mono, "leading-[1.4] text-subtle")}>{s.label}</p>
              <p className="mt-2.5 text-[14.5px] leading-[1.6] text-text">{s.text}</p>
            </RevealItem>
          ))}
        </Reveal>
      )}
      <Reveal className={e.steps ? "mt-8" : "mt-12 md:mt-14"} amount={0.05}>
        <SequenceDiagram diagram={e.sequence} />
      </Reveal>
      <div className="mt-5 flex flex-wrap gap-x-8">
        {e.links.map((l) => (
          <ArrowLink key={l.href} href={l.href}>
            {l.label}
          </ArrowLink>
        ))}
      </div>
    </Section>
  );
}

function Outputs({ area }: { area: ProductAreaT }) {
  const o = area.outputs;
  return (
    <Section id="outputs" variant="charcoal" aria-labelledby="outputs-title" className={SECTION_PAD}>
      <SectionIntro kicker={o.kicker} title={o.title} titleId="outputs-title" />
      <Reveal as="ul" stagger={0.04} amount={0.05} className="hairline-grid mt-12 grid-cols-1 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
        {o.items.map((it, i) => (
          <RevealItem key={it.name} as="li" className={cn("bg-surface p-5 sm:p-6", fillLast(i, o.items.length))}>
            <h3 className={cn(mono, "text-lime")}>{it.name}</h3>
            <p className="mt-3 text-[15px] leading-[1.65] text-text">{it.detail}</p>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}

/** In a 2-col (sm) / 3-col (lg) hairline grid, stretch the last item so no empty cell shows. */
function fillLast(i: number, n: number) {
  if (i !== n - 1) return undefined;
  return cn(n % 2 === 1 && "sm:col-span-2", n % 3 === 1 && "lg:col-span-3", n % 3 === 2 && "lg:col-span-2", n % 3 === 0 && "lg:col-span-1");
}

function Today({ area }: { area: ProductAreaT }) {
  const t = area.today;
  const cols = t.items.length === 1 ? "lg:grid-cols-1" : "lg:grid-cols-3";
  return (
    <Section id="today" aria-labelledby="today-title" className={SECTION_PAD}>
      <SectionIntro kicker={t.kicker} title={t.title} titleMuted={t.titleMuted} titleId="today-title" />
      <Reveal as="ul" stagger={0.05} amount={0.05} className={cn("hairline-grid mt-12 grid-cols-1 md:mt-14", cols)}>
        {t.items.map((it) => (
          <RevealItem key={it.id} as="li" id={`support-${it.id}`} className="flex min-w-0 flex-col bg-bg p-6 sm:p-7">
            <h3 className="text-[21px] leading-[1.25] font-semibold tracking-title text-text">{it.name}</h3>
            <MaturityChip maturity={it.maturity} note={it.maturityNote} className="mt-4 self-start" />
            <p className="mt-5 max-w-[760px] text-[15px] leading-[1.7] text-muted">{it.body}</p>
            {it.limits && it.limits.length > 0 && (
              <>
                <p className={cn(mono, "mt-6 text-subtle")}>Limits</p>
                <Bullets items={it.limits} mark="dashed" className="mt-3 [&_li]:text-[14px] [&_li]:text-muted" />
              </>
            )}
            <span aria-hidden="true" className="min-h-4 flex-1" />
            {it.link && (
              <ArrowLink href={it.link.href} className="mt-4 self-start">
                {it.link.label}
              </ArrowLink>
            )}
          </RevealItem>
        ))}
      </Reveal>
      <Reveal className="mt-8 max-w-[860px]">
        <h3 className={cn(mono, "text-subtle")}>Not yet</h3>
        <Bullets items={t.notYet} mark="dashed" className="mt-4 [&_li]:text-[15px]" />
      </Reveal>
    </Section>
  );
}

function TryIt({ area }: { area: ProductAreaT }) {
  const t = area.tryIt;
  return (
    <Section id="try" variant="charcoal" aria-labelledby="try-title" className={SECTION_PAD}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <div>
          <SectionIntro kicker={t.kicker} title={t.title} titleId="try-title" className="lg:grid-cols-1" />
          <Reveal as="ol" stagger={0.04} amount={0.1} className="mt-10 border-t border-line">
            {t.steps.map((step, i) => (
              <RevealItem key={step} as="li" className="grid grid-cols-[36px_minmax(0,1fr)] gap-x-3 border-b border-line py-4">
                <span aria-hidden="true" className="pt-[3px] font-mono text-[11px] text-lime">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15.5px] leading-[1.65] text-text">{step}</span>
              </RevealItem>
            ))}
          </Reveal>
        </div>
        <Reveal className="lg:pt-[118px]">
          <p className={cn(mono, "text-subtle")}>Read more</p>
          <LinkList links={t.links} className="mt-2" />
        </Reveal>
      </div>
    </Section>
  );
}

function LinkList({ links, className }: { links: readonly LinkT[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {links.map((l) => (
        <li key={l.href} className="border-b border-line last:border-b-0">
          <Link
            href={l.href}
            className="group flex min-h-11 items-center justify-between gap-4 py-3 text-[15px] leading-[1.45] tracking-[-0.01em] text-text transition-colors hover:text-lime"
          >
            <span>{l.label}</span>
            <span aria-hidden="true" className="text-lime transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export { LinkList };
