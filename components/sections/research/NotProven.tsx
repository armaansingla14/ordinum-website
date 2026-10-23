import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { research } from "@/lib/content";
import { SectionHead } from "./shared";

const np = research.notProven;

/** E. What we have not proven: stated as open questions, at the same weight as the results. */
export default function NotProven() {
  return (
    <Section id="not-proven" aria-labelledby="not-proven-title">
      <SectionHead id="not-proven-title" kicker={np.kicker} title={np.title} />
      <Reveal as="ol" stagger={0.06} amount={0.15} className="mt-12 border-t border-line md:mt-16">
        {np.items.map((item, i) => (
          <RevealItem
            as="li"
            key={item}
            className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 border-b border-line py-5 md:grid-cols-[64px_minmax(0,1fr)] md:py-6"
          >
            <span aria-hidden="true" className="pt-[5px] font-mono text-[11px] tabular-nums text-subtle">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="text-[clamp(18px,1.7vw,22px)] leading-[1.45] tracking-[-0.02em] text-text">{item}</p>
          </RevealItem>
        ))}
      </Reveal>
      <Reveal className="mt-8">
        <p className="max-w-[720px] text-[16px] leading-[1.75] text-muted">{np.closing}</p>
      </Reveal>
    </Section>
  );
}
