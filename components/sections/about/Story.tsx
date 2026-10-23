import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { about } from "@/lib/content";
import { pad, splitLabel } from "@/components/sections/vision/shared";

/** /about 01: origin story, then the disciplines the problem draws on (hairline grid). */
export default function Story() {
  const { story, disciplines } = about;
  const [label, index] = splitLabel(story.kicker);
  const [dLabel, dIndex] = splitLabel(disciplines.kicker);

  return (
    <Section id="story" aria-labelledby="story-title">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-6">
          <Kicker index={index}>{label}</Kicker>
          <Heading id="story-title" muted={story.titleMuted} className="mt-6 max-w-[20ch]">
            {story.title}
          </Heading>
        </Reveal>
        <Reveal delay={0.06} className="lg:col-span-6 lg:pt-[46px]">
          <div className="max-w-[560px] space-y-6 text-[16px] leading-[1.8] text-muted md:text-[17px]">
            {story.body.map((p, i) => (
              <p key={p.slice(0, 32)} className={i === 0 ? "text-[#c3cbc9]" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mt-20 md:mt-28">
        <Reveal className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
          <h3 id="disciplines-title" className="text-[22px] font-semibold tracking-title text-text md:text-[26px]">
            {disciplines.title}
          </h3>
          <Kicker index={dIndex} className="text-subtle">
            {dLabel}
          </Kicker>
        </Reveal>

        <Reveal
          as="ul"
          stagger={0.06}
          className="hairline-grid mt-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {disciplines.items.map((d, i) => (
            <RevealItem
              as="li"
              key={d.title}
              className="flex flex-col bg-surface p-7 transition-colors duration-200 hover:bg-surface-2 md:p-9"
            >
              <span className="font-mono text-[11px] tracking-[0.08em] text-lime">{pad(i + 1)}</span>
              <h4 className="mt-8 text-[20px] leading-[1.25] font-semibold tracking-title text-text md:text-[21px]">
                {d.title}
              </h4>
              <p className="mt-3 text-[14px] leading-[1.8] text-muted">{d.body}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
