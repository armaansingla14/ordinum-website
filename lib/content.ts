/**
 * Ordinum copy deck (9/10 pass and labs + products release, 1 November 2026; focused site 24 October 2026).
 *
 * Single source of truth for every word and number on the site. Builders render these objects;
 * they do not write copy in components.
 *
 * SOURCES
 *   - Founder brief and approved plan (2026-10-24; internal, not published): founder decisions
 *     (inquiries table, Resend, interim legal, Aarav's profile).
 *   - Internal claims registry (not published) built from the product repo, branch `ordinum-2`,
 *     HEAD 124dde072. `facts` arrays below hold its row ids (e.g. "A3", "F2"). "founder" = a
 *     founder-confirmed fact from the brief or plan.
 *   - Release plan (1 November 2026, internal): facts re-checked against product head 44284b0,
 *     evidence pinned at the stable checkpoint 768a9b5, plus the flagship PocketBase run
 *     re-executed on 2026-11-01 at 768a9b5. Copy for products, demos, roadmap and security below;
 *     Labs articles in ./labs.ts; proof packages in ./evidence-packages.ts.
 *   - Internal site claim map (not published).
 *   - Real proof artifacts: ./evidence.ts (numbers are read from there, not retyped).
 *   - 9/10 pass (1 November 2026): approved plan plus the internal claim table (stable 768a9b5,
 *     release candidate ordinum-2-release with code gates at 5a05996). Every "what works today"
 *     item carries a Channel label (stable vs release candidate).
 *
 * RULES
 *   - Integration maturity uses exactly four labels (MATURITY_LABELS). Planned is not built.
 *   - Evidence uses exactly the labels in EVIDENCE_CLASS_LABELS. No independently verified defect
 *     exists; never apply that label.
 *   - Withdrawn v1 benchmark numbers never appear, including in the withdrawn-results note.
 *   - Exact replay only on deterministic targets (toy, cross-system testbed in lockstep mode).
 *     Nav2 and MQTT reproduction is statistical.
 *   - ddmin output is "1-minimal" at best, never "smallest possible".
 *   - Feedback guidance has not been shown to outperform random search. Do not imply it has.
 *   - No Nav2, Mosquitto or other external defect has been found. No customers, users, partners,
 *     pilots, revenue or ongoing conversations exist: design-partner copy is an invitation.
 *   - Reuse percentages and component ratios are not used. The test figures are TEST_SUITE_STATUS
 *     (release candidate 5a05996) and TEST_SUITE_STABLE (stable checkpoint 768a9b5).
 *   - One primary CTA (PRIMARY_CTA, "Request an evaluation") and one secondary (WATCH_DEMO). No
 *     install commands, no promised repository access, no implied pilot agreement.
 *   - Agent and transaction results are about OUR OWN reference applications (release candidate);
 *     say so wherever they appear.
 *   - No em dashes in visible copy, titles, OG text or aria labels (tests/claims.site.spec.ts).
 *   - Reviews are "review by separate AI review agents": never described as independent, external
 *     or by a named party. They are not independent human audits.
 *   - No first / only / leading / guaranteed / proven-better language. No caricatures, and no
 *     competitor is named.
 */

import {
  PRODUCT_SOURCE,
  nav2Nominal,
  nav2PilotFindings,
  nav2PilotTotals,
  nav2SuccessMismatch,
  toyPositiveControl,
  type EvidenceLabel,
} from "./evidence";

/* -------------------------------------------------------------------------- */
/* Shared types and vocabularies                                               */
/* -------------------------------------------------------------------------- */

export type Link = { readonly label: string; readonly href: string };
export type ExternalLink = Link & { readonly external?: boolean };

/** Row id in registry.md (e.g. "A3"), or "founder" for founder-confirmed statements. */
export type FactRef = string;

/**
 * Integration maturity (registry section A). Exactly four levels.
 * - validated:    merged code, tests and a documented executed run.      Solid lime marker.
 * - experimental: merged and executed, but narrow, unstable or unreviewed. Outlined lime marker.
 * - in-progress:  partly built; not runnable or not stable.              Dashed lime marker.
 * - planned:      on the roadmap or in the vision. Not built.            Dashed steel marker.
 */
export type Maturity = "validated" | "experimental" | "in-progress" | "planned";

export const MATURITY_LABELS = {
  validated: "Built & validated",
  experimental: "Built, experimental",
  "in-progress": "In progress",
  planned: "Planned",
} as const satisfies Record<Maturity, string>;

/** Display order for legends. */
export const MATURITY_ORDER = ["validated", "experimental", "in-progress", "planned"] as const satisfies readonly Maturity[];

/** Kept so existing status chips compile; same vocabulary as Maturity. */
export type Status = Maturity;
export const STATUS_LABELS = MATURITY_LABELS;

/**
 * Evidence classification for every published result (brief section 6).
 * "Real external target" describes the system (independently maintained, not ours); the others
 * describe the result. Combine them as "Real external target · Harness artifact".
 */
export type EvidenceClass =
  | "real-external-target"
  | "positive-control"
  | "harness-artifact"
  | "expected-behavior"
  | "unresolved"
  | "verified-defect";

export const EVIDENCE_CLASS_LABELS = {
  "real-external-target": "Real external target",
  "positive-control": "Controlled positive control",
  "harness-artifact": "Harness artifact",
  "expected-behavior": "Expected behavior",
  unresolved: "Unresolved",
  /** No result on this site carries this label. It exists so the vocabulary is complete. */
  "verified-defect": "Independently verified defect",
} as const satisfies Record<EvidenceClass, string>;

/** One-line definitions (Research > Methodology). */
export const EVIDENCE_CLASS_DEFINITIONS = {
  "real-external-target": "Software we did not write, maintained independently (Nav2, Eclipse Mosquitto).",
  "positive-control": "A bug we planted on purpose, to check that the engine finds what it should. Not a discovery.",
  "harness-artifact": "A reported violation caused by our own faults, harness or check, not by the system under test.",
  "expected-behavior": "The system did what its specification says. No violation.",
  unresolved: "The evidence was ambiguous, so the check declined to judge. Neither a pass nor a failure.",
  "verified-defect": "A defect confirmed by analysis and, ideally, the maintainers. None exists yet.",
} as const satisfies Record<EvidenceClass, string>;

/** Map the label stored on each artifact in lib/evidence.ts to the site vocabulary. */
export function evidenceClassOf(label: EvidenceLabel): EvidenceClass {
  switch (label) {
    case "normal-behavior":
      return "expected-behavior";
    case "positive-control":
      return "positive-control";
    case "harness-artifact":
      return "harness-artifact";
    case "verified-defect":
      return "verified-defect";
  }
}

/** Repo snapshot every technical claim on the site is checked against. */
export const FACT_SOURCE = {
  repo: PRODUCT_SOURCE.repo,
  branch: PRODUCT_SOURCE.branch,
  /** Product head the facts were re-checked against (release, 1 November 2026). */
  commit: "44284b0443ad08e2cc8842831941695e48e2d764",
  commitShort: "44284b0",
  checkedOn: "1 November 2026",
  /** Stable checkpoint the published evidence and the flagship run are pinned to. */
  evidenceCommit: "768a9b555736a2da693bbeeb92d7fed2e65e2236",
  evidenceCommitShort: "768a9b5",
  /** Snapshot the research summary (toy, Nav2 pilot, testbed, MQTT sections) was written against. */
  researchCommitShort: "124dde072",
  researchCheckedOn: "24 October 2026",
  /** The demo artifacts in lib/evidence.ts were copied at this commit and are unchanged at 768a9b5. */
  artifactsCommitShort: PRODUCT_SOURCE.commitShort,
  /** Release candidate (branch ordinum-2-release): code gates at 5a05996, docs-only commits after. */
  releaseBranch: "ordinum-2-release",
  releaseCommitShort: "5a05996",
  note: "Facts checked against the stable checkpoint 768a9b5 and the release candidate ordinum-2-release (code gates at 5a05996), 1 November 2026.",
  researchNote:
    "The results in this summary reflect the ordinum-2 research branch at commit 124dde072, checked on 24 October 2026. The Nav2 pilot and toy benchmark artifacts are unchanged at 768a9b5.",
  artifactsNote: `Demo artifacts were copied at commit ${PRODUCT_SOURCE.commitShort} and are unchanged at the stable checkpoint 768a9b5.`,
} as const;

/**
 * The only hosted-CI statement on the site (claim table, 1 November 2026). One sentence. Use verbatim.
 * Facts: light jobs for Ordinum's own repository passed on GitHub Actions (2,460 passed at
 * 0d6c4ac); the heavy Docker suite has never run on a hosted runner; customer CI is templates only.
 */
export const HOSTED_CI_STATUS =
  "Light test jobs for Ordinum's own repository have passed on GitHub Actions (2,460 passed at 0d6c4ac); the heavy Docker suite has not yet run on a hosted runner, and CI for your pipeline exists only as templates.";

/** The local test-suite figure (release candidate code gates). Use verbatim. */
export const TEST_SUITE_STATUS = "2,506 passed, 32 skipped, 0 failed (local full suite at release candidate 5a05996)";
/** The same suite at the stable checkpoint, for comparison. */
export const TEST_SUITE_STABLE = "2,229 passed, 32 skipped, 0 failed at the stable checkpoint 768a9b5";

/**
 * Where a capability ships. Every "what works today" item carries one of these, so stable and
 * release-candidate results are never mixed up.
 */
export type Channel = "stable" | "rc";
export const CHANNEL_LABELS = {
  stable: "Stable · 768a9b5",
  rc: "Release candidate",
} as const satisfies Record<Channel, string>;

/**
 * How Ordinum is delivered today. No hosted service, dashboard or accounts, no public install and
 * no self-serve product: evaluations are guided by the founders on the team's own machines.
 */
export const delivery = {
  /** One line for the first screen. */
  short: "Ordinum runs on your machines as a CLI with Python integrations. Evaluations are guided by the founders.",
  items: [
    { term: "CLI", detail: "The ordinum command line runs campaigns, confirms and reduces failures, compares builds, verifies fixes and replays regression cases." },
    { term: "Python integrations", detail: "An adapter contract (Target and Session) connects a system. A new system needs its own integration; today the founders write it with you." },
    { term: "Configuration", detail: "Runs are described in declarative TOML: the system, its rules, the faults and the budget." },
    { term: "Agents kit", detail: "ordinum.agents, a Python kit for testing an agent's tool calls against its permissions." },
    { term: "Guided evaluation", detail: "There is no self-serve install. Evaluations are guided by the founders, with your team, on your machines." },
  ],
  local: "Everything runs on your machines. There is no hosted service, dashboard or account, and Ordinum does not change your code.",
} as const;

/** Methods note on every Labs article (founder decision, 1 November 2026). Use verbatim. */
export const AI_METHODS_NOTE =
  "Engineering and review used AI coding and review agents; reviews were not independent human audits.";

/** The flagship planted-control label. Use verbatim wherever the PocketBase run appears. */
export const FLAGSHIP_LABEL = "Planted defect in our client path, not a PocketBase bug.";

/**
 * The flagship run: PocketBase planted positive control, re-executed on 2026-11-01 at product
 * commit 768a9b5 (release plan, founder-run recording). Every number here is from that run.
 */
export const flagship = {
  label: FLAGSHIP_LABEL,
  labelClasses: ["positive-control"] as const satisfies readonly EvidenceClass[],
  commitShort: "768a9b5",
  date: "1 November 2026",
  target: "PocketBase 0.40.6, unmodified, binary pinned by SHA-256",
  planted: "pc_stale_read_cache",
  plantedWhere: "Ordinum's own PocketBase client path",
  properties: ["read_authz", "model_agreement"],
  verdict: "FIX_VERIFIED",
  verifyExit: "exit 0",
  confirmed: "5/5",
  minimized: "1-minimal",
  affected: "10/10",
  fixed: "0/10",
  fisherP: "5.41e-06",
  exercised: "100/100",
  ciResult: "2 PASS",
  ciExit: "exit 0",
  runtime: "about 5.5 minutes",
  host: "a 16-vCPU WSL2 laptop",
  stats: [
    { k: "Verdict", v: "FIX_VERIFIED (ordinum verify, exit 0)" },
    { k: "Confirmed", v: "read_authz and model_agreement, 5/5 each" },
    { k: "Minimized", v: "1-minimal" },
    { k: "Affected vs fixed", v: "10/10 vs 0/10 (one-sided Fisher p = 5.41e-06)" },
    { k: "Property exercised", v: "read_authz exercised 100/100 on each build" },
    { k: "Regression", v: "ordinum ci: 2 PASS, exit 0" },
    { k: "Run", v: "About 5.5 min on a 16-vCPU WSL2 laptop, no Docker" },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Site                                                                        */
/* -------------------------------------------------------------------------- */

export const site = {
  name: "Ordinum",
  url: "https://ordinum.org",
  email: "armaan@ordinum.org",
  calUrl: "https://cal.com/armaansingla/30min",
  linkedinCompany: "https://www.linkedin.com/company/ordinum-ai",
  x: "https://x.com/OrdinumAI",
  instagram: "https://www.instagram.com/ordinumai",
  founderLinkedin: "https://www.linkedin.com/in/armaansingla",
  cofounderLinkedin: "https://www.linkedin.com/in/aaravsinglaa",
  tagline: "Find security failures before they reach the real world.",
  description:
    "Ordinum is building continuous security testing for software, firmware and hardware. It reproduces failures, checks fixes and turns confirmed cases into tests for future releases. Research-stage.",
} as const;

/* -------------------------------------------------------------------------- */
/* SEO                                                                         */
/* -------------------------------------------------------------------------- */

export const seo = {
  home: {
    /** The home <title> is exactly the brand (absolute, no template). */
    title: "Ordinum",
    description:
      "Ordinum is building continuous security testing for software, firmware and hardware. It reproduces failures, checks the engineer's fix and turns confirmed cases into tests for future releases. Runs on your machines as a CLI with Python integrations.",
    ogTitle: "Ordinum: Find security failures before they reach the real world",
    ogDescription:
      "Continuous security testing for software, firmware and hardware. Ordinum reproduces failures, checks fixes and keeps confirmed cases as regression tests.",
    twitterTitle: "Ordinum: Find security failures before they reach the real world",
    twitterDescription:
      "Continuous security testing for software, firmware and hardware. Ordinum reproduces failures, checks fixes and keeps confirmed cases as regression tests.",
  },
  /** Organization JSON-LD description (app/layout.tsx). */
  organizationDescription:
    "Ordinum is building continuous security testing infrastructure for software, firmware and hardware. It reproduces failures, checks fixes and keeps confirmed cases as regression tests.",
  /** Per-page full titles for OG/Twitter. pages[*].meta.title stays short for the "%s | Ordinum" template. */
  pages: {
    products: "Ordinum platform: One engine, one workflow, and how a run works",
    software: "Software & APIs: Test access rules and concurrent writes under faults",
    agents: "AI agent security: Test what agents do with their permissions",
    robotics: "Robotics & connected systems: Check what robots report against ground truth",
    transactions: "Transaction assurance: Test approvals and ledgers in a reference application",
    roadmap: "Roadmap: Firmware, hardware and the agentic security loop",
    demos: "Demo: A planted failure found, fixed and verified",
    nav2Walkthrough: "Nav2 walkthrough: A real run, step by step",
    labs: "Ordinum Labs: What we tested and what we found",
    security: "Security: Deployment, data handling and network isolation",
    about: "About: The founders building Ordinum",
    contact: "Request an evaluation of Ordinum",
    terms: "Website Terms",
    privacy: "Privacy Notice",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

/** One destination inside a nav group: a one-line description and, for products, a maturity label. */
export type NavItem = {
  readonly label: string;
  readonly href: string;
  readonly description: string;
  readonly maturity?: Maturity;
  /** Scope shown next to the maturity label, e.g. "simulation only". */
  readonly maturityNote?: string;
};

export type NavGroup = {
  readonly kind: "group";
  readonly id: string;
  readonly label: string;
  readonly items: readonly NavItem[];
};

export type NavLink = {
  readonly kind: "link";
  readonly label: string;
  readonly href: string;
  /** Extra route prefixes that mark this entry active (e.g. /evidence under Demos). */
  readonly match?: readonly string[];
};

export type NavEntry = NavGroup | NavLink;

/** The one primary call to action, everywhere on the site (founder decision, 1 November 2026). */
export const PRIMARY_CTA = { label: "Request an evaluation", href: "/contact" } as const satisfies Link;
/** The one secondary call to action: the flagship recording on the home page. */
export const WATCH_DEMO = { label: "Watch demo", href: "/#demo" } as const satisfies Link;

export const nav = {
  /**
   * Top level: Products (disclosure), Demos, Ordinum Labs, Resources (disclosure), Company
   * (disclosure). Groups open on click / Enter / Space, never on hover alone.
   */
  entries: [
    {
      kind: "group",
      id: "products",
      label: "Products",
      items: [
        {
          label: "Platform overview",
          href: "/products",
          description: "One engine, one workflow, and how a run works.",
          maturity: "validated",
          maturityNote: "core engine",
        },
        {
          label: "Software & APIs",
          href: "/products/software",
          description: "Access rules and concurrent writes on a running service.",
          maturity: "experimental",
          maturityNote: "PocketBase · one host",
        },
        {
          label: "AI agent security",
          href: "/products/agents",
          description: "What agents do with tools, credentials and permissions.",
          maturity: "experimental",
          maturityNote: "our reference applications",
        },
        {
          label: "Robotics & connected systems",
          href: "/products/robotics",
          description: "Nav2 in simulation, MQTT brokers, a four-process testbed.",
          maturity: "validated",
          maturityNote: "Nav2 · simulation only",
        },
        {
          label: "Transaction assurance",
          href: "/products/transactions",
          description: "Approvals and ledgers, in our own reference application.",
          maturity: "experimental",
          maturityNote: "reference application",
        },
        {
          label: "Roadmap",
          href: "/roadmap",
          description: "Firmware, devices, hardware and the agentic security loop.",
          maturity: "planned",
          maturityNote: "not available yet",
        },
      ],
    },
    { kind: "link", label: "Demos", href: "/demos", match: ["/evidence"] },
    { kind: "link", label: "Ordinum Labs", href: "/labs" },
    {
      kind: "group",
      id: "resources",
      label: "Resources",
      items: [
        {
          label: "Security",
          href: "/security",
          description: "Where runs execute, data handling and network isolation.",
        },
      ],
    },
    {
      kind: "group",
      id: "company",
      label: "Company",
      items: [
        { label: "About", href: "/about", description: "The two co-founders building Ordinum." },
        { label: "Contact", href: "/contact", description: "Request an evaluation or send a short note." },
      ],
    },
  ],
  /** Primary header CTA. Key kept as `demo` so existing Navbar/MobileMenu code compiles. */
  demo: PRIMARY_CTA,
} as const satisfies {
  entries: readonly NavEntry[];
  demo: Link;
};

/** Every internal destination in the nav, flattened (tests, footer). */
export const navDestinations: readonly string[] = nav.entries.flatMap((e) =>
  e.kind === "group" ? e.items.map((i) => i.href) : [e.href],
);

/* -------------------------------------------------------------------------- */
/* The five-step workflow (home diagram and /products#how-it-works)            */
/* -------------------------------------------------------------------------- */

export type WorkflowStageId = "connect" | "run" | "reproduce" | "verify" | "regress";

export type WorkflowStage = {
  readonly n: string;
  readonly id: WorkflowStageId;
  readonly label: string;
  /** One short line for the home diagram. */
  readonly short: string;
  readonly body: string;
  readonly facts: readonly FactRef[];
};

export const WORKFLOW_STAGES = [
  {
    n: "01",
    id: "connect",
    label: "Connect",
    short: "An adapter and the rules your system must obey.",
    body: "Connect your system through an adapter and write the rules it must obey, for example who may read which records.",
    facts: ["B1"],
  },
  {
    n: "02",
    id: "run",
    label: "Run scenarios",
    short: "Faults injected, rules checked on ground truth.",
    body: "Ordinum runs controlled scenarios with delays, dropped messages, restarts and permission changes. Ground-truth checks judge what actually happened, not what the system reported.",
    facts: ["A1", "E3", "B2", "B3"],
  },
  {
    n: "03",
    id: "reproduce",
    label: "Reproduce",
    short: "Re-run, measured, cut down to its cause.",
    body: "Ordinum re-runs each failure to measure how often it recurs and cuts the fault schedule down to the faults that cause it.",
    facts: ["B6", "B7"],
  },
  {
    n: "04",
    id: "verify",
    label: "Verify the fix",
    short: "Failing build against fixed build.",
    body: "After the engineer changes the code, Ordinum runs the failing and the fixed build side by side and checks that the rule was really exercised, so a pass that tested nothing does not count.",
    facts: ["release"],
  },
  {
    n: "05",
    id: "regress",
    label: "Keep as a regression",
    short: "Replayed against every future release.",
    body: "The confirmed case is saved as a self-contained regression test that ordinum ci replays against future builds.",
    facts: ["B8", "A9"],
  },
] as const satisfies readonly WorkflowStage[];

/* -------------------------------------------------------------------------- */
/* Integrations: one canonical list (research sections, testing areas)          */
/* -------------------------------------------------------------------------- */

export type IntegrationId = "core" | "pocketbase" | "agents" | "nav2" | "xsys" | "mqtt" | "xsysFree" | "toy" | "ci" | "engines" | "px4";

export type Integration = {
  readonly id: IntegrationId;
  readonly name: string;
  readonly maturity: Maturity;
  /** Qualifier shown next to the maturity label, e.g. "exploratory pilot". */
  readonly maturityNote?: string;
  /** What kind of system it is, when it is a target. */
  readonly targetKind?: string;
  /** One sentence. */
  readonly summary: string;
  /** Longer description. */
  readonly detail: string;
  readonly limits: readonly string[];
  readonly facts: readonly FactRef[];
};

/**
 * MQTT configuration at the stable checkpoint (release fact list, 1 November 2026). The NanoMQ
 * edge bridge is part of the Built, experimental MQTT integration; the old "In progress" label
 * is stale.
 */
export const MQTT_SETUP = {
  config:
    "Eclipse Mosquitto 2.0.22 is the system under test, with dynamic security and persistence. A NanoMQ 0.25.7 edge bridge is on by default. Both images are pinned by digest.",
  bridge: "The bridge has been stable in 80 of 80 rounds and 208 of 208 readiness checks.",
  results: "0 FAIL so far. The latest blind campaign with the bridge on ran 612 executions, with 0 confirmed findings.",
  limits: [
    "The bridge session is not durable, so deliveries at the edge count only as positive evidence.",
    "The edge broker allows anonymous local clients on 127.0.0.1.",
    "There is no egress firewall.",
    "0 FAIL is not evidence that either broker is correct.",
  ],
} as const;

export const integrations = [
  {
    id: "core",
    name: "Core testing engine",
    maturity: "validated",
    summary:
      "Runs scenarios with timed faults, judges them with ground-truth checks, reproduces and reduces failures, and saves regression cases and reports.",
    detail:
      "One target-agnostic engine: search, a supervisor with deadlines, ground-truth checks on harness-recorded evidence, delta-debugging minimization, exact or statistical reproduction, JSON regression cases and self-contained HTML reports.",
    limits: ["Runs on a single machine; there is no distributed runner.", HOSTED_CI_STATUS, "Every end-to-end fix demonstration so far uses a planted defect."],
    facts: ["A1", "B1", "B3", "B6", "B7", "B8", "B9", "release"],
  },
  {
    id: "pocketbase",
    name: "PocketBase adapter",
    maturity: "experimental",
    maturityNote: "one host",
    targetKind: "Real external target",
    summary: "Runs unmodified PocketBase 0.40.6 under our own access policy and workload, on one host.",
    detail:
      "PocketBase 0.40.6, unmodified, with the binary pinned by SHA-256, driven on one host by Ordinum's own policy and workload.",
    limits: ["Our policy and workload on one host, not a production deployment."],
    facts: ["release"],
  },
  {
    id: "agents",
    name: "Agents kit and reference application",
    maturity: "experimental",
    maturityNote: "our own reference applications",
    targetKind: "Applications we wrote, with planted defects",
    summary:
      "ordinum.agents checks whether an agent stays inside its permissions. Tested on our own reference agent application and one small model run locally; no third-party agent application tested.",
    detail:
      "A Python kit for testing what an AI agent is allowed to do and what it actually changes. At the release candidate it runs against our own reference agent application, with 9 planted defects, and found one real bug in that application's hardened build.",
    limits: ["Our own reference applications only.", "No third-party agent application has been tested."],
    facts: ["release", "A37", "A41", "A42"],
  },
  {
    id: "nav2",
    name: "ROS 2 / Nav2 adapter",
    maturity: "validated",
    maturityNote: "simulation only",
    targetKind: "Real external target",
    summary: "Drives stock Nav2 robot navigation in a simplified simulator. Exploratory pilot; no Nav2 defect found.",
    detail:
      "Stock Nav2 1.3.13 on ROS 2 Jazzy in a pinned container. An agent inside the container interposes on scan, odometry, transform and velocity-command messages and keeps a ground-truth record taken before any fault is applied.",
    limits: [
      "Simplified loopback simulation: no physics, no state estimator.",
      "Some faults could create physically impossible situations, and check bounds are not yet fault-aware.",
    ],
    facts: ["A3", "F1", "F2", "C3"],
  },
  {
    id: "xsys",
    name: "Four-process testbed",
    maturity: "experimental",
    maturityNote: "our own system",
    targetKind: "Our own testbed",
    summary:
      "Four separate processes we built (authorization service, broker, controller, actuator), checked against four written policy clauses.",
    detail:
      "A four-process software testbed that models a cloud-to-device command path. Each component is a separate OS process, connected only through a harness fabric, and runs are judged with causal (happened-before) checks. The lockstep build replays exactly in our measurements.",
    limits: ["Our own system under test, not production software, hardware or a customer system."],
    facts: ["A6", "D1", "D2", "D3", "B10"],
  },
  {
    id: "mqtt",
    name: "MQTT: Mosquitto with a NanoMQ edge bridge",
    maturity: "experimental",
    maturityNote: "bridge on by default",
    targetKind: "Real external target",
    summary: `${MQTT_SETUP.config} ${MQTT_SETUP.results}`,
    detail:
      "The engine runs MQTT scenarios end to end with three checks taken from the MQTT v5 specification and Mosquitto's dynamic-security rules: no duplicate delivery of a QoS 2 message, no delivery after a committed publish-deny, and durable-session redelivery.",
    limits: MQTT_SETUP.limits,
    facts: ["A4", "A5", "E1", "E2", "E4", "release"],
  },
  {
    id: "xsysFree",
    name: "Testbed free-running mode",
    maturity: "in-progress",
    targetKind: "Our own testbed",
    summary: "A nondeterministic mode of the four-process testbed. Registered, but not yet runnable.",
    detail: "The stochastic runtime exists, but the harness does not orchestrate it yet.",
    limits: ["Not runnable today."],
    facts: ["A7"],
  },
  {
    id: "toy",
    name: "Toy robot benchmark",
    maturity: "validated",
    targetKind: "Controlled positive control",
    summary: "An in-house grid robot with 11 planted bugs, used to check that the engine finds what it should.",
    detail:
      "An 8×8 grid robot with a sensor, planner, state machine, controller and actuator, and 11 failure classes we planted deliberately.",
    limits: ["We wrote it and planted its bugs: results are positive controls, not discoveries."],
    facts: ["A2", "A8", "F5"],
  },
  {
    id: "ci",
    name: "CI for your pipeline",
    maturity: "in-progress",
    summary: HOSTED_CI_STATUS,
    detail: "Regression cases are self-contained JSON files that ordinum ci replays locally.",
    limits: [],
    facts: ["A9", "release"],
  },
  {
    id: "engines",
    name: "Firmware and hardware testing",
    maturity: "planned",
    summary: "Native fuzzing, emulated firmware, device transports and hardware in the loop.",
    detail: "Planned work that would report into the same checks. None is built.",
    limits: [],
    facts: ["A10"],
  },
  {
    id: "px4",
    name: "PX4 adapter",
    maturity: "planned",
    targetKind: "Real external target",
    summary: "A drone autopilot target, with a higher-fidelity simulator.",
    detail: "On the engineering roadmap: a PX4 adapter and a Gazebo-backed simulation tier.",
    limits: [],
    facts: ["A10"],
  },
] as const satisfies readonly Integration[];

/** Look up an integration by id (throws at build time if an id is missing). */
export function integration(id: IntegrationId): Integration {
  const found = integrations.find((i) => i.id === id);
  if (!found) throw new Error(`Unknown integration: ${id}`);
  return found;
}

/* -------------------------------------------------------------------------- */
/* Testing areas (home section 4): each area with its supported integrations    */
/* -------------------------------------------------------------------------- */

export type TestingAreaKey = "software" | "agents" | "robotics" | "transactions";

export type TestingArea = {
  readonly key: TestingAreaKey;
  readonly label: string;
  readonly href: string;
  readonly body: string;
  readonly integrations: readonly {
    readonly name: string;
    readonly maturity: Maturity;
    readonly note: string;
    readonly channel: Channel;
  }[];
};

export const testingAreas = [
  {
    key: "software",
    label: "Software & APIs",
    href: "/products/software",
    body: "Access rules and concurrent writes on a running service.",
    integrations: [{ name: "PocketBase 0.40.6", maturity: "experimental", note: "one host", channel: "stable" }],
  },
  {
    key: "agents",
    label: "AI agent security",
    href: "/products/agents",
    body: "What an agent does with its tools and permissions.",
    integrations: [{ name: "Our reference agent application", maturity: "experimental", note: "reference application", channel: "rc" }],
  },
  {
    key: "robotics",
    label: "Robotics & connected systems",
    href: "/products/robotics",
    body: "What robots and brokers report, checked against ground truth.",
    integrations: [
      { name: "ROS 2 / Nav2", maturity: "validated", note: "simulation only", channel: "stable" },
      { name: "Mosquitto + NanoMQ edge bridge", maturity: "experimental", note: "local Docker", channel: "stable" },
    ],
  },
  {
    key: "transactions",
    label: "Transaction assurance",
    href: "/products/transactions",
    body: "Approvals and ledger writes under faults and retries.",
    integrations: [{ name: "Our transaction reference application", maturity: "experimental", note: "reference application", channel: "rc" }],
  },
] as const satisfies readonly TestingArea[];

/** The planned row under the four areas (home) and on /roadmap. */
export const plannedAreas = {
  label: "Firmware, native fuzzing, devices and physical hardware",
  body: "Planned. Not built yet.",
  link: { label: "Roadmap", href: "/roadmap" },
} as const;

/* -------------------------------------------------------------------------- */
/* Home: hero                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Hero (9/10 pass, 1 November 2026): the platform ambition first, then what is available today
 * and how it is delivered. Firmware and hardware are named as planned in the availability line.
 */
export const hero = {
  eyebrow: "Continuous security testing",
  titleLine1: "Find security failures",
  titleLine2: "before they reach the real world.",
  lede: "We're building continuous security testing for software, firmware and hardware. Ordinum reproduces failures, checks the engineer's fix and turns each confirmed case into a test for future releases.",
  /** What can be evaluated today, and what is planned. */
  availability: {
    label: "Available today",
    text: "Software and APIs, AI-agent reference applications, robotics in simulation.",
    plannedLabel: "Planned",
    planned: "Firmware and physical hardware.",
  },
  delivery: delivery.short,
  primaryCta: PRIMARY_CTA,
  secondaryCta: WATCH_DEMO,
  /** Mono meta row; meta[0] is also the OG image footer. */
  meta: ["RESEARCH-STAGE", "SOFTWARE · AI AGENTS · ROBOTICS · TRANSACTIONS"],
} as const satisfies {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  lede: string;
  availability: { label: string; text: string; plannedLabel: string; planned: string };
  delivery: string;
  primaryCta: Link;
  secondaryCta: Link;
  meta: readonly string[];
};

/** Availability as one line (OG alt text). */
export const heroStatusLine = `${hero.availability.label}: ${hero.availability.text} ${hero.availability.plannedLabel}: ${hero.availability.planned}`;

/* -------------------------------------------------------------------------- */
/* Home: sections 2-7                                                          */
/* -------------------------------------------------------------------------- */

const sm = nav2SuccessMismatch;

/** One step of the annotated strip under the flagship recording. `at` is the time in the recording. */
export type DemoStripStep = {
  readonly n: string;
  readonly label: string;
  readonly value: string;
  readonly caption: string;
  /** Seconds into the recording where this step is shown (from the caption file). */
  readonly at?: number;
};

/**
 * Home (9/10 pass), in order: hero; the flagship recording with a five-step strip and a
 * before/after card; the workflow diagram; four product areas plus the planned row; the ambition
 * and the agentic loop; Labs; the evaluation band. Budget: 650 words of main text.
 */
export const home = {
  /** Section 2: the flagship recording. The planted-defect label sits beside the result card, once. */
  demo: {
    kicker: "DEMO",
    title: "Failure to verified fix, in 1:35.",
    lede: "A recorded run on unmodified PocketBase 0.40.6: Ordinum finds forbidden reads, the engineer removes the cause, Ordinum checks the fix.",
    strip: [
      { n: "01", label: "Failure", value: "read_authz violated", caption: "Clients read records the policy no longer allows.", at: 7 },
      { n: "02", label: "Reproduction", value: `Confirmed ${flagship.confirmed}`, caption: "One fault is enough (1-minimal).", at: 46 },
      { n: "03", label: "Engineer's fix", value: "Cache removed", caption: "The fixed build drops the stale cache." },
      { n: "04", label: "Verification", value: flagship.verdict, caption: `Affected ${flagship.affected} vs fixed ${flagship.fixed}.`, at: 55 },
      { n: "05", label: "Saved regression", value: `ordinum ci: ${flagship.ciResult}`, caption: "Replayed against future builds.", at: 70 },
    ],
    result: {
      title: "Result",
      affected: { label: "Affected build", detail: "with the stale cache", failures: 10, runs: 10 },
      fixed: { label: "Fixed build", detail: "cache removed", failures: 0, runs: 10 },
      unit: "runs that violated read_authz",
      verdict: `${flagship.verdict} · one-sided Fisher p = ${flagship.fisherP}`,
    },
    link: { label: "Evidence package", href: "/evidence/pocketbase-verified-fix" },
  },

  /** Section 3: the workflow diagram (WORKFLOW_STAGES). */
  workflow: {
    kicker: "HOW IT WORKS",
    title: "From a rule to a kept regression test.",
    link: { label: "How a run works", href: "/products#how-it-works" },
  },

  /** Section 4: product areas (testingAreas) plus the planned row. */
  areas: {
    kicker: "PRODUCT AREAS",
    title: "One engine, four areas today.",
    link: { label: "Platform overview", href: "/products" },
  },

  /** Section 5: the ambition and the agentic loop (agenticLoop). */
  ambition: {
    kicker: "WHERE THIS IS GOING",
  },

  /** Section 6: Labs articles (slugs in lib/labs.ts). */
  labs: {
    kicker: "ORDINUM LABS",
    title: "What we tested, and what we found.",
    slugs: [
      "ordinum-found-a-bug-in-our-own-reference-agent",
      "from-failed-authorization-test-to-verified-fix",
      "what-a-robots-success-message-can-hide",
    ],
    link: { label: "All articles", href: "/labs" },
  },
} as const satisfies {
  demo: {
    kicker: string;
    title: string;
    lede: string;
    strip: readonly DemoStripStep[];
    result: {
      title: string;
      affected: { label: string; detail: string; failures: number; runs: number };
      fixed: { label: string; detail: string; failures: number; runs: number };
      unit: string;
      verdict: string;
    };
    link: Link;
  };
  workflow: { kicker: string; title: string; link: Link };
  areas: { kicker: string; title: string; link: Link };
  ambition: { kicker: string };
  labs: { kicker: string; title: string; slugs: readonly string[]; link: Link };
};

/* -------------------------------------------------------------------------- */
/* The agentic security loop (home section 5 and /roadmap). A labeled vision.   */
/* -------------------------------------------------------------------------- */

export type LoopStatus = "today" | "dev" | "planned";
export const LOOP_STATUS_LABELS = {
  today: "Today",
  dev: "In development",
  planned: "Planned",
} as const satisfies Record<LoopStatus, string>;

/**
 * Facts (claim table): only a seed-suggestion interface exists; there is no language model in the
 * loop; agents that build harnesses, choose techniques or propose fixes are planned.
 */
export const agenticLoop = {
  title: "Security testing infrastructure for increasingly autonomous companies.",
  lede: "As more software, agents and machines act on their own, testing has to keep up. The long-term goal is a loop that tests, learns and proposes fixes, with engineers deciding what ships.",
  stages: [
    { id: "run", label: "Run scenarios", status: "today" },
    { id: "check", label: "Check rules", status: "today" },
    { id: "reproduce", label: "Reproduce", status: "today" },
    { id: "verify", label: "Verify fixes", status: "today" },
    { id: "regress", label: "Keep regressions", status: "today" },
    { id: "suggest", label: "Seed suggestions", status: "dev" },
    { id: "harness", label: "Agents build harnesses", status: "planned" },
    { id: "technique", label: "Agents choose techniques", status: "planned" },
    { id: "fix", label: "Agents propose fixes", status: "planned" },
  ],
  note: "Today there is no language model in the loop. Only an interface for suggested starting scenarios is in development.",
  ariaLabel:
    "Diagram of the agentic security loop. Today: run scenarios, check rules, reproduce, verify fixes and keep regressions. In development: an interface for seed suggestions. Planned: agents that build harnesses, choose techniques and propose fixes. Today there is no language model in the loop.",
} as const satisfies {
  title: string;
  lede: string;
  stages: readonly { id: string; label: string; status: LoopStatus }[];
  note: string;
  ariaLabel: string;
};

/* -------------------------------------------------------------------------- */
/* Closing CTA band (home and every inner page except /contact)                */
/* -------------------------------------------------------------------------- */

export const ctaBand = {
  kicker: "EVALUATIONS",
  title: "Request an evaluation.",
  titleMuted: "Bring one system and one failure.",
  body: "We start with a short discussion and a demo, then agree on a suitable system and testing scope with you.",
  note: "Research-stage. Runs on your machines; evaluations are guided by the founders.",
  /** Primary button. Key kept as `demo` for the existing CtaBand component. */
  demo: PRIMARY_CTA,
  secondary: WATCH_DEMO,
} as const satisfies {
  kicker: string;
  title: string;
  titleMuted: string;
  body: string;
  note: string;
  demo: Link;
  secondary: Link;
};

/* -------------------------------------------------------------------------- */
/* Demo walkthrough (/demos/nav2-walkthrough; short form on /products/robotics) */
/* -------------------------------------------------------------------------- */

export type DemoStepId = "system" | "property" | "faults" | "observed" | "verdict" | "reproduction" | "regression";

export type DemoStep = {
  readonly n: string;
  readonly id: DemoStepId;
  readonly label: string;
  /** One line (robotics page). */
  readonly short: string;
  /** Full factual description (/demo). */
  readonly detail: string;
  /** Artifact path in the product repo the step is read from. */
  readonly source: string;
};

const smOriginalFaults = sm.original.faults;
/** Applied time to 2 decimals, as the repo's HTML report shows it. */
const atS = (t: number | null) => (t === null ? "not applied" : t.toFixed(2));
const smTfFault = smOriginalFaults[1];
const smScanFault = smOriginalFaults[2];

export const demoWalkthrough = {
  /** Key into lib/evidence.ts. */
  artifact: "nav2SuccessMismatch",
  label: `${EVIDENCE_CLASS_LABELS["real-external-target"]} · ${EVIDENCE_CLASS_LABELS["harness-artifact"]}`,
  labelClasses: ["real-external-target", "harness-artifact"] as const satisfies readonly EvidenceClass[],
  /** Explanatory text rendered next to (not inside) the evidence badge. */
  qualifier: "Fault configuration, not a Nav2 defect",
  steps: [
    {
      n: "01",
      id: "system",
      label: "System under test",
      short: "Stock Nav2 robot navigation (ROS 2 Jazzy) in a container with no network, driving a simulated robot.",
      detail: `Nav2 1.3.13 on ROS 2 Jazzy, unmodified, in a pinned Docker image with no network access, on a simplified loopback simulator (no physics, no state estimator). Task ${sm.task.id} (${sm.task.name}) on the ${sm.task.map} map, with a ${sm.task.deadlineS} s deadline.`,
      source: sm.source,
    },
    {
      n: "02",
      id: "property",
      label: "Property checked",
      short: "If Nav2 reports success, the robot must truly be within 0.35 m of the goal.",
      detail: `${sm.verdict.invariant}, a truth-vs-claimed check: Nav2's reported result is compared with the simulator's ground-truth pose, and success counts only within 0.35 m of the goal. The harness records that ground truth; the search never sees it.`,
      source: sm.source,
    },
    {
      n: "03",
      id: "faults",
      label: "Injected faults",
      short: `Noise on the robot's position transform (σ ${smTfFault.params.sigma} m) and reordered laser scans.`,
      detail: `The random search scheduled ${sm.minimization.before} faults; ${sm.minimization.beforeApplied} applied: odometry noise at ${atS(smOriginalFaults[0].appliedAt)} s, transform noise (σ ${smTfFault.params.sigma} m) at ${atS(smTfFault.appliedAt)} s, and laser-scan reordering at ${atS(smScanFault.appliedAt)} s. A fourth fault waited on a trigger that never fired.`,
      source: sm.metaSource,
    },
    {
      n: "04",
      id: "observed",
      label: "Observed behavior",
      short: `Nav2 reported ${sm.minimized.result.status} at ${sm.minimized.result.tS} s.`,
      detail: `In the minimized run, Nav2 accepted the goal at 0.01 s, replanned about once a second, and reported ${sm.minimized.result.status} at ${sm.minimized.result.tS} s. The simulator's true pose was ${sm.verdict.distanceText} from the goal.`,
      source: sm.traceSources[1],
    },
    {
      n: "05",
      id: "verdict",
      label: "Verifier verdict",
      short: `Violated: reported success, but the robot was ${sm.verdict.distanceText} from the goal (limit 0.35 m).`,
      detail: `${sm.verdict.invariant} violated (severity ${sm.verdict.severity}): ${sm.verdict.detail}. A violation is a test failure, not automatically a defect; it still has to be classified.`,
      source: sm.source,
    },
    {
      n: "06",
      id: "reproduction",
      label: "Reproduction & minimization",
      short: `Reproduced ${sm.reproduction.rate} on fresh seeds; faults reduced from ${sm.minimization.before} to ${sm.minimization.after}.`,
      detail: `Nav2 is not deterministic, so Ordinum measured reproduction statistically instead of replaying exactly: ${sm.reproduction.rate} fresh seeds violated (${sm.reproduction.wilson95Text}). Delta debugging cut ${sm.minimization.before} faults to ${sm.minimization.after} in ${sm.minimization.runs} runs but hit its 600 s cap, so the result is not verified 1-minimal. Transform noise alone reproduced ${sm.followUp.tfNoiseOnly} in follow-up runs.`,
      source: sm.metaSource,
    },
    {
      n: "07",
      id: "regression",
      label: "Regression artifact",
      short: `Saved as a JSON regression case that re-checks the failure on ${sm.regressionVerify.storedSeeds} stored seeds.`,
      detail: `Saved as ${sm.failureId}.json: the minimized scenario, build fingerprint, configuration hash, violated property and reproduction data. Today it asserts the violation recurs in at least ${sm.regressionVerify.minK} of the ${sm.regressionVerify.storedSeeds} stored seeds; after a fix it is flipped to require 0. It is stored with the pilot results, not in the committed regression suite, and needs Docker to run. A harness regression check, not a Nav2 bug guard.`,
      source: sm.regressionCase,
    },
  ],
  classification: {
    title: "Why this is not a Nav2 defect",
    body: "The injected noise (σ 0.356 m on the odom→base_footprint transform, from 4.40 s to the end of the run) is physically unrealistic, and this setup has no state estimator to reject it, so the fault corrupted the robot's only position source. Review by separate AI review agents, briefed to argue against the classification, upheld it. These were not independent human audits.",
  },
} as const satisfies {
  artifact: string;
  label: string;
  labelClasses: readonly EvidenceClass[];
  qualifier: string;
  steps: readonly DemoStep[];
  classification: { title: string; body: string };
};

export type CaptionCue = {
  readonly start: string;
  readonly end: string;
  readonly text: string;
};

export const demoPage = {
  intro: {
    kicker: "WALKTHROUGH / 001",
    title: "Seven steps, one recorded failure case.",
    lede: `Every value below comes from the committed report, traces and meta file for one Nav2 pilot failure: the schedule that found it, its reduced form (the run shown) and ${sm.reproduction.trials} replays on fresh seeds.`,
  },
  walkthrough: demoWalkthrough,
  /** Compact next step right after the classification (reuses the CTA band labels). */
  midCta: { primary: PRIMARY_CTA },
  /** Under the classification: the Labs case study and the Nav2 pilot section of the research summary. */
  caseStudy: { label: "Read the case study", href: "/labs/what-a-robots-success-message-can-hide" },
  pilot: { label: "The Nav2 pilot in the research summary", href: "/labs/research-summary#nav2-pilot" },
  fullTrace: {
    kicker: "FULL TRACE / 002",
    title: "The full trace.",
    titleMuted: "Both runs, every event.",
  },
  timelineNote: "Timeline rendered from the recorded traces: harness ground truth and what Nav2 reported, on separate lanes.",
  others: {
    kicker: "TWO MORE REAL RUNS / 003",
    title: "A run with no violation, and a planted bug.",
    cards: [
      {
        artifact: "nav2Nominal",
        label: `${EVIDENCE_CLASS_LABELS["real-external-target"]} · ${EVIDENCE_CLASS_LABELS["expected-behavior"]}`,
        classes: ["real-external-target", evidenceClassOf(nav2Nominal.label)],
        title: "Nav2 drives around an obstacle",
        body: `An obstacle was inserted at ${nav2Nominal.faults[0].appliedAt.toFixed(1)} s. Nav2 replanned about once a second and reported ${nav2Nominal.result.status} at ${nav2Nominal.result.tS} s. No property violated. One run; reproduction was not measured.`,
        source: nav2Nominal.source,
      },
      {
        artifact: "toyPositiveControl",
        label: EVIDENCE_CLASS_LABELS[evidenceClassOf(toyPositiveControl.label)],
        classes: [evidenceClassOf(toyPositiveControl.label)],
        title: "A planted bug on our toy robot",
        body: `On our in-house toy robot, an obstacle plus a corrupted controller value drove the robot off its grid at step ${toyPositiveControl.verdict.t}. The toy is deterministic, so replay is exact: ${toyPositiveControl.reproduction.rate}. Minimization kept the ${toyPositiveControl.minimization.after} faults that applied out of ${toyPositiveControl.minimization.before} scheduled. We planted this bug; it is a check on the engine, not a discovery.`,
        source: toyPositiveControl.source,
      },
    ],
    /** Path to the broker and cross-system evidence (Research), with each section's own label. */
    more: {
      text: "Broker and cross-system testbed runs (experimental) are in the Labs research summary:",
      links: [
        { label: "MQTT integration", href: "/labs/research-summary#mqtt", note: `${EVIDENCE_CLASS_LABELS["harness-artifact"]} · no confirmed finding` },
        { label: "Cross-system testbed", href: "/labs/research-summary#cross-system-testbed", note: EVIDENCE_CLASS_LABELS["expected-behavior"] },
      ],
    },
  },
  /**
   * Caption script for a FUTURE Nav2 walkthrough video (30-60 s). NOT rendered: no Nav2 video
   * exists yet. Every cue restates a value from the walkthrough above.
   */
  captionScript: [
    { start: "00:00", end: "00:05", text: "A real run: Ordinum testing stock ROS 2 Nav2 in simulation." },
    { start: "00:05", end: "00:11", text: "The property: if Nav2 reports success, the robot must truly be within 0.35 m of the goal." },
    { start: "00:11", end: "00:18", text: "Ordinum injects faults: noise on the position transform at 4.40 s, reordered laser scans at 6.52 s." },
    { start: "00:18", end: "00:24", text: "At 11.61 s, Nav2 reports SUCCEEDED. Ground truth: 0.80 m from the goal." },
    { start: "00:24", end: "00:30", text: "The truth-vs-claimed check flags success_mismatch." },
    { start: "00:30", end: "00:37", text: "Re-run on 10 fresh seeds: 8 violate. Faults reduced from 4 to 2." },
    { start: "00:37", end: "00:43", text: "The scenario is saved as a regression case that re-runs on stored seeds." },
    { start: "00:43", end: "00:50", text: "Classified: the noise is physically unrealistic. A harness artifact, not a Nav2 defect." },
    { start: "00:50", end: "00:56", text: "Ordinum: find security failures before they reach the real world." },
  ],
  provenance: {
    kicker: "PROVENANCE / 004",
    title: "Provenance",
    body: `Read from the Ordinum product repository (private research branch ${PRODUCT_SOURCE.branch}). ${FACT_SOURCE.artifactsNote} The original HTML reports can be downloaded from the evidence package.`,
    evidenceLink: { label: "Evidence package", href: "/evidence/nav2-success-mismatch" },
    files: [
      sm.source,
      ...sm.traceSources,
      sm.metaSource,
      sm.regressionCase,
      nav2Nominal.source,
      toyPositiveControl.source,
    ],
  },
  /**
   * Future recorded walkthrough video + hosted original reports (RecordedMediaSlot). Off: no
   * video exists and publishing the reports needs separate founder authorization. Never point a
   * source at a file that does not exist.
   */
  media: {
    enabled: false,
    video: null,
    reports: null,
  },
} as const satisfies {
  intro: { kicker: string; title: string; lede: string };
  walkthrough: typeof demoWalkthrough;
  midCta: { primary: Link };
  caseStudy: Link;
  pilot: Link;
  fullTrace: { kicker: string; title: string; titleMuted: string };
  timelineNote: string;
  others: {
    kicker: string;
    title: string;
    cards: readonly {
      artifact: string;
      label: string;
      classes: readonly EvidenceClass[];
      title: string;
      body: string;
      source: string;
    }[];
    more: { text: string; links: readonly { label: string; href: string; note: string }[] };
  };
  captionScript: readonly CaptionCue[];
  provenance: { kicker: string; title: string; body: string; evidenceLink: Link; files: readonly string[] };
  media: {
    enabled: boolean;
    video: null | { src: string; captionsSrc: string; poster?: string; title: string };
    reports: null | readonly { label: string; href: string }[];
  };
};

/* -------------------------------------------------------------------------- */
/* Seven-stage lifecycle (/products#lifecycle)                                 */
/* -------------------------------------------------------------------------- */

export type LifecycleStageId = "define" | "generate" | "execute" | "observe" | "verify" | "reproduce" | "regress";

export type LifecycleStage = {
  readonly n: string;
  readonly id: LifecycleStageId;
  /** One-word label for compact diagrams. */
  readonly short: string;
  readonly title: string;
  readonly body: string;
  /** What this stage hands to the next. */
  readonly artifact: { readonly name: string; readonly detail: string };
  /** What exists in the engine today for this stage. */
  readonly today: string;
  /** Which of the five workflow steps this belongs to. */
  readonly workflowStage: WorkflowStageId;
  readonly facts: readonly FactRef[];
};

export const lifecycle = {
  /** Anchor id on /products (moved back from /security). */
  id: "lifecycle",
  kicker: "INSIDE A RUN",
  /** The seven stages sit behind this disclosure, so /products stays compact. */
  disclosure: "Show the seven stages in full",
  title: "Seven stages,",
  titleMuted: "from a scenario to a kept test.",
  lede: "The workflow in full. What changes between targets is the adapter and the ground truth the checks rely on.",
  stages: [
    {
      n: "01",
      id: "define",
      short: "Define",
      title: "Define the system",
      body: "Connect the system through an adapter, and state the properties it must hold: what it must never do, and what it must eventually do.",
      artifact: {
        name: "System model + properties",
        detail: "An adapter, a fingerprint of the exact build, whether runs are deterministic, and the properties to check.",
      },
      today: "Every target connects through one episode-level contract and declares its properties and time model.",
      workflowStage: "connect",
      facts: ["B1"],
    },
    {
      n: "02",
      id: "generate",
      short: "Generate",
      title: "Generate scenarios",
      body: "Compose tasks and faults, each scheduled at a point in time or on an event inside the system.",
      artifact: {
        name: "Scenarios + fault schedules",
        detail: "Tasks paired with faults, each timed by clock or triggered by an event the system reports.",
      },
      today: "Five search strategies, from a scripted catalog and random to feedback-guided, with checkpoint and resume.",
      workflowStage: "run",
      facts: ["B11"],
    },
    {
      n: "03",
      id: "execute",
      short: "Execute",
      title: "Execute and inject faults",
      body: "Run each scenario under supervision, with deadlines and isolation, and inject faults at the boundaries between components.",
      artifact: {
        name: "Runs",
        detail: "One supervised execution per scenario, each ending in a recorded outcome.",
      },
      today: "Each run ends as pass, fail, timeout, hang, crash or infrastructure error. Infrastructure errors are never findings.",
      workflowStage: "run",
      facts: ["B3"],
    },
    {
      n: "04",
      id: "observe",
      short: "Observe",
      title: "Observe behavior",
      body: "Record what the system reported about itself and, separately, what actually happened.",
      artifact: {
        name: "Two-channel trace",
        detail: "What the system reported, and separately what the harness recorded (ground truth).",
      },
      today: "The search reads only what the system reports; only the checks read ground truth. Tests enforce the split.",
      workflowStage: "run",
      facts: ["B2"],
    },
    {
      n: "05",
      id: "verify",
      short: "Verify",
      title: "Verify failures",
      body: "A checker separate from the search judges each property against ground truth. Ambiguous evidence is marked Unresolved, never a failure.",
      artifact: {
        name: "Verdicts",
        detail: "Pass, fail or Unresolved per property. A failure still has to be classified.",
      },
      today: "Three-valued verdicts in the core; causal (happened-before) checks for the cross-system testbed.",
      workflowStage: "run",
      facts: ["B4", "B10"],
    },
    {
      n: "06",
      id: "reproduce",
      short: "Reproduce",
      title: "Reproduce and minimize",
      body: "Re-run the failure to measure how reliably it recurs, then cut the fault schedule down to what still triggers it.",
      artifact: {
        name: "Reproduction rate + reduced schedule",
        detail: "An exact trace-hash match, or a measured rate with an interval, plus a reduced fault schedule (not guaranteed to be the smallest).",
      },
      today: "Exact replay on deterministic targets; a measured rate on the rest. Delta debugging toward a 1-minimal schedule.",
      workflowStage: "reproduce",
      facts: ["B6", "B7"],
    },
    {
      n: "07",
      id: "regress",
      short: "Regress",
      title: "Keep it as a test",
      body: "Keep each reproduced failure as a test that re-runs against new builds: it first asserts the failure still occurs, and after a fix it is flipped to check that the failure stays gone.",
      artifact: {
        name: "Regression case",
        detail: "A self-contained case: scenario, build fingerprint, property and replay data.",
      },
      today: "Each failure is saved as a JSON case; ordinum ci replays saved cases locally.",
      workflowStage: "regress",
      facts: ["B8", "A9"],
    },
  ],
} as const satisfies {
  id: string;
  kicker: string;
  disclosure: string;
  title: string;
  titleMuted: string;
  lede: string;
  stages: readonly LifecycleStage[];
};

/* -------------------------------------------------------------------------- */
/* Products: platform overview (/products) and the three product-area pages               */
/* -------------------------------------------------------------------------- */

export type ProductOutputId = "report" | "timeline" | "verdict" | "reproduction" | "reduced" | "regression";

export type ProductOutput = {
  readonly id: ProductOutputId;
  readonly title: string;
  /** Plain-English description. */
  readonly plain: string;
  /** The same output in the real Nav2 run (from lib/evidence.ts). */
  readonly example: string;
  readonly facts: readonly FactRef[];
};

export type Capability = {
  readonly name: string;
  readonly command?: string;
  readonly maturity: Maturity;
  readonly note?: string;
  readonly body: string;
};

/**
 * /products: one workflow (#how-it-works, redirect target), one shared engine (#engine), delivery
 * (#delivery), commands, outputs, and a compact "how a run works" (#architecture, #lifecycle,
 * #reproduction, moved here from /security; /technology redirects to #architecture).
 */
export const platform = {
  howItWorks: {
    id: "how-it-works",
    kicker: "HOW IT WORKS / 001",
    title: "One workflow",
    titleMuted: "for every system.",
    lede: "What changes between systems is the adapter that connects them and the rules they must obey.",
  },
  engine: {
    id: "engine",
    kicker: "ONE ENGINE / 002",
    title: "One shared engine",
    titleMuted: "behind every product area.",
    lede: "Each product area is the same engine with a different adapter and different rules. Fix verification works the same way on a database, an agent or a simulated robot.",
  },
  delivery: {
    id: "delivery",
    kicker: "DELIVERY / 003",
    title: "Runs on your machines.",
    titleMuted: "Guided by the founders.",
    items: delivery.items,
    local: delivery.local,
  },
  capabilities: {
    id: "capabilities",
    kicker: "COMMANDS / 004",
    title: "Find, confirm, reduce,",
    titleMuted: "verify the fix.",
    lede: "The engine and CLI at the stable checkpoint 768a9b5.",
    items: [
      {
        name: "Search",
        command: "fuzz",
        maturity: "validated",
        body: "Runs campaigns of seeded scenarios with timed faults: a scripted catalog, random search or feedback-guided search.",
      },
      {
        name: "Confirmation",
        command: "confirm",
        maturity: "validated",
        body: "Re-runs a violation to check that it recurs before it is reported.",
      },
      {
        name: "Minimization",
        command: "minimize",
        maturity: "validated",
        body: "Delta debugging toward a 1-minimal fault schedule. Not guaranteed to be the smallest possible.",
      },
      {
        name: "Replay",
        command: "replay",
        maturity: "validated",
        body: "Exact replay on deterministic targets; a measured reproduction rate on the rest.",
      },
      {
        name: "Build comparison",
        command: "compare",
        maturity: "experimental",
        body: "Runs a failure against the failing build and the fixed build, and tests the difference statistically.",
      },
      {
        name: "Fix verification",
        command: "verify",
        maturity: "experimental",
        note: "planted defects only",
        body: "Returns FIX_VERIFIED only if every confirmed violation is gone on the fixed build and each required property was actually exercised, so a pass that never tested anything does not count.",
      },
      {
        name: "Regression runs",
        command: "ci",
        maturity: "experimental",
        note: "local",
        body: "Replays saved regression cases on your machine.",
      },
      {
        name: "Reports",
        maturity: "validated",
        body: "Self-contained HTML reports, plus Markdown and JSON reports for fix verification.",
      },
    ],
    ciStatus: HOSTED_CI_STATUS,
  },
  outputs: {
    id: "outputs",
    kicker: "WHAT YOU GET / 005",
    title: "Evidence you can act on.",
    lede: "For each reproduced failure. Examples are from the Nav2 run in the walkthrough.",
    items: [
      {
        id: "report",
        title: "Failure report",
        plain: "One HTML page: what ran, what failed, and the original scenario next to the reduced one.",
        example: "nav2_success_mismatch_compare.html, in the Nav2 evidence package.",
        facts: ["B9"],
      },
      {
        id: "timeline",
        title: "Trace timeline",
        plain: "Every event of the run, with what the system said kept apart from what actually happened.",
        example: `Faults at 4.40 s and 6.52 s; Nav2 reported ${sm.minimized.result.status} at ${sm.minimized.result.tS} s.`,
        facts: ["B2", "B9"],
      },
      {
        id: "verdict",
        title: "Verdict",
        plain: "Which rule failed, when, and the measured values behind it, decided on ground truth.",
        example: `${sm.verdict.invariant}: reported success, true pose ${sm.verdict.distanceText} from the goal.`,
        facts: ["B2", "B4"],
      },
      {
        id: "reproduction",
        title: "Reproduction rate",
        plain: "How reliably the failure recurs: an exact match on deterministic systems, a measured rate on the rest.",
        example: `${sm.reproduction.rate} on fresh seeds (${sm.reproduction.wilson95Text}).`,
        facts: ["B7"],
      },
      {
        id: "reduced",
        title: "Reduced scenario",
        plain: "The fault schedule cut down to what still triggers the failure.",
        example: `${sm.minimization.before} faults reduced to ${sm.minimization.after}; time cap reached.`,
        facts: ["B6"],
      },
      {
        id: "regression",
        title: "Regression case",
        plain: "A JSON test that re-runs the failure scenario against future builds.",
        example: `${sm.failureId}.json.`,
        facts: ["B8"],
      },
    ],
    reportNote: "Report preview rendered from the real run. The original files are in the evidence package.",
    links: [
      { label: "The full run, step by step", href: "/demos/nav2-walkthrough" },
      { label: "Evidence package", href: "/evidence/nav2-success-mismatch" },
    ],
  },
  cta: {
    title: "See whether Ordinum fits your system.",
    body: "We start with a short discussion and a demo, then agree on a suitable system and testing scope with you.",
    primary: PRIMARY_CTA,
    secondary: WATCH_DEMO,
  },
} as const satisfies {
  howItWorks: { id: string; kicker: string; title: string; titleMuted: string; lede: string };
  engine: { id: string; kicker: string; title: string; titleMuted: string; lede: string };
  delivery: {
    id: string;
    kicker: string;
    title: string;
    titleMuted: string;
    items: readonly { term: string; detail: string }[];
    local: string;
  };
  capabilities: {
    id: string;
    kicker: string;
    title: string;
    titleMuted: string;
    lede: string;
    items: readonly Capability[];
    ciStatus: string;
  };
  outputs: {
    id: string;
    kicker: string;
    title: string;
    lede: string;
    items: readonly ProductOutput[];
    reportNote: string;
    links: readonly Link[];
  };
  cta: { title: string; body: string; primary: Link; secondary: Link };
};

/** Kept for the report preview and the outputs grid (same shape as before). */
export const product = { outputs: platform.outputs } as const;

/* ------------------------------ product-area pages ------------------------------ */

export type ProductAreaKey = "software" | "agents" | "robotics" | "transactions";

/** One lane of a sequence diagram. */
export type SequenceActor = { readonly id: string; readonly label: string };

/** One message. `from === to` draws a self-note. Tone: info, fault (disturbance), violation (orange), verdict. */
export type SequenceStep = {
  readonly from: string;
  readonly to: string;
  readonly label: string;
  readonly tone: "info" | "fault" | "violation" | "verdict";
};

export type SequenceDiagramCopy = {
  readonly title: string;
  /** true = CONCEPTUAL tag. false = built from a real artifact, which `source` must cite. */
  readonly conceptual: boolean;
  readonly ariaLabel: string;
  readonly caption: string;
  readonly source?: string;
  readonly actors: readonly SequenceActor[];
  readonly steps: readonly SequenceStep[];
};

/** One supported integration on a product page, with its own maturity label, channel and limits. */
export type ProductSupport = {
  readonly id: string;
  readonly name: string;
  readonly maturity: Maturity;
  readonly maturityNote: string;
  /** Stable checkpoint or release candidate. */
  readonly channel: Channel;
  readonly body: string;
  readonly limits?: readonly string[];
  readonly link?: Link;
};

/** The example visual on a product page. "sequence" uses `example.sequence`. */
export type ProductVisual = "beforeAfter" | "goalPlot" | "sequence";

/**
 * Product-area page template. Each page answers, in order: who is this for and which failures it
 * tests; one concrete example failure with one visual; what you connect; what Ordinum runs; the
 * evidence you get; what works today (stable vs release candidate); and how to evaluate it.
 */
export type ProductArea = {
  readonly key: ProductAreaKey;
  readonly maturity: Maturity;
  readonly maturityNote: string;
  /** Optional: what is built today vs the vision (AI agent security). */
  readonly scope?: {
    readonly kicker: string;
    readonly title: string;
    readonly items: readonly { readonly id: string; readonly status: LoopStatus; readonly title: string; readonly body: string }[];
  };
  /** `body` is a target audience, never a customer claim. */
  readonly who: { readonly kicker: string; readonly title: string; readonly titleMuted?: string; readonly body: string; readonly failures: readonly string[] };
  readonly example: {
    readonly kicker: string;
    readonly title: string;
    readonly titleMuted?: string;
    readonly body: string;
    /** Evidence label shown with the example (planted, real, reference application...). */
    readonly label?: string;
    readonly visual: ProductVisual;
    /** Optional short steps beside the visual (robotics: from demoWalkthrough). */
    readonly steps?: readonly { readonly label: string; readonly text: string }[];
    readonly sequence?: SequenceDiagramCopy;
    readonly links: readonly Link[];
  };
  readonly connect: { readonly kicker: string; readonly title: string; readonly items: readonly { readonly term: string; readonly detail: string }[] };
  readonly runs: { readonly kicker: string; readonly title: string; readonly items: readonly { readonly term: string; readonly detail: string }[] };
  readonly outputs: { readonly kicker: string; readonly title: string; readonly items: readonly { readonly name: string; readonly detail: string }[] };
  readonly today: { readonly kicker: string; readonly title: string; readonly titleMuted?: string; readonly items: readonly ProductSupport[]; readonly notYet: readonly string[] };
  readonly evaluate: { readonly kicker: string; readonly title: string; readonly links: readonly Link[] };
  readonly cta: { readonly title: string; readonly body: string; readonly primary: Link; readonly secondary?: Link };
};

/** How an evaluation runs (founder decision, 1 November 2026). No install commands, no promised access. */
export const EVALUATE_STEPS = [
  "Request an evaluation. Tell us about the system and the failure you care about.",
  "We start with a short discussion and a demo.",
  "Then we agree on a suitable system and testing scope with you.",
] as const;
export const EVALUATE_NOTE = delivery.short;

const fixLink = { label: "Evidence package: PocketBase verified fix", href: "/evidence/pocketbase-verified-fix" } as const;
const fixArticle = { label: "Case study: from a failed authorization test to a verified fix", href: "/labs/from-failed-authorization-test-to-verified-fix" } as const;
const nav2Article = { label: "Case study: what a robot's success message can hide", href: "/labs/what-a-robots-success-message-can-hide" } as const;
const agentArticle = { label: "Case study: Ordinum found a bug in our own reference agent", href: "/labs/ordinum-found-a-bug-in-our-own-reference-agent" } as const;
const agentEvidence = { label: "Evidence package: reference agent cancel bug", href: "/evidence/agent-reference-cancel" } as const;
const summaryArticle = { label: "Research summary: what we've measured", href: "/labs/research-summary" } as const;
const walkStep = (id: DemoStepId) => {
  const step = demoWalkthrough.steps.find((s) => s.id === id);
  if (!step) throw new Error(`Unknown walkthrough step: ${id}`);
  return { label: step.label, text: step.short };
};

export const productAreas = {
  software: {
    key: "software",
    maturity: "experimental",
    maturityNote: "PocketBase · one host",
    who: {
      kicker: "WHO IT IS FOR / 001",
      title: "Teams that own a service",
      titleMuted: "with access rules.",
      body: "For teams running a service with access rules, many clients at once, and permissions that change while requests are in flight.",
      failures: [
        "Stale permissions: a client still reads records after its access changed (read_authz).",
        "Clients see data that disagrees with a reference model (model_agreement).",
        "Lost updates: concurrent writes that silently overwrite each other.",
      ],
    },
    example: {
      kicker: "EXAMPLE FAILURE / 002",
      title: "A stale cache",
      titleMuted: "that leaked reads.",
      body: "We planted a stale read cache in our own client path for unmodified PocketBase 0.40.6. Ordinum found the forbidden reads, confirmed them 5/5 and reduced them to one fault. The engineer removed the cache, and ordinum verify returned FIX_VERIFIED.",
      visual: "beforeAfter",
      links: [WATCH_DEMO, fixLink],
    },
    connect: {
      kicker: "WHAT YOU CONNECT / 003",
      title: "Your service, an adapter and the rules.",
      items: [
        { term: "The service", detail: "A build you can start locally." },
        { term: "An adapter", detail: "Starts the service, drives clients and records what really happened." },
        { term: "Policy and workload", detail: "Who may read and write what, and the client traffic to run." },
        { term: "Two builds", detail: "The failing build and the build with your fix." },
      ],
    },
    runs: {
      kicker: "WHAT ORDINUM RUNS / 004",
      title: "Many clients, timed faults, ground-truth checks.",
      items: [
        { term: "Workload", detail: "Seeded client traffic, reading and writing at once under your access policy." },
        { term: "Faults", detail: "Timed faults declared by the adapter, scheduled against requests in flight." },
        { term: "Checks", detail: "read_authz and model_agreement, judged on what the service actually returned." },
        { term: "Fix verification", detail: "ordinum verify compares the failing and fixed builds and requires each property to be exercised." },
      ],
    },
    outputs: {
      kicker: "EVIDENCE YOU GET / 005",
      title: "What the PocketBase run produced.",
      items: [
        { name: "Verdict", detail: "FIX_VERIFIED from ordinum verify." },
        { name: "Build comparison", detail: "Violations in 10/10 runs on the failing build, 0/10 on the fixed build." },
        { name: "Property exercise", detail: "read_authz exercised in 100/100 runs on each build." },
        { name: "Regression cases", detail: "Two JSON cases and reports; ordinum ci: 2 PASS." },
      ],
    },
    today: {
      kicker: "WHAT WORKS TODAY / 006",
      title: "PocketBase works today.",
      titleMuted: "Other services need an adapter.",
      items: [
        {
          id: "pocketbase",
          name: "PocketBase 0.40.6 adapter",
          maturity: "experimental",
          maturityNote: "one host",
          channel: "stable",
          body: "Unmodified PocketBase, binary pinned by SHA-256, under our own policy and workload. No Docker needed. Ordinum also reproduced a lost update, a class the PocketBase maintainers already acknowledge: reproduced, not discovered.",
        },
      ],
      notYet: [
        "Every FIX_VERIFIED result so far is on a defect we planted.",
        "No new third-party vulnerability found.",
        "Ten runs per build is a statistical comparison, not a proof.",
      ],
    },
    evaluate: {
      kicker: "HOW TO EVALUATE / 007",
      title: "Start with one service and one rule.",
      links: [fixArticle, summaryArticle],
    },
    cta: {
      title: "Have an access rule that fails only under load?",
      body: "Request an evaluation and tell us about the service and the failure.",
      primary: PRIMARY_CTA,
      secondary: WATCH_DEMO,
    },
  },

  agents: {
    key: "agents",
    maturity: "experimental",
    maturityNote: "our reference applications",
    scope: {
      kicker: "TWO MEANINGS",
      title: "Testing agents is built. Agents doing security work is the vision.",
      items: [
        {
          id: "testing-agents",
          status: "today",
          title: "A. Testing the security of AI agents",
          body: "Ordinum checks what an agent does with its tools, credentials and permissions, including after they change or a task is cancelled. Built, and tested on our own reference applications.",
        },
        {
          id: "agents-doing-security",
          status: "planned",
          title: "B. Agents that do security work",
          body: "Agents that build test harnesses, choose techniques and propose fixes inside Ordinum. Planned: today only an interface for seed suggestions is in development, and there is no language model in the loop.",
        },
      ],
    },
    who: {
      kicker: "WHO IT IS FOR / 001",
      title: "Teams giving agents",
      titleMuted: "tools and write access.",
      body: "For teams whose agents call tools, delegate to sub-agents, hold credentials or change real records.",
      failures: [
        "A retried call that runs on the old authorization instead of the current one.",
        "Cancel not honored: work keeps running after a cancel.",
        "Stale authorization: an action allowed by a permission that was already revoked.",
        "A change outside the agent's permissions, as recorded by the harness.",
      ],
    },
    example: {
      kicker: "EXAMPLE FAILURE / 002",
      title: "A cancel that missed",
      titleMuted: "an in-flight call.",
      body: "While checking a planted defect, Ordinum found a real bug in the hardened build of our own reference agent: cancelling delegated work did not reach a sub-agent call already in flight. Confirmed 5/5, then fixed test-first.",
      label: "Our own reference application · real, unplanted bug · release candidate",
      visual: "sequence",
      sequence: {
        title: "A cancel that missed an in-flight call",
        conceptual: true,
        ariaLabel:
          "Simplified sequence of the finding: Ordinum starts a task; the agent delegates work to a sub-agent, which starts a tool call; Ordinum cancels the delegated work; the cancel does not reach the call already in flight; the call still runs; the check flags stale_authorization_on_retry_or_cancel.",
        caption: "Simplified from the finding in our own reference agent. Not a recorded trace.",
        actors: [
          { id: "engine", label: "Ordinum" },
          { id: "agent", label: "Agent (hardened)" },
          { id: "sub", label: "Sub-agent" },
          { id: "check", label: "Checks" },
        ],
        steps: [
          { from: "engine", to: "agent", label: "Start task", tone: "info" },
          { from: "agent", to: "sub", label: "Delegate work", tone: "info" },
          { from: "sub", to: "sub", label: "Tool call in flight", tone: "info" },
          { from: "engine", to: "agent", label: "Cancel delegated work", tone: "fault" },
          { from: "sub", to: "check", label: "Call still runs after cancel", tone: "violation" },
          { from: "check", to: "engine", label: "stale_authorization_on_retry_or_cancel", tone: "verdict" },
        ],
      },
      links: [agentArticle, agentEvidence],
    },
    connect: {
      kicker: "WHAT YOU CONNECT / 003",
      title: "Your agent, its tools and its permissions.",
      items: [
        { term: "The agent", detail: "Its tool calls run through ordinum.agents, which records each call and its effect." },
        { term: "Resources", detail: "The files, records or services it can touch." },
        { term: "Permissions", detail: "What it may do, and when that changes." },
      ],
    },
    runs: {
      kicker: "WHAT ORDINUM RUNS / 004",
      title: "Tasks, cancels and permission changes.",
      items: [
        { term: "Scenarios", detail: "Agent tasks with tool calls, delegation, retries and cancels." },
        { term: "Faults", detail: "Permission changes and cancels, timed against calls already in flight." },
        { term: "Checks", detail: "Rules such as stale_authorization_on_retry_or_cancel, judged on what the harness recorded." },
        { term: "Fix verification", detail: "A defective build and a fixed build compared run by run." },
      ],
    },
    outputs: {
      kicker: "EVIDENCE YOU GET / 005",
      title: "Verdicts and regression cases.",
      items: [
        { name: "Verdicts", detail: "Pass, fail or Unresolved for each rule." },
        { name: "Reduced failures", detail: "Each failure confirmed and cut down to its cause." },
        { name: "Regression cases", detail: "JSON cases that replay with ordinum ci." },
      ],
    },
    today: {
      kicker: "WHAT WORKS TODAY / 006",
      title: "Our own reference applications.",
      titleMuted: "No third-party agent tested.",
      items: [
        {
          id: "agent-reference",
          name: "Agent reference application (ours)",
          maturity: "experimental",
          maturityNote: "9 planted defects",
          channel: "rc",
          body: "Every planted case passes as fixed on the fixed build (9/9 PASS FIXED), and ordinum ci replays them: 9 PASS.",
        },
        {
          id: "agent-real-bug",
          name: "A real bug in our hardened build",
          maturity: "experimental",
          maturityNote: "our own application",
          channel: "rc",
          body: "Unplanted: a cancel of delegated work missed an in-flight sub-agent call. Confirmed 5/5, fixed test-first in commit 9a70c5c.",
          link: { label: "Read the case study", href: agentArticle.href },
        },
        {
          id: "local-model",
          name: "A local-model agent",
          maturity: "experimental",
          maturityNote: "one small model",
          channel: "rc",
          body: "qwen2.5:1.5b through Ollama and LangGraph: PASS FIXED, violations in 14/20 runs before the fix and 0/20 after. A strict re-recording is still to do.",
        },
      ],
      notYet: [
        "No third-party agent application has been tested.",
        "After the fix, the strict verdict for the reference agent is CANNOT_VERIFY: evidence for sibling defects was inconclusive.",
        "No network isolation is claimed for the agents kit.",
      ],
    },
    evaluate: {
      kicker: "HOW TO EVALUATE / 007",
      title: "Start with one agent and one rule.",
      links: [agentArticle, summaryArticle],
    },
    cta: {
      title: "Giving agents real permissions?",
      body: "Request an evaluation and tell us what your agents can touch.",
      primary: PRIMARY_CTA,
      secondary: WATCH_DEMO,
    },
  },

  robotics: {
    key: "robotics",
    maturity: "validated",
    maturityNote: "Nav2 · simulation only",
    who: {
      kicker: "WHO IT IS FOR / 001",
      title: "Teams building robots",
      titleMuted: "and connected devices.",
      body: "For teams building ROS 2 robots, fleets or devices that talk through message brokers.",
      failures: [
        "False success: the robot reports it arrived, but it is not at the goal.",
        "Collisions, speeding, getting stuck.",
        "Duplicate or forbidden MQTT deliveries, lost session messages.",
        "A command that actuates twice, or after an emergency stop.",
      ],
    },
    example: {
      kicker: "EXAMPLE FAILURE / 002",
      title: "Nav2 said it arrived.",
      titleMuted: `The robot was ${sm.verdict.distanceText} off.`,
      body: "Stock Nav2 in simulation, under injected faults. We traced the mismatch to our own unrealistic transform noise: a harness artifact, not a Nav2 defect.",
      visual: "goalPlot",
      steps: [walkStep("property"), walkStep("observed"), walkStep("verdict"), walkStep("reproduction")],
      links: [
        { label: "Step through the run", href: "/demos/nav2-walkthrough" },
        { label: "Evidence package: Nav2 success mismatch", href: "/evidence/nav2-success-mismatch" },
      ],
    },
    connect: {
      kicker: "WHAT YOU CONNECT / 003",
      title: "Your stack, its ground truth and the faults.",
      items: [
        { term: "The stack", detail: "A containerized ROS 2 stack, an MQTT broker, or a set of processes." },
        { term: "Ground truth", detail: "What really happened, such as the simulator's true robot pose." },
        { term: "Faults and rules", detail: "Delays, drops, noise and restarts, and the rules that must still hold." },
      ],
    },
    runs: {
      kicker: "WHAT ORDINUM RUNS / 004",
      title: "Seeded tasks, injected faults, true-pose checks.",
      items: [
        { term: "Scenarios", detail: "Navigation tasks, broker sessions or command sequences, each seeded." },
        { term: "Faults", detail: "Twelve Nav2 fault kinds (delayed, dropped, noisy or reordered messages and more), plus broker restarts and process kills." },
        { term: "Checks", detail: "Seven Nav2 properties per run, such as success_mismatch, judged on the simulator's true pose." },
        { term: "Reproduction", detail: "Statistical: re-runs on fresh seeds, reported as k of N with an interval." },
      ],
    },
    outputs: {
      kicker: "EVIDENCE YOU GET / 005",
      title: "What the Nav2 run produced.",
      items: [
        { name: "Reduced scenario", detail: `${sm.minimization.before} faults cut to ${sm.minimization.after} (time cap reached).` },
        { name: "Trace and report", detail: "Reported and true values side by side, in an HTML report." },
        { name: "Regression case", detail: `A JSON case that re-checks ${sm.regressionVerify.storedSeeds} stored seeds.` },
      ],
    },
    today: {
      kicker: "WHAT WORKS TODAY / 006",
      title: "Nav2 in simulation is validated.",
      titleMuted: "Brokers and the testbed are experimental.",
      items: [
        {
          id: "nav2",
          name: "ROS 2 / Nav2",
          maturity: "validated",
          maturityNote: "simulation only",
          channel: "stable",
          body: "Stock Nav2 1.3.13 on ROS 2 Jazzy, on a simplified simulator with no physics. A pilot reproduced three violations; all three were our own harness, oracle or configuration artifacts.",
          link: nav2Article,
        },
        {
          id: "mqtt",
          name: "MQTT: Mosquitto with a NanoMQ edge bridge",
          maturity: "experimental",
          maturityNote: "bridge on by default",
          channel: "stable",
          body: `${MQTT_SETUP.config} ${MQTT_SETUP.results}`,
          limits: MQTT_SETUP.limits,
          link: { label: "MQTT results in the research summary", href: "/labs/research-summary#mqtt" },
        },
        {
          id: "testbed",
          name: "Four-process testbed",
          maturity: "experimental",
          maturityNote: "our own system",
          channel: "stable",
          body: "Four processes we built that model a command path to a device, checked against four written policy clauses. A planted-defect build shows the checks catch a violation.",
          link: { label: "Evidence package: testbed planted control", href: "/evidence/testbed-planted-control" },
        },
      ],
      notYet: ["Nothing runs on physical hardware or emulated firmware yet.", "Nav2 and MQTT are reproduced statistically, not replayed exactly."],
    },
    evaluate: {
      kicker: "HOW TO EVALUATE / 007",
      title: "Start with one stack in simulation.",
      links: [nav2Article, summaryArticle],
    },
    cta: {
      title: "Building robots or connected devices?",
      body: "Request an evaluation and tell us about the failure between the cloud, the broker and the device.",
      primary: PRIMARY_CTA,
      secondary: WATCH_DEMO,
    },
  },

  transactions: {
    key: "transactions",
    maturity: "experimental",
    maturityNote: "reference application",
    who: {
      kicker: "WHO IT IS FOR / 001",
      title: "Teams building approvals,",
      titleMuted: "ledgers and payment logic.",
      body: "For teams whose systems approve, sign or record money movements, where one wrong approval is costly.",
      failures: [
        "An approval used for a different recipient than the one approved.",
        "A ledger that disagrees with the approvals behind it.",
        "A \"fix\" that passes only by rejecting everything.",
      ],
    },
    example: {
      kicker: "EXAMPLE FAILURE / 002",
      title: "An approval",
      titleMuted: "for a substituted recipient.",
      body: "In our own transaction reference application, a payment is approved for one recipient and the recipient is then swapped. The check flags any payment that settles without an approval for that exact recipient.",
      label: "Our own reference application · planted defects · test-only keys",
      visual: "sequence",
      sequence: {
        title: "An approval for a substituted recipient",
        conceptual: true,
        ariaLabel:
          "Conceptual sequence: a client requests approval for a payment to recipient A; the reference application approves it; the recipient is swapped to B; the payment to B settles; the check flags a payment without an approval for its recipient.",
        caption: "Conceptual. The reference application is ours; it is not real payment software.",
        actors: [
          { id: "client", label: "Client" },
          { id: "app", label: "Reference app (ours)" },
          { id: "engine", label: "Ordinum" },
          { id: "check", label: "Checks" },
        ],
        steps: [
          { from: "client", to: "app", label: "Request approval: pay A", tone: "info" },
          { from: "app", to: "client", label: "Approved for A", tone: "info" },
          { from: "engine", to: "app", label: "Recipient swapped to B", tone: "fault" },
          { from: "app", to: "check", label: "Payment to B settles", tone: "violation" },
          { from: "check", to: "engine", label: "No approval for B", tone: "verdict" },
        ],
      },
      links: [{ label: "How fix verification works", href: "/products#how-it-works" }],
    },
    connect: {
      kicker: "WHAT YOU CONNECT / 003",
      title: "Your application, its rules and two builds.",
      items: [
        { term: "The application", detail: "A build you can start locally, with test-only keys." },
        { term: "Rules", detail: "What an approval allows, and what the ledger must agree with." },
        { term: "Two builds", detail: "The failing build and the build with your fix." },
      ],
    },
    runs: {
      kicker: "WHAT ORDINUM RUNS / 004",
      title: "Approval flows, timed faults, ledger checks.",
      items: [
        { term: "Scenarios", detail: "Seeded approval and payment flows." },
        { term: "Faults", detail: "Timed faults declared by the adapter, such as a changed recipient." },
        { term: "Checks", detail: "Approval and ledger rules, judged on what the application recorded." },
        { term: "Fix verification", detail: "The failing and fixed builds compared run by run. A fix has to keep the rules working, not just block traffic." },
      ],
    },
    outputs: {
      kicker: "EVIDENCE YOU GET / 005",
      title: "Verdicts, comparisons and regression cases.",
      items: [
        { name: "Verdicts", detail: "FIXED or NOT_FIXED for each planted defect." },
        { name: "Build comparison", detail: "Violations on the failing build vs the fixed build." },
        { name: "Regression cases", detail: "JSON cases; ordinum ci: 4 PASS." },
      ],
    },
    today: {
      kicker: "WHAT WORKS TODAY / 006",
      title: "Our own reference application.",
      titleMuted: "Not real payment software.",
      items: [
        {
          id: "transaction-reference",
          name: "Transaction reference application (ours)",
          maturity: "experimental",
          maturityNote: "planted defects · test-only keys",
          channel: "rc",
          body: "3 planted approval and ledger defects, each fix-verified. A fake fix that rejected every transaction was not accepted: NOT_FIXED in 10/10 runs. ordinum ci: 4 PASS.",
        },
      ],
      notYet: [
        "No real payment, banking or ledger software has been tested.",
        "Test-only keys: nothing touches real money.",
        "Release candidate only; not in the stable checkpoint.",
      ],
    },
    evaluate: {
      kicker: "HOW TO EVALUATE / 007",
      title: "Start with one approval rule.",
      links: [summaryArticle],
    },
    cta: {
      title: "Building approval or ledger logic?",
      body: "Request an evaluation and tell us which rule must never break.",
      primary: PRIMARY_CTA,
      secondary: WATCH_DEMO,
    },
  },
} as const satisfies Record<ProductAreaKey, ProductArea>;

/* -------------------------------------------------------------------------- */
/* Roadmap (/roadmap)                                                          */
/* -------------------------------------------------------------------------- */

export type RoadmapItem = { readonly name: string; readonly maturity: Maturity; readonly body: string };

/** In progress and planned work. Transactions moved to /products/transactions (reference application). */
export const roadmap = {
  items: {
    kicker: "NEXT / 001",
    title: "Firmware, hardware,",
    titleMuted: "and pipeline CI.",
    lede: "In progress means partly built and not usable yet. Planned means not started.",
    list: [
      { name: "CI for your pipeline", maturity: "in-progress", body: HOSTED_CI_STATUS },
      { name: "Native fuzzing", maturity: "planned", body: "Fuzzing native code and binaries." },
      { name: "Emulated firmware", maturity: "planned", body: "Firmware under emulation, with the same checks." },
      { name: "Device transport", maturity: "planned", body: "Driving real device links from the harness." },
      { name: "Physical hardware", maturity: "planned", body: "Hardware in the loop." },
    ],
  },
  loop: {
    id: "agentic-loop",
    kicker: "THE AGENTIC LOOP / 002",
  },
} as const satisfies {
  items: { kicker: string; title: string; titleMuted: string; lede: string; list: readonly RoadmapItem[] };
  loop: { id: string; kicker: string };
};

/* -------------------------------------------------------------------------- */
/* Demos (/demos)                                                              */
/* -------------------------------------------------------------------------- */

export type DemoCard = {
  readonly id: string;
  readonly title: string;
  readonly label: string;
  readonly classes: readonly EvidenceClass[];
  readonly body: string;
  readonly status: string;
  readonly stats?: readonly { readonly k: string; readonly v: string }[];
  readonly links: readonly Link[];
};

/* -------------------------------------------------------------------------- */
/* Flagship recording (public/media). Rendered from the real terminal logs of the run on        */
/* 1 November 2026 at product commit 768a9b5 (also published in /evidence/pocketbase-verified-fix). */
/* Replay speeds are shown on screen; text is the logged output with local paths replaced.       */
/* -------------------------------------------------------------------------- */

export const flagshipVideo = {
  title: "Failure to verified fix",
  duration: "1:35",
  recordedOn: "1 November 2026",
  commit: "768a9b5",
  label: "Recorded run · real terminal output · replayed at 20× and 4×",
  classification: FLAGSHIP_LABEL,
  mp4: "/media/flagship-failure-to-verified-fix.mp4",
  webm: "/media/flagship-failure-to-verified-fix.webm",
  poster: "/media/flagship-failure-to-verified-fix-poster.jpg",
  captions: "/media/flagship-failure-to-verified-fix.en.vtt",
  transcript: "/media/flagship-failure-to-verified-fix-transcript.txt",
} as const;

/**
 * /demos: the flagship recording first (in the page header, #demo-flagship), with a plain
 * explanation of the failure and the result; then the other runs as compact cards.
 */
export const demos = {
  flagship: {
    id: "flagship",
    title: "Failure to verified fix",
    failure: {
      label: "What failed",
      text: "We planted a stale read cache in our own client path for PocketBase 0.40.6, so clients could still read records the policy no longer allowed. Ordinum flagged it, confirmed it 5 of 5 times and showed that one fault is enough to trigger it.",
    },
    result: {
      label: "Result",
      text: `The engineer removed the cache. ordinum verify returned FIX_VERIFIED: violations in ${flagship.affected} vs ${flagship.fixed} runs, failing build vs fixed build.`,
    },
    links: [
      { label: "Evidence package", href: "/evidence/pocketbase-verified-fix" },
      { label: "Case study", href: "/labs/from-failed-authorization-test-to-verified-fix" },
    ],
  },
  others: {
    kicker: "MORE RUNS / 002",
    title: "A robot's false success,",
    titleMuted: "and a planted violation.",
    cards: [
      {
        id: "nav2",
        title: "Nav2 said it arrived",
        label: `${EVIDENCE_CLASS_LABELS["real-external-target"]} · ${EVIDENCE_CLASS_LABELS["harness-artifact"]}`,
        classes: ["real-external-target", "harness-artifact"],
        body: `Stock Nav2 reported ${sm.minimized.result.status} while the robot was ${sm.verdict.distanceText} from the goal. Reproduced ${sm.reproduction.rate}, then traced to our own fault configuration.`,
        status: "Interactive walkthrough",
        links: [
          { label: "Step through the run", href: "/demos/nav2-walkthrough" },
          { label: "Evidence package", href: "/evidence/nav2-success-mismatch" },
        ],
      },
      {
        id: "testbed",
        title: "A planted violation in our testbed",
        label: EVIDENCE_CLASS_LABELS["positive-control"],
        classes: ["positive-control"],
        body: "A defect we planted in our four-process testbed, to check that its policy checks catch it end to end.",
        status: "Report and regression case",
        links: [{ label: "Evidence package", href: "/evidence/testbed-planted-control" }],
      },
    ],
  },
} as const satisfies {
  flagship: {
    id: string;
    title: string;
    failure: { label: string; text: string };
    result: { label: string; text: string };
    links: readonly Link[];
  };
  others: { kicker: string; title: string; titleMuted: string; cards: readonly DemoCard[] };
};

/* -------------------------------------------------------------------------- */
/* Security (/security): network isolation, boundaries, and how a run works     */
/* -------------------------------------------------------------------------- */

export type BoundaryRow = { readonly id: string; readonly title: string; readonly body: string; readonly caveat?: string };

/** Network isolation, one row per integration (release fact list, 1 November 2026). The only place this is described. */
export type NetworkRow = { readonly integration: string; readonly isolation: string };

/**
 * /security: deployment (where runs execute and what they may target), data handling, network
 * isolation per integration (#network), operating limits, the hosted-CI fact and how to report a
 * concern. How a run works moved to /products (#architecture, #lifecycle, #reproduction).
 */
export const security = {
  deployment: {
    id: "deployment",
    kicker: "DEPLOYMENT / 001",
    title: "Runs on your machines.",
    titleMuted: "Only against systems you may test.",
    items: [
      { title: "Where it runs", body: "On the machines where you start it, as a CLI with Python integrations. There is no hosted service, dashboard or account, and no cloud execution." },
      { title: "What it may target", body: "Local simulations, our own reference targets, authorized open-source software, or systems you are authorized to test. It does not scan external systems or drive physical actuators." },
      { title: "Who runs it", body: "Evaluations are guided by the founders, on your machines. Ordinum does not change your code." },
    ],
  },
  data: {
    id: "data",
    kicker: "DATA HANDLING / 002",
    title: "Your results stay with you.",
    items: [
      { title: "Run data", body: "Traces, reports and regression cases are local files on your machines. Ordinum has no hosted service, so there is nowhere for it to upload them." },
      { title: "Evidence on this site", body: "Evidence packages come from our own runs. They were exported by the founders and scanned for local paths, usernames, hostnames, emails, tokens and keys." },
      { title: "The contact form", body: "Stores your work email and, if you give them, your company, what you are working on, your message, a category and a request type, with the time you sent it. Submissions are stored in Supabase and read by the founders." },
    ],
    privacy: { label: "Privacy Notice", href: "/privacy" },
    caveat: "Do not send us credentials, customer data or unpatched vulnerability details through the form.",
  },
  network: {
    id: "network",
    kicker: "NETWORK ISOLATION / 003",
    title: "Isolation depends",
    titleMuted: "on the integration.",
    rows: [
      { integration: "PocketBase", isolation: "Binds 127.0.0.1. You run it inside unshare -rn, a network namespace with loopback only." },
      { integration: "ROS 2 / Nav2", isolation: "Docker with --network none." },
      { integration: "MQTT brokers", isolation: "A Docker network per session. Broker ports are published on 127.0.0.1 only. The edge bridge reaches the cloud broker through a host-side proxy on that network's gateway address, which forwards only peers inside the session subnet. No egress firewall." },
      { integration: "Four-process testbed", isolation: "Unix sockets, inside unshare -rn when available. Otherwise an audit hook that restricts sockets and file writes; that is not a sandbox." },
      { integration: "Agents kit and reference applications", isolation: "No isolation claim." },
    ],
    notes: [
      "In an offline check, the workflow without Docker showed 0 non-local network events. Docker targets were not tested offline.",
      "None of this is an air gap.",
    ],
  },
  boundaries: {
    kicker: "OPERATING LIMITS / 004",
    title: "Permissions, resources",
    titleMuted: "and cleanup.",
    rows: [
      {
        id: "permissions",
        title: "Permissions",
        body: "The Nav2 container drops all Linux capabilities and sets no-new-privileges. Testbed components run as separate python -I processes.",
        caveat: "The Nav2 container runs as root, with capabilities dropped.",
      },
      {
        id: "resource-limits",
        title: "Resource limits",
        body: "Nav2 runs with a memory cap and a host memory guard. Each testbed component has resource limits (512 MiB address space, file and core limits). Infrastructure failures become INFRA_ERROR, never findings.",
      },
      {
        id: "cleanup",
        title: "Cleanup",
        body: "All four testbed components restart for every run. The Nav2 compatibility gate checks that no containers are left behind.",
      },
    ],
    sandbox: "These measures keep tests of authorized systems contained. They are not a sandbox for untrusted code.",
  },
  ci: {
    id: "ci",
    kicker: "HOSTED CI / 005",
    title: "What has run in CI.",
    body: HOSTED_CI_STATUS,
  },
  contact: {
    kicker: "REPORT A CONCERN / 006",
    title: "Report a security concern.",
    body: `Email ${site.email}. Describe the issue without credentials or unpatched details of third-party systems; we will reply with a safe way to share more.`,
    cta: { label: `Email ${site.email}`, href: `mailto:${site.email}` },
  },
} as const satisfies {
  deployment: { id: string; kicker: string; title: string; titleMuted: string; items: readonly { title: string; body: string }[] };
  data: { id: string; kicker: string; title: string; items: readonly { title: string; body: string }[]; privacy: Link; caveat: string };
  network: { id: string; kicker: string; title: string; titleMuted: string; rows: readonly NetworkRow[]; notes: readonly string[] };
  boundaries: { kicker: string; title: string; titleMuted: string; rows: readonly BoundaryRow[]; sandbox: string };
  ci: { id: string; kicker: string; title: string; body: string };
  contact: { kicker: string; title: string; body: string; cta: Link };
};

/* -------------------------------------------------------------------------- */
/* How a run works (/products #architecture, #lifecycle, #reproduction)         */
/* -------------------------------------------------------------------------- */

export type ArchitectureNode = {
  readonly name: string;
  readonly maturity: Maturity;
  readonly note?: string;
  readonly facts?: readonly FactRef[];
};

/** The 12 Nav2 fault kinds, exact names from src/ordinum/targets/nav2/mutations.py. */
export const NAV2_FAULT_KINDS = [
  "msg_delay",
  "msg_drop",
  "msg_duplicate",
  "msg_reorder",
  "msg_stale",
  "msg_noise",
  "msg_nan",
  "stamp_skew",
  "obstacle_insert",
  "lifecycle",
  "costmap_clear",
  "param_set",
] as const;

/** Nav2 invariants: seven per episode, plus a topology check once per campaign. */
export const NAV2_INVARIANTS = {
  perEpisode: [
    "no_collision_map",
    "no_collision_obstacle",
    "speed_limit",
    "success_mismatch",
    "motion_while_unsafe",
    "stuck",
    "liveness",
  ],
  perCampaign: ["cmd_vel publisher topology"],
} as const;

/** MQTT fault kinds, from docs/research/MQTT_TARGET.md (fault vocabulary table). */
export const MQTT_FAULT_KINDS = [
  "broker_restart",
  "bridge_down",
  "dynsec_change",
  "client_disconnect",
  "qos1_stall",
  "qos2_stall",
] as const;

/** Cross-system testbed fault kinds, from src/ordinum/targets/xsys/faults.py (three mechanisms). */
export const XSYS_FAULT_KINDS = {
  process: ["proc_kill", "proc_restart", "proc_term", "proc_pause", "clock_skew", "power_loss"],
  link: ["link_partition", "link_stall", "link_reset", "link_latency"],
  broker: ["msg_drop", "ack_lost", "msg_delay", "consumer_reorder", "redeliver_now"],
} as const;

/** The four written policy clauses of the cross-system testbed (docs/design/XSYS_POLICY.md). */
export const XSYS_POLICY_CLAUSES = [
  { id: "SEC-IDEM-1", text: "A single admitted command actuates the device at most once." },
  { id: "SEC-REVOKE-1", text: "No actuation after the revocation of the permission that authorized it." },
  { id: "SAFE-ESTOP-1", text: "No actuation while an emergency stop is latched." },
  { id: "REL-RECOVER-1", text: "Components taken down by a fault recover within a bounded time." },
] as const;

export const technology = {
  architecture: {
    /** /products #architecture (redirect target of /technology). */
    id: "architecture",
    kicker: "HOW A RUN WORKS / 006",
    title: "Adapters in,",
    titleMuted: "regression cases out.",
    lede: "Systems connect through adapters to one engine on your machine. The engine runs, checks and reduces failures, then saves them as cases you can replay.",
    tiers: [
      {
        id: "adapters",
        name: "Systems, through adapters",
        nodes: [
          { name: "ROS 2 / Nav2, in simulation", maturity: "validated", note: "Simulation only.", facts: ["A3"] },
          { name: "Toy robot (our own)", maturity: "validated", note: "Planted bugs as positive controls.", facts: ["A2"] },
          { name: "PocketBase 0.40.6, local", maturity: "experimental", note: "One host.", facts: ["release"] },
          { name: "Agent reference application (our own)", maturity: "experimental", note: "Release candidate. 9 planted defects.", facts: ["A37", "A41"] },
          { name: "Transaction reference application (our own)", maturity: "experimental", note: "Release candidate. Test-only keys.", facts: ["A38"] },
          { name: "Mosquitto 2.0.22 with a NanoMQ 0.25.7 edge bridge", maturity: "experimental", note: "0 FAIL so far.", facts: ["release"] },
          { name: "Four-process testbed (our own)", maturity: "experimental", note: "Includes a planted-defect build.", facts: ["A6"] },
          { name: "Native fuzzing, emulated firmware, devices, hardware", maturity: "planned", facts: ["release"] },
        ],
      },
      {
        id: "core",
        name: "Shared Ordinum engine",
        nodes: [
          { name: "Scenario search", maturity: "validated", facts: ["B11"] },
          { name: "Execution supervisor", maturity: "validated", facts: ["B3"] },
          { name: "Two-channel traces", maturity: "validated", facts: ["B2"] },
          { name: "Ground-truth checks", maturity: "validated", facts: ["B2", "B4"] },
          { name: "Reproduction", maturity: "validated", facts: ["B7"] },
          { name: "Minimization", maturity: "validated", facts: ["B6"] },
          {
            name: "HTML reports",
            maturity: "validated",
            note: "Single-target view validated; multi-process lanes view experimental; no committed MQTT or testbed report.",
            facts: ["B9"],
          },
          { name: "Build comparison", maturity: "experimental", note: "Affected vs fixed build, with a statistical test.", facts: ["B5", "release"] },
          { name: "Fix verification", maturity: "experimental", note: "Requires the property to be exercised. Planted defects only.", facts: ["release"] },
        ],
      },
      {
        id: "workflows",
        name: "Engineering workflows",
        nodes: [
          { name: "Regression cases", maturity: "validated", note: "Self-contained JSON cases.", facts: ["B8"] },
          { name: "Local runner: ordinum ci", maturity: "experimental", note: "On your machine.", facts: ["release"] },
          { name: "CI for your pipeline", maturity: "in-progress", note: "Templates exist, not yet run on a hosted runner.", facts: ["A9", "release"] },
        ],
      },
    ],
    note: "Single machine, Python today. A handful of targets use the adapter contract; that does not mean every kind of system is supported.",
  },
  reproduction: {
    /** /products #reproduction. */
    id: "reproduction",
    kicker: "REPRODUCTION / 007",
    title: "Measured, reduced,",
    titleMuted: "kept as a test.",
    items: [
      {
        title: "Reproduction",
        body: "Deterministic targets (the deterministic toy robot, the testbed in lockstep mode) must match the trace hash of a reference run: exact replay. Other targets re-run on fresh seeds and report k of N with a 95% Wilson interval.",
        caveat: "Statistical reproduction is a measurement with uncertainty, not exact replay. Nav2, MQTT and the stochastic toy variant are reproduced statistically.",
        facts: ["B7"],
      },
      {
        title: "Minimization",
        body: "Delta debugging removes faults from a failing schedule while the same property still fails, with a deterministic or a k-of-n statistical oracle.",
        caveat: "1-minimal at best, not the smallest possible. In the Nav2 pilot, two of three reductions hit the 600 s cap.",
        facts: ["B6"],
      },
      {
        title: "Regression",
        body: "Each reproduced failure becomes a self-contained JSON case: scenario, configuration hash, build fingerprint, violated property, minimization and reproduction data. ordinum ci replays saved cases locally. A case first asserts that the failure still occurs, and is flipped to a guard after a fix.",
        caveat: "On stochastic targets, zero failures in 10 seeded runs is evidence, not proof. Fix verification has so far been shown only on planted defects.",
        facts: ["B8", "A9"],
      },
    ],
  },
  limitations: {
    /** /products #limitations. */
    id: "limitations",
    kicker: "LIMITATIONS / 008",
    title: "What it does not do yet.",
    items: [
      "Runs on a single machine. No distributed runner, no cloud execution.",
      "No hardware, firmware or hardware-in-the-loop support. Nav2 runs in a simplified simulation.",
      "Every FIX_VERIFIED result so far is on a planted defect.",
      "The four-process testbed and the agent and transaction reference applications are our own systems, not production software.",
      "No language model is in the loop. Agents that build harnesses or propose fixes are planned.",
      "Minimization is 1-minimal at best, and the in-process watchdog cannot kill a hung thread.",
    ],
    facts: ["A1", "A3", "A5", "A6", "A7", "A9", "A10", "B3", "B6"],
  },
  note: FACT_SOURCE.note,
} as const satisfies {
  architecture: {
    id: string;
    kicker: string;
    title: string;
    titleMuted: string;
    lede: string;
    tiers: readonly { id: string; name: string; nodes: readonly ArchitectureNode[] }[];
    note: string;
  };
  reproduction: {
    id: string;
    kicker: string;
    title: string;
    titleMuted: string;
    items: readonly { title: string; body: string; caveat: string; facts: readonly FactRef[] }[];
  };
  limitations: { id: string; kicker: string; title: string; items: readonly string[]; facts: readonly FactRef[] };
  note: string;
};

/* -------------------------------------------------------------------------- */
/* Research page                                                               */
/* -------------------------------------------------------------------------- */

export type HypothesisRow = {
  readonly id: string;
  readonly comparison: string;
  readonly result: string;
  readonly holmP: string;
  readonly a12: string;
  readonly verdict: "Supported" | "Not supported";
};

/** A labeled result row. `classes` drive the badges; `label` is the rendered text. */
export type LabeledResult = {
  readonly what: string;
  readonly result: string;
  readonly classes: readonly EvidenceClass[];
  readonly label: string;
};

const labelOf = (classes: readonly EvidenceClass[]) => classes.map((c) => EVIDENCE_CLASS_LABELS[c]).join(" · ");

export const research = {
  summary: {
    kicker: "EXECUTIVE SUMMARY / 001",
    title: "What we have shown,",
    titleMuted: "and what we have not.",
    demonstrated: {
      label: "Demonstrated",
      items: [
        "The full loop (execution, verification, reproduction, minimization, regression case and report) on stock ROS 2 Nav2; execution, verification and replay, experimentally, on the Eclipse Mosquitto broker.",
        "Ground-truth checks that catch a mismatch between what a system reports and what actually happened.",
        "Every result classified before it is reported, including mistakes in our own harness.",
        "Fix verification on unmodified PocketBase 0.40.6, on a planted control: FIX_VERIFIED, affected 10/10 vs fixed 0/10 (1 November 2026, at 768a9b5).",
      ],
    },
    unproven: {
      label: "Not yet proven",
      items: [
        "That our search outperforms simpler baseline testing. Our benchmark did not show it.",
        "Any independently verified defect or vulnerability in a real system. None found so far.",
        "Adoption by paying customers. There are none yet.",
      ],
    },
    next: {
      label: "Testing next",
      items: [
        "Cross-system fault discovery on independently maintained services.",
        "Planted controls on more targets, including the MQTT setup.",
        "Broader real-world integration, with design partners if they agree.",
      ],
    },
    asOf: FACT_SOURCE.researchNote,
    facts: ["F1", "F2", "F5", "E4", "A8", "A5", "I5"],
  },
  nav2: {
    id: "nav2-pilot",
    kicker: "NAV2 PILOT / 002",
    title: "A small exploratory pilot",
    titleMuted: "on a real navigation stack.",
    lede: "Stock ROS 2 / Nav2 in a simplified loopback simulation, run on a single laptop. The full loop ran on software we did not write, and each violation was checked and classified rather than counted.",
    results: [
      {
        what: "Fault-free baseline",
        result: `${nav2PilotTotals.baselineFaultFree.violations} violations in ${nav2PilotTotals.baselineFaultFree.executions} runs (${nav2PilotTotals.baselineFaultFree.wilson95Text}).`,
        classes: ["real-external-target", "expected-behavior"],
        label: labelOf(["real-external-target", "expected-behavior"]),
      },
      ...nav2PilotFindings.map((f) => ({
        what: `${f.invariant} (${f.severity})`,
        result: `Reproduced ${f.reproduction.rate}; ${f.classification}.`,
        classes: ["real-external-target", evidenceClassOf(f.label)] as const,
        label: labelOf(["real-external-target", evidenceClassOf(f.label)]),
      })),
    ],
    conclusion:
      "All three reproduced violations are artifacts of our faults, harness or check bounds. No Nav2 defect was found, and nothing was filed upstream. Review by separate AI review agents, briefed to argue against each classification, upheld all three.",
    classifications: [
      {
        invariant: "success_mismatch",
        explanation: "Unrealistic noise (σ 0.36 m) on the only position source, in a setup with no state estimator to reject it.",
      },
      {
        invariant: "liveness",
        explanation:
          "An injected obstacle overlapping the robot itself. Nav2 stopped safely and did not finish within our time bound. The class is mixed; one near-goal case is a lead, not a defect candidate.",
      },
      {
        invariant: "stuck",
        explanation: "Our 30 s stall bound was shorter than the ~37 s transform delay we injected. Nav2 refused to drive on stale data and completed once the delay ended.",
      },
    ],
    /** Rendered from lib/evidence.ts: invariant, reproduction, minimization, classification. Below the narrative. */
    findings: nav2PilotFindings.map((f) => ({
      invariant: f.invariant,
      reproduction: `${f.reproduction.rate} (Wilson ${Math.round(f.reproduction.wilson95[0] * 100)}–${Math.round(f.reproduction.wilson95[1] * 100)}%)`,
      minimization: `${f.minimized.before} → ${f.minimized.after} faults${f.minimized.oneMinimal ? ", 1-minimal" : ", time cap reached"}`,
      label: labelOf(["real-external-target", evidenceClassOf(f.label)]),
      classification: f.classification,
      reviewQuote: f.reviewQuote,
    })),
    stats: {
      title: "Setup and statistics",
      items: [
        "4 strategies (random, mutation without feedback, generic feedback, scripted) × 3 seeds × 1,200 s of search, on 2 Nav2 instances",
        `${nav2PilotTotals.campaigns} of ${nav2PilotTotals.campaigns} campaigns completed; ${nav2PilotTotals.executions} executions; about 2 hours of search plus 34 minutes of confirmation`,
        "About 18% of attempts (107) were rejected by harness-health checks, mostly for low simulation fidelity, and retried; 3 executions ended as infrastructure errors",
        "Live compatibility gate passed on 23 October 2026: nominal compatibility, not behavioral equivalence",
      ],
      perArm: [
        { arm: "Random", classesPerSeed: "1 / 3 / 1" },
        { arm: "Mutation without feedback", classesPerSeed: "0 / 0 / 1" },
        { arm: "Generic feedback", classesPerSeed: "0 / 0 / 0" },
        { arm: "Scripted", classesPerSeed: "0 / 1 / 1" },
      ],
      perArmNote:
        "Random found all three violation classes; the feedback strategy found none. With three seeds and about 40 executions per campaign, this does not show that either is generally better.",
    },
    traceLink: { label: "Step through one of these runs", href: "/demos/nav2-walkthrough" },
    facts: ["F1", "F2", "F3", "C3"],
  },
  toy: {
    id: "toy-benchmark",
    kicker: "TOY BENCHMARK / 003",
    title: "Does feedback-guided search find more?",
    titleMuted: "Our benchmark has not shown it.",
    lede: "A pre-registered benchmark on a controlled target we built, designed to test whether feedback guidance finds more failure classes than random fault injection.",
    label: EVIDENCE_CLASS_LABELS["positive-control"],
    plainResult:
      "Every automated strategy found about 8.5 to 9 of the 11 planted failure classes per campaign on average; the fixed scripted catalog found 6. The differences between the automated strategies were not statistically significant.",
    supports: [
      "The loop works end to end: search, judge on ground truth, minimize, replay, store as a regression case.",
      "Automated search finds more failure classes than a fixed scripted catalog.",
    ],
    doesNotSupport: [
      "Any general advantage of feedback guidance over random search.",
      "Equivalence: a non-significant difference is not evidence that the strategies are equal.",
      "Anything about real systems: the bugs are planted, and the toy is ours.",
    ],
    target:
      "An 8×8 grid robot with a sensor, A* planner, state machine, controller and actuator, and 11 failure classes we planted deliberately. Exhaustive enumeration shows four of them need at least three faults.",
    design: [
      "5 strategies: scripted catalog, random, mutation without feedback, generic feedback, full feedback",
      "30 seeds per strategy, a budget of 5,000 executions per campaign (the scripted catalog runs out earlier); 300 of 300 campaigns completed, none excluded",
      "655,218 search executions under the primary 5,000-execution budget (experimental volume), plus a 36-second equal-wall-clock sensitivity check",
      "Hypotheses, configuration, analysis code and engine source hash-locked before any campaign ran",
    ],
    metric:
      "Distinct failure classes per campaign, each confirmed by delta debugging and three-of-three replay with the same trace hash. Two-sided Mann-Whitney U, Vargha-Delaney A12, α = 0.05, Holm correction, 10,000-resample bootstrap.",
    rows: [
      { id: "H1", comparison: "Full feedback vs random", result: "9.00 vs 8.63 classes", holmP: "0.18", a12: "0.63", verdict: "Not supported" },
      { id: "H2", comparison: "Generic feedback vs the same mutator without feedback", result: "8.77 vs 8.47 classes", holmP: "0.20", a12: "0.61", verdict: "Not supported" },
      { id: "P3", comparison: "Full feedback vs mutation without feedback", result: "9.00 vs 8.47 classes", holmP: "0.076", a12: "0.67", verdict: "Not supported" },
      { id: "P4", comparison: "Full vs generic feedback", result: "9.00 vs 8.77 classes", holmP: "0.24", a12: "0.58", verdict: "Not supported" },
      { id: "P5", comparison: "Full feedback vs scripted catalog", result: "9.00 vs 6.00 classes", holmP: "3.9 × 10⁻¹²", a12: "1.00", verdict: "Supported" },
    ],
    narrowResult:
      "One narrow result: the full-feedback strategy reached one planted three-fault bug in 16 of 30 campaigns, random in 0 of 30 (Holm p 4.3 × 10⁻⁵). The ablation (9 of 30 vs 4 of 30, Holm p 0.51) does not attribute this to feedback, and random was as fast or faster on the other three deep classes.",
    notes: [
      "The equal-wall-clock run is a sensitivity check, not a replication.",
      "Nine corrections from a review pass by separate AI review agents are appended to the report.",
      "We saw outcomes on one seed before the lock; this is disclosed in the report.",
    ],
    facts: ["A2", "F5"],
  },
  crossSystem: {
    id: "cross-system-testbed",
    kicker: "CROSS-SYSTEM TESTBED / 004",
    /* Non-breaking hyphen (U+2011): avoids a "four-" / "process" break at 320-430px. */
    title: "A four‑process testbed",
    titleMuted: "modeling a command path to a device.",
    lede: "To test the cross-system idea directly, we built a small command path out of four separate processes: an authorization service, a broker, a controller and an actuator. It is our own system, not production software or hardware.",
    policy: XSYS_POLICY_CLAUSES,
    results: [
      {
        what: "Determinism of the correctly behaving build",
        result: "20 reruns of the same seeded workload (50 commands, grants, a revocation and an emergency stop/reset; no faults) produced one behavior hash; a different seed produced a different hash.",
        classes: ["expected-behavior"],
        label: labelOf(["expected-behavior"]),
      },
    ],
    cost: "One run takes about 0.5 s (median) and about 100 MiB for all four processes plus the harness, measured on one development machine.",
    notYet: [
      "At 124dde072 there were no planted-defect builds. A planted-control build has since been run; its report is in the testbed evidence package.",
      "Free-running (nondeterministic) mode is registered but not runnable.",
      "Broker message faults have no policy clause yet.",
    ],
    note: "A pass on the correctly behaving build is the expected result, not a finding.",
    /* The engine-campaign figures (D4) exist only in a commit message; omitted until the founder confirms them. */
    facts: ["A6", "A7", "A8", "D1", "D2", "D3", "D5"],
  },
  mqtt: {
    id: "mqtt",
    kicker: "MQTT INTEGRATION / 005",
    title: "An exploratory campaign",
    titleMuted: "against Eclipse Mosquitto.",
    lede: "The engine ran 12 random scenarios against an isolated Mosquitto 2.0.22 broker (cloud-only topology, one session, 163 s), judged by three checks from the MQTT v5 specification and Mosquitto's dynamic-security rules.",
    results: [
      {
        what: "8 scenarios: PASS",
        result: "The broker satisfied all three checks.",
        classes: ["real-external-target", "expected-behavior"],
        label: labelOf(["real-external-target", "expected-behavior"]),
      },
      {
        what: "3 scenarios: infrastructure error",
        result: "A broker restart broke the harness's own connections. Not judged, and never counted as findings.",
        classes: [],
        label: "Infrastructure error · not judged",
      },
      {
        what: "1 scenario: FAIL durable_redelivery",
        result: "Our stall fault withheld the message, so it was never queued; the check wrongly counted it. Replay reproduced 0 of 5 (Wilson 95% CI 0–43%). The check now counts only committed messages.",
        classes: ["real-external-target", "harness-artifact"],
        label: labelOf(["real-external-target", "harness-artifact"]),
      },
    ],
    conclusion: "No confirmed finding and no Unresolved result in this campaign. Nothing here is a Mosquitto bug.",
    limits: [
      "The 12-scenario campaign ran before a later round of review fixes. It needs Docker, and has no committed artifact.",
      "The MQTT adapter records ambiguous cases with target-side markers rather than the core Unresolved verdict.",
      ...MQTT_SETUP.limits,
    ],
    facts: ["A4", "A5", "E1", "E2", "E4"],
  },
  limitations: {
    id: "limitations",
    kicker: "LIMITATIONS / 006",
    title: "What these results do not show.",
    items: [
      "A general advantage of guided search over random search, on any target.",
      "An independently confirmed defect in Nav2, Mosquitto or any other system.",
      "Results beyond a simplified ROS 2 loopback simulation: no physics, no state estimator, no physical hardware.",
      "Cross-system fault discovery: the testbed results are expected behavior and planted controls only.",
      "Use by customers or design partners. There are none yet.",
    ],
    closing: "More realistic targets and more research are needed. We would rather publish that than overstate what we have.",
    facts: ["F3", "F5", "F2", "E4", "A3", "A8", "I5"],
  },
  reproducibility: {
    id: "reproducibility",
    kicker: "REPRODUCIBILITY / 007",
    title: "How to check our work.",
    items: [
      { k: "Test suite", v: `${TEST_SUITE_STATUS}.` },
      { k: "Pre-registration", v: "The frozen pre-registered evidence re-verifies at tag prereg-frozen-2026-10-23: code and configuration locks, not a recomputation of raw results." },
      { k: "Nav2 compatibility", v: "Live gate passed on 23 October 2026: 2 of 2 nominal runs, 1 of 1 fault smoke test, no leftover containers." },
      { k: "Artifacts", v: FACT_SOURCE.artifactsNote },
      { k: "Source", v: FACT_SOURCE.researchNote },
      { k: "CI", v: HOSTED_CI_STATUS },
    ],
    files: [
      "docs/demo/nav2_success_mismatch_compare.html",
      "docs/demo/nav2_obstacle_nominal.html",
      "docs/demo/toy_failure_compare.html",
      "experiments/results/v2/nav2_pilot/summary.json",
      "experiments/results/v2/toy_v2/report.md",
      "docs/research/MQTT_TARGET.md",
      "docs/research/xsys_spike.md",
      "docs/design/XSYS_POLICY.md",
    ],
    access: "The product repository is private during the research stage. Selected artifacts are published as evidence packages; ask us for access to others.",
    facts: ["C1", "C3", "C4", "F6"],
  },
  methodology: {
    id: "methodology",
    kicker: "METHODOLOGY / 008",
    title: "Checks read ground truth. Hypotheses are locked first.",
    principles: [
      { title: "Two channels", body: "The search reads only what the system reports. Checks read only harness-recorded ground truth." },
      { title: "Pre-registration", body: "Benchmark hypotheses, configuration and analysis code are hash-locked before campaigns run. Deviations are documented." },
      { title: "Review by separate AI review agents", body: "AI review agents that did not produce a result are briefed to argue against its classification. These are not independent human audits." },
      { title: "Statistics", body: "Reproduction as k of N with 95% Wilson intervals; benchmark comparisons with Mann-Whitney U, Vargha-Delaney A12 and Holm correction." },
    ],
    labelsTitle: "Evidence labels",
    labels: EVIDENCE_CLASS_DEFINITIONS,
    labelsNote: "No result on this site is labeled an independently verified defect. Execution counts are experimental volume, not traction.",
    withdrawn: {
      title: "Withdrawn v1 results",
      body: [
        "An earlier version of this site reported v1 benchmark gains for feedback-guided search over random fault injection, on our toy target. We withdrew those results after an internal audit on 22 October 2026.",
        "The audit found a coverage metric that rewarded the guided strategy's own objective, a random baseline whose faults often landed after the episode had ended, accounting that hid a failure class, overstated failure depth, a reproduction figure that was true by construction, and no confidence intervals or significance tests.",
        "The v2 experiments above were redesigned in response, then pre-registered and hash-locked before their campaigns ran.",
      ],
    },
    facts: ["B2", "C4", "F2", "F5"],
  },
} as const satisfies {
  summary: {
    kicker: string;
    title: string;
    titleMuted: string;
    demonstrated: { label: string; items: readonly string[] };
    unproven: { label: string; items: readonly string[] };
    next: { label: string; items: readonly string[] };
    asOf: string;
    facts: readonly FactRef[];
  };
  nav2: {
    id: string;
    kicker: string;
    title: string;
    titleMuted: string;
    lede: string;
    results: readonly LabeledResult[];
    conclusion: string;
    classifications: readonly { invariant: string; explanation: string }[];
    findings: readonly {
      invariant: string;
      reproduction: string;
      minimization: string;
      label: string;
      classification: string;
      reviewQuote: string;
    }[];
    stats: {
      title: string;
      items: readonly string[];
      perArm: readonly { arm: string; classesPerSeed: string }[];
      perArmNote: string;
    };
    traceLink: Link;
    facts: readonly FactRef[];
  };
  toy: {
    id: string;
    kicker: string;
    title: string;
    titleMuted: string;
    lede: string;
    label: string;
    plainResult: string;
    supports: readonly string[];
    doesNotSupport: readonly string[];
    target: string;
    design: readonly string[];
    metric: string;
    rows: readonly HypothesisRow[];
    narrowResult: string;
    notes: readonly string[];
    facts: readonly FactRef[];
  };
  crossSystem: {
    id: string;
    kicker: string;
    title: string;
    titleMuted: string;
    lede: string;
    policy: readonly { id: string; text: string }[];
    results: readonly LabeledResult[];
    cost: string;
    notYet: readonly string[];
    note: string;
    facts: readonly FactRef[];
  };
  mqtt: {
    id: string;
    kicker: string;
    title: string;
    titleMuted: string;
    lede: string;
    results: readonly LabeledResult[];
    conclusion: string;
    limits: readonly string[];
    facts: readonly FactRef[];
  };
  limitations: { id: string; kicker: string; title: string; items: readonly string[]; closing: string; facts: readonly FactRef[] };
  reproducibility: {
    id: string;
    kicker: string;
    title: string;
    items: readonly { k: string; v: string }[];
    files: readonly string[];
    access: string;
    facts: readonly FactRef[];
  };
  methodology: {
    id: string;
    kicker: string;
    title: string;
    principles: readonly { title: string; body: string }[];
    labelsTitle: string;
    labels: Readonly<Record<EvidenceClass, string>>;
    labelsNote: string;
    withdrawn: { title: string; body: readonly string[] };
    facts: readonly FactRef[];
  };
};

/* -------------------------------------------------------------------------- */
/* Vision page                                                                 */
/* -------------------------------------------------------------------------- */

export type Phase = {
  readonly n: string;
  readonly name: string;
  readonly title: string;
  readonly body: string;
  readonly items: readonly string[];
  /** Where this phase stands today. Only the initial phase has built parts. */
  readonly maturity: Maturity;
  readonly statusNote: string;
};

export const vision = {
  intro: {
    kicker: "DIRECTION / 002",
    title: "Many hard failures start where parts meet.",
    body: [
      "Systems are built from software, AI models, infrastructure, firmware and hardware, each tested in its own way. We want one place to run failure scenarios across all of them and keep each failure as a test.",
    ],
  },
  scope: {
    title: "Long-term scope",
    items: [
      "Web applications, APIs and services",
      "Cloud infrastructure and messaging",
      "AI models and agents",
      "Firmware and devices",
      "Robotics and industrial systems",
    ],
    note: "A direction, not current support. Each domain needs its own adapters.",
  },
  whyNow: {
    kicker: "WHY NOW / 003",
    title: "Regulators now ask what was tested.",
    items: [
      {
        text: "Under the EU Cyber Resilience Act, manufacturers of products with digital elements must report actively exploited vulnerabilities and severe incidents from 11 September 2026. The main obligations apply from 11 December 2027.",
        source: { label: "European Commission: CRA reporting", href: "https://digital-strategy.ec.europa.eu/en/policies/cra-reporting" },
      },
      {
        text: "The EU Machinery Regulation (EU) 2023/1230 applies on a mandatory basis from 20 January 2027.",
        source: {
          label: "European Commission: Machinery",
          href: "https://single-market-economy.ec.europa.eu/sectors/mechanical-engineering/machinery_en",
        },
      },
    ],
    note: "Neither regulation requires a particular testing method.",
    facts: ["J1", "J2"],
  },
  tools: "Specialized testing tools stay essential. We expect to work alongside them.",
  closing: "Every system deserves to be tested beyond its assumptions.",
} as const satisfies {
  intro: { kicker: string; title: string; body: readonly string[] };
  scope: { title: string; items: readonly string[]; note: string };
  whyNow: {
    kicker: string;
    title: string;
    items: readonly { text: string; source: Link }[];
    note: string;
    facts: readonly FactRef[];
  };
  tools: string;
  closing: string;
};

/* -------------------------------------------------------------------------- */
/* About page                                                                  */
/* -------------------------------------------------------------------------- */

export type Founder = {
  readonly name: string;
  readonly role: string;
  readonly education?: string;
  /** One or two factual sentences. No invented achievements, responsibilities or credentials. */
  readonly summary?: string;
  /** Relevant experience, summarized (no resume blocks). */
  readonly experience?: readonly string[];
  readonly linkedin?: string;
  /** true = not approved for publication; render name and role only. Both are approved (2026-10-24). */
  readonly pendingConfirmation: boolean;
};

const armaan = {
  name: "Armaan Singla",
  role: "Co-founder",
  education: "Computer Engineering, Queen's University",
  summary: "Leads much of Ordinum's technical engineering work.",
  experience: [
    "Software engineering intern in AMD's Product Security Office, building fuzzing agents.",
    "Earlier: production observability and metrics (GuestLogix) and multi-agent systems (Geotab).",
  ],
  linkedin: site.founderLinkedin,
  pendingConfirmation: false,
} as const satisfies Founder;

/** Approved by Armaan for publication on 2026-10-24 (brief section 8). */
const aarav = {
  name: "Aarav Singla",
  role: "Co-founder",
  education: "Computer Engineering, McMaster University",
  summary: "Computer Engineering student at McMaster University, who recently started his undergraduate degree.",
  linkedin: site.cofounderLinkedin,
  pendingConfirmation: false,
} as const satisfies Founder;

/** True while any founder profile still awaits approval. */
export const ABOUT_PROFILES_PENDING = ([armaan, aarav] as readonly Founder[]).some((f) => f.pendingConfirmation);

export const about = {
  story: {
    kicker: "WHY ORDINUM / 001",
    title: "Why we are building it.",
    body: [
      "Armaan's work on fuzzing, multi-agent systems and production observability led to one question: how do you test for failures that only appear when components interact?",
      "We started with ROS 2 / Nav2 because it is public and built from many communicating parts. The same engine now tests services, brokers and agents.",
    ],
  },
  fit: {
    kicker: "WHAT WE BRING / 002",
    title: "Experience that maps to the problem.",
    items: [
      { title: "Fuzzing and product security", body: "Searching for conditions nobody wrote a test for." },
      { title: "Production observability", body: "Turning what a running system did into something an engineer can act on." },
      { title: "Multi-agent systems", body: "Many components acting on shared, imperfect state." },
    ],
  },
  team: {
    kicker: "THE TEAM / 003",
    /* Non-breaking hyphen (U+2011) so the display heading never breaks as "co-" / "founders". */
    title: "Two co‑founders.",
    lede: "Armaan Singla and Aarav Singla.",
  },
  founders: [armaan, aarav],
  independence:
    "Ordinum is not affiliated with or endorsed by any current or past employer of its founders, and contains no employer code or confidential material.",
  noTeamPhotos: true,
} as const satisfies {
  story: { kicker: string; title: string; body: readonly string[] };
  fit: { kicker: string; title: string; items: readonly { title: string; body: string }[] };
  team: { kicker: string; title: string; lede: string };
  founders: readonly Founder[];
  independence: string;
  noTeamPhotos: boolean;
};

/* -------------------------------------------------------------------------- */
/* Contact page + form                                                         */
/* -------------------------------------------------------------------------- */

/** Values stored in inquiries.request_type (and waitlist.request_type). Keep in sync with lib/schema.ts. */
export const REQUEST_TYPES = [
  { value: "technical_demo", label: "Technical demonstration" },
  { value: "design_partnership", label: "Design partnership" },
  { value: "security_testing", label: "Security testing discussion" },
  { value: "research_collaboration", label: "Research collaboration" },
  { value: "general", label: "General inquiry" },
] as const;
export type RequestType = (typeof REQUEST_TYPES)[number]["value"];

/** Values stored in inquiries.technology_category (and waitlist.technology_category). Keep in sync with lib/schema.ts. */
export const TECHNOLOGY_CATEGORIES = [
  { value: "applications_apis", label: "Applications & APIs" },
  { value: "distributed_cloud", label: "Cloud & distributed systems" },
  { value: "ai_agents", label: "AI models & agents" },
  { value: "os_middleware", label: "Operating systems & middleware" },
  { value: "firmware_embedded", label: "Firmware & embedded devices" },
  { value: "hardware", label: "Silicon & hardware interfaces" },
  { value: "robotics_autonomy", label: "Robotics & autonomous systems" },
  { value: "industrial", label: "Industrial control & physical infrastructure" },
  { value: "other", label: "Other" },
] as const;
export type TechnologyCategory = (typeof TECHNOLOGY_CATEGORIES)[number]["value"];

export const contact = {
  talk: {
    /** Anchor id kept for old /contact#talk links. */
    id: "talk",
    kicker: "EVALUATIONS / 001",
    title: "Request an evaluation.",
    body: "We start with a short discussion and a demo. Then we agree on a suitable system and testing scope with you.",
    steps: [
      { title: "Tell us about your system", body: "What you are building, and the failure you care about." },
      { title: "A short discussion and a demo", body: "A founder replies by email to set it up." },
      { title: "Agree on scope", body: "A suitable system and testing scope, chosen with you." },
    ],
    delivery: `${delivery.short} There is no hosted product.`,
    note: "Research-stage. No pricing or terms yet.",
    calCta: { label: "Prefer to pick a time? Book 30 minutes", href: site.calUrl },
    emailCta: { label: `Email ${site.email}`, href: `mailto:${site.email}` },
  },
  inquiry: {
    id: "inquiry",
    kicker: "YOUR SYSTEM / 002",
    title: "Tell us about your system.",
    body: "Only your work email is required.",
  },
  form: {
    /** id for the <form> wrapper. */
    anchorId: "contact-form",
    emailLabel: "Work email",
    companyLabel: "Company",
    workingOnLabel: "What are you working on?",
    workingOnHint: "For example: a set of services, an agent platform, a robot fleet.",
    messageLabel: "Message",
    optional: "Optional",
    moreDetails: {
      summary: "More details (optional)",
      technologyCategoryLabel: "Technology category",
      technologyCategoryPlaceholder: "Select a category",
      requestTypeLabel: "Request type",
      requestTypePlaceholder: "Select a request type",
    },
    requestTypes: REQUEST_TYPES,
    technologyCategories: TECHNOLOGY_CATEGORIES,
    confidentialityWarning:
      "Please don't include confidential details, credentials, customer data or unpatched vulnerability specifics.",
    privacy: {
      text: "The founders store and read what you send. How we handle it:",
      link: { label: "Privacy Notice", href: "/privacy" },
    },
    /** Shown under the submit button: what happens after sending. */
    nextLine: "After you send this, a founder replies by email to arrange a short discussion and a demo.",
    submit: "Send request",
    pending: "Sending your request",
    successKicker: "Request received",
    successFollowUp:
      "What happens next: a founder reads your request and replies by email to arrange a short discussion and a demo. Then we agree on a suitable system and testing scope with you.",
    messages: {
      success: "Thanks. Your request was saved, and a founder will reply by email.",
      rateLimited: `We've received several messages from this email in the last hour, so this one was not saved. Please try again later, or email ${site.email}.`,
      invalid: "Some fields need attention. Check the highlighted fields, then send again.",
      tooFast: "That was quick. Take a moment to check your details, then send again.",
      error: `Something went wrong on our side and your request was not saved. Please try again, or email ${site.email}.`,
    },
  },
} as const satisfies {
  talk: {
    id: string;
    kicker: string;
    title: string;
    body: string;
    steps: readonly { title: string; body: string }[];
    delivery: string;
    note: string;
    calCta: Link;
    emailCta: Link;
  };
  inquiry: { id: string; kicker: string; title: string; body: string };
  form: {
    anchorId: string;
    emailLabel: string;
    companyLabel: string;
    workingOnLabel: string;
    workingOnHint: string;
    messageLabel: string;
    optional: string;
    moreDetails: {
      summary: string;
      technologyCategoryLabel: string;
      technologyCategoryPlaceholder: string;
      requestTypeLabel: string;
      requestTypePlaceholder: string;
    };
    requestTypes: readonly { value: string; label: string }[];
    technologyCategories: readonly { value: string; label: string }[];
    confidentialityWarning: string;
    privacy: { text: string; link: Link };
    nextLine: string;
    submit: string;
    pending: string;
    successKicker: string;
    successFollowUp: string;
    messages: { success: string; rateLimited: string; invalid: string; tooFast: string; error: string };
  };
};

/* -------------------------------------------------------------------------- */
/* Legal: interim Website Terms + Privacy Notice                               */
/* -------------------------------------------------------------------------- */

export type LegalSection = {
  readonly id: string;
  readonly title: string;
  readonly body: readonly string[];
  /** Optional bullet list rendered after the body. */
  readonly list?: readonly string[];
};

export type LegalDoc = {
  readonly title: string;
  /** Shown prominently at the top until the founder approves the exact text. */
  readonly status: string;
  readonly lastUpdated: string;
  readonly intro: string;
  readonly sections: readonly LegalSection[];
};

/**
 * Interim legal text, filled ONLY with founder facts (2026-10-24): not incorporated; operated
 * by the co-founders; Ontario, Canada (PIPEDA); submissions kept until deletion is requested;
 * requests to armaan@ordinum.org; processors Vercel, Supabase, Resend (once enabled), Cal.com
 * only via outbound link. No analytics or advertising cookies: verified in code (no analytics
 * packages, no cookie or storage writes, CSP connect-src 'self'); Vercel dashboard settings are
 * a founder check. Based on internal legal drafts (not published).
 * Approved by the founders as interim pages on 25 October 2026; may be revised after legal review.
 */
export const legal = {
  status: "Interim version, approved 25 October 2026. May be revised after legal review.",
  terms: {
    title: "Website Terms",
    status: "Interim version, approved 25 October 2026. May be revised after legal review.",
    lastUpdated: "24 October 2026",
    intro: "These terms cover your use of ordinum.org. They are short because the site is informational.",
    sections: [
      {
        id: "who",
        title: "Who operates this site",
        body: [
          `ordinum.org is operated by Ordinum's co-founders, Armaan Singla and Aarav Singla, in Ontario, Canada. Ordinum is not incorporated. Contact: ${site.email}.`,
        ],
      },
      {
        id: "scope",
        title: "What these terms cover",
        body: [
          "These terms cover this website only. The site describes Ordinum's research-stage work and offers ways to contact us. It has no accounts, subscriptions, payments or hosted software. Any future demonstration, pilot or design partnership would be covered by a separate written agreement.",
        ],
      },
      {
        id: "information",
        title: "Information on the site",
        body: [
          "Content is provided for general information. It describes research-stage work, including experimental results, limitations and plans. Planned capabilities are not commitments, and nothing on the site is an offer, warranty or guarantee of any capability or result.",
        ],
      },
      {
        id: "contacting",
        title: "Contacting us",
        body: [
          "When you use the contact form or email us, please don't include confidential, proprietary or sensitive personal information, or details of unpatched vulnerabilities in third-party systems. Information you send is not treated as confidential unless we agree otherwise in writing. The Privacy Notice explains how we handle personal information.",
        ],
      },
      {
        id: "use",
        title: "Acceptable use",
        body: ["Please don't use the site to break the law, disrupt the site or its infrastructure, attempt unauthorized access, send spam or automated form entries, or impersonate others."],
      },
      {
        id: "links",
        title: "Third-party services",
        body: [
          "The site links to third-party services such as Cal.com (scheduling), LinkedIn, X and Instagram. Their own terms and privacy policies apply when you use them.",
        ],
      },
      {
        id: "as-is",
        title: "No warranties",
        body: ["The site is provided as is and as available."],
      },
      {
        id: "law",
        title: "Governing law",
        body: ["These terms are governed by the laws of Ontario, Canada."],
      },
      {
        id: "changes",
        title: "Changes",
        body: ["We may update these terms. The date at the top shows the current version."],
      },
    ],
  },
  privacy: {
    title: "Privacy Notice",
    status: "Interim version, approved 25 October 2026. May be revised after legal review.",
    lastUpdated: "24 October 2026",
    intro: "How ordinum.org handles personal information.",
    sections: [
      {
        id: "who",
        title: "Who is responsible",
        body: [
          `ordinum.org is operated by Ordinum's co-founders, Armaan Singla and Aarav Singla, in Ontario, Canada. Ordinum is not incorporated. We handle personal information in line with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA). Privacy contact: ${site.email}.`,
        ],
      },
      {
        id: "collect",
        title: "What we collect",
        body: [
          "Contact form: your work email (required) and, if you choose to give them, your company, what you are working on, your message, a technology category and a request type. We also record when you submitted it.",
          "Email: if you email us, your address and your message.",
          "Technical logs: our hosting provider processes request data such as IP address, browser user agent, requested page and time, to deliver and secure the site.",
        ],
      },
      {
        id: "cookies",
        title: "Cookies and analytics",
        body: [
          "The site sets no analytics or advertising cookies and uses no tracking pixels. Fonts and other assets are served from our own domain.",
        ],
      },
      {
        id: "use",
        title: "How we use it",
        body: [
          "To read and reply to your inquiry, arrange conversations or demonstrations, consider design partnerships or research collaborations, and keep the site secure, including preventing spam. We do not sell your personal information or use it for advertising.",
        ],
      },
      {
        id: "processors",
        title: "Who processes it for us",
        body: ["These service providers process information on our behalf:"],
        list: [
          "Vercel: website hosting, form handling and request logs.",
          "Supabase: storage of contact-form submissions.",
          "Resend: sends the founders an email notification of each new inquiry, including what you submitted (once this notification is enabled).",
        ],
      },
      {
        id: "links",
        title: "Links to other services",
        body: [
          "If you follow our link to Cal.com to book a call, or to LinkedIn, X or Instagram, those services handle your information under their own policies. The site does not embed them.",
        ],
      },
      {
        id: "retention",
        title: "How long we keep it",
        body: ["We keep contact-form submissions until you ask us to delete them."],
      },
      {
        id: "rights",
        title: "Access and deletion",
        body: [`To see, correct or delete the information you sent us, email ${site.email}.`],
      },
      {
        id: "changes",
        title: "Changes",
        body: ["We will post updates on this page and change the date at the top."],
      },
    ],
  },
} as const satisfies { status: string; terms: LegalDoc; privacy: LegalDoc };

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */

export const footer = {
  thesis: "Continuous security testing for software, firmware and hardware. Today: reproduce failures, verify fixes, keep regressions.",
  columns: [
    {
      title: "Products",
      links: [
        { label: "Platform overview", href: "/products" },
        { label: "Software & APIs", href: "/products/software" },
        { label: "AI agent security", href: "/products/agents" },
        { label: "Robotics & connected systems", href: "/products/robotics" },
        { label: "Transaction assurance", href: "/products/transactions" },
        { label: "Roadmap", href: "/roadmap" },
      ],
    },
    {
      title: "Evidence",
      links: [
        { label: "Demos", href: "/demos" },
        { label: "Ordinum Labs", href: "/labs" },
        { label: "Security", href: "/security" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Request an evaluation", href: "/contact" },
        { label: site.email, href: `mailto:${site.email}` },
      ],
    },
    {
      title: "Social",
      links: [
        { label: "LinkedIn", href: site.linkedinCompany, external: true },
        { label: "X", href: site.x, external: true },
        { label: "Instagram", href: site.instagram, external: true },
      ],
    },
  ],
  /** Interim legal pages, approved by the founders 25 October 2026. */
  legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
  copyright: "© 2026 Ordinum",
} as const satisfies {
  thesis: string;
  columns: readonly { title: string; links: readonly ExternalLink[] }[];
  legal: readonly Link[];
  copyright: string;
};

/* -------------------------------------------------------------------------- */
/* 404                                                                         */
/* -------------------------------------------------------------------------- */

export const notFound = {
  headline: "Nothing breaks here.",
  title: "This page doesn't exist.",
  body: "The page you are looking for does not exist or has moved.",
  cta: { label: "Back to Ordinum", href: "/" },
  secondaryCta: PRIMARY_CTA,
} as const satisfies {
  headline: string;
  title: string;
  body: string;
  cta: Link;
  secondaryCta: Link;
};

/* -------------------------------------------------------------------------- */
/* Pages: inner-page headers, metadata, reading order                          */
/* -------------------------------------------------------------------------- */

export type PageKey =
  | "products"
  | "software"
  | "agents"
  | "robotics"
  | "transactions"
  | "roadmap"
  | "demos"
  | "nav2Walkthrough"
  | "labs"
  | "security"
  | "about"
  | "contact"
  | "terms"
  | "privacy";

export type PageHeaderCopy = {
  readonly kicker: string;
  readonly title: string;
  readonly titleMuted?: string;
  readonly lede: string;
};

type PageCopy = {
  readonly href: string;
  readonly label: string;
  /** Optional: /contact has no PageHeader (its heading comes from `contact.talk`). */
  readonly header?: PageHeaderCopy;
  /** meta.title is short; the root layout template appends " | Ordinum". */
  readonly meta: { readonly title: string; readonly description: string };
};

export const pages = {
  products: {
    href: "/products",
    label: "Platform overview",
    header: {
      kicker: "Platform overview",
      title: "One engine,",
      titleMuted: "one workflow.",
      lede: "You connect a system and write the rules it must obey. Ordinum runs controlled failure scenarios, reproduces what fails, verifies the engineer's fix and keeps the case as a regression test. It runs on your machines.",
    },
    meta: {
      title: "Platform overview",
      description:
        "How Ordinum works: one shared engine behind every product area, one five-step workflow, how it is delivered (a CLI with Python integrations, evaluations guided by the founders) and how a run works.",
    },
  },
  software: {
    href: "/products/software",
    label: "Software & APIs",
    header: {
      kicker: "Software & APIs",
      title: "Catch reads and writes",
      titleMuted: "your access rules forbid.",
      lede: "Ordinum runs your service with many clients at once, flags any read or write your access policy forbids, and checks the engineer's fix against the failing build.",
    },
    meta: {
      title: "Software & APIs: access rules and concurrent writes",
      description:
        "Access-rule and concurrency testing for services, with fix verification. Example: unmodified PocketBase 0.40.6 with a defect we planted in our own client path; FIX_VERIFIED, 10/10 vs 0/10.",
    },
  },
  agents: {
    href: "/products/agents",
    label: "AI agent security",
    header: {
      kicker: "AI agent security",
      title: "Test what agents do",
      titleMuted: "with their permissions.",
      lede: "Ordinum checks that an agent's actions stay inside the permissions it was granted, including after they change or a task is cancelled, judged on what actually changed.",
    },
    meta: {
      title: "AI agent security: testing what agents do",
      description:
        "Test what AI agents do with tools and permissions. Tested on our own reference agent application (9 planted defects), where Ordinum also found a real cancel bug in the hardened build. Release candidate; no third-party agent tested yet.",
    },
  },
  robotics: {
    href: "/products/robotics",
    label: "Robotics & connected systems",
    header: {
      kicker: "Robotics & connected systems",
      title: "When the robot says it arrived,",
      titleMuted: "check where it is.",
      lede: "Ordinum tests ROS 2 / Nav2 in simulation, MQTT brokers and a four-process command path to a device. It compares what each part reports with what actually happened.",
    },
    meta: {
      title: "Robotics & connected systems: ground-truth checks",
      description:
        "Ordinum for robotics and connected systems: ROS 2 / Nav2 in simulation (Built & validated), Mosquitto with a NanoMQ edge bridge and a four-process testbed (Built, experimental).",
    },
  },
  transactions: {
    href: "/products/transactions",
    label: "Transaction assurance",
    header: {
      kicker: "Transaction assurance",
      title: "Test approvals and ledgers",
      titleMuted: "before money moves.",
      lede: "Ordinum checks that approvals are honored exactly as given and that the ledger agrees with them, then verifies the fix. Today it runs on our own transaction reference application, not real payment software.",
    },
    meta: {
      title: "Transaction assurance: approvals and ledgers",
      description:
        "Testing approval and ledger rules, with fix verification. Today on Ordinum's own transaction reference application (release candidate, test-only keys): 3 planted defects fix-verified, a reject-all fix rejected.",
    },
  },
  roadmap: {
    href: "/roadmap",
    label: "Roadmap",
    header: {
      kicker: "Roadmap",
      title: "Where Ordinum",
      titleMuted: "is going next.",
      lede: "Firmware and hardware, CI for your pipeline, and the long-term agentic security loop. Nothing on this page is available yet.",
    },
    meta: {
      title: "Roadmap",
      description:
        "Ordinum's roadmap: CI for your pipeline in progress; native fuzzing, emulated firmware, device transport and physical hardware planned; the agentic security loop as the long-term direction.",
    },
  },
  demos: {
    href: "/demos",
    label: "Demos",
    header: {
      kicker: "Demo",
      title: "A planted failure,",
      titleMuted: "found, fixed and verified.",
      lede: "A 1:35 recording of a real run on PocketBase 0.40.6, replaying its terminal output, with each step marked below.",
    },
    meta: {
      title: "Demo: failure to verified fix",
      description:
        "Watch Ordinum find a defect we planted in our PocketBase client path, then check the fixed build (FIX_VERIFIED). Plus a Nav2 walkthrough and a testbed run, each with its evidence package.",
    },
  },
  nav2Walkthrough: {
    href: "/demos/nav2-walkthrough",
    label: "Nav2 walkthrough",
    header: {
      kicker: "Demos · Nav2 walkthrough",
      title: "A real run,",
      titleMuted: "step by step.",
      lede: "Ordinum testing stock ROS 2 Nav2 under injected faults: what it checked, what it saw, how it reproduced the failure, and why we traced it to our own harness.",
    },
    meta: {
      title: "Nav2 walkthrough",
      description:
        "An interactive walkthrough of a real Ordinum run on ROS 2 Nav2: system, property, injected faults, observed behavior, verdict, reproduction and the regression case, classified as a harness artifact.",
    },
  },
  labs: {
    href: "/labs",
    label: "Ordinum Labs",
    header: {
      kicker: "Ordinum Labs",
      title: "What we tested,",
      titleMuted: "and what we found.",
      lede: "Each article starts with the finding, then what was tested, how, what it shows and what it does not.",
    },
    meta: {
      title: "Ordinum Labs: case studies and research",
      description:
        "Ordinum Labs: a real bug Ordinum found in our own reference agent, a verified fix on a planted PocketBase defect, a Nav2 success mismatch traced to our own harness, and a research summary.",
    },
  },
  security: {
    href: "/security",
    label: "Security",
    header: {
      kicker: "Security",
      title: "Where runs execute,",
      titleMuted: "and what happens to the data.",
      lede: "Deployment, data handling, network isolation for each integration, operating limits, and how to report a concern.",
    },
    meta: {
      title: "Security: deployment and data handling",
      description:
        "Where Ordinum runs (your machines), what happens to run data and contact-form data, network isolation per integration, operating limits, hosted CI and how to report a security concern.",
    },
  },
  about: {
    href: "/about",
    label: "About",
    header: {
      kicker: "About",
      title: "The founders",
      titleMuted: "building Ordinum.",
      lede: "Why we are building it, and who we are.",
    },
    meta: {
      title: "About the founders",
      description: "Ordinum is being built by co-founders Armaan Singla and Aarav Singla.",
    },
  },
  contact: {
    href: "/contact",
    label: "Contact",
    /* No header: /contact renders ClosingCTA (contact.talk) as its page heading. */
    meta: {
      title: "Request an evaluation",
      description: "Request an evaluation of Ordinum: a short discussion and a demo, then a suitable system and testing scope agreed with you.",
    },
  },
  terms: {
    href: "/terms",
    label: "Terms",
    header: {
      kicker: "Legal",
      title: "Website Terms",
      lede: "Terms of use for ordinum.org.",
    },
    meta: {
      title: "Website Terms",
      description: "Terms of use for ordinum.org.",
    },
  },
  privacy: {
    href: "/privacy",
    label: "Privacy",
    header: {
      kicker: "Legal",
      title: "Privacy Notice",
      lede: "How ordinum.org handles personal information.",
    },
    meta: {
      title: "Privacy Notice",
      description: "How ordinum.org handles personal information, including contact-form submissions.",
    },
  },
} as const satisfies Record<PageKey, PageCopy>;

/** Reading order for the "Next" link at the bottom of each product page. */
export const pageOrder = ["products", "software", "agents", "robotics", "transactions", "roadmap"] as const satisfies readonly PageKey[];
