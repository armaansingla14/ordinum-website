import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import { SECTION_PAD, SectionIntro } from "@/components/sections/technology/shared";
import RoadmapList from "@/components/sections/roadmap/RoadmapList";
import Mission from "@/components/sections/vision/Mission";
import WhyNow from "@/components/sections/vision/WhyNow";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import AgenticLoop from "@/components/visuals/AgenticLoop";
import { agenticLoop, roadmap } from "@/lib/content";

export const metadata: Metadata = pageMetadata("roadmap");

/** /roadmap (formerly /vision): in progress and planned work, the agentic security loop (#agentic-loop), the long-term direction, and why now (#why-now). */
export default function RoadmapPage() {
  const l = roadmap.loop;
  return (
    <>
      <PageHeader page="roadmap" />
      <RoadmapList />
      <Section id={l.id} variant="charcoal" aria-labelledby={`${l.id}-title`} className={SECTION_PAD}>
        <SectionIntro kicker={l.kicker} title={agenticLoop.title} titleId={`${l.id}-title`} lede={agenticLoop.lede} />
        <Reveal className="mt-8 md:mt-10" amount={0.05}>
          <AgenticLoop />
        </Reveal>
      </Section>
      <Mission />
      <WhyNow />
      <CtaBand current="roadmap" />
    </>
  );
}
