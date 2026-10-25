import Section from "@/components/ui/Section";
import { DemoSectionHead } from "./parts";
import EvidenceReport from "@/components/visuals/EvidenceReport";
import TraceTimeline from "@/components/visuals/TraceTimeline";
import { demoPage } from "@/lib/content";
import { nav2SuccessMismatch } from "@/lib/evidence";

const REPORT_FILE = nav2SuccessMismatch.source.split(" @ ")[0].split("/").pop();

/**
 * 002 The same failure case in full: the interactive trace (both runs, event log; no repeated
 * classification or result tiles) and the report preview. Both visuals are server-rendered and fully readable before hydration.
 * Below md the report starts collapsed (the steps above already carry its values).
 */
export default function FullEvidence() {
  return (
    <Section id="full-trace" variant="charcoal" aria-labelledby="full-trace-title" className="py-[64px] md:py-[96px]">
      <DemoSectionHead
        id="full-trace-title"
        kicker={demoPage.fullTrace.kicker}
        title={demoPage.fullTrace.title}
        titleMuted={demoPage.fullTrace.titleMuted}
      />
      <p className="mt-6 max-w-[760px] text-[15px] leading-[1.7] text-muted">{demoPage.timelineNote}</p>

      <div className="mt-8 min-w-0">
        {/* bare: no repeated evidence badge or verdict/reproduction tiles; the steps above carry them. */}
        <TraceTimeline bare />
      </div>

      <div id="report" className="mt-12 min-w-0 scroll-mt-28 md:mt-16">
        <details className="group border border-line-2 bg-window md:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-mono text-[11px] tracking-[0.08em] text-[#d6dedb] uppercase [&::-webkit-details-marker]:hidden">
            <span className="min-w-0 break-all">
              <span className="text-lime">Report preview</span> · {REPORT_FILE}
            </span>
            <span aria-hidden="true" className="text-lime transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none">
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
      </div>
    </Section>
  );
}
