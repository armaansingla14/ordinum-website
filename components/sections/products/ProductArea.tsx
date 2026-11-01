import Link from "next/link";
import CtaBand from "@/components/sections/CtaBand";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import { ArrowLink } from "@/components/sections/home/shared";
import { Bullets } from "@/components/sections/research/shared";
import { MaturityChip, SECTION_PAD, SectionIntro, mono } from "@/components/sections/technology/shared";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import FlagshipVideo from "@/components/sections/demos/FlagshipVideo";
import SequenceDiagram from "@/components/visuals/SequenceDiagram";
import { cn } from "@/lib/cn";
import { productAreas, type Link as LinkT, type ProductArea as ProductAreaT, type ProductAreaKey } from "@/lib/content";

/**
 * Product-area page template (/products/software, /products/agents, /products/robotics):
 * customer and job, what you connect and define, (robotics: one block per integration with its
 * own boundaries), one sequence diagram, the demo or an honest status, actual outputs,
 * prerequisites / custom work / limitations, Labs and evidence links, one CTA.
 * All copy from lib/content.ts `productAreas`.
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
      <Job area={area} />
      <Connect area={area} />
      {area.blocks && <Blocks area={area} />}
      <Sequence area={area} />
      <Demo area={area} />
      <Outputs area={area} />
      <Fit area={area} />
      <EvidenceLinks area={area} />
      <NextPage current={key} />
      <CtaBand current={key} copy={area.cta} />
    </>
  );
}

function Job({ area }: { area: ProductAreaT }) {
  const j = area.job;
  return (
    <Section id="who" aria-labelledby="who-title" className={SECTION_PAD}>
      <SectionIntro kicker={j.kicker} title={j.title} titleMuted={j.titleMuted} titleId="who-title" />
      <Reveal className="hairline-grid mt-12 grid-cols-1 md:mt-14 md:grid-cols-2">
        <div className="bg-bg p-6 sm:p-8">
          <p className={cn(mono, "text-subtle")}>Who it is for</p>
          <p className="mt-4 text-[17px] leading-[1.6] tracking-[-0.015em] text-text">{j.who}</p>
        </div>
        <div className="bg-surface p-6 sm:p-8">
          <p className={cn(mono, "text-lime")}>The job</p>
          <p className="mt-4 text-[17px] leading-[1.6] tracking-[-0.015em] text-text">{j.job}</p>
        </div>
      </Reveal>
      <p className="mt-5 max-w-[760px] text-[13.5px] leading-[1.65] text-subtle">{j.note}</p>
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

function Blocks({ area }: { area: ProductAreaT }) {
  const b = area.blocks;
  if (!b) return null;
  return (
    <Section id="integrations" aria-labelledby="integrations-title" className={SECTION_PAD}>
      <SectionIntro kicker={b.kicker} title={b.title} titleId="integrations-title" />
      <Reveal as="ul" stagger={0.05} amount={0.05} className="hairline-grid mt-12 grid-cols-1 md:mt-14 lg:grid-cols-3">
        {b.items.map((block) => (
          <RevealItem key={block.id} as="li" id={`block-${block.id}`} className="flex min-w-0 flex-col bg-bg p-6 sm:p-7">
            <h3 className="text-[21px] leading-[1.25] font-semibold tracking-title text-text">{block.name}</h3>
            <MaturityChip maturity={block.maturity} note={block.maturityNote} className="mt-4 self-start" />
            <p className="mt-5 text-[15px] leading-[1.7] text-muted">{block.body}</p>
            <p className={cn(mono, "mt-6 text-subtle")}>Boundaries</p>
            <Bullets items={block.boundaries} mark="dashed" className="mt-3 [&_li]:text-[14px] [&_li]:text-muted" />
            <span aria-hidden="true" className="min-h-4 flex-1" />
            {block.link && <ArrowLink href={block.link.href} className="mt-4 self-start">{block.link.label}</ArrowLink>}
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}

function Sequence({ area }: { area: ProductAreaT }) {
  const s = area.sequence;
  return (
    <Section id="sequence" variant="charcoal" aria-labelledby="sequence-title" className={SECTION_PAD}>
      <SectionIntro kicker={s.kicker} title={s.title} titleId="sequence-title" />
      <Reveal className="mt-12 md:mt-14" amount={0.05}>
        <SequenceDiagram diagram={s} />
      </Reveal>
    </Section>
  );
}

function Demo({ area }: { area: ProductAreaT }) {
  const d = area.demo;
  return (
    <Section id="demo" aria-labelledby="demo-title" className={SECTION_PAD}>
      <SectionIntro kicker={d.kicker} title={d.title} titleId="demo-title" />
      <Reveal className="mt-10 grid gap-8 border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <div>
          <p className="inline-flex items-center gap-2.5 border border-dashed border-line-2 px-3 py-2 font-mono text-[10.5px] tracking-[0.12em] text-[#c9d1cf] uppercase">
            <span aria-hidden="true" className="size-[7px] shrink-0 border border-dashed border-[#9aa8ab]" />
            {d.status}
          </p>
          <p className="mt-5 max-w-[640px] text-[15.5px] leading-[1.75] text-muted">{d.body}</p>
          {d.video && <FlagshipVideo className="mt-8" />}
        </div>
        <LinkList links={d.links} />
      </Reveal>
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

function Fit({ area }: { area: ProductAreaT }) {
  const f = area.fit;
  const cols = [
    { title: "Prerequisites", items: f.prerequisites, mark: "rule" as const },
    { title: "Custom work today", items: f.customWork, mark: "rule" as const },
    { title: "Limitations", items: f.limitations, mark: "dashed" as const },
  ];
  return (
    <Section id="fit" aria-labelledby="fit-title" className={SECTION_PAD}>
      <SectionIntro kicker={f.kicker} title={f.title} titleId="fit-title" />
      <Reveal className="hairline-grid mt-12 grid-cols-1 md:mt-14 lg:grid-cols-3">
        {cols.map((c) => (
          <div key={c.title} className={cn("p-6 sm:p-7", c.title === "Limitations" ? "bg-surface" : "bg-bg")}>
            <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-text">{c.title}</h3>
            <Bullets items={c.items} mark={c.mark} className="mt-5 [&_li]:text-[14.5px]" />
          </div>
        ))}
      </Reveal>
    </Section>
  );
}

function EvidenceLinks({ area }: { area: ProductAreaT }) {
  const l = area.links;
  return (
    <Section id="evidence" variant="charcoal" aria-labelledby="evidence-title" className="py-[56px] md:py-[80px]">
      <Reveal className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <h2 id="evidence-title" className="label-mono text-lime">
            {l.kicker.split(" / ")[0]}
          </h2>
          <p className={cn(mono, "mt-6 text-subtle")}>Evidence packages</p>
          {l.evidence.length > 0 ? (
            <LinkList links={l.evidence} className="mt-2" />
          ) : (
            <p className="mt-3 text-[14.5px] leading-[1.65] text-muted">No evidence package for this area yet.</p>
          )}
        </div>
        <div>
          <p className={cn(mono, "text-subtle lg:mt-[42px]")}>Ordinum Labs</p>
          <LinkList links={l.labs} className="mt-2" />
        </div>
      </Reveal>
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
