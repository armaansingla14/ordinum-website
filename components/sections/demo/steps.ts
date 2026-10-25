import { demoWalkthrough, type DemoStepId } from "@/lib/content";
import { nav2SuccessMismatch as sm } from "@/lib/evidence";
import type { DemoStepView, ExcerptRow } from "./types";

/* -------------------------------------------------------------------------- */
/* Builds the /demo step views on the server. Step copy comes from             */
/* demoWalkthrough (lib/content.ts); every excerpt value is read from          */
/* nav2SuccessMismatch (lib/evidence.ts). Nothing here is retyped by hand.     */
/* -------------------------------------------------------------------------- */

const s = (t: number) => `${t.toFixed(2)} s`;

/** "sha256:fcf9d1083401…0c953bc" style shortening for long hashes. */
export function shortHash(hash: string, keep = 12) {
  const i = hash.lastIndexOf(":");
  const [prefix, rest] = i === -1 ? ["", hash] : [hash.slice(0, i + 1), hash.slice(i + 1)];
  return rest.length > keep + 6 ? `${prefix}${rest.slice(0, keep)}…${rest.slice(-6)}` : hash;
}

const fileName = (path: string) => path.split(" @ ")[0].split("/").pop() ?? path;

const ORACLE_LANE = sm.minimized.lanes.find((l) => l.channel === "truth" && l.events.some((e) => e.tone === "violation"));
const NAV_LANE = sm.minimized.lanes.find((l) => l.component === "bt_navigator");

function faultParams(params: Readonly<Record<string, number | string | undefined>>) {
  return Object.entries(params)
    .filter(([k, v]) => k !== "duration_s" && v !== undefined)
    .map(([k, v]) => `${k === "sigma" ? "σ" : k} ${v}`)
    .join(", ");
}

const EXCERPTS: Record<DemoStepId, readonly ExcerptRow[]> = {
  system: [
    { k: "Target", v: `${sm.target.name} · ${sm.target.timeModel}` },
    { k: "Image", v: shortHash(sm.target.baseImage, 10) },
    { k: "Middleware", v: sm.target.rmw },
    { k: "Task", v: `${sm.task.id} ${sm.task.name} · ${sm.task.map} map · ${sm.task.deadlineS} s deadline` },
  ],
  property: [
    { k: "Invariant", v: `${sm.verdict.invariant} [${sm.verdict.severity}]` },
    { k: "Check", v: ORACLE_LANE?.component ?? sm.verdict.invariant },
  ],
  faults: sm.original.faults.map((f) => ({
    k: `F${f.idx} ${f.kind}`,
    v: `${f.target} · ${faultParams(f.params)} · ${f.appliedAt === null ? "not applied" : `@ ${s(f.appliedAt)}`}${
      f.minimization ? ` · ${f.minimization} by ddmin` : ""
    }`,
    tone: f.minimization === "kept" ? "kept" : f.minimization === "removed" ? "removed" : undefined,
  })),
  observed: [
    ...(NAV_LANE?.events ?? []).map((e) => ({ k: s(e.t), v: `${NAV_LANE?.component} · ${e.text}` })),
    {
      k: "Counters",
      v: `replans ${sm.minimized.counters.replans} · recoveries ${sm.minimized.counters.recoveries} · BT failures ${sm.minimized.counters.bt_failures}`,
    },
  ],
  verdict: [{ k: s(sm.verdict.tS), v: `${sm.verdict.invariant} violated: ${sm.verdict.detail}`, tone: "violation" }],
  reproduction: [
    { k: "Reproduction", v: `${sm.reproduction.rate} · ${sm.reproduction.wilson95Text} · ${sm.reproduction.mode}` },
    { k: "Seeds", v: sm.reproduction.execSeeds },
    {
      k: "Minimization",
      v: `${sm.minimization.before} → ${sm.minimization.after} faults · ${sm.minimization.runs} ${sm.minimization.algorithm} runs · ${
        sm.minimization.oneMinimal ? "1-minimal" : "not verified 1-minimal"
      }`,
    },
  ],
  regression: [
    { k: "Case", v: fileName(sm.regressionCase) },
    { k: "Parent scenario", v: sm.minimized.parentScenario },
    { k: "Config", v: sm.target.configHash },
    { k: "Fingerprint", v: shortHash(sm.target.fingerprint) },
  ],
};

export const demoSteps: readonly DemoStepView[] = demoWalkthrough.steps.map((step) => ({
  n: step.n,
  id: step.id,
  label: step.label,
  detail: step.detail,
  source: step.source,
  excerpt: EXCERPTS[step.id],
  replay:
    step.id === "reproduction" ? { failures: sm.reproduction.failures, trials: sm.reproduction.trials } : undefined,
}));
