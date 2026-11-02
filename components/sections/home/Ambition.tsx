import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import AgenticLoop from "@/components/visuals/AgenticLoop";
import { agenticLoop, home } from "@/lib/content";
import { SectionIntro } from "./shared";

/** Home section 5: the ambition and the agentic security loop, each stage labeled Today / In development / Planned. */
export default function Ambition() {
  return (
    <Section id="ambition" aria-labelledby="ambition-title" className="py-[56px] md:py-[80px]">
      <SectionIntro kicker={home.ambition.kicker} title={agenticLoop.title} titleId="ambition-title" lede={agenticLoop.lede} />
      <Reveal className="mt-8 md:mt-10" amount={0.05}>
        <AgenticLoop />
      </Reveal>
    </Section>
  );
}
