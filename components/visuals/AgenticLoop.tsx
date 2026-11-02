import { MonoTag } from "@/components/sections/technology/shared";
import { MaturityMarker } from "@/components/ui/MaturityMarker";
import { cn } from "@/lib/cn";
import { LOOP_STATUS_LABELS, agenticLoop, type LoopStatus } from "@/lib/content";

const mono = "font-mono text-[10.5px] leading-[1.4] tracking-[0.1em] uppercase";

/** Marker per loop status: today solid lime, in development dashed lime, planned dashed steel. */
const MARKER = { today: "validated", dev: "in-progress", planned: "planned" } as const;

const GROUPS: readonly LoopStatus[] = ["today", "dev", "planned"];

/**
 * Diagram: the agentic security loop, every stage labeled Today / In development / Planned.
 * Only the "Today" stages exist; the seed-suggestion interface is in development; agents that
 * build harnesses, choose techniques or propose fixes are planned. No language model is in the
 * loop today (agenticLoop.note).
 */
export default function AgenticLoop({ className }: { className?: string }) {
  return (
    <figure className={cn("border border-line-2 bg-window", className)} aria-label={agenticLoop.ariaLabel}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className={cn(mono, "text-[#a5b1ad]")}>The agentic security loop</p>
        <MonoTag>Diagram · vision</MonoTag>
      </div>
      <div className="p-5 sm:p-6">
        <ol className="grid grid-cols-1 gap-[22px] md:grid-cols-[5fr_2fr_3fr] md:gap-[26px]">
          {GROUPS.map((g, gi) => {
            const stages = agenticLoop.stages.filter((s) => s.status === g);
            return (
              <li
                key={g}
                className={cn(
                  "relative flex flex-col border p-4",
                  g === "today" && "border-lime/45 bg-surface",
                  g === "dev" && "border-dashed border-lime/45 bg-surface/50",
                  g === "planned" && "border-dashed border-line-2",
                )}
              >
                <p className={cn(mono, "flex items-center gap-2", g === "planned" ? "text-muted" : "text-lime")}>
                  <MaturityMarker maturity={MARKER[g]} />
                  {LOOP_STATUS_LABELS[g]}
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {stages.map((s) => (
                    <li
                      key={s.id}
                      className={cn(
                        "border px-2.5 py-1.5 text-[13.5px] leading-[1.3] tracking-[-0.01em]",
                        g === "planned" ? "border-dashed border-line-2 text-muted" : "border-line-2 bg-window text-text",
                      )}
                    >
                      {s.label}
                    </li>
                  ))}
                </ul>
                {gi < GROUPS.length - 1 && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 12"
                    className="absolute left-7 -bottom-[17px] z-10 h-3 w-6 rotate-90 text-lime md:top-1/2 md:right-[-19px] md:bottom-auto md:left-auto md:-translate-y-1/2 md:rotate-0"
                  >
                    <path d="M0 6h20M15 1l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray={gi === 0 ? undefined : "3 2"} />
                  </svg>
                )}
              </li>
            );
          })}
        </ol>
        <p className="mt-4 border-l border-line-2 pl-4 text-[13.5px] leading-[1.6] text-muted">{agenticLoop.note}</p>
      </div>
    </figure>
  );
}
