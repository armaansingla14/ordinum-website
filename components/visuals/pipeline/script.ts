/**
 * Deterministic timeline for the hero pipeline animation.
 *
 * Everything is a pure function of one looping clock (seconds, 0..LOOP), so the
 * animation can pause/resume exactly and render a static frame for reduced motion.
 * Positions along the rail are in "stage units" (0 = SYSTEMS ... 6 = REGRESS);
 * each layout maps stage units to SVG coordinates.
 *
 * This is a conceptual composition, not recorded data: no counts, rates or fault
 * numbers shown here describe a real run.
 */

/** Loop length in seconds. */
export const LOOP = 16;
/** Frame shown for reduced motion / before the animation starts: every stage resolved. */
export const STATIC_T = 14.6;
/** Persistent state (coverage, tags, settled packet) fades out over this window before the loop restarts. */
export const FADE_START = 15.25;
export const FADE_END = 15.8;

export const STAGE_COUNT = 7;

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

/** Opacity: 1 until `off`, then fades out. */
export function visibleUntil(off: number, fadeOut = 0.25): Keyframes {
  return track([
    [off, 1],
    [off + fadeOut, 0],
    [FADE_END + 0.05, 0],
    [LOOP - 0.3, 0],
    [LOOP, 1],
  ]);
}

/* -------------------------------------------------------------------------- */
/* Packets                                                                     */
/* -------------------------------------------------------------------------- */

export type PacketDef = {
  id: string;
  launch: number;
  /** Fault ticks carried by the scenario (1-6). */
  faults: number;
  /** Number of new behavior cells this packet lights at EVIDENCE. */
  newCells: number;
  failing: boolean;
  /** Shown in the reduced "mobile" variant. */
  compact: boolean;
};

const SPACING = 0.95;
const FIRST = 0.3;
const FAIL_INDEX = 6;
// 13 scenarios: the last one has left the rail before the resolved STATIC_T frame.
const FAULTS = [2, 1, 3, 4, 2, 5, 6, 3, 1, 4, 2, 5, 3];
/** Diminishing returns: new behavior gets rarer as the campaign runs. */
const NEW_CELLS = [3, 3, 2, 3, 2, 2, 2, 2, 1, 2, 1, 0, 1];

export const PACKETS: PacketDef[] = FAULTS.map((faults, i) => ({
  id: `p${i}`,
  launch: FIRST + SPACING * i,
  faults,
  newCells: NEW_CELLS[i],
  failing: i === FAIL_INDEX,
  compact: i === FAIL_INDEX || i % 2 === 0,
}));

export const FAIL_PACKET = PACKETS[FAIL_INDEX];

/** Travel time between adjacent stages. */
export const HOP = 0.5;

/** Stage indices. */
export const STAGE = {
  systems: 0,
  engines: 1,
  execute: 2,
  evidence: 3,
  verify: 4,
  reproduce: 5,
  regress: 6,
} as const;

/** Key moments for the failing scenario. */
const tF = FAIL_PACKET.launch;
const atReproduce = tF + 5 * HOP + 1.3;
export const FAIL = {
  atEngines: tF + HOP,
  atExecute: tF + 2 * HOP + 0.05,
  atEvidence: tF + 3 * HOP + 0.35,
  atVerify: tF + 4 * HOP + 0.55,
  violation: tF + 4 * HOP + 0.6,
  leaveVerify: tF + 4 * HOP + 1.3,
  atReproduce,
  /** Re-runs start; each one lands RERUN_GAP apart. */
  rerunStart: atReproduce + 0.1,
  dropTick: atReproduce + 1.05,
  collapse: atReproduce + 1.45,
  leaveReproduce: atReproduce + 1.75,
  atRegression: atReproduce + 1.75 + HOP,
  saved: atReproduce + 1.75 + HOP + 0.25,
} as const;

/** Stage position over time (stage units). */
export function packetStage(p: PacketDef): Keyframes {
  const t0 = p.launch;
  if (!p.failing) {
    return track([
      [t0, STAGE.systems],
      [t0 + HOP, STAGE.engines],
      [t0 + 2 * HOP + 0.05, STAGE.execute],
      [t0 + 2 * HOP + 0.35, STAGE.execute], // execute dwell
      [t0 + 3 * HOP + 0.35, STAGE.evidence],
    ]);
  }
  return track([
    [t0, STAGE.systems],
    [FAIL.atEngines, STAGE.engines],
    [FAIL.atExecute, STAGE.execute],
    [FAIL.atExecute + 0.3, STAGE.execute],
    [FAIL.atEvidence, STAGE.evidence],
    [FAIL.atEvidence + 0.2, STAGE.evidence],
    [FAIL.atVerify, STAGE.verify],
    [FAIL.leaveVerify, STAGE.verify],
    [FAIL.atReproduce, STAGE.reproduce],
    [FAIL.leaveReproduce, STAGE.reproduce],
    [FAIL.atRegression, STAGE.regress],
  ]);
}

/** Time the packet reaches EVIDENCE (where it lights behavior cells). */
export function coverageTime(p: PacketDef) {
  return p.failing ? FAIL.atEvidence : p.launch + 3 * HOP + 0.35;
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
  const atCov = coverageTime(p);
  // Packets that add nothing new fade faster and dimmer.
  const exit = p.newCells > 0 ? 0.45 : 0.25;
  return track([
    [t0 - 0.001, 0],
    [t0 + 0.15, 1],
    [atCov + 0.05, 1],
    [atCov + exit, 0],
  ]);
}

/** Failing packet colour crossfades: neutral -> orange (violation) -> lime (kept as a regression test). */
export const FAIL_COLOR = {
  orange: track([
    [FAIL.atVerify - 0.05, 0],
    [FAIL.atVerify + 0.15, 1],
    [FAIL.atRegression, 1],
    [FAIL.saved, 0],
  ]),
  lime: track([
    [FAIL.atRegression, 0],
    [FAIL.saved, 1],
  ]),
};

/* Fault-tick geometry (relative to the packet centre). */
export const TICK_GAP = 3.4;
export const TICK_W = 1.6;
export const TICK_H = 5;
/** Fault ticks on the failing scenario before minimization. */
export const FAIL_TICKS = 6;
/** Ticks that minimization drops. Conceptual: no real fault counts are depicted. */
export const REMOVED_TICKS: ReadonlySet<number> = new Set([0, 2, 5]);
export const KEPT_TICKS = FAIL_TICKS - REMOVED_TICKS.size;

export function tickOffset(index: number, count: number) {
  return (index - (count - 1) / 2) * TICK_GAP;
}

/** x offset for tick `i` of the failing packet: evenly spaced, closing up after minimization. */
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
  reproduced: persistFrom(rerunTime(RERUN_COUNT - 1) + 0.15),
  minimized: persistFrom(FAIL.collapse),
  saved: persistFrom(FAIL.saved),
  /** Node highlights. */
  verifyNode: persistFrom(FAIL.atVerify, 0.2),
  reproduceNode: persistFrom(FAIL.atReproduce, 0.2),
  regressionNode: persistFrom(FAIL.atRegression, 0.2),
};

/* -------------------------------------------------------------------------- */
/* Feedback dots (observed behavior goes back to the engines)                  */
/* -------------------------------------------------------------------------- */

export function feedbackTimes(p: PacketDef) {
  const start = coverageTime(p) + 0.1;
  return { start, down: start + 0.18, across: start + 0.95, up: start + 1.13 };
}

/* -------------------------------------------------------------------------- */
/* Behavior cells                                                              */
/* -------------------------------------------------------------------------- */

export type CellPlan = {
  cols: number;
  rows: number;
  /** Cells lit before the loop starts (behavior already seen). */
  seeds: number[];
  /** Cell index -> time it lights. */
  lit: Map<number, number>;
};

/** Deterministic shuffle (mulberry32). */
function seededOrder(n: number, seed: number) {
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function planCells(cols: number, rows: number, seedCount: number, packets: PacketDef[]): CellPlan {
  const order = seededOrder(cols * rows, 7 + cols * 31 + rows);
  const seeds = order.slice(0, seedCount);
  const lit = new Map<number, number>();
  let cursor = seedCount;
  for (const p of packets) {
    const at = coverageTime(p);
    for (let k = 0; k < p.newCells && cursor < order.length; k++) {
      lit.set(order[cursor++], at + k * 0.09);
    }
  }
  return { cols, rows, seeds, lit };
}

export function cellOpacity(on: number): Keyframes {
  return track([
    [on - 0.001, 0],
    [on + 0.08, 1],
    [on + 0.9, 0.62],
    [FADE_START, 0.62],
    [FADE_END, 0],
  ]);
}

/* -------------------------------------------------------------------------- */
/* EXECUTE progress bar                                                        */
/* -------------------------------------------------------------------------- */

/** Time a packet arrives at EXECUTE and how long it dwells there. */
export function executeWindow(p: PacketDef) {
  return p.failing ? { at: FAIL.atExecute, dwell: 0.3 } : { at: p.launch + 2 * HOP + 0.05, dwell: 0.3 };
}

/** scaleX of the execution bar: sweeps 0 -> 1 while each packet runs, then resets. */
export function executeBar(packets: PacketDef[]): Keyframes {
  const points: [number, number][] = [[0, 0]];
  for (const p of packets) {
    const { at, dwell } = executeWindow(p);
    points.push([at, 0], [at + dwell, 1], [at + dwell + 0.12, 1], [at + dwell + 0.2, 0]);
  }
  return track(points);
}

/** Opacity of the "new behavior" flash at EVIDENCE for packets that add cells. */
export function coverageFlash(packets: PacketDef[]): Keyframes {
  const points: [number, number][] = [[0, 0]];
  for (const p of packets) {
    if (p.newCells === 0) continue;
    const at = coverageTime(p);
    points.push([at - 0.01, 0], [at + 0.06, 1], [at + 0.55, 0]);
  }
  return track(points);
}
