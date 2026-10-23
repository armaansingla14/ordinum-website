import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import Topline from "@/components/ui/Topline";
import LoopRail from "@/components/visuals/LoopRail";
import { howItWorks, topline } from "@/lib/content";

/** "THE METHOD / 002" -> ["THE METHOD", "002"] */
function splitLabel(s: string): [string, string | undefined] {
  const at = s.lastIndexOf(" / ");
  return at === -1 ? [s, undefined] : [s.slice(0, at), s.slice(at + 3)];
}

export default function HowItWorks() {
  const [kicker, index] = splitLabel(howItWorks.kicker);
  const [lineIndex, lineLabel] = topline[1].split(" / ") as [string, string];

  return (
    <Section id="technology" variant="charcoal" aria-labelledby="technology-title" className="pt-0 md:pt-0">
      <Topline index={lineIndex} contained={false}>
        {lineLabel}
      </Topline>

      <Reveal className="mt-[64px] grid gap-8 md:mt-[100px] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12 xl:gap-16">
        <div>
          <Kicker index={index}>{kicker}</Kicker>
          <Heading id="technology-title" className="mt-6 max-w-[14ch]">
            {howItWorks.title}
          </Heading>
        </div>
        <p className="max-w-[540px] text-[16px] leading-[1.8] text-muted md:text-[17px]">{howItWorks.lede}</p>
      </Reveal>

      <Reveal className="mt-14 md:mt-20" amount={0.1}>
        <LoopRail steps={howItWorks.steps} loopNote={howItWorks.loopNote} />
      </Reveal>
    </Section>
  );
}
