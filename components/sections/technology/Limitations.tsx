import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { technology } from "@/lib/content";
import { SECTION_PAD, SectionIntro, pad } from "./shared";

/** Section 7: current limitations, then the facts-snapshot footnote. */
export default function Limitations() {
  const l = technology.limitations;
  return (
    <Section id={l.id} aria-labelledby={`${l.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={l.kicker} title={l.title} titleId={`${l.id}-title`} />

      <Reveal as="ol" amount={0.05} className="mt-12 grid gap-x-12 border-t border-line md:mt-16 md:grid-cols-2">
        {l.items.map((item, i) => (
          <li key={item} className="flex gap-5 border-b border-line py-4">
            <span className="mt-[3px] font-mono text-[11px] tracking-[0.08em] text-subtle">{pad(i + 1)}</span>
            <span className="text-[14.5px] leading-[1.7] text-muted">{item}</span>
          </li>
        ))}
      </Reveal>

      <Reveal className="mt-10 flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-10">
        <p className="max-w-[640px] font-mono text-[11px] leading-[1.7] tracking-[0.04em] text-subtle">{technology.note}</p>
        <Link
          href="/research"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-lime uppercase underline decoration-lime/40 underline-offset-4 hover:decoration-lime md:min-h-0"
        >
          Results and their labels on Research
          <span aria-hidden="true">→</span>
        </Link>
      </Reveal>
    </Section>
  );
}
