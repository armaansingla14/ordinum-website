import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { vision } from "@/lib/content";
import { pad, SectionIntro } from "./shared";

/**
 * /vision 03: why now. At most a few verified, dated facts, each linked to its official source
 * (registry J1, J2), then the caveat that neither requires a testing method, and the stance on
 * existing specialized tools (integrate and coordinate, not replace).
 */
export default function WhyNow() {
  const { whyNow, tools } = vision;

  return (
    <Section id="why-now" aria-labelledby="why-now-title">
      <SectionIntro kicker={whyNow.kicker} title={whyNow.title} titleId="why-now-title" />

      <Reveal as="ol" stagger={0.08} className="mt-14 border-t border-line md:mt-20">
        {whyNow.items.map((item, i) => (
          <RevealItem
            as="li"
            key={item.source.href}
            className="grid gap-4 border-b border-line py-8 md:grid-cols-[72px_minmax(0,1fr)_minmax(0,260px)] md:gap-8 md:py-10"
          >
            <span aria-hidden="true" className="font-mono text-[11px] tracking-[0.08em] text-lime md:pt-[5px]">
              {pad(i + 1)}
            </span>
            <p className="max-w-[640px] text-[17px] leading-[1.65] tracking-[-0.015em] text-text md:text-[19px]">
              {item.text}
            </p>
            <p className="md:pt-[5px] md:text-right">
              <a
                href={item.source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-2 font-mono text-[10px] leading-[1.5] tracking-[0.12em] text-muted uppercase transition-colors hover:text-lime md:min-h-0"
              >
                <span>Source: {item.source.label}</span>
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px">
                  ↗
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </RevealItem>
        ))}
      </Reveal>

      <Reveal className="mt-8 max-w-[640px] md:ml-[104px]">
        <p className="text-[14px] leading-[1.7] text-muted">{whyNow.note}</p>
      </Reveal>

      <Reveal className="mt-20 border-t border-line pt-10 md:mt-28 md:pt-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-12">
          <p className="label-mono pt-2 text-lime">Existing tools</p>
          <p className="max-w-[30ch] text-[clamp(24px,2.6vw,36px)] leading-[1.2] font-semibold tracking-display text-balance text-text">
            {tools}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
