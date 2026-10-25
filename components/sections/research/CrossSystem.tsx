import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { FACT_SOURCE, research } from "@/lib/content";
import { Provenance } from "./badges";
import { Bullets, ResultList, SectionHead, SubHead, TargetAside } from "./shared";

const x = research.crossSystem;

/**
 * Cross-system testbed (xsys): our own four-process system under test, built and experimental.
 * Only the registry-approved numbers appear, each with its source. The engine-campaign figures
 * recorded only in a commit message are omitted until the founder confirms them.
 */
export default function CrossSystem() {
  return (
    <Section id={x.id} variant="charcoal" aria-labelledby="xsys-title">
      <SectionHead id="xsys-title" kicker={x.kicker} title={x.title} titleMuted={x.titleMuted} lede={x.lede} aside={<TargetAside id="xsys" />} />

      <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <SubHead id="xsys-policy">Written policy, one check per clause</SubHead>
          <ul aria-labelledby="xsys-policy" className="mt-4 border-t border-line">
            {x.policy.map((p) => (
              <li key={p.id} className="grid grid-cols-1 gap-1 border-b border-line py-3.5 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-4">
                <span className="font-mono text-[11px] tracking-[0.06em] text-lime">{p.id}</span>
                <span className="text-[14.5px] leading-[1.6] text-text">{p.text}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="min-w-0 lg:col-span-7">
          <SubHead id="xsys-results">Results so far</SubHead>
          <ResultList id="xsys-results" results={x.results} />
          <Reveal>
            <p className="mt-5 text-[14px] leading-[1.7] text-muted">{x.note}</p>
            <p className="mt-3 text-[14px] leading-[1.7] text-muted">{x.cost}</p>
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-12 border border-line bg-bg p-6 sm:p-8">
        <h3 className="label-mono text-text">Not shown yet</h3>
        <Bullets items={x.notYet} mark="dashed" className="mt-5 max-w-[880px]" />
      </Reveal>

      <Reveal className="mt-8">
        <Provenance kind="Source">
          docs/research/xsys_spike.md; docs/design/XSYS_POLICY.md; tests/xsys/test_episode.py · merged at {FACT_SOURCE.commitShort}
        </Provenance>
      </Reveal>
    </Section>
  );
}
