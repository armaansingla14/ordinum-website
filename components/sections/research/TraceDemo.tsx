import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import EvidenceReport from "@/components/visuals/EvidenceReport";
import TraceTimeline from "@/components/visuals/TraceTimeline";
import { research } from "@/lib/content";
import { EVIDENCE_LABELS, nav2Nominal, toyPositiveControl } from "@/lib/evidence";
import { EvidenceBadge, Provenance } from "./badges";
import { SectionHead } from "./shared";

const demo = research.traceDemo;
const others = [nav2Nominal, toyPositiveControl] as const;

/** D. One real failure, end to end: timeline, report preview, walkthrough, limitations, and the observation-vs-defect line. */
export default function TraceDemo() {
  return (
    <Section id={demo.id} variant="charcoal" aria-labelledby="trace-demo-title">
      <SectionHead id="trace-demo-title" kicker={demo.kicker} title={demo.title} titleMuted={demo.titleMuted} lede={demo.lede} />

      <Reveal className="mt-14 min-w-0 md:mt-20" amount={0.05}>
        <TraceTimeline />
      </Reveal>

      <div className="mt-16 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <h3 className="label-mono text-subtle" id="trace-steps">
            Walkthrough
          </h3>
          <ol aria-labelledby="trace-steps" className="mt-4 border-t border-line">
            {demo.steps.map((s, i) => (
              <li key={s.k} className="grid grid-cols-[32px_minmax(0,1fr)] gap-x-3 border-b border-line py-4">
                <span aria-hidden="true" className="pt-[2px] font-mono text-[11px] tabular-nums text-lime">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h4 className="text-[15px] font-semibold tracking-[-0.01em] text-text">{s.k}</h4>
                  <p className="mt-1.5 text-[14px] leading-[1.65] break-words text-muted">{s.v}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal className="min-w-0 lg:col-span-7" delay={0.06}>
          {/* Below md the walkthrough and the event log already carry these facts, so the report
              preview starts collapsed there; from md up it is shown in full. */}
          <details className="group border border-line-2 bg-window md:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-mono text-[11px] tracking-[0.08em] text-[#d6dedb] uppercase [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 break-all">
                <span className="text-lime">Report preview</span> · nav2_success_mismatch_compare.html
              </span>
              <span aria-hidden="true" className="text-lime transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="border-t border-line">
              <EvidenceReport />
            </div>
          </details>
          <div className="hidden md:block">
            <EvidenceReport />
          </div>
        </Reveal>
      </div>

      {/* Observation vs defect: stated plainly, at full size */}
      <Reveal className="hairline-grid mt-16 grid-cols-1 md:mt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="bg-surface p-6 sm:p-8">
          <h3 className="text-[clamp(24px,2.4vw,32px)] font-semibold leading-[1.15] tracking-title text-text text-balance">
            {demo.observationVsDefect.title}
          </h3>
          <p className="mt-5 max-w-[620px] text-[15.5px] leading-[1.75] text-muted">{demo.observationVsDefect.body}</p>
        </div>
        <div className="bg-bg p-6 sm:p-8">
          <h3 className="label-mono text-text">Limitations of this example</h3>
          <ol className="mt-5 space-y-3">
            {demo.limitations.map((c, i) => (
              <li key={c} className="flex gap-4 text-[14px] leading-[1.6] text-text">
                <span aria-hidden="true" className="mt-[2px] font-mono text-[11px] tabular-nums text-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* The other committed demo artifacts, each with its label */}
      <Reveal className="mt-12">
        <h3 className="label-mono text-subtle">Other committed demo artifacts</h3>
        <ul className="hairline-grid mt-4 grid-cols-1 md:grid-cols-2">
          {others.map((a) => (
            <li key={a.id} className="flex flex-col bg-surface p-6">
              <EvidenceBadge label={a.label} text={EVIDENCE_LABELS[a.label]} className="self-start" />
              <p className="mt-4 text-[14.5px] leading-[1.65] text-text">{a.labelShort}</p>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-muted">{a.observed}</p>
              <span aria-hidden="true" className="min-h-4 flex-1" />
              <Provenance kind="Real report">{a.source}</Provenance>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-8">
        <p className="font-mono text-[10.5px] leading-[1.7] tracking-[0.04em] break-words text-[#8a9894]">{demo.source}</p>
      </Reveal>
    </Section>
  );
}
