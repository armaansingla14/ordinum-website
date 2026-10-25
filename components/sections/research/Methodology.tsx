import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { EVIDENCE_CLASS_LABELS, research, type EvidenceClass } from "@/lib/content";
import { Tag } from "./badges";
import { SectionHead, SubHead } from "./shared";

const m = research.methodology;
const LABEL_ORDER: readonly EvidenceClass[] = [
  "real-external-target",
  "positive-control",
  "expected-behavior",
  "harness-artifact",
  "unresolved",
  "verified-defect",
];

/** How results are produced and labeled, the label glossary, and the withdrawn-v1 note (no numbers). */
export default function Methodology() {
  return (
    <Section id={m.id} variant="charcoal" aria-labelledby="method-title">
      <SectionHead id="method-title" kicker={m.kicker} title={m.title} />

      <Reveal as="ul" stagger={0.05} amount={0.1} className="hairline-grid mt-12 grid-cols-1 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
        {m.principles.map((p) => (
          <RevealItem as="li" key={p.title} className="bg-surface p-6">
            <h3 className="text-[16px] font-semibold tracking-[-0.015em] text-text">{p.title}</h3>
            <p className="mt-3 text-[14px] leading-[1.65] text-muted">{p.body}</p>
          </RevealItem>
        ))}
      </Reveal>

      <Reveal className="mt-14 md:mt-16">
        <SubHead id="method-labels">{m.labelsTitle}</SubHead>
        <dl aria-labelledby="method-labels" className="mt-4 border-t border-line">
          {LABEL_ORDER.map((c) => (
            <div key={c} className="grid grid-cols-1 gap-1.5 border-b border-line py-4 sm:grid-cols-[260px_minmax(0,1fr)] sm:gap-6">
              <dt className="font-mono text-[11px] tracking-[0.08em] text-text uppercase sm:pt-[2px]">{EVIDENCE_CLASS_LABELS[c]}</dt>
              <dd className="text-[14.5px] leading-[1.65] text-muted">{m.labels[c]}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 max-w-[760px] text-[14px] leading-[1.7] text-muted">{m.labelsNote}</p>
      </Reveal>

      {/* History note: secondary in weight, never hidden, and it repeats none of the v1 numbers. */}
      <Reveal
        id="withdrawn-v1"
        data-withdrawn=""
        aria-labelledby="withdrawn-title"
        role="region"
        className="mt-14 grid gap-6 border-t border-line pt-10 md:mt-16 lg:grid-cols-12 lg:gap-12"
      >
        <div className="lg:col-span-4">
          <h3 id="withdrawn-title" className="text-[22px] font-semibold leading-[1.2] tracking-title text-text md:text-[26px]">
            {m.withdrawn.title}
          </h3>
          <Tag tone="quiet" className="mt-4">
            Withdrawn · not current evidence
          </Tag>
        </div>
        <div className="space-y-4 lg:col-span-8">
          {m.withdrawn.body.map((p) => (
            <p key={p} className="max-w-[760px] text-[15px] leading-[1.75] text-muted">
              {p}
            </p>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
