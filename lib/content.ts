/**
 * Ordinum copy deck (labs + products release, 1 November 2026; focused site 24 October 2026).
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
 *   - The head-level test count, reuse percentages and component ratios are not used. The only
 *     test figure is the validation-log figure (registry C1).
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
  note: "Facts checked against product ordinum-2 head 44284b0; evidence pinned at stable checkpoint 768a9b5 (checked 1 November 2026).",
  researchNote:
    "The results in this summary reflect the ordinum-2 research branch at commit 124dde072, checked on 24 October 2026. The Nav2 pilot and toy benchmark artifacts are unchanged at 768a9b5.",
  artifactsNote: `Demo artifacts were copied at commit ${PRODUCT_SOURCE.commitShort} and are unchanged at the stable checkpoint 768a9b5.`,
} as const;

/** Founder-approved wording for hosted CI (1 November 2026). Use verbatim. */
export const HOSTED_CI_STATUS =
  "Light test jobs of Ordinum's own repo pass on GitHub Actions; the heavy Docker suite has not run hosted.";

/** Methods note on every Labs article (founder decision, 1 November 2026). Use verbatim. */
export const AI_METHODS_NOTE =
  "Engineering and review used AI coding and review agents; reviews were not independent human audits.";

/** The flagship planted-control label. Use verbatim wherever the PocketBase run appears. */
export const FLAGSHIP_LABEL =
  "Controlled positive control — a defect planted in Ordinum's own test harness, not a PocketBase bug";

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
  tagline: "Find failures that only appear when systems interact.",
  description:
    "Ordinum runs adversarial tests against complex software, checks what actually happened, and turns reproducible failures into tests that help prevent regressions. Research-stage.",
} as const;

/* -------------------------------------------------------------------------- */
/* SEO                                                                         */
/* -------------------------------------------------------------------------- */

export const seo = {
  home: {
    /** The home <title> is exactly the brand (absolute, no template). */
    title: "Ordinum",
    description:
      "Ordinum runs adversarial tests against complex software, checks what actually happened, and turns reproducible failures into regression tests. Research-stage, with a working ROS 2 / Nav2 integration and experimental cross-system integrations.",
    ogTitle: "Ordinum — Find failures that only appear when systems interact",
    ogDescription:
      "Adversarial testing and verification for systems built from interacting parts. Research-stage; see real runs, labeled for what they are.",
    twitterTitle: "Ordinum — Find failures that only appear when systems interact",
    twitterDescription:
      "Adversarial testing and verification for systems built from interacting parts. Research-stage; see real runs, labeled for what they are.",
  },
  /** Organization JSON-LD description (app/layout.tsx). */
  organizationDescription:
    "Ordinum is building testing and verification infrastructure that runs adversarial failure scenarios against complex, interacting systems.",
  /** Per-page full titles for OG/Twitter. pages[*].meta.title stays short for the "%s | Ordinum" template. */
  pages: {
    products: "Ordinum platform — Connect, stress-test, verify, reproduce",
    software: "Software & APIs — From a failed authorization test to a verified fix",
    agents: "AI Agents — Agent authority and resource effects",
    robotics: "Robotics & Connected Systems — Nav2, MQTT and a four-process reference system",
    roadmap: "Roadmap — What is in progress and what is planned",
    demos: "Demos — Real runs, labeled for what they are",
    nav2Walkthrough: "Nav2 walkthrough — A real run, step by step",
    labs: "Ordinum Labs — Research and case studies with their evidence",
    security: "Security — Ordinum's operating boundaries",
    about: "About — The founders building Ordinum",
    contact: "Contact — Talk to the founders",
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
          description: "One engine: connect, stress-test, verify, reproduce.",
          maturity: "validated",
          maturityNote: "core engine",
        },
        {
          label: "Software & APIs",
          href: "/products/software",
          description: "Authorization and concurrency checks, with a verified-fix workflow.",
          maturity: "experimental",
          maturityNote: "PocketBase, planted control",
        },
        {
          label: "AI Agents",
          href: "/products/agents",
          description: "Agent authority and resource effects.",
          maturity: "experimental",
          maturityNote: "reference fixtures only",
        },
        {
          label: "Robotics & Connected Systems",
          href: "/products/robotics",
          description: "Nav2 in simulation, MQTT brokers, a four-process reference system.",
          maturity: "validated",
          maturityNote: "Nav2 · simulation only",
        },
        {
          label: "Roadmap",
          href: "/roadmap",
          description: "Transactions, native fuzzing, firmware, devices and hardware.",
          maturity: "planned",
          maturityNote: "not built yet",
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
          description: "Operating boundaries: where runs execute and what they can touch.",
        },
      ],
    },
    {
      kind: "group",
      id: "company",
      label: "Company",
      items: [
        { label: "About", href: "/about", description: "The two co-founders building Ordinum." },
        { label: "Contact", href: "/contact", description: "Talk to the founders or send a short note." },
      ],
    },
  ],
  bookCall: { label: "Book a call", href: site.calUrl },
  /** Primary header CTA. Key kept as `demo` so existing Navbar/MobileMenu code compiles. */
  demo: { label: "Talk to us", href: "/contact#talk" },
} as const satisfies {
  entries: readonly NavEntry[];
  bookCall: Link;
  demo: Link;
};

/** Every internal destination in the nav, flattened (tests, footer). */
export const navDestinations: readonly string[] = nav.entries.flatMap((e) =>
  e.kind === "group" ? e.items.map((i) => i.href) : [e.href],
);

/* -------------------------------------------------------------------------- */
/* The four-stage workflow (home section 4 and the hero visual)                */
/* -------------------------------------------------------------------------- */

export type WorkflowStageId = "connect" | "stress" | "verify" | "reproduce";

export type WorkflowStage = {
  readonly n: string;
  readonly id: WorkflowStageId;
  readonly label: string;
  readonly body: string;
  /** Short caption for compact diagrams (hero visual). */
  readonly caption: string;
  readonly facts: readonly FactRef[];
};

export const WORKFLOW_STAGES = [
  {
    n: "01",
    id: "connect",
    label: "Connect",
    body: "Connect a system through a target-specific adapter that runs it, applies faults and records what happened.",
    caption: "A target adapter runs it and records ground truth",
    facts: ["B1"],
  },
  {
    n: "02",
    id: "stress",
    label: "Stress-test",
    body: "Run controlled scenarios and inject faults, such as delays, restarts and permission changes, to explore unexpected behavior.",
    caption: "Delays, drops, restarts, permission changes",
    facts: ["A1", "E3"],
  },
  {
    n: "03",
    id: "verify",
    label: "Verify",
    body: "Independent checks read evidence recorded by the harness, not the system's own reports, to decide what actually happened.",
    caption: "Properties checked on harness ground truth",
    facts: ["B2", "B3"],
  },
  {
    n: "04",
    id: "reproduce",
    label: "Reproduce & prevent",
    body: "Measure how often a failure recurs, reduce the scenario when possible, and keep it as a test for future runs.",
    caption: "Re-run on fresh seeds, reduced, saved as a JSON test",
    facts: ["B6", "B7", "B8"],
  },
] as const satisfies readonly WorkflowStage[];

/* -------------------------------------------------------------------------- */
/* Integrations: one canonical list (home, product, technology)                */
/* -------------------------------------------------------------------------- */

export type IntegrationId =
  | "core"
  | "pocketbase"
  | "agents"
  | "nav2"
  | "xsys"
  | "mqtt"
  | "nanomq"
  | "xsysFree"
  | "toy"
  | "ci"
  | "engines"
  | "px4";

export type Integration = {
  readonly id: IntegrationId;
  readonly name: string;
  readonly maturity: Maturity;
  /** Qualifier shown next to the maturity label, e.g. "exploratory pilot". */
  readonly maturityNote?: string;
  /** What kind of system it is, when it is a target. */
  readonly targetKind?: string;
  /** One sentence for the home page and product page. */
  readonly summary: string;
  /** Longer description (product pages). */
  readonly detail: string;
  readonly limits: readonly string[];
  readonly facts: readonly FactRef[];
};

export const integrations = [
  {
    id: "core",
    name: "Core testing engine",
    maturity: "validated",
    summary:
      "Runs scenarios with timed faults, judges them with independent checks, reproduces and reduces failures, and saves regression cases and reports.",
    detail:
      "One target-agnostic engine: search, a supervisor with deadlines and isolation, independent checks on harness-recorded evidence, delta-debugging minimization, exact or statistical reproduction, JSON regression cases and self-contained HTML reports.",
    limits: [
      "Runs on a single machine; there is no distributed runner.",
      "Regression cases run locally (ordinum ci); there is no hosted CI integration yet.",
      "Every end-to-end fix demonstration so far uses a planted control.",
    ],
    facts: ["A1", "B1", "B3", "B6", "B7", "B8", "B9", "release"],
  },
  {
    id: "pocketbase",
    name: "PocketBase adapter",
    maturity: "experimental",
    maturityNote: "planted control · one host",
    targetKind: "Real external target",
    summary:
      "Runs unmodified PocketBase 0.40.6 under our own authorization policy and workload. Fix verification shown on a planted control.",
    detail:
      "PocketBase 0.40.6, unmodified, with the binary pinned by SHA-256, driven on one host by Ordinum's own policy and workload. A defect planted in Ordinum's own client path (pc_stale_read_cache) is found, confirmed, reduced and then shown fixed by ordinum verify. A separate concurrency check reproduced a lost update the PocketBase maintainers have already acknowledged.",
    limits: [
      "The fix demonstration uses a defect we planted in our own client path, not a PocketBase bug.",
      "Our policy and workload on one host, not a production deployment.",
      "Concurrency findings are classified, not verified; the lost update was reproduced, not discovered.",
    ],
    facts: ["release"],
  },
  {
    id: "agents",
    name: "Agents kit",
    maturity: "experimental",
    maturityNote: "reference fixtures only",
    targetKind: "Reference fixtures (planted)",
    summary: "Checks agent authority and resource effects on reference fixtures with planted defects. No third-party agent tested.",
    detail:
      "A kit for testing what an AI agent is allowed to do and what it actually changes. Today it runs only against reference fixtures with planted defects; no third-party agent application has been tested.",
    limits: ["Planted reference fixtures only.", "No third-party agent application has been tested."],
    facts: ["release"],
  },
  {
    id: "nav2",
    name: "ROS 2 / Nav2 adapter",
    maturity: "validated",
    maturityNote: "exploratory pilot",
    targetKind: "Real external target",
    summary: "Drives stock Nav2 robot navigation in a simplified simulator. Exploratory pilot; no Nav2 defect found.",
    detail:
      "Stock Nav2 1.3.13 on ROS 2 Jazzy in a pinned container. An agent inside the container interposes on scan, odometry, transform and velocity-command messages and keeps a ground-truth record taken before any fault is applied. An exploratory pilot ran 12 campaigns; its three reproduced violations were all harness artifacts.",
    limits: [
      "Simplified loopback simulation: no physics, no state estimator.",
      "Some faults could create physically impossible situations, and check bounds are not yet fault-aware.",
      "Simulation only; no physical robot.",
    ],
    facts: ["A3", "F1", "F2", "C3"],
  },
  {
    id: "xsys",
    name: "Cross-system reference testbed",
    maturity: "experimental",
    targetKind: "Our own testbed",
    summary:
      "Four separate processes we built (authorization service, broker, controller, actuator), checked against four written policy clauses. A reference fixture, with a planted-control build.",
    detail:
      "A four-process software testbed that models a cloud-to-device command path. Each component is a separate OS process, connected only through a harness fabric. The engine judges runs against four written policy clauses with causal (happened-before) checks, because the components have independent clocks. The lockstep build replays exactly in our measurements (one development machine; volatile resource metadata excluded from the hash). A planted-control build checks that the policy checks catch a violation we put there on purpose.",
    limits: [
      "Our own system under test, not production software, hardware or a customer system.",
      "Planted-control results are positive controls, not discoveries.",
    ],
    facts: ["A6", "D1", "D2", "D3", "B10"],
  },
  {
    id: "mqtt",
    name: "MQTT adapter (Eclipse Mosquitto)",
    maturity: "experimental",
    targetKind: "Real external target",
    summary:
      "Runs scenarios against the independently maintained Mosquitto 2.0.22 and NanoMQ 0.25.7 brokers. Results so far are negative: 0 FAIL.",
    detail:
      "The engine's own supervisor runs MQTT scenarios end to end against a locally isolated Mosquitto 2.0.22 broker, with three checks taken from the MQTT v5 specification and Mosquitto's dynamic-security rules: no duplicate delivery of a QoS 2 message (the at-most-once half of MQTT v5 §4.3.3; ambiguous cases are recorded as cannot-judge), no delivery after a committed publish-deny, and durable-session redelivery.",
    limits: [
      "Negative results: 0 FAIL is not evidence that either broker is correct.",
      "Broker restarts can break the harness's own connections (recorded as infrastructure errors).",
      "Campaigns need Docker.",
    ],
    facts: ["A4", "E1", "E2", "E4"],
  },
  {
    id: "nanomq",
    name: "NanoMQ edge bridge",
    maturity: "in-progress",
    targetKind: "Real external target",
    summary: "A second broker bridged to Mosquitto, for edge-to-cloud scenarios. The bridge link is not yet stable.",
    detail:
      "The two-broker topology (NanoMQ at the edge, Mosquitto in the cloud) is implemented and comes up, but the bridge session is unstable, so it is opt-in and campaigns default to the cloud-only topology.",
    limits: ["Not validated. Results on the two-broker topology are not reported."],
    facts: ["A5"],
  },
  {
    id: "xsysFree",
    name: "Testbed free-running mode",
    maturity: "in-progress",
    targetKind: "Our own testbed",
    summary: "A nondeterministic mode of the cross-system testbed. Registered, but not yet runnable.",
    detail:
      "The stochastic runtime exists, but the harness does not orchestrate it yet, so its sessions end as infrastructure errors.",
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
      "An 8×8 grid robot with a sensor, planner, state machine, controller and actuator, and 11 failure classes we planted deliberately. It has deterministic and stochastic variants and carries the pre-registered benchmark.",
    limits: ["We wrote it and planted its bugs: results are positive controls, not discoveries."],
    facts: ["A2", "A8", "F5"],
  },
  {
    id: "ci",
    name: "Hosted CI integration",
    maturity: "planned",
    summary: "Running regression cases inside your hosted pipelines. Today, ordinum ci runs them locally.",
    detail: "Regression cases are self-contained JSON files. ordinum ci replays them locally; integration with hosted pipelines is planned.",
    limits: [],
    facts: ["A9"],
  },
  {
    id: "engines",
    name: "API, firmware, AI-agent and hardware testing engines",
    maturity: "planned",
    summary: "Specialized engines for APIs and protocols, binaries and firmware, AI agents and hardware in the loop.",
    detail:
      "Planned engines that would report into the same verification layer. None is built; MQTT and the testbed are targets of the existing engine, not separate engines.",
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
/* Home: hero                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Headline chosen by the 2026-10-24 comprehension test (n = 6 personas per option):
 * "Find failures that only appear when systems interact." scored higher on clarity (6.50 vs
 * 6.00) and drew fewer misreads than "Find what breaks between systems." (which was also read
 * as API/microservice contract testing). The shared misreads (pentest / AI red-teaming,
 * robotics-only, "no product yet") are answered by `audience`, the status line and the
 * demo CTA rather than by the headline.
 */
export const hero = {
  eyebrow: "Adversarial testing & verification",
  titleLine1: "Find failures that only appear",
  titleLine2: "when systems interact.",
  lede: "Ordinum runs adversarial tests against complex software, checks what actually happened, and turns reproducible failures into tests that help prevent regressions.",
  /** Who it is for first. A target audience, not a customer claim. */
  audience:
    "Built first for engineering and product-security teams whose software spans services, AI agents, message brokers, devices and robots.",
  primaryCta: { label: "Watch the demo", href: "/demos#demo-flagship" },
  secondaryCta: { label: "Talk to us", href: "/contact#talk" },
  status: "Research-stage · Working ROS 2 / Nav2 integration, simulation only · Experimental software, agent and MQTT integrations",
  /** Mono meta row; meta[0] is also the OG image footer. */
  meta: ["RESEARCH-STAGE", "SOFTWARE & APIS · AI AGENTS · ROBOTICS & CONNECTED SYSTEMS"],
  visual: {
    ariaLabel:
      "Diagram of Ordinum's four stages. Connect: a target adapter runs the system and records ground truth. Stress-test: delays, drops, restarts and permission changes. Verify: properties checked on harness ground truth. Reproduce and prevent: re-run on fresh seeds, reduced, saved as a JSON test.",
    note: "CONCEPTUAL",
    stages: WORKFLOW_STAGES.map((s) => ({ id: s.id, label: s.label, caption: s.caption })),
    regressionLabel: "Regression case",
    /** Connect readout: the adapters that exist today (maturity is in the status line). */
    targets: "PocketBase · Nav2 · MQTT",
    /** Under the visual: the seven stages in full live on /products#lifecycle. */
    link: { label: "The full seven-stage lifecycle", href: "/products#lifecycle" },
  },
} as const satisfies {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  lede: string;
  audience: string;
  primaryCta: Link;
  secondaryCta: Link;
  status: string;
  meta: readonly string[];
  visual: {
    ariaLabel: string;
    note: string;
    stages: readonly { id: WorkflowStageId; label: string; caption: string }[];
    regressionLabel: string;
    targets: string;
    link: Link;
  };
};

/* -------------------------------------------------------------------------- */
/* Home: sections 2-6                                                          */
/* -------------------------------------------------------------------------- */

export type CausalStep = {
  readonly n: string;
  readonly actor: string;
  readonly event: string;
  /** info = normal operation; fault = disturbance; violation = policy broken (orange). */
  readonly tone: "info" | "fault" | "violation";
};

const sm = nav2SuccessMismatch;

/**
 * Home (release, 1 November 2026), in order: hero; a short recorded run; the four-stage workflow;
 * product areas with status; a failure-to-fix case (planted, labeled); selected Labs articles;
 * operating boundaries with a pilot invitation; the CTA band. Budget: 960 words of main text.
 */
export const home = {
  /** Section 2: one real recorded run (Nav2 pilot), short form. Steps come from demoWalkthrough. */
  demo: {
    kicker: "RECORDED RUN / 001",
    /** Shown on the badge next to the trace. */
    tag: "Recorded run",
    title: "Nav2 said it arrived.",
    titleMuted: `The robot was ${sm.verdict.distanceText} off.`,
    lede: "A real run on stock ROS 2 Nav2 in simulation, under injected faults: caught, reproduced, reduced, then classified as our own harness artifact.",
    /** Which walkthrough fields the home page shows (short form only). */
    showSteps: ["property", "observed", "verdict", "reproduction"],
    primaryCta: { label: "See the walkthrough", href: "/demos/nav2-walkthrough" },
    secondaryCta: { label: "All demos", href: "/demos" },
  },

  /** Section 3: the four-stage workflow (PipelineHero carries the stages). */
  workflow: {
    kicker: "HOW IT WORKS / 002",
    title: "Four stages,",
    titleMuted: "one loop.",
    link: { label: "How the platform works", href: "/products#how-it-works" },
  },

  /** Section 4: product areas, each with its own maturity label and scope. */
  areas: {
    kicker: "PRODUCT AREAS / 003",
    title: "Three product areas.",
    titleMuted: "Each with its own status.",
    roadmap: { label: "Roadmap: firmware, devices, hardware", href: "/roadmap" },
  },

  /** Section 5: the flagship planted control, labeled before any number. */
  fix: {
    kicker: "FAILURE TO FIX / 004",
    title: "From a failed authorization test",
    titleMuted: "to a verified fix.",
    lede: "Unmodified PocketBase 0.40.6. We planted a stale read cache in our own client path; Ordinum found it, confirmed it, verified that one fault is enough, then showed that the fix removes it.",
    stats: ["Confirmed", "Affected vs fixed", "Property exercised", "Verdict"],
    links: [
      { label: "Evidence package", href: "/evidence/pocketbase-verified-fix" },
      { label: "Read the case study", href: "/labs/from-failed-authorization-test-to-verified-fix" },
    ],
  },

  /** Section 6: selected Labs articles (slugs in lib/labs.ts). */
  labs: {
    kicker: "ORDINUM LABS / 005",
    title: "Research with its evidence.",
    titleMuted: "Limitations included.",
    slugs: ["from-failed-authorization-test-to-verified-fix", "what-a-robots-success-message-can-hide", "research-summary"],
    link: { label: "All Labs articles", href: "/labs" },
  },

  /** Section 7: operating boundaries and the pilot invitation. */
  boundaries: {
    kicker: "OPERATING BOUNDARIES / 006",
    title: "Where it runs,",
    titleMuted: "and what it can touch.",
    items: [
      "Runs locally on one machine. No hosted service, no cloud execution.",
      "Targets run with no network or loopback only, with resource limits.",
      "Tests systems you are authorized to test. It does not scan external systems or drive physical actuators.",
      "A set of safety nets, not a universal sandbox.",
    ],
    link: { label: "Security and operating boundaries", href: "/security" },
    pilot: {
      title: "Pilot invitation",
      text: "Bring one failure your team struggles to reproduce. We will tell you honestly whether Ordinum can test it today.",
    },
  },
} as const satisfies {
  demo: {
    kicker: string;
    tag: string;
    title: string;
    titleMuted: string;
    lede: string;
    showSteps: readonly DemoStepId[];
    primaryCta: Link;
    secondaryCta: Link;
  };
  workflow: { kicker: string; title: string; titleMuted: string; link: Link };
  areas: { kicker: string; title: string; titleMuted: string; roadmap: Link };
  fix: { kicker: string; title: string; titleMuted: string; lede: string; stats: readonly string[]; links: readonly Link[] };
  labs: { kicker: string; title: string; titleMuted: string; slugs: readonly string[]; link: Link };
  boundaries: {
    kicker: string;
    title: string;
    titleMuted: string;
    items: readonly string[];
    link: Link;
    pilot: { title: string; text: string };
  };
};

/* -------------------------------------------------------------------------- */
/* Closing CTA band (home section 6 and every inner page)                      */
/* -------------------------------------------------------------------------- */

export const ctaBand = {
  kicker: "DESIGN PARTNERS",
  title: "Help us test the failures",
  titleMuted: "your team struggles to reproduce.",
  body: "We're looking for design partners: engineering and product-security teams working on connected devices, robotics, or systems where cloud, broker and device meet. Tell us about a failure that is hard to reproduce; it shapes which integrations we build next.",
  note: "Research-stage. No pricing or pilot terms yet.",
  /** Primary button. Key kept as `demo` for the existing CtaBand component. */
  demo: { label: "Talk to the founders", href: "/contact#talk" },
  secondary: { label: "See Ordinum in action", href: "/demos" },
  bookCall: { label: "Book a 30-min call", href: site.calUrl },
} as const satisfies {
  kicker: string;
  title: string;
  titleMuted: string;
  body: string;
  note: string;
  demo: Link;
  secondary: Link;
  bookCall: Link;
};

/* -------------------------------------------------------------------------- */
/* Demo walkthrough (/demo, and the short form on the home page)               */
/* -------------------------------------------------------------------------- */

export type DemoStepId = "system" | "property" | "faults" | "observed" | "verdict" | "reproduction" | "regression";

export type DemoStep = {
  readonly n: string;
  readonly id: DemoStepId;
  readonly label: string;
  /** One line (home page). */
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
    lede: `Every value below comes from the committed report, traces and meta file for one Nav2 pilot failure: the schedule that found it, its minimized form (the run shown) and ${sm.reproduction.trials} replays on fresh seeds.`,
  },
  walkthrough: demoWalkthrough,
  /** Compact next step right after the classification (reuses the CTA band labels). */
  midCta: { primary: ctaBand.demo, call: ctaBand.bookCall },
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
    title: "What else a result can be.",
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
    { start: "00:50", end: "00:56", text: "Ordinum: find failures that only appear when systems interact." },
  ],
  provenance: {
    kicker: "PROVENANCE / 004",
    title: "Provenance",
    body: `Read from the Ordinum product repository (private research branch ${PRODUCT_SOURCE.branch}). ${FACT_SOURCE.artifactsNote} The original HTML reports are listed in the evidence package, and can be downloaded there once published.`,
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
  midCta: { primary: Link; call: Link };
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
  /** Which of the four home-page stages this belongs to. */
  readonly workflowStage: WorkflowStageId;
  readonly facts: readonly FactRef[];
};

export const lifecycle = {
  /** Anchor id on /products (linked from the home page). */
  id: "lifecycle",
  kicker: "ARCHITECTURE · LIFECYCLE / 003",
  /** Below md the seven stages sit behind this disclosure (open from md up). */
  disclosure: "The seven stages in full",
  title: "Seven stages,",
  titleMuted: "from a scenario to a kept test.",
  lede: "The four stages, in full. What changes between targets is the adapter and the source of truth the checks rely on.",
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
      workflowStage: "stress",
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
      workflowStage: "stress",
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
      workflowStage: "verify",
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
      workflowStage: "verify",
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
      today: "Each failure is saved as a JSON case; ordinum ci replays saved cases locally. Hosted CI integration is planned.",
      workflowStage: "reproduce",
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

/** /products: the shared engine. #how-it-works and #architecture are redirect targets. */
export const platform = {
  howItWorks: {
    id: "how-it-works",
    kicker: "HOW IT WORKS / 001",
    title: "Four stages,",
    titleMuted: "one engine behind every area.",
    lede: "Every product area runs on the same engine. What changes between areas is the adapter that connects a system and the properties it must hold.",
  },
  capabilities: {
    id: "capabilities",
    kicker: "CAPABILITY MAP / 002",
    title: "What the engine does today,",
    titleMuted: "command by command.",
    lede: "The core engine and command-line tool at the stable checkpoint 768a9b5. Each capability carries its own maturity label.",
    items: [
      {
        name: "Search",
        command: "fuzz",
        maturity: "validated",
        body: "Campaigns of seeded scenarios with timed faults, from a scripted catalog and random search to feedback-guided search.",
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
        body: "Exact replay on deterministic targets; a measured reproduction rate with an interval on the rest.",
      },
      {
        name: "Build comparison",
        command: "compare",
        maturity: "experimental",
        body: "Runs a failure against an affected build and a fixed build, and tests the difference statistically.",
      },
      {
        name: "Fix verification",
        command: "verify",
        maturity: "experimental",
        note: "planted controls only",
        body: "Returns FIX_VERIFIED only if every confirmed violation is gone on the fixed build, the fixed build's own campaign finds none, and each required property was actually exercised, so a vacuous pass does not count.",
      },
      {
        name: "Local regression runs",
        command: "ci",
        maturity: "experimental",
        note: "local only",
        body: "Replays saved regression cases on your machine. No hosted CI integration yet.",
      },
      {
        name: "Reports",
        maturity: "validated",
        body: "Self-contained HTML reports, plus Markdown and JSON reports for fix verification.",
      },
    ],
    areasTitle: "Product areas",
    ciStatus: HOSTED_CI_STATUS,
  },
  outputs: {
    id: "outputs",
    kicker: "WHAT AN ENGINEER RECEIVES / 005",
    title: "Evidence you can act on.",
    lede: "For each reproduced failure, the engine produces the following. Examples are from the real Nav2 run in the walkthrough.",
    items: [
      {
        id: "report",
        title: "Failure report",
        plain: "One self-contained HTML page showing what ran, what failed, and the original scenario next to the reduced one.",
        example: "nav2_success_mismatch_compare.html, listed in the Nav2 evidence package.",
        facts: ["B9"],
      },
      {
        id: "timeline",
        title: "Trace timeline",
        plain: "Every event of the run on a timeline, with what the system said kept apart from what actually happened.",
        example: `Faults at 4.40 s and 6.52 s; Nav2 reported ${sm.minimized.result.status} at ${sm.minimized.result.tS} s.`,
        facts: ["B2", "B9"],
      },
      {
        id: "verdict",
        title: "Independent verdict",
        plain: "Which property failed, when, and the measured values behind it, decided by a check the search never sees.",
        example: `${sm.verdict.invariant}: reported success, true pose ${sm.verdict.distanceText} from the goal.`,
        facts: ["B2", "B4"],
      },
      {
        id: "reproduction",
        title: "Reproduction rate",
        plain: "How reliably the failure recurs: an exact match on deterministic systems, a measured rate with a confidence interval on the rest.",
        example: `${sm.reproduction.rate} on fresh seeds (${sm.reproduction.wilson95Text}).`,
        facts: ["B7"],
      },
      {
        id: "reduced",
        title: "Reduced scenario",
        plain: "The fault schedule cut down to what still triggers the failure, flagged when reduction was stopped by its time cap.",
        example: `${sm.minimization.before} faults reduced to ${sm.minimization.after}; time cap reached.`,
        facts: ["B6"],
      },
      {
        id: "regression",
        title: "Regression case",
        plain: "A self-contained test that re-runs the failure scenario against future builds.",
        example: `${sm.failureId}.json.`,
        facts: ["B8"],
      },
    ],
    reportNote: "Report preview rendered from the real run. The original files are listed in the evidence package.",
    links: [
      { label: "The full run, step by step", href: "/demos/nav2-walkthrough" },
      { label: "Evidence package", href: "/evidence/nav2-success-mismatch" },
    ],
  },
  cta: {
    title: "Tell us how your team tests today.",
    body: "Thirty minutes with the founders about your system and the failures that are hardest to reproduce.",
    primary: { label: "Talk to us", href: "/contact#talk" },
    secondary: { label: "See Ordinum in action", href: "/demos" },
  },
} as const satisfies {
  howItWorks: { id: string; kicker: string; title: string; titleMuted: string; lede: string };
  capabilities: {
    id: string;
    kicker: string;
    title: string;
    titleMuted: string;
    lede: string;
    items: readonly Capability[];
    areasTitle: string;
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

export type ProductAreaKey = "software" | "agents" | "robotics";

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

export type ProductBlock = {
  readonly id: string;
  readonly name: string;
  readonly maturity: Maturity;
  readonly maturityNote: string;
  readonly body: string;
  readonly boundaries: readonly string[];
  readonly link?: Link;
};

export type ProductArea = {
  readonly key: ProductAreaKey;
  readonly maturity: Maturity;
  readonly maturityNote: string;
  /** Customer and job. A target audience, never a customer claim. */
  readonly job: { readonly kicker: string; readonly title: string; readonly titleMuted: string; readonly who: string; readonly job: string; readonly note: string };
  readonly connect: { readonly kicker: string; readonly title: string; readonly items: readonly { readonly term: string; readonly detail: string }[] };
  /** Robotics: separate blocks, each with its own boundaries. */
  readonly blocks?: { readonly kicker: string; readonly title: string; readonly items: readonly ProductBlock[] };
  readonly sequence: SequenceDiagramCopy & { readonly kicker: string };
  readonly demo: { readonly kicker: string; readonly title: string; readonly status: string; readonly video?: boolean; readonly body: string; readonly links: readonly Link[] };
  readonly outputs: { readonly kicker: string; readonly title: string; readonly items: readonly { readonly name: string; readonly detail: string }[] };
  readonly fit: {
    readonly kicker: string;
    readonly title: string;
    readonly prerequisites: readonly string[];
    readonly customWork: readonly string[];
    readonly limitations: readonly string[];
  };
  readonly links: { readonly kicker: string; readonly labs: readonly Link[]; readonly evidence: readonly Link[] };
  readonly cta: { readonly title: string; readonly body: string; readonly primary: Link; readonly secondary?: Link };
};

const fixLink = { label: "Evidence package: PocketBase verified fix", href: "/evidence/pocketbase-verified-fix" } as const;
const fixArticle = { label: "Case study: from a failed authorization test to a verified fix", href: "/labs/from-failed-authorization-test-to-verified-fix" } as const;
const nav2Article = { label: "Case study: what a robot's success message can hide", href: "/labs/what-a-robots-success-message-can-hide" } as const;
const summaryArticle = { label: "Research summary: what we've measured", href: "/labs/research-summary" } as const;

export const productAreas = {
  software: {
    key: "software",
    maturity: "experimental",
    maturityNote: "PocketBase · planted control · one host",
    job: {
      kicker: "WHO IT IS FOR / 001",
      title: "Authorization and concurrency,",
      titleMuted: "tested on the running service.",
      who: "Engineering and product-security teams that own a service with access rules and many concurrent clients.",
      job: "Find the case where a client sees or changes data it should not, keep it as a regression case, and show that a fix removes it, with numbers rather than a single green run.",
      note: "A target audience, not a customer list. Ordinum is research-stage and has no customers yet.",
    },
    connect: {
      kicker: "WHAT YOU CONNECT / 002",
      title: "What you connect and define.",
      items: [
        { term: "The service", detail: "A build you can run locally. In the flagship run: PocketBase 0.40.6, unmodified, with the binary pinned by SHA-256." },
        { term: "An adapter", detail: "Starts the service, drives clients and records what happened, separately from what the service reports." },
        { term: "Policy and workload", detail: "Who may read and write what, and the client traffic to run. In the flagship run these are Ordinum's own." },
        { term: "Properties", detail: "What must hold, for example read_authz (reads respect the access policy) and model_agreement (what clients observe agrees with a reference model)." },
        { term: "Affected and fixed builds", detail: "For fix verification: the build that fails and the build that should not." },
      ],
    },
    sequence: {
      kicker: "ONE RUN, IN SEQUENCE / 003",
      title: "Failure to verified fix.",
      conceptual: true,
      ariaLabel:
        "Conceptual sequence of the flagship run: the Ordinum engine runs our workload through the client path against PocketBase; the planted stale read cache returns data the policy no longer allows; the check flags read_authz; the engine confirms and reduces the failure, compares the affected and fixed builds, and returns FIX_VERIFIED; ordinum ci then replays the saved cases.",
      caption: "Simplified. The counts are from the recorded run at 768a9b5.",
      actors: [
        { id: "engine", label: "Ordinum engine" },
        { id: "client", label: "Client path (ours)" },
        { id: "service", label: "PocketBase 0.40.6" },
        { id: "check", label: "Checks" },
      ],
      steps: [
        { from: "engine", to: "client", label: "Run seeded workload", tone: "info" },
        { from: "client", to: "service", label: "Reads under our access policy", tone: "info" },
        { from: "client", to: "client", label: "Planted stale read cache", tone: "fault" },
        { from: "client", to: "check", label: "Returns data no longer allowed", tone: "violation" },
        { from: "check", to: "engine", label: "read_authz violated", tone: "violation" },
        { from: "engine", to: "engine", label: "Confirm 5/5; 1-minimal", tone: "info" },
        { from: "engine", to: "service", label: "Affected 10/10 vs fixed 0/10", tone: "info" },
        { from: "check", to: "engine", label: "FIX_VERIFIED; ci: 2 PASS", tone: "verdict" },
      ],
    },
    demo: {
      kicker: "DEMO / 004",
      title: "The flagship run.",
      status: "Recorded run · 1:35 · captions",
      video: true,
      body: "The run behind these numbers was executed on 1 November 2026 at product commit 768a9b5. The recording replays its real terminal output; the evidence package carries the same logs, the reports and both regression cases.",
      links: [
        { label: "See it on the demos page", href: "/demos" },
        fixLink,
      ],
    },
    outputs: {
      kicker: "ACTUAL OUTPUTS / 005",
      title: "What the run produced.",
      items: [
        { name: "Verdict", detail: "FIX_VERIFIED from ordinum verify, exit 0." },
        { name: "Confirmation", detail: "read_authz and model_agreement each confirmed 5/5." },
        { name: "Reduced scenario", detail: "1-minimal fault schedule." },
        { name: "Build comparison", detail: "Affected 10/10 vs fixed 0/10, one-sided Fisher p = 5.41e-06." },
        { name: "Property exercise", detail: "read_authz exercised in 100/100 executions on each build." },
        { name: "Regression cases", detail: "Two JSON cases; ordinum ci: 2 PASS, exit 0." },
        { name: "Reports", detail: "report.md and report.json, plus the terminal logs." },
      ],
    },
    fit: {
      kicker: "FIT / 006",
      title: "Prerequisites, custom work, limitations.",
      prerequisites: [
        "A Linux machine. The recorded run took about 5.5 minutes on a 16-vCPU WSL2 laptop, without Docker.",
        "A service build you can start locally, and permission to test it.",
        "A written access policy and a workload.",
      ],
      customWork: [
        "Each new service needs its own adapter, built from the adapter template. Today that is custom work with us.",
        "Properties and the reference model are written per service.",
      ],
      limitations: [
        "Every end-to-end fix demonstration uses a planted control: the defect is in Ordinum's own client path, not in PocketBase.",
        "No new third-party vulnerability has been found, and no historical third-party affected/fixed reproduction has been shown yet.",
        "A concurrency check reproduced a lost update the PocketBase maintainers have already acknowledged. Reproduced, not discovered; its results are classified, not verified.",
        "Exercise counts are declared by the adapter: a count is only as good as that declaration.",
        "Ten runs per build is a statistical comparison, not a proof that the failure can never return.",
      ],
    },
    links: { kicker: "EVIDENCE / 007", labs: [fixArticle, summaryArticle], evidence: [fixLink] },
    cta: {
      title: "Have an access rule that fails only under load?",
      body: "Tell us about the service and the failure. We will say plainly whether the adapter template fits it today.",
      primary: { label: "Talk to us", href: "/contact#talk" },
      secondary: { label: "See Ordinum in action", href: "/demos" },
    },
  },

  agents: {
    key: "agents",
    maturity: "experimental",
    maturityNote: "reference fixtures only",
    job: {
      kicker: "WHO IT IS FOR / 001",
      title: "What an agent may do,",
      titleMuted: "and what it actually changed.",
      who: "Teams giving AI agents tools, credentials and write access to real resources.",
      job: "Check that an agent's actions stay inside the authority it was granted, including after that authority changes, and keep any violation as a reproducible case.",
      note: "A target audience, not a customer list. No third-party agent application has been tested.",
    },
    connect: {
      kicker: "WHAT YOU CONNECT / 002",
      title: "What you connect and define.",
      items: [
        { term: "The agent", detail: "Run through the agents kit's harness, which records each tool call and its effect." },
        { term: "Resources", detail: "The files, records or services the agent can touch, observed by the harness rather than by the agent's own account." },
        { term: "Authority", detail: "What the agent is allowed to do, and when that changes." },
        { term: "Properties", detail: "Statements about authority and resource effects, checked on what the harness recorded." },
      ],
    },
    sequence: {
      kicker: "ONE RUN, IN SEQUENCE / 003",
      title: "A permission revoked mid-task.",
      conceptual: true,
      ariaLabel:
        "Conceptual sequence: an operator grants an agent access; the agent starts a task; Ordinum revokes the permission mid-task; the agent acts on the resource anyway; the harness records the effect; the check flags an action outside the agent's authority.",
      caption: "Conceptual example of the kind of property the kit checks. Not a recorded run.",
      actors: [
        { id: "engine", label: "Ordinum" },
        { id: "agent", label: "Agent" },
        { id: "resource", label: "Resource" },
        { id: "check", label: "Checks" },
      ],
      steps: [
        { from: "engine", to: "agent", label: "Grant access, start task", tone: "info" },
        { from: "agent", to: "resource", label: "Read and plan", tone: "info" },
        { from: "engine", to: "agent", label: "Revoke permission", tone: "fault" },
        { from: "agent", to: "resource", label: "Writes anyway", tone: "violation" },
        { from: "resource", to: "check", label: "Effect recorded by harness", tone: "info" },
        { from: "check", to: "engine", label: "Action outside authority", tone: "verdict" },
      ],
    },
    demo: {
      kicker: "DEMO / 004",
      title: "Honest status.",
      status: "No recording yet",
      body: "The agents kit runs today against reference fixtures with planted defects. A short recording on one of those fixtures is planned after the flagship recording passes review.",
      links: [{ label: "Current demos", href: "/demos" }],
    },
    outputs: {
      kicker: "ACTUAL OUTPUTS / 005",
      title: "What a run produces.",
      items: [
        { name: "Verdicts", detail: "Pass, fail or Unresolved per property, judged on harness-recorded effects." },
        { name: "Reproduction and reduction", detail: "The same confirmation and minimization the engine applies to every target." },
        { name: "Regression cases", detail: "JSON cases that replay with ordinum ci." },
        { name: "Reports", detail: "The engine's standard reports." },
      ],
    },
    fit: {
      kicker: "FIT / 006",
      title: "Prerequisites, custom work, limitations.",
      prerequisites: ["A Linux machine.", "An agent whose tool calls can be routed through a harness.", "Permission to test the agent and its resources."],
      customWork: [
        "Connecting a real agent means wrapping its tools in the harness. Today that is custom work with us.",
        "Authority rules and properties are written per agent.",
      ],
      limitations: [
        "Reference fixtures with planted defects only. Results show the kit catches what we planted, not anything about a real agent.",
        "No third-party agent application has been tested.",
        "No published results or evidence package for this area yet.",
      ],
    },
    links: { kicker: "EVIDENCE / 007", labs: [summaryArticle], evidence: [] },
    cta: {
      title: "Giving agents real permissions?",
      body: "Tell us what your agents can touch and how you check it today. It shapes which fixtures become real integrations first.",
      primary: { label: "Talk to us", href: "/contact#talk" },
    },
  },

  robotics: {
    key: "robotics",
    maturity: "validated",
    maturityNote: "Nav2 · simulation only",
    job: {
      kicker: "WHO IT IS FOR / 001",
      title: "Robots, brokers and devices,",
      titleMuted: "tested where they meet.",
      who: "Teams building ROS 2 robots, cloud-controlled fleets or connected devices that talk through message brokers.",
      job: "Catch the case where the system reports success but the world disagrees, separate it from your own test setup, and keep it as a regression case.",
      note: "A target audience, not a customer list. Nothing runs on physical hardware today.",
    },
    connect: {
      kicker: "WHAT YOU CONNECT / 002",
      title: "What you connect and define.",
      items: [
        { term: "The stack", detail: "A containerized ROS 2 stack, an MQTT broker, or a set of processes." },
        { term: "Ground truth", detail: "What actually happened, recorded by the harness before any fault, for example the simulator's true robot pose." },
        { term: "Faults", detail: "Delays, drops, noise, reordering, restarts and permission changes at the boundaries between components." },
        { term: "Properties", detail: "For example: if the robot reports success, it must truly be within 0.35 m of the goal." },
      ],
    },
    blocks: {
      kicker: "THREE INTEGRATIONS / 003",
      title: "Three integrations, three boundaries.",
      items: [
        {
          id: "nav2",
          name: "ROS 2 / Nav2",
          maturity: "validated",
          maturityNote: "simulation only",
          body: "Stock Nav2 1.3.13 on ROS 2 Jazzy, unmodified, in a pinned container with no network, on a simplified loopback simulator. An exploratory pilot found three violations: all three were harness, oracle or configuration artifacts, and none was a Nav2 defect. The live compatibility gate passed 3/3.",
          boundaries: ["Loopback simulation: no physics, no state estimator.", "No physical robot.", "Reproduction is statistical, not exact."],
          link: { label: "Nav2 walkthrough", href: "/demos/nav2-walkthrough" },
        },
        {
          id: "mqtt",
          name: "MQTT brokers",
          maturity: "experimental",
          maturityNote: "Mosquitto 2.0.22 · NanoMQ 0.25.7",
          body: "Real integrations with the independently maintained Eclipse Mosquitto 2.0.22 and NanoMQ 0.25.7 brokers, checked against rules from the MQTT v5 specification. Results so far are negative: 0 FAIL.",
          boundaries: [
            "Negative results are not evidence that a broker is correct.",
            "The NanoMQ edge bridge is still in progress.",
            "Reproduction is statistical, not exact.",
          ],
          link: { label: "MQTT results in the research summary", href: "/labs/research-summary#mqtt" },
        },
        {
          id: "testbed",
          name: "Four-process reference system",
          maturity: "experimental",
          maturityNote: "our own reference fixture",
          body: "Four separate processes we built (authorization service, broker, controller, actuator), modeling a cloud-to-device command path and checked against four written policy clauses. A planted-control build checks that the policy checks catch a violation we put there on purpose.",
          boundaries: ["Our own system, not production software or hardware.", "Planted-control results are positive controls, not discoveries.", "Exact replay in its lockstep mode only."],
          link: { label: "Evidence package: testbed planted control", href: "/evidence/testbed-planted-control" },
        },
      ],
    },
    sequence: {
      kicker: "ONE RUN, IN SEQUENCE / 004",
      title: "Nav2 said it arrived.",
      conceptual: false,
      ariaLabel: `Sequence from the recorded Nav2 run: the harness sends a goal; transform noise is injected at 4.40 s and laser scans are reordered at 6.52 s; Nav2 reports ${sm.minimized.result.status} at ${sm.minimized.result.tS} s; the simulator's ground truth shows the robot ${sm.verdict.distanceText} from the goal; the truth-vs-claimed check flags success_mismatch.`,
      caption: `Times from the minimized run's recorded trace. Classified as a harness artifact, not a Nav2 defect.`,
      source: sm.traceSources[1],
      actors: [
        { id: "harness", label: "Ordinum harness" },
        { id: "nav2", label: "Nav2 1.3.13" },
        { id: "sim", label: "Simulator (truth)" },
        { id: "check", label: "Check" },
      ],
      steps: [
        { from: "harness", to: "nav2", label: "Goal sent, 0.00 s", tone: "info" },
        { from: "harness", to: "nav2", label: "TF noise σ 0.356 m, 4.40 s", tone: "fault" },
        { from: "harness", to: "nav2", label: "Scans reordered, 6.52 s", tone: "fault" },
        { from: "nav2", to: "check", label: `Reports ${sm.minimized.result.status}, ${sm.minimized.result.tS} s`, tone: "info" },
        { from: "sim", to: "check", label: `True pose ${sm.verdict.distanceText} from goal`, tone: "violation" },
        { from: "check", to: "harness", label: "success_mismatch violated", tone: "verdict" },
      ],
    },
    demo: {
      kicker: "DEMO / 005",
      title: "A real run, step by step.",
      status: "Interactive walkthrough",
      body: `The Nav2 run above, from the recorded traces: reproduced ${sm.reproduction.rate} on fresh seeds, reduced from ${sm.minimization.before} faults to ${sm.minimization.after}, and classified as a harness artifact.`,
      links: [
        { label: "Nav2 walkthrough", href: "/demos/nav2-walkthrough" },
        { label: "Evidence package: Nav2 success mismatch", href: "/evidence/nav2-success-mismatch" },
      ],
    },
    outputs: {
      kicker: "ACTUAL OUTPUTS / 006",
      title: "What the Nav2 run produced.",
      items: [
        { name: "Verdict", detail: `${sm.verdict.invariant} violated: reported success, true pose ${sm.verdict.distanceText} from the goal.` },
        { name: "Reproduction", detail: `${sm.reproduction.rate} on fresh seeds (${sm.reproduction.wilson95Text}).` },
        { name: "Reduced scenario", detail: `${sm.minimization.before} faults reduced to ${sm.minimization.after}; time cap reached, so not verified 1-minimal.` },
        { name: "Trace and report", detail: "Two-channel trace and a self-contained HTML comparison report." },
        { name: "Regression case", detail: `${sm.failureId}.json, which re-checks the failure on ${sm.regressionVerify.storedSeeds} stored seeds.` },
      ],
    },
    fit: {
      kicker: "FIT / 007",
      title: "Prerequisites, custom work, limitations.",
      prerequisites: ["A Linux machine with Docker for Nav2 and the MQTT brokers.", "A containerized stack, or processes you can start locally.", "Permission to test the system."],
      customWork: [
        "Each new stack needs its own adapter. Nav2 needed a large target-specific adapter, which we count as a weakness.",
        "Properties and fault bounds are written per system.",
      ],
      limitations: [
        "Simulation only. Nothing runs on physical hardware, emulated firmware or device transports yet.",
        "The three reproduced Nav2 violations are harness, oracle or configuration artifacts, not Nav2 defects.",
        "MQTT results are negative so far; the testbed is our own reference fixture.",
      ],
    },
    links: { kicker: "EVIDENCE / 008", labs: [nav2Article, summaryArticle], evidence: [
      { label: "Evidence package: Nav2 success mismatch", href: "/evidence/nav2-success-mismatch" },
      { label: "Evidence package: testbed planted control", href: "/evidence/testbed-planted-control" },
    ] },
    cta: {
      title: "Building robots or connected devices?",
      body: "Tell us about the failure your team struggles to reproduce between the cloud, the broker and the device.",
      primary: { label: "Talk to us", href: "/contact#talk" },
      secondary: { label: "See Ordinum in action", href: "/demos" },
    },
  },
} as const satisfies Record<ProductAreaKey, ProductArea>;

/* -------------------------------------------------------------------------- */
/* Roadmap (/roadmap)                                                          */
/* -------------------------------------------------------------------------- */

export type RoadmapItem = { readonly name: string; readonly maturity: Maturity; readonly body: string };

/** Founder decision: Transactions is "In progress" only, with no numbers and no product page. */
export const roadmap = {
  items: {
    kicker: "ROADMAP / 001",
    title: "What is next,",
    titleMuted: "labeled for what it is.",
    lede: "Nothing below is built yet. In progress means partly built and not runnable as a product; Planned means not started.",
    list: [
      { name: "Transactions", maturity: "in-progress", body: "Testing for transaction and ledger systems. In development; no results are published." },
      { name: "NanoMQ edge bridge", maturity: "in-progress", body: "A second broker bridged to Mosquitto, for edge-to-cloud scenarios." },
      { name: "Native fuzzing", maturity: "planned", body: "Fuzzing native code and binaries, reporting into the same verification layer." },
      { name: "Emulated firmware", maturity: "planned", body: "Firmware running under emulation, tested through the same adapters and checks." },
      { name: "Device transport", maturity: "planned", body: "Driving real device links from the harness." },
      { name: "Physical hardware", maturity: "planned", body: "Hardware in the loop. Nothing runs on physical hardware today." },
    ],
  },
} as const satisfies {
  items: { kicker: string; title: string; titleMuted: string; lede: string; list: readonly RoadmapItem[] };
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
  classification: "Controlled positive control — a defect planted in Ordinum's own test harness, not a PocketBase bug",
  mp4: "/media/flagship-failure-to-verified-fix.mp4",
  webm: "/media/flagship-failure-to-verified-fix.webm",
  poster: "/media/flagship-failure-to-verified-fix-poster.jpg",
  captions: "/media/flagship-failure-to-verified-fix.en.vtt",
  transcript: "/media/flagship-failure-to-verified-fix-transcript.txt",
} as const;

export const demos = {
  kicker: "DEMOS / 001",
  title: "Three runs.",
  titleMuted: "Each labeled before any number.",
  /** The flagship card plays the recorded run (flagshipVideo); the others link to their evidence. */
  cards: [
    {
      id: "flagship",
      title: "Failure to verified fix",
      label: FLAGSHIP_LABEL,
      classes: ["positive-control"],
      body: "PocketBase 0.40.6, unmodified. We planted a stale read cache in our own client path; ordinum verify found it, confirmed it, showed it needs only one fault, then showed that the fix removes it.",
      status: "Recorded run · 1:35 · captions",
      stats: flagship.stats,
      links: [
        { label: "Evidence package", href: "/evidence/pocketbase-verified-fix" },
        { label: "Case study", href: "/labs/from-failed-authorization-test-to-verified-fix" },
      ],
    },
    {
      id: "nav2",
      title: "Nav2 said it arrived",
      label: `${EVIDENCE_CLASS_LABELS["real-external-target"]} · ${EVIDENCE_CLASS_LABELS["harness-artifact"]}`,
      classes: ["real-external-target", "harness-artifact"],
      body: `Stock Nav2 reported ${sm.minimized.result.status} while the robot was ${sm.verdict.distanceText} from the goal. Reproduced ${sm.reproduction.rate}, reduced, and classified as our own fault configuration, not a Nav2 defect.`,
      status: "Interactive walkthrough",
      links: [
        { label: "Step through the run", href: "/demos/nav2-walkthrough" },
        { label: "Evidence package", href: "/evidence/nav2-success-mismatch" },
      ],
    },
    {
      id: "testbed",
      title: "A planted violation in our own testbed",
      label: EVIDENCE_CLASS_LABELS["positive-control"],
      classes: ["positive-control"],
      body: "A defect planted in a build of our four-process reference system (authorization service, broker, controller, actuator), used to check that its policy checks catch a violation end to end. Not a discovery.",
      status: "Report and regression case",
      links: [{ label: "Evidence package", href: "/evidence/testbed-planted-control" }],
    },
  ],
  note: "The flagship recording replays real terminal output at the speeds shown on screen. Every number on this page comes from a recorded run, and each evidence package lists its source revision.",
} as const satisfies {
  kicker: string;
  title: string;
  titleMuted: string;
  cards: readonly DemoCard[];
  note: string;
};

/* -------------------------------------------------------------------------- */
/* Security (/security): operating boundaries                                  */
/* -------------------------------------------------------------------------- */

export type BoundaryRow = { readonly id: string; readonly title: string; readonly body: string; readonly caveat?: string };

export const security = {
  scope: {
    kicker: "SCOPE / 001",
    title: "What Ordinum is allowed to test.",
    body: "Ordinum tests local simulations, our own targets, authorized open-source software, or systems a user provides and is authorized to test. It does not scan external systems or drive physical actuators.",
  },
  boundaries: {
    kicker: "OPERATING BOUNDARIES / 002",
    title: "Where runs execute,",
    titleMuted: "and what they can touch.",
    rows: [
      {
        id: "local-execution",
        title: "Local execution",
        body: "Runs execute on the machine where you start them. The engine runs on a single machine; there is no hosted service and no cloud execution.",
      },
      {
        id: "permissions",
        title: "Permissions",
        body: "The Nav2 container drops all Linux capabilities and sets no-new-privileges. Testbed components run as separate python -I processes with an audit-hook guard that restricts socket paths and file writes.",
        caveat: "The Nav2 container runs as root, with capabilities dropped.",
      },
      {
        id: "network",
        title: "Network namespaces",
        body: "The Nav2 container has no network. Each testbed component gets its own empty network namespace when available, which blocks IP but not filesystem sockets. MQTT brokers listen only on 127.0.0.1 random ports, on per-session networks. The recorded PocketBase run executed inside a fresh network namespace with only loopback (unshare -rn), without Docker.",
        caveat: "Network namespaces may be unavailable on some CI runners. The MQTT setup has no explicit egress firewall, and the opt-in edge bridge proxy binds the Docker gateway interface, not loopback.",
      },
      {
        id: "resource-limits",
        title: "Resource limits",
        body: "Nav2 runs with a memory cap and a host memory guard. Each testbed component has resource limits (512 MiB address space, file and core limits). Heavy jobs run in a memory-capped scope; infrastructure failures become INFRA_ERROR, never findings.",
      },
      {
        id: "cleanup",
        title: "Cleanup",
        body: "All four testbed components are restarted for every run. The Nav2 compatibility gate checks that no containers are left behind.",
      },
      {
        id: "artifacts",
        title: "Artifacts and data",
        body: "Traces, reports and regression cases are local files you keep. Evidence published on this site was exported by hand: each file was scanned for local paths, usernames, hostnames, emails, tokens and keys, and local paths were replaced with placeholders such as <repo>.",
        caveat: "Do not send us credentials, customer data or unpatched vulnerability details through the contact form.",
      },
    ],
  },
  sandbox: {
    kicker: "NOT A UNIVERSAL SANDBOX / 003",
    title: "Safety nets, not a sandbox.",
    body: "These measures keep tests of authorized systems contained. They are not a sandbox for running untrusted code, and the testbed's guard is a safety net rather than a security boundary. Run Ordinum only against systems you are allowed to test.",
  },
  fidelity: {
    kicker: "WHAT RUNS WHERE / 004",
    title: "Simulation, local software,",
    titleMuted: "emulated devices, hardware.",
    rows: [
      { tier: "Simulation", examples: "ROS 2 / Nav2 on a loopback simulator", maturity: "validated", note: "simulation only" },
      { tier: "Local software", examples: "PocketBase, Mosquitto and NanoMQ, the four-process testbed, agent fixtures", maturity: "experimental", note: "one host" },
      { tier: "Emulated device", examples: "Firmware under emulation, device transports", maturity: "planned", note: "not built" },
      { tier: "Physical hardware", examples: "Hardware in the loop", maturity: "planned", note: "not built" },
    ],
  },
  ci: {
    title: "Hosted CI",
    body: HOSTED_CI_STATUS,
  },
  contact: {
    kicker: "CONTACT / 005",
    title: "Report a security concern.",
    body: `Email ${site.email}. Please describe the issue without including credentials or unpatched details of third-party systems; we will reply with a safe way to share more.`,
    cta: { label: `Email ${site.email}`, href: `mailto:${site.email}` },
  },
} as const satisfies {
  scope: { kicker: string; title: string; body: string };
  boundaries: { kicker: string; title: string; titleMuted: string; rows: readonly BoundaryRow[] };
  sandbox: { kicker: string; title: string; body: string };
  fidelity: {
    kicker: string;
    title: string;
    titleMuted: string;
    rows: readonly { tier: string; examples: string; maturity: Maturity; note: string }[];
  };
  ci: { title: string; body: string };
  contact: { kicker: string; title: string; body: string; cta: Link };
};

/* -------------------------------------------------------------------------- */
/* Technology page (seven sections, in order)                                  */
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
    /** /products #architecture. */
    id: "architecture",
    kicker: "ARCHITECTURE / 003",
    title: "Three tiers.",
    titleMuted: "One verification layer in the middle.",
    lede: "Systems connect through adapters into a shared engine, which feeds engineering workflows. Every node carries its own maturity label.",
    tiers: [
      {
        id: "adapters",
        name: "Systems, through adapters",
        nodes: [
          { name: "ROS 2 / Nav2, in simulation", maturity: "validated", note: "Simulation only.", facts: ["A3"] },
          { name: "Toy robot (our own)", maturity: "validated", note: "Planted bugs as positive controls.", facts: ["A2"] },
          { name: "PocketBase 0.40.6, local", maturity: "experimental", note: "Fix verification on a planted control.", facts: ["release"] },
          { name: "Agents kit", maturity: "experimental", note: "Planted reference fixtures only.", facts: ["release"] },
          { name: "Mosquitto 2.0.22 and NanoMQ 0.25.7", maturity: "experimental", note: "Negative results so far.", facts: ["release"] },
          { name: "Four-process testbed (our own)", maturity: "experimental", note: "Reference fixture with a planted control.", facts: ["A6"] },
          { name: "NanoMQ edge bridge", maturity: "in-progress", facts: ["A5"] },
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
          { name: "Independent checks", maturity: "validated", facts: ["B2", "B4"] },
          { name: "Reproduction", maturity: "validated", facts: ["B7"] },
          { name: "Minimization", maturity: "validated", facts: ["B6"] },
          {
            name: "HTML reports",
            maturity: "validated",
            note: "Single-target view validated; multi-process lanes view experimental; no committed MQTT or testbed report.",
            facts: ["B9"],
          },
          { name: "Build comparison", maturity: "experimental", note: "Affected vs fixed build, with a statistical test.", facts: ["B5", "release"] },
          { name: "Fix verification", maturity: "experimental", note: "FIX_VERIFIED requires the property to be exercised. Planted controls only.", facts: ["release"] },
        ],
      },
      {
        id: "workflows",
        name: "Engineering workflows",
        nodes: [
          { name: "Regression cases", maturity: "validated", note: "Self-contained JSON cases.", facts: ["B8"] },
          { name: "Local runner: ordinum ci", maturity: "experimental", note: "Local only.", facts: ["release"] },
          { name: "Hosted CI integration", maturity: "planned", facts: ["A9"] },
        ],
      },
    ],
    note: "Single machine, Python today. A handful of targets demonstrate the contract; that does not mean every kind of system is supported.",
  },
  reproduction: {
    /** /products #reproduction. */
    id: "reproduction",
    kicker: "REPRODUCTION & MINIMIZATION / 004",
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
        caveat: "On stochastic targets, zero failures in 10 seeded runs is evidence, not proof. Fix verification has so far been shown only on planted controls. No hosted CI integration yet.",
        facts: ["B8", "A9"],
      },
    ],
  },
  limitations: {
    /** /security #limitations. */
    id: "limitations",
    kicker: "CURRENT LIMITATIONS / 006",
    title: "What it does not do yet.",
    items: [
      "Runs on a single machine. No distributed runner, no cloud execution.",
      "Regression cases run locally with ordinum ci; there is no hosted CI integration.",
      "No hardware, firmware or hardware-in-the-loop support. Nav2 runs in a simplified simulation.",
      "Every end-to-end fix demonstration uses a planted control.",
      "The cross-system testbed is our own reference fixture, not production software.",
      "The NanoMQ edge bridge is still in progress.",
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
        "Independent checks that catch a mismatch between what a system reports and what actually happened.",
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
        "A stable MQTT edge bridge, and planted controls on more targets.",
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
    conclusion:
      "No confirmed finding and no Unresolved result. Nothing here is a Mosquitto bug. Since then, Mosquitto 2.0.22 and NanoMQ 0.25.7 run as real integrations, and campaigns at the stable checkpoint 768a9b5 returned 0 FAIL: negative results.",
    limits: [
      "One exploratory campaign. It ran before a later round of review fixes, and it needs Docker, with no committed artifact.",
      "The MQTT adapter records ambiguous cases with target-side markers rather than the core Unresolved verdict.",
      "The NanoMQ edge bridge is still in progress.",
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
      { k: "Test suite", v: "523 tests passing, 1 skipped (validation log, 2026-10-23). The skip is the Docker-gated Nav2 smoke test, which was run live instead." },
      { k: "Pre-registration", v: "The frozen pre-registered evidence re-verifies at tag prereg-frozen-2026-10-23: code and configuration locks, not a recomputation of raw results." },
      { k: "Nav2 compatibility", v: "Live gate passed on 23 October 2026: 2 of 2 nominal runs, 1 of 1 fault smoke test, no leftover containers." },
      { k: "Artifacts", v: FACT_SOURCE.artifactsNote },
      { k: "Source", v: FACT_SOURCE.researchNote },
      { k: "Hosted CI", v: HOSTED_CI_STATUS },
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
    title: "How results are produced and labeled.",
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
    kicker: "THE AMBITION / 002",
    title: "Reliability and security live at the boundaries.",
    body: [
      "Modern systems are assembled from software, AI models, infrastructure, firmware and hardware, built by different teams and tested in different ways. We think many of the hardest failures and security problems begin where those parts meet.",
      "Ordinum's ambition is a continuous adversarial testing and verification platform that spans software and hardware: one layer where specialized testing engines run, failures are verified and reproduced, and the evidence becomes tests that keep problems fixed.",
    ],
  },
  scope: {
    title: "Long-term scope",
    items: [
      "Web applications and APIs",
      "Backend and distributed services",
      "Cloud infrastructure and messaging",
      "AI models and agents",
      "Embedded firmware and devices",
      "Robotics and autonomous systems",
      "Industrial and physical infrastructure",
    ],
    note: "Destination, not current support. One engine does not test everything: each domain needs its own adapters and engines.",
  },
  whyNow: {
    kicker: "WHY NOW / 003",
    title: "More connected products, more scrutiny.",
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
    note: "Neither regulation requires any particular testing method. Both raise the question of what was tested, and whether failures can be reproduced.",
    facts: ["J1", "J2"],
  },
  tools: "Specialized security and testing tools will remain essential. We expect to integrate and coordinate with them, not replace them.",
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
      "Armaan's work on low-level fuzzing, multi-agent engineering and production systems led to one question: how can complex systems be continuously tested for failures that emerge from their interactions, rather than inside one component?",
      "We started with ROS 2 / Nav2 because it is public, independently maintained and built from many communicating components, so we could test code we did not write and build a repeatable adapter pattern.",
      "The question was never about robots. The same engine now runs PocketBase, two MQTT brokers, a four-process software testbed that models a cloud-to-device command path, and agent fixtures, and the vision covers software, AI, infrastructure, firmware and hardware.",
    ],
  },
  fit: {
    kicker: "WHAT WE BRING / 002",
    title: "Experience that maps to the problem.",
    items: [
      { title: "Fuzzing and product security", body: "Automated search for inputs and conditions nobody wrote a test for." },
      { title: "Production observability", body: "Turning what happened in a running system into something an engineer can act on." },
      { title: "Multi-agent systems", body: "Many components acting on shared, imperfect state." },
      { title: "Evidence discipline", body: "The engine, its targets and the research on this site were built in-house and are reported with their limitations." },
    ],
  },
  team: {
    kicker: "THE TEAM / 003",
    /* Non-breaking hyphen (U+2011) so the display heading never breaks as "co-" / "founders". */
    title: "Two co‑founders.",
    lede: "Ordinum is being built by Armaan Singla and Aarav Singla.",
  },
  founders: [armaan, aarav],
  independence:
    "Ordinum is independent. It is not affiliated with or endorsed by any current or past employer of its founders, and it contains no employer code or confidential material.",
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
    /** Anchor id; hero and CTA links point to /contact#talk. */
    id: "talk",
    kicker: "TALK TO US / 001",
    title: "Talk to the founders.",
    body: "A 30-minute call about your system and the failures your team finds hardest to reproduce.",
    calCta: { label: "Book a 30-min call", href: site.calUrl },
    emailCta: { label: `Email ${site.email}`, href: `mailto:${site.email}` },
  },
  inquiry: {
    id: "inquiry",
    kicker: "SEND AN INQUIRY / 002",
    title: "Or send a short note.",
    body: "Only your work email is required.",
  },
  partnership: {
    title: "What a design partnership means right now",
    items: [
      "A conversation about your hardest cross-component failures: what breaks, how you find it today, and what makes it hard to reproduce.",
      "If you build on ROS 2 / Nav2, that is where the engine is most mature. For other stacks, what we learn decides which adapters we build next.",
      "Research-stage: no product to buy, no pricing and no pilot terms yet.",
    ],
  },
  form: {
    /** id for the <form> wrapper. */
    anchorId: "contact-form",
    emailLabel: "Work email",
    companyLabel: "Company",
    workingOnLabel: "What are you working on?",
    workingOnHint: "For example: a robot fleet, an IoT platform, a set of services.",
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
    submit: "Send",
    pending: "Sending",
    successKicker: "Message received",
    successFollowUp: "If you would rather talk now, pick a time that works for you.",
    messages: {
      success: "Thanks. Your message was saved, and the founders will read it.",
      rateLimited: `We've received several messages from this email in the last hour, so this one was not saved. Please try again later, or email ${site.email}.`,
      invalid: "Check the highlighted fields and try again.",
      tooFast: "That was quick. Take a moment to check your details, then submit again.",
      error: `Something went wrong on our side and your message was not saved. Please try again, or email ${site.email}.`,
    },
  },
} as const satisfies {
  talk: { id: string; kicker: string; title: string; body: string; calCta: Link; emailCta: Link };
  inquiry: { id: string; kicker: string; title: string; body: string };
  partnership: { title: string; items: readonly string[] };
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
  thesis: "Adversarial testing and verification for systems whose failures emerge between components.",
  columns: [
    {
      title: "Products",
      links: [
        { label: "Platform overview", href: "/products" },
        { label: "Software & APIs", href: "/products/software" },
        { label: "AI Agents", href: "/products/agents" },
        { label: "Robotics & Connected Systems", href: "/products/robotics" },
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
        { label: "Talk to us", href: "/contact#talk" },
        { label: "Book a 30-min call", href: site.calUrl, external: true },
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
  secondaryCta: { label: "Talk to the founders", href: "/contact#talk" },
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
      title: "One engine.",
      titleMuted: "Three product areas.",
      lede: "Ordinum connects a system through an adapter, runs it under controlled faults, checks what actually happened, and keeps reproducible failures as regression cases. The same engine runs software, agent fixtures and robotics stacks.",
    },
    meta: {
      title: "Platform overview",
      description:
        "How Ordinum works: the four-stage workflow, the engine's capabilities at the stable checkpoint (search, confirm, minimize, replay, compare, verify, local ci, reports), its architecture and what an engineer receives.",
    },
  },
  software: {
    href: "/products/software",
    label: "Software & APIs",
    header: {
      kicker: "Software & APIs",
      title: "From a failed authorization test",
      titleMuted: "to a verified fix.",
      lede: "Ordinum drives a running service under your access policy, catches the read or write that should not happen, and shows with numbers that a fix removes it. Shown so far on unmodified PocketBase with a defect we planted ourselves.",
    },
    meta: {
      title: "Software & APIs",
      description:
        "Authorization and concurrency testing for local services, with a verified-fix workflow. Flagship run on unmodified PocketBase 0.40.6: a planted control, FIX_VERIFIED, affected 10/10 vs fixed 0/10.",
    },
  },
  agents: {
    href: "/products/agents",
    label: "AI Agents",
    header: {
      kicker: "AI Agents",
      title: "Agent authority",
      titleMuted: "and resource effects.",
      lede: "Check that an AI agent's actions stay inside the authority it was granted, judged on what actually changed. Today the agents kit runs on reference fixtures with planted defects only.",
    },
    meta: {
      title: "AI Agents",
      description:
        "Testing AI agent authority and resource effects with Ordinum's agents kit. Reference fixtures with planted defects only; no third-party agent application tested yet.",
    },
  },
  robotics: {
    href: "/products/robotics",
    label: "Robotics & Connected Systems",
    header: {
      kicker: "Robotics & Connected Systems",
      title: "When the robot says it arrived,",
      titleMuted: "check where it is.",
      lede: "ROS 2 / Nav2 in simulation, MQTT brokers, and a four-process reference system modeling a cloud-to-device command path, each with its own boundaries.",
    },
    meta: {
      title: "Robotics & Connected Systems",
      description:
        "Ordinum for robotics and connected systems: ROS 2 / Nav2 in simulation (built & validated), Mosquitto and NanoMQ brokers and a four-process reference testbed (experimental), with their boundaries.",
    },
  },
  roadmap: {
    href: "/roadmap",
    label: "Roadmap",
    header: {
      kicker: "Roadmap",
      title: "Every system deserves to be tested",
      titleMuted: "beyond its assumptions.",
      lede: "What is in progress, what is planned, and the long-term direction: one verification layer from software to hardware.",
    },
    meta: {
      title: "Roadmap",
      description:
        "Ordinum's roadmap: transactions in progress; native fuzzing, emulated firmware, device transport and physical hardware planned. The long-term direction and why now.",
    },
  },
  demos: {
    href: "/demos",
    label: "Demos",
    header: {
      kicker: "See Ordinum in action",
      title: "Real runs,",
      titleMuted: "labeled for what they are.",
      lede: "A planted failure taken to a verified fix, a real Nav2 run classified as our own harness artifact, and a planted violation in our own testbed. Each links to its evidence.",
    },
    meta: {
      title: "Demos",
      description:
        "Real Ordinum runs: failure to verified fix on PocketBase (planted control), a Nav2 walkthrough (harness artifact, not a Nav2 defect) and a testbed planted control, each with its evidence package.",
    },
  },
  nav2Walkthrough: {
    href: "/demos/nav2-walkthrough",
    label: "Nav2 walkthrough",
    header: {
      kicker: "Demos · Nav2 walkthrough",
      title: "A real run,",
      titleMuted: "step by step.",
      lede: "Ordinum testing stock ROS 2 Nav2 under injected faults: what it checked, what it saw, how it reproduced the failure, and why we classified it as our own harness artifact.",
    },
    meta: {
      title: "Nav2 walkthrough",
      description:
        "An interactive walkthrough of a real Ordinum run on ROS 2 Nav2: system, property, injected faults, observed behavior, verdict, reproduction and the regression case, labeled as a harness artifact, not a Nav2 defect.",
    },
  },
  labs: {
    href: "/labs",
    label: "Ordinum Labs",
    header: {
      kicker: "Ordinum Labs",
      title: "Research and case studies,",
      titleMuted: "with their evidence.",
      lede: "Each article states its question, the system under test, the method, the results and their limitations, and links to the files behind them.",
    },
    meta: {
      title: "Labs",
      description:
        "Ordinum Labs: case studies and research with their evidence: a verified fix on a planted PocketBase control, a Nav2 success mismatch classified as a harness artifact, and a research summary.",
    },
  },
  security: {
    href: "/security",
    label: "Security",
    header: {
      kicker: "Security",
      title: "Operating boundaries.",
      titleMuted: "What a run can touch.",
      lede: "Where Ordinum runs, the permissions, network and resource limits it applies, how it handles artifacts, and what it is not.",
    },
    meta: {
      title: "Security",
      description:
        "Ordinum's operating boundaries: local execution, permissions, network namespaces, resource limits, cleanup, artifact handling, simulation vs local software vs hardware, and how to report a concern.",
    },
  },
  about: {
    href: "/about",
    label: "About",
    header: {
      kicker: "About",
      title: "The founders",
      titleMuted: "building Ordinum.",
      lede: "Why we are building it, what we bring to it, and why the scope is broader than robotics.",
    },
    meta: {
      title: "About",
      description: "Ordinum is being built by co-founders Armaan Singla and Aarav Singla.",
    },
  },
  contact: {
    href: "/contact",
    label: "Contact",
    /* No header: /contact renders ClosingCTA (contact.talk) as its page heading. */
    meta: {
      title: "Contact",
      description: "Talk to Ordinum's founders about pilots, technical demonstrations and research collaboration.",
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
export const pageOrder = ["products", "software", "agents", "robotics", "roadmap"] as const satisfies readonly PageKey[];
