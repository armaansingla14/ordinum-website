import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { demoWalkthrough, home } from "@/lib/content";
import { SectionIntro } from "./shared";

/* Code-split the interactive timeline; it still server-renders (SSR fallback is the full figure). */
const TraceTimeline = dynamic(() => import("@/components/visuals/TraceTimeline"));

const { demo } = home;
const steps = demo.showSteps
  .map((id) => demoWalkthrough.steps.find((s) => s.id === id))
  .filter((s): s is (typeof demoWalkthrough.steps)[number] => s !== undefined);

/**
 * Home section 2: a short recorded run (Nav2 pilot), labeled "Recorded run" and for what it is:
 * "Real external target · Harness artifact", with the qualifier (fault configuration, not a Nav2
 * defect) as separate text. Four condensed steps from demoWalkthrough (shared with
 * /demos/nav2-walkthrough) beside the compact real trace.
 */
export default function DemoProof() {
  return (
    <Section id="recorded-run" variant="charcoal" aria-labelledby="demo-title">
      <SectionIntro
        kicker={demo.kicker}
        title={demo.title}
        titleMuted={demo.titleMuted}
        titleId="demo-title"
        lede={demo.lede}
        aside={
          <div className="flex flex-col items-start gap-2">
            <p className="inline-flex items-center gap-2 border border-lime/40 px-[7px] py-[4px] font-mono text-[10px] leading-none tracking-[0.12em] text-lime uppercase">
              <span aria-hidden="true" className="inline-block size-[6px] rounded-full bg-lime" />
              {demo.tag}
            </p>
            <p className="inline-flex items-start gap-2.5 border border-line-2 bg-window px-3 py-2 font-mono text-[10.5px] leading-[1.5] tracking-[0.08em] text-[#c9d1ce] uppercase">
              <span aria-hidden="true" className="mt-[4px] inline-block size-[7px] shrink-0 border border-subtle" />
              <span>
                <span className="sr-only">Evidence classification: </span>
                {demoWalkthrough.label}
              </span>
            </p>
            <p className="text-[14px] leading-[1.6] text-muted">{demoWalkthrough.qualifier}.</p>
          </div>
        }
      />

      {/* lg: trace (left, row 1) and CTAs (left, row 2) beside the steps (right, both rows).
          Below lg the DOM order reads trace, steps, CTAs. */}
      <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10">
        <Reveal className="min-w-0 lg:col-span-7 lg:row-start-1" amount={0.1}>
          <TraceTimeline compact />
        </Reveal>

        <Reveal
          as="ol"
          stagger={0.04}
          className="min-w-0 border-t border-line lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1"
        >
          {steps.map((s) => (
            <RevealItem
              key={s.id}
              as="li"
              className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-3 border-b border-line py-3.5"
            >
              <span className="pt-[2px] font-mono text-[10.5px] tracking-[0.08em] text-lime">{s.n}</span>
              <div className="min-w-0">
                <p className="font-mono text-[10px] leading-[1.4] tracking-[0.13em] text-subtle uppercase">{s.label}</p>
                <p className="mt-1 text-[14px] leading-[1.6] text-[#d5dbd8]">{s.short}</p>
              </div>
            </RevealItem>
          ))}
        </Reveal>

        <div className="flex flex-wrap gap-3 lg:col-span-7 lg:row-start-2 lg:self-start">
          <Button href={demo.primaryCta.href} icon="→">
            {demo.primaryCta.label}
          </Button>
          <Button href={demo.secondaryCta.href} variant="secondary" icon="→">
            {demo.secondaryCta.label}
          </Button>
        </div>
      </div>
    </Section>
  );
}
