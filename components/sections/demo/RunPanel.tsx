import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { DemoStepId } from "@/lib/content";
import { nav2SuccessMismatch as sm } from "@/lib/evidence";
import { ReplaySquares } from "./parts";

/* -------------------------------------------------------------------------- */
/* Compact view of the minimized Nav2 replay that the stepper pins beside the  */
/* steps (desktop only). Every value is read from nav2SuccessMismatch. The     */
/* active step decides which region is lit (lime rule + faint tint). The rest  */
/* is not dimmed, so every label keeps full text contrast.                     */
/* The full interactive trace and the report preview sit lower on the page.    */
/* -------------------------------------------------------------------------- */

type Region = "target" | "faults" | "nav2" | "oracle" | "violation" | "repro" | "regression";

const LIT: Record<DemoStepId, readonly Region[]> = {
  system: ["target", "nav2"],
  property: ["oracle"],
  faults: ["faults"],
  observed: ["nav2"],
  verdict: ["oracle", "violation"],
  reproduction: ["repro"],
  regression: ["regression"],
};

const T_MAX = 12;
const TICKS = [0, 4, 8, 12];
const pct = (t: number) => `${(Math.min(Math.max(t, 0), T_MAX) / T_MAX) * 100}%`;
const runEnd = sm.minimized.result.tS;

const navLane = sm.minimized.lanes.find((l) => l.component === "bt_navigator");
const oracleLane = sm.minimized.lanes.find((l) => l.channel === "truth" && l.events.some((e) => e.tone === "violation"));
const violation = oracleLane?.events.find((e) => e.tone === "violation");
const faults = sm.minimized.faults.map((f) => {
  const start = f.appliedAt ?? f.at;
  const end = Math.min(start + (typeof f.params.duration_s === "number" ? f.params.duration_s : 0), runEnd);
  return { idx: f.idx, name: `${f.kind} · ${f.target}`, start, end };
});
const caseFile = sm.regressionCase.split("/").pop() ?? sm.regressionCase;

function Zone({ on, children, className }: { on: boolean; children: ReactNode; className?: string }) {
  return (
    <div
      data-lit={on ? "" : undefined}
      className={cn(
        "relative border-l-2 transition-colors duration-300 motion-reduce:transition-none",
        on ? "border-lime bg-lime/[0.05]" : "border-transparent",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Lane({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-x-3 py-1.5 xl:grid-cols-[112px_minmax(0,1fr)]">
      <span className="truncate font-mono text-[10px] text-[#b7c4bf]">{label}</span>
      <div className="relative h-6">
        {TICKS.map((t) => (
          <span key={t} className="absolute inset-y-0 w-px bg-line/70" style={{ left: pct(t) }} />
        ))}
        <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
        {children}
      </div>
    </div>
  );
}

const HATCH = "repeating-linear-gradient(135deg, rgb(214 222 219 / 0.55) 0 1px, transparent 1px 5px)";

export default function RunPanel({ active }: { active: DemoStepId }) {
  const lit = (r: Region) => LIT[active].includes(r);

  return (
    <div aria-hidden="true" className="border border-line-2 bg-window">
      <div className="flex min-h-[44px] items-center justify-between gap-4 border-b border-line px-4 py-3 font-mono text-[10px] tracking-[0.08em] text-[#a5b1ad] uppercase">
        <span className="min-w-0 truncate">
          <span className="text-lime">Real run</span> <span className="text-line-2">/</span> {sm.verdict.invariant}
        </span>
        <span className="shrink-0 text-[#8a9894]">minimized replay · seed {sm.minimized.execSeed}</span>
      </div>

      <Zone on={lit("target")} className="border-b border-b-line px-4 py-3">
        <p className="font-mono text-[10px] tracking-[0.08em] text-[#8a9894] uppercase">System under test</p>
        <p className="mt-1 font-mono text-[11.5px] text-text">
          {sm.target.name} · task {sm.task.id} {sm.task.name}
        </p>
      </Zone>

      <div className="px-4 pt-3 pb-4">
        {/* Axis */}
        <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-x-3 pl-[2px] xl:grid-cols-[112px_minmax(0,1fr)]">
          <span className="font-mono text-[10px] text-[#8a9894] uppercase">Sim time</span>
          <div className="relative h-4">
            {TICKS.map((t) => (
              <span
                key={t}
                className={cn(
                  "absolute font-mono text-[10px] tabular-nums text-[#8a9894]",
                  t === 0 ? "" : t === T_MAX ? "-translate-x-full" : "-translate-x-1/2",
                )}
                style={{ left: pct(t) }}
              >
                {t === T_MAX ? `${t} s` : t}
              </span>
            ))}
          </div>
        </div>

        <Zone on={lit("faults")} className="mt-2 pl-[2px]">
          {faults.map((f) => (
            <Lane key={f.idx} label={`F${f.idx} ${f.name}`}>
              <span
                className="absolute top-1/2 h-[11px] -translate-y-1/2 border border-[#d6dedb]"
                style={{ left: pct(f.start), width: `calc(${pct(f.end)} - ${pct(f.start)})`, backgroundImage: HATCH }}
              />
            </Lane>
          ))}
        </Zone>

        <Zone on={lit("nav2")} className="pl-[2px]">
          <Lane label={navLane?.component ?? "bt_navigator"}>
            {navLane?.events.map((e) => (
              <span
                key={e.t}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: pct(e.t) }}
              >
                <span className={cn("block", e.tone === "result" ? "size-[10px] bg-text" : "size-[7px] border border-[#a8b1b0] bg-window")} />
              </span>
            ))}
          </Lane>
        </Zone>

        <Zone on={lit("oracle")} className="pl-[2px]">
          <Lane label={sm.verdict.invariant}>
            {violation && (
              <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: pct(violation.t) }}>
                <span
                  className={cn(
                    "absolute -inset-[5px] border transition-colors duration-300 motion-reduce:transition-none",
                    lit("violation") ? "border-orange" : "border-orange/30",
                  )}
                />
                <span className="block size-[11px] rotate-45 bg-orange" />
              </span>
            )}
          </Lane>
        </Zone>

        <p className="mt-3 font-mono text-[10.5px] leading-[1.5] text-[#b7c4bf]">
          Nav2 {sm.minimized.result.status} at {sm.minimized.result.tS.toFixed(2)} s ·{" "}
          <span className={cn(lit("violation") || lit("oracle") ? "text-orange" : "text-[#8a9894]")}>
            truth {sm.verdict.distanceText} from goal
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-line bg-line">
        <Zone on={lit("repro")} className="bg-window px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.08em] text-[#8a9894] uppercase">Reproduction</p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11.5px] text-text">
            {sm.reproduction.rate}
            <ReplaySquares failures={sm.reproduction.failures} trials={sm.reproduction.trials} decorative />
          </p>
        </Zone>
        <Zone on={lit("repro")} className="bg-window px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.08em] text-[#8a9894] uppercase">Minimization</p>
          <p className="mt-1.5 font-mono text-[11.5px] text-text">
            {sm.minimization.before} → {sm.minimization.after} faults
          </p>
        </Zone>
        <Zone on={lit("regression")} className="col-span-2 bg-window px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.08em] text-[#8a9894] uppercase">Regression case</p>
          <p className="mt-1.5 font-mono text-[11.5px] break-all text-text">{caseFile}</p>
        </Zone>
      </div>
    </div>
  );
}
