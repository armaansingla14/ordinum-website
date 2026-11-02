/**
 * Ordinum Labs: typed articles (no MDX). Every number is taken from lib/content.ts (`flagship`),
 * lib/evidence.ts (the Nav2 artifacts) or the release fact list (1 November 2026); nothing is
 * retyped from memory. Only published articles appear on the index.
 *
 * RULES (CLAUDE.md "Claims")
 *   - Author: Armaan Singla. Every article carries AI_METHODS_NOTE verbatim.
 *   - Reviews are "review by separate AI review agents", never described as independent.
 *   - The flagship is a planted defect: FLAGSHIP_LABEL travels with every flagship number. State
 *     each qualifier once, where its claim appears.
 *   - Nav2 violations are harness, oracle or configuration artifacts, never Nav2 defects.
 *   - Reproducibility links point only at /evidence/* pages that exist (lib/evidence-packages.ts).
 *   - The agent article is about OUR OWN reference application (release candidate), never
 *     third-party software. Its facts come from the internal claim table (1 November 2026).
 *
 * ORDER on the page (components/sections/labs/ArticleView.tsx): the finding; what was tested; why
 * it matters; how it worked; what it shows; what it does not establish; artifacts and
 * reproduction (technical details collapsed); methods note.
 */

import {
  AI_METHODS_NOTE,
  EVIDENCE_CLASS_LABELS,
  FACT_SOURCE,
  FLAGSHIP_LABEL,
  HOSTED_CI_STATUS,
  TEST_SUITE_STABLE,
  TEST_SUITE_STATUS,
  flagship,
  type EvidenceClass,
  type Link,
} from "./content";
import { nav2SuccessMismatch as sm } from "./evidence";

export type LabsCategory = "Research" | "Case Studies" | "Engineering" | "Product Updates";

export type LabsResult = { readonly k: string; readonly v: string };

export type LabsCorrection = { readonly date: string; readonly text: string };

export type LabsArticle = {
  readonly slug: string;
  readonly status: "published";
  readonly title: string;
  readonly category: LabsCategory;
  /** The finding, first: one or two sentences with its label. */
  readonly leadingResult: string;
  /** Evidence label shown with the finding. */
  readonly label: { readonly text: string; readonly classes: readonly EvidenceClass[] };
  /** Short label on cards (what kind of result this is). */
  readonly cardLabel: string;
  /** Index card text. */
  readonly summary: string;
  readonly authors: readonly string[];
  readonly date: string;
  readonly revision: string;
  /** Opens "What was tested". */
  readonly question: string;
  /** What was tested. */
  readonly system: readonly string[];
  readonly whyItMatters: readonly string[];
  /** How it worked. */
  readonly method: readonly string[];
  readonly results: readonly LabsResult[];
  readonly resultsNote?: string;
  /** What it does not establish. */
  readonly limitations: readonly string[];
  /** Collapsed "Technical details" under artifacts and reproduction. */
  readonly technical: readonly LabsResult[];
  readonly related: readonly Link[];
  /** Links to /evidence/* (and the walkthrough). */
  readonly reproducibility: readonly Link[];
  readonly corrections: readonly LabsCorrection[];
  readonly methodsNote: string;
  /** Renders the migrated /research sections after the results. */
  readonly body?: "research-summary";
  /** Optional real-data visual under "What it shows". */
  readonly visual?: "goalPlot";
};

const AUTHOR = "Armaan Singla";
const PUBLISHED = "1 November 2026";

/**
 * The real, unplanted bug Ordinum found in our OWN hardened reference agent (examples/agent_reference,
 * release candidate ordinum-2-release). Facts from the internal claim table, 1 November 2026:
 * pre-fix strict verify at 6806931; fix 9a70c5c (test-first); planted cases regenerated on
 * agentref@0.1.0-4f1bacd749c7, regress 9/9 PASS FIXED at 2af351c. No review round logged.
 */
const AGENT_LABEL = "Our own reference application · real, unplanted bug · release candidate";

const agentArticle = {
  slug: "ordinum-found-a-bug-in-our-own-reference-agent",
  status: "published",
  title: "Ordinum found a bug in our own reference agent",
  category: "Case Studies",
  leadingResult:
    "While checking a planted defect, Ordinum found a real bug we had not planted, in the hardened build of our own reference agent: cancelling delegated work did not reach a sub-agent call that was already in flight. Ordinum confirmed it 5/5, and we fixed it test-first.",
  label: { text: AGENT_LABEL, classes: [] },
  cardLabel: AGENT_LABEL,
  summary:
    "A cancel that never reached an in-flight sub-agent call, in the build we believed was correct. Found by a planted-defect comparison, confirmed, reduced and fixed. Our own reference application, not third-party software.",
  authors: [AUTHOR],
  date: PUBLISHED,
  revision: "Revision 1 · release candidate ordinum-2-release · fix at 9a70c5c",
  question:
    "Does the hardened build of our own reference agent really keep its permissions when work is retried or cancelled, including work handed to a sub-agent?",
  system: [
    "examples/agent_reference: the reference agent application in Ordinum's own repository, at the release candidate ordinum-2-release. It is ours. It is not third-party software and not a customer system.",
    "It comes as a hardened build, meant to be correct, and planted variants, each with one defect we added on purpose: 9 in total. One of them, pc_delegate_parent, plants a defect in delegated work.",
    "The property: stale_authorization_on_retry_or_cancel. In the report's words: a retried call is re-authorized against the current state, and a cancelled task executes nothing.",
  ],
  whyItMatters: [
    "Agents increasingly hand work to other agents and call tools on someone's behalf. If a cancel stops the parent but not a call already in flight, an action can still run after the user or a policy said stop.",
    "The hardened build was the version we believed was correct, and its own search campaign had not caught this. The planted-defect comparison did, because a violation on the build that was meant to be the fix is itself a finding.",
  ],
  method: [
    "The strict per-defect matrix runs ordinum verify for each planted variant against the hardened build, using the feedback_full search arm with a budget of 40.",
    "For pc_delegate_parent, the comparison came back NOT_FIXED: stale_authorization_on_retry_or_cancel was violated in 12/12 runs on the planted build and in 12/12 runs on the hardened build. The hardened build also violated it.",
    "Ordinum confirmed the violation 5/5 and minimized the fault schedule from 3 faults to 2. Whether the result is 1-minimal was not verified.",
    "We then wrote a regression unit test first, test_hardened_cancel_reaches_a_delegated_call_already_in_flight, and checked that it fails before the fix. The fix in commit 9a70c5c makes the cancel reach a delegated call that is already in flight.",
    "After the fix, the 9 planted cases were regenerated on the fixed build and replayed.",
  ],
  results: [
    { k: "Finding", v: "A cancel of delegated work did not reach a sub-agent call already in flight" },
    { k: "Property", v: "stale_authorization_on_retry_or_cancel" },
    { k: "Before the fix", v: "NOT_FIXED: violated in 12/12 planted-build runs and 12/12 hardened-build runs" },
    { k: "Confirmation", v: "5/5" },
    { k: "Reduction", v: "3 faults to 2; 1-minimality not verified" },
    { k: "Fix", v: "Commit 9a70c5c, test-first; the regression unit test fails before the fix" },
    { k: "After the fix", v: "No NOT_FIXED in the strict matrix. Overall strict verdict: CANNOT_VERIFY, because strict evidence for sibling defects was inconclusive" },
    { k: "Planted cases", v: "Regenerated on the fixed build: 9/9 PASS FIXED (2af351c)" },
  ],
  resultsNote: "The hardened build's own 40-run campaign did not catch the bug; the comparison against a planted variant did.",
  limitations: [
    "This is our own reference application, not third-party software. It is not a vulnerability in any external project.",
    "It is from the release candidate ordinum-2-release, not the stable checkpoint.",
    "The overall strict verdict after the fix is CANNOT_VERIFY, not FIX_VERIFIED.",
    "1-minimality of the reduced case was not verified.",
    "No review round is logged for this finding.",
    "One bug in one application says nothing about how often such bugs occur in other agents.",
  ],
  technical: [
    { k: "Application", v: "examples/agent_reference (Ordinum's own), release candidate ordinum-2-release" },
    { k: "Pre-fix strict verify", v: "Commit 6806931, variant pc_delegate_parent against the hardened (safe) build" },
    { k: "Search", v: "feedback_full arm, budget 40" },
    { k: "Regression unit test", v: "test_hardened_cancel_reaches_a_delegated_call_already_in_flight" },
    { k: "Fix", v: "Commit 9a70c5c" },
    { k: "Fixed build", v: "agentref@0.1.0-4f1bacd749c7" },
    { k: "Planted-case replay", v: "9/9 PASS FIXED at 2af351c; ordinum ci: 9 PASS" },
  ],
  related: [
    { label: "AI agent security", href: "/products/agents" },
    { label: "From a failed authorization test to a verified fix", href: "/labs/from-failed-authorization-test-to-verified-fix" },
  ],
  reproducibility: [{ label: "Evidence package: reference agent cancel bug", href: "/evidence/agent-reference-cancel" }],
  corrections: [{ date: PUBLISHED, text: "First published." }],
  methodsNote: AI_METHODS_NOTE,
} as const satisfies LabsArticle;

const flagshipArticle = {
  slug: "from-failed-authorization-test-to-verified-fix",
  status: "published",
  title: "From a failed authorization test to a verified fix",
  category: "Case Studies",
  leadingResult: `Yes. With a defect we planted in our own client path for unmodified PocketBase 0.40.6, ordinum verify returned FIX_VERIFIED: read authorization was violated in ${flagship.affected} comparison runs on the failing build and ${flagship.fixed} on the fixed build (one-sided Fisher p = ${flagship.fisherP}).`,
  label: { text: FLAGSHIP_LABEL, classes: flagship.labelClasses },
  cardLabel: "Planted defect · fix verified on unmodified PocketBase",
  summary:
    "A stale read cache we planted in our PocketBase client path: found, confirmed, reduced, then checked as fixed, without counting a pass where the property never came into play.",
  authors: [AUTHOR],
  date: PUBLISHED,
  revision: `Revision 1 · run at product commit ${flagship.commitShort}`,
  question:
    "Can Ordinum take a failing authorization test on real, unmodified software, confirm and reduce it, and then show that a fix removes it, without counting a vacuous pass as a fix?",
  system: [
    "PocketBase 0.40.6, unmodified, with the binary pinned by SHA-256, on one host. The access policy and the workload are Ordinum's own.",
    `What we planted: ${flagship.planted}, a stale read cache in ${flagship.plantedWhere}. The failing build includes it; the fixed build is the same build without it, the change an engineer would make.`,
  ],
  whyItMatters: [
    "A failing test is only useful if you can trust what happens after the fix. Ordinum's verdict requires the failure to be gone on the fixed build and the property to have actually been exercised, so a change that simply stops the code path from running does not count as a fix.",
  ],
  method: [
    "ordinum verify runs a search campaign on the failing build, confirms each violation by re-running it, and reduces the fault schedule with delta debugging.",
    "It then runs the confirmed cases against the failing and the fixed build, and compares the two with a one-sided Fisher exact test.",
    "The fixed build also gets its own search campaign. FIX_VERIFIED requires that every confirmed violation is gone, that this campaign finds none, and that each required property (read_authz and model_agreement here) was actually exercised: a pass in which the property never came into play does not count.",
    "Finally, ordinum ci replays the saved regression cases.",
    `The run was executed on ${flagship.date} at product commit ${flagship.commitShort}, inside a network namespace with loopback only (unshare -rn), without Docker. It took ${flagship.runtime} on ${flagship.host}.`,
  ],
  results: [
    { k: "Verdict", v: "FIX_VERIFIED (ordinum verify, exit 0)" },
    { k: "Confirmation", v: `read_authz and model_agreement, each confirmed ${flagship.confirmed}` },
    { k: "Reduction", v: `${flagship.minimized} fault schedule` },
    { k: "Failing vs fixed", v: `${flagship.affected} vs ${flagship.fixed}, one-sided Fisher p = ${flagship.fisherP}` },
    { k: "Property exercise", v: `read_authz exercised in ${flagship.exercised} executions on each build` },
    { k: "Regression", v: `ordinum ci: ${flagship.ciResult}, ${flagship.ciExit}` },
    { k: "Runtime", v: `About 5.5 min on ${flagship.host}, no Docker` },
  ],
  limitations: [
    "We wrote the defect, so finding it checks the engine. It is not a discovery.",
    "One host, our own policy and workload, not a production deployment.",
    "Exercise counts are declared by the adapter: a count is only as good as that declaration.",
    "Ten runs per build is a statistical comparison, not a proof that the failure can never return.",
    "No historical third-party failing/fixed reproduction, and no new third-party vulnerability, has been shown yet.",
  ],
  technical: [
    { k: "Source revision", v: `Product commit ${flagship.commitShort} (stable checkpoint)` },
    { k: "Target", v: flagship.target },
    { k: "Planted defect", v: `${flagship.planted}, in ${flagship.plantedWhere}` },
    { k: "Commands", v: "ordinum verify --require-exercise read_authz --require-exercise model_agreement, then ordinum ci" },
    { k: "Isolation", v: "unshare -rn (loopback only), no Docker" },
    { k: "Host", v: flagship.host },
  ],
  related: [
    { label: "Watch demo", href: "/#demo" },
    { label: "Software & APIs", href: "/products/software" },
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
  leadingResult: `Yes, and yes. Nav2 reported ${sm.minimized.result.status} while the robot was ${sm.verdict.distanceText} from its goal. We traced it to our own fault configuration: a harness artifact, not a Nav2 defect.`,
  label: {
    text: `${EVIDENCE_CLASS_LABELS["real-external-target"]} · ${EVIDENCE_CLASS_LABELS["harness-artifact"]}`,
    classes: ["real-external-target", "harness-artifact"],
  },
  cardLabel: "Real external target · harness artifact, not a Nav2 defect",
  summary:
    "A check that compares what a robot reports with where it really is caught a mismatch. The cause was our own unrealistic fault.",
  authors: [AUTHOR],
  date: PUBLISHED,
  revision: `Revision 1 · artifacts from ${FACT_SOURCE.artifactsCommitShort}, unchanged at ${FACT_SOURCE.evidenceCommitShort}`,
  question:
    "Can a check that reads ground truth catch a navigation stack reporting success it did not achieve, and can we tell a real defect from something our own harness caused?",
  system: [
    `Nav2 1.3.13 on ROS 2 Jazzy, unmodified, in a pinned container with no network, on a simplified loopback simulator: no physics and no state estimator. Task ${sm.task.id} (${sm.task.name}) on the ${sm.task.map} map, with a ${sm.task.deadlineS} s deadline.`,
    "The property: if Nav2 reports success, the robot must truly be within 0.35 m of the goal. The harness records the simulator's true pose; the search never sees it.",
  ],
  whyItMatters: [
    "Robots and services often report their own success. A check that compares the report with ground truth catches the cases where the two disagree. Classifying the cause matters as much: here the mismatch came from our own fault configuration, and saying so keeps the result honest.",
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
    { k: "Classification", v: "The injected noise is physically unrealistic and corrupts the only position source" },
  ],
  resultsNote: "A violation is a test failure, not automatically a defect.",
  visual: "goalPlot",
  limitations: [
    "Simulation only: no physics, no state estimator, no physical robot.",
    "Check bounds were not yet fault-aware.",
    "The original, unreduced schedule did not violate when re-run at its discovery seed (stochastic target).",
    "The regression case encodes this artifact, so it checks our harness, not Nav2.",
  ],
  technical: [
    { k: "Failure id", v: sm.failureId },
    { k: "Build fingerprint", v: sm.target.fingerprint },
    { k: "Config hash", v: sm.target.configHash },
    { k: "Discovery", v: `${sm.discovery.arm} arm, campaign seed ${sm.discovery.campaignSeed}, execution ${sm.discovery.atExecution}` },
    { k: "Trace", v: sm.traceSources[1] },
    { k: "Artifacts", v: `Copied at ${FACT_SOURCE.artifactsCommitShort}, unchanged at ${FACT_SOURCE.evidenceCommitShort}` },
  ],
  related: [
    { label: "Robotics & connected systems", href: "/products/robotics" },
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
  cardLabel: "Positive controls, real external targets and harness artifacts",
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
  whyItMatters: [
    "It is the plain record of what the engine has and has not shown, including a benchmark result that did not go our way and the results we withdrew.",
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
    { k: "MQTT", v: "0 FAIL so far. Latest blind campaign with the NanoMQ edge bridge on: 612 executions, 0 confirmed" },
  ],
  resultsNote: "The full sections follow, with updates from the stable checkpoint 768a9b5 noted.",
  limitations: [
    "A general advantage of guided search over random search has not been shown, on any target.",
    "No independently confirmed defect in Nav2, Mosquitto or any other system.",
    "Nothing beyond a simplified ROS 2 simulation; no physical hardware.",
    "No customers or design partners.",
  ],
  technical: [
    { k: "Results as of", v: `Research commit ${FACT_SOURCE.researchCommitShort} (${FACT_SOURCE.researchCheckedOn}), updates at ${FACT_SOURCE.evidenceCommitShort}` },
    { k: "Test suite", v: `${TEST_SUITE_STATUS}; ${TEST_SUITE_STABLE}` },
    { k: "Hosted CI", v: HOSTED_CI_STATUS },
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
      text: "Moved from the former Research page to Ordinum Labs. Review wording corrected: reviews were carried out by separate AI review agents, not independent human reviewers. Added updates from the stable checkpoint 768a9b5: a planted-control build of the testbed, the MQTT setup with its NanoMQ edge bridge, fix verification on PocketBase, and the test-suite figure.",
    },
    { date: "22 October 2026", text: "v1 benchmark results withdrawn after an internal audit (see the withdrawn-results note under Methodology)." },
  ],
  methodsNote: AI_METHODS_NOTE,
  body: "research-summary",
} as const satisfies LabsArticle;

/** Index order: newest finding first. */
export const labsArticles = [agentArticle, flagshipArticle, nav2Article, summaryArticle] as const satisfies readonly LabsArticle[];

export const labs = {
  indexTitle: "Published articles",
  /** Compact "Evidence and sources" block on /labs. */
  sources: {
    kicker: "EVIDENCE AND SOURCES",
    title: "Which product revision each claim comes from.",
    items: [
      { k: "Stable checkpoint", v: `Product commit ${FACT_SOURCE.evidenceCommitShort}: the PocketBase, Nav2 and testbed evidence packages. ${TEST_SUITE_STABLE}.` },
      { k: "Release candidate", v: `Branch ${FACT_SOURCE.releaseBranch}, code gates at ${FACT_SOURCE.releaseCommitShort}: the agent and transaction reference applications. ${TEST_SUITE_STATUS}.` },
      { k: "Research summary", v: `Results as of ${FACT_SOURCE.researchCommitShort}, with later updates noted.` },
      { k: "Hosted CI", v: HOSTED_CI_STATUS },
      { k: "Source access", v: "The product repository is private during the research stage. Selected artifacts are published as evidence packages." },
    ],
  },
} as const;

export function labsArticle(slug: string): LabsArticle | undefined {
  return (labsArticles as readonly LabsArticle[]).find((a) => a.slug === slug);
}
