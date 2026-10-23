/**
 * SVG marks for the hero pipeline: rail, stage nodes, scenario packets, the failing
 * packet and the coverage feedback lane. Every moving part is a pure function of one
 * looping clock (see ./script.ts) and only animates transform and opacity.
 *
 * The same marks render in two orientations through a small geometry object:
 * "x" (desktop band, stages left to right) and "y" (mobile column, stages top to bottom).
 */

import { motion, useTransform, type MotionValue } from "motion/react";
import { useMemo } from "react";
import {
  FAIL,
  FAIL_COLOR,
  FAIL_PACKET,
  GHOST_OPACITY,
  GHOST_SHIFT,
  LOOP,
  READOUT,
  REMOVED_TICK,
  REMOVED_TICK_OPACITY,
  REMOVED_TICK_Y,
  STAGE_COUNT,
  TICK_GAP,
  TICK_H,
  TICK_W,
  coverageFlash,
  executeBar,
  failTickX,
  feedbackTimes,
  packetOpacity,
  packetStage,
  tickOffset,
  track,
  type Keyframes,
  type PacketDef,
} from "./script";

export type Clock = MotionValue<number>;

export type Geometry = {
  /** Axis the rail runs along. */
  axis: "x" | "y";
  /** Stage units (0..6) -> coordinate along the rail. */
  at: (stage: number) => number;
  /** Cross-axis coordinate of the rail. */
  rail: number;
  /** Cross-axis coordinate of the feedback lane (COVERAGE -> SCENARIO). */
  lane: number;
};

/** Subscribe a motion value to a keyframe track on the clock. */
export function useTrack(clock: Clock, kf: Keyframes) {
  return useTransform(clock, kf.input, kf.output);
}

const NS = "non-scaling-stroke" as const;
const PACKET_H = 9;
const packetWidth = (faults: number) => faults * TICK_GAP + 4;
const W6 = packetWidth(6);
const W5 = packetWidth(5);

/** [along, cross] -> [x, y] for the active orientation. */
function pt(geo: Geometry, along: number, cross: number): [number, number] {
  return geo.axis === "x" ? [along, cross] : [cross, along];
}

/* -------------------------------------------------------------------------- */
/* Static structure                                                            */
/* -------------------------------------------------------------------------- */

/** The rail, a fine ruler along it, and the dashed feedback lane back to SCENARIO. */
export function RailStructure({ geo }: { geo: Geometry }) {
  const start = geo.at(0);
  const end = geo.at(STAGE_COUNT - 1);
  const [x1, y1] = pt(geo, start, geo.rail);
  const [x2, y2] = pt(geo, end, geo.rail);

  // Ruler ticks every 1/8 stage, on the side away from the feedback lane.
  const step = (geo.at(1) - geo.at(0)) / 8;
  const away = geo.lane < geo.rail ? 1 : -1;
  const ruler: string[] = [];
  for (let a = start + step; a < end - step / 2; a += step) {
    const isMajor = Math.abs((a - start) / (step * 8) - Math.round((a - start) / (step * 8))) < 0.01;
    if (isMajor) continue;
    const [rx1, ry1] = pt(geo, a, geo.rail + away * 4);
    const [rx2, ry2] = pt(geo, a, geo.rail + away * 6.5);
    ruler.push(`M${rx1} ${ry1}L${rx2} ${ry2}`);
  }

  // Feedback lane: COVERAGE -> lane -> SCENARIO, ending just short of the rail.
  const c = geo.at(2);
  const s = geo.at(0);
  const gap = 8 * Math.sign(geo.lane - geo.rail);
  const p0 = pt(geo, c, geo.rail + gap);
  const p1 = pt(geo, c, geo.lane);
  const p2 = pt(geo, s, geo.lane);
  const p3 = pt(geo, s, geo.rail + gap);
  const lane = `M${p0[0]} ${p0[1]}L${p1[0]} ${p1[1]}L${p2[0]} ${p2[1]}L${p3[0]} ${p3[1]}`;

  // Arrowhead pointing from the lane into SCENARIO.
  const dir = -Math.sign(geo.lane - geo.rail);
  const a0 = pt(geo, s - 2.5, geo.rail + gap - dir * 3);
  const a1 = pt(geo, s + 2.5, geo.rail + gap - dir * 3);
  const arrow = `M${a0[0]} ${a0[1]}L${p3[0]} ${p3[1]}L${a1[0]} ${a1[1]}`;

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-line-2" strokeWidth={1} vectorEffect={NS} />
      <path d={ruler.join("")} className="stroke-line" strokeWidth={1} vectorEffect={NS} />
      <path
        d={lane}
        fill="none"
        className="stroke-lime"
        strokeOpacity={0.4}
        strokeWidth={1}
        strokeDasharray="2 4"
        vectorEffect={NS}
      />
      <path d={arrow} fill="none" className="stroke-lime" strokeOpacity={0.6} strokeWidth={1} vectorEffect={NS} />
    </g>
  );
}

/** Square stage markers, with state overlays driven by the clock. */
export function StageNodes({ geo, clock, packets }: { geo: Geometry; clock: Clock; packets: PacketDef[] }) {
  const covFlash = useTrack(
    clock,
    useMemo(() => coverageFlash(packets), [packets]),
  );
  const execBar = useTrack(
    clock,
    useMemo(() => executeBar(packets), [packets]),
  );
  const execOn = useTransform(execBar, (v): number => (v > 0.02 ? 1 : 0));
  const failOn = useTrack(clock, READOUT.failureNode);
  const minOn = useTrack(clock, READOUT.minimizeNode);
  const replayOn = useTrack(clock, READOUT.replayNode);
  const regOn = useTrack(clock, READOUT.regressionNode);

  const overlays: Record<number, { opacity: MotionValue<number>; tone: "lime" | "orange" }> = {
    1: { opacity: execOn, tone: "lime" },
    2: { opacity: covFlash, tone: "lime" },
    3: { opacity: failOn, tone: "orange" },
    4: { opacity: minOn, tone: "lime" },
    5: { opacity: replayOn, tone: "lime" },
    6: { opacity: regOn, tone: "lime" },
  };

  // Desktop band is scaled ~1.25x, so 10 units renders ~12px with a ~24px halo.
  const size = geo.axis === "x" ? 10 : 9;
  const halo = geo.axis === "x" ? 19 : 17;
  return (
    <g>
      {Array.from({ length: STAGE_COUNT }, (_, s) => {
        const [x, y] = pt(geo, geo.at(s), geo.rail);
        const overlay = overlays[s];
        const tone = overlay?.tone === "orange" ? "fill-orange stroke-orange" : "fill-lime stroke-lime";
        return (
          <g key={s} transform={`translate(${x} ${y})`}>
            <rect
              x={-size / 2}
              y={-size / 2}
              width={size}
              height={size}
              className={s === 0 ? "fill-window stroke-muted" : "fill-window stroke-line-2"}
              strokeWidth={1}
              vectorEffect={NS}
            />
            {overlay && (
              <motion.g style={{ opacity: overlay.opacity }}>
                <rect
                  x={-halo / 2}
                  y={-halo / 2}
                  width={halo}
                  height={halo}
                  className={overlay.tone === "orange" ? "fill-orange" : "fill-lime"}
                  fillOpacity={0.15}
                />
                <rect
                  x={-size / 2}
                  y={-size / 2}
                  width={size}
                  height={size}
                  className={tone}
                  strokeWidth={1}
                  vectorEffect={NS}
                />
              </motion.g>
            )}
          </g>
        );
      })}
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Packets                                                                     */
/* -------------------------------------------------------------------------- */

function usePacketMotion(clock: Clock, geo: Geometry, p: PacketDef) {
  const stage = useMemo(() => packetStage(p), [p]);
  const along = useMemo(() => ({ input: stage.input, output: stage.output.map(geo.at) }), [stage, geo]);
  const opacityKf = useMemo(() => packetOpacity(p), [p]);
  const pos = useTrack(clock, along);
  const opacity = useTrack(clock, opacityKf);
  return geo.axis === "x" ? { x: pos, y: geo.rail, opacity } : { x: geo.rail, y: pos, opacity };
}

/** A generated scenario: a square frame carrying 1-6 fault ticks. */
export function Packet({ p, clock, geo }: { p: PacketDef; clock: Clock; geo: Geometry }) {
  const style = usePacketMotion(clock, geo, p);
  const w = packetWidth(p.faults);
  return (
    <motion.g style={style}>
      <rect
        x={-w / 2}
        y={-PACKET_H / 2}
        width={w}
        height={PACKET_H}
        className="fill-surface-2 stroke-muted"
        strokeWidth={1}
        vectorEffect={NS}
      />
      {Array.from({ length: p.faults }, (_, i) => (
        <rect
          key={i}
          x={tickOffset(i, p.faults) - TICK_W / 2}
          y={-TICK_H / 2}
          width={TICK_W}
          height={TICK_H}
          className="fill-text"
        />
      ))}
    </motion.g>
  );
}

const COLLAPSE = track([
  [FAIL.dropTick + 0.1, 1],
  [FAIL.collapse, W5 / W6],
  [LOOP - 0.01, W5 / W6],
  [LOOP, 1],
]);
const RING_SCALE = track([
  [FAIL.violation, 1],
  [FAIL.violation + 0.9, 3.2],
]);
const RING_OPACITY = track([
  [FAIL.violation - 0.001, 0],
  [FAIL.violation + 0.04, 0.9],
  [FAIL.violation + 0.9, 0],
]);

function FailTick({ i, clock, className }: { i: number; clock: Clock; className: string }) {
  const kf = useMemo(() => failTickX(i), [i]);
  const x = useTrack(clock, kf);
  const removedOpacity = useTrack(clock, REMOVED_TICK_OPACITY);
  const removedY = useTrack(clock, REMOVED_TICK_Y);
  const removed = i === REMOVED_TICK;
  return (
    <motion.rect
      x={-TICK_W / 2}
      y={-TICK_H / 2}
      width={TICK_W}
      height={TICK_H}
      className={className}
      style={removed ? { x, y: removedY, opacity: removedOpacity } : { x }}
    />
  );
}

function FailLayer({
  clock,
  opacity,
  frame,
  tick,
}: {
  clock: Clock;
  opacity: MotionValue<number>;
  frame: string;
  tick: string;
}) {
  const scaleX = useTrack(clock, COLLAPSE);
  return (
    <motion.g style={{ opacity }}>
      <motion.rect
        x={-W6 / 2}
        y={-PACKET_H / 2}
        width={W6}
        height={PACKET_H}
        className={frame}
        strokeWidth={1}
        vectorEffect={NS}
        style={{ scaleX }}
      />
      {Array.from({ length: 6 }, (_, i) => (
        <FailTick key={i} i={i} clock={clock} className={tick} />
      ))}
    </motion.g>
  );
}

/**
 * The one scenario that violates an invariant: turns orange at FAILURE, sheds one fault
 * at MINIMIZE (6 -> 5), is overlaid 1:1 by its replay at REPLAY and settles in lime at
 * REGRESSION.
 */
export function FailingPacket({ clock, geo }: { clock: Clock; geo: Geometry }) {
  const style = usePacketMotion(clock, geo, FAIL_PACKET);
  const orange = useTrack(clock, FAIL_COLOR.orange);
  const lime = useTrack(clock, FAIL_COLOR.lime);
  const neutral = useTransform([orange, lime], ([o, l]: number[]) => 1 - Math.max(o, l));
  const scaleX = useTrack(clock, COLLAPSE);
  const ringScale = useTrack(clock, RING_SCALE);
  const ringOpacity = useTrack(clock, RING_OPACITY);
  const ghostOpacity = useTrack(clock, GHOST_OPACITY);
  const shift = useTrack(clock, GHOST_SHIFT);
  const ghostX = useTransform(shift, (v) => v * 9);
  const ghostY = useTransform(shift, (v) => v * -7);

  return (
    <motion.g style={style}>
      {/* Violation pulse */}
      <motion.rect
        x={-7}
        y={-7}
        width={14}
        height={14}
        fill="none"
        className="stroke-orange"
        strokeWidth={1}
        vectorEffect={NS}
        style={{ scale: ringScale, opacity: ringOpacity }}
      />
      {/* Opaque base so the rail does not show through */}
      <motion.rect
        x={-W6 / 2}
        y={-PACKET_H / 2}
        width={W6}
        height={PACKET_H}
        className="fill-window"
        style={{ scaleX }}
      />
      <FailLayer clock={clock} opacity={neutral} frame="fill-surface-2 stroke-text" tick="fill-text" />
      <FailLayer clock={clock} opacity={orange} frame="fill-orange/15 stroke-orange" tick="fill-orange" />
      <FailLayer clock={clock} opacity={lime} frame="fill-lime/15 stroke-lime" tick="fill-lime" />
      {/* Replay ghost: arrives offset, locks exactly onto the original */}
      <motion.g style={{ opacity: ghostOpacity, x: ghostX, y: ghostY }}>
        <rect
          x={-W5 / 2 - 2.5}
          y={-PACKET_H / 2 - 2.5}
          width={W5 + 5}
          height={PACKET_H + 5}
          fill="none"
          className="stroke-lime"
          strokeWidth={1}
          strokeDasharray="2 2"
          vectorEffect={NS}
        />
      </motion.g>
    </motion.g>
  );
}

/* -------------------------------------------------------------------------- */
/* Coverage feedback                                                           */
/* -------------------------------------------------------------------------- */

/** New coverage travels back along the lane to SCENARIO, where it becomes a corpus entry. */
export function FeedbackDot({ p, clock, geo }: { p: PacketDef; clock: Clock; geo: Geometry }) {
  const kfs = useMemo(() => {
    const f = feedbackTimes(p);
    return {
      along: track([
        [f.start, geo.at(2)],
        [f.down, geo.at(2)],
        [f.across, geo.at(0)],
      ]),
      cross: track([
        [f.start, geo.rail],
        [f.down, geo.lane],
        [f.across, geo.lane],
        [f.up, geo.rail],
      ]),
      opacity: track([
        [f.start - 0.001, 0],
        [f.start + 0.05, 1],
        [f.up - 0.05, 1],
        [f.up + 0.05, 0],
      ]),
    };
  }, [p, geo]);
  const along = useTrack(clock, kfs.along);
  const cross = useTrack(clock, kfs.cross);
  const opacity = useTrack(clock, kfs.opacity);
  const style = geo.axis === "x" ? { x: along, y: cross, opacity } : { x: cross, y: along, opacity };
  return (
    <motion.g style={style}>
      <rect x={-1.75} y={-1.75} width={3.5} height={3.5} className="fill-lime" />
    </motion.g>
  );
}
