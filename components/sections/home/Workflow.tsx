import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { WORKFLOW_STAGES, home } from "@/lib/content";
import { ArrowLink, SectionIntro } from "./shared";

const { workflow } = home;

/** Home section 3: the three workflow steps (WORKFLOW_STAGES, shared with /products#how-it-works). */
export default function Workflow() {
  return (
    <Section id="workflow" aria-labelledby="workflow-title" className="py-[72px] md:py-[104px]">
      <SectionIntro kicker={workflow.kicker} title={workflow.title} titleMuted={workflow.titleMuted} titleId="workflow-title" />
      <WorkflowSteps className="mt-10 md:mt-14" />
      <ArrowLink href={workflow.link.href} className="mt-4">
        {workflow.link.label}
      </ArrowLink>
    </Section>
  );
}

/** The three steps as a numbered hairline grid (also used on /products). */
export function WorkflowSteps({ className }: { className?: string }) {
  return (
    <Reveal as="ol" stagger={0.06} amount={0.1} className={cn("hairline-grid grid-cols-1 md:grid-cols-3", className)}>
      {WORKFLOW_STAGES.map((s) => (
        <RevealItem key={s.id} as="li" className="flex flex-col bg-surface p-6 sm:p-7">
          <span className="font-mono text-[11px] tracking-[0.08em] text-lime">{s.n}</span>
          <h3 className="mt-5 text-[21px] leading-[1.2] font-semibold tracking-title text-text">{s.label}</h3>
          <p className="mt-3 text-[15px] leading-[1.7] text-muted">{s.body}</p>
        </RevealItem>
      ))}
    </Reveal>
  );
}
