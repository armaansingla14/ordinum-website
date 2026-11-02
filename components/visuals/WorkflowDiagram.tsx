import { MonoTag } from "@/components/sections/technology/shared";
import { cn } from "@/lib/cn";
import { WORKFLOW_STAGES } from "@/lib/content";

const mono = "font-mono text-[10.5px] leading-[1.4] tracking-[0.1em] uppercase";

/** Right-pointing arrow (rotated down below lg). Decorative. */
function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 12"
      className="absolute left-7 -bottom-[17px] z-10 h-3 w-6 rotate-90 text-lime lg:top-1/2 lg:right-[-19px] lg:bottom-auto lg:left-auto lg:-translate-y-1/2 lg:rotate-0"
    >
      <path d="M0 6h20M15 1l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/**
 * Diagram: the five-step workflow (Connect -> Run scenarios -> Reproduce -> Verify the fix ->
 * Keep as a regression), with the regression feeding the next release. Semantic list with SVG
 * connectors: legible at 320px (vertical) and in one row from lg up. `detail` shows the longer
 * body text (/products); the home page shows the one-line `short`.
 */
export default function WorkflowDiagram({ detail = false, className }: { detail?: boolean; className?: string }) {
  return (
    <figure className={cn("border border-line-2 bg-window", className)} aria-labelledby="workflow-diagram-caption">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p id="workflow-diagram-caption" className={cn(mono, "text-[#a5b1ad]")}>
          The Ordinum workflow
        </p>
        <MonoTag>Diagram</MonoTag>
      </div>
      <div className="p-5 sm:p-6">
        <ol className="grid grid-cols-1 gap-[22px] lg:grid-cols-5 lg:gap-[26px]">
          {WORKFLOW_STAGES.map((s, i) => (
            <li key={s.id} className="relative flex flex-col border border-line-2 bg-surface p-4">
              <span className="font-mono text-[11px] tracking-[0.08em] text-lime">{s.n}</span>
              <h3 className="mt-2 text-[16.5px] leading-[1.25] font-semibold tracking-[-0.025em] text-text">{s.label}</h3>
              <p className="mt-1.5 text-[13.5px] leading-[1.55] text-muted">{detail ? s.body : s.short}</p>
              {i < WORKFLOW_STAGES.length - 1 && <Arrow />}
            </li>
          ))}
        </ol>
        {/* The loop back: a kept regression runs again on the next release. */}
        <div aria-hidden="true" className="relative mx-[10%] mt-3 hidden h-5 border-x border-b border-dashed border-lime/50 lg:block">
          <svg viewBox="0 0 10 10" className="absolute -top-[9px] -left-[5px] size-2.5 text-lime">
            <path d="M1 7l4-5 4 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
        <p className="mt-3 font-mono text-[11px] leading-[1.5] tracking-[0.06em] text-subtle lg:text-center">
          Each kept regression runs again on the next release.
        </p>
      </div>
    </figure>
  );
}
