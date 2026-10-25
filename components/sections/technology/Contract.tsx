import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { technology } from "@/lib/content";
import { Caveat, SECTION_PAD, SectionIntro, pad } from "./shared";

/** Section 3: the execution and verification contract every target implements. */
export default function Contract() {
  const c = technology.contract;
  const [first, ...rest] = c.body;
  return (
    <Section id={c.id} aria-labelledby={`${c.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={c.kicker} title={c.title} titleMuted={c.titleMuted} titleId={`${c.id}-title`} lede={first} />

      {rest.length > 0 && (
        <Reveal className="mt-8 lg:ml-auto lg:w-[calc(5/12*100%)] lg:pl-6">
          {rest.map((p) => (
            <p key={p} className="max-w-[540px] text-[16px] leading-[1.75] text-muted">
              {p}
            </p>
          ))}
        </Reveal>
      )}

      <Reveal as="ol" stagger={0.06} amount={0.05} className="hairline-grid mt-12 grid-cols-1 sm:grid-cols-2 md:mt-14 xl:grid-cols-4">
        {c.points.map((p, i) => (
          <RevealItem as="li" key={p.title} className="flex flex-col bg-surface p-6">
            <span className="font-mono text-[11px] tracking-[0.08em] text-lime">{pad(i + 1)}</span>
            <h3 className="mt-5 text-[17px] leading-[1.3] font-[550] tracking-[-0.025em] text-text">{p.title}</h3>
            <p className="mt-2.5 text-[14px] leading-[1.7] text-muted">{p.body}</p>
          </RevealItem>
        ))}
      </Reveal>

      <Reveal>
        <Caveat className="mt-8 max-w-[760px]">{c.caveat}</Caveat>
      </Reveal>
    </Section>
  );
}
