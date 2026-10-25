import { mono } from "@/components/sections/technology/shared";
import { cn } from "@/lib/cn";
import { WORKFLOW_STAGES, lifecycle, type LifecycleStage, type WorkflowStageId } from "@/lib/content";

/*
 * Visual: the seven-stage lifecycle (Define -> Generate -> Execute -> Observe -> Verify ->
 * Reproduce -> Regress), shown on /technology only. Server component, no interaction needed:
 * - lg+: a rail grouping the seven stages under the four home-page stages (decorative), then
 *   one row per stage.
 * - below lg: the rows stack; each row names its home-page stage.
 * Every stage, its artifact and what exists in the engine today are in the static HTML.
 */

const stages: readonly LifecycleStage[] = lifecycle.stages;
const workflowLabel = (id: WorkflowStageId) => WORKFLOW_STAGES.find((w) => w.id === id)?.label ?? id;

/** Consecutive runs of stages that belong to the same home-page stage. */
const groups = stages.reduce<{ id: WorkflowStageId; count: number }[]>((acc, s) => {
  const last = acc[acc.length - 1];
  if (last && last.id === s.workflowStage) last.count += 1;
  else acc.push({ id: s.workflowStage, count: 1 });
  return acc;
}, []);

function Rail() {
  return (
    <div aria-hidden="true" className="hidden border-b border-line px-6 pt-5 pb-6 lg:block">
      <div className="grid gap-x-2" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}>
        {groups.map((g) => (
          <div key={g.id} style={{ gridColumn: `span ${g.count}` }} className="border-t border-lime/50 pt-2.5">
            <span className={cn(mono, "text-lime")}>{workflowLabel(g.id)}</span>
          </div>
        ))}
      </div>
      <div
        className="relative mt-5 grid"
        style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
      >
        <span
          className="absolute top-[5px] h-px bg-line-2"
          style={{ left: `${50 / stages.length}%`, right: `${50 / stages.length}%` }}
        />
        {stages.map((s) => (
          <div key={s.id} className="relative flex flex-col items-center text-center">
            <span className="size-[11px] border border-lime bg-window" />
            <span className="mt-3 font-mono text-[11px] tracking-[0.08em] text-lime">{s.n}</span>
            <span className="mt-1 text-[14px] leading-tight font-[550] tracking-[-0.02em] text-text">{s.short}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Lifecycle({ className }: { className?: string }) {
  return (
    <figure className={cn("border border-[#3c4749] bg-window", className)}>
      <figcaption className="sr-only">
        The Ordinum testing lifecycle in seven stages, grouped under the four stages Connect, Stress-test, Verify, and
        Reproduce and prevent, with the artifact each stage produces and what exists in the engine today.
      </figcaption>
      <Rail />
      <ol className="divide-y divide-line">
        {stages.map((s) => (
          <li
            key={s.id}
            className="grid gap-x-8 gap-y-4 px-4 py-5 sm:px-6 md:py-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,4fr)]"
          >
            <div className="min-w-0">
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-[11px] tracking-[0.08em] text-lime">{s.n}</span>
                <span className={cn(mono, "text-subtle")}>{workflowLabel(s.workflowStage)}</span>
              </p>
              <h4 className="mt-2.5 text-[18px] leading-[1.25] font-[550] tracking-[-0.025em] text-text md:text-[19px]">
                {s.title}
              </h4>
              <p className="mt-2 text-[14.5px] leading-[1.7] text-muted">{s.body}</p>
            </div>
            <div className="min-w-0 border-t border-line pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
              <p className={cn(mono, "text-subtle")}>Produces</p>
              <p className="mt-2.5 flex items-start gap-2.5 text-[14.5px] leading-snug font-[550] tracking-[-0.02em] text-text">
                <span aria-hidden="true" className="mt-[6px] size-[6px] shrink-0 border border-lime" />
                {s.artifact.name}
              </p>
              <p className="mt-2 text-[13.5px] leading-[1.65] text-muted">{s.artifact.detail}</p>
            </div>
            <div className="min-w-0 lg:border-l lg:border-line lg:pl-6">
              <p className={cn(mono, "text-lime")}>In the engine today</p>
              <p className="mt-2.5 text-[13.5px] leading-[1.65] text-muted">{s.today}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
