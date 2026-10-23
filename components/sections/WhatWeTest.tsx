import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import Topline from "@/components/ui/Topline";
import LayerStack from "@/components/visuals/LayerStack";
import { topline, whatWeTest } from "@/lib/content";

/** "WHAT WE TEST / 003" -> ["WHAT WE TEST", "003"] */
function splitLabel(s: string): [string, string | undefined] {
  const at = s.lastIndexOf(" / ");
  return at === -1 ? [s, undefined] : [s.slice(0, at), s.slice(at + 3)];
}

export default function WhatWeTest() {
  const [kicker, index] = splitLabel(whatWeTest.kicker);
  const [lineIndex, lineLabel] = topline[2].split(" / ") as [string, string];
  const todayCount = whatWeTest.layers.filter((l) => l.status === "today").length;

  return (
    <Section id="stack" aria-labelledby="stack-title" className="pt-0 md:pt-0">
      <Topline index={lineIndex} contained={false}>
        {lineLabel}
      </Topline>

      <Reveal className="mt-[64px] grid gap-8 md:mt-[100px] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12 xl:gap-16">
        <div>
          <Kicker index={index}>{kicker}</Kicker>
          <Heading id="stack-title" className="mt-6 max-w-[14ch] md:max-w-[16ch]">
            {whatWeTest.title}
          </Heading>
        </div>
        <div>
          <p className="max-w-[540px] text-[16px] leading-[1.8] text-muted md:text-[17px]">{whatWeTest.lede}</p>
          <dl className="mt-8 grid max-w-[540px] grid-cols-2 border-t border-line">
            <div className="border-r border-line pt-4 pr-4">
              <dt className="label-mono text-[10px] text-muted">Exercised today</dt>
              <dd className="mt-2 font-mono text-[13px] text-lime">
                {String(todayCount).padStart(2, "0")} / {String(whatWeTest.layers.length).padStart(2, "0")} layers
              </dd>
            </div>
            <div className="pt-4 pl-4">
              <dt className="label-mono text-[10px] text-muted">Where</dt>
              <dd className="mt-2 font-mono text-[13px] text-text">In simulation</dd>
            </div>
          </dl>
        </div>
      </Reveal>

      <Reveal className="mt-14 md:mt-20" amount={0.1}>
        <LayerStack layers={whatWeTest.layers} wedge={whatWeTest.wedge} />
      </Reveal>
    </Section>
  );
}
