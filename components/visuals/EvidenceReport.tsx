import { EvidenceBadge, Provenance, ReplayDots } from "@/components/sections/research/badges";
import { asFaults } from "@/components/sections/research/faults";
import { cn } from "@/lib/cn";
import { EVIDENCE_LABELS, PRODUCT_SOURCE, nav2SuccessMismatch, type EvidenceFault } from "@/lib/evidence";

/* -------------------------------------------------------------------------- */
/* Visual 4: a legible preview of the real Ordinum HTML report for the Nav2    */
/* success_mismatch case. Re-rendered from lib/evidence.ts (which copies the    */
/* committed report, traces, meta and regression case); not a screenshot.     */
/* Server component: static, no motion.                                        */
/* -------------------------------------------------------------------------- */

const sm = nav2SuccessMismatch;
const REPORT_FILE = sm.source.split(" @ ")[0].split("/").pop() ?? sm.source;

/** Shorten long hashes for display; the full value stays in the title attribute and screen-reader text. */
function short(hash: string, keep = 12) {
  const [prefix, rest] = hash.includes(":") ? [hash.slice(0, hash.indexOf(":") + 1), hash.slice(hash.indexOf(":") + 1)] : ["", hash];
  return rest.length > keep + 6 ? `${prefix}${rest.slice(0, keep)}…${rest.slice(-6)}` : hash;
}

function params(f: EvidenceFault) {
  return Object.entries(f.params)
    .map(([k, v]) => `${k === "sigma" ? "σ" : k}=${v}`)
    .join(" ");
}

function FaultList({ faults, showMinimization }: { faults: readonly EvidenceFault[]; showMinimization?: boolean }) {
  return (
    <ol className="mt-3 space-y-px">
      {faults.map((f) => {
        const removed = f.minimization === "removed";
        return (
          <li
            key={f.idx}
            className={cn(
              "border-l py-1.5 pl-3 font-mono text-[11px] leading-[1.5]",
              removed ? "border-dashed border-[#5d6b6c] text-[#8a9894]" : "border-[#d6dedb] text-[#d6dedb]",
            )}
          >
            <span className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className={cn(removed && "line-through decoration-[#5d6b6c]")}>
                {f.kind} · {f.target}
              </span>
              <span className="tabular-nums text-[#8a9894]">
                {f.appliedAt === null ? "not applied" : `@ ${f.appliedAt.toFixed(2)} s`}
              </span>
            </span>
            <span className="block break-words text-[10.5px] text-[#8a9894]">
              {params(f)}
              {f.trigger && ` · trigger ${f.trigger}`}
            </span>
            {showMinimization && f.minimization && (
              <span className={cn("block text-[10px] tracking-[0.08em] uppercase", removed ? "text-[#8a9894]" : "text-lime")}>
                {f.minimization} by ddmin
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Row({ k, v, full }: { k: string; v: string; full?: string }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-0.5 py-1.5 sm:grid-cols-[120px_minmax(0,1fr)]">
      <dt className="font-mono text-[10px] tracking-[0.08em] text-[#8a9894] uppercase">{k}</dt>
      <dd className="min-w-0 font-mono text-[11px] break-all text-[#d6dedb]" title={full}>
        {v}
        {full && full !== v && <span className="sr-only"> (full value {full})</span>}
      </dd>
    </div>
  );
}

export default function EvidenceReport({ compact = false }: { compact?: boolean }) {
  const t = sm.target;
  return (
    <figure className="flex min-w-0 flex-col">
      <div className="overflow-hidden border border-line-2 bg-window shadow-[0_28px_70px_rgb(0_0_0/0.34)]">
        {/* Window bar: the actual report file name */}
        <div className="flex min-h-[47px] flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line px-4 py-3 font-mono text-[10px] tracking-[0.08em] text-[#a5b1ad] uppercase sm:px-5">
          <span className="min-w-0 break-all normal-case">{REPORT_FILE}</span>
          <span className="text-[#8a9894]">Report preview</span>
        </div>

        {/* Report header */}
        <div className="border-b border-line px-4 py-4 sm:px-5">
          <p className="font-mono text-[10px] tracking-[0.08em] text-[#8a9894] uppercase">
            {sm.failureId} · {t.name}
          </p>
          <p className="mt-2 text-[17px] font-semibold leading-[1.3] tracking-[-0.02em] text-text">
            <span className="font-mono text-[15px] font-normal text-orange">{sm.verdict.invariant}</span>{" "}
            <span className="text-quiet">[{sm.verdict.severity}]</span> on task {sm.task.id} ({sm.task.name})
          </p>
          <p className="mt-2 text-[13px] leading-[1.55] text-[#d6dedb]">{sm.verdict.detail}</p>
          <div className="mt-3">
            <EvidenceBadge label={sm.label} text={EVIDENCE_LABELS[sm.label]} />
          </div>
        </div>

        {/* Original vs reduced scenario */}
        <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2">
          <div className="bg-window px-4 py-4 sm:px-5">
            <p className="label-mono text-[10px] text-[#8a9894]">
              Original scenario · {sm.minimization.before} scheduled, {sm.minimization.beforeApplied} applied
            </p>
            {compact ? (
              <p className="mt-2 text-[12.5px] leading-[1.55] text-[#d6dedb]">
                {sm.original.faults.map((f) => f.kind).join(", ")}. Re-run at exec seed {sm.original.execSeed}: {sm.original.outcome}.
              </p>
            ) : (
              <>
                <FaultList faults={asFaults(sm.original.faults)} showMinimization />
                <p className="mt-3 text-[12.5px] leading-[1.55] text-[#b7c4bf]">
                  Exec seed {sm.original.execSeed}: {sm.original.outcome}.
                </p>
              </>
            )}
          </div>
          <div className="bg-window px-4 py-4 sm:px-5">
            <p className="label-mono text-[10px] text-lime">Reduced scenario · {sm.minimization.after} faults</p>
            {compact ? (
              <p className="mt-2 text-[12.5px] leading-[1.55] text-[#d6dedb]">
                {sm.minimized.faults.map((f) => `${f.kind} on ${f.target}`).join(" + ")}. Exec seed {sm.minimized.execSeed}: {sm.minimized.outcome}.
              </p>
            ) : (
              <>
                <FaultList faults={asFaults(sm.minimized.faults)} />
                <p className="mt-3 text-[12.5px] leading-[1.55] text-[#b7c4bf]">
                  Exec seed {sm.minimized.execSeed}: Nav2 {sm.minimized.result.status} at {sm.minimized.result.tS.toFixed(2)} s;{" "}
                  {sm.minimized.outcome}.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Reproduction + minimization */}
        <div className="grid grid-cols-1 gap-px border-t border-line bg-line sm:grid-cols-2">
          <div className="bg-window px-4 py-4 sm:px-5">
            <p className="label-mono text-[10px] text-[#8a9894]">Reproduction · {sm.reproduction.mode}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[12px] text-text">{sm.reproduction.rate}</span>
              <ReplayDots failures={sm.reproduction.failures} trials={sm.reproduction.trials} />
            </div>
            <p className="mt-2 font-mono text-[11px] leading-[1.55] text-[#b7c4bf]">
              {sm.reproduction.wilson95Text}
              <br />
              exec seeds {sm.reproduction.execSeeds}
            </p>
          </div>
          <div className="bg-window px-4 py-4 sm:px-5">
            <p className="label-mono text-[10px] text-[#8a9894]">Minimization · {sm.minimization.algorithm}</p>
            <p className="mt-2 font-mono text-[12px] text-text">
              {sm.minimization.before} → {sm.minimization.after} faults · {sm.minimization.runs} runs
            </p>
            <p className="mt-2 font-mono text-[11px] leading-[1.55] text-[#b7c4bf]">
              oracle {sm.minimization.oracle}
              <br />
              {sm.minimization.oneMinimal ? "1-minimal" : "not verified 1-minimal (600 s cap)"}
            </p>
          </div>
        </div>

        {/* Target / build identity */}
        <div className="border-t border-line px-4 py-4 sm:px-5">
          <p className="label-mono text-[10px] text-[#8a9894]">Target and build identity</p>
          <dl className="mt-2 divide-y divide-line/60">
            <Row k="Target" v={`${t.name} · ${t.timeModel}`} />
            <Row k="Fingerprint" v={short(t.fingerprint)} full={t.fingerprint} />
            {!compact && <Row k="Base image" v={short(t.baseImage, 10)} full={t.baseImage} />}
            {!compact && <Row k="Middleware" v={t.rmw} />}
            <Row k="Config" v={t.configHash} />
            <Row k="Run / trace" v={`${sm.minimized.runId} · ${sm.minimized.traceHash}`} />
            {!compact && (
              <Row
                k="Found by"
                v={`${sm.discovery.arm} arm · campaign seed ${sm.discovery.campaignSeed} · execution ${sm.discovery.atExecution}`}
              />
            )}
            {!compact && <Row k="Regression case" v={sm.regressionCase} />}
          </dl>
          {!compact && <p className="mt-3 text-[12.5px] leading-[1.55] text-[#8a9894]">Environment: {t.simulator}.</p>}
        </div>
      </div>

      <figcaption className="mt-4 space-y-1">
        <Provenance kind="Real report">
          docs/demo/{REPORT_FILE} @ {PRODUCT_SOURCE.commitShort}
        </Provenance>
        <p className="font-mono text-[10.5px] leading-[1.7] tracking-[0.04em] break-words text-[#8a9894]">
          Re-rendered from the committed report, traces and meta file; not a screenshot.
          {!compact && " The regression case encodes this artifact; it is not a guard against a Nav2 bug."}
        </p>
      </figcaption>
    </figure>
  );
}
