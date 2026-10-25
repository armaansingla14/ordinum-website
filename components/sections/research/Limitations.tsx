import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { research } from "@/lib/content";
import { SectionHead } from "./shared";

const l = research.limitations;

/** What the results above do not show, stated once, in one place. */
export default function Limitations() {
  return (
    <Section id={l.id} variant="charcoal" aria-labelledby="limitations-title">
      <SectionHead id="limitations-title" kicker={l.kicker} title={l.title} />
      <Reveal as="ol" className="mt-12 border-t border-line md:mt-16">
        {l.items.map((item, i) => (
          <li key={item} className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 border-b border-line py-5 md:grid-cols-[64px_minmax(0,1fr)]">
            <span aria-hidden="true" className="pt-[3px] font-mono text-[11px] tabular-nums text-subtle">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="max-w-[860px] text-[16px] leading-[1.65] text-text">{item}</span>
          </li>
        ))}
      </Reveal>
      <Reveal>
        <p className="mt-8 max-w-[760px] text-[15.5px] leading-[1.75] text-muted">{l.closing}</p>
      </Reveal>
    </Section>
  );
}
