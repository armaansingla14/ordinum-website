import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import WorkflowDiagram from "@/components/visuals/WorkflowDiagram";
import { home } from "@/lib/content";
import { ArrowLink, SectionIntro } from "./shared";

const { workflow } = home;

/** Home section 3: the five-step workflow as one diagram (WORKFLOW_STAGES, shared with /products). */
export default function Workflow() {
  return (
    <Section id="workflow" aria-labelledby="workflow-title" className="py-[56px] md:py-[80px]">
      <SectionIntro kicker={workflow.kicker} title={workflow.title} titleId="workflow-title" />
      <Reveal className="mt-8 md:mt-10" amount={0.05}>
        <WorkflowDiagram />
      </Reveal>
      <ArrowLink href={workflow.link.href} className="mt-4">
        {workflow.link.label}
      </ArrowLink>
    </Section>
  );
}
