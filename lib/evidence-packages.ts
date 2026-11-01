/**
 * Public proof packages (/evidence/[case]). This module is the manifest of EXPECTED files only.
 *
 * The files themselves are exported from the private product repo (stable checkpoint 768a9b5) by
 * a founder-run, founder-authorized script into public/evidence/<slug>/. Nothing here copies
 * them. The page links a file only if it exists at build time (lib/evidence-files.ts); otherwise
 * it shows "Artifact pending publication", so there are never dead links. SHA-256 values are
 * computed at build time from the published file, never typed by hand.
 *
 * Facts: lib/content.ts (`flagship`, FACT_SOURCE) and lib/evidence.ts (Nav2). Labels use
 * EVIDENCE_CLASS_LABELS exactly. No package is an independently verified defect.
 */

import { EVIDENCE_CLASS_LABELS, FACT_SOURCE, FLAGSHIP_LABEL, flagship, type EvidenceClass, type Link } from "./content";
import { nav2SuccessMismatch as sm } from "./evidence";

export type EvidenceFile = {
  /** File name inside public/evidence/<slug>/. */
  readonly name: string;
  readonly description: string;
};

export type EvidencePackage = {
  readonly slug: string;
  readonly title: string;
  readonly label: string;
  readonly classes: readonly EvidenceClass[];
  /** Plain statement printed next to the label. */
  readonly qualifier: string;
  readonly summary: string;
  /** Source revision, run/build/config identity, date. */
  readonly identity: readonly { readonly k: string; readonly v: string }[];
  readonly prerequisites: readonly string[];
  readonly properties: readonly { readonly name: string; readonly detail: string }[];
  /** Exercise counts, confirmation, minimization status. */
  readonly counts: readonly { readonly k: string; readonly v: string }[];
  readonly comparisonRule: string;
  readonly files: readonly EvidenceFile[];
  readonly sanitization: string;
  readonly limitations: readonly string[];
  readonly related: readonly Link[];
};

export const CHECKSUM_NOTE =
  "SHA-256 values are computed at build time from the files exactly as published here. They let you check that a download is complete and matches this page. They do not prove who produced a file, or that a run happened as described; for that, ask us for access to the source repository at the listed revision.";

export const PENDING_LABEL = "Artifact pending publication";

const pocketbase = {
  slug: "pocketbase-verified-fix",
  title: "PocketBase: failure to verified fix",
  label: FLAGSHIP_LABEL,
  classes: flagship.labelClasses,
  qualifier: "PocketBase itself is unmodified.",
  summary:
    "The run in the demo. A stale read cache in our PocketBase client path violates read authorization; ordinum verify finds it, confirms it, reduces it to one fault, compares the failing and fixed builds and returns FIX_VERIFIED, and ordinum ci replays the saved cases.",
  identity: [
    { k: "Source revision", v: `Product commit ${flagship.commitShort} (stable checkpoint)` },
    { k: "Run date", v: flagship.date },
    { k: "Target", v: flagship.target },
    { k: "Failing build", v: `Planted ${flagship.planted} in ${flagship.plantedWhere}` },
    { k: "Fixed build", v: "The same build without the planted cache" },
    { k: "Host", v: "WSL2 Ubuntu laptop, 16 vCPU; no Docker" },
    { k: "Commands", v: "unshare -rn … ordinum verify --require-exercise read_authz --require-exercise model_agreement; then ordinum ci" },
  ],
  prerequisites: [
    "Linux with unprivileged user namespaces (for unshare -rn).",
    "Python virtual environment with Ordinum at the source revision.",
    "The PocketBase 0.40.6 binary, fetched and checked against its pinned SHA-256.",
  ],
  properties: [
    { name: "read_authz", detail: "Reads respect the access policy. Exercise required." },
    { name: "model_agreement", detail: "What clients observe agrees with a reference model. Exercise required." },
  ],
  counts: [
    { k: "Confirmation", v: `read_authz and model_agreement, ${flagship.confirmed} each` },
    { k: "Minimization", v: flagship.minimized },
    { k: "Failing vs fixed", v: `${flagship.affected} vs ${flagship.fixed} (one-sided Fisher p = ${flagship.fisherP})` },
    { k: "Exercise", v: `read_authz exercised ${flagship.exercised} on each build (adapter-declared)` },
    { k: "Verdict", v: `FIX_VERIFIED, ${flagship.verifyExit}` },
    { k: "Regression", v: `ordinum ci: ${flagship.ciResult}, ${flagship.ciExit}` },
    { k: "Runtime", v: "About 5.5 min" },
  ],
  comparisonRule:
    "FIX_VERIFIED requires every confirmed violation to be absent on the fixed build in the failing-vs-fixed comparison (one-sided Fisher exact test), no violation in the fixed build's own campaign, and each required property to be exercised on both builds.",
  files: [
    { name: "report.md", description: "Fix-verification report (Markdown)" },
    { name: "report.json", description: "Fix-verification report (JSON)" },
    { name: "regression-case-read_authz.json", description: "Regression case for read_authz" },
    { name: "regression-case-model_agreement.json", description: "Regression case for model_agreement" },
    { name: "verify-terminal.log", description: "Terminal log of ordinum verify" },
    { name: "ci-terminal.log", description: "Terminal log of ordinum ci" },
    { name: "RUN_MANIFEST.txt", description: "Run manifest: commit, host, PocketBase hash, timestamps, exit codes" },
  ],
  sanitization: "Local paths were replaced with <repo>, <venv> and <run>. No other edits.",
  limitations: [
    "We planted the defect, so finding it checks the engine. It is not a discovery.",
    "One host, Ordinum's own policy and workload.",
    "Exercise counts are declared by the adapter.",
    "Ten runs per build is a statistical comparison, not a proof.",
  ],
  related: [
    { label: "Watch the demo", href: "/demos#demo-flagship" },
    { label: "Case study", href: "/labs/from-failed-authorization-test-to-verified-fix" },
    { label: "Software & APIs", href: "/products/software" },
  ],
} as const satisfies EvidencePackage;

const nav2 = {
  slug: "nav2-success-mismatch",
  title: "Nav2: success reported, goal not reached",
  label: `${EVIDENCE_CLASS_LABELS["real-external-target"]} · ${EVIDENCE_CLASS_LABELS["harness-artifact"]}`,
  classes: ["real-external-target", "harness-artifact"],
  qualifier: "Fault configuration, not a Nav2 defect.",
  summary: `Stock Nav2 reported ${sm.minimized.result.status} while the simulator's true pose was ${sm.verdict.distanceText} from the goal, under injected transform noise that is physically unrealistic. Classified as a harness artifact.`,
  identity: [
    { k: "Source revision", v: `Artifacts from product commit ${FACT_SOURCE.artifactsCommitShort}, unchanged at ${FACT_SOURCE.evidenceCommitShort}` },
    { k: "Target", v: "Nav2 1.3.13 on ROS 2 Jazzy, unmodified, loopback simulator (no physics, no state estimator)" },
    { k: "Build fingerprint", v: sm.target.fingerprint },
    { k: "Config hash", v: sm.target.configHash },
    { k: "Failure id", v: sm.failureId },
  ],
  prerequisites: ["Docker, for the pinned Nav2 image (not published here).", "Ordinum at the source revision."],
  properties: [{ name: sm.verdict.invariant, detail: "If Nav2 reports success, the true pose must be within 0.35 m of the goal." }],
  counts: [
    { k: "Reproduction", v: `${sm.reproduction.rate} on fresh seeds (${sm.reproduction.wilson95Text})` },
    { k: "Minimization", v: `${sm.minimization.before} → ${sm.minimization.after} faults; time cap reached, not verified 1-minimal` },
    { k: "Follow-up", v: `Transform noise alone: ${sm.followUp.tfNoiseOnly}` },
  ],
  comparisonRule: "Statistical reproduction: re-run on fresh seeds and report k of N with a 95% Wilson interval. Nav2 is not deterministic, so there is no exact replay.",
  files: [
    { name: "report.html", description: "Comparison report: original vs minimized run" },
    { name: "nominal-run.html", description: "Report of a nominal run (obstacle inserted, task succeeds)" },
  ],
  sanitization: "One local cache path in report.html was replaced with maps/depot.yaml. No other edits.",
  limitations: [
    "Simulation only; no physical robot.",
    "The injected noise is physically unrealistic.",
    "The Nav2 container image is not published.",
  ],
  related: [
    { label: "Case study", href: "/labs/what-a-robots-success-message-can-hide" },
    { label: "Nav2 walkthrough", href: "/demos/nav2-walkthrough" },
  ],
} as const satisfies EvidencePackage;

const testbed = {
  slug: "testbed-planted-control",
  title: "Four-process testbed: a planted violation",
  label: EVIDENCE_CLASS_LABELS["positive-control"],
  classes: ["positive-control"],
  qualifier: "Our own system and our own planted defect.",
  summary:
    "A defect planted in a build of Ordinum's four-process reference system (authorization service, broker, controller, actuator), used to check that its policy checks catch a violation end to end.",
  identity: [
    { k: "Source revision", v: `Product commit ${FACT_SOURCE.evidenceCommitShort} (stable checkpoint)` },
    { k: "Target", v: "Four-process reference testbed, our own" },
  ],
  prerequisites: ["Ordinum at the source revision. The testbed runs as local processes, without Docker."],
  properties: [
    {
      name: "Written policy clauses",
      detail: "The testbed is judged against written policy clauses with causal (happened-before) checks; the report shows the violation the planted defect causes.",
    },
  ],
  counts: [],
  comparisonRule: "See the report for the reproduction rule and counts. No numbers are restated here.",
  files: [
    { name: "report.html", description: "Run report for the planted-control case" },
    { name: "regression-case.json", description: "Regression case, as stored in the product repository" },
  ],
  sanitization: "Copied as committed. Scanned for local paths, usernames, hostnames, emails, tokens and keys.",
  limitations: ["Our own system under test, not production software or hardware.", "A planted control: it checks the engine. It is not a discovery."],
  related: [{ label: "Robotics & Connected Systems", href: "/products/robotics" }],
} as const satisfies EvidencePackage;

export const evidencePackages = [pocketbase, nav2, testbed] as const satisfies readonly EvidencePackage[];

export function evidencePackage(slug: string): EvidencePackage | undefined {
  return (evidencePackages as readonly EvidencePackage[]).find((p) => p.slug === slug);
}
