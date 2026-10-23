/**
 * Deterministic timeline for the hero pipeline animation.
 *
 * Everything is a pure function of one looping clock (seconds, 0..LOOP), so the
 * animation can pause/resume exactly and render a static frame for reduced motion.
 * Positions along the rail are in "stage units" (0 = SCENARIO ... 6 = REGRESSION);
 * each layout maps stage units to SVG coordinates.
 *
 * This is an illustrative composition, not recorded data.
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
  /** Number of new coverage cells this packet lights at COVERAGE. */
  newCells: number;
  failing: boolean;
  /** Shown in the reduced "mobile" variant. */
  compact: boolean;
};

const SPACING = 0.95;
const FIRST = 0.3;
const FAIL_INDEX = 6;
const FAULTS = [2, 1, 3, 4, 2, 5, 6, 3, 1, 4, 2, 5, 3, 2];
/** Diminishing returns: new behavior gets rarer as the campaign runs. */
const NEW_CELLS = [3, 3, 2, 3, 2, 2, 2, 2, 1, 2, 1, 0, 1, 0];

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

/** Key moments for the failing scenario. */
const tF = FAIL_PACKET.launch;
export const FAIL = {
  atExecute: tF + HOP + 0.05,
  atCoverage: tF + 2 * HOP + 0.35,
  atFailure: tF + 3 * HOP + 0.55,
  violation: tF + 3 * HOP + 0.6,
  atMinimize: tF + 4 * HOP + 1.25,
  dropTick: tF + 4 * HOP + 1.55,
  collapse: tF + 4 * HOP + 1.95,
  leaveMinimize: tF + 4 * HOP + 2.45,
  atReplay: tF + 5 * HOP + 2.45,
  ghostIn: tF + 5 * HOP + 2.5,
  ghostLock: tF + 5 * HOP + 3.2,
  leaveReplay: tF + 5 * HOP + 3.45,
  atRegression: tF + 6 * HOP + 3.45,
  saved: tF + 6 * HOP + 3.7,
} as const;

/** Stage position over time (stage units). */
export function packetStage(p: PacketDef): Keyframes {
  const t0 = p.launch;
  if (!p.failing) {
    return track([
      [t0, 0],
      [t0 + HOP + 0.05, 1],
      [t0 + HOP + 0.35, 1], // execute dwell
      [t0 + 2 * HOP + 0.35, 2],
    ]);
  }
  return track([
    [t0, 0],
    [FAIL.atExecute, 1],
    [FAIL.atExecute + 0.3, 1],
    [FAIL.atCoverage, 2],
    [FAIL.atCoverage + 0.2, 2],
    [FAIL.atFailure, 3],
    [FAIL.atFailure + 0.75, 3],
    [FAIL.atMinimize, 4],
    [FAIL.leaveMinimize, 4],
    [FAIL.atReplay, 5],
    [FAIL.leaveReplay, 5],
    [FAIL.atRegression, 6],
  ]);
}

/** Time the packet reaches COVERAGE (where it lights cells). */
export function coverageTime(p: PacketDef) {
  return p.failing ? FAIL.atCoverage : p.launch + 2 * HOP + 0.35;
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

/** Failing packet colour crossfades: neutral -> orange (violation) -> lime (saved as regression). */
export const FAIL_COLOR = {
  orange: track([
    [FAIL.atFailure - 0.05, 0],
    [FAIL.atFailure + 0.15, 1],
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
/** Index of the tick that ddmin removes in the failing scenario. */
export const REMOVED_TICK = 3;

export function tickOffset(index: number, count: number) {
  return (index - (count - 1) / 2) * TICK_GAP;
}

/** x offset for tick `i` of the failing packet: evenly spaced, closing the gap after ddmin drops one. */
export function failTickX(i: number): Keyframes {
  const before = tickOffset(i, 6);
  if (i === REMOVED_TICK) return track([[0, before]]);
  const afterIndex = i < REMOVED_TICK ? i : i - 1;
  const after = tickOffset(afterIndex, 5);
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

/** Replay ghost: appears offset, then locks exactly onto the original (1:1). */
export const GHOST_OPACITY = track([
  [FAIL.ghostIn - 0.001, 0],
  [FAIL.ghostIn + 0.2, 0.9],
  [FAIL.saved, 0.9],
  [FAIL.saved + 0.4, 0],
]);
export const GHOST_SHIFT = track([
  [FAIL.ghostIn, 1],
  [FAIL.ghostLock, 0],
]);

/** Readout timings. */
export const READOUT = {
  violation: persistFrom(FAIL.violation),
  minimized: persistFrom(FAIL.collapse),
  replay: persistFrom(FAIL.ghostLock),
  saved: persistFrom(FAIL.saved),
  /** Failure-node highlight. */
  failureNode: persistFrom(FAIL.atFailure, 0.2),
  minimizeNode: persistFrom(FAIL.atMinimize, 0.2),
  replayNode: persistFrom(FAIL.atReplay, 0.2),
  regressionNode: persistFrom(FAIL.atRegression, 0.2),
  /** Placeholder copy shown in the failure readout before anything has failed. */
  searching: track([
    [0, 1],
    [FAIL.violation - 0.2, 1],
    [FAIL.violation, 0],
    [FADE_END, 0],
    [LOOP, 1],
  ]),
  faultsSix: track([
    [0, 1],
    [FAIL.dropTick + 0.1, 1],
    [FAIL.collapse, 0],
    [FADE_END, 0],
    [LOOP, 1],
  ]),
};

/* -------------------------------------------------------------------------- */
/* Feedback dots (new coverage goes back into the corpus)                      */
/* -------------------------------------------------------------------------- */

export function feedbackTimes(p: PacketDef) {
  const start = coverageTime(p) + 0.1;
  return { start, down: start + 0.18, across: start + 0.95, up: start + 1.13 };
}

/* -------------------------------------------------------------------------- */
/* Coverage cells                                                              */
/* -------------------------------------------------------------------------- */

export type CellPlan = {
  cols: number;
  rows: number;
  /** Cells lit before the loop starts (seed corpus). */
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
/* Regression naming                                                           */
/* -------------------------------------------------------------------------- */

export function regressionName(n: number) {
  return `regression_${String(n).padStart(4, "0")}`;
}

/** Short illustrative content hash for a stored regression (deterministic). */
export function regressionHash(n: number) {
  const h = Math.imul(n * 2654435761, 0x9e3779b1) >>> 0;
  return h.toString(16).padStart(8, "0").slice(0, 6);
}

/* -------------------------------------------------------------------------- */
/* EXECUTE progress bar                                                        */
/* -------------------------------------------------------------------------- */

/** Time a packet arrives at EXECUTE and how long it dwells there. */
export function executeWindow(p: PacketDef) {
  return p.failing ? { at: FAIL.atExecute, dwell: 0.3 } : { at: p.launch + HOP + 0.05, dwell: 0.3 };
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

/** Opacity of the "new behavior" flash at COVERAGE for packets that add cells. */
export function coverageFlash(packets: PacketDef[]): Keyframes {
  const points: [number, number][] = [[0, 0]];
  for (const p of packets) {
    if (p.newCells === 0) continue;
    const at = coverageTime(p);
    points.push([at - 0.01, 0], [at + 0.06, 1], [at + 0.55, 0]);
  }
  return track(points);
}
