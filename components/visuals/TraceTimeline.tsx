"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { EvidenceBadge, Provenance, ReplayDots } from "@/components/sections/research/badges";
import { asFaults } from "@/components/sections/research/faults";
import { cn } from "@/lib/cn";
import { EVIDENCE_CLASS_LABELS, evidenceClassOf } from "@/lib/content";
import { nav2SuccessMismatch, type EvidenceFault, type Lane, type LaneEvent } from "@/lib/evidence";

/* -------------------------------------------------------------------------- */
/* Visual 3: a real cross-component timeline.                                  */
/* Every value comes from lib/evidence.ts (nav2SuccessMismatch), which copies  */
/* the committed report and traces at the cited commit. Injected faults are     */
/* hatched neutral bands (they are inputs, not failures); orange marks only the */
/* invariant violation and the replays that reproduced it.                      */
/* -------------------------------------------------------------------------- */

const sm = nav2SuccessMismatch;
/** Site evidence vocabulary: Nav2 is a real external target; the result class comes from the artifact. */
const LABEL_TEXT = `${EVIDENCE_CLASS_LABELS["real-external-target"]} · ${EVIDENCE_CLASS_LABELS[evidenceClassOf(sm.label)]}`;
type RunKey = "minimized" | "original";

const T_MAX = 12;
const TICKS = [0, 2, 4, 6, 8, 10, 12];
const EASE = [0.16, 1, 0.3, 1] as const;

const pct = (t: number) => `${(Math.min(Math.max(t, 0), T_MAX) / T_MAX) * 100}%`;
const fmt = (t: number) => `${t.toFixed(2)} s`;

type Run = {
  key: RunKey;
  tab: string;
  summary: string;
  execSeed: number;
  faults: readonly EvidenceFault[];
  lanes: readonly Lane[];
  resultT: number;
  resultText: string;
  violated: boolean;
  traceSource: string;
};

const RUNS: Record<RunKey, Run> = {
  minimized: {
    key: "minimized",
    tab: `Minimized · ${sm.minimization.after} faults`,
    summary: `ddmin output, replayed at exec seed ${sm.minimized.execSeed}. This run violates the invariant.`,
    execSeed: sm.minimized.execSeed,
    faults: asFaults(sm.minimized.faults),
    lanes: sm.minimized.lanes,
    resultT: sm.minimized.result.tS,
    resultText: `${sm.minimized.result.status} (error ${sm.minimized.result.errorCode})`,
    violated: true,
    traceSource: sm.traceSources[1],
  },
  original: {
    key: "original",
    tab: `Original · ${sm.minimization.before} scheduled`,
    summary: sm.original.note,
    execSeed: sm.original.execSeed,
    faults: asFaults(sm.original.faults),
    lanes: sm.original.lanes,
    resultT: sm.original.result.tS,
    resultText: `${sm.original.result.status} (error ${sm.original.result.errorCode})`,
    violated: false,
    traceSource: sm.traceSources[0],
  },
};

/**
 * Plain-English lane labels for the compact (home) embed: no unexplained ROS identifiers there.
 * The raw component and fault ids stay on /demo, where the event log explains them.
 */
const PLAIN_FAULT: Record<string, string> = {
  "msg_noise · tf": "Position noise",
  "msg_noise · odom": "Odometry noise",
  "msg_reorder · scan": "Reordered laser scans",
  "msg_nan · scan": "Invalid laser values",
};
const PLAIN_LANE: Record<string, { label: string; sub?: string }> = {
  bt_navigator: { label: "Nav2 result", sub: "what Nav2 reported" },
  "behavior tree": { label: "Nav2 planner", sub: "replans ~1/s" },
};

const HARNESS = "ordinum (harness)";
const ORACLE = "oracle (truth vs claimed)";
const BT_TICK = "ComputePathToPose SUCCESS";

/** "msg_noise · tf · sigma 0.356" */
function faultLabel(f: EvidenceFault) {
  const params = Object.entries(f.params)
    .filter(([k]) => k !== "duration_s")
    .map(([k, v]) => `${k === "sigma" ? "σ" : k} ${v}`)
    .join(", ");
  return { name: `${f.kind} · ${f.target}`, params };
}

function faultEnd(f: EvidenceFault, runEnd: number) {
  const d = typeof f.params.duration_s === "number" ? f.params.duration_s : 0;
  return Math.min((f.appliedAt ?? f.at) + d, runEnd);
}

type LogRow = {
  id: string;
  t: number;
  component: string;
  text: string;
  tone: LaneEvent["tone"];
};

/** Flatten lanes into an ordered event log; collapse the periodic BT replan ticks into one row. */
function buildLog(run: Run): LogRow[] {
  const rows: LogRow[] = [];
  run.lanes.forEach((lane, li) => {
    const ticks = lane.events.filter((e) => e.text === BT_TICK);
    lane.events.forEach((e, ei) => {
      if (e.text === BT_TICK) return;
      rows.push({ id: `${li}-${ei}`, t: e.t, component: lane.component, text: e.text, tone: e.tone });
    });
    if (ticks.length > 0) {
      rows.push({
        id: `${li}-ticks`,
        t: ticks[0].t,
        component: lane.component,
        text: `${ticks.length} replanning ticks, about once per second (${BT_TICK}, two events per tick)`,
        tone: "info",
      });
    }
  });
  return rows.sort((a, b) => a.t - b.t);
}

/* -------------------------------------------------------------------------- */
/* Lane primitives                                                             */
/* -------------------------------------------------------------------------- */

function Track({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn("relative h-7 min-w-0", className)}>
      {TICKS.map((t) => (
        <span key={t} aria-hidden="true" className="absolute inset-y-0 w-px bg-line/70" style={{ left: pct(t) }} />
      ))}
      <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-line" />
      {children}
    </div>
  );
}

function LaneRow({
  label,
  sub,
  children,
  compact,
}: {
  label: string;
  sub?: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-y-1 py-1.5",
        compact ? "sm:grid-cols-[152px_minmax(0,1fr)] sm:gap-x-3" : "sm:grid-cols-[168px_minmax(0,1fr)] sm:gap-x-3",
      )}
    >
      <div className="min-w-0 self-center font-mono text-[11px] leading-[1.35] text-[#b7c4bf]">
        <span className="block break-words">{label}</span>
        {sub && <span className="block break-words text-[11px] text-quiet">{sub}</span>}
      </div>
      {children}
    </div>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="label-mono mt-3 border-t border-line pt-3 text-[10px] text-[#8a9894] first:mt-0 first:border-t-0 first:pt-0">
      {children}
    </p>
  );
}

function Marker({
  t,
  tone,
  active,
}: {
  t: number;
  tone: LaneEvent["tone"] | "pass";
  active?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ left: pct(t) }}
    >
      {active && <span className="absolute -inset-[6px] border border-lime" />}
      {tone === "violation" ? (
        <>
          <span className="absolute -inset-[5px] border border-orange/40" />
          <span className="block size-[11px] rotate-45 bg-orange" />
        </>
      ) : tone === "result" ? (
        <span className="block size-[10px] bg-text" />
      ) : tone === "pass" ? (
        <span className="block size-[10px] border border-text" />
      ) : (
        <span className="block size-[7px] border border-[#a8b1b0] bg-window" />
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                              */
/* -------------------------------------------------------------------------- */

/**
 * compact: home embed (minimized run only, plain-English labels, no log or tiles).
 * bare: /demo full trace, which sits below the walkthrough: run tabs, lanes and event log, but
 * no evidence badge and no verdict / reproduction / minimization tiles (the steps above carry them).
 */
export default function TraceTimeline({ compact = false, bare = false }: { compact?: boolean; bare?: boolean }) {
  const uid = useId();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  const [runKey, setRunKey] = useState<RunKey>("minimized");
  const [selected, setSelected] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const run = RUNS[compact ? "minimized" : runKey];
  const log = buildLog(run);
  const lanes = run.lanes.map((lane, li) => ({ lane, li }));
  const observed = lanes.filter(({ lane }) => lane.component !== HARNESS && lane.component !== ORACLE);
  const oracleLane = lanes.find(({ lane }) => lane.component === ORACLE);
  const appliedFaults = run.faults.filter((f) => f.appliedAt !== null);
  const skippedFaults = run.faults.filter((f) => f.appliedAt === null);

  const keys: RunKey[] = ["minimized", "original"];
  const selectRun = (k: RunKey) => {
    setRunKey(k);
    setSelected(null);
  };
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const i = keys.indexOf(runKey);
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? keys.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + keys.length) % keys.length;
    selectRun(keys[next]);
    document.getElementById(`${uid}-tab-${keys[next]}`)?.focus();
  };

  const isActive = (li: number, ei: number) => selected === `${li}-${ei}`;
  /** Collapsed log: only faults, the reported result and the violation. */
  const keyRows = log.filter((r) => r.tone !== "info");
  const shownRows = showAll ? log : keyRows;
  const selectedRow = log.find((r) => r.id === selected) ?? null;

  const description =
    `Real trace of the Nav2 success_mismatch case (${run.key} run, exec seed ${run.execSeed}). ` +
    run.faults
      .map((f) => `Fault ${f.idx}: ${f.kind} on ${f.target}, ${f.appliedAt === null ? f.status : `applied at ${fmt(f.appliedAt)}`}.`)
      .join(" ") +
    ` Nav2 result: ${run.resultText} at ${fmt(run.resultT)}. ` +
    (run.violated ? `Oracle: ${sm.verdict.detail}.` : "Oracle: no violation in this run.");

  return (
    <figure ref={ref} className="flex min-w-0 flex-col" aria-labelledby={`${uid}-title`}>
      <div className="overflow-hidden border border-line-2 bg-window shadow-[0_28px_70px_rgb(0_0_0/0.34)]">
        {/* Window bar */}
        <div className="flex min-h-[47px] flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line px-4 py-3 sm:px-5">
          <p id={`${uid}-title`} className="min-w-0 font-mono text-[10px] tracking-[0.08em] text-[#a5b1ad] uppercase">
            <span className="text-lime">Real trace</span> <span className="text-line-2">/</span>{" "}
            {compact ? (
              "Nav2 pilot · minimized run"
            ) : (
              <>
                {sm.verdict.invariant} <span className="text-line-2">/</span> task {sm.task.id} {sm.task.name}
              </>
            )}
          </p>
          {!compact && (
            <div role="tablist" aria-label="Choose run" className="grid w-full grid-cols-2 border border-line-2 sm:flex sm:w-auto">
              {keys.map((k) => {
                const on = runKey === k;
                return (
                  <button
                    key={k}
                    id={`${uid}-tab-${k}`}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls={`${uid}-panel`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => selectRun(k)}
                    onKeyDown={onTabKey}
                    className={cn(
                      "min-h-11 px-2.5 py-1.5 font-mono text-[10px] leading-[1.35] tracking-[0.08em] uppercase transition-colors duration-200 sm:min-h-9 sm:px-3.5",
                      on ? "bg-text text-bg" : "text-muted hover:text-lime",
                    )}
                  >
                    {RUNS[k].tab}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div
          id={`${uid}-panel`}
          role={compact ? undefined : "tabpanel"}
          aria-labelledby={compact ? undefined : `${uid}-tab-${runKey}`}
          className="px-4 pt-4 pb-5 sm:px-5"
        >
          {/* Classification first: it frames everything below. Compact embeds carry the label in
              their own section head, so it is not repeated here. */}
          {!compact && !bare && (
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
              <EvidenceBadge label={sm.label} text={LABEL_TEXT} />
              <p className="text-[13px] leading-[1.5] text-muted">{sm.labelShort}</p>
            </div>
          )}
          {!compact && (
            <p className={cn("max-w-[760px] text-[13px] leading-[1.6] text-[#b7c4bf]", !bare && "mt-3")}>{run.summary}</p>
          )}

          {/* Lanes */}
          <div className={cn("relative", !compact && "mt-5")} aria-hidden="true">
            {/* Axis */}
            <div
              className={cn(
                "grid grid-cols-1 sm:gap-x-3",
                compact ? "sm:grid-cols-[152px_minmax(0,1fr)]" : "sm:grid-cols-[168px_minmax(0,1fr)]",
              )}
            >
              <span className="label-mono hidden text-[10px] text-[#8a9894] sm:block">Sim time</span>
              <div className="relative h-5">
                {TICKS.map((t) => (
                  <span
                    key={t}
                    className={cn(
                      "absolute top-0 font-mono text-[10px] tabular-nums text-[#8a9894]",
                      t === 0 ? "" : t === T_MAX ? "-translate-x-full" : "-translate-x-1/2",
                    )}
                    style={{ left: pct(t) }}
                  >
                    {t === T_MAX ? `${t} s` : t}
                  </span>
                ))}
              </div>
            </div>

            <GroupLabel>Injected by Ordinum · harness</GroupLabel>
            {appliedFaults.map((f) => {
              const { name, params } = faultLabel(f);
              const plain = compact ? PLAIN_FAULT[name] : undefined;
              const start = f.appliedAt ?? f.at;
              const end = faultEnd(f, run.resultT);
              return (
                <LaneRow
                  key={f.idx}
                  compact={compact}
                  label={plain ?? `F${f.idx} ${name}`}
                  sub={
                    plain
                      ? params
                      : [params, f.minimization ? `${f.minimization} by ddmin` : null].filter(Boolean).join(" · ")
                  }
                >
                  <Track>
                    <span
                      className={cn(
                        "absolute top-1/2 h-[12px] -translate-y-1/2 border",
                        f.minimization === "removed" ? "border-dashed border-[#5d6b6c]" : "border-[#d6dedb]",
                      )}
                      style={{
                        left: pct(start),
                        width: `calc(${pct(end)} - ${pct(start)})`,
                        backgroundImage:
                          f.minimization === "removed"
                            ? undefined
                            : "repeating-linear-gradient(135deg, rgb(214 222 219 / 0.55) 0 1px, transparent 1px 5px)",
                      }}
                    />
                  </Track>
                </LaneRow>
              );
            })}
            {skippedFaults.map((f) => {
              const { name } = faultLabel(f);
              return (
                <LaneRow key={f.idx} compact={compact} label={`F${f.idx} ${name}`} sub={`${f.status} · removed by ddmin`}>
                  <Track>
                    <span className="absolute top-1/2 left-0 -translate-y-1/2 font-mono text-[10px] text-[#8a9894]">
                      never applied
                    </span>
                  </Track>
                </LaneRow>
              );
            })}

            <GroupLabel>Observed from Nav2 · what the system reported</GroupLabel>
            {observed.map(({ lane, li }) => {
              const ticks = lane.events.filter((e) => e.text === BT_TICK);
              const running = lane.events.find((e) => e.text.startsWith("FollowPath RUNNING"));
              const plain = compact ? PLAIN_LANE[lane.component] : undefined;
              return (
                <LaneRow
                  key={li}
                  compact={compact}
                  label={plain?.label ?? lane.component}
                  sub={plain ? plain.sub : ticks.length ? "replans ~1/s" : undefined}
                >
                  <Track>
                    {running && (
                      <span
                        className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-[#5d6b6c]"
                        style={{ left: pct(running.t), width: `calc(${pct(run.resultT)} - ${pct(running.t)})` }}
                      />
                    )}
                    {ticks.map((e) => (
                      <span
                        key={`tick-${e.t}`}
                        className={cn("absolute top-1/2 h-[12px] w-px -translate-y-1/2 bg-lime/70", selected === `${li}-ticks` && "bg-lime")}
                        style={{ left: pct(e.t) }}
                      />
                    ))}
                    {lane.events.map((e, ei) =>
                      e.text === BT_TICK || e === running ? null : (
                        <Marker key={ei} t={e.t} tone={e.tone} active={isActive(li, ei)} />
                      ),
                    )}
                  </Track>
                </LaneRow>
              );
            })}

            <GroupLabel>Checked by the oracle · simulator ground truth</GroupLabel>
            <LaneRow
              compact={compact}
              label={compact ? "Ground-truth check" : "success_mismatch"}
              sub="truth vs claimed, 0.35 m"
            >
              <Track>
                {oracleLane ? (
                  oracleLane.lane.events.map((e, ei) => (
                    <Marker key={ei} t={e.t} tone={e.tone} active={isActive(oracleLane.li, ei)} />
                  ))
                ) : (
                  <Marker t={run.resultT} tone="pass" />
                )}
              </Track>
            </LaneRow>

            {/* Guide for the event selected in the log */}
            {selectedRow && (
              <div
                className={cn(
                  "pointer-events-none absolute inset-y-0 right-0 left-0",
                  compact ? "sm:left-[164px]" : "sm:left-[180px]",
                )}
              >
                <span
                  className="absolute inset-y-0 w-px border-l border-dashed border-lime"
                  style={{ left: pct(selectedRow.t) }}
                />
              </div>
            )}

            {/* One-time playhead sweep (transform only; skipped under reduced motion). */}
            {!reduce && (
              <div
                className={cn(
                  "pointer-events-none absolute inset-y-0 right-0 left-0 overflow-hidden",
                  compact ? "sm:left-[164px]" : "sm:left-[180px]",
                )}
              >
                <motion.div
                  key={run.key}
                  className="absolute inset-y-0 left-0 w-full"
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={inView ? { x: "0%", opacity: [0, 1, 1, 0] } : undefined}
                  transition={{
                    x: { duration: 2.2, ease: EASE },
                    opacity: { duration: 2.6, times: [0, 0.05, 0.85, 1] },
                  }}
                >
                  <span className="absolute inset-y-0 right-0 w-px bg-lime" />
                </motion.div>
              </div>
            )}
          </div>

          {/* Legend */}
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.06em] text-[#8a9894] uppercase" aria-hidden="true">
            <li className="inline-flex items-center gap-2">
              <span
                className="h-[10px] w-5 border border-[#d6dedb]"
                style={{ backgroundImage: "repeating-linear-gradient(135deg, rgb(214 222 219 / 0.55) 0 1px, transparent 1px 5px)" }}
              />
              Injected fault (input)
            </li>
            {!compact && (
              <li className="inline-flex items-center gap-2">
                <span className="h-[10px] w-5 border border-dashed border-[#5d6b6c]" /> Removed by ddmin
              </li>
            )}
            <li className="inline-flex items-center gap-2">
              <span className="size-[9px] bg-text" /> Nav2 result
            </li>
            <li className="inline-flex items-center gap-2">
              <span className="size-[9px] rotate-45 bg-orange" /> Invariant violated
            </li>
            {!compact && (
              <li className="inline-flex items-center gap-2">
                <span className="size-[9px] border border-text" /> No violation
              </li>
            )}
          </ul>

          <p className="sr-only">{description}</p>

          {/* Event log: the text equivalent of the lanes, and the keyboard way in. */}
          {!compact && (
            <div className="mt-6 border-t border-line pt-4">
              <p className="label-mono text-[10px] text-[#8a9894]" id={`${uid}-log`}>
                Event log · select an event to locate it{!showAll && keyRows.length < log.length ? " · key events" : ""}
              </p>
              <ol id={`${uid}-log-list`} aria-labelledby={`${uid}-log`} className="mt-3 grid gap-px bg-line sm:grid-cols-2">
                {shownRows.map((row) => {
                  const on = selected === row.id;
                  return (
                    <li key={row.id} className="bg-window">
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setSelected(on ? null : row.id)}
                        className={cn(
                          "grid min-h-11 w-full grid-cols-[64px_minmax(0,1fr)] gap-x-3 border-l px-3 py-2 text-left font-mono text-[11px] leading-[1.5] transition-colors duration-200",
                          on ? "border-lime bg-surface" : "border-transparent hover:bg-surface",
                          row.tone === "violation" ? "text-[#ffd0b9]" : "text-[#d6dedb]",
                        )}
                      >
                        <span className="tabular-nums text-[#8a9894]">{fmt(row.t)}</span>
                        <span className="min-w-0">
                          <span
                            className={cn(
                              "block text-[10px] tracking-[0.06em] uppercase",
                              row.tone === "violation" ? "text-orange" : "text-[#8a9894]",
                            )}
                          >
                            {row.component}
                            {row.tone === "fault" && " · fault"}
                          </span>
                          <span className="break-words">{row.text}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              {keyRows.length < log.length && (
                <button
                  type="button"
                  aria-expanded={showAll}
                  aria-controls={`${uid}-log-list`}
                  onClick={() => setShowAll((v) => !v)}
                  className="mt-3 inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-lime uppercase underline decoration-lime/40 underline-offset-4 hover:decoration-lime"
                >
                  {showAll ? `Show key events only (${keyRows.length})` : `Show all ${log.length} events`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Verdict + reproduction. Not in compact embeds: the walkthrough steps beside them carry these values. */}
        {!compact && !bare && (
          <div className="grid grid-cols-1 gap-px border-t border-line bg-line md:grid-cols-2 xl:grid-cols-4">
            <div className="bg-window px-4 py-4 sm:px-5">
              <p className="label-mono text-[10px] text-[#8a9894]">Invariant verdict</p>
              {run.violated ? (
                <>
                  <p className="mt-2 font-mono text-[12px] text-orange uppercase">
                    {sm.verdict.invariant} violated · {fmt(sm.verdict.tS)}
                  </p>
                  <p className="mt-2 text-[13px] leading-[1.55] text-[#d6dedb]">{sm.verdict.detail}</p>
                </>
              ) : (
                <>
                  <p className="mt-2 font-mono text-[12px] text-text uppercase">No violation in this run</p>
                  <p className="mt-2 text-[13px] leading-[1.55] text-[#d6dedb]">
                    Nav2 {run.resultText} at {fmt(run.resultT)}.
                  </p>
                </>
              )}
            </div>
            <div className="bg-window px-4 py-4 sm:px-5">
              <p className="label-mono text-[10px] text-[#8a9894]">Reproduction · minimized scenario</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-[12px] text-text">{sm.reproduction.rate}</span>
                <ReplayDots failures={sm.reproduction.failures} trials={sm.reproduction.trials} />
              </div>
              <p className="mt-2 text-[13px] leading-[1.55] text-[#d6dedb]">
                {sm.reproduction.wilson95Text}; exec seeds {sm.reproduction.execSeeds}. Statistical, not identical replay.
              </p>
            </div>
            <div className="bg-window px-4 py-4 sm:px-5">
              <p className="label-mono text-[10px] text-[#8a9894]">Minimization</p>
              <p className="mt-2 font-mono text-[12px] text-text">
                {sm.minimization.before} → {sm.minimization.after} faults
              </p>
              <p className="mt-2 text-[13px] leading-[1.55] text-[#d6dedb]">
                {sm.minimization.runs} {sm.minimization.algorithm} runs. {sm.minimization.note} {sm.followUp.note}
              </p>
            </div>
            <div className="bg-window px-4 py-4 sm:px-5">
              <p className="label-mono text-[10px] text-[#8a9894]">Retry / recovery signals</p>
              <p className="mt-2 font-mono text-[12px] text-text">
                replans {sm.minimized.counters.replans} · recoveries {sm.minimized.counters.recoveries} · BT failures{" "}
                {sm.minimized.counters.bt_failures}
              </p>
              <p className="mt-2 text-[13px] leading-[1.55] text-[#d6dedb]">
                Counters from the minimized run (replans counts planner SUCCESS events, two per replanning tick): Nav2 kept
                replanning about once a second and never entered a recovery behavior.
              </p>
            </div>
          </div>
        )}
      </div>

      <figcaption className="mt-4 space-y-1">
        <Provenance kind="Real trace">{sm.source}</Provenance>
        {!compact && (
          <p className="font-mono text-[10.5px] leading-[1.7] tracking-[0.04em] break-words text-[#8a9894]">
            Lanes from {run.traceSource}. The committed HTML report does not draw the behavior-tree lane; it comes from the committed
            minimized trace. Times are simulation seconds from goal dispatch.
          </p>
        )}
      </figcaption>
    </figure>
  );
}
