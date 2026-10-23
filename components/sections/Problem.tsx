import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import FailureCards, { type FailureCard, type FailureDiagramId } from "@/components/visuals/FailureCards";
import { home, type FailureExample } from "@/lib/content";
import { MonoTag, splitLabel } from "./home/shared";

const { problem } = home;

const byId = new Map<string, FailureExample>(problem.examples.map((e) => [e.id, e]));

/** Diagrammed patterns: one example, or a cause followed by its consequence. Ids from home.problem.examples. */
const DIAGRAMMED: readonly { diagram: FailureDiagramId; ids: readonly string[] }[] = [
  { diagram: "stale-authorization", ids: ["stale-authorization"] },
  { diagram: "retry-duplicate", ids: ["retries"] },
  { diagram: "restart-state", ids: ["component-restarts", "inconsistent-state"] },
  { diagram: "timeout-recovery", ids: ["timeouts", "unsafe-recovery"] },
];

const cards: FailureCard[] = DIAGRAMMED.map(({ diagram, ids }) => ({
  diagram,
  examples: ids.map((id) => byId.get(id)).filter((e): e is FailureExample => e !== undefined),
})).filter((c) => c.examples.length > 0);

const diagrammedIds = new Set(DIAGRAMMED.flatMap((d) => d.ids));
/** Every remaining category is still listed, so the section covers all of home.problem.examples. */
const others = problem.examples.filter((e) => !diagrammedIds.has(e.id));

export default function Problem() {
  const [kicker, kickerIndex] = splitLabel(problem.kicker);

  return (
    <Section id="problem" aria-labelledby="problem-title">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        {/* Narrative */}
        <Reveal className="lg:sticky lg:top-[120px] lg:col-span-5 lg:self-start">
          <Kicker index={kickerIndex}>{kicker}</Kicker>
          <Heading id="problem-title" muted={problem.titleMuted} className="mt-6 text-[clamp(36px,3.2vw,46px)]/[1.06]">
            {problem.title}
          </Heading>
          <div className="mt-7 max-w-[540px] space-y-5 text-[16px] leading-[1.8] text-muted">
            {problem.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <ul
            aria-label="Diagram legend"
            className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-line pt-5 font-mono text-[11px] tracking-[0.12em] text-subtle uppercase sm:text-[10px]"
          >
            <li className="flex items-center gap-2.5">
              <span aria-hidden="true" className="h-px w-5 bg-lime" />
              Signal path
            </li>
            <li className="flex items-center gap-2.5">
              <span aria-hidden="true" className="w-5 border-t border-dashed border-line-2" />
              Boundary / event
            </li>
            <li className="flex items-center gap-2.5">
              <span aria-hidden="true" className="size-[7px] rounded-full bg-orange" />
              Failure
            </li>
          </ul>
        </Reveal>

        {/* Diagrammed patterns */}
        <Reveal className="min-w-0 lg:col-span-7" delay={0.08} amount={0.1}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <MonoTag>Conceptual</MonoTag>
            <p className="font-mono text-[10px] tracking-[0.12em] text-subtle uppercase">{problem.note}</p>
          </div>
          <FailureCards cards={cards} />
        </Reveal>
      </div>

      {/* Remaining categories, without diagrams */}
      {others.length > 0 && (
        <Reveal as="ul" stagger={0.05} className="hairline-grid mt-14 grid-cols-1 sm:grid-cols-3 lg:mt-16">
          {others.map((ex) => (
            <RevealItem key={ex.id} as="li" className="bg-bg p-5 sm:p-6">
              <p className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.12em] text-text uppercase">
                <span aria-hidden="true" className="inline-block size-[6px] shrink-0 border border-lime" />
                {ex.title}
              </p>
              <p className="mt-3 text-[14px] leading-[1.65] text-muted">{ex.detail}</p>
            </RevealItem>
          ))}
        </Reveal>
      )}
    </Section>
  );
}
