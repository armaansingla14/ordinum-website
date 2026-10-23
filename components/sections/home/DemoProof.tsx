import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import TraceTimeline from "@/components/visuals/TraceTimeline";
import { demo } from "@/lib/content";
import { SectionIntro } from "./shared";

/** TraceTimeline (compact) already shows these, with the classification badge and provenance. */
const SHOWN_IN_TRACE = new Set(["Reproduction", "Minimization"]);
const facts = demo.facts.filter((f) => !SHOWN_IN_TRACE.has(f.k));

/**
 * Home section 6: one real recorded run from the exploratory Nav2 pilot, labeled for what it
 * is (a fault-configuration artifact, not a Nav2 defect). Trace data: lib/evidence.ts.
 */
export default function DemoProof() {
  return (
    <Section id="demo" aria-labelledby="demo-title">
      <SectionIntro
        kicker={demo.kicker}
        title={demo.title}
        titleMuted={demo.titleMuted}
        titleId="demo-title"
        lede={demo.lede}
      />

      <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-12">
        <Reveal className="min-w-0 lg:col-span-8" amount={0.1}>
          <TraceTimeline compact />
        </Reveal>

        <Reveal className="flex flex-col lg:col-span-4" delay={0.06}>
          <dl className="border-t border-line">
            {facts.map((f) => (
              <div key={f.k} className="border-b border-line py-4">
                <dt className="font-mono text-[10px] tracking-[0.14em] text-lime uppercase">{f.k}</dt>
                <dd className="mt-1.5 text-[14px] leading-[1.65] text-muted">{f.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[15px] leading-[1.75] text-[#c9d1ce]">{demo.why}</p>
          <div className="mt-8">
            <Button href={demo.cta.href} variant="secondary" icon="→">
              {demo.cta.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
