/**
 * Ordinum 2.0 copy deck.
 *
 * Single source of truth for every word and number on the site.
 * Rules:
 *  - Every number must match the facts table in the approved plan exactly.
 *  - Never claim more failures than random, faster time-to-first-failure,
 *    results on real robots / ROS2 / customer systems, pilots, customers,
 *    or production readiness.
 *  - Simulated or composed visuals are labeled illustrative.
 */

/* -------------------------------------------------------------------------- */
/* Shared types                                                                */
/* -------------------------------------------------------------------------- */

export type Link = { readonly label: string; readonly href: string };
export type ExternalLink = Link & { readonly external?: boolean };

/** The ten fault kinds implemented in the prototype engine. */
export const FAULT_KINDS = [
  "sensor_dropout",
  "sensor_stale",
  "sensor_noise",
  "sensor_malformed",
  "obs_delay",
  "env_obstacle",
  "actuator_fail",
  "actuator_duplicate",
  "controller_retry",
  "value_bitflip",
] as const;
export type FaultKind = (typeof FAULT_KINDS)[number];

/** The seven invariants checked by the prototype engine. */
export const INVARIANTS = [
  "no_collision",
  "in_bounds",
  "max_speed",
  "no_duplicate_command",
  "leave_recovery",
  "act_requires_observation",
  "terminates",
] as const;
export type Invariant = (typeof INVARIANTS)[number];

export type LayerStatus = "today" | "roadmap";
export type Strategy = "feedback" | "random" | "scripted";
export type PillarIcon =
  | "coverage"
  | "fault"
  | "replay"
  | "minimize"
  | "regression"
  | "cross";
export type PhaseLabel = "Today" | "Next" | "Tomorrow";

export type PipelineStage = {
  readonly id: string;
  readonly label: string;
  readonly caption: string;
};

export type ProblemCard = {
  readonly id: string;
  readonly title: string;
  readonly chain: readonly string[];
  readonly layer: string;
  readonly detail: string;
};

export type Step = {
  readonly n: string;
  readonly title: string;
  readonly body: string;
  readonly tag: string;
};

export type Layer = {
  readonly id: string;
  readonly name: string;
  readonly faults: readonly string[];
  readonly status: LayerStatus;
  readonly note: string;
};

export type NumberedPoint = {
  readonly n: string;
  readonly title: string;
  readonly body: string;
};

export type Pillar = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly icon: PillarIcon;
};

export type Metric = {
  readonly label: string;
  readonly value: string;
  readonly caption: string;
  readonly footnote: string;
};

export type Bar = {
  readonly label: string;
  readonly mean: number;
  readonly sd?: number;
  readonly strategy: Strategy;
};

export type FaultChip = {
  readonly kind: FaultKind;
  readonly tick: number;
  /** true for the one fault ddmin proves unnecessary. */
  readonly removed?: boolean;
};

export type FaultEvent = {
  readonly t: number;
  readonly layer: string;
  readonly text: string;
  readonly problem?: boolean;
};

export type ComparisonColumn = {
  readonly name: string;
  readonly finds: string;
  readonly question: string;
  readonly limits: string;
  readonly highlight?: boolean;
};

export type Phase = {
  readonly label: PhaseLabel;
  readonly title: string;
  readonly body: string;
  readonly items: readonly string[];
};

export type PreviousRole = {
  readonly company: string;
  readonly team: string;
  readonly focus: string;
};

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
  tagline: "Ordinum breaks autonomous systems before reality does.",
  description:
    "Coverage-guided fuzzing and verification infrastructure for autonomous systems. Ordinum injects faults across sensors, timing, planners and controllers, steers toward unexplored behavior, and turns every failure into a minimized, replayable regression test.",
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
  demo: { label: "Get a demo", href: "/contact" },
} as const satisfies {
  links: readonly Link[];
  bookCall: Link;
  demo: Link;
};

/* -------------------------------------------------------------------------- */
/* 1. Hero                                                                     */
/* -------------------------------------------------------------------------- */

export const hero = {
  eyebrow: "Coverage-guided fuzzing for autonomous systems",
  titleLine1: "Break autonomous systems.",
  titleLine2: "Before reality does.",
  lede: "Ordinum injects faults across sensors, timing, planners and controllers, steers toward behavior no one has exercised yet, and turns every failure it finds into a minimized, deterministic regression test.",
  primaryCta: { label: "Get a demo", href: "/contact" },
  secondaryCta: { label: "See how it works", href: "/technology" },
  meta: [
    "BUILD 0.1 / RESEARCH PREVIEW",
    "ROBOTICS FIRST",
    "FULL-STACK VISION",
  ],
  pipeline: {
    stages: [
      { id: "scenario", label: "SCENARIO", caption: "Faults in time" },
      { id: "execute", label: "EXECUTE", caption: "Supervised run" },
      { id: "coverage", label: "COVERAGE", caption: "New behavior kept" },
      { id: "failure", label: "FAILURE", caption: "Invariant violated" },
      { id: "minimize", label: "MINIMIZE", caption: "ddmin: fewer faults" },
      { id: "replay", label: "REPLAY", caption: "Seeded replay" },
      { id: "regression", label: "REGRESSION", caption: "Permanent test" },
    ],
    ariaLabel:
      "Illustrative animation of the Ordinum loop: generated scenarios execute, new behavior is recorded as coverage, a failing run is reduced to a smaller fault set, reproduced, and saved as a regression test. Not real data.",
    note: "ILLUSTRATIVE / NOT LIVE DATA",
  },
} as const satisfies {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  lede: string;
  primaryCta: Link;
  secondaryCta: Link;
  meta: readonly string[];
  pipeline: {
    stages: readonly PipelineStage[];
    ariaLabel: string;
    note: string;
  };
};

/* -------------------------------------------------------------------------- */
/* Section toplines (mono dividers). Numbered per page; array order is fixed:  */
/* problem, technology, stack, why-now, product, research, why-ordinum,        */
/* vision, about                                                               */
/* -------------------------------------------------------------------------- */

export const topline = [
  "01 / Systems are not their components",
  "01 / Fuzzing is the discovery engine",
  "02 / Start narrow. Go deep.",
  "01 / Autonomy is leaving the screen",
  "01 / Evidence, not dashboards",
  "01 / What we have measured so far",
  "02 / A different question",
  "02 / Simulation first. Hardware next.",
  "01 / The team",
] as const satisfies readonly string[];

/* -------------------------------------------------------------------------- */
/* 2. Problem                                                                  */
/* -------------------------------------------------------------------------- */

export const problem = {
  kicker: "THE PROBLEM / 001",
  title: "The most expensive failures happen between layers.",
  titleMuted: "Every component passes its own tests.",
  body: [
    "A sensor reports stale data. A message arrives late. A controller retries a command. Each component behaves as specified, and the system still does something unsafe.",
    "These failures live in the interactions: timing, ordering, retries, state that drifted out of sync. Unit tests do not reach them. Hand-written scenarios only cover what an engineer already imagined.",
  ],
  cards: [
    {
      id: "stale-sensor",
      title: "Stale data, valid command",
      chain: [
        "Sensor reports stale pose",
        "Planner trusts it",
        "Command passes validation",
        "Unsafe action",
      ],
      layer: "PERCEPTION → PLANNING",
      detail:
        "Every message is well-formed. The command is within limits. It is still wrong, because the world moved and the state did not.",
    },
    {
      id: "middleware-timing",
      title: "Late message, unstable loop",
      chain: [
        "Observation arrives late",
        "Controller acts on old state",
        "Overcorrection",
        "Oscillation",
      ],
      layer: "MIDDLEWARE → CONTROL",
      detail:
        "No message is dropped and no node crashes. A few ticks of delay are enough to turn a stable control loop into an unstable one.",
    },
    {
      id: "controller-retry",
      title: "Retry, duplicated command",
      chain: [
        "Acknowledgement lost",
        "Controller retries",
        "Actuator executes twice",
      ],
      layer: "CONTROL → ACTUATION",
      detail:
        "Retrying is the correct local decision. Without idempotence across the boundary, one intent becomes two physical motions.",
    },
    {
      id: "boundary",
      title: "Assumptions across the stack",
      chain: [
        "Software assumes one contract",
        "Firmware enforces another",
        "Physical behavior diverges",
      ],
      layer: "SOFTWARE → FIRMWARE → PHYSICAL",
      detail:
        "Each layer is owned by a different team with a different test suite. The mismatch only exists when they run together.",
    },
  ],
  contrast: {
    traditional: "Tests check the behavior you expected.",
    ordinum: "Ordinum searches for the behavior you did not.",
  },
} as const satisfies {
  kicker: string;
  title: string;
  titleMuted?: string;
  body: readonly string[];
  cards: readonly ProblemCard[];
  contrast: { traditional: string; ordinum: string };
};

/* -------------------------------------------------------------------------- */
/* 3. How it works (id: technology)                                            */
/* -------------------------------------------------------------------------- */

export const howItWorks = {
  kicker: "THE METHOD / 001",
  title: "Discover. Reproduce. Prevent.",
  lede: "One closed loop turns unexplored execution paths into engineering evidence. Fuzzing finds the failure. Replay proves it. Minimization explains it. A regression test keeps it fixed.",
  steps: [
    {
      n: "01",
      title: "Instrument",
      body: "Hook the boundaries where components exchange state: observations, plans, commands, acknowledgements. Declare the invariants the system must never violate.",
      tag: "HOOKS + INVARIANTS",
    },
    {
      n: "02",
      title: "Generate scenarios and faults",
      body: "Compose faults in time: dropped, stale, noisy or malformed sensor data, delayed observations, new obstacles, actuator failures, retries, flipped values.",
      tag: "MUTATE",
    },
    {
      n: "03",
      title: "Execute",
      body: "Run each scenario deterministically. Every input, fault and tick is seeded and recorded, so any run can be reproduced exactly.",
      tag: "DETERMINISTIC",
    },
    {
      n: "04",
      title: "Track behavioral coverage",
      body: "Measure which states, transitions and trajectories the system actually reached. Scenarios that reach new behavior are kept and mutated further.",
      tag: "FEEDBACK",
    },
    {
      n: "05",
      title: "Discover failure paths",
      body: "Check invariants on every tick. A violation is recorded with the full fault sequence and execution trace that led to it.",
      tag: "INVARIANTS",
    },
    {
      n: "06",
      title: "Reproduce and minimize",
      body: "Replay the failing run from its seed, then shrink the fault sequence with delta debugging until every remaining fault is necessary.",
      tag: "REPLAY + DDMIN",
    },
    {
      n: "07",
      title: "Emit a regression test",
      body: "Save the minimized scenario as a test that runs on every change. A failure found once stays found.",
      tag: "REGRESSION",
    },
  ],
  loopNote:
    "Coverage feeds back into generation. The search spends its budget on behavior it has not seen yet.",
} as const satisfies {
  kicker: string;
  title: string;
  lede: string;
  steps: readonly Step[];
  loopNote: string;
};

/* -------------------------------------------------------------------------- */
/* 4. What we test (id: stack)                                                 */
/* -------------------------------------------------------------------------- */

export const whatWeTest = {
  kicker: "WHAT WE TEST / 002",
  title: "The whole loop, not one box in it.",
  lede: "Autonomous failures cross layers, so verification has to as well. Today Ordinum exercises a complete robotics loop in simulation. The architecture is built to extend down the stack.",
  layers: [
    {
      id: "planners",
      name: "Planners",
      faults: ["env_obstacle"],
      status: "today",
      note: "Today: an A* planner forced to replan around obstacles that appear mid-run. Learned policies and LLM agents are on the roadmap.",
    },
    {
      id: "software",
      name: "Robotics software loop",
      faults: ["value_bitflip"],
      status: "today",
      note: "Today: the full perception → planner → state machine → controller → actuator loop in simulation, with values corrupted in flight and 7 invariants checked on every tick.",
    },
    {
      id: "middleware",
      name: "Timing & observation delay",
      faults: ["obs_delay"],
      status: "today",
      note: "Today: simulated observation delay inside the loop. ROS2 transport, message ordering and QoS are on the roadmap.",
    },
    {
      id: "sensors",
      name: "Sensors & perception",
      faults: ["sensor_dropout", "sensor_stale", "sensor_noise", "sensor_malformed"],
      status: "today",
      note: "Today: simulated sensor faults that are dropped, stale, noisy or malformed.",
    },
    {
      id: "controllers",
      name: "Controllers & actuation",
      faults: ["controller_retry", "actuator_fail", "actuator_duplicate"],
      status: "today",
      note: "Today: state-machine controller and actuator interface in simulation, checked for duplicate commands, speed limits and recovery.",
    },
    {
      id: "firmware",
      name: "Firmware interfaces",
      faults: ["Driver and register contracts", "Command clamping and limits", "Watchdog and reset behavior"],
      status: "roadmap",
      note: "Roadmap. The boundary where software intent meets embedded enforcement.",
    },
    {
      id: "compute",
      name: "Compute & hardware boundaries",
      faults: ["Scheduling and deadline misses", "Resource contention", "Accelerator and bus faults"],
      status: "roadmap",
      note: "Roadmap. Faults that originate below the operating system and surface as software behavior.",
    },
    {
      id: "physical",
      name: "Physical behavior",
      faults: ["Hardware-in-the-loop runs", "Contact and dynamics edge cases", "Sensor-to-world mismatch"],
      status: "roadmap",
      note: "Roadmap. Hardware-in-the-loop verification of what the machine actually does.",
    },
  ],
  wedge: {
    today: "Start with robotics and autonomous software, in simulation.",
    tomorrow: "Expand toward full-stack verification for physical AI.",
  },
} as const satisfies {
  kicker: string;
  title: string;
  lede: string;
  layers: readonly Layer[];
  wedge: { today: string; tomorrow: string };
};

/* -------------------------------------------------------------------------- */
/* 5. Why now                                                                  */
/* -------------------------------------------------------------------------- */

export const whyNow = {
  kicker: "WHY NOW / 001",
  title: "Autonomy is outpacing its testing.",
  points: [
    {
      n: "01",
      title: "AI is moving from chat to action.",
      body: "Models no longer just produce text. They plan, call tools and issue commands to systems that move.",
    },
    {
      n: "02",
      title: "Robots are becoming capable enough to deploy.",
      body: "Cheaper hardware and learned policies are moving autonomous machines out of the lab and into the real world.",
    },
    {
      n: "03",
      title: "Mistakes now have physical consequences.",
      body: "A bad output in a chat window is a bad answer. A bad command to an actuator is a collision.",
    },
    {
      n: "04",
      title: "Testing has not caught up.",
      body: "Most autonomy teams still rely on hand-written scenarios, unit tests and field miles. These check what someone wrote down, not the interactions between components that nobody anticipated.",
    },
    {
      n: "05",
      title: "Verification becomes foundational.",
      body: "Fuzzing became standard for parsers, kernels and browsers. Autonomy has no equivalent yet, built for its failure modes.",
    },
  ],
  closing:
    "Fuzzing changed how the industry secures software. Autonomy needs the same discipline, aimed at behavior.",
} as const satisfies {
  kicker: string;
  title: string;
  points: readonly NumberedPoint[];
  closing: string;
};

/* -------------------------------------------------------------------------- */
/* 6. Product pillars (id: product)                                            */
/* -------------------------------------------------------------------------- */

export const pillars = {
  kicker: "THE PRODUCT / 001",
  title: "Failures you can hand to an engineer.",
  lede: "A failure is only useful if someone can reproduce it, understand it and keep it fixed. Every part of Ordinum is built around that.",
  items: [
    {
      id: "coverage",
      title: "Behavioral coverage",
      body: "Line coverage says which code ran. Behavioral coverage says which states, transitions and trajectories the system reached. Ordinum optimizes for the second.",
      icon: "coverage",
    },
    {
      id: "fault",
      title: "Stateful fault injection",
      body: "Faults are sequenced in time against a running system: a stale reading at tick 4, a retry at tick 9. Order and timing are part of the input.",
      icon: "fault",
    },
    {
      id: "replay",
      title: "Deterministic replay",
      body: "Runs are seeded and traced. Deterministic targets replay exactly; stochastic targets are re-run on fresh seeds and reported as a reproduction rate.",
      icon: "replay",
    },
    {
      id: "minimize",
      title: "Failure minimization",
      body: "Delta debugging strips every fault that is not required to trigger the violation. What remains is the cause, not the noise.",
      icon: "minimize",
    },
    {
      id: "regression",
      title: "Regression generation",
      body: "Each minimized failure is emitted as a regression test. The next change that reintroduces it fails before it ships.",
      icon: "regression",
    },
    {
      id: "cross",
      title: "Cross-component verification",
      body: "Invariants are checked across the whole loop, from perception to actuation. The unit under test is the system.",
      icon: "cross",
    },
  ],
} as const satisfies {
  kicker: string;
  title: string;
  lede: string;
  items: readonly Pillar[];
};

/* -------------------------------------------------------------------------- */
/* 7. Research                                                                 */
/* -------------------------------------------------------------------------- */

export const research = {
  kicker: "ENGINEERING EVIDENCE / 001",
  title: "Evidence over claims.",
  titleMuted: "Measured, with the limitations stated.",
  lede: "What the current engine does, what we measured, and what the data does not show. Earlier v1 benchmark results were withdrawn after an internal audit and are no longer published.",
  asOf: "Product repository, branch ordinum-2, commit c25ba4f (October 23, 2026)",
  status: [
    "BUILT / Target-agnostic scenario execution with timed fault injection and a supervised execution loop",
    "BUILT / ROS 2 / Nav2 adapter (Docker, simplified loopback simulation) and a controlled toy target",
    "BUILT / Invariant checks on ground truth, kept separate from search; statistical reproduction; delta-debugging minimization; regression artifacts; HTML trace reports",
    "MEASURED / Test suite: 268 passing, 1 skipped (requires Docker)",
    "NEXT / More realistic targets and fault generation, evaluations on independently maintained systems",
  ],
  studies: [
    {
      label: "Toy benchmark (pre-registered)",
      setup: "An 8×8 grid robot we wrote, with 11 planted failure classes. 5 search strategies × 30 seeds × 5,000 executions, analysis locked before any campaign ran.",
      results: [
        { label: "Full feedback vs random", value: "9.00 vs 8.63 classes", verdict: "Not significant (Holm p = 0.18)" },
        { label: "Feedback vs same mutator without feedback", value: "8.77 vs 8.47 classes", verdict: "Not significant (Holm p = 0.20)" },
        { label: "Full feedback vs scripted catalog", value: "9.00 vs 6.00 classes", verdict: "Supported (Holm p < 0.001)" },
      ],
      supports: "The loop works end to end on a target we built: search, judge on ground truth, minimize, replay, emit a regression case. Search beats a fixed scripted catalog.",
      notSupported: "No general advantage of feedback-guided search over random search. A non-significant result is not evidence that the two are equivalent.",
    },
    {
      label: "Nav2 pilot (exploratory)",
      setup: "Stock ROS 2 Jazzy + Nav2 in a simplified loopback simulation (no physics, no state estimator). 4 search strategies × 3 seeds: 12 campaigns, 464 executions.",
      results: [
        { label: "Invariant violations reproduced", value: "3 classes", verdict: "Replayed 8/10, 9/10 and 10/10 on fresh seeds" },
        { label: "Classification", value: "0 Nav2 defects", verdict: "All three traced to the harness, configuration or oracle; upheld by independent review" },
        { label: "Which strategy found them", value: "Random: 3 · feedback: 0", verdict: "Low-powered (n = 3 per arm); not evidence that random is generally better" },
      ],
      supports: "The engine runs a real autonomy stack in a container, injects timed faults, and reproduces and minimizes what it finds under nondeterminism, reporting reproduction rates rather than exact replay.",
      notSupported: "No confirmed Nav2 defect. The loopback simulation is far simpler than a physical robot.",
    },
  ],
  limitations: [
    "No demonstrated general advantage over random search.",
    "No independently confirmed defect in Nav2 or any external system.",
    "The ROS 2 environment is a simplified loopback simulation, not physical hardware.",
    "Adapters beyond the toy target and ROS 2 / Nav2 do not exist yet.",
    "No customers or design partners yet.",
  ],
  withdrawn: "Withdrawn: v1 results. Benchmark figures published on earlier versions of this site came from a v1 experiment that an internal audit found to be invalid. They have been removed and replaced by the pre-registered results above.",
} as const satisfies {
  kicker: string;
  title: string;
  titleMuted?: string;
  lede: string;
  asOf: string;
  status: readonly string[];
  studies: readonly {
    label: string;
    setup: string;
    results: readonly { label: string; value: string; verdict: string }[];
    supports: string;
    notSupported: string;
  }[];
  limitations: readonly string[];
  withdrawn: string;
};

/* -------------------------------------------------------------------------- */
/* 8. Differentiation (id: why-ordinum)                                        */
/* -------------------------------------------------------------------------- */

export const differentiation = {
  kicker: "WHY ORDINUM / 002",
  title: "Everyone else answers a different question.",
  lede: "Existing tools are good at what they were built for. Most check the cases someone wrote down. Few search for the interactions between components that nobody anticipated.",
  columns: [
    {
      name: "Traditional testing",
      finds: "Regressions in the cases you wrote down.",
      question: "Does it do what we expected?",
      limits: "Only as broad as the engineer's imagination. Interactions between components go untested.",
    },
    {
      name: "Security tools, pentesting, red teaming",
      finds: "Exploitable vulnerabilities and adversarial inputs.",
      question: "Can an attacker break in?",
      limits: "Aimed at attackers and malicious input, not at timing, retries and stale state in a control loop.",
    },
    {
      name: "Observability",
      finds: "What already happened in production.",
      question: "What went wrong out there?",
      limits: "Tells you after the incident. For a robot, that is after the collision.",
    },
    {
      name: "Ordinum",
      finds: "Unexpected behavior across components, before deployment.",
      question: "What can this system do that nobody anticipated?",
      limits: "Each answer is a reproducible failure, minimized and saved as a test.",
      highlight: true,
    },
  ],
  notList: [
    "Not a pentest",
    "Not an observability dashboard",
    "Not an AI wrapper",
    "Not a static scenario library",
  ],
  statement:
    "Ordinum is verification infrastructure: a search engine for the failures your system can reach.",
} as const satisfies {
  kicker: string;
  title: string;
  lede: string;
  columns: readonly ComparisonColumn[];
  notList: readonly string[];
  statement: string;
};

/* -------------------------------------------------------------------------- */
/* 9. Vision                                                                   */
/* -------------------------------------------------------------------------- */

export const vision = {
  kicker: "THE VISION / 002",
  title: "From one robot loop to the full physical stack.",
  lede: "We are starting where failures are cheapest to find and easiest to prove: robotics software in simulation. Each phase moves one layer closer to the machine.",
  phases: [
    {
      label: "Today",
      title: "Robotics software, in simulation",
      body: "A working engine on a controlled simulated robot, with measured coverage gains over random fault injection.",
      items: [
        "Perception → planner → state machine → controller → actuator",
        "10 fault kinds, 7 invariants",
        "Replay, ddmin minimization, regression tests",
      ],
    },
    {
      label: "Next",
      title: "Real autonomy stacks",
      body: "Adapters for the tools robotics teams already use, and validation on systems we did not build.",
      items: [
        "ROS2 and MuJoCo adapters",
        "Software-in-the-loop verification",
        "Design-partner pilots",
      ],
    },
    {
      label: "Tomorrow",
      title: "Full-stack verification for physical AI",
      body: "One verification loop across every layer an autonomous machine depends on.",
      items: [
        "AI agents and planners",
        "Software, firmware and compute",
        "Controllers, sensors and physical systems",
        "Hardware-in-the-loop",
      ],
    },
  ],
  closing:
    "The goal: no autonomous system ships without its failure space being searched first.",
} as const satisfies {
  kicker: string;
  title: string;
  lede: string;
  phases: readonly Phase[];
  closing: string;
};

/* -------------------------------------------------------------------------- */
/* 10. About                                                                   */
/* -------------------------------------------------------------------------- */

export const about = {
  kicker: "THE TEAM / 001",
  title: "Built by an engineer who builds fuzzers.",
  lede: "Ordinum sits at the intersection of three disciplines: security fuzzing, multi-agent AI and production observability. The founder has worked in all three.",
  founder: {
    name: "Armaan Singla",
    role: "Co-founder",
    education: "Computer Engineering, Queen's University",
    current:
      "Software Engineer Intern, AMD Product Security Office — building fuzzing agents that uncover security vulnerabilities.",
    previous: [
      {
        company: "Geotab",
        team: "Agent Center of Excellence",
        focus: "Multi-agent systems and agent-to-agent orchestration",
      },
      {
        company: "Scotiabank",
        team: "CID&A",
        focus: "Data science",
      },
      {
        company: "Home Trust",
        team: "Data & AI",
        focus: "ML and data pipelines",
      },
      {
        company: "GuestLogix",
        team: "Production Observability & Metrics",
        focus: "Production observability and metrics",
      },
    ],
    linkedin: site.founderLinkedin,
  },
  edge: [
    {
      title: "Security fuzzing",
      body: "Fuzzing is how the security world finds bugs no one thought to test for. Ordinum applies the same coverage-guided discipline to the behavior of autonomous systems.",
    },
    {
      title: "Multi-agent AI systems",
      body: "Autonomous systems are many components acting on shared, imperfect state. Orchestrating agents makes it clear how often the failure is in the handoff, not the agent.",
    },
    {
      title: "Production observability",
      body: "Observability work means meeting failures after they reach production. Ordinum moves that moment earlier, to before deployment.",
    },
  ],
} as const satisfies {
  kicker: string;
  title: string;
  lede: string;
  founder: {
    name: string;
    role: string;
    education: string;
    current: string;
    previous: readonly PreviousRole[];
    linkedin: string;
  };
  edge: readonly { title: string; body: string }[];
  hiring?: string;
};

/* -------------------------------------------------------------------------- */
/* 11. Closing CTA (id: contact)                                               */
/* -------------------------------------------------------------------------- */

export const cta = {
  kicker: "WORK WITH US / 001",
  title: "Building autonomous systems?",
  titleLine2: "Let's break them safely.",
  body: "We want to hear from robotics and autonomy engineers about the failures that are hardest to find, reproduce and keep fixed. Tell us what you are building.",
  form: {
    emailLabel: "Work email",
    companyLabel: "Company",
    roleLabel: "Role",
    messageLabel: "What are you building?",
    submit: "Request a demo",
    success: "Thanks. We'll be in touch.",
    duplicate: "You're already on our list. We'll be in touch.",
    error: `Something went wrong on our side. Please try again, or email ${site.email}.`,
    invalid: "Check the highlighted fields and try again.",
    tooFast: "That was quick. Take a moment to check your details, then submit again.",
  },
  bookCall: { label: "Book a 30-min call", href: site.calUrl },
  emailFallback: `Or email ${site.email}`,
} as const satisfies {
  kicker: string;
  title: string;
  titleLine2?: string;
  body: string;
  form: {
    emailLabel: string;
    companyLabel: string;
    roleLabel: string;
    messageLabel: string;
    submit: string;
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
  thesis: "Ordinum breaks autonomous systems before reality does.",
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
        { label: "Get a demo", href: "/contact" },
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
  legal: [{ label: "Terms", href: "/terms" }],
  copyright: "© 2026 Ordinum. All rights reserved.",
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
  headline: "This path wasn't in the coverage map.",
  title: "No trajectory reaches this page.",
  body: "The page you are looking for does not exist or has moved.",
  cta: { label: "Back to Ordinum", href: "/" },
  secondaryCta: { label: "Get a demo", href: "/contact" },
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
  readonly meta: { readonly title: string; readonly description: string };
};

export const pages = {
  product: {
    href: "/product",
    label: "Product",
    header: {
      kicker: "Product",
      title: "Fuzzing for the behavior of autonomous systems.",
      titleMuted: "Not just their code.",
      lede: "Ordinum searches the space of faults, timings and states your tests never reach, then hands every failure back as a minimized, replayable regression test.",
    },
    meta: {
      title: "Product",
      description:
        "Behavioral coverage, stateful fault injection, reproduction, failure minimization and regression generation, starting with robotics and autonomous software.",
    },
  },
  technology: {
    href: "/technology",
    label: "Technology",
    header: {
      kicker: "Technology",
      title: "One closed loop.",
      titleMuted: "From unexplored behavior to a permanent test.",
      lede: "Instrument the system, inject structured faults, measure behavioral coverage, and steer toward states no run has reached. When an invariant breaks, replay it, minimize it and keep it.",
    },
    meta: {
      title: "Technology",
      description:
        "How Ordinum works: guided fault injection, behavioral signals, ddmin minimization, reproduction and regression generation.",
    },
  },
  research: {
    href: "/research",
    label: "Research",
    header: {
      kicker: "Research",
      title: "Measured, with the caveats.",
      titleMuted: "Early results from the prototype.",
      lede: "Pre-registered benchmarks on a controlled toy target, an exploratory pilot on ROS 2 / Nav2, and what the data does not show.",
    },
    meta: {
      title: "Research",
      description:
        "Pre-registered benchmark results, a Nav2 pilot and explicit limitations from the Ordinum prototype.",
    },
  },
  vision: {
    href: "/vision",
    label: "Vision",
    header: {
      kicker: "Vision",
      title: "Verification for the machines",
      titleMuted: "that will run the world.",
      lede: "AI is moving from chat to action. We start with robotics software in simulation and move one layer closer to the machine at a time.",
    },
    meta: {
      title: "Vision",
      description:
        "Why autonomous systems need new verification infrastructure now, and Ordinum's path from robotics software in simulation to full-stack verification for physical AI.",
    },
  },
  about: {
    href: "/about",
    label: "About",
    header: {
      kicker: "About",
      title: "Security fuzzing, multi-agent AI",
      titleMuted: "and production reliability.",
      lede: "Ordinum is built by an engineer who builds fuzzing agents professionally, applying that discipline to systems that act in the physical world.",
    },
    meta: {
      title: "About",
      description:
        "The team behind Ordinum: security fuzzing, multi-agent AI systems and production observability, applied to autonomous systems.",
    },
  },
  contact: {
    href: "/contact",
    label: "Contact",
    header: {
      kicker: "Contact",
      title: "Get a demo",
      lede: "Tell us what you are building, or book a call.",
    },
    meta: {
      title: "Get a demo",
      description:
        "Talk to Ordinum about fuzzing and verification for robotics and autonomous software. Request a demo or book a 30-minute call.",
    },
  },
} as const satisfies Record<PageKey, PageCopy>;

/** Reading order for the "Next" link at the bottom of each inner page. */
export const pageOrder = ["product", "technology", "research", "vision", "about"] as const satisfies readonly PageKey[];

/* -------------------------------------------------------------------------- */
/* Home: explore grid + CTA band                                               */
/* -------------------------------------------------------------------------- */

export const explore = {
  kicker: "EXPLORE / 002",
  title: "Go deeper.",
  cards: [
    {
      page: "product",
      summary: "Six capabilities that turn a hidden failure into a fixed one, and how that differs from testing, pentesting and observability.",
    },
    {
      page: "technology",
      summary: "The closed loop from fault injection to regression test, and the layers of the autonomy stack it reaches today.",
    },
    {
      page: "research",
      summary: "Pre-registered results, an exploratory Nav2 pilot, and what the data does not show.",
    },
    {
      page: "vision",
      summary: "Why verification for physical AI is becoming foundational, and the path from simulation to hardware.",
    },
    {
      page: "about",
      summary: "Why a security fuzzing engineer is building this, and the experience behind it.",
    },
  ],
} as const satisfies {
  kicker: string;
  title: string;
  cards: readonly { page: PageKey; summary: string }[];
};

export const ctaBand = {
  title: "Building autonomous systems?",
  titleMuted: "Let's break them safely.",
  demo: { label: "Get a demo", href: "/contact" },
  bookCall: { label: "Book a call", href: site.calUrl },
} as const satisfies {
  title: string;
  titleMuted: string;
  demo: Link;
  bookCall: Link;
};
