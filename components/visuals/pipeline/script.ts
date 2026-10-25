/**
 * Deterministic timeline for the hero pipeline animation (four stages:
 * Connect -> Stress-test -> Verify -> Reproduce & prevent).
 *
 * Everything is a pure function of one looping clock (seconds, 0..LOOP), so the
 * animation can pause/resume exactly and render a static frame for reduced motion.
 * Positions along the rail are in "stage units" (0 = CONNECT ... 3 = REPRODUCE);
 * each layout maps stage units to SVG coordinates.
 *
 * This is a conceptual composition, not recorded data: no counts, rates or fault
 * numbers shown here describe a real run.
 */

/** Loop length in seconds. */
export const LOOP = 12;
/** Frame shown for reduced motion / before the animation starts: every stage resolved. */
export const STATIC_T = 10.9;
/** Persistent state fades out over this window before the loop restarts. */
export const FADE_START = 11.2;
export const FADE_END = 11.75;

export const STAGE_COUNT = 4;

export type Keyframes = { input: number[]; output: number[] };

/** Build a strictly increasing keyframe track from [time, value] pairs. */
export function track(points: ReadonlyArray<readonly [number, number]>): Keyframes {
  const input: number[] = [];
  const output: number[] = [];
  let last = -Infinity;
  for (const [t, v] of points) {
    const time = t <= last ? last + 0.001 : t;
    input.push(time);
    output.push(v);
    last = time;
  }
  return { input, output };
}

/** Opacity: 0 until `on`, fades in over `fadeIn`, holds, then fades with the loop reset. */
export function persistFrom(on: number, fadeIn = 0.25, to = 1): Keyframes {
  return track([
    [on - 0.001, 0],
    [on + fadeIn, to],
    [FADE_START, to],
    [FADE_END, 0],
  ]);
}

/* -------------------------------------------------------------------------- */
/* Packets (scenarios)                                                         */
/* -------------------------------------------------------------------------- */

export type PacketDef = {
  id: string;
  launch: number;
  /** Fault ticks carried by the scenario (1-6). */
  faults: number;
  failing: boolean;
  /** Shown in the reduced "mobile" variant. */
  compact: boolean;
};

const SPACING = 1;
const FIRST = 0.3;
const FAIL_INDEX = 4;
// 9 scenarios: the last one has passed VERIFY and faded before the resolved STATIC_T frame.
const FAULTS = [2, 3, 1, 4, 6, 2, 5, 3, 2];

export const PACKETS: PacketDef[] = FAULTS.map((faults, i) => ({
  id: `p${i}`,
  launch: FIRST + SPACING * i,
  faults,
  failing: i === FAIL_INDEX,
  compact: i === FAIL_INDEX || i % 2 === 0,
}));

export const FAIL_PACKET = PACKETS[FAIL_INDEX];

/** Travel time between adjacent stages. */
export const HOP = 0.5;
/** Time a scenario spends running under faults at STRESS. */
export const DWELL = 0.4;

/** Stage indices. */
export const STAGE = {
  connect: 0,
  stress: 1,
  verify: 2,
  reproduce: 3,
} as const;

/** Key moments for the failing scenario. */
const tF = FAIL_PACKET.launch;
const atVerify = tF + 2 * HOP + DWELL;
const atReproduce = atVerify + 0.9 + HOP;
export const FAIL = {
  atStress: tF + HOP,
  atVerify,
  violation: atVerify + 0.05,
  leaveVerify: atVerify + 0.9,
  atReproduce,
  /** Re-runs start; each one lands RERUN_GAP apart. */
  rerunStart: atReproduce + 0.1,
  dropTick: atReproduce + 1.05,
  collapse: atReproduce + 1.45,
  saved: atReproduce + 1.9,
} as const;

/** Time a passing scenario reaches VERIFY. */
const verifyTime = (p: PacketDef) => (p.failing ? FAIL.atVerify : p.launch + 2 * HOP + DWELL);

/** Stage position over time (stage units). */
export function packetStage(p: PacketDef): Keyframes {
  const t0 = p.launch;
  if (!p.failing) {
    return track([
      [t0, STAGE.connect],
      [t0 + HOP, STAGE.stress],
      [t0 + HOP + DWELL, STAGE.stress],
      [verifyTime(p), STAGE.verify],
    ]);
  }
  return track([
    [t0, STAGE.connect],
    [FAIL.atStress, STAGE.stress],
    [FAIL.atStress + DWELL, STAGE.stress],
    [FAIL.atVerify, STAGE.verify],
    [FAIL.leaveVerify, STAGE.verify],
    [FAIL.atReproduce, STAGE.reproduce],
  ]);
}

export function packetOpacity(p: PacketDef): Keyframes {
  const t0 = p.launch;
  if (p.failing) {
    return track([
      [t0 - 0.001, 0],
      [t0 + 0.15, 1],
      [FADE_START, 1],
      [FADE_END, 0],
    ]);
  }
  // Passing scenarios are checked at VERIFY and leave the rail.
  const at = verifyTime(p);
  return track([
    [t0 - 0.001, 0],
    [t0 + 0.15, 1],
    [at + 0.05, 1],
    [at + 0.4, 0],
  ]);
}

/** Failing packet colour crossfades: neutral -> orange (violation) -> lime (kept as a regression test). */
export const FAIL_COLOR = {
  orange: track([
    [FAIL.atVerify - 0.05, 0],
    [FAIL.atVerify + 0.15, 1],
    [FAIL.collapse, 1],
    [FAIL.saved, 0],
  ]),
  lime: track([
    [FAIL.collapse, 0],
    [FAIL.saved, 1],
  ]),
};

/* Fault-tick geometry (relative to the packet centre). */
export const TICK_GAP = 3.4;
export const TICK_W = 1.6;
export const TICK_H = 5;
/** Fault ticks on the failing scenario before reduction. */
export const FAIL_TICKS = 6;
/** Ticks that reduction drops. Conceptual: no real fault counts are depicted. */
export const REMOVED_TICKS: ReadonlySet<number> = new Set([0, 2, 5]);
export const KEPT_TICKS = FAIL_TICKS - REMOVED_TICKS.size;

export function tickOffset(index: number, count: number) {
  return (index - (count - 1) / 2) * TICK_GAP;
}

/** x offset for tick `i` of the failing packet: evenly spaced, closing up after reduction. */
export function failTickX(i: number): Keyframes {
  const before = tickOffset(i, FAIL_TICKS);
  if (REMOVED_TICKS.has(i)) return track([[0, before]]);
  let afterIndex = 0;
  for (let k = 0; k < i; k++) if (!REMOVED_TICKS.has(k)) afterIndex++;
  const after = tickOffset(afterIndex, KEPT_TICKS);
  return track([
    [FAIL.dropTick + 0.1, before],
    [FAIL.collapse, after],
    [LOOP - 0.01, after],
    [LOOP, before],
  ]);
}

export const REMOVED_TICK_OPACITY = track([
  [FAIL.dropTick - 0.001, 1],
  [FAIL.dropTick + 0.35, 0],
  [LOOP - 0.3, 0],
  [LOOP, 1],
]);
export const REMOVED_TICK_Y = track([
  [FAIL.dropTick, 0],
  [FAIL.dropTick + 0.35, -5],
  [LOOP - 0.3, -5],
  [LOOP, 0],
]);

/* -------------------------------------------------------------------------- */
/* Reproduction: repeated re-runs, with a measured (not guaranteed) outcome     */
/* -------------------------------------------------------------------------- */

export const RERUN_COUNT = 8;
export const RERUN_GAP = 0.1;
/** Re-runs that did not reproduce. Shown so the stage never reads as an exact replay. */
export const RERUN_MISSES: ReadonlySet<number> = new Set([2, 6]);

export function rerunTime(i: number) {
  return FAIL.rerunStart + i * RERUN_GAP;
}

/** Three outline echoes leave the packet while it is being re-run. */
export const ECHO_COUNT = 3;
export function echoTracks(k: number) {
  const s = FAIL.rerunStart + k * 0.28;
  return {
    opacity: track([
      [s - 0.001, 0],
      [s + 0.04, 0.75],
      [s + 0.55, 0],
    ]),
    scale: track([
      [s, 1],
      [s + 0.55, 1.9],
    ]),
  };
}

/** Readout timings. */
export const READOUT = {
  violation: persistFrom(FAIL.violation),
  reduced: persistFrom(FAIL.collapse),
  saved: persistFrom(FAIL.saved),
  /** Node highlights. */
  /** Orange while the failing scenario sits at VERIFY; the readout keeps the verdict. */
  verifyNode: track([
    [FAIL.atVerify - 0.001, 0],
    [FAIL.atVerify + 0.2, 1],
    [FAIL.leaveVerify, 1],
    [FAIL.leaveVerify + 0.3, 0],
  ]),
  reproduceNode: persistFrom(FAIL.atReproduce, 0.2),
};

/* -------------------------------------------------------------------------- */
/* STRESS progress bar                                                         */
/* -------------------------------------------------------------------------- */

/** Time a packet arrives at STRESS. */
export function stressWindow(p: PacketDef) {
  return { at: p.launch + HOP, dwell: DWELL };
}

/** scaleX of the run bar: sweeps 0 -> 1 while each scenario runs under faults, then resets. */
export function stressBar(packets: PacketDef[]): Keyframes {
  const points: [number, number][] = [[0, 0]];
  for (const p of packets) {
    const { at, dwell } = stressWindow(p);
    points.push([at, 0], [at + dwell, 1], [at + dwell + 0.12, 1], [at + dwell + 0.2, 0]);
  }
  return track(points);
}

/** Brief lime flash at VERIFY for each scenario that passes its checks. */
export function passFlash(packets: PacketDef[]): Keyframes {
  const points: [number, number][] = [[0, 0]];
  for (const p of packets) {
    if (p.failing) continue;
    const at = verifyTime(p);
    points.push([at - 0.01, 0], [at + 0.06, 0.7], [at + 0.45, 0]);
  }
  return track(points);
}
