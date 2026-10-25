/**
 * Real evidence artifacts for the site's proof visuals.
 *
 * PROVENANCE
 *   repo:   the Ordinum product repository (branch `ordinum-2`; not linked publicly until the founder confirms it is public)
 *   commit: c25ba4f478eda03e8b1fc482206121a7f5bc78d8  ("Merge Nav2 review and final docs", 2026-10-23)
 *   files:  docs/demo/README.md
 *           docs/demo/nav2_success_mismatch_compare.html
 *           docs/demo/nav2_obstacle_nominal.html
 *           docs/demo/toy_failure_compare.html
 *           experiments/results/v2/nav2_pilot/raw/confirm/success_mismatch_meta.json
 *           experiments/results/v2/nav2_pilot/raw/confirm/traces/success_mismatch_{original,minimized}.jsonl
 *           experiments/results/v2/nav2_pilot/regression/fail_{ca43c26f7e96,e02c1f1ece56,687b91a7b44b}.json
 *           experiments/results/v2/nav2_pilot/summary.json
 *           docs/research/nav2_pilot.md (sections 6 and 9: classification + independent review)
 *           docs/LIMITATIONS.md, MORNING_REPORT.md (toy target is in-house with planted bugs)
 *   re-checked: 24 October 2026 against product HEAD 124dde072ab7d143cafa722bad80c61970740156
 *           (merge of the cross-system testbed). Every file listed above is unchanged between
 *           c25ba4f and 124dde072 (`git diff --stat c25ba4f 124dde072 -- docs/demo/` is empty;
 *           experiments/results, the Nav2 and toy targets, LIMITATIONS.md and MORNING_REPORT.md
 *           are unchanged). Only src/ordinum/reporting/html.py changed (a lanes view for
 *           multi-process targets); the committed demo HTML was not regenerated. So the values
 *           below remain valid and PRODUCT_SOURCE stays pinned to c25ba4f, where they were copied.
 *           The site-wide facts snapshot (124dde072) lives in lib/content.ts FACT_SOURCE.
 *           Internal claims registry (not published), rows F1-F6.
 *   labels: EVIDENCE_LABELS below are the artifact-level keys. The site renders the evidence
 *           vocabulary from lib/content.ts (EVIDENCE_CLASS_LABELS via evidenceClassOf), e.g.
 *           "normal-behavior" is shown as "Expected behavior".
 *
 * RULES
 *   - Values are copied from the artifacts, not invented. Times are shown to 2 decimals,
 *     as the repo's own HTML report shows them; units are kept on every field.
 *   - Do not edit a value without re-checking the source file above.
 *   - No artifact in the repo is a genuine, independently verified defect. Never label one so.
 *   - Withdrawn v1 benchmark numbers must not appear here.
 *   - Catalog with caveats: internal evidence catalog (not published).
 */

/* -------------------------------------------------------------------------- */
/* Labels (BRIEF section 4.6)                                                  */
/* -------------------------------------------------------------------------- */

export type EvidenceLabel =
  | "normal-behavior"
  | "positive-control"
  | "harness-artifact"
  | "verified-defect";

export const EVIDENCE_LABELS: Readonly<Record<EvidenceLabel, string>> = {
  "normal-behavior": "Normal system behavior",
  "positive-control": "Controlled positive-control test (planted bug)",
  "harness-artifact": "Fault-configuration / harness or oracle artifact",
  "verified-defect": "Independently verified defect",
};

export const PRODUCT_SOURCE = {
  repo: "Ordinum product repository",
  branch: "ordinum-2",
  commit: "c25ba4f478eda03e8b1fc482206121a7f5bc78d8",
  commitShort: "c25ba4f",
} as const;

/* -------------------------------------------------------------------------- */
/* Shared shapes                                                               */
/* -------------------------------------------------------------------------- */

export type EvidenceFault = {
  readonly idx: number;
  /** Scheduled time (s for Nav2, step for toy). */
  readonly at: number;
  /** Time the harness actually applied it, if applied. */
  readonly appliedAt: number | null;
  readonly kind: string;
  /** Topic (Nav2) or component (toy) the fault targets. */
  readonly target: string;
  readonly params: Readonly<Record<string, number | string>>;
  readonly trigger: string | null;
  readonly description: string;
  readonly status: string;
  /** ddmin outcome in the original schedule; null in a minimized schedule. */
  readonly minimization: "kept" | "removed" | null;
};

export type LaneEvent = {
  readonly t: number;
  readonly kind: string;
  readonly text: string;
  /** "fault" | "violation" | "result" | "info" — drives colour only. */
  readonly tone: "fault" | "violation" | "result" | "info";
};

export type Lane = {
  readonly component: string;
  /** "truth" = harness/simulator ground truth; "observable" = what the SUT reported. */
  readonly channel: "truth" | "observable";
  readonly events: readonly LaneEvent[];
};

/* -------------------------------------------------------------------------- */
/* 1. Nav2 success_mismatch: reproduced + minimized, classified as an artifact */
/* -------------------------------------------------------------------------- */

export const nav2SuccessMismatch = {
  id: "nav2SuccessMismatch",
  source: `docs/demo/nav2_success_mismatch_compare.html @ ${PRODUCT_SOURCE.commitShort}`,
  traceSources: [
    "experiments/results/v2/nav2_pilot/raw/confirm/traces/success_mismatch_original.jsonl",
    "experiments/results/v2/nav2_pilot/raw/confirm/traces/success_mismatch_minimized.jsonl",
  ],
  metaSource: "experiments/results/v2/nav2_pilot/raw/confirm/success_mismatch_meta.json",
  regressionCase: "experiments/results/v2/nav2_pilot/regression/fail_ca43c26f7e96.json",
  /**
   * What the regression case asserts (fail_ca43c26f7e96.json: expect_violation true; verify.mode
   * "repeat", min_k 4 over 10 stored exec seeds; checked at 124dde072). It asserts the violation
   * still occurs (k >= min_k); after a fix it is flipped to require k == 0
   * (src/ordinum/replay/regression.py). Stored with the pilot results, not in tests/regression/.
   */
  regressionVerify: { expectViolation: true, mode: "repeat", minK: 4, storedSeeds: 10 },
  label: "harness-artifact" as EvidenceLabel,
  labelShort: "Robustness observation under an unrealistic fault configuration. Not a Nav2 defect.",
  labelJustification: [
    {
      source: "docs/demo/README.md",
      quote:
        "Classified as a configuration/harness artifact, not a Nav2 defect: the injected fault corrupts the only pose source of this loopback setup (no EKF/AMCL to reject outliers).",
    },
    {
      source: "docs/research/nav2_pilot.md §9.1 (separate adversarial review, verdict upheld)",
      quote:
        "Under physically unrealistic noise on the odometry transform, in a stack with no state estimator, Nav2 reported SUCCEEDED while the simulator's true pose was 0.4-0.8 m from the goal (8/10 replays). This is a robustness observation under an unrealistic fault configuration and a demonstration of the truth-vs-claimed oracle. It is not a Nav2 defect.",
    },
  ],
  failureId: "fail_ca43c26f7e96",
  target: {
    name: "nav2_loopback",
    fingerprint: "sha256:fcf9d1083401ba4c4844a2c33af3f2790bcdef747b25cc21f0adaec7c0c953bc",
    configHash: "cfg_00390553f7a8",
    baseImage:
      "ros:jazzy-ros-base@sha256:103b6c417973394659af6804d4917cd489b91e5ed22eb7bef263025a3bed2410",
    rmw: "rmw_fastrtps_cpp",
    simulator: "ROS 2 loopback simulator (no EKF, no AMCL; map→odom static)",
    timeModel: "sim_time",
  },
  task: {
    id: 8,
    name: "depot_ne_diag",
    map: "depot",
    /** [x m, y m, yaw rad] */
    start: [6.0, 5.5, -2.4981],
    goal: [2.0, 2.5, -2.4981],
    deadlineS: 34,
  },
  discovery: {
    arm: "random",
    campaignSeed: 1001,
    atExecution: 15,
    note: "Found by the random arm of the exploratory Nav2 pilot.",
  },
  /** The unminimized witness: 4 scheduled faults, 3 applied. */
  original: {
    label: "original",
    execSeed: 697847706,
    outcome: "no violation (Nav2 ABORTED, error 103)",
    result: { status: "ABORTED", errorCode: 103, tS: 11.41 },
    note:
      "The unminimized witness re-run at its discovery seed; it did NOT violate in this run (stochastic target).",
    faults: [
      {
        idx: 1, at: 1.04, appliedAt: 1.04, kind: "msg_noise", target: "odom",
        params: { duration_s: 9.936, sigma: 0.104 }, trigger: null,
        description: "noise was added to its odometry data for 9.9 s",
        status: "applied", minimization: "removed",
      },
      {
        idx: 2, at: 4.392, appliedAt: 4.4, kind: "msg_noise", target: "tf",
        params: { duration_s: 12.714, sigma: 0.356 }, trigger: null,
        description: "noise was added to its TF transform data for 12.7 s",
        status: "applied (truncated: run ended)", minimization: "kept",
      },
      {
        idx: 3, at: 6.513, appliedAt: 6.52, kind: "msg_reorder", target: "scan",
        params: { duration_s: 1.225, window: 3 }, trigger: null,
        description: "its laser scan messages were reordered for 1.2 s",
        status: "applied", minimization: "kept",
      },
      {
        idx: 4, at: 2.365, appliedAt: null, kind: "msg_nan", target: "scan",
        params: { duration_s: 3.852, fraction: 0.692 }, trigger: "bt:FollowPath:FAILURE#1",
        description: "NaN values were injected into its laser scan data for 3.9 s",
        status: "not applied: trigger never fired", minimization: "removed",
      },
    ] satisfies readonly EvidenceFault[],
    lanes: [
      {
        component: "ordinum (harness)", channel: "truth",
        events: [
          { t: 0.0, kind: "goal_sent", text: "goal sent", tone: "info" },
          { t: 1.04, kind: "fault_applied", text: "msg_noise on odom (σ 0.104)", tone: "fault" },
          { t: 4.4, kind: "fault_applied", text: "msg_noise on TF odom→base_footprint (σ 0.356)", tone: "fault" },
          { t: 6.52, kind: "fault_applied", text: "msg_reorder on scan (window 3)", tone: "fault" },
          { t: 7.74, kind: "fault_window_end", text: "scan reorder ends (7 msgs affected)", tone: "info" },
          { t: 10.98, kind: "fault_window_end", text: "odom noise ends (497 msgs affected)", tone: "info" },
          { t: 11.41, kind: "fault_window_end", text: "TF noise truncated by run end (350 msgs affected)", tone: "info" },
        ],
      },
      {
        component: "controller_server", channel: "observable",
        events: [
          { t: 11.37, kind: "log_error", text: "Resulting plan has # poses in it.", tone: "info" },
        ],
      },
      {
        component: "bt_navigator", channel: "observable",
        events: [
          { t: 0.01, kind: "goal_accepted", text: "goal accepted", tone: "info" },
          { t: 11.4, kind: "log_error", text: "Goal failed", tone: "info" },
          { t: 11.41, kind: "nav_result", text: "ABORTED (error 103)", tone: "result" },
        ],
      },
    ] satisfies readonly Lane[],
  },
  /** The ddmin result, replayed: this panel violates. */
  minimized: {
    label: "minimized",
    execSeed: 70001,
    runId: "run_2a46d6fcdfbf",
    traceHash: "trc_838a45be2c585670",
    parentScenario: "scn_b2e632175480",
    outcome: "violation: success_mismatch",
    result: { status: "SUCCEEDED", errorCode: 0, tS: 11.61 },
    faults: [
      {
        idx: 1, at: 4.392, appliedAt: 4.4, kind: "msg_noise", target: "tf",
        params: { duration_s: 12.714, sigma: 0.356 }, trigger: null,
        description: "noise was added to its TF transform data for 12.7 s",
        status: "applied (truncated: run ended)", minimization: null,
      },
      {
        idx: 2, at: 6.513, appliedAt: 6.52, kind: "msg_reorder", target: "scan",
        params: { duration_s: 1.225, window: 3 }, trigger: null,
        description: "its laser scan messages were reordered for 1.2 s",
        status: "applied", minimization: null,
      },
    ] satisfies readonly EvidenceFault[],
    lanes: [
      {
        component: "ordinum (harness)", channel: "truth",
        events: [
          { t: 0.0, kind: "goal_sent", text: "goal sent", tone: "info" },
          { t: 4.4, kind: "fault_applied", text: "msg_noise on TF odom→base_footprint (σ 0.356)", tone: "fault" },
          { t: 6.52, kind: "fault_applied", text: "msg_reorder on scan (window 3)", tone: "fault" },
          { t: 7.74, kind: "fault_window_end", text: "scan reorder ends (6 msgs affected)", tone: "info" },
          { t: 11.61, kind: "fault_window_end", text: "TF noise truncated by run end (361 msgs affected)", tone: "info" },
        ],
      },
      {
        component: "bt_navigator", channel: "observable",
        events: [
          { t: 0.01, kind: "goal_accepted", text: "goal accepted", tone: "info" },
          { t: 11.61, kind: "nav_result", text: "SUCCEEDED (error 0)", tone: "result" },
        ],
      },
      {
        component: "behavior tree", channel: "observable",
        events: [
          { t: 0.02, kind: "bt", text: "FollowPath RUNNING (until result)", tone: "info" },
          // ComputePathToPose:SUCCESS ticks, about once per second (replans counter = 24 at end).
          ...[0.02, 1.05, 2.08, 3.11, 4.13, 5.16, 6.18, 7.2, 8.23, 9.25, 10.28, 11.3].map(
            (t) => ({ t, kind: "bt", text: "ComputePathToPose SUCCESS", tone: "info" as const }),
          ),
        ],
      },
      {
        component: "oracle (truth vs claimed)", channel: "truth",
        events: [
          {
            t: 11.61, kind: "violation",
            text: "success_mismatch [high]: SUCCEEDED but the true pose is 0.80 m from the goal (> 0.35 m)",
            tone: "violation",
          },
        ],
      },
    ] satisfies readonly Lane[],
    counters: { recoveries: 0, bt_failures: 0, replans: 24 },
    /**
     * Simulator ground-truth pose, minimized run, sampled every 0.5 s from the trace
     * ([t s, x m, y m]). After 12.03 s the robot is at rest at (2.64, 2.88) until the trace ends (13.53 s).
     */
    truthPath: [
      [0.03, 6.0, 5.5], [0.53, 5.98, 5.48], [1.03, 5.91, 5.44], [1.53, 5.75, 5.36],
      [2.03, 5.55, 5.26], [2.53, 5.34, 5.15], [3.03, 5.14, 5.01], [3.53, 4.95, 4.87],
      [4.03, 4.75, 4.72], [4.53, 4.56, 4.57], [5.03, 4.46, 4.49], [5.53, 4.33, 4.38],
      [6.03, 4.16, 4.24], [6.53, 4.06, 4.14], [7.03, 3.92, 4.0], [7.53, 3.84, 3.91],
      [8.03, 3.7, 3.76], [8.53, 3.52, 3.59], [9.03, 3.36, 3.45], [9.53, 3.21, 3.28],
      [10.03, 3.13, 3.2], [10.53, 2.99, 3.09], [11.03, 2.84, 2.99], [11.53, 2.68, 2.91],
      [12.03, 2.64, 2.88],
    ],
  },
  observed:
    "Nav2 reported SUCCEEDED at t = 11.61 s while the simulator's true pose was 0.80 m from the goal.",
  verdict: {
    invariant: "success_mismatch",
    severity: "high",
    tS: 11.61,
    result: "violated",
    detail: "SUCCEEDED at t=11.6101 but the true pose is 0.80 m from the goal (> 0.35 m)",
    /** Distance from the goal at the violation, as in `detail`. */
    distanceText: "0.80 m",
    oracle:
      "Truth-vs-claimed: the simulator's ground-truth pose is checked against Nav2's reported result; success counts only within 0.35 m of the goal.",
  },
  reproduction: {
    mode: "statistical",
    trials: 10,
    failures: 8,
    rate: "8/10",
    wilson95: [0.49, 0.94],
    wilson95Text: "Wilson 95% CI 49-94%",
    execSeeds: "70000-70009 (fresh seeds)",
  },
  minimization: {
    algorithm: "ddmin",
    before: 4,
    beforeApplied: 3,
    after: 2,
    runs: 26,
    oracle: "statistical(n=10,k=3)",
    oneMinimal: false,
    note: "Minimization hit its 600 s cap, so the result is not verified 1-minimal.",
  },
  followUp: {
    tfNoiseOnly: "6/10",
    note:
      "TF noise alone reproduces it in 6/10 exploratory runs (other 4 ABORTED, error 103), so the scan reorder is very likely unnecessary.",
  },
  caveats: [
    "Classified as a configuration/harness artifact, not a Nav2 defect.",
    "The injected noise (σ 0.356 m on every odom→base_footprint transform) is physically unrealistic.",
    "Loopback simulation with no EKF/AMCL and a static map→odom: the fault corrupts the only pose source.",
    "Minimized 4 → 2 faults, but minimization hit its 600 s cap: not verified 1-minimal.",
    "TF noise alone reproduces 6/10; the scan reorder is very likely unnecessary.",
    "The original panel did not violate when re-run at its discovery seed (stochastic target).",
    "Exploratory pilot; the regression case encodes this artifact, not a bug guard.",
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* 2. Nav2 nominal run: obstacle inserted, task succeeds                       */
/* -------------------------------------------------------------------------- */

export const nav2Nominal = {
  id: "nav2Nominal",
  source: `docs/demo/nav2_obstacle_nominal.html @ ${PRODUCT_SOURCE.commitShort}`,
  traceNote:
    "Rendered from runs/nav2_smoke/review1_final/traces/smoke_2_obstacle.jsonl (Nav2 spike); the trace is git-ignored, only the HTML is committed.",
  label: "normal-behavior" as EvidenceLabel,
  labelShort: "Normal Nav2 task under one injected obstacle. No invariant violated.",
  labelJustification: [
    {
      source: "docs/demo/README.md",
      quote:
        "no invariant was violated and no Nav2 failure has been found yet, so this is the \"normal Nav2 task\" step of the demo, not a failure.",
    },
  ],
  target: {
    name: "nav2_loopback",
    fingerprint: "sha256:fcf9d1083401ba4c4844a2c33af3f2790bcdef747b25cc21f0adaec7c0c953bc",
    simulator: "ROS 2 loopback simulator",
  },
  task: { id: 6, name: "depot_straight" },
  identity: { runId: "smoke_2_obstacle", traceHash: "trc_ba69a0de628d0f40", execSeed: 1002 },
  faults: [
    {
      idx: 1, at: 3.0, appliedAt: 3.0, kind: "obstacle_insert", target: "world",
      params: { radius: 0.3, x: 2.5, y: 0.0 }, trigger: null,
      description: "an obstacle appeared at (2.5, 0) (radius 0.3 m)",
      status: "applied", minimization: null,
    },
  ] satisfies readonly EvidenceFault[],
  lanes: [
    {
      component: "lifecycle (bring-up)", channel: "observable",
      events: [
        { t: -2.47, kind: "lifecycle", text: "local_costmap active", tone: "info" },
        { t: -2.45, kind: "lifecycle", text: "controller_server active", tone: "info" },
        { t: -1.17, kind: "lifecycle", text: "planner_server active", tone: "info" },
        { t: -0.38, kind: "lifecycle", text: "bt_navigator active", tone: "info" },
        { t: -0.12, kind: "lifecycle", text: "docking_server active", tone: "info" },
      ],
    },
    {
      component: "ordinum (harness)", channel: "truth",
      events: [
        { t: 3.0, kind: "fault_applied", text: "obstacle_insert r = 0.3 m at (2.5, 0)", tone: "fault" },
      ],
    },
    {
      component: "bt_navigator", channel: "observable",
      events: [
        { t: 0.01, kind: "goal_accepted", text: "goal accepted", tone: "info" },
        { t: 17.46, kind: "nav_result", text: "SUCCEEDED (error 0)", tone: "result" },
      ],
    },
    {
      component: "behavior tree", channel: "observable",
      events: [
        { t: 0.03, kind: "bt", text: "FollowPath RUNNING (0.03-17.46 s)", tone: "info" },
        ...[0.0, 1.04, 2.06, 3.09, 4.11, 5.13, 6.16, 7.19, 8.22, 9.24, 10.26, 11.3, 12.32, 13.35, 14.37, 15.39, 16.43].map(
          (t) => ({ t, kind: "bt", text: "ComputePathToPose SUCCESS", tone: "info" as const }),
        ),
      ],
    },
  ] satisfies readonly Lane[],
  observed:
    "Nav2 replanned about once per second, drove around the inserted obstacle and reported SUCCEEDED at 17.46 s.",
  result: { status: "SUCCEEDED", errorCode: 0, tS: 17.46 },
  cmdVelMaxAbs: 0.54,
  verdict: { result: "no invariant violated" },
  reproduction: null,
  reproductionText: "not measured",
  caveats: [
    "Normal behavior, not a failure.",
    "Single run; reproduction was not measured.",
    "Loopback simulation; the robot footprint radius (0.22 m) in the HTML is assumed, not from the trace.",
    "Map occupancy is not drawn in the committed HTML.",
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* 3. Toy robot: planted-bug positive control                                  */
/* -------------------------------------------------------------------------- */

export const toyPositiveControl = {
  id: "toyPositiveControl",
  source: `docs/demo/toy_failure_compare.html @ ${PRODUCT_SOURCE.commitShort}`,
  label: "positive-control" as EvidenceLabel,
  labelShort: "Controlled positive-control test on an in-house toy target with planted bugs.",
  labelJustification: [
    {
      source: "docs/LIMITATIONS.md",
      quote: "We wrote the target and planted its bugs. All 11 classes are deliberate.",
    },
    {
      source: "MORNING_REPORT.md",
      quote:
        "in_bounds is one of the 6 shallow classes (no_collision, in_bounds, max_speed, no_duplicate_command, leave_recovery, act_requires_observation), found 30/30 by every arm.",
    },
  ],
  failureId: "fail_36645b163ae1",
  unit: "step",
  target: {
    name: "toy_robot",
    fingerprint: "toy_robot@toy-2.0.0-8a0da2be4dec",
    configHash: "cfg_5241ba4f4945",
    /** From src/ordinum/targets/toy_robot/config.py defaults (grid_w = grid_h = 8); not printed in the HTML. */
    grid: [8, 8],
    determinism: "deterministic",
  },
  identity: { runId: "run_48c1ec953ca7", traceHash: "trc_fc0da2b3617a1420", baseSeed: 7, execSeed: 7, taskId: 0 },
  original: {
    scheduled: 6,
    applied: 2,
    faults: [
      {
        idx: 1, at: 7, appliedAt: 7, kind: "env_obstacle", target: "env",
        params: { x: 3, y: 7 }, trigger: null,
        description: "an obstacle appeared at cell (3, 7)",
        status: "applied", minimization: "kept",
      },
      {
        idx: 2, at: 9, appliedAt: 9, kind: "value_bitflip", target: "controller",
        params: {}, trigger: null,
        description: "a controller value was corrupted (bit flip): the command's direction is reversed in transit",
        status: "applied", minimization: "kept",
      },
      {
        idx: 3, at: 10, appliedAt: null, kind: "controller_retry", target: "controller",
        params: {}, trigger: null, description: "the controller was forced to retry",
        status: "not applied: after_episode_end", minimization: "removed",
      },
      {
        idx: 4, at: 43, appliedAt: null, kind: "controller_retry", target: "controller",
        params: {}, trigger: null, description: "the controller was forced to retry",
        status: "not applied: after_episode_end", minimization: "removed",
      },
      {
        idx: 5, at: 43, appliedAt: null, kind: "obs_delay", target: "sensor",
        params: { ticks: 3 }, trigger: null, description: "its observations were delayed by 3 steps",
        status: "not applied: after_episode_end", minimization: "removed",
      },
      {
        idx: 6, at: 44, appliedAt: null, kind: "sensor_noise", target: "sensor",
        params: {}, trigger: null, description: "the sensor reading was noisy",
        status: "not applied: after_episode_end", minimization: "removed",
      },
    ] satisfies readonly EvidenceFault[],
  },
  minimized: {
    parentScenario: "scn_3597ac237f5f",
    faults: [
      {
        idx: 1, at: 7, appliedAt: 7, kind: "env_obstacle", target: "env",
        params: { x: 3, y: 7 }, trigger: null,
        description: "an obstacle appeared at cell (3, 7)", status: "applied", minimization: null,
      },
      {
        idx: 2, at: 9, appliedAt: 9, kind: "value_bitflip", target: "controller",
        params: {}, trigger: null,
        description: "a controller value was corrupted (bit flip): the command's direction is reversed in transit",
        status: "applied", minimization: null,
      },
    ] satisfies readonly EvidenceFault[],
  },
  lanes: [
    {
      component: "fsm state", channel: "observable",
      events: [
        { t: 0, kind: "fsm", text: "PERCEIVE → PLAN → MOVE each step (steps 0-9)", tone: "info" },
        { t: 9, kind: "fsm", text: "HALTED (steps 9-10)", tone: "result" },
      ],
    },
    {
      component: "sensor / planner", channel: "observable",
      events: [
        ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
          (t) => ({ t, kind: "event", text: "sensor:observe, planner:plan", tone: "info" as const }),
        ),
      ],
    },
    {
      component: "ordinum (harness)", channel: "truth",
      events: [
        { t: 7, kind: "fault_applied", text: "env_obstacle at cell (3, 7); robot at (1, 7), state MOVE", tone: "fault" },
        { t: 9, kind: "fault_applied", text: "value_bitflip(controller); state PLAN", tone: "fault" },
      ],
    },
    {
      component: "runtime", channel: "observable",
      events: [{ t: 9, kind: "estop", text: "runtime:estop", tone: "result" }],
    },
    {
      component: "oracle", channel: "truth",
      events: [
        { t: 9, kind: "violation", text: "in_bounds [critical]: moved to [2, 8] outside the grid at t=9", tone: "violation" },
      ],
    },
  ] satisfies readonly Lane[],
  /**
   * Truth path in grid cells ([step, x, y]), decoded from the HTML's rendered path
   * (36.7 px per cell). Ends at (2, 8), outside the 8x8 grid.
   */
  truthPath: [
    [0, 0, 0], [0, 0, 1], [1, 0, 2], [2, 0, 3], [3, 0, 4], [4, 0, 5], [5, 0, 6],
    [6, 0, 7], [7, 1, 7], [8, 2, 7], [9, 2, 8],
  ],
  observed: "The robot drove out of its allowed area at step 9, the step a controller value was corrupted (bit flip).",
  verdict: {
    invariant: "in_bounds",
    severity: "critical",
    t: 9,
    result: "violated",
    detail: "moved to [2, 8] outside the grid at t=9",
    oracle: "Never-rule: the robot must remain within the grid (checked on the truth channel).",
  },
  reproduction: {
    mode: "deterministic",
    trials: 5,
    failures: 5,
    rate: "5/5",
    wilson95: [0.57, 1.0],
    wilson95Text: "Wilson 95% CI 57-100%",
    execSeeds: "5 fresh exec seeds",
  },
  minimization: {
    algorithm: "ddmin",
    before: 6,
    beforeApplied: 2,
    after: 2,
    runs: 12,
    oracle: "deterministic-single-run",
    oneMinimal: null,
    note: "The 4 removed faults were scheduled after the episode ended and never applied.",
  },
  caveats: [
    "Positive control: an in-house toy target whose bugs we planted deliberately. Not a discovery.",
    "Deterministic target: 5/5 confirms a stable replay on this toy, not statistical robustness.",
    "The original and minimized panels show the same run behavior because the 4 removed faults never applied.",
    "Committed HTML snapshot (toy fingerprint toy-2.0.0-8a0da2be4dec); re-running the demo at the current commit selects a different failure.",
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* 4. Nav2 pilot: all three reproduced classes, plus totals                   */
/* -------------------------------------------------------------------------- */

export const nav2PilotFindings = [
  {
    invariant: "success_mismatch",
    severity: "high",
    regressionCase: "experiments/results/v2/nav2_pilot/regression/fail_ca43c26f7e96.json",
    foundBy: "random s1001",
    minimized: { before: 4, after: 2, oneMinimal: false },
    reproduction: { failures: 8, trials: 10, rate: "8/10", wilson95: [0.49, 0.94] },
    label: "harness-artifact" as EvidenceLabel,
    classification: "configuration / harness",
    reviewQuote:
      "This is a robustness observation under an unrealistic fault configuration and a demonstration of the truth-vs-claimed oracle. It is not a Nav2 defect.",
  },
  {
    invariant: "liveness",
    severity: "medium",
    regressionCase: "experiments/results/v2/nav2_pilot/regression/fail_e02c1f1ece56.json",
    foundBy: "random (3 campaigns), scripted s1001/s1002, mutation_nofeedback s1002",
    minimized: { before: 1, after: 1, oneMinimal: true },
    reproduction: { failures: 9, trials: 10, rate: "9/10", wilson95: [0.6, 0.98] },
    label: "harness-artifact" as EvidenceLabel,
    classification: "harness: fault placement + oracle bound",
    reviewQuote:
      "An obstacle injected on top of the robot made Nav2 stop safely within about 0.13 s and then retry without returning a result inside our 34 s bound. The cause is our fault placement and our oracle bound, not a defect.",
    note: "The class is mixed: 7 of 11 witnesses overlap the footprint; a near-goal stall is a lead, not a defect candidate.",
  },
  {
    invariant: "stuck",
    severity: "medium",
    regressionCase: "experiments/results/v2/nav2_pilot/regression/fail_687b91a7b44b.json",
    foundBy: "random s1001",
    minimized: { before: 6, after: 6, oneMinimal: false },
    reproduction: { failures: 10, trials: 10, rate: "10/10", wilson95: [0.72, 1.0] },
    label: "harness-artifact" as EvidenceLabel,
    classification: "oracle bound shorter than the fault",
    reviewQuote:
      "Nav2 correctly refused to drive on stale transforms and completed the goal once our injected TF delays ended. Our stall bound was shorter than the fault.",
  },
] as const;

export const nav2PilotTotals = {
  source: "experiments/results/v2/nav2_pilot/summary.json",
  status: "EXPLORATORY (descriptive only)",
  campaigns: 12,
  armsSeeds: "4 arms × 3 seeds",
  executions: 464,
  reproducedClasses: 3,
  confirmedNav2Defects: 0,
  classesFoundByArm: {
    random: 3,
    mutation_nofeedback: 1,
    scripted: 1,
    feedback_generic: 0,
  },
  baselineFaultFree: { violations: 0, executions: 40, wilson95Text: "Wilson 95% CI 0-8.8%" },
  caveats: [
    "Exploratory and low-powered (n = 3 seeds per arm); no comparison between arms can reach significance.",
    "All three reproduced classes were classified as harness, configuration or oracle artifacts; no Nav2 defect was confirmed.",
    "Not evidence that random search is generally better or worse than feedback guidance.",
  ],
} as const;

/** Every proof artifact, for catalog-style rendering. */
export const evidenceArtifacts = [nav2SuccessMismatch, nav2Nominal, toyPositiveControl] as const;

/* -------------------------------------------------------------------------- */
/* 5. Toy v2 benchmark: distinct confirmed failure classes per campaign        */
/* -------------------------------------------------------------------------- */

/**
 * SOURCE (copied verbatim, not computed here): experiments/results/v2/toy_v2/report.md @ c25ba4f
 * (unchanged at 124dde072),
 * budget `exec5000` (primary), table "Distinct confirmed failure classes per seed (primary metric)":
 * n = 30 campaigns per arm, mean and "mean 95% bootstrap CI" (10,000 resamples, seed 20261026).
 * The toy target has 11 planted classes; the metric saturates.
 */
export const TOY_CLASS_TOTAL = 11;

export const toyArms = [
  { arm: "Full feedback", mean: 9.0, ci: [8.73, 9.27] },
  { arm: "Generic feedback", mean: 8.77, ci: [8.57, 8.97] },
  { arm: "Random", mean: 8.63, ci: [8.47, 8.8] },
  { arm: "Mutation without feedback", mean: 8.47, ci: [8.17, 8.77] },
  { arm: "Scripted catalog", mean: 6.0, ci: [6.0, 6.0] },
] as const;

export const TOY_ARMS_SOURCE =
  "experiments/results/v2/toy_v2/report.md · exec5000 budget · mean with 95% bootstrap CI, n = 30 campaigns per strategy";
