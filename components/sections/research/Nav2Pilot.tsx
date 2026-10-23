import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { research } from "@/lib/content";
import { EVIDENCE_LABELS, PRODUCT_SOURCE, nav2PilotFindings, nav2PilotTotals } from "@/lib/evidence";
import { EvidenceBadge, Provenance, ReplayDots, Tag } from "./badges";
import { SectionHead } from "./shared";

const nav2 = research.nav2;

/** C. Nav2 exploratory pilot: setup, per-strategy classes, the three reproduced violations and their classification. */
export default function Nav2Pilot() {
  const explanation = (inv: string) => nav2.classifications.find((c) => c.invariant === inv)?.explanation;

  return (
    <Section id="nav2-pilot" aria-labelledby="nav2-title">
      <SectionHead
        id="nav2-title"
        kicker={nav2.kicker}
        title={nav2.title}
        titleMuted={nav2.titleMuted}
        lede={nav2.lede}
        aside={
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Tag tone="neutral">{nav2PilotTotals.status}</Tag>
            <Tag tone="quiet">{nav2PilotTotals.armsSeeds}</Tag>
          </div>
        }
      />

      {/* Headline counts, all from lib/evidence.ts */}
      <Reveal as="ul" stagger={0.06} className="hairline-grid mt-14 grid-cols-2 md:mt-20 lg:grid-cols-4">
        {[
          { v: `${nav2PilotTotals.campaigns}/${nav2PilotTotals.campaigns}`, k: "Campaigns completed" },
          { v: String(nav2PilotTotals.executions), k: "Executions" },
          { v: String(nav2PilotTotals.reproducedClasses), k: "Violations reproduced" },
          { v: String(nav2PilotTotals.confirmedNav2Defects), k: "Confirmed Nav2 defects" },
        ].map((x) => (
          <RevealItem as="li" key={x.k} className="bg-surface p-5 sm:p-6">
            <p className="text-[clamp(36px,4vw,52px)] font-semibold leading-none tracking-hero tabular-nums text-text">{x.v}</p>
            <p className="label-mono mt-4 text-[10px] text-subtle">{x.k}</p>
          </RevealItem>
        ))}
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-6">
          <h3 className="label-mono text-subtle">Setup</h3>
          <ul className="mt-4 space-y-2.5">
            {nav2.setup.map((d) => (
              <li key={d} className="flex gap-3 text-[14.5px] leading-[1.6] text-text">
                <span aria-hidden="true" className="mt-[9px] h-px w-3 shrink-0 bg-line-2" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="lg:col-span-6" delay={0.06}>
          <h3 className="label-mono text-subtle" id="nav2-arms">
            Violation classes found, per seed
          </h3>
          <table aria-labelledby="nav2-arms" className="mt-4 w-full border border-line text-left">
            <thead>
              <tr className="border-b border-line bg-surface font-mono text-[10px] tracking-[0.1em] text-subtle uppercase">
                <th scope="col" className="px-4 py-3 font-normal">Strategy</th>
                <th scope="col" className="px-4 py-3 text-right font-normal">Seeds 1 / 2 / 3</th>
              </tr>
            </thead>
            <tbody>
              {nav2.perArm.map((a) => (
                <tr key={a.arm} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-4 py-3 text-[14px] font-normal text-text">{a.arm}</th>
                  <td className="px-4 py-3 text-right font-mono text-[12px] tabular-nums text-muted">{a.classesPerSeed}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-[14px] leading-[1.7] text-muted">{nav2.perArmNote}</p>
        </Reveal>
      </div>

      {/* The three reproduced violations */}
      <Reveal className="mt-14 md:mt-16" amount={0.1}>
        <h3 className="label-mono text-subtle">Reproduced violations and how each was classified</h3>
      </Reveal>
      <Reveal as="ol" stagger={0.07} amount={0.1} className="hairline-grid mt-4 grid-cols-1 lg:grid-cols-3">
        {nav2PilotFindings.map((f, i) => (
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
                  <span className="font-mono text-[12px] text-text">{f.reproduction.rate}</span>
                  <ReplayDots failures={f.reproduction.failures} trials={f.reproduction.trials} />
                  <span className="font-mono text-[11px] text-muted">
                    Wilson {Math.round(f.reproduction.wilson95[0] * 100)}–{Math.round(f.reproduction.wilson95[1] * 100)}%
                  </span>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.1em] text-subtle uppercase">Minimized (ddmin)</dt>
                <dd className="mt-1.5 font-mono text-[12px] text-text">
                  {f.minimized.before} → {f.minimized.after} faults
                  <span className="text-muted">{f.minimized.oneMinimal ? " · 1-minimal" : " · time cap reached, not verified 1-minimal"}</span>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.1em] text-subtle uppercase">Why it is not a Nav2 defect</dt>
                <dd className="mt-1.5 leading-[1.6] text-muted">{explanation(f.invariant)}</dd>
              </div>
            </dl>
            <blockquote className="mt-5 border-l border-line-2 pl-4 text-[13.5px] leading-[1.6] text-[#c9d1cf]">
              <p>“{f.reviewQuote}”</p>
              <footer className="mt-2 font-mono text-[10px] tracking-[0.08em] text-subtle uppercase">Separate adversarial review</footer>
            </blockquote>
            <span aria-hidden="true" className="min-h-5 flex-1" />
            <EvidenceBadge label={f.label} text={`${EVIDENCE_LABELS[f.label]} · ${f.classification}`} className="self-start" />
            <p className="mt-3 font-mono text-[10px] leading-[1.6] break-all text-[#8a9894]">{f.regressionCase}</p>
          </RevealItem>
        ))}
      </Reveal>

      <Reveal className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-12">
        <p className="max-w-[820px] text-[16px] leading-[1.75] text-text lg:col-span-8">{nav2.conclusion}</p>
        <ul className="space-y-2 lg:col-span-4">
          {nav2PilotTotals.caveats.map((c) => (
            <li key={c} className="font-mono text-[11px] leading-[1.7] text-subtle">
              <span aria-hidden="true" className="text-line-2">— </span>
              {c}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal className="mt-6">
        <Provenance kind="Reported result">
          {nav2PilotTotals.source}; docs/research/nav2_pilot.md @ {PRODUCT_SOURCE.commitShort}
        </Provenance>
      </Reveal>
    </Section>
  );
}
