import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { vision } from "@/lib/content";
import { MaturityChip, pad, splitLabel } from "./shared";

/**
 * /vision 01: the ambition, and the long-term scope as a plain register. The whole register is
 * tagged as the destination (a "Planned" chip labelled "Ambition"); no line is marked as
 * supported, and the note under it says one engine does not test everything.
 */
export default function Mission() {
  const { intro, scope } = vision;
  const [label, index] = splitLabel(intro.kicker);

  return (
    <Section id="mission" aria-labelledby="mission-title">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-6 lg:pr-6">
          <Kicker index={index}>{label}</Kicker>
          <Heading id="mission-title" className="mt-6 max-w-[16ch]">
            {intro.title}
          </Heading>
          <div className="mt-8 max-w-[560px] space-y-5 text-[16px] leading-[1.8] text-muted md:text-[17px]">
            {intro.body.map((p, i) => (
              <p key={p.slice(0, 32)} className={i === 1 ? "text-[#c3cbc9]" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.06} className="lg:col-span-6">
          <figure aria-labelledby="scope-title" className="border border-line-2 bg-window">
            <div className="flex min-h-[47px] flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-5 py-3 md:px-6">
              <p id="scope-title" className="font-mono text-[10px] tracking-[0.13em] text-[#a5b1ad] uppercase">
                {scope.title}
              </p>
              <MaturityChip maturity="planned" label="Ambition" />
            </div>

            <ol className="px-5 md:px-6">
              {scope.items.map((item, i) => (
                <li
                  key={item}
                  className="grid grid-cols-[28px_minmax(0,1fr)] items-baseline gap-x-3 border-b border-line py-3.5 last:border-b-0 sm:grid-cols-[36px_minmax(0,1fr)]"
                >
                  <span aria-hidden="true" className="font-mono text-[11px] tracking-[0.08em] text-subtle">
                    {pad(i + 1)}
                  </span>
                  <span className="text-[15px] leading-[1.45] tracking-[-0.012em] text-[#c3cbc9]">{item}</span>
                </li>
              ))}
            </ol>

            <figcaption className="border-t border-line px-5 py-4 text-[13px] leading-[1.6] text-muted md:px-6">
              {scope.note}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
