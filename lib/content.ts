/**
 * Ordinum copy deck (repositioned site, October 2026).
 *
 * Single source of truth for every word and number on the site.
 *
 * SOURCES
 *   - Founder brief: positioning, page structure, approved wording.
 *   - The Ordinum product repository, branch `ordinum-2`, commit c25ba4f
 *     (facts table: /home/arsingla/scratch/ordinum-overhaul/facts.md; row ids such as
 *     "B9" or "E6" below refer to that table).
 *   - Real proof artifacts: ./evidence.ts (numbers are read from there, not retyped).
 *   - Claim table: /home/arsingla/scratch/ordinum-overhaul/claim_audit.md
 *
 * RULES
 *   - Vision is not capability. Anything outside the target-agnostic core, the toy target and
 *     the ROS 2/Nav2 integration is "planned" and must be shown as such.
 *   - The withdrawn v1 benchmark numbers never appear as performance claims. They are not
 *     repeated anywhere in this file, including the withdrawn-results note.
 *   - Exact replay only for the deterministic toy target. Nav2 reproduction is statistical.
 *   - ddmin output is "1-minimal" at best, never "smallest possible".
 *   - Feedback guidance has not been shown to beat random search. Do not imply it has.
 *   - No Nav2 defect has been found. No customers, design partners or users exist.
 *   - Reviews are "a separate adversarial review", never an external or named party.
 *   - No first / only / leading / guaranteed / proven-better language. No caricatures.
 */

import {
  EVIDENCE_LABELS,
  PRODUCT_SOURCE,
  nav2Nominal,
  nav2PilotFindings,
  nav2PilotTotals,
  nav2SuccessMismatch,
  toyPositiveControl,
} from "./evidence";

/* -------------------------------------------------------------------------- */
/* Shared types                                                                */
/* -------------------------------------------------------------------------- */

export type Link = { readonly label: string; readonly href: string };
export type ExternalLink = Link & { readonly external?: boolean };

/** Row id in facts.md (e.g. "B9"), or "founder" for founder-confirmed statements. */
export type FactRef = string;

/**
 * Implementation status.
 * - implemented:    code and tests exist in the product repo (cite a facts.md row).
 * - in-development: verified work exists but is not merged or fully tested. Nothing currently
 *                   qualifies; the value exists so the UI can render it when something does.
 * - planned:        on the repo roadmap or in the founder's vision. Not built.
 */
export type Status = "implemented" | "in-development" | "planned";

export const STATUS_LABELS = {
  implemented: "Implemented",
  "in-development": "In development",
  planned: "Planned",
} as const satisfies Record<Status, string>;

/** Where a planned item comes from: the committed repo roadmap, or the founder's vision only. */
export type PlanBasis = "roadmap" | "vision";

/** One vocabulary for planned work, used on every page. */
export const PLAN_BASIS_LABELS = {
  roadmap: "Next on the roadmap",
  vision: "Longer term",
} as const satisfies Record<PlanBasis, string>;

export type StatusItem = {
  readonly title: string;
  readonly body: string;
  readonly status: Status;
  readonly facts: readonly FactRef[];
  readonly basis?: PlanBasis;
};

export type PreviousRole = {
  readonly company: string;
  readonly team: string;
  readonly focus: string;
};

/** Repo snapshot every technical claim on the site is checked against. */
export const FACT_SOURCE = {
  repo: PRODUCT_SOURCE.repo,
  branch: PRODUCT_SOURCE.branch,
  commit: PRODUCT_SOURCE.commit,
  commitShort: PRODUCT_SOURCE.commitShort,
  checkedOn: "23 October 2026",
  note: `Technical statements on this site reflect the ${PRODUCT_SOURCE.branch} research branch at commit ${PRODUCT_SOURCE.commitShort}, checked on 23 October 2026.`,
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
  tagline: "Find what breaks between systems.",
  description:
    "Ordinum is building continuous adversarial testing and verification infrastructure for interconnected software, AI, infrastructure and hardware systems. Explore the technology and current research.",
} as const;

/* -------------------------------------------------------------------------- */
/* SEO                                                                         */
/* -------------------------------------------------------------------------- */

export const seo = {
  home: {
    title: "Ordinum — Adversarial Testing & Verification Infrastructure",
    description: site.description,
    ogTitle: "Ordinum — Find what breaks between systems",
    ogDescription:
      "Continuous adversarial testing and verification infrastructure for interconnected software and hardware. Research-stage; first implemented integration: ROS 2 / Nav2.",
    twitterTitle: "Ordinum — Adversarial Testing & Verification Infrastructure",
    twitterDescription: site.description,
  },
  /** Organization JSON-LD description (app/layout.tsx). */
  organizationDescription:
    "Ordinum is building continuous adversarial testing and verification infrastructure for interconnected software and hardware systems.",
  /** Per-page full titles for OG/Twitter. pages[*].meta.title stays short for the "%s · Ordinum" template. */
  pages: {
    product: "Product — One verification platform, specialized testing engines",
    technology: "Technology — A common verification layer",
    research: "Research — Evidence over claims",
    vision: "Vision — Tested beyond its assumptions",
    about: "About — The team behind Ordinum",
    contact: "Contact — Discuss a design partnership",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export const nav = {
  links: [
    { label: "Product", href: "/product" },
    { label: "Technology", href: "/technology" },
    { label: "Research", href: "/research" },
    { label: "Vision", href: "/vision" },
    { label: "About", href: "/about" },
  ],
  bookCall: { label: "Book a call", href: site.calUrl },
  /** Primary header CTA. Kept under the `demo` key so existing Navbar/MobileMenu code compiles. */
  demo: { label: "Talk to us", href: "/contact" },
} as const satisfies {
  links: readonly Link[];
  bookCall: Link;
  demo: Link;
};

/* -------------------------------------------------------------------------- */
/* Home: hero                                                                  */
/* -------------------------------------------------------------------------- */

export const hero = {
  eyebrow: "Continuous adversarial testing & verification",
  titleLine1: "Find what breaks",
  titleLine2: "between systems.",
  lede: "Ordinum is building the testing and security infrastructure for interconnected software and hardware. Explore unexpected failure conditions, verify what went wrong, and turn reproducible findings into tests that prevent regressions.",
  primaryCta: { label: "Discuss a design partnership", href: "/contact" },
  secondaryCta: { label: "Explore the technology", href: "/technology" },
  status: "Research-stage platform · First implemented integration: ROS 2 / Nav2",
  /** Mono meta row under the CTAs; meta[0] is also the OG image footer. */
  meta: ["RESEARCH-STAGE PLATFORM", "FIRST INTEGRATION: ROS 2 / NAV2"],
  visual: {
    ariaLabel:
      "Conceptual diagram of the seven-stage loop: define the system, generate scenarios, execute with faults, observe, verify, reproduce and regress. Systems such as applications, AI agents, cloud services, firmware and robots are shown as inputs; only the robotics integration (ROS 2 / Nav2, in simulation) exists today.",
    note: "CONCEPTUAL / PLATFORM VISION",
    /** Same seven verbs as `lifecycle.stages[].short`, so the home page uses one vocabulary. */
    stages: [
      { id: "define", caption: "Systems connected through an adapter" },
      { id: "generate", caption: "Scenarios and timed faults" },
      { id: "execute", caption: "Supervised runs, faults at boundaries" },
      { id: "observe", caption: "What it reported, and what happened" },
      { id: "verify", caption: "Checks on what actually happened" },
      { id: "reproduce", caption: "Re-run, measure, reduce" },
      { id: "regress", caption: "Kept as a regression case" },
    ],
    /** Short names for the platform-vision domains, keyed by `platformVision.domains[].id`. */
    domainShort: {
      applications: "APIs",
      ai: "AI agents",
      cloud: "Cloud",
      os: "OS",
      firmware: "Firmware",
      robotics: "Robotics (sim)",
    },
    regressionLabel: "Regression case",
  },
} as const satisfies {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  lede: string;
  primaryCta: Link;
  secondaryCta: Link;
  status: string;
  meta: readonly string[];
  visual: {
    ariaLabel: string;
    note: string;
    stages: readonly { id: LifecycleStageId; caption: string }[];
    domainShort: Readonly<Record<string, string>>;
    regressionLabel: string;
  };
};

/* -------------------------------------------------------------------------- */
/* Home: problem + partnership band                                            */
/* -------------------------------------------------------------------------- */

export type FailureExample = {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
};

export const home = {
  problem: {
    kicker: "THE PROBLEM / 001",
    title: "The failures that matter",
    titleMuted: "don't respect system boundaries.",
    body: [
      "Most testing is organized around components and anticipated scenarios, and it catches a great deal. The failures that are hardest to find tend to appear when components meet: one service retries while another restarts, a message arrives after the state it described has changed, a recovery path runs with assumptions that no longer hold.",
      "Each part can pass its own tests while the system as a whole does something wrong. Some teams already test for this, with integration suites, chaos experiments or simulation. Ordinum is building infrastructure to make that kind of testing systematic, reproducible and continuous.",
    ],
    examples: [
      {
        id: "delayed-messages",
        title: "Delayed messages",
        detail: "A consumer acts on data that was correct when it was sent and wrong by the time it arrived.",
      },
      {
        id: "stale-authorization",
        title: "Stale authorization",
        detail: "A permission or token is revoked in one place and still honored in another.",
      },
      {
        id: "component-restarts",
        title: "Component restarts",
        detail: "A dependency restarts mid-operation and comes back without the state its callers expect.",
      },
      {
        id: "retries",
        title: "Retries",
        detail: "A retry that is correct locally duplicates a side effect across the boundary.",
      },
      {
        id: "inconsistent-state",
        title: "Inconsistent state",
        detail: "Two components hold different views of the same fact, and both act on theirs.",
      },
      {
        id: "timeouts",
        title: "Timeouts",
        detail: "A timeout fires on one side while the operation completes on the other.",
      },
      {
        id: "corrupted-input",
        title: "Corrupted input",
        detail: "Malformed, noisy or out-of-range data passes one validation layer and breaks a later one.",
      },
      {
        id: "resource-exhaustion",
        title: "Resource exhaustion",
        detail: "Memory, connections or compute run short, and degradation spreads to components that were never overloaded.",
      },
      {
        id: "unsafe-recovery",
        title: "Unsafe recovery",
        detail: "A fallback or recovery routine runs in a state it was never designed for.",
      },
    ],
    note: "Illustrative failure categories, not incidents from any specific system.",
  },
  /** Closing band on the home page (section 7 of the brief). */
  partnership: {
    kicker: "DESIGN PARTNERS / 002",
    title: "Building systems that cannot afford",
    titleMuted: "unexpected failures?",
    body: "We're speaking with software, product-security, infrastructure, embedded and autonomy teams about difficult-to-reproduce failures and gaps in their testing workflows.",
    primaryCta: { label: "Discuss a design partnership", href: "/contact" },
    secondaryCta: { label: "View the research", href: "/research" },
    note: "Research-stage, with no product to buy yet. A design partnership starts as a conversation about your hardest failures, and it shapes what we build next.",
  },
} as const satisfies {
  problem: {
    kicker: string;
    title: string;
    titleMuted: string;
    body: readonly string[];
    examples: readonly FailureExample[];
    note: string;
  };
  partnership: {
    kicker: string;
    title: string;
    titleMuted: string;
    body: string;
    primaryCta: Link;
    secondaryCta: Link;
    note: string;
  };
};

/* -------------------------------------------------------------------------- */
/* Home: platform vision (domains around one shared core)                      */
/* -------------------------------------------------------------------------- */

export type Domain = {
  readonly id: string;
  readonly name: string;
  readonly examples: string;
  readonly status: Status;
  readonly statusNote: string;
  /** Shown next to the status wherever it renders, so "Implemented" is never read without its scope. */
  readonly scope?: string;
};

export const platformVision = {
  kicker: "THE PLATFORM / 002",
  title: "One platform.",
  titleMuted: "Many kinds of systems.",
  lede: "Different systems need different testing techniques. An API, a firmware controller and a robot fail in different ways. Ordinum's aim is one shared layer for running campaigns, verifying failures and keeping the evidence, with specialized engines for each kind of system.",
  label: "Platform vision — integrations will be developed and validated over time.",
  core: {
    name: "Ordinum core",
    /** Heading of the shared layer in the platform map. */
    layerName: "Ordinum verification layer",
    /** Shown instead of a bare "Implemented": the core exists, at research stage, and not every part is built. */
    badge: "Core implemented · research-stage",
    body: "Scenario execution, fault scheduling, independent verification, reproduction, minimization, regression artifacts and reports.",
    status: "implemented" as Status,
    statusNote: "Research-stage core. Runs today on two robotics targets: an in-house toy robot and ROS 2 / Nav2 in simulation.",
    facts: ["B1", "B9", "B10", "B11", "B12", "G4"],
  },
  /**
   * The shared layer in the platform map: five stages, each grouping node names from
   * technology.architecture (statuses are read from there, never set here).
   */
  spine: [
    { id: "orchestration", label: "Orchestration", nodes: ["Scenario management", "Execution supervision"] },
    { id: "engines", label: "Testing engines", nodes: ["Timed fault injection engine", "API, protocol, binary and firmware engines"] },
    { id: "evidence", label: "Evidence", nodes: ["Feedback collection", "Reporting"] },
    { id: "verification", label: "Verification", nodes: ["Failure verification", "Reproduction", "Minimization"] },
    { id: "regression", label: "Regression", nodes: ["Regression artifacts", "CI integration (GitHub Actions, GitLab)"] },
  ],
  domains: [
    {
      id: "applications",
      name: "Applications & APIs",
      examples: "Web applications, public and internal APIs",
      status: "planned",
      statusNote: "Planned. No adapter yet.",
    },
    {
      id: "ai",
      name: "AI & agents",
      examples: "Models, agents and tool-driven workflows",
      status: "planned",
      statusNote: "Planned. No adapter yet.",
    },
    {
      id: "cloud",
      name: "Cloud & distributed infrastructure",
      examples: "Distributed services, networks, data stores",
      status: "planned",
      statusNote: "Planned. No adapter yet.",
    },
    {
      id: "os",
      name: "Operating systems & middleware",
      examples: "Runtimes, messaging, schedulers",
      status: "planned",
      statusNote: "Planned. No general adapter yet.",
    },
    {
      id: "firmware",
      name: "Firmware & embedded devices",
      examples: "Controllers, drivers, hardware interfaces",
      status: "planned",
      statusNote: "Planned. No adapter yet.",
    },
    {
      id: "robotics",
      name: "Robotics & physical systems",
      examples: "Autonomy stacks, navigation, control",
      status: "implemented",
      scope: "ROS 2 / Nav2 · simulation only",
      statusNote: "First integration: ROS 2 / Nav2 in a simplified simulation. No physical hardware.",
    },
  ],
} as const satisfies {
  kicker: string;
  title: string;
  titleMuted: string;
  lede: string;
  label: string;
  core: {
    name: string;
    layerName: string;
    badge: string;
    body: string;
    status: Status;
    statusNote: string;
    facts: readonly FactRef[];
  };
  spine: readonly { id: string; label: string; nodes: readonly string[] }[];
  domains: readonly Domain[];
};

/* -------------------------------------------------------------------------- */
/* Home: how Ordinum works (seven-stage loop)                                  */
/* -------------------------------------------------------------------------- */

export type LifecycleStageId = "define" | "generate" | "execute" | "observe" | "verify" | "reproduce" | "regress";

export type LifecycleStage = {
  readonly n: string;
  readonly id: LifecycleStageId;
  /** One-word label for compact diagrams (also the hero loop's stage names). */
  readonly short: string;
  readonly title: string;
  readonly body: string;
  /** What this stage hands to the next. */
  readonly artifact: { readonly name: string; readonly detail: string };
  /** What exists in the engine today for this stage, in plain language (home page). */
  readonly today: string;
  readonly facts: readonly FactRef[];
};

export const lifecycle = {
  kicker: "HOW IT WORKS / 003",
  title: "From an unexpected condition",
  titleMuted: "to a test that keeps it fixed.",
  lede: "The loop is meant to apply whether the system is a service, a firmware image or a robot. What changes is the adapter, the testing engine and the source of truth the checks rely on: a simulator or harness where one exists, target-specific oracles where it does not.",
  stages: [
    {
      n: "01",
      id: "define",
      short: "Define",
      title: "Define the system",
      body: "Connect the system under test through an adapter, and state the properties it must hold: what it must never do, and what it must eventually do.",
      artifact: {
        name: "System model + properties",
        detail: "An adapter, a fingerprint of the exact build, whether runs are deterministic, and the properties to check.",
      },
      today: "Every target connects through one adapter interface and declares the properties to check.",
      facts: ["B1", "B7"],
    },
    {
      n: "02",
      id: "generate",
      short: "Generate",
      title: "Generate scenarios",
      body: "Compose tasks and faults, each scheduled at a point in time or on an event inside the system.",
      artifact: {
        name: "Scenarios + fault schedules",
        detail: "Tasks paired with faults, each timed by clock or triggered by an event inside the system.",
      },
      today: "Faults are scheduled at a time or on an event. Several search strategies are available, from random to feedback-guided.",
      facts: ["B3", "B8"],
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
      today: "Each run has a deadline and ends in a recorded outcome: pass, fail, timeout, hang, crash or infrastructure error.",
      facts: ["B2", "B4"],
    },
    {
      n: "04",
      id: "observe",
      short: "Observe",
      title: "Observe behavior",
      body: "Record what the system reported about itself and, separately, what actually happened.",
      artifact: {
        name: "Traces + signals",
        detail: "What the system reported, and separately what actually happened (ground truth).",
      },
      today: "What the system reported and what actually happened are recorded separately. Only the checks see the second.",
      facts: ["B6"],
    },
    {
      n: "05",
      id: "verify",
      short: "Verify",
      title: "Verify failures",
      body: "A checker that is separate from the search judges each property against the most authoritative evidence available. Infrastructure problems are separated from findings.",
      artifact: {
        name: "Verdicts",
        detail: "Property-by-property results judged on ground truth. A violation still has to be classified.",
      },
      today: "Checks read what actually happened. Infrastructure errors are retried and never counted as findings.",
      facts: ["B6", "B7", "B2", "B13"],
    },
    {
      n: "06",
      id: "reproduce",
      short: "Reproduce",
      title: "Reproduce and minimize",
      body: "Re-run the failure to measure how reliably it recurs, then cut the fault schedule down to what still triggers it.",
      artifact: {
        name: "Reproduction rate + reduced schedule",
        detail: "Exact match or a measured rate with an interval, plus a reduced fault schedule that still fails (not guaranteed to be the smallest).",
      },
      today: "Re-run to confirm: exact replay on deterministic targets, a measured reproduction rate on the rest. Then automatic reduction to the faults that matter.",
      facts: ["B9", "B10"],
    },
    {
      n: "07",
      id: "regress",
      short: "Regress",
      title: "Test the fix continuously",
      body: "Keep each reproduced failure as a test that re-runs against new builds, to help check that a fixed problem stays fixed.",
      artifact: {
        name: "Regression artifact",
        detail: "A self-contained case: scenario, build fingerprint, property and replay data.",
      },
      today: "Each failure is saved as a self-contained case with a test runner. CI integration is planned.",
      facts: ["B11", "C1"],
    },
  ],
  guidance: {
    label: "Search",
    text: "Search strategy is configurable, from random to feedback-guided.",
    link: { label: "How the strategies compare", href: "/research#toy-benchmark" },
  },
} as const satisfies {
  kicker: string;
  title: string;
  titleMuted: string;
  lede: string;
  stages: readonly LifecycleStage[];
  guidance: { label: string; text: string; link: Link };
};

/* -------------------------------------------------------------------------- */
/* Home: what works today                                                      */
/* -------------------------------------------------------------------------- */

export const today = {
  kicker: "WHAT WORKS TODAY / 004",
  title: "A broad vision.",
  titleMuted: "A narrower, working core.",
  lede: "Research-stage software running on one machine. Today it runs on two robotics targets: an in-house toy robot and ROS 2 / Nav2 in simulation. Adapters for APIs, services, AI agents, firmware and hardware are planned, not built.",
  implementedLabel: "Implemented",
  plannedLabel: "Planned",
  implemented: [
    {
      title: "Target-agnostic scenario execution",
      body: "Any system that implements the adapter interface can be run, supervised and checked. Demonstrated on two robotics targets so far.",
      status: "implemented",
      facts: ["B1", "B2", "G4"],
    },
    {
      title: "Timed fault injection",
      body: "Faults at a set time or on an event inside the system: delays, drops, duplicates, reordering, stale data, noise, corrupted values and lifecycle changes.",
      status: "implemented",
      facts: ["B3", "B4"],
    },
    {
      title: "ROS 2 / Nav2 adapter",
      body: "Stock Nav2 in a pinned container, with an agent that interposes on sensor, transform and command messages. Simplified simulation; no physical hardware.",
      status: "implemented",
      facts: ["B5", "E1"],
    },
    {
      title: "Ground-truth invariant checks",
      body: "Properties are judged on what actually happened, kept separate from the signals the search uses.",
      status: "implemented",
      facts: ["B6", "B7"],
    },
    {
      title: "Reproduce, reduce, keep",
      body: "A measured reproduction rate (exact replay where the target is deterministic), automatic reduction of the fault schedule, a self-contained regression case and an HTML trace report.",
      status: "implemented",
      facts: ["B9", "B10", "B11", "B12"],
    },
  ],
  planned: [
    { title: "Software-service and API adapters", body: "", status: "planned", facts: ["C2"], basis: "vision" },
    {
      title: "Security testing engines",
      body: "The current engine checks safety and liveness properties, not security vulnerabilities.",
      status: "planned",
      facts: ["C3"],
      basis: "vision",
    },
    { title: "Firmware and hardware adapters", body: "", status: "planned", facts: ["C2"], basis: "vision" },
    { title: "Cross-domain campaigns", body: "", status: "planned", facts: ["C10"], basis: "vision" },
    { title: "CI integrations", body: "", status: "planned", facts: ["C1"], basis: "roadmap" },
    { title: "Higher-fidelity simulation and a PX4 adapter", body: "", status: "planned", facts: ["C4", "C5", "C8"], basis: "roadmap" },
  ],
  partnerNote:
    "If your team builds on ROS 2 / Nav2, that is where the current engine works today. For other systems, we want to learn which failures are hardest to reproduce; that shapes which adapters we build next.",
  statusLink: { label: "Full build status", href: "/technology#status" },
  footnote: FACT_SOURCE.note,
} as const satisfies {
  kicker: string;
  title: string;
  titleMuted: string;
  lede: string;
  implementedLabel: string;
  plannedLabel: string;
  implemented: readonly StatusItem[];
  planned: readonly StatusItem[];
  partnerNote: string;
  statusLink: Link;
  footnote: string;
};

/* -------------------------------------------------------------------------- */
/* Home: real demonstration (reads lib/evidence.ts)                            */
/* -------------------------------------------------------------------------- */

const sm = nav2SuccessMismatch;

export const demo = {
  kicker: "A REAL TRACE / 005",
  title: "What a finding looks like.",
  titleMuted: "Labeled for what it is.",
  lede: `A recorded run from our first validation environment, ROS 2 / Nav2 in simulation. Nav2 reported that it had reached its goal at ${sm.minimized.result.tS} s; ground truth put the robot ${sm.verdict.distanceText} away. Ordinum's check caught the gap, reproduced it ${sm.reproduction.failures} of ${sm.reproduction.trials} times and reduced ${sm.minimization.before} faults to ${sm.minimization.after}. Then the run was classified: a fault-configuration artifact, not a Nav2 defect.`,
  /** Key into lib/evidence.ts. */
  artifact: "nav2SuccessMismatch",
  label: EVIDENCE_LABELS[sm.label],
  labelShort: sm.labelShort,
  facts: [
    { k: "In plain terms", v: `The robot said it had arrived. It was ${sm.verdict.distanceText} from the goal.` },
    {
      k: "Check",
      v: `${sm.verdict.invariant}: claimed success checked against the true position (limit 0.35 m).`,
    },
    {
      k: "Reproduction",
      v: `Reproduced ${sm.reproduction.failures} of ${sm.reproduction.trials} times on fresh seeds (${sm.reproduction.wilson95Text}). Statistical, not exact replay.`,
    },
    {
      k: "Minimization",
      v: `${sm.minimization.before} scheduled faults reduced to ${sm.minimization.after}. Not verified 1-minimal: the time cap was reached.`,
    },
    {
      k: "Classification",
      v: "Fault-configuration artifact, not a Nav2 defect: the noise level is unrealistic and this setup has no state estimator to reject it.",
    },
  ],
  why: "The evidence format (trace, verdict, reproduction rate, reduced fault schedule, regression case) comes from the target-agnostic core. This target is the only real one it has run on so far.",
  source: `Source: ${sm.source}`,
  cta: { label: "Read the full trace", href: "/research#trace-demo" },
} as const satisfies {
  kicker: string;
  title: string;
  titleMuted: string;
  lede: string;
  artifact: string;
  label: string;
  labelShort: string;
  facts: readonly { k: string; v: string }[];
  why: string;
  source: string;
  cta: Link;
};

/* -------------------------------------------------------------------------- */
/* Product page                                                                */
/* -------------------------------------------------------------------------- */

export type ProductLayerItem = {
  readonly name: string;
  readonly status: Status;
  readonly note: string;
  readonly facts: readonly FactRef[];
};

export type ProductLayer = {
  readonly id: "A" | "B" | "C";
  readonly name: string;
  readonly body: string;
  readonly items: readonly ProductLayerItem[];
};

export type Approach = {
  readonly id: string;
  readonly name: string;
  readonly contributes: string;
  readonly bestAt: string;
  readonly whereOrdinumFits: string;
};

export const product = {
  intro: {
    kicker: "THE IDEA / 001",
    title: "Specialized engines.",
    titleMuted: "Shared evidence.",
    body: [
      "An API needs stateful input and protocol testing. A firmware controller needs binary fuzzing and fault injection at its hardware interfaces. A robot needs timed faults across sensors, timing and control. No single technique covers all three.",
      "What these systems can share is the workflow around the technique: running campaigns, checking properties independently, reproducing and reducing what fails, and keeping it as a test. Ordinum's ambition is to provide that shared layer, so each engine's findings arrive in one consistent, reproducible form.",
    ],
  },
  layers: {
    kicker: "THREE LAYERS / 002",
    title: "How the platform is organized.",
    lede: "A conceptual model of the platform. Status is marked on every item: only what is implemented exists in code today.",
    items: [
      {
        id: "A",
        name: "Systems under test",
        body: "What a team brings to Ordinum.",
        items: [
          { name: "API or application", status: "planned", note: "No adapter yet.", facts: ["C2"] },
          { name: "Stateful distributed service", status: "planned", note: "No adapter yet.", facts: ["C2"] },
          { name: "AI agent", status: "planned", note: "No adapter yet.", facts: ["C2"] },
          { name: "Firmware or embedded controller", status: "planned", note: "No adapter yet.", facts: ["C2"] },
          {
            name: "Robot or autonomous system, in simulation",
            status: "implemented",
            note: "ROS 2 / Nav2 in a simplified loopback simulation, plus an in-house toy robot used as a positive control.",
            facts: ["A3", "B5", "E1"],
          },
        ],
      },
      {
        id: "B",
        name: "Specialized testing",
        body: "Intended engine categories. Most are not available yet.",
        items: [
          { name: "Stateful input fuzzing", status: "planned", note: "Not built.", facts: ["C3"] },
          { name: "Protocol testing", status: "planned", note: "Not built.", facts: ["C3"] },
          { name: "Binary and firmware fuzzing", status: "planned", note: "Not built.", facts: ["C3"] },
          {
            name: "Fault and failure injection",
            status: "implemented",
            note: "Timed faults for the two current targets: 12 kinds for Nav2, 10 for the toy target.",
            facts: ["B3", "B4"],
          },
          { name: "Adversarial security testing", status: "planned", note: "Not built.", facts: ["C3"] },
          {
            name: "Behavioral exploration",
            status: "implemented",
            note: "Five search strategies, from a scripted catalog to feedback-guided. How they compare is reported on the Research page.",
            facts: ["B8", "G1"],
          },
        ],
      },
      {
        id: "C",
        name: "Shared Ordinum infrastructure",
        body: "The layer every engine would report into.",
        items: [
          {
            name: "Campaign orchestration",
            status: "implemented",
            note: "Supervised campaigns with deadlines, isolation, checkpoint and resume. Single machine.",
            facts: ["B2", "B8", "C7"],
          },
          {
            name: "Common trace format",
            status: "implemented",
            note: "One trace schema with reported and ground-truth channels, shared by both current targets. Normalizing evidence across different engines is planned.",
            facts: ["B1", "B6"],
          },
          {
            name: "Reproduction and minimization",
            status: "implemented",
            note: "Exact or statistical reproduction; delta debugging toward a 1-minimal fault schedule.",
            facts: ["B9", "B10"],
          },
          {
            name: "Invariant and property checks",
            status: "implemented",
            note: "Target-specific invariants, evaluated on ground truth only.",
            facts: ["B7"],
          },
          {
            name: "Fix verification",
            status: "implemented",
            note: "Basic: after a fix, a stored case is switched by hand to expect no violation and re-run on its stored seeds. On stochastic targets, zero failures in 10 runs is weak evidence, not proof. No fix has been verified this way yet.",
            facts: ["B11"],
          },
          {
            name: "Regression generation",
            status: "implemented",
            note: "Self-contained JSON cases and a pytest runner. No CI integration yet.",
            facts: ["B11", "C1"],
          },
          {
            name: "Engineering reporting",
            status: "implemented",
            note: "Self-contained HTML trace reports.",
            facts: ["B12"],
          },
        ],
      },
    ],
  },
  outputs: {
    kicker: "WHAT AN ENGINEER RECEIVES / 003",
    title: "Evidence, not alerts.",
    lede: "For each reproduced failure, the current engine produces:",
    items: [
      {
        title: "Execution trace",
        body: "Every event from the run, with what the system reported kept apart from what actually happened.",
        facts: ["B6", "B12"],
      },
      {
        title: "Failure evidence",
        body: "Which property was violated, when, and the measured values behind the verdict.",
        facts: ["B7"],
      },
      {
        title: "Target and build identity",
        body: "A fingerprint of the target build and a hash of the configuration the failure was found under.",
        facts: ["B5", "B11"],
      },
      {
        title: "Reduced fault sequence",
        body: "The fault schedule after delta debugging, with a flag when reduction was cut short by its time cap.",
        facts: ["B9"],
      },
      {
        title: "Reproduction rate",
        body: "On nondeterministic targets, how often the failure recurs on fresh seeds, with a 95% confidence interval.",
        facts: ["B10"],
      },
      {
        title: "Regression artifact",
        body: "A self-contained case that re-runs the failure scenario against future builds.",
        facts: ["B11"],
      },
      {
        title: "A starting point for checking a fix",
        body: "Stored replay seeds and the measured reproduction rate. After a fix, the case is switched to expect no violation on those seeds. On stochastic targets, zero failures in 10 runs is weak evidence, not proof.",
        facts: ["B11"],
      },
    ],
    note: "Outputs of the current research engine on its two targets. Formats will evolve with design-partner input.",
  },
  comparison: {
    kicker: "COMPLEMENTARY APPROACHES / 004",
    title: "Where Ordinum fits.",
    lede: "Fuzzing, penetration testing, resilience testing and verification are different methods. Each is strong at something; they overlap and can coexist. Ordinum is meant to work alongside them, and in time to coordinate specialized engines rather than replace them.",
    approaches: [
      {
        id: "unit",
        name: "Unit and integration tests",
        contributes: "Fast, precise checks that code meets its specification.",
        bestAt: "Catching regressions in known behavior, close to the code, on every change.",
        whereOrdinumFits:
          "Ordinum's regression cases are meant to sit beside these, adding cases that come from failures found at the system level.",
      },
      {
        id: "pentest",
        name: "Penetration testing and red teaming",
        contributes: "Expert adversarial assessment of real systems, including business logic and chained attack paths.",
        bestAt: "Human judgment, creativity and context that automation does not replicate.",
        whereOrdinumFits:
          "Planned security engines would run continuously between assessments and hand testers reproducible evidence. Not a replacement for expert testing.",
      },
      {
        id: "fuzzers",
        name: "Coverage-guided and binary fuzzers",
        contributes: "High-throughput exploration of inputs to parsers, binaries and firmware images.",
        bestAt: "Input-handling and memory-safety bugs, and increasingly stateful protocols and kernels.",
        whereOrdinumFits:
          "The intent is to integrate engines like these. Ordinum's own work so far focuses on timed faults across component boundaries.",
      },
      {
        id: "chaos",
        name: "Chaos and resilience engineering",
        contributes: "Deliberate failures injected into running, often production-like, infrastructure.",
        bestAt: "Validating recovery in real deployments at real scale.",
        whereOrdinumFits:
          "Shares fault injection and steady-state checks. Ordinum's emphasis is automated search over fault schedules, plus reproduction and reduction of what fails, in controlled environments before deployment.",
      },
      {
        id: "observability",
        name: "Observability",
        contributes: "Visibility into how systems behave under real load and real users.",
        bestAt: "Detecting and diagnosing issues in production.",
        whereOrdinumFits:
          "Ordinum produces traces before deployment. Production signals could inform which faults and properties are worth testing.",
      },
      {
        id: "system-verification",
        name: "System-level verification and simulation testing",
        contributes: "Formal methods, scenario-based simulation and deterministic simulation testing of whole systems.",
        bestAt: "Strong guarantees for modeled properties, or deep exploration of controlled environments.",
        whereOrdinumFits:
          "The closest category, with several established products and research tools. Ordinum's focus is reproducible failure evidence across heterogeneous components.",
      },
    ],
    hypothesis:
      "Ordinum is investigating whether coordinated testing across component boundaries can produce useful failure evidence that isolated testing workflows miss. That is a hypothesis we are testing, not a demonstrated advantage.",
  },
} as const satisfies {
  intro: { kicker: string; title: string; titleMuted: string; body: readonly string[] };
  layers: { kicker: string; title: string; lede: string; items: readonly ProductLayer[] };
  outputs: {
    kicker: string;
    title: string;
    lede: string;
    items: readonly { title: string; body: string; facts: readonly FactRef[] }[];
    note: string;
  };
  comparison: {
    kicker: string;
    title: string;
    lede: string;
    approaches: readonly Approach[];
    hypothesis: string;
  };
};

/* -------------------------------------------------------------------------- */
/* Technology page                                                             */
/* -------------------------------------------------------------------------- */

export type ArchitectureNode = {
  readonly name: string;
  readonly status: Status;
  readonly note?: string;
  readonly facts?: readonly FactRef[];
};

export type WorkflowItem = {
  readonly id: "execution" | "feedback" | "oracles" | "reproduction" | "minimization" | "regression";
  readonly title: string;
  readonly body: string;
  readonly today: string;
  readonly caveat: string;
  readonly facts: readonly FactRef[];
};

export type DomainCard = {
  readonly id: string;
  readonly category: string;
  readonly status: Status;
  readonly adapterExists: boolean;
  readonly failureModes: readonly string[];
  readonly proposedEngines: readonly string[];
  readonly evidence: string;
  readonly note?: string;
  /** Shown next to the status chip so "Implemented" is never read without its scope. */
  readonly scope?: string;
};

/** The 12 Nav2 fault kinds, exact names from src/ordinum/targets/nav2/mutations.py (B4). */
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

/** Nav2 invariants (B7): seven per episode, plus a topology check once per campaign. */
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

export const technology = {
  architecture: {
    kicker: "ARCHITECTURE / 001",
    title: "Four tiers.",
    titleMuted: "One verification layer in the middle.",
    lede: "Systems connect through adapters and specialized engines into shared infrastructure, which feeds engineering workflows. Solid nodes exist today; dashed nodes are planned.",
    tiers: [
      {
        id: "systems",
        name: "Systems under test",
        nodes: [
          { name: "Software & APIs", status: "planned" },
          { name: "AI & distributed services", status: "planned" },
          { name: "Firmware & embedded systems", status: "planned" },
          {
            name: "Robotics in simulation (ROS 2 / Nav2)",
            status: "implemented",
            note: "Plus the in-house toy target. Simulation only.",
            facts: ["A3", "E1"],
          },
          { name: "Physical hardware", status: "planned", facts: ["A7", "C2"] },
        ],
      },
      {
        id: "adapters",
        name: "Specialized adapters and testing engines",
        nodes: [
          {
            name: "Toy robot adapter",
            status: "implemented",
            note: "Deterministic and stochastic variants; planted bugs as positive controls.",
            facts: ["A3", "D1"],
          },
          {
            name: "ROS 2 / Nav2 adapter",
            status: "implemented",
            note: "Pinned Docker image; agent interposes on /scan, /odom, /tf and /cmd_vel.",
            facts: ["B5"],
          },
          {
            name: "Timed fault injection engine",
            status: "implemented",
            facts: ["B3", "B4"],
          },
          { name: "PX4 adapter", status: "planned", facts: ["C4"] },
          { name: "API, protocol, binary and firmware engines", status: "planned", facts: ["C2", "C3"] },
        ],
      },
      {
        id: "core",
        name: "Shared Ordinum infrastructure",
        nodes: [
          { name: "Scenario management", status: "implemented", facts: ["B3", "B8"] },
          { name: "Execution supervision", status: "implemented", facts: ["B2", "B13"] },
          { name: "Feedback collection", status: "implemented", facts: ["B6", "B8"] },
          { name: "Failure verification", status: "implemented", facts: ["B7"] },
          { name: "Reproduction", status: "implemented", facts: ["B10"] },
          { name: "Minimization", status: "implemented", facts: ["B9"] },
          { name: "Reporting", status: "implemented", facts: ["B12"] },
          { name: "Regression artifacts", status: "implemented", facts: ["B11"] },
        ],
      },
      {
        id: "workflows",
        name: "Engineering and CI workflows",
        nodes: [
          {
            name: "Regression cases + test runner",
            status: "implemented",
            note: "JSON cases executed by pytest.",
            facts: ["B11"],
          },
          { name: "CI integration (GitHub Actions, GitLab)", status: "planned", facts: ["C1"] },
          { name: "Trace export (MCAP / Foxglove)", status: "planned", facts: ["C6"] },
        ],
      },
    ],
    note: "Single-machine, standard-library Python today. Two targets demonstrate the contract; that does not mean every category is supported.",
  },
  contract: {
    kicker: "THE TARGET CONTRACT / 002",
    title: "What \"target-agnostic\" means here.",
    body: [
      "Every target implements one episode-level contract: describe itself, open a session, report a fingerprint of the exact build, and run one scenario with a given seed and deadline, returning a trace. The target declares its time model and whether it is deterministic or stochastic.",
      "The generic layers (search, minimization, replay, invariants, reporting) never import a target, and a test enforces that boundary. Adding a new kind of system means writing an adapter, not changing the core.",
    ],
    caveat: "Designed to be generic; demonstrated on two targets so far.",
    facts: ["B1", "G4"],
  },
  status: {
    kicker: "STATUS / 003",
    title: "Built, next, planned.",
    groups: [
      {
        id: "built",
        label: "Built today",
        items: [
          "Target-agnostic core: contract, supervisor, search, minimization, replay, invariants, reporting",
          "Toy robot target (deterministic and stochastic) with 11 planted failure classes",
          "ROS 2 Jazzy / Nav2 1.3.13 integration in a simplified loopback simulation",
          "Evidence tooling: trace reports, regression cases, pre-registration lock, statistics library",
        ],
        facts: ["B1", "B2", "B8", "B9", "B10", "B12", "A3", "D1", "B5", "B11", "B14", "B15"],
      },
      {
        id: "next",
        label: PLAN_BASIS_LABELS.roadmap,
        items: [
          "Physically valid fault vocabulary and fault-aware oracle bounds",
          "A state estimator (EKF/AMCL) in the Nav2 loop",
          "CI job and MCAP trace export",
          "A full, pre-registered Nav2 benchmark on the corrected harness",
          "PX4 adapter and a Gazebo-backed simulation tier",
        ],
        facts: ["C8", "C1", "C6", "C9", "C4", "C5"],
      },
      {
        id: "planned",
        label: PLAN_BASIS_LABELS.vision,
        items: [
          "Adapters for APIs, distributed services and AI agents",
          "Security-focused testing engines",
          "Firmware and hardware adapters",
          "Cross-domain campaigns",
          "Distributed, multi-host execution",
        ],
        facts: ["C2", "C3", "C10", "C7"],
      },
    ],
    note: "Both planned groups are plans, not finished features. \"Next on the roadmap\" is committed in the engineering roadmap; \"Longer term\" comes from the company vision and is not yet scheduled. Nothing is listed as in development unless working code exists.",
  },
  workflow: {
    kicker: "HOW EACH STAGE WORKS / 004",
    title: "The method,",
    titleMuted: "with its limits stated.",
    items: [
      {
        id: "execution",
        title: "Execution",
        body: "The core coordinates target-specific scenarios under a supervisor with per-episode deadlines and in-process or subprocess isolation. Each episode ends as PASS, FAIL, TIMEOUT, HANG, CRASH or INFRA_ERROR.",
        today: "Some targets are deterministic (the toy robot); others are stochastic (Nav2 with its controller and simulator timing). Runs whose simulation fidelity falls below a threshold are rejected and retried.",
        caveat: "Execution is not deterministic in general. The engine treats determinism as a property each target declares.",
        facts: ["B1", "B2", "B13"],
      },
      {
        id: "feedback",
        title: "Feedback",
        body: "Search strategies can be guided by target-specific signals: behavioral coverage, state transitions or counters, read only from what the system itself reports.",
        today: "Five strategies share one accounting: scripted, random, mutation without feedback, generic feedback and full feedback, with a power schedule and checkpoint/resume.",
        caveat: "Feedback guidance has not been shown to outperform random search. Our corrected benchmark did not find a general advantage.",
        facts: ["B8", "G1", "D4", "D5"],
      },
      {
        id: "oracles",
        title: "Oracles",
        body: "A checker separate from the search evaluates specified properties against authoritative evidence: ground truth from the simulator, which the search does not read. Verdicts do not steer the search (an opt-in setting exists; it was off in every experiment).",
        today: "Nav2: seven invariants per episode (collision, speed, claimed-versus-true success, motion while unsafe, stuck, liveness) plus a topology check. Toy target: eleven.",
        caveat: "A violated property is a test failure, not automatically a defect or a vulnerability. It can come from the fault, the harness or the oracle bound, and has to be classified.",
        facts: ["B6", "B7"],
      },
      {
        id: "reproduction",
        title: "Reproduction",
        body: "Deterministic targets: exact replay is possible under a stable execution contract. Each trial must match the trace hash of a reference replay at the discovery seed (bit-identical under the target's determinism contract). Nondeterministic targets: the failure is re-run on fresh seeds and reported as k of N with a 95% Wilson interval.",
        today: "Exact replay on the deterministic toy target. Statistical reproduction on Nav2.",
        caveat: "Statistical reproduction is not identical trace replay. A rate like 8/10 is a measurement with uncertainty.",
        facts: ["B10"],
      },
      {
        id: "minimization",
        title: "Minimization",
        body: "Delta debugging (ddmin) tries to remove faults from a failing schedule while the same property still fails, using a three-way oracle: reproduces, does not, or unresolved. Stochastic targets use a k-of-n oracle.",
        today: "Results are 1-minimal at best: no single fault can be removed. When the time cap stops verification, the result is flagged.",
        caveat: "Not a guarantee of the smallest possible reproducer. On stochastic targets, minimality is judged by a statistical oracle (at least 3 of 10 runs), so it is itself a statistical result. In the Nav2 pilot, two of three reductions hit the 600 s cap.",
        facts: ["B9", "E6"],
      },
      {
        id: "regression",
        title: "Regression",
        body: "Each reproduced failure becomes a self-contained case: scenario, configuration hash, target fingerprint, violated property, minimization and reproduction data.",
        today: "Cases run under pytest. Stochastic cases store replay seeds and how many of them must still fail, taken from the measured reproduction interval; that check confirms the failure still reproduces.",
        caveat: "Checking a fix is basic: the case is switched by hand to expect no violation, and zero failures in 10 seeded runs is weak evidence, not proof. No GitHub Actions or customer CI integration exists yet.",
        facts: ["B11", "C1"],
      },
    ],
  },
  nav2: {
    kicker: "FIRST INTEGRATION / 005",
    title: "ROS 2 / Nav2.",
    body: "The first real target: stock Nav2 1.3.13 on ROS 2 Jazzy, in a pinned Docker image with no network access. An agent inside the container interposes on the scan, odometry, transform and velocity-command topics, owns the simulation clock, and keeps a ground-truth tap taken before any fault is applied.",
    faultKinds: NAV2_FAULT_KINDS,
    invariants: NAV2_INVARIANTS,
    limits: [
      "Simplified loopback simulation: no physics, no collisions, no state estimator (EKF/AMCL), static map-to-odom transform.",
      "Some faults can create physically impossible situations, and oracle bounds are not yet fault-aware.",
      "Simulation only. Ordinum does not run against physical hardware or external services.",
    ],
    facts: ["B4", "B5", "B7", "E1", "G3", "A7"],
  },
  whyFirst: {
    title: "Why ROS 2 first, and what carries over.",
    points: [
      {
        title: "A system we did not write",
        body: "Nav2 is public and independently maintained, so what we reproduce there is not shaped by a target we built for ourselves.",
        facts: ["B5"],
      },
      {
        title: "Many components on a message bus",
        body: "A ROS 2 stack is separate processes exchanging messages. The boundaries between them can be observed and interposed on without changing the system's source.",
        facts: ["B5"],
      },
      {
        title: "Fault categories that are not robot-specific",
        body: "Delayed, dropped, reordered and stale messages, and components deactivated mid-task, are the same categories of fault that occur between services.",
        facts: ["B4"],
      },
      {
        title: "A core that does not assume ROS",
        body: "The generic layers never import a target, and a test enforces it. The toy target and Nav2 already run on the same core.",
        facts: ["B1", "G4"],
      },
    ],
    next: "Next on the committed roadmap: a more realistic Nav2 harness and a PX4 adapter, both robotics. A first non-robotics adapter, for APIs or backend services, is part of the company plan but is not yet scheduled.",
  },
  domains: {
    kicker: "DOMAINS / 006",
    title: "Where the same layer could apply.",
    lede: "One card per system category. Failure modes and engines are what we would expect to need; evidence and adapters are what exists today.",
    cards: [
      {
        id: "software",
        category: "Applications & APIs",
        status: "planned",
        adapterExists: false,
        failureModes: [
          "Stale authorization honored across services",
          "Retries that duplicate side effects",
          "Partial failures leaving inconsistent state",
          "Malformed or out-of-order requests",
        ],
        proposedEngines: ["Stateful API fuzzing", "Protocol testing", "Fault injection at service boundaries"],
        evidence: "None yet.",
      },
      {
        id: "ai",
        category: "AI & agents",
        status: "planned",
        adapterExists: false,
        failureModes: [
          "Tool errors or timeouts turning into unsafe actions",
          "Stale or conflicting context between steps",
          "Untrusted tool output steering later actions",
          "Retry and escalation loops",
        ],
        proposedEngines: ["Tool-call fault injection", "Adversarial input generation", "Property checks on actions taken"],
        evidence: "None yet.",
      },
      {
        id: "cloud",
        category: "Cloud & distributed infrastructure",
        status: "planned",
        adapterExists: false,
        failureModes: ["Network partitions and delayed messages", "Node restarts mid-operation", "Clock skew", "Resource exhaustion"],
        proposedEngines: ["Network and process fault injection", "Schedule exploration", "Consistency checks"],
        evidence: "None yet.",
      },
      {
        id: "os",
        category: "Operating systems & middleware",
        status: "planned",
        adapterExists: false,
        failureModes: ["Message delay, loss and reordering", "Scheduling delays", "Lifecycle transitions at the wrong time", "Resource exhaustion"],
        proposedEngines: ["Interposition on messaging and IPC", "Lifecycle and timing fault injection"],
        evidence: "None as a general capability.",
        note: "The Nav2 adapter already interposes on ROS 2 topics for one robotics stack. General middleware support is not built.",
      },
      {
        id: "firmware",
        category: "Firmware & embedded devices",
        status: "planned",
        adapterExists: false,
        failureModes: ["Corrupted input at hardware interfaces", "Watchdog resets", "Timing violations", "Unsafe recovery after reset"],
        proposedEngines: ["Binary and firmware fuzzing", "Fault injection at driver and register interfaces", "Hardware-in-the-loop testing"],
        evidence: "None yet.",
      },
      {
        id: "robotics",
        category: "Robotics & physical systems",
        status: "implemented",
        scope: "ROS 2 / Nav2 · simulation only",
        adapterExists: true,
        failureModes: [
          "Stale, noisy or delayed sensor and transform data",
          "Obstacles appearing mid-task",
          "Components deactivated mid-task",
          "Success reported when the goal was not reached",
        ],
        proposedEngines: ["Timed fault injection (12 Nav2 fault kinds)", "Search strategies with optional feedback", "Ground-truth invariant checks"],
        evidence: `Exploratory Nav2 pilot: ${nav2PilotTotals.executions} executions, ${nav2PilotTotals.reproducedClasses} reproduced violation classes, all classified as harness, configuration or oracle artifacts; ${nav2PilotTotals.confirmedNav2Defects} confirmed Nav2 defects. Pre-registered toy benchmark.`,
        note: "Simplified loopback simulation, not physical hardware. A PX4 adapter is planned.",
      },
    ],
  },
} as const satisfies {
  architecture: {
    kicker: string;
    title: string;
    titleMuted: string;
    lede: string;
    tiers: readonly { id: string; name: string; nodes: readonly ArchitectureNode[] }[];
    note: string;
  };
  contract: { kicker: string; title: string; body: readonly string[]; caveat: string; facts: readonly FactRef[] };
  status: {
    kicker: string;
    title: string;
    groups: readonly { id: "built" | "next" | "planned"; label: string; items: readonly string[]; facts: readonly FactRef[] }[];
    note: string;
  };
  workflow: { kicker: string; title: string; titleMuted: string; items: readonly WorkflowItem[] };
  nav2: {
    kicker: string;
    title: string;
    body: string;
    faultKinds: readonly string[];
    invariants: { perEpisode: readonly string[]; perCampaign: readonly string[] };
    limits: readonly string[];
    facts: readonly FactRef[];
  };
  whyFirst: {
    title: string;
    points: readonly { title: string; body: string; facts: readonly FactRef[] }[];
    next: string;
  };
  domains: { kicker: string; title: string; lede: string; cards: readonly DomainCard[] };
};

/* -------------------------------------------------------------------------- */
/* Research page                                                               */
/* -------------------------------------------------------------------------- */

export type ResearchStat = {
  readonly value: string;
  readonly label: string;
  readonly caption: string;
  readonly facts: readonly FactRef[];
};

export type HypothesisRow = {
  readonly id: string;
  readonly comparison: string;
  readonly result: string;
  readonly holmP: string;
  readonly a12: string;
  readonly verdict: "Supported" | "Not supported";
};

export const research = {
  status: {
    kicker: "CURRENT STATUS / 001",
    title: "Where the engineering stands.",
    summary: [
      "What the evidence supports today: the verification loop works end to end on a real navigation stack. A check that is separate from the search catches a violation; the engine measures how often it reproduces, reduces the fault schedule and stores a regression case, and every result is classified before it is reported.",
      "Which search strategy finds failures fastest is still an open research question. Our pre-registered benchmark has not shown that feedback-guided search beats random, and we report that below alongside everything else.",
    ],
    asOf: FACT_SOURCE.note,
    stats: [
      {
        value: "2",
        label: "Working targets",
        caption: "An in-house toy robot (deterministic and stochastic variants) and stock ROS 2 / Nav2 in a simplified simulation.",
        facts: ["A3"],
      },
      {
        value: String(nav2PilotTotals.executions),
        label: "Nav2 pilot executions",
        caption: `${nav2PilotTotals.campaigns} exploratory campaigns, all completed.`,
        facts: ["E3"],
      },
      {
        value: String(nav2PilotTotals.reproducedClasses),
        label: "Violations reproduced",
        caption: "Statistically reproduced; minimization attempted (one 1-minimal, two stopped by the 600 s cap). All three classified as harness, configuration or oracle artifacts.",
        facts: ["E6", "E7"],
      },
      {
        value: "655,218",
        label: "Toy benchmark executions",
        caption: "300 pre-registered campaigns, all completed, none excluded.",
        facts: ["D2"],
      },
      {
        value: "268",
        label: "Engine tests passing",
        caption: "Plus one skipped test that needs Docker. The Docker/Nav2 end-to-end path is not part of the default suite.",
        facts: ["A1"],
      },
    ],
    review:
      "A separate adversarial review pass, briefed to argue against each classification, re-examined all three and upheld them.",
    reviewFacts: ["E9"],
  },
  toy: {
    kicker: "TOY BENCHMARK / 002",
    title: "Does feedback-guided search beat random?",
    titleMuted: "Our benchmark has not shown it.",
    lede: "A pre-registered benchmark on a controlled target we built, designed to test whether feedback guidance finds more failure classes than random fault injection.",
    plainResult:
      "In plain terms: every automated strategy found about 8.5 to 9 of the 11 planted failure classes per campaign on average; the fixed scripted catalog found 6. The differences between the automated strategies were not statistically significant.",
    target:
      "An 8×8 grid robot with a sensor, A* planner, state machine, controller and actuator, and 11 failure classes we planted deliberately. Exhaustive enumeration shows four of them need at least three faults.",
    design: [
      "5 strategies: scripted catalog, random, mutation without feedback, generic feedback, full feedback",
      "30 seeds per strategy, a budget of 5,000 executions per campaign (the scripted catalog runs out earlier); 300 of 300 campaigns completed, none excluded",
      "655,218 search executions in total, plus a 36-second equal-wall-clock sensitivity check",
      "Hypotheses, configuration, analysis code and engine source hash-locked before any campaign ran",
    ],
    metric:
      "Distinct failure classes per campaign, each confirmed by delta debugging and three-of-three replay with the same trace hash. Two-sided Mann-Whitney U, Vargha-Delaney A12, α = 0.05, Holm correction, 10,000-resample bootstrap.",
    rows: [
      {
        id: "H1",
        comparison: "Full feedback vs random",
        result: "9.00 vs 8.63 classes",
        holmP: "0.18",
        a12: "0.63",
        verdict: "Not supported",
      },
      {
        id: "H2",
        comparison: "Generic feedback vs the same mutator without feedback",
        result: "8.77 vs 8.47 classes",
        holmP: "0.20",
        a12: "0.61",
        verdict: "Not supported",
      },
      {
        id: "P3",
        comparison: "Full feedback vs mutation without feedback",
        result: "9.00 vs 8.47 classes",
        holmP: "0.076",
        a12: "0.67",
        verdict: "Not supported",
      },
      {
        id: "P4",
        comparison: "Full vs generic feedback",
        result: "9.00 vs 8.77 classes",
        holmP: "0.24",
        a12: "0.58",
        verdict: "Not supported",
      },
      {
        id: "P5",
        comparison: "Full feedback vs scripted catalog",
        result: "9.00 vs 6.00 classes",
        holmP: "3.9 × 10⁻¹²",
        a12: "1.00",
        verdict: "Supported",
      },
    ],
    narrowResult:
      "One narrow result: the full-feedback strategy reached one planted three-fault bug in 16 of 30 campaigns, random in 0 of 30 (Holm p 4.3 × 10⁻⁵). The ablation (9 of 30 vs 4 of 30, Holm p 0.51) does not attribute this to feedback, and random was as fast or faster on the other three deep classes.",
    supports: [
      "The loop works end to end: search, judge on ground truth, minimize, replay, store as a regression case.",
      "Automated search finds more failure classes than a fixed scripted catalog.",
    ],
    doesNotSupport: [
      "Any general advantage of feedback guidance over random search.",
      "Equivalence: a non-significant difference is not evidence that the strategies are equal.",
      "Anything about real systems: the bugs are planted, and the toy is ours.",
    ],
    notes: [
      "The equal-wall-clock run is a sensitivity check, not a replication.",
      "Nine corrections from a separate adversarial review pass are appended to the report.",
      "We saw outcomes on one seed before the lock; this is disclosed in the report.",
    ],
    facts: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D10", "D13", "D14", "G7"],
  },
  nav2: {
    kicker: "NAV2 PILOT / 003",
    title: "A small exploratory pilot",
    titleMuted: "on a real navigation stack.",
    lede: "Stock ROS 2 / Nav2 in a simplified loopback simulation, run on a single laptop. Exploratory and low-powered: with three seeds per strategy, no comparison between strategies can reach statistical significance.",
    setup: [
      "4 strategies (random, mutation without feedback, generic feedback, scripted) × 3 seeds × 1,200 s of search, on 2 Nav2 instances",
      `${nav2PilotTotals.campaigns} of ${nav2PilotTotals.campaigns} campaigns completed; ${nav2PilotTotals.executions} executions; about 2 hours of search plus 34 minutes of confirmation`,
      "Fault-free baseline: 40 of 40 runs succeeded with 0 violations (95% Wilson interval 0–8.8%)",
      "About 18% of attempts (107) were rejected by harness-health checks, mostly for low simulation fidelity, and retried; 3 executions ended as infrastructure errors",
    ],
    perArm: [
      { arm: "Random", classesPerSeed: "1 / 3 / 1" },
      { arm: "Mutation without feedback", classesPerSeed: "0 / 0 / 1" },
      { arm: "Generic feedback", classesPerSeed: "0 / 0 / 0" },
      { arm: "Scripted", classesPerSeed: "0 / 1 / 1" },
    ],
    perArmNote:
      "Random found all three violation classes; the feedback strategy found none. With about 40 executions per campaign and three seeds, this does not show that random is generally better.",
    /** Rendered from lib/evidence.ts: invariant, reproduction, minimization, classification. */
    findings: nav2PilotFindings.map((f) => ({
      invariant: f.invariant,
      reproduction: `${f.reproduction.rate} (Wilson ${Math.round(f.reproduction.wilson95[0] * 100)}–${Math.round(f.reproduction.wilson95[1] * 100)}%)`,
      minimization: `${f.minimized.before} → ${f.minimized.after} faults${f.minimized.oneMinimal ? ", 1-minimal" : ", time cap reached"}`,
      label: EVIDENCE_LABELS[f.label],
      classification: f.classification,
      reviewQuote: f.reviewQuote,
    })),
    classifications: [
      {
        invariant: "success_mismatch",
        explanation:
          "Unrealistic noise (σ 0.36 m) on the only position source, in a setup with no state estimator to reject it.",
      },
      {
        invariant: "liveness",
        explanation:
          "An injected obstacle overlapping the robot itself. Nav2 stopped safely and did not finish within our time bound. The class is mixed; one near-goal case is under follow-up.",
      },
      {
        invariant: "stuck",
        explanation:
          "Our 30 s stall bound was shorter than the ~37 s transform delay we injected. Nav2 refused to drive on stale data and completed once the delay ended.",
      },
    ],
    conclusion:
      "All three are artifacts of our faults, harness or oracle bounds. No Nav2 software defect was found, and nothing was filed upstream. The value of the pilot is that the full loop ran on a real stack, and that each finding was checked and classified rather than counted.",
    facts: ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"],
  },
  traceDemo: {
    /** Anchor id used by links from the home page and contact page. */
    id: "trace-demo",
    kicker: "A REAL TRACE / 004",
    title: "One failure,",
    titleMuted: "from injection to classification.",
    lede: "The success_mismatch case from the Nav2 pilot, rendered from the committed report and traces.",
    label: EVIDENCE_LABELS[sm.label],
    steps: [
      {
        k: "Original scenario",
        v: `Task ${sm.task.id} (${sm.task.name}) on the depot map. Found by the random strategy. ${sm.minimization.before} faults scheduled, ${sm.minimization.beforeApplied} applied.`,
      },
      {
        k: "Injected faults",
        v: "Noise on odometry, noise on the odom→base_footprint transform (σ 0.356 m), laser scans reordered; a fourth fault never triggered.",
      },
      {
        k: "Execution timeline",
        v: "Goal accepted at 0.01 s; faults applied at 4.40 s and 6.52 s in the minimized run; Nav2 replanned about once a second.",
      },
      { k: "Observable result", v: `Nav2 reported ${sm.minimized.result.status} at ${sm.minimized.result.tS} s.` },
      { k: "Oracle conclusion", v: `${sm.verdict.invariant} violated: ${sm.verdict.detail}.` },
      {
        k: "Reproduction",
        v: `${sm.reproduction.rate} on fresh seeds, ${sm.reproduction.wilson95Text}. The original run did not violate when re-run at its own seed.`,
      },
      {
        k: "Minimized scenario",
        v: `${sm.minimization.before} → ${sm.minimization.after} faults in ${sm.minimization.runs} runs. Not verified 1-minimal (600 s cap). Transform noise alone reproduces ${sm.followUp.tfNoiseOnly}.`,
      },
    ],
    limitations: sm.caveats,
    observationVsDefect: {
      title: "A robustness observation is not a confirmed defect.",
      body: "A reproduced invariant violation shows that, under specific faults, the system's behavior broke a property we specified. Whether that is a defect depends on whether the faults are realistic, the harness is faithful and the property is right. A confirmed defect needs that analysis, and ideally confirmation by the system's maintainers. This case did not pass that bar, and we say so.",
    },
    otherArtifacts: [
      { label: EVIDENCE_LABELS[nav2Nominal.label], text: nav2Nominal.labelShort, source: nav2Nominal.source },
      { label: EVIDENCE_LABELS[toyPositiveControl.label], text: toyPositiveControl.labelShort, source: toyPositiveControl.source },
    ],
    source: `Source: ${sm.source}; ${sm.regressionCase}`,
  },
  notProven: {
    kicker: "WHAT WE HAVE NOT PROVEN / 005",
    title: "Open questions.",
    items: [
      "A general advantage of guided search over random search, on either target.",
      "An independently confirmed defect in Nav2 or any other system.",
      "Results beyond a simplified ROS 2 loopback simulation: no physics, no state estimator, no physical hardware.",
      "Capability outside robotics. Other domains are planned, not built.",
      "Use by customers or design partners. There are none yet.",
    ],
    closing: "More realistic targets and more research are needed. We would rather publish that than overstate what we have.",
    facts: ["G1", "E8", "G3", "C2", "A5"],
  },
  roadmap: {
    kicker: "RESEARCH ROADMAP / 006",
    title: "What we are working toward.",
    items: [
      { title: "More realistic fault generation", body: "Physically valid faults and fault-aware oracle bounds.", basis: "roadmap", facts: ["C8"] },
      { title: "Better oracles", body: "A state estimator in the loop, and per-mechanism confirmation of each finding.", basis: "roadmap", facts: ["C8"] },
      { title: "Comparative testing", body: "A full, pre-registered Nav2 benchmark; every search change measured against random and its ablation.", basis: "roadmap", facts: ["C9", "H2"] },
      { title: "An independent reference target", body: "Evaluation on systems we did not write, starting with a PX4 adapter.", basis: "roadmap", facts: ["C4", "H3"] },
      { title: "Integration with existing testing engines", body: "Bringing established engines into the shared layer.", basis: "vision", facts: ["C3"] },
      { title: "Cross-system reference target", body: "A target that spans heterogeneous components, to test the cross-boundary hypothesis directly.", basis: "vision", facts: ["C10"] },
      { title: "Design-partner validation", body: "Testing whether the workflow is useful on real teams' systems, if partners agree.", basis: "roadmap", facts: ["H3"] },
    ],
    note: "Plans, not results. Each will be reported with the same discipline, whatever the outcome.",
  },
  withdrawn: {
    kicker: "HISTORY / 007",
    title: "Withdrawn v1 results",
    body: [
      "An earlier version of this site reported v1 benchmark gains for feedback-guided search over random fault injection, on our toy target. We withdrew those results after an internal audit on 22 October 2026.",
      "The audit found a coverage metric that rewarded the guided strategy's own objective, a random baseline whose faults often landed after the episode had ended, accounting that hid a failure class, overstated failure depth, a reproduction figure that was true by construction, and no confidence intervals or significance tests.",
      "The v2 experiments above were redesigned in response, and pre-registered and hash-locked before their campaigns ran. Two disclosures apply: outcomes on one toy seed were seen before the lock, and the Nav2 pilot that ran is a documented deviation from its first pre-registration. The audit, the new runs and these write-ups date from 22 and 23 October 2026.",
    ],
    facts: ["F1", "F2", "F3"],
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Vision page                                                                 */
/* -------------------------------------------------------------------------- */

export type Horizon = {
  readonly n: string;
  readonly name: string;
  readonly title: string;
  readonly body: string;
  readonly items: readonly string[];
  readonly status: Status;
};

export const vision = {
  intro: {
    kicker: "THE MISSION / 001",
    title: "Reliability and security live at the boundaries.",
    body: [
      "Modern technology is assembled from software, AI models, infrastructure, firmware and hardware, built by different teams and tested in different ways. The boundaries between them are where assumptions meet, and where many of the hardest failures and security problems begin.",
      "Ordinum's mission is continuous adversarial verification infrastructure that spans those boundaries: one layer where specialized testing engines run, failures are verified and reproduced, and the evidence becomes tests that keep problems fixed.",
    ],
  },
  scope: {
    title: "Long-term scope",
    items: [
      "Web applications and APIs",
      "Backend software and distributed services",
      "Cloud infrastructure and networks",
      "AI models, agents and tool-driven systems",
      "Operating systems, runtimes and middleware",
      "Embedded firmware and device drivers",
      "Silicon and hardware interfaces",
      "Robotics, autonomous vehicles and drones",
      "Industrial control systems and physical infrastructure",
    ],
    note: "Ambition, not current support. Today Ordinum runs on one robotics stack in simulation.",
  },
  horizons: {
    kicker: "THREE HORIZONS / 002",
    title: "How we expect to get there.",
    items: [
      {
        n: "01",
        name: "Working foundation",
        title: "A target-agnostic core, validated first on ROS 2.",
        body: "Execution, verification, reproduction and regression infrastructure that does not depend on any one target, demonstrated end to end on a toy target and a real navigation stack in simulation.",
        items: ["Target-agnostic engine", "ROS 2 / Nav2 integration", "Pre-registered research, reported with its limitations"],
        status: "implemented",
      },
      {
        n: "02",
        name: "Cross-system verification",
        title: "Workflows that span components and environments.",
        body: "Campaigns involving multiple software components and different execution environments, integration with specialized engines, and verification evidence that can be reused across them.",
        items: ["Additional adapters", "Specialized engine integrations", "Reusable verification evidence"],
        status: "planned",
      },
      {
        n: "03",
        name: "Universal security and verification layer",
        title: "Continuous adversarial testing across everything an organization builds.",
        body: "Organizations coordinating continuous adversarial testing across the technology they build and operate. A long-term aspiration, not something available today.",
        items: ["Software to hardware", "Security and correctness together", "Continuous, not periodic"],
        status: "planned",
      },
    ],
  },
  applications: {
    kicker: "WHERE IT COULD MATTER / 003",
    title: "Applications we want to explore.",
    lede: "Areas where failures across boundaries are costly. These are directions for research and design partnerships, not markets we serve today.",
    items: [
      { name: "Enterprise software", body: "Business systems built from many services, permissions and integrations." },
      { name: "Cloud and distributed systems", body: "Infrastructure where partial failures, retries and inconsistent state are normal operating conditions." },
      { name: "AI agents", body: "Systems where model output becomes tool calls and actions on other systems." },
      { name: "Connected devices", body: "Products that combine device software, cloud services and user-facing applications." },
      { name: "Firmware and embedded products", body: "Software that enforces limits on behalf of the hardware it controls." },
      { name: "Robotics and autonomous systems", body: "Where timing, sensing and control failures become physical behavior. Our first validation environment." },
    ],
  },
  tools: "Specialized security and testing tools will remain essential. We expect integration and coordination with them to be part of the strategy, not replacement.",
  closing: "Every system deserves to be tested beyond its assumptions.",
} as const satisfies {
  intro: { kicker: string; title: string; body: readonly string[] };
  scope: { title: string; items: readonly string[]; note: string };
  horizons: { kicker: string; title: string; items: readonly Horizon[] };
  applications: {
    kicker: string;
    title: string;
    lede: string;
    items: readonly { name: string; body: string }[];
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
  /** Profile fields. Absent while the profile awaits founder confirmation. */
  readonly education?: string;
  /** Short factual line. No invented achievements, responsibilities or credentials. */
  readonly summary?: string;
  readonly current?: string;
  readonly previous?: readonly PreviousRole[];
  readonly linkedin?: string;
  /**
   * true = the founder has not yet approved publishing this person's profile. Only the name
   * and role (approved: "Ordinum has two co-founders") are rendered; no profile details.
   */
  readonly pendingConfirmation: boolean;
};

const armaan = {
  name: "Armaan Singla",
  role: "Co-founder",
  education: "Computer Engineering, Queen's University",
  summary: "Currently leads much of Ordinum's technical engineering work.",
  current: "Software Engineer Intern, AMD Product Security Office, building fuzzing agents.",
  previous: [
    { company: "Geotab", team: "Agent Center of Excellence", focus: "Multi-agent systems" },
    { company: "Scotiabank", team: "CID&A", focus: "Data science" },
    { company: "Home Trust", team: "Data & AI", focus: "Data and AI" },
    { company: "GuestLogix", team: "Production Observability & Metrics", focus: "Production observability and metrics" },
  ],
  linkedin: site.founderLinkedin,
  pendingConfirmation: false,
} as const satisfies Founder;

/**
 * PENDING FOUNDER CONFIRMATION (Aarav Singla's personal profile).
 * Approved now: his name and the title "Co-founder". His drafted profile (education, status,
 * LinkedIn) lives in lib/team.server.ts, a server-only module, so it never reaches the client
 * bundle; it is rendered only once `pendingConfirmation` is set to false after Armaan approves.
 * Nothing beyond the founder-provided facts may be added.
 */
const aarav = {
  name: "Aarav Singla",
  role: "Co-founder",
  pendingConfirmation: true,
} as const satisfies Founder;

/** True while any founder profile still awaits approval. */
export const ABOUT_PROFILES_PENDING = [armaan, aarav].some((f) => f.pendingConfirmation);

export const about = {
  story: {
    kicker: "ORIGIN / 001",
    title: "Built at the intersection of",
    titleMuted: "systems security, automated testing and software reliability.",
    body: [
      "Ordinum is being built at the intersection of systems security, automated testing and software reliability. Armaan's experience in low-level fuzzing, multi-agent engineering and production systems motivated a broader question: how can complex systems be continuously tested for failures that emerge from their interactions?",
      // PENDING FOUNDER CONFIRMATION: reason taken from the product repo's wedge analysis (docs/WEDGE.md).
      "We started with ROS 2 / Nav2 because it is a public, independently maintained system built from many communicating components, where we could test code we did not write and build a repeatable adapter pattern. The question itself is broader, and so is the company we are building.",
    ],
  },
  disciplines: {
    kicker: "WHAT WE DRAW ON / 002",
    title: "The problem spans several disciplines.",
    items: [
      { title: "Security testing and fuzzing", body: "Automated search for inputs and conditions nobody wrote a test for." },
      { title: "Production software engineering", body: "How real systems are built, deployed and changed." },
      { title: "AI agents and distributed workflows", body: "Many components acting on shared, imperfect state." },
      { title: "Observability and debugging", body: "Turning what happened into something an engineer can act on." },
      { title: "Systems reliability", body: "Designing for retries, restarts, timeouts and degraded modes." },
      { title: "Cross-component failures", body: "The handoffs where each side is correct and the whole is not." },
    ],
  },
  team: {
    kicker: "THE TEAM / 003",
    title: "Two co-founders.",
    lede: "Ordinum is being co-founded by Armaan Singla and Aarav Singla.",
  },
  /** Kept for the existing About component; same object as founders[0]. */
  founder: armaan,
  founders: [armaan, aarav],
  independence:
    "Ordinum is independent. It is not affiliated with or endorsed by any current or past employer of its founders, and it contains no employer code or confidential material.",
  noTeamPhotos: true,
} as const satisfies {
  story: { kicker: string; title: string; titleMuted: string; body: readonly string[] };
  disciplines: { kicker: string; title: string; items: readonly { title: string; body: string }[] };
  team: { kicker: string; title: string; lede: string };
  founder: Founder;
  founders: readonly Founder[];
  independence: string;
  noTeamPhotos: boolean;
};

/* -------------------------------------------------------------------------- */
/* Contact page + form                                                         */
/* -------------------------------------------------------------------------- */

/** Values stored in waitlist.request_type. Keep in sync with lib/schema.ts and the migration. */
export const REQUEST_TYPES = [
  { value: "technical_demo", label: "Technical demonstration" },
  { value: "design_partnership", label: "Design partnership" },
  { value: "security_testing", label: "Security testing discussion" },
  { value: "research_collaboration", label: "Research collaboration" },
  { value: "general", label: "General inquiry" },
] as const;
export type RequestType = (typeof REQUEST_TYPES)[number]["value"];

/** Values stored in waitlist.technology_category. Keep in sync with lib/schema.ts and the migration. */
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

export const cta = {
  kicker: "WORK WITH US / 001",
  title: "Building something complex?",
  titleLine2: "Help us find what breaks.",
  body: "We're speaking with software, security, infrastructure, AI, embedded and robotics teams about difficult-to-reproduce failures and gaps in their testing workflows.",
  ctas: {
    partnership: { label: "Discuss a design partnership", href: "#contact-form" },
    talk: { label: "Talk to the team", href: site.calUrl },
    demo: { label: "See our current demo", href: "/research#trace-demo" },
  },
  stage: "Ordinum is research-stage. Conversations help decide what we build next; there is no product to buy yet.",
  /** What a design partnership means today. Facts only: no terms, pricing or pilot structure. */
  partnership: {
    title: "What a design partnership means right now",
    items: [
      "A conversation about your hardest cross-boundary failures: what breaks, how you find it today, and what makes it hard to reproduce.",
      "If your team builds on ROS 2 / Nav2, that is where the current engine works, and the most concrete place to start.",
      "For other stacks, what we learn shapes which adapters and testing engines we build next.",
    ],
  },
  form: {
    /** id for the <form> wrapper; the partnership CTA links here. */
    anchorId: "contact-form",
    emailLabel: "Work email",
    companyLabel: "Company or organization",
    roleLabel: "Role",
    technologyCategoryLabel: "Technology category",
    technologyCategoryPlaceholder: "Select a category",
    requestTypeLabel: "Request type",
    requestTypePlaceholder: "Select a request type",
    hardestFailureLabel: "What is the most difficult failure your team deals with?",
    hardestFailureHint: "A short description is enough.",
    messageLabel: "What would you like to explore?",
    optional: "Optional",
    requestTypes: REQUEST_TYPES,
    technologyCategories: TECHNOLOGY_CATEGORIES,
    confidentialityWarning:
      "Please don't include confidential details, credentials, customer data or unpatched vulnerability specifics.",
    /** Factual description of what happens to a submission today (Supabase table, no email notification). */
    dataNote: "Submissions are stored in our contact database and read by the Ordinum team.",
    submit: "Send",
    pending: "Sending",
    success: "Thanks. Your message was saved and will be read by the Ordinum team.",
    /**
     * Current backend behavior: a repeat submission from the same email is not stored.
     * If the backend changes to store repeat messages, update this text.
     */
    duplicate: `We already have a message from this email, so this one was not saved. To add details, email ${site.email}.`,
    error: `Something went wrong on our side and your message was not sent. Please try again, or email ${site.email}.`,
    invalid: "Check the highlighted fields and try again.",
    tooFast: "That was quick. Take a moment to check your details, then submit again.",
  },
  bookCall: { label: "Book a 30-min call", href: site.calUrl },
  emailFallback: `Or email ${site.email}`,
} as const satisfies {
  kicker: string;
  title: string;
  titleLine2: string;
  body: string;
  ctas: { partnership: Link; talk: Link; demo: Link };
  stage: string;
  partnership: { title: string; items: readonly string[] };
  form: {
    anchorId: string;
    emailLabel: string;
    companyLabel: string;
    roleLabel: string;
    technologyCategoryLabel: string;
    technologyCategoryPlaceholder: string;
    requestTypeLabel: string;
    requestTypePlaceholder: string;
    hardestFailureLabel: string;
    hardestFailureHint: string;
    messageLabel: string;
    optional: string;
    requestTypes: readonly { value: string; label: string }[];
    technologyCategories: readonly { value: string; label: string }[];
    confidentialityWarning: string;
    dataNote: string;
    submit: string;
    pending: string;
    success: string;
    duplicate: string;
    error: string;
    invalid: string;
    tooFast: string;
  };
  bookCall: Link;
  emailFallback: string;
};

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */

export const footer = {
  thesis: "Continuous adversarial testing and verification for interconnected software and hardware.",
  status: "Research-stage. First implemented integration: ROS 2 / Nav2.",
  columns: [
    {
      title: "Company",
      links: [
        { label: "Product", href: "/product" },
        { label: "Technology", href: "/technology" },
        { label: "Research", href: "/research" },
        { label: "Vision", href: "/vision" },
        { label: "About", href: "/about" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Talk to us", href: "/contact" },
        { label: "Book a call", href: site.calUrl, external: true },
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
  /** No Privacy link: no privacy page exists yet (draft is awaiting legal review). */
  legal: [{ label: "Terms", href: "/terms" }],
  copyright: "© 2026 Ordinum. All rights reserved.",
} as const satisfies {
  thesis: string;
  status: string;
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
  secondaryCta: { label: "Talk to us", href: "/contact" },
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

export type PageKey = "product" | "technology" | "research" | "vision" | "about" | "contact";

type PageCopy = {
  readonly href: string;
  readonly label: string;
  readonly header: {
    readonly kicker: string;
    readonly title: string;
    readonly titleMuted?: string;
    readonly lede: string;
  };
  /** meta.title is short; the root layout appends " · Ordinum". */
  readonly meta: { readonly title: string; readonly description: string };
};

export const pages = {
  product: {
    href: "/product",
    label: "Product",
    header: {
      kicker: "Product",
      title: "One verification platform.",
      titleMuted: "Different systems. Different testing engines.",
      lede: "An application, a firmware controller and a robot need different testing techniques. Ordinum is building shared infrastructure that supports specialized engines with consistent evidence and workflows.",
    },
    meta: {
      title: "Product",
      description:
        "How Ordinum is organized: systems under test, specialized testing engines and a shared layer for orchestration, verification, reproduction and regression, with the implementation status of each part.",
    },
  },
  technology: {
    href: "/technology",
    label: "Technology",
    header: {
      kicker: "Technology",
      title: "A common verification layer",
      titleMuted: "for different execution environments.",
      lede: "Architecture, methodology and current status: how Ordinum executes scenarios, injects faults, checks properties independently, reproduces and reduces failures, and keeps them as regression cases.",
    },
    meta: {
      title: "Technology",
      description:
        "Ordinum's architecture: a target-agnostic core for execution, independent verification, statistical and exact reproduction, delta debugging and regression artifacts, with a first integration on ROS 2 / Nav2.",
    },
  },
  research: {
    href: "/research",
    label: "Research",
    header: {
      kicker: "Research",
      title: "Evidence over claims.",
      lede: "Measured experiments, reproducible results, and explicit limitations from our work on automated fault testing and verification.",
    },
    meta: {
      title: "Research",
      description:
        "Ordinum's research: a pre-registered toy benchmark, an exploratory ROS 2 / Nav2 pilot, a real trace with its classification, what we have not proven, and withdrawn earlier results.",
    },
  },
  vision: {
    href: "/vision",
    label: "Vision",
    header: {
      kicker: "Vision",
      title: "Every system deserves to be tested",
      titleMuted: "beyond its assumptions.",
      lede: "Continuous adversarial verification across software, AI, infrastructure, firmware and hardware. Where we are going, and how we expect to get there.",
    },
    meta: {
      title: "Vision",
      description:
        "Ordinum's long-term ambition: continuous adversarial testing and verification across software, AI, infrastructure, firmware and hardware, in three horizons.",
    },
  },
  about: {
    href: "/about",
    label: "About",
    header: {
      kicker: "About",
      title: "Security, testing",
      titleMuted: "and reliability.",
      lede: "Who is building Ordinum, and the question that started it.",
    },
    meta: {
      title: "About",
      description:
        "Ordinum is being co-founded by Armaan Singla and Aarav Singla, at the intersection of systems security, automated testing and software reliability.",
    },
  },
  contact: {
    href: "/contact",
    label: "Contact",
    header: {
      kicker: "Contact",
      title: "Building something complex?",
      titleMuted: "Help us find what breaks.",
      lede: "We're speaking with software, security, infrastructure, AI, embedded and robotics teams about difficult-to-reproduce failures and gaps in their testing workflows.",
    },
    meta: {
      title: "Contact",
      description:
        "Talk to Ordinum about design partnerships, technical demonstrations, security testing and research collaboration.",
    },
  },
} as const satisfies Record<PageKey, PageCopy>;

/** Reading order for the "Next" link at the bottom of each inner page. */
export const pageOrder = ["product", "technology", "research", "vision", "about"] as const satisfies readonly PageKey[];

/* -------------------------------------------------------------------------- */
/* Home: explore grid + CTA band                                               */
/* -------------------------------------------------------------------------- */

export const explore = {
  kicker: "EXPLORE / 006",
  title: "Go deeper.",
  cards: [
    {
      page: "product",
      summary: "Systems, specialized engines and a shared verification layer, with the status of each part and how it relates to existing approaches.",
    },
    {
      page: "technology",
      summary: "The architecture, the target contract, and how execution, oracles, reproduction and minimization work, limits included.",
    },
    {
      page: "research",
      summary: "A pre-registered benchmark, an exploratory Nav2 pilot, a real trace, and what we have not proven.",
    },
    {
      page: "vision",
      summary: "From a working foundation to a verification layer across software, AI, infrastructure, firmware and hardware.",
    },
    {
      page: "about",
      summary: "The co-founders, and the question that started Ordinum.",
    },
  ],
} as const satisfies {
  kicker: string;
  title: string;
  cards: readonly { page: PageKey; summary: string }[];
};

/** Sage band closing each inner page (and the home page). */
export const ctaBand = {
  title: home.partnership.title,
  titleMuted: home.partnership.titleMuted,
  body: home.partnership.body,
  note: home.partnership.note,
  /** Primary button. Key kept as `demo` for the existing CtaBand component. */
  demo: home.partnership.primaryCta,
  secondary: home.partnership.secondaryCta,
  bookCall: { label: "Book a call", href: site.calUrl },
} as const satisfies {
  title: string;
  titleMuted: string;
  body: string;
  note: string;
  demo: Link;
  secondary: Link;
  bookCall: Link;
};
