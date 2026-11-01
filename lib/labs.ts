/**
 * Ordinum Labs: typed articles (no MDX). Every number is taken from lib/content.ts (`flagship`),
 * lib/evidence.ts (the Nav2 artifacts) or the release fact list (1 November 2026); nothing is
 * retyped from memory. Articles that are not written yet appear on the index as "In preparation"
 * with no results and no page.
 *
 * RULES (CLAUDE.md "Claims")
 *   - Author: Armaan Singla. Every article carries AI_METHODS_NOTE verbatim.
 *   - Reviews are "review by separate AI review agents", never described as independent.
 *   - The flagship is a planted control: FLAGSHIP_LABEL travels with every flagship number.
 *   - Nav2 violations are harness, oracle or configuration artifacts, never Nav2 defects.
 *   - Reproducibility links point only at /evidence/* pages that exist (lib/evidence-packages.ts).
 */

import {
  AI_METHODS_NOTE,
  EVIDENCE_CLASS_LABELS,
  FACT_SOURCE,
  FLAGSHIP_LABEL,
  flagship,
  type EvidenceClass,
  type Link,
} from "./content";
import { nav2SuccessMismatch as sm } from "./evidence";

export const LABS_CATEGORIES = ["Research", "Case Studies", "Engineering", "Product Updates"] as const;
export type LabsCategory = (typeof LABS_CATEGORIES)[number];

export type LabsResult = { readonly k: string; readonly v: string };

export type LabsCorrection = { readonly date: string; readonly text: string };

export type LabsArticle = {
  readonly slug: string;
  readonly status: "published";
  readonly title: string;
  readonly category: LabsCategory;
  /** One or two sentences: the result first, with its label. */
  readonly leadingResult: string;
  /** Evidence label shown with the leading result. */
  readonly label: { readonly text: string; readonly classes: readonly EvidenceClass[] };
  /** Index card text. */
  readonly summary: string;
  readonly authors: readonly string[];
  readonly date: string;
  readonly revision: string;
  readonly question: string;
  readonly system: readonly string[];
  readonly method: readonly string[];
  readonly results: readonly LabsResult[];
  readonly resultsNote?: string;
  readonly limitations: readonly string[];
  readonly related: readonly Link[];
  /** Links to /evidence/* (and the walkthrough). */
  readonly reproducibility: readonly Link[];
  readonly corrections: readonly LabsCorrection[];
  readonly methodsNote: string;
  /** Renders the migrated /research sections after the results. */
  readonly body?: "research-summary";
};

export type LabsPlanned = {
  readonly status: "in-preparation";
  readonly title: string;
  readonly category: LabsCategory;
  readonly note: string;
};

export type LabsEntry = LabsArticle | LabsPlanned;

const AUTHOR = "Armaan Singla";
const PUBLISHED = "1 November 2026";

const flagshipArticle = {
  slug: "from-failed-authorization-test-to-verified-fix",
  status: "published",
  title: "From a failed authorization test to a verified fix",
  category: "Case Studies",
  leadingResult: `On a planted control in unmodified PocketBase 0.40.6, ordinum verify returned FIX_VERIFIED: read authorization was violated on the affected build in ${flagship.affected} comparison runs and on the fixed build in ${flagship.fixed} (one-sided Fisher p = ${flagship.fisherP}).`,
  label: { text: FLAGSHIP_LABEL, classes: flagship.labelClasses },
  summary:
    "A defect we planted in our own client path, found, confirmed, reduced and then shown fixed, without counting a pass where the property never came into play.",
  authors: [AUTHOR],
  date: PUBLISHED,
  revision: `Revision 1 · run at product commit ${flagship.commitShort}`,
  question:
    "Can Ordinum take a failing authorization test on real, unmodified software, confirm and reduce it, and then show that a fix removes it, without counting a vacuous pass as a fix?",
  system: [
    "PocketBase 0.40.6, unmodified, with the binary pinned by SHA-256, on one host. The access policy and the workload are Ordinum's own.",
    `What we planted: ${flagship.planted}, a stale read cache in ${flagship.plantedWhere}. The affected build includes it; the fixed build is the same build without it.`,
    "What stayed unchanged: PocketBase itself. This is not a PocketBase bug, and it says nothing about PocketBase's correctness.",
  ],
  method: [
    "ordinum verify runs a search campaign on the affected build, confirms each violation by re-running it, and reduces the fault schedule with delta debugging.",
    "It then runs the confirmed cases against the affected and the fixed build, and compares the two with a one-sided Fisher exact test.",
    "The fixed build also gets its own search campaign. FIX_VERIFIED requires that every confirmed violation is gone, that this campaign finds none, and that each required property (read_authz and model_agreement here) was actually exercised: a pass in which the property never came into play does not count.",
    "Finally, ordinum ci replays the saved regression cases.",
    `The run was executed on ${flagship.date} at product commit ${flagship.commitShort}, inside a fresh network namespace with only loopback (unshare -rn), without Docker. It took ${flagship.runtime} on ${flagship.host}.`,
  ],
  results: [
    { k: "Verdict", v: "FIX_VERIFIED (ordinum verify, exit 0)" },
    { k: "Confirmation", v: `read_authz and model_agreement, each confirmed ${flagship.confirmed}` },
    { k: "Reduction", v: `${flagship.minimized} fault schedule` },
    { k: "Affected vs fixed", v: `${flagship.affected} vs ${flagship.fixed}, one-sided Fisher p = ${flagship.fisherP}` },
    { k: "Property exercise", v: `read_authz exercised in ${flagship.exercised} executions on each build` },
    { k: "Regression", v: `ordinum ci: ${flagship.ciResult}, ${flagship.ciExit}` },
    { k: "Runtime", v: `About 5.5 min on ${flagship.host}, no Docker` },
  ],
  resultsNote: "The defect was planted by us. These numbers show the workflow working, not a discovery.",
  limitations: [
    "A controlled positive control: we wrote the defect, so finding it is a check on the engine, not a discovery.",
    "One host, our own policy and workload, not a production deployment.",
    "Exercise counts are declared by the adapter: a count is only as good as that declaration.",
    "Ten runs per build is a statistical comparison, not a proof that the failure can never return.",
    "No historical third-party affected/fixed reproduction, and no new third-party vulnerability, has been shown yet.",
    "A recording of this run is in production; the evidence package carries the terminal logs and reports.",
  ],
  related: [
    { label: "Software & APIs", href: "/products/software" },
    { label: "Demos", href: "/demos" },
    { label: "Research summary", href: "/labs/research-summary" },
  ],
  reproducibility: [{ label: "Evidence package: PocketBase verified fix", href: "/evidence/pocketbase-verified-fix" }],
  corrections: [{ date: PUBLISHED, text: "First published." }],
  methodsNote: AI_METHODS_NOTE,
} as const satisfies LabsArticle;

const nav2Article = {
  slug: "what-a-robots-success-message-can-hide",
  status: "published",
  title: "What a robot's success message can hide",
  category: "Case Studies",
  leadingResult: `Nav2 reported ${sm.minimized.result.status} while the robot was ${sm.verdict.distanceText} from its goal. We traced it to our own fault configuration: a harness artifact, not a Nav2 defect.`,
  label: {
    text: `${EVIDENCE_CLASS_LABELS["real-external-target"]} · ${EVIDENCE_CLASS_LABELS["harness-artifact"]}`,
    classes: ["real-external-target", "harness-artifact"],
  },
  summary:
    "A check that compares what a robot reports with where it really is caught a mismatch. The cause was our own unrealistic fault, and saying so is part of the result.",
  authors: [AUTHOR],
  date: PUBLISHED,
  revision: `Revision 1 · artifacts from ${FACT_SOURCE.artifactsCommitShort}, unchanged at ${FACT_SOURCE.evidenceCommitShort}`,
  question:
    "Can a check that reads ground truth catch a navigation stack reporting success it did not achieve, and can we tell a real defect from something our own harness caused?",
  system: [
    `Nav2 1.3.13 on ROS 2 Jazzy, unmodified, in a pinned container with no network, on a simplified loopback simulator: no physics and no state estimator. Task ${sm.task.id} (${sm.task.name}) on the ${sm.task.map} map, with a ${sm.task.deadlineS} s deadline.`,
    "The property: if Nav2 reports success, the robot must truly be within 0.35 m of the goal. The harness records the simulator's true pose; the search never sees it.",
  ],
  method: [
    `The random arm of an exploratory pilot scheduled ${sm.minimization.before} faults; ${sm.minimization.beforeApplied} applied. Among them: transform noise (σ 0.356 m) from 4.40 s and laser-scan reordering at 6.52 s.`,
    "Nav2 is not deterministic, so reproduction was measured on fresh seeds, with a Wilson interval, rather than replayed exactly.",
    "Delta debugging reduced the fault schedule. The violation was then classified, and review by separate AI review agents, briefed to argue against the classification, upheld it.",
  ],
  results: [
    { k: "Observed", v: `Nav2 reported ${sm.minimized.result.status} at ${sm.minimized.result.tS} s` },
    { k: "Ground truth", v: `True pose ${sm.verdict.distanceText} from the goal (limit 0.35 m)` },
    { k: "Verdict", v: `${sm.verdict.invariant} violated, severity ${sm.verdict.severity}` },
    { k: "Reproduction", v: `${sm.reproduction.rate} on fresh seeds (${sm.reproduction.wilson95Text})` },
    { k: "Reduction", v: `${sm.minimization.before} faults to ${sm.minimization.after}; time cap reached, so not verified 1-minimal` },
    { k: "Follow-up", v: `Transform noise alone reproduced ${sm.followUp.tfNoiseOnly}` },
    { k: "Classification", v: "Harness artifact: the injected noise is physically unrealistic and corrupts the only position source" },
  ],
  resultsNote: "A violation is a test failure, not automatically a defect. This one is our harness's doing.",
  limitations: [
    "Simulation only: no physics, no state estimator, no physical robot.",
    "The fault was physically unrealistic, and check bounds were not yet fault-aware.",
    "The original, unminimized schedule did not violate when re-run at its discovery seed (stochastic target).",
    "The regression case encodes this artifact; it is a harness regression check, not a Nav2 bug guard.",
  ],
  related: [
    { label: "Robotics & Connected Systems", href: "/products/robotics" },
    { label: "Research summary: the Nav2 pilot", href: "/labs/research-summary#nav2-pilot" },
  ],
  reproducibility: [
    { label: "Evidence package: Nav2 success mismatch", href: "/evidence/nav2-success-mismatch" },
    { label: "Step through the run", href: "/demos/nav2-walkthrough" },
  ],
  corrections: [
    {
      date: PUBLISHED,
      text: "First published in Labs. The review that upheld the classification was carried out by separate AI review agents; earlier site copy called it a separate adversarial review.",
    },
  ],
  methodsNote: AI_METHODS_NOTE,
} as const satisfies LabsArticle;

const summaryArticle = {
  slug: "research-summary",
  status: "published",
  title: "Research summary: what we've measured",
  category: "Research",
  leadingResult:
    "The loop works end to end on planted controls and on real external targets. No independently verified defect has been found, and our benchmark has not shown guided search beating random search.",
  label: {
    text: `${EVIDENCE_CLASS_LABELS["positive-control"]} · ${EVIDENCE_CLASS_LABELS["real-external-target"]} · ${EVIDENCE_CLASS_LABELS["harness-artifact"]}`,
    classes: ["positive-control", "real-external-target", "harness-artifact"],
  },
  summary:
    "The toy benchmark, the Nav2 pilot, the four-process testbed and the MQTT campaign, each result with its label, plus limitations, reproducibility, methods and the withdrawn v1 results.",
  authors: [AUTHOR],
  date: PUBLISHED,
  revision: `Revision 2 · results as of ${FACT_SOURCE.researchCommitShort}, updates at ${FACT_SOURCE.evidenceCommitShort}`,
  question: "What have Ordinum's experiments shown so far, and what have they not?",
  system: [
    "A toy grid robot we built, with 11 planted failure classes (positive controls).",
    "Stock ROS 2 Nav2 in a simplified loopback simulation (real external target).",
    "A four-process testbed we built, modeling a cloud-to-device command path.",
    "The Eclipse Mosquitto MQTT broker (real external target).",
  ],
  method: [
    "Two channels: the search reads only what the system reports; checks read only harness-recorded ground truth.",
    "Benchmark hypotheses, configuration and analysis code hash-locked before campaigns ran.",
    "Reproduction as k of N with 95% Wilson intervals; comparisons with Mann-Whitney U, Vargha-Delaney A12 and Holm correction.",
    "Every result classified with an evidence label, and classifications reviewed by separate AI review agents.",
  ],
  results: [
    { k: "Toy benchmark", v: "Automated strategies found about 8.5 to 9 of 11 planted classes; differences between them were not significant" },
    { k: "Nav2 pilot", v: "Three reproduced violations, all harness, oracle or configuration artifacts; no Nav2 defect" },
    { k: "Testbed", v: "The correctly behaving build replayed with one behavior hash over 20 reruns" },
    { k: "MQTT", v: "No confirmed finding; at 768a9b5, Mosquitto and NanoMQ campaigns returned 0 FAIL" },
  ],
  resultsNote: "The full sections follow, as they appeared on the former Research page, with the updates noted below.",
  limitations: [
    "A general advantage of guided search over random search has not been shown, on any target.",
    "No independently confirmed defect in Nav2, Mosquitto or any other system.",
    "Nothing beyond a simplified ROS 2 simulation; no physical hardware.",
    "No customers or design partners.",
  ],
  related: [
    { label: "From a failed authorization test to a verified fix", href: "/labs/from-failed-authorization-test-to-verified-fix" },
    { label: "What a robot's success message can hide", href: "/labs/what-a-robots-success-message-can-hide" },
  ],
  reproducibility: [
    { label: "Evidence package: Nav2 success mismatch", href: "/evidence/nav2-success-mismatch" },
    { label: "Evidence package: testbed planted control", href: "/evidence/testbed-planted-control" },
    { label: "Evidence package: PocketBase verified fix", href: "/evidence/pocketbase-verified-fix" },
  ],
  corrections: [
    {
      date: PUBLISHED,
      text: "Moved from the former Research page to Ordinum Labs. Review wording corrected: reviews were carried out by separate AI review agents, not independent human reviewers. Added updates from the stable checkpoint 768a9b5: a planted-control build of the testbed, MQTT results on two brokers, and fix verification on PocketBase.",
    },
    { date: "22 October 2026", text: "v1 benchmark results withdrawn after an internal audit (see the withdrawn-results note under Methodology)." },
  ],
  methodsNote: AI_METHODS_NOTE,
  body: "research-summary",
} as const satisfies LabsArticle;

export const labsArticles = [flagshipArticle, nav2Article, summaryArticle] as const satisfies readonly LabsArticle[];

/** Founder-requested titles. Not written yet: no results, no page, no link. */
export const labsInPreparation = [
  {
    status: "in-preparation",
    title: "Lost updates in PocketBase: reproducing a known issue",
    category: "Research",
    note: "In preparation. No results published.",
  },
  {
    status: "in-preparation",
    title: "Property exercise: when a pass means nothing",
    category: "Engineering",
    note: "In preparation. No results published.",
  },
  {
    status: "in-preparation",
    title: "Feedback guidance vs random search",
    category: "Research",
    note: "In preparation. No results published.",
  },
] as const satisfies readonly LabsPlanned[];

export const labs = {
  indexKicker: "ARTICLES / 001",
  indexTitle: "Published",
  preparingKicker: "IN PREPARATION / 002",
  preparingTitle: "Being written",
  preparingNote: "Titles only. Nothing here is a result.",
} as const;

export function labsArticle(slug: string): LabsArticle | undefined {
  return (labsArticles as readonly LabsArticle[]).find((a) => a.slug === slug);
}
