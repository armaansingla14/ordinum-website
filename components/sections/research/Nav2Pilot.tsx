import Link from "next/link";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { research } from "@/lib/content";
import { PRODUCT_SOURCE, nav2PilotFindings, nav2PilotTotals } from "@/lib/evidence";
import { ClassChip, Provenance, ReplayDots } from "./badges";
import { ResultList, SectionHead, SubHead, TargetAside } from "./shared";

const nav2 = research.nav2;

/**
 * Nav2 pilot: labeled results first, then the three reproduced violations and why each is an
 * artifact of our setup, then setup and statistics. No trace visual here: the real trace lives on /demo.
 */
export default function Nav2Pilot() {
  const explanation = (inv: string) => nav2.classifications.find((c) => c.invariant === inv)?.explanation;

  return (
    <Section id={nav2.id} variant="charcoal" aria-labelledby="nav2-title">
      <SectionHead
        id="nav2-title"
        kicker={nav2.kicker}
        title={nav2.title}
        titleMuted={nav2.titleMuted}
        lede={nav2.lede}
        aside={<TargetAside id="nav2" />}
      />

      <div className="mt-14 md:mt-20">
        <SubHead id="nav2-results">Results</SubHead>
        <ResultList id="nav2-results" results={nav2.results} />
        <Reveal>
          <p className="mt-8 max-w-[820px] border-l border-lime/70 pl-5 text-[16px] leading-[1.75] text-[#c9d1ce]">{nav2.conclusion}</p>
        </Reveal>
      </div>

      {/* The three reproduced violations */}
      <div className="mt-14 md:mt-16">
        <SubHead id="nav2-findings">Reproduced violations and why each is not a Nav2 defect</SubHead>
        <Reveal as="ol" aria-labelledby="nav2-findings" stagger={0.07} amount={0.1} className="hairline-grid mt-4 grid-cols-1 lg:grid-cols-3">
          {nav2PilotFindings.map((f, i) => {
            const row = nav2.findings[i];
            return (
              <RevealItem as="li" key={f.invariant} className="flex flex-col bg-surface p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[10px] tracking-[0.1em] text-subtle">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-[10px] tracking-[0.1em] text-subtle uppercase">severity {f.severity}</span>
                </div>
                <h4 className="mt-3 font-mono text-[16px] text-orange">{f.invariant}</h4>
                <dl className="mt-5 space-y-3.5 text-[13.5px]">
                  <div>
                    <dt className="font-mono text-[10px] tracking-[0.1em] text-subtle uppercase">Replay on fresh seeds</dt>
                    <dd className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-mono text-[12px] text-text">{row.reproduction}</span>
                      <ReplayDots failures={f.reproduction.failures} trials={f.reproduction.trials} />
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] tracking-[0.1em] text-subtle uppercase">Minimized</dt>
                    <dd className="mt-1.5 font-mono text-[12px] text-text">{row.minimization}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] tracking-[0.1em] text-subtle uppercase">Why it is not a Nav2 defect</dt>
                    <dd className="mt-1.5 leading-[1.6] text-muted">{explanation(f.invariant)}</dd>
                  </div>
                </dl>
                <blockquote className="mt-5 border-l border-line-2 pl-4 text-[13.5px] leading-[1.6] text-[#c9d1cf]">
                  <p>“{row.reviewQuote}”</p>
                  <footer className="mt-2 font-mono text-[10px] tracking-[0.08em] text-subtle uppercase">Separate adversarial review</footer>
                </blockquote>
                <span aria-hidden="true" className="min-h-5 flex-1" />
                <ClassChip classes={nav2.results[i + 1].classes} label={row.label} className="self-start" />
              </RevealItem>
            );
          })}
        </Reveal>
        <Reveal className="mt-6">
          <Link
            href={nav2.traceLink.href}
            className="group inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-lime uppercase underline decoration-lime/40 underline-offset-4 hover:decoration-lime"
          >
            {nav2.traceLink.label}
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </div>

      {/* Statistics, below the narrative */}
      <Reveal className="mt-14 grid gap-10 border-t border-line pt-10 md:mt-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <SubHead>{nav2.stats.title}</SubHead>
          <ul className="mt-4 space-y-2.5">
            {nav2.stats.items.map((d) => (
              <li key={d} className="flex gap-3 text-[14.5px] leading-[1.6] text-text">
                <span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-line-2" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6">
          <SubHead id="nav2-arms">Violation classes found, per seed</SubHead>
          <table aria-labelledby="nav2-arms" className="mt-4 w-full border border-line text-left">
            <thead>
              <tr className="border-b border-line bg-surface font-mono text-[10px] tracking-[0.1em] text-subtle uppercase">
                <th scope="col" className="px-4 py-3 font-normal">Strategy</th>
                <th scope="col" className="px-4 py-3 text-right font-normal">Seeds 1 / 2 / 3</th>
              </tr>
            </thead>
            <tbody>
              {nav2.stats.perArm.map((a) => (
                <tr key={a.arm} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-4 py-3 text-[14px] font-normal text-text">{a.arm}</th>
                  <td className="px-4 py-3 text-right font-mono text-[12px] tabular-nums whitespace-nowrap text-muted">{a.classesPerSeed}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-[14px] leading-[1.7] text-muted">{nav2.stats.perArmNote}</p>
        </div>
      </Reveal>

      <Reveal className="mt-8">
        <Provenance kind="Reported result">
          {nav2PilotTotals.source}; docs/research/nav2_pilot.md @ {PRODUCT_SOURCE.commitShort}
        </Provenance>
      </Reveal>
    </Section>
  );
}
