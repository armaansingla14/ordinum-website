import Link from "next/link";
import Section from "@/components/ui/Section";
import { demoPage } from "@/lib/content";
import { DemoSectionHead, EvidenceLabel, SourceLine } from "./parts";

const others = demoPage.others;

/** The other two committed demo runs, each with its evidence label: expected behavior and a positive control. */
export default function OtherRuns() {
  return (
    <Section id="other-runs" aria-labelledby="other-runs-title" className="py-[64px] md:py-[96px]">
      <DemoSectionHead id="other-runs-title" kicker={others.kicker} title={others.title} />
      <ul className="hairline-grid mt-10 grid-cols-1 md:mt-14 md:grid-cols-2">
        {others.cards.map((card) => (
          <li key={card.artifact} className="flex min-w-0 flex-col bg-surface p-6 sm:p-8">
            <EvidenceLabel text={card.label} classes={card.classes} className="self-start" />
            <h3 className="mt-5 text-[21px] font-semibold leading-[1.25] tracking-[-0.02em] text-text">{card.title}</h3>
            <p className="mt-3 text-[15px] leading-[1.7] text-muted">{card.body}</p>
            <span aria-hidden="true" className="min-h-5 flex-1" />
            <SourceLine kind="Real report">{card.source}</SourceLine>
          </li>
        ))}
      </ul>
      {/* Where the broker and cross-system evidence lives, with each section's own label. */}
      <div className="mt-8 border-t border-line pt-6">
        <p className="text-[15px] leading-[1.7] text-muted">{others.more.text}</p>
        <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-10">
          {others.more.links.map((l) => (
            <li key={l.href} className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Link
                href={l.href}
                className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-lime uppercase underline decoration-lime/40 underline-offset-4 hover:decoration-lime"
              >
                {l.label}
                <span aria-hidden="true">→</span>
              </Link>
              <span className="font-mono text-[11px] tracking-[0.06em] text-quiet uppercase">{l.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
