/**
 * Ordinum copy deck (focused, investor-ready site, 24 October 2026).
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
 *   - Reviews are "a separate adversarial review", never an external or named party.
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
  commit: "124dde072ab7d143cafa722bad80c61970740156",
  commitShort: "124dde072",
  checkedOn: "24 October 2026",
  /** The demo artifacts in lib/evidence.ts were copied at this commit and are unchanged at `commit`. */
  artifactsCommitShort: PRODUCT_SOURCE.commitShort,
  note: `Technical statements on this site reflect the ${PRODUCT_SOURCE.branch} research branch at commit 124dde072, checked on 24 October 2026.`,
  artifactsNote: `Demo artifacts were copied at commit ${PRODUCT_SOURCE.commitShort} and are unchanged at 124dde072.`,
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
    title: "Ordinum — Find failures that only appear when systems interact",
    description:
      "Ordinum runs adversarial tests against complex software, checks what actually happened, and turns reproducible failures into regression tests. Research-stage, with a working ROS 2 / Nav2 integration and experimental cross-system integrations.",
    ogTitle: "Ordinum — Find failures that only appear when systems interact",
    ogDescription:
      "Adversarial testing and verification for systems built from interacting parts. Research-stage; see a real run, labeled for what it is.",
    twitterTitle: "Ordinum — Find failures that only appear when systems interact",
    twitterDescription:
      "Adversarial testing and verification for systems built from interacting parts. Research-stage; see a real run, labeled for what it is.",
  },
  /** Organization JSON-LD description (app/layout.tsx). */
  organizationDescription:
    "Ordinum is building testing and verification infrastructure that runs adversarial failure scenarios against complex, interacting systems.",
  /** Per-page full titles for OG/Twitter. pages[*].meta.title stays short for the "%s · Ordinum" template. */
  pages: {
    demo: "See Ordinum in action — A real run, step by step",
    product: "Product — What you connect and what you get back",
    technology: "Technology — How Ordinum executes, verifies and reproduces",
    research: "Research — What we have shown, and what we have not",
    vision: "Vision — From working targets to a shared verification layer",
    about: "About — The founders building Ordinum",
    contact: "Contact — Talk to the founders",
    terms: "Website Terms (Draft)",
    privacy: "Privacy Notice (Draft)",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export const nav = {
  /** /demo is reached from the hero and CTAs; it is intentionally not a nav item. */
  links: [
    { label: "Product", href: "/product" },
    { label: "Technology", href: "/technology" },
    { label: "Research", href: "/research" },
    { label: "Vision", href: "/vision" },
    { label: "About", href: "/about" },
  ],
  bookCall: { label: "Book a call", href: site.calUrl },
  /** Primary header CTA. Key kept as `demo` so existing Navbar/MobileMenu code compiles. */
  demo: { label: "Talk to us", href: "/contact#talk" },
} as const satisfies {
  links: readonly Link[];
  bookCall: Link;
  demo: Link;
};

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
  /** Longer description for /technology. */
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
      "No CI integration yet: regression cases are JSON files plus a pytest runner.",
      "No language model in the loop.",
    ],
    facts: ["A1", "B1", "B3", "B6", "B7", "B8", "B9"],
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
      "Four separate processes we built (authorization service, broker, controller, actuator), checked against four written policy clauses. Only the correctly behaving build exists so far.",
    detail:
      "A four-process software testbed that models a cloud-to-device command path. Each component is a separate OS process, connected only through a harness fabric. The engine judges runs against four written policy clauses with causal (happened-before) checks, because the components have independent clocks. Only the lockstep, correctly behaving build runs today, and it replays exactly in our measurements (one development machine; volatile resource metadata excluded from the hash).",
    limits: [
      "Our own system under test, not production software, hardware or a customer system.",
      "Only the correctly behaving build exists; planted-defect variants are planned.",
      "Broker message faults have no policy check yet.",
    ],
    facts: ["A6", "D1", "D2", "D3", "B10"],
  },
  {
    id: "mqtt",
    name: "MQTT adapter (Eclipse Mosquitto)",
    maturity: "experimental",
    targetKind: "Real external target",
    summary:
      "Runs scenarios against the independently maintained Mosquitto 2.0.22 broker. One exploratory campaign; no confirmed finding.",
    detail:
      "The engine's own supervisor runs MQTT scenarios end to end against a locally isolated Mosquitto 2.0.22 broker, with three checks taken from the MQTT v5 specification and Mosquitto's dynamic-security rules: no duplicate delivery of a QoS 2 message (the at-most-once half of MQTT v5 §4.3.3; ambiguous cases are recorded as cannot-judge), no delivery after a committed publish-deny, and durable-session redelivery.",
    limits: [
      "One 12-scenario exploratory campaign so far.",
      "Broker restarts can break the harness's own connections (recorded as infrastructure errors).",
      "The full campaign needs Docker and has no committed artifact.",
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
    name: "CI integration",
    maturity: "planned",
    summary: "GitHub Actions and GitLab integration. Today, regression cases run through a pytest runner.",
    detail: "Regression cases are self-contained JSON files executed by a pytest runner in the repository. A CI integration is planned.",
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
    "Built first for engineering and product-security teams whose software spans cloud services, message brokers, devices and robots.",
  primaryCta: { label: "See Ordinum in action", href: "/demo" },
  secondaryCta: { label: "Talk to the founders", href: "/contact#talk" },
  status: "Research-stage · Working robotics integration · Experimental MQTT and cross-system testbed integrations",
  /** Mono meta row; meta[0] is also the OG image footer. */
  meta: ["RESEARCH-STAGE", "ROS 2 / NAV2 · MQTT · CROSS-SYSTEM TESTBED"],
  visual: {
    ariaLabel:
      "Diagram of Ordinum's four stages. Connect: a target adapter runs the system and records ground truth. Stress-test: delays, drops, restarts and permission changes. Verify: properties checked on harness ground truth. Reproduce and prevent: re-run on fresh seeds, reduced, saved as a JSON test.",
    note: "CONCEPTUAL",
    stages: WORKFLOW_STAGES.map((s) => ({ id: s.id, label: s.label, caption: s.caption })),
    regressionLabel: "Regression case",
    /** Connect readout: the adapters that exist today (maturity is in the status line). */
    targets: "Nav2 · MQTT · testbed",
    /** Under the visual: the four stages in full live on /technology. */
    link: { label: "The full seven-stage lifecycle", href: "/technology#lifecycle" },
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

export const home = {
  problem: {
    kicker: "THE PROBLEM / 001",
    title: "Every part passes its tests.",
    titleMuted: "The system still does the wrong thing.",
    /** Rendered as a compact causal sequence. Must carry the CONCEPTUAL tag. */
    example: {
      tag: "CONCEPTUAL EXAMPLE",
      ariaLabel:
        "Conceptual sequence: a cloud service authorizes a command, a broker delays the message, the permission is revoked, a controller restarts, and the device acts on a permission that no longer exists.",
      steps: [
        { n: "1", actor: "Cloud service", event: "Authorizes a command", tone: "info" },
        { n: "2", actor: "Broker", event: "Delays the message", tone: "fault" },
        { n: "3", actor: "Authorization", event: "Permission is revoked", tone: "info" },
        { n: "4", actor: "Controller", event: "Restarts mid-operation", tone: "fault" },
        { n: "5", actor: "Device", event: "Acts on a revoked permission", tone: "violation" },
      ],
      caption:
        "Each component looks healthy on its own. Together, the resulting action may violate the intended authorization policy.",
    },
    body: "Component tests can miss these interactions: the delay, the restart and the permission change happen in different parts of the system, at the same moment. Integration suites, chaos experiments and distributed-systems testing tools address parts of this. Ordinum is testing whether coordinated faults across components, judged by independent checks, find what they miss.",
    /** Optional footnote: a public, verified example of this class of failure. Not found by Ordinum. */
    precedent: {
      text: "A public example of this class: CVE-2021-34434. In Eclipse Mosquitto 2.0 to 2.0.11 with dynamic security, revoking a subscribe permission while a durable client was offline left its existing subscriptions active. Ordinum did not find this issue.",
      href: "https://cveawg.mitre.org/api/cve/CVE-2021-34434",
      label: "CVE record",
    },
    facts: ["J3", "D2"],
  },

  /** Section 3: the product working. Steps come from demoWalkthrough (shared with /demo). */
  demo: {
    kicker: "A REAL RUN / 002",
    title: "Nav2 said it arrived.",
    titleMuted: `The robot was ${sm.verdict.distanceText} off.`,
    lede: "One real failure on stock ROS 2 Nav2, open-source robot navigation software, under injected faults: caught, reproduced, reduced, then classified.",
    /** Which walkthrough fields the home page shows (short form only). */
    showSteps: ["system", "property", "faults", "observed", "verdict", "reproduction", "regression"],
    primaryCta: { label: "See the full walkthrough", href: "/demo" },
    secondaryCta: { label: "Read the research", href: "/research" },
  },

  /*
   * What Ordinum does (four stages): carried by the hero visual (WORKFLOW_STAGES captions),
   * not repeated as a separate home section. The full lifecycle is on /technology#lifecycle.
   */

  /** Section 4: actual progress and platform vision. */
  progress: {
    kicker: "PROGRESS / 003",
    title: "What works today.",
    titleMuted: "Where it is going.",
    items: ["core", "nav2", "xsys", "mqtt", "nanomq"] as const satisfies readonly IntegrationId[],
    planned: {
      name: "Next integrations",
      label: MATURITY_LABELS.planned,
      text: "CI integration, and specialized engines for APIs, firmware, AI agents and hardware.",
    },
    vision:
      "Ordinum is building toward a common testing and verification layer for software, AI, infrastructure, firmware and physical systems.",
    /** One sourced "why now" line; the full, cited version (with its caveat) is on /vision#why-now. */
    whyNow: {
      label: "Why now",
      text: "From 11 September 2026, the EU Cyber Resilience Act requires manufacturers of hardware and software products to report actively exploited vulnerabilities and severe incidents.",
      link: { label: "Why now, with sources", href: "/vision#why-now" },
    },
    links: [
      { label: "How it is built", href: "/technology" },
      { label: "The vision", href: "/vision" },
    ],
  },

  /** Section 5: founders and closing CTA. */
  founders: {
    kicker: "FOUNDERS / 004",
    title: "From fuzzing agents",
    titleMuted: "to testing between systems.",
    /** Team thesis from the verified /about story (about.story[0]). No employer endorsement. */
    lede: "Armaan's work on fuzzing agents, production observability and multi-agent systems led to Ordinum's question: how do you continuously test for failures that emerge between components, not inside one?",
    /** Short lines; full story on /about. Same people as about.founders. */
    people: [
      {
        name: "Armaan Singla",
        role: "Co-founder",
        line: "Computer Engineering at Queen's University. Builds fuzzing agents as a software engineering intern in AMD's Product Security Office; earlier, production observability and multi-agent systems.",
        linkedin: site.founderLinkedin,
      },
      {
        name: "Aarav Singla",
        role: "Co-founder",
        line: "Computer Engineering student at McMaster University.",
        linkedin: site.cofounderLinkedin,
      },
    ],
    link: { label: "About the team", href: "/about" },
  },
} as const satisfies {
  problem: {
    kicker: string;
    title: string;
    titleMuted: string;
    example: { tag: string; ariaLabel: string; steps: readonly CausalStep[]; caption: string };
    body: string;
    precedent: { text: string; href: string; label: string };
    facts: readonly FactRef[];
  };
  demo: {
    kicker: string;
    title: string;
    titleMuted: string;
    lede: string;
    showSteps: readonly DemoStepId[];
    primaryCta: Link;
    secondaryCta: Link;
  };
  progress: {
    kicker: string;
    title: string;
    titleMuted: string;
    items: readonly IntegrationId[];
    planned: { name: string; label: string; text: string };
    vision: string;
    whyNow: { label: string; text: string; link: Link };
    links: readonly Link[];
  };
  founders: {
    kicker: string;
    title: string;
    titleMuted: string;
    lede: string;
    people: readonly { name: string; role: string; line: string; linkedin: string }[];
    link: Link;
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
  secondary: { label: "See Ordinum in action", href: "/demo" },
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
    body: "The injected noise (σ 0.356 m on the odom→base_footprint transform, from 4.40 s to the end of the run) is physically unrealistic, and this setup has no state estimator to reject it, so the fault corrupted the robot's only position source. A separate adversarial review, briefed to argue against the classification, upheld it.",
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
      text: "Broker and cross-system testbed runs (experimental) are on the Research page:",
      links: [
        { label: "MQTT integration", href: "/research#mqtt", note: `${EVIDENCE_CLASS_LABELS["harness-artifact"]} · no confirmed finding` },
        { label: "Cross-system testbed", href: "/research#cross-system-testbed", note: EVIDENCE_CLASS_LABELS["expected-behavior"] },
      ],
    },
  },
  /**
   * Caption script for a FUTURE recorded walkthrough video (30-60 s). NOT rendered: no video
   * exists yet. Every cue restates a value from the walkthrough above.
   */
  captionScript: [
    { start: "00:00", end: "00:05", text: "A real run: Ordinum testing stock ROS 2 Nav2 in simulation." },
    { start: "00:05", end: "00:11", text: "The property: if Nav2 reports success, the robot must truly be within 0.35 m of the goal." },
    { start: "00:11", end: "00:18", text: "Ordinum injects faults: noise on the position transform at 4.40 s, reordered laser scans at 6.52 s." },
    { start: "00:18", end: "00:24", text: "At 11.61 s, Nav2 reports SUCCEEDED. Ground truth: 0.80 m from the goal." },
    { start: "00:24", end: "00:30", text: "The independent check flags success_mismatch." },
    { start: "00:30", end: "00:37", text: "Re-run on 10 fresh seeds: 8 violate. Faults reduced from 4 to 2." },
    { start: "00:37", end: "00:43", text: "The scenario is saved as a regression case that re-runs on stored seeds." },
    { start: "00:43", end: "00:50", text: "Classified: the noise is physically unrealistic. A harness artifact, not a Nav2 defect." },
    { start: "00:50", end: "00:56", text: "Ordinum: find failures that only appear when systems interact." },
  ],
  provenance: {
    kicker: "PROVENANCE / 004",
    title: "Provenance",
    body: `Read from the Ordinum product repository (private research branch ${PRODUCT_SOURCE.branch}). ${FACT_SOURCE.artifactsNote} The original HTML reports are not yet published on this site.`,
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
  provenance: { kicker: string; title: string; body: string; files: readonly string[] };
  media: {
    enabled: boolean;
    video: null | { src: string; captionsSrc: string; poster?: string; title: string };
    reports: null | readonly { label: string; href: string }[];
  };
};

/* -------------------------------------------------------------------------- */
/* Platform vision (hero visual inputs, OG image, PlatformMap on /technology)  */
/* -------------------------------------------------------------------------- */

export type Domain = {
  readonly id: string;
  readonly name: string;
  readonly examples: string;
  readonly maturity: Maturity;
  readonly statusNote: string;
  /** Shown next to the maturity label so it is never read without its scope. */
  readonly scope?: string;
};

export const platformVision = {
  label: "Platform vision. Integrations are developed and validated one at a time.",
  core: {
    name: "Ordinum core",
    layerName: "Ordinum verification layer",
    maturity: "validated" as Maturity,
    badge: "Built & validated · research-stage",
    body: "Scenario execution, fault scheduling, independent verification, reproduction, minimization, regression cases and reports.",
    statusNote: "One engine runs four targets: a toy robot, ROS 2 / Nav2, Eclipse Mosquitto and a four-process testbed.",
    facts: ["A1", "H1"],
  },
  /** Stages of the shared layer in the platform map; node names match technology.architecture. */
  spine: [
    { id: "orchestration", label: "Orchestration", nodes: ["Scenario search", "Execution supervisor"] },
    { id: "evidence", label: "Evidence", nodes: ["Two-channel traces", "HTML reports"] },
    { id: "verification", label: "Verification", nodes: ["Independent checks", "Reproduction", "Minimization"] },
    { id: "regression", label: "Regression", nodes: ["Regression cases", "CI integration"] },
  ],
  domains: [
    {
      id: "robotics",
      name: "Robotics & physical systems",
      examples: "Autonomy stacks, navigation, control",
      maturity: "validated",
      scope: "ROS 2 / Nav2 · simulation only",
      statusNote: "ROS 2 / Nav2 in a simplified simulation. No physical hardware.",
    },
    {
      id: "messaging",
      name: "Messaging & distributed systems",
      examples: "Brokers, cloud-to-device command paths",
      maturity: "experimental",
      scope: "Mosquitto MQTT · own four-process testbed",
      statusNote: "Experimental: one MQTT broker campaign, and a testbed we built ourselves.",
    },
    {
      id: "applications",
      name: "Applications & APIs",
      examples: "Web applications, public and internal APIs",
      maturity: "planned",
      statusNote: "Planned. No adapter yet.",
    },
    {
      id: "ai",
      name: "AI & agents",
      examples: "Models, agents and tool-driven workflows",
      maturity: "planned",
      statusNote: "Planned. No adapter yet.",
    },
    {
      id: "firmware",
      name: "Firmware & embedded devices",
      examples: "Controllers, drivers, hardware interfaces",
      maturity: "planned",
      statusNote: "Planned. No adapter yet.",
    },
    {
      id: "hardware",
      name: "Hardware in the loop",
      examples: "Physical devices and test rigs",
      maturity: "planned",
      statusNote: "Planned. Nothing runs on physical hardware today.",
    },
  ],
} as const satisfies {
  label: string;
  core: {
    name: string;
    layerName: string;
    maturity: Maturity;
    badge: string;
    body: string;
    statusNote: string;
    facts: readonly FactRef[];
  };
  spine: readonly { id: string; label: string; nodes: readonly string[] }[];
  domains: readonly Domain[];
};

/* -------------------------------------------------------------------------- */
/* Seven-stage lifecycle (/technology only)                                    */
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
  /** Anchor id on /technology (linked from the home page). */
  id: "lifecycle",
  kicker: "ARCHITECTURE · LIFECYCLE / 001",
  /** Below md the seven stages sit behind this disclosure (open from md up). */
  disclosure: "The seven stages in full",
  title: "Seven stages,",
  titleMuted: "from a scenario to a kept test.",
  lede: "The four stages on the home page, in full. What changes between targets is the adapter and the source of truth the checks rely on.",
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
      today: "Each failure is saved as a JSON case with a pytest runner. CI integration is planned.",
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
/* Product page                                                                */
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

export const product = {
  connect: {
    kicker: "WHAT YOU CONNECT / 001",
    title: "A system,",
    titleMuted: "through an adapter.",
    body: "An adapter teaches Ordinum three things about a system: how to run a scenario, where to inject faults between its components, and how to record what actually happened, separately from what the system reports. Each new kind of system needs a new adapter; the engine behind it is shared.",
    targetsLabel: "Systems Ordinum runs today",
    /** One sentence, not a second maturity list (the full list is /technology#adapters). */
    runsToday:
      "Stock ROS 2 / Nav2 in simulation; experimentally, the Eclipse Mosquitto MQTT broker and our own four-process cross-system testbed; and a toy robot with planted bugs, used as a positive control.",
    targetsLink: { label: "Maturity of each integration", href: "/technology#adapters" },
    firstFor: {
      title: "Who we are building for first",
      items: [
        "Connected-device and industrial IoT teams whose systems span a cloud backend, a message broker and devices, often led by product security or platform engineering.",
        "Teams running ROS 2 robots or cloud-controlled robot fleets.",
      ],
      note: "Hypotheses, not validated customer segments: no interviews or design partnerships have happened yet. Ordinum is meant to add to your existing tests, not replace them.",
    },
    facts: ["B1", "I1", "I2", "I4"],
  },
  runs: {
    kicker: "WHAT ORDINUM RUNS / 002",
    title: "Campaigns of faulted scenarios,",
    titleMuted: "judged independently.",
    body: "A campaign generates scenarios and fault schedules, runs each one under a supervisor with a deadline and isolation, and judges the result with checks the search cannot see. Infrastructure problems are recorded as such and never counted as findings.",
    /** One compact architecture diagram (do not reuse the home-page visual). */
    diagram: {
      ariaLabel:
        "Architecture: your system connects through an adapter to the Ordinum engine (search, supervisor, independent checks, reproduction and minimization), which produces a report, a trace, a verdict, a reproduction rate, a reduced scenario and a regression case.",
      columns: [
        { id: "system", label: "Your system", items: ["Components", "Messages", "State"] },
        { id: "adapter", label: "Adapter", items: ["Runs scenarios", "Injects faults", "Records ground truth"] },
        { id: "engine", label: "Ordinum engine", items: ["Search", "Supervisor", "Independent checks", "Reproduce & reduce"] },
        { id: "outputs", label: "You receive", items: ["Report", "Trace", "Verdict", "Regression case"] },
      ],
    },
    facts: ["A1", "B3", "B2"],
  },
  outputs: {
    kicker: "WHAT AN ENGINEER RECEIVES / 003",
    title: "Evidence you can act on.",
    lede: "For each reproduced failure, the current engine produces the following. Examples are from the real Nav2 run on the demo page.",
    items: [
      {
        id: "report",
        title: "Failure report",
        plain: "One self-contained HTML page showing what ran, what failed, and the original scenario next to the reduced one.",
        example: "Committed report: nav2_success_mismatch_compare.html (in the private product repository; not yet published).",
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
        example: `${sm.failureId}.json, runnable with pytest.`,
        facts: ["B8"],
      },
    ],
    /** Under the report preview: the original is not public yet (same wording as /demo provenance). */
    reportNote: "From the private product repository; the original reports are not yet published.",
    links: [
      { label: "The full run, step by step", href: "/demo" },
      { label: "Provenance", href: "/demo#provenance" },
    ],
  },
  status: {
    kicker: "TODAY AND PLANNED / 004",
    title: "What works today,",
    titleMuted: "and what is planned.",
    today: ["core", "nav2", "xsys", "mqtt", "toy"] as const satisfies readonly IntegrationId[],
    next: ["nanomq", "xsysFree", "ci", "engines", "px4"] as const satisfies readonly IntegrationId[],
    link: { label: "Full integration status", href: "/technology#adapters" },
  },
  alongside: {
    title: "Alongside the tools you already use",
    items: [
      { name: "Unit and integration tests", text: "Ordinum's regression cases sit beside them, adding cases that come from system-level failures." },
      { name: "Fuzzers", text: "Strong on inputs to parsers, binaries and protocols. Ordinum's own work focuses on timed faults across component boundaries." },
      { name: "Chaos engineering", text: "Validates recovery in running infrastructure. Ordinum explores fault schedules before deployment and keeps reproducible evidence; the two can be used together." },
      { name: "Penetration testing", text: "Expert judgment that automation does not replace. Ordinum aims to hand testers reproducible evidence." },
    ],
  },
  cta: {
    title: "Tell us how your team tests today.",
    body: "Thirty minutes with the founders about your system and the failures that are hardest to reproduce.",
    primary: { label: "Discuss your testing workflow", href: "/contact#talk" },
    secondary: { label: "See Ordinum in action", href: "/demo" },
  },
} as const satisfies {
  connect: {
    kicker: string;
    title: string;
    titleMuted: string;
    body: string;
    targetsLabel: string;
    runsToday: string;
    targetsLink: Link;
    firstFor: { title: string; items: readonly string[]; note: string };
    facts: readonly FactRef[];
  };
  runs: {
    kicker: string;
    title: string;
    titleMuted: string;
    body: string;
    diagram: { ariaLabel: string; columns: readonly { id: string; label: string; items: readonly string[] }[] };
    facts: readonly FactRef[];
  };
  outputs: {
    kicker: string;
    title: string;
    lede: string;
    items: readonly ProductOutput[];
    reportNote: string;
    links: readonly Link[];
  };
  status: {
    kicker: string;
    title: string;
    titleMuted: string;
    today: readonly IntegrationId[];
    next: readonly IntegrationId[];
    link: Link;
  };
  alongside: { title: string; items: readonly { name: string; text: string }[] };
  cta: { title: string; body: string; primary: Link; secondary: Link };
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
    /** Section 1. */
    id: "architecture",
    kicker: "ARCHITECTURE / 001",
    title: "Three tiers.",
    titleMuted: "One verification layer in the middle.",
    lede: "Systems connect through adapters into a shared engine, which feeds engineering workflows. Maturity of each adapter is detailed in section 002.",
    tiers: [
      {
        id: "adapters",
        name: "Systems, through adapters",
        nodes: [
          { name: "ROS 2 / Nav2, in simulation", maturity: "validated", note: "Simulation only.", facts: ["A3"] },
          { name: "Toy robot (our own)", maturity: "validated", note: "Planted bugs as positive controls.", facts: ["A2"] },
          { name: "Eclipse Mosquitto MQTT, cloud-only", maturity: "experimental", facts: ["A4"] },
          { name: "Four-process testbed (our own), lockstep", maturity: "experimental", facts: ["A6"] },
          { name: "NanoMQ edge bridge", maturity: "in-progress", facts: ["A5"] },
          { name: "PX4, APIs, AI agents, firmware, hardware", maturity: "planned", facts: ["A10"] },
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
          { name: "Build comparison", maturity: "experimental", note: "Affected vs fixed build; not yet used in a published run.", facts: ["B5"] },
        ],
      },
      {
        id: "workflows",
        name: "Engineering workflows",
        nodes: [
          { name: "Regression cases", maturity: "validated", note: "JSON cases run by pytest.", facts: ["B8"] },
          { name: "CI integration", maturity: "planned", facts: ["A9"] },
        ],
      },
    ],
    note: "Single machine, Python today. Four targets demonstrate the contract; that does not mean every kind of system is supported.",
  },
  adapters: {
    /** Section 2. */
    id: "adapters",
    kicker: "ADAPTERS / 002",
    title: "What is built,",
    titleMuted: "and how mature it is.",
    lede: "Four labels, applied strictly: Built & validated, Built, experimental, In progress, and Planned.",
    notBuiltTitle: "Not yet built, or not yet stable",
    items: ["core", "toy", "nav2", "mqtt", "xsys", "nanomq", "xsysFree", "ci", "px4", "engines"] as const satisfies readonly IntegrationId[],
    reuse: {
      title: "One engine, four targets",
      body: "The toy robot, Nav2, Mosquitto and the cross-system testbed all run through the same path: target registry, supervisor, search, checks and report.",
      reused: {
        label: "What every target reuses (not reimplemented)",
        items: [
          "The same search, supervisor, minimization, reproduction, regression-case and report code runs every target; none has its own copy.",
          "Once multi-process support was in the core, adding the testbed changed the shared engine only by registering the new targets (plus one unrelated regression-case fix).",
        ],
      },
      changed: {
        label: "What needed engine changes or target work",
        items: [
          "Multi-process systems first needed core extensions: Unresolved verdicts, out-of-process systems under test, an event-time model, causal merging of traces, per-component guidance, scenario validation, build comparison and an HTML lanes view for multi-process traces.",
          "Nav2 needed a large target-specific adapter and tooling, which we count as an architectural weakness.",
          "The MQTT adapter predates those extensions and works around them on the target side.",
        ],
      },
      facts: ["H1", "H2"],
    },
  },
  contract: {
    /** Section 3. */
    id: "contract",
    kicker: "EXECUTION & VERIFICATION CONTRACT / 003",
    title: "What \"target-agnostic\"",
    titleMuted: "means here.",
    body: [
      "Every target implements one episode-level contract: describe itself, open a session, report a fingerprint of the exact build, and run one scenario with a given seed and deadline, returning a trace. The target declares its time model and whether it is deterministic.",
      "The generic layers never import a target, and the search never reads ground truth. Tests enforce both rules.",
    ],
    points: [
      { title: "Two channels", body: "What the system reports about itself guides the search. What the harness records (ground truth) is read only by the checks." },
      { title: "Supervised outcomes", body: "Each run ends as PASS, FAIL, TIMEOUT, HANG, CRASH or INFRA_ERROR. Infrastructure errors are never counted as findings." },
      { title: "Three-valued verdicts", body: "When evidence is ambiguous, a check returns Unresolved, never FAIL. Replay, minimization and regression treat it as inconclusive." },
      { title: "Causal checks", body: "On the cross-system testbed, components have independent clocks, so safety and security clauses use happened-before order from vector clocks, not timestamps." },
    ],
    caveat: "Designed to be generic; demonstrated on four targets so far. The MQTT adapter does not yet use the core Unresolved verdict.",
    facts: ["B1", "B2", "B3", "B4", "B10"],
  },
  faults: {
    /** Section 4. */
    id: "faults",
    kicker: "FAULT INJECTION & OBSERVATION / 004",
    title: "Faults at the boundaries,",
    titleMuted: "evidence on both sides.",
    lede: "Each target has its own fault vocabulary. A fault is scheduled at a time or on an event the system reports, and every fault is recorded as applied or ignored. On MQTT, brokers run in real time, so a fault's time sets its order in the workload rather than an exact instant; the testbed uses virtual time, which is what makes exact replay possible.",
    targets: [
      {
        id: "nav2",
        name: "ROS 2 / Nav2",
        kinds: NAV2_FAULT_KINDS,
        observation: "An agent interposes on scan, odometry, transform and velocity-command topics and keeps a ground-truth record taken before any fault.",
        checks: "Seven properties per run (collision, speed, claimed-versus-true success, motion while unsafe, stuck, liveness) plus a topology check.",
      },
      {
        id: "mqtt",
        name: "Eclipse Mosquitto (MQTT)",
        kinds: MQTT_FAULT_KINDS,
        observation: "An instrumented MQTT v5 client logs every delivery; the harness records permission commits and broker restarts.",
        checks: "No duplicate delivery of a QoS 2 message (the at-most-once half of MQTT v5 §4.3.3; ambiguous cases are recorded as cannot-judge), no delivery after a committed publish-deny, durable-session redelivery.",
      },
      {
        id: "xsys",
        name: "Cross-system testbed",
        kinds: [...XSYS_FAULT_KINDS.process, ...XSYS_FAULT_KINDS.link, ...XSYS_FAULT_KINDS.broker],
        observation: "A harness fabric stamps every recorded event with a vector clock: actuator effects, requests and acknowledgements, network sends and drops, process lifecycle.",
        checks: "The four policy clauses below.",
        kindsNote:
          "Process faults are OS signals to the component processes (SIGKILL, SIGTERM, SIGSTOP); power_loss is simulated as a kill plus losing the un-fsynced write-ahead-log tail; clock_skew offsets one process's local clock; link faults act on the harness fabric's sockets.",
      },
    ],
    policyTitle: "Testbed policy clauses",
    policy: XSYS_POLICY_CLAUSES,
    note: "MQTT bridge faults need the edge bridge, which is not yet stable. Testbed broker-message faults have no policy clause yet.",
    facts: ["A3", "E2", "E3", "D2", "B10"],
  },
  reproduction: {
    /** Section 5. */
    id: "reproduction",
    kicker: "REPRODUCTION & MINIMIZATION / 005",
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
        body: "Each reproduced failure becomes a self-contained JSON case: scenario, configuration hash, build fingerprint, violated property, minimization and reproduction data, run by pytest. A case first asserts that the failure still occurs, and is flipped to a guard after a fix.",
        caveat: "Checking a fix is basic, and on stochastic targets zero failures in 10 seeded runs is weak evidence, not proof. No CI integration yet.",
        facts: ["B8", "A9"],
      },
    ],
  },
  safety: {
    /** Section 6. */
    id: "safety",
    kicker: "ISOLATION & SAFETY / 006",
    title: "Contained by design.",
    policy: "Ordinum tests local simulations, our own targets, authorized open-source software, or systems a user provides. It does not scan external systems or drive physical actuators.",
    items: [
      { target: "ROS 2 / Nav2", text: "Runs in a container with no network, all Linux capabilities dropped, no-new-privileges, a memory cap and a host memory guard." },
      { target: "Cross-system testbed", text: "Each component is a separate python -I process with resource limits (512 MiB address space, file and core limits), its own empty network namespace when available (blocks IP, not filesystem sockets), and an audit-hook guard restricting socket paths and file writes. All four are restarted for each run." },
      { target: "MQTT", text: "In the default cloud-only topology, the broker listens only on 127.0.0.1 random ports, on per-session networks, from digest-verified images that are never pulled at launch." },
      { target: "All heavy jobs", text: "Run in a memory-capped scope. Infrastructure failures become INFRA_ERROR, never findings." },
    ],
    caveats: [
      "The Nav2 container runs as root, with capabilities dropped.",
      "The testbed's guard is a safety net, not a sandbox, and network namespaces may be unavailable on some CI runners.",
      "The MQTT setup has no explicit egress firewall.",
      "The opt-in edge bridge proxy binds the Docker gateway interface, not loopback.",
    ],
    facts: ["G1", "G2", "G3", "G4", "G5"],
  },
  limitations: {
    /** Section 7. */
    id: "limitations",
    kicker: "CURRENT LIMITATIONS / 007",
    title: "What it does not do yet.",
    items: [
      "Runs on a single machine. No distributed runner, no cloud execution.",
      "No CI integration: regression cases run through pytest.",
      "No hardware, firmware or hardware-in-the-loop support. Nav2 runs in a simplified simulation.",
      "The Nav2 fault vocabulary allowed physically impossible setups, and check bounds are not yet fault-aware.",
      "The cross-system testbed is our own system, with only its correctly behaving build. Free-running mode does not run yet.",
      "The MQTT edge bridge is unstable; only the cloud-only topology is reported.",
      "Minimization is 1-minimal at best, and the in-process watchdog cannot kill a hung thread.",
      "No language model in the loop.",
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
  adapters: {
    id: string;
    kicker: string;
    title: string;
    titleMuted: string;
    lede: string;
    notBuiltTitle: string;
    items: readonly IntegrationId[];
    reuse: {
      title: string;
      body: string;
      reused: { label: string; items: readonly string[] };
      changed: { label: string; items: readonly string[] };
      facts: readonly FactRef[];
    };
  };
  contract: {
    id: string;
    kicker: string;
    title: string;
    titleMuted: string;
    body: readonly string[];
    points: readonly { title: string; body: string }[];
    caveat: string;
    facts: readonly FactRef[];
  };
  faults: {
    id: string;
    kicker: string;
    title: string;
    titleMuted: string;
    lede: string;
    targets: readonly {
      id: string;
      name: string;
      kinds: readonly string[];
      observation: string;
      checks: string;
      kindsNote?: string;
    }[];
    policyTitle: string;
    policy: readonly { id: string; text: string }[];
    note: string;
    facts: readonly FactRef[];
  };
  reproduction: {
    id: string;
    kicker: string;
    title: string;
    titleMuted: string;
    items: readonly { title: string; body: string; caveat: string; facts: readonly FactRef[] }[];
  };
  safety: {
    id: string;
    kicker: string;
    title: string;
    policy: string;
    items: readonly { target: string; text: string }[];
    caveats: readonly string[];
    facts: readonly FactRef[];
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
        "Planted-defect controls on the cross-system testbed, and a stable MQTT edge bridge.",
        "Broader real-world integration, with design partners if they agree.",
      ],
    },
    asOf: FACT_SOURCE.note,
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
      "All three reproduced violations are artifacts of our faults, harness or check bounds. No Nav2 defect was found, and nothing was filed upstream. A separate adversarial review, briefed to argue against each classification, upheld all three.",
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
    traceLink: { label: "Step through one of these runs", href: "/demo" },
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
      "Nine corrections from a separate adversarial review pass are appended to the report.",
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
      "No planted-defect builds yet, so the testbed has not yet shown that its checks catch real violations end to end. They are authored separately, after the fault vocabulary is frozen.",
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
    conclusion: "No confirmed finding and no Unresolved result. Nothing here is a Mosquitto bug.",
    limits: [
      "One exploratory campaign. It ran before a later round of review fixes, and it needs Docker, with no committed artifact.",
      "The MQTT adapter records ambiguous cases with target-side markers rather than the core Unresolved verdict.",
      "The NanoMQ edge bridge is not stable, so two-broker results are not reported.",
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
      "Cross-system fault discovery: the testbed has only its correctly behaving build so far.",
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
      { k: "Source", v: FACT_SOURCE.note },
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
    access: "The product repository is private during the research stage. Ask us for access to specific artifacts.",
    facts: ["C1", "C3", "C4", "F6"],
  },
  methodology: {
    id: "methodology",
    kicker: "METHODOLOGY / 008",
    title: "How results are produced and labeled.",
    principles: [
      { title: "Two channels", body: "The search reads only what the system reports. Checks read only harness-recorded ground truth." },
      { title: "Pre-registration", body: "Benchmark hypotheses, configuration and analysis code are hash-locked before campaigns run. Deviations are documented." },
      { title: "Separate adversarial review", body: "A reviewer who did not produce a result is briefed to argue against its classification." },
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
    kicker: "THE AMBITION / 001",
    title: "Reliability and security live at the boundaries.",
    body: [
      "Modern systems are assembled from software, AI models, infrastructure, firmware and hardware, built by different teams and tested in different ways. We think many of the hardest failures and security problems begin where those parts meet.",
      "Ordinum's ambition is a continuous adversarial testing and verification platform that spans software and hardware: one layer where specialized testing engines run, failures are verified and reproduced, and the evidence becomes tests that keep problems fixed.",
    ],
  },
  phases: {
    kicker: "HOW WE GET THERE / 002",
    title: "Three phases.",
    items: [
      {
        n: "01",
        name: "Initial phase",
        title: "Working test and verification infrastructure for selected complex systems.",
        body: "A target-agnostic engine that runs, checks, reproduces and keeps failures, tested on a few systems before widening.",
        items: ["Core engine and ROS 2 / Nav2: built & validated", "MQTT and the cross-system testbed: built, experimental", "Design partners on their own systems"],
        maturity: "experimental",
        statusNote: "Under way. Parts are built; design partnerships have not started.",
      },
      {
        n: "02",
        name: "Expansion",
        title: "Specialized security and reliability engines, across more domains.",
        body: "Integrate engines for APIs and protocols, binaries and firmware, AI agents and hardware in the loop, all reporting into the same verification layer.",
        items: ["Additional adapters", "Specialized engine integrations", "CI integration"],
        maturity: "planned",
        statusNote: "Planned.",
      },
      {
        n: "03",
        name: "Long term",
        title: "A shared, continuous verification workflow across software and hardware stacks.",
        body: "Teams use one workflow to test, verify and keep evidence across the systems they build and operate. A long-term aspiration, not something available today.",
        items: ["Software to hardware", "Security and correctness together", "Continuous, not periodic"],
        maturity: "planned",
        statusNote: "Aspiration.",
      },
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
  phases: { kicker: string; title: string; items: readonly Phase[] };
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
      "The question was never about robots. The same engine now runs an MQTT broker and a four-process software testbed that models a cloud-to-device command path, and the vision covers software, AI, infrastructure, firmware and hardware.",
    ],
  },
  fit: {
    kicker: "WHAT WE BRING / 002",
    title: "Experience that maps to the problem.",
    items: [
      { title: "Fuzzing and product security", body: "Automated search for inputs and conditions nobody wrote a test for." },
      { title: "Production observability", body: "Turning what happened in a running system into something an engineer can act on." },
      { title: "Multi-agent systems", body: "Many components acting on shared, imperfect state." },
      { title: "Evidence discipline", body: "The engine, its four targets and the research on this site were built in-house and are reported with their limitations." },
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
 * Production publication requires founder approval of the exact text.
 */
export const legal = {
  status: "Draft — pending founder approval",
  terms: {
    title: "Website Terms",
    status: "Draft — pending founder approval",
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
    status: "Draft — pending founder approval",
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
      title: "Company",
      links: [
        { label: "Product", href: "/product" },
        { label: "Technology", href: "/technology" },
        { label: "Research", href: "/research" },
        { label: "Vision", href: "/vision" },
        { label: "About", href: "/about" },
        { label: "See it in action", href: "/demo" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Talk to the founders", href: "/contact#talk" },
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
  /** Both pages are interim drafts; production publication needs founder approval. */
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

export type PageKey = "demo" | "product" | "technology" | "research" | "vision" | "about" | "contact" | "terms" | "privacy";

type PageCopy = {
  readonly href: string;
  readonly label: string;
  /** Optional: /contact has no PageHeader (its heading comes from `contact.talk`). */
  readonly header?: {
    readonly kicker: string;
    readonly title: string;
    readonly titleMuted?: string;
    readonly lede: string;
  };
  /** meta.title is short; the root layout appends " · Ordinum". */
  readonly meta: { readonly title: string; readonly description: string };
};

export const pages = {
  demo: {
    href: "/demo",
    label: "See it in action",
    header: {
      kicker: "See Ordinum in action",
      title: "A real run,",
      titleMuted: "step by step.",
      lede: "Ordinum testing stock ROS 2 Nav2 under injected faults: what it checked, what it saw, how it reproduced the failure, and why we classified it as our own harness artifact.",
    },
    meta: {
      title: "See Ordinum in action",
      description:
        "An interactive walkthrough of a real Ordinum run on ROS 2 Nav2: system, property, injected faults, observed behavior, verdict, reproduction and the regression case, labeled as a harness artifact, not a Nav2 defect.",
    },
  },
  product: {
    href: "/product",
    label: "Product",
    header: {
      kicker: "Product",
      title: "What you connect,",
      titleMuted: "and what you get back.",
      lede: "Ordinum runs a system under controlled faults, checks the result independently, and hands engineers evidence they can reproduce.",
    },
    meta: {
      title: "Product",
      description:
        "What a team connects to Ordinum, what it runs, and what an engineer receives: failure report, trace timeline, independent verdict, reproduction rate, reduced scenario and regression case. What works today and what is planned.",
    },
  },
  technology: {
    href: "/technology",
    label: "Technology",
    header: {
      kicker: "Technology",
      title: "How Ordinum executes,",
      titleMuted: "verifies and reproduces.",
      lede: "Architecture, adapters and their maturity, the execution and verification contract, fault injection, reproduction, isolation and current limitations.",
    },
    meta: {
      title: "Technology",
      description:
        "Ordinum's architecture: one engine running four targets (a toy robot, ROS 2 / Nav2, Eclipse Mosquitto and a four-process testbed), with independent checks, exact or statistical reproduction, minimization and regression cases.",
    },
  },
  research: {
    href: "/research",
    label: "Research",
    header: {
      kicker: "Research",
      title: "What we have shown,",
      titleMuted: "and what we have not.",
      lede: "Every result with its evidence label: the Nav2 pilot, the toy benchmark, the cross-system testbed and the MQTT campaign, with limitations and methods.",
    },
    meta: {
      title: "Research",
      description:
        "Ordinum's research: an exploratory ROS 2 / Nav2 pilot, a pre-registered toy benchmark, a cross-system testbed and an MQTT campaign, each result labeled, with limitations and withdrawn earlier results.",
    },
  },
  vision: {
    href: "/vision",
    label: "Vision",
    header: {
      kicker: "Vision",
      title: "Every system deserves to be tested",
      titleMuted: "beyond its assumptions.",
      lede: "From working infrastructure for a few complex systems to a shared, continuous verification workflow across software and hardware.",
    },
    meta: {
      title: "Vision",
      description:
        "Ordinum's ambition: a continuous adversarial testing and verification platform spanning software and hardware, in three phases, and why now.",
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
      description: "Talk to Ordinum's founders about design partnerships, technical demonstrations and research collaboration.",
    },
  },
  terms: {
    href: "/terms",
    label: "Terms",
    header: {
      kicker: "Legal",
      title: "Website Terms",
      lede: "Draft — pending founder approval.",
    },
    meta: {
      title: "Website Terms (Draft)",
      description: "Terms of use for ordinum.org.",
    },
  },
  privacy: {
    href: "/privacy",
    label: "Privacy",
    header: {
      kicker: "Legal",
      title: "Privacy Notice",
      lede: "Draft — pending founder approval.",
    },
    meta: {
      title: "Privacy Notice (Draft)",
      description: "How ordinum.org handles personal information, including contact-form submissions.",
    },
  },
} as const satisfies Record<PageKey, PageCopy>;

/** Reading order for the "Next" link at the bottom of each inner page. */
export const pageOrder = ["product", "technology", "research", "vision", "about"] as const satisfies readonly PageKey[];
