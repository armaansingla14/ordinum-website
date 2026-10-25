import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { about } from "@/lib/content";
import { pad, splitLabel } from "@/components/sections/vision/shared";

/**
 * /about 01-02: why we are building Ordinum (and why the scope is broader than Nav2), then the
 * experience that maps to the problem, as a compact hairline grid.
 */
export default function Story() {
  const { story, fit } = about;
  const [label, index] = splitLabel(story.kicker);
  const [fLabel, fIndex] = splitLabel(fit.kicker);

  return (
    <Section id="story" aria-labelledby="story-title">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <Kicker index={index}>{label}</Kicker>
          <Heading id="story-title" className="mt-6 max-w-[14ch]">
            {story.title}
          </Heading>
        </Reveal>
        <Reveal delay={0.06} className="lg:col-span-7 lg:pt-[46px]">
          <div className="max-w-[600px] space-y-6 text-[16px] leading-[1.8] text-muted md:text-[17px]">
            {story.body.map((p, i) => (
              <p key={p.slice(0, 32)} className={i === 0 ? "text-[#c3cbc9]" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>

      <section aria-labelledby="fit-title" className="mt-20 md:mt-28">
        <Reveal className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
          <h3 id="fit-title" className="text-[22px] font-semibold tracking-title text-text md:text-[26px]">
            {fit.title}
          </h3>
          <Kicker index={fIndex} className="text-subtle">
            {fLabel}
          </Kicker>
        </Reveal>

        <Reveal as="ul" stagger={0.06} className="hairline-grid mt-8 sm:grid-cols-2 xl:grid-cols-4">
          {fit.items.map((d, i) => (
            <RevealItem as="li" key={d.title} className="flex flex-col bg-surface p-7 md:p-8">
              <span aria-hidden="true" className="font-mono text-[11px] tracking-[0.08em] text-lime">
                {pad(i + 1)}
              </span>
              <h4 className="mt-7 text-[19px] leading-[1.25] font-semibold tracking-title text-text md:text-[20px]">
                {d.title}
              </h4>
              <p className="mt-3 text-[14px] leading-[1.75] text-muted">{d.body}</p>
            </RevealItem>
          ))}
        </Reveal>
      </section>
    </Section>
  );
}
