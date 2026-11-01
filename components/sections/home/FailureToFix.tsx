import { EvidenceLabel } from "@/components/sections/demo/parts";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { flagship, home } from "@/lib/content";
import { ArrowLink, SectionIntro } from "./shared";

const { fix } = home;
const stats = fix.stats
  .map((k) => flagship.stats.find((s) => s.k === k))
  .filter((s): s is (typeof flagship.stats)[number] => s !== undefined);

/**
 * Home section 5: the flagship failure-to-fix case. The planted-control label is shown before any
 * number; every number comes from `flagship` in lib/content.ts (run of 1 November 2026, 768a9b5).
 */
export default function FailureToFix() {
  return (
    <Section id="failure-to-fix" aria-labelledby="fix-title" className="py-[72px] md:py-[104px]">
      <SectionIntro kicker={fix.kicker} title={fix.title} titleMuted={fix.titleMuted} titleId="fix-title" lede={fix.lede} />
      <Reveal className="mt-10 md:mt-14" amount={0.1}>
        <EvidenceLabel size="lg" text={flagship.label} classes={flagship.labelClasses} />
        <dl className="hairline-grid mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.k} className="bg-surface p-5 sm:p-6">
              <dt className="font-mono text-[10px] tracking-[0.13em] text-subtle uppercase">{s.k}</dt>
              <dd className="mt-3 text-[16px] leading-[1.5] tracking-[-0.015em] text-text">{s.v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <div className="mt-5 flex flex-wrap gap-x-8">
        {fix.links.map((l) => (
          <ArrowLink key={l.href} href={l.href}>
            {l.label}
          </ArrowLink>
        ))}
      </div>
    </Section>
  );
}
