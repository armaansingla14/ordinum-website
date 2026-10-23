import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import Topline from "@/components/ui/Topline";
import { topline, whyNow } from "@/lib/content";

/** "WHY NOW / 004" -> ["WHY NOW", "004"] */
function splitLabel(s: string): [string, string | undefined] {
  const at = s.lastIndexOf(" / ");
  return at === -1 ? [s, undefined] : [s.slice(0, at), s.slice(at + 3)];
}

export default function WhyNow() {
  const [kicker, index] = splitLabel(whyNow.kicker);
  const [lineIndex, lineLabel] = topline[3].split(" / ") as [string, string];
  const total = String(whyNow.points.length).padStart(2, "0");

  return (
    <Section id="why-now" variant="charcoal" aria-labelledby="why-now-title" className="pt-0 md:pt-0">
      <Topline index={lineIndex} contained={false}>
        {lineLabel}
      </Topline>

      <div className="mt-[64px] grid gap-12 md:mt-[100px] lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:sticky lg:top-[120px] lg:col-span-4 lg:self-start">
          <Kicker index={index}>{kicker}</Kicker>
          <Heading id="why-now-title" className="mt-6 max-w-[12ch]">
            {whyNow.title}
          </Heading>
        </Reveal>

        <Reveal as="ol" stagger={0.08} amount={0.1} className="border-t border-line lg:col-span-8">
          {whyNow.points.map((p) => (
            <RevealItem
              as="li"
              key={p.n}
              className="group grid grid-cols-[44px_minmax(0,1fr)] gap-x-4 border-b border-line py-8 sm:grid-cols-[72px_minmax(0,1fr)] md:py-10 lg:grid-cols-[88px_minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-x-10"
            >
              <span className="pt-[6px] font-mono text-[12px] tracking-[0.08em] text-lime md:pt-[10px]">
                {p.n}
                <span aria-hidden="true" className="hidden text-subtle sm:inline">
                  {" "}
                  / {total}
                </span>
              </span>
              <h3 className="text-[clamp(25px,2.5vw,36px)] font-semibold leading-[1.12] tracking-title text-text text-balance transition-colors duration-300 group-hover:text-lime">
                {p.title}
              </h3>
              <p className="col-start-2 mt-3 max-w-[460px] text-[15px] leading-[1.75] text-muted lg:col-start-3 lg:mt-0 lg:pt-[6px]">
                {p.body}
              </p>
            </RevealItem>
          ))}
        </Reveal>
      </div>

      <Reveal className="mt-16 md:mt-24">
        <div className="border-l border-lime pl-6 md:pl-10">
          <p className="max-w-[22ch] text-[clamp(30px,3.6vw,52px)] font-semibold leading-[1.08] tracking-display text-text text-balance md:max-w-[28ch]">
            {whyNow.closing}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
