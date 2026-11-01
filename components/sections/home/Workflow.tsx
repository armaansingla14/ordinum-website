import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import PipelineHero from "@/components/visuals/PipelineHero";
import { hero, home } from "@/lib/content";
import { ArrowLink, SectionIntro } from "./shared";

const { workflow } = home;

/**
 * Home section 3: the four-stage workflow (Connect, Stress-test, Verify, Reproduce & prevent),
 * carried by the conceptual PipelineHero, with links to the full workflow and the seven-stage
 * lifecycle on /products.
 */
export default function Workflow() {
  return (
    <Section id="workflow" aria-labelledby="workflow-title" className="py-[72px] md:py-[104px]">
      <SectionIntro kicker={workflow.kicker} title={workflow.title} titleMuted={workflow.titleMuted} titleId="workflow-title" />
      <Reveal className="mt-10 md:mt-14" amount={0.1}>
        <PipelineHero />
      </Reveal>
      <div className="mt-3 flex flex-wrap gap-x-8">
        <ArrowLink href={workflow.link.href}>{workflow.link.label}</ArrowLink>
        <ArrowLink href={hero.visual.link.href}>{hero.visual.link.label}</ArrowLink>
      </div>
    </Section>
  );
}
