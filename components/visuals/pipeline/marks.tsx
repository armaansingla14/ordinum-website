/**
 * SVG marks for the hero pipeline: rail, the four stage nodes, scenario packets and the
 * failing packet. Every moving part is a pure function of one looping clock (see ./script.ts)
 * and only animates transform and opacity.
 *
 * The same marks render in two orientations through a small geometry object:
 * "x" (desktop band, stages left to right) and "y" (mobile column, stages top to bottom).
 */

import { motion, useTransform, type MotionValue } from "motion/react";
import { useMemo } from "react";
import {
  ECHO_COUNT,
  FAIL,
  FAIL_COLOR,
  FAIL_PACKET,
  FAIL_TICKS,
  KEPT_TICKS,
  LOOP,
  READOUT,
  REMOVED_TICKS,
  REMOVED_TICK_OPACITY,
  REMOVED_TICK_Y,
  STAGE,
  STAGE_COUNT,
  TICK_GAP,
  TICK_H,
  TICK_W,
  echoTracks,
  failTickX,
  packetOpacity,
  passFlash,
  packetStage,
  stressBar,
  tickOffset,
  track,
  type Keyframes,
  type PacketDef,
} from "./script";

export type Clock = MotionValue<number>;

export type Geometry = {
  /** Axis the rail runs along. */
  axis: "x" | "y";
  /** Stage units (0..3) -> coordinate along the rail. */
  at: (stage: number) => number;
  /** Cross-axis coordinate of the rail. */
  rail: number;
};

/** Subscribe a motion value to a keyframe track on the clock. */
export function useTrack(clock: Clock, kf: Keyframes) {
  return useTransform(clock, kf.input, kf.output);
}

const NS = "non-scaling-stroke" as const;
const PACKET_H = 9;
const packetWidth = (faults: number) => faults * TICK_GAP + 4;
const W_FULL = packetWidth(FAIL_TICKS);
const W_MIN = packetWidth(KEPT_TICKS);

/** [along, cross] -> [x, y] for the active orientation. */
function pt(geo: Geometry, along: number, cross: number): [number, number] {
  return geo.axis === "x" ? [along, cross] : [cross, along];
}

/* -------------------------------------------------------------------------- */
/* Static structure                                                            */
/* -------------------------------------------------------------------------- */

/** The rail, a fine ruler along it, and an arrowhead into the last stage. */
export function RailStructure({ geo }: { geo: Geometry }) {
  const start = geo.at(0);
  const end = geo.at(STAGE_COUNT - 1);
  const [x1, y1] = pt(geo, start, geo.rail);
  const [x2, y2] = pt(geo, end, geo.rail);

  // Ruler ticks every 1/10 stage, on one side of the rail; stage positions are left clear.
  const step = (geo.at(1) - geo.at(0)) / 10;
  const ruler: string[] = [];
  for (let a = start + step; a < end - step / 2; a += step) {
    const k = (a - start) / (step * 10);
    if (Math.abs(k - Math.round(k)) < 0.01) continue;
    const [rx1, ry1] = pt(geo, a, geo.rail + 4);
    const [rx2, ry2] = pt(geo, a, geo.rail + 6.5);
    ruler.push(`M${rx1} ${ry1}L${rx2} ${ry2}`);
  }

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-line-2" strokeWidth={1} vectorEffect={NS} />
      <path d={ruler.join("")} className="stroke-line" strokeWidth={1} vectorEffect={NS} />
    </g>
  );
}

/** Square stage markers, with state overlays driven by the clock. */
export function StageNodes({ geo, clock, packets }: { geo: Geometry; clock: Clock; packets: PacketDef[] }) {
  const bar = useTrack(
    clock,
    useMemo(() => stressBar(packets), [packets]),
  );
  const stressOn = useTransform(bar, (v): number => (v > 0.02 ? 1 : 0));
  const pass = useTrack(
    clock,
    useMemo(() => passFlash(packets), [packets]),
  );
  const verifyOn = useTrack(clock, READOUT.verifyNode);
  const reproOn = useTrack(clock, READOUT.reproduceNode);

  type Overlay = { opacity: MotionValue<number>; tone: "lime" | "orange" };
  const overlays: Record<number, Overlay[]> = {
    [STAGE.stress]: [{ opacity: stressOn, tone: "lime" }],
    [STAGE.verify]: [
      { opacity: pass, tone: "lime" },
      { opacity: verifyOn, tone: "orange" },
    ],
    [STAGE.reproduce]: [{ opacity: reproOn, tone: "lime" }],
  };

  // Desktop band is scaled ~1.25x, so 10 units renders ~12px with a ~24px halo.
  const size = geo.axis === "x" ? 10 : 9;
  const halo = geo.axis === "x" ? 19 : 17;
  return (
    <g>
      {Array.from({ length: STAGE_COUNT }, (_, s) => {
        const [x, y] = pt(geo, geo.at(s), geo.rail);
        return (
          <g key={s} transform={`translate(${x} ${y})`}>
            {s === STAGE.connect &&
              // Stacked outlines: several kinds of systems enter through the same adapter contract.
              [4, 2].map((o) => (
                <rect
                  key={o}
                  x={-size / 2 - o}
                  y={-size / 2 - o}
                  width={size}
                  height={size}
                  className="fill-window stroke-line-2"
                  strokeWidth={1}
                  vectorEffect={NS}
                />
              ))}
            <rect
              x={-size / 2}
              y={-size / 2}
              width={size}
              height={size}
              className={s === 0 ? "fill-window stroke-muted" : "fill-window stroke-line-2"}
              strokeWidth={1}
              vectorEffect={NS}
            />
            {(overlays[s] ?? []).map((overlay) => (
              <motion.g key={overlay.tone} style={{ opacity: overlay.opacity }}>
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
                  className={overlay.tone === "orange" ? "fill-orange stroke-orange" : "fill-lime stroke-lime"}
                  strokeWidth={1}
                  vectorEffect={NS}
                />
              </motion.g>
            ))}
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

/** A generated scenario: a square frame carrying a few fault ticks. */
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
  [FAIL.collapse, W_MIN / W_FULL],
  [LOOP - 0.01, W_MIN / W_FULL],
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
  const removed = REMOVED_TICKS.has(i);
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
        x={-W_FULL / 2}
        y={-PACKET_H / 2}
        width={W_FULL}
        height={PACKET_H}
        className={frame}
        strokeWidth={1}
        vectorEffect={NS}
        style={{ scaleX }}
      />
      {Array.from({ length: FAIL_TICKS }, (_, i) => (
        <FailTick key={i} i={i} clock={clock} className={tick} />
      ))}
    </motion.g>
  );
}

/** One outline echo: a re-run of the failing scenario leaving the packet. */
function Echo({ k, clock }: { k: number; clock: Clock }) {
  const kfs = useMemo(() => echoTracks(k), [k]);
  const opacity = useTrack(clock, kfs.opacity);
  const scale = useTrack(clock, kfs.scale);
  return (
    <motion.rect
      x={-W_FULL / 2 - 2.5}
      y={-PACKET_H / 2 - 2.5}
      width={W_FULL + 5}
      height={PACKET_H + 5}
      fill="none"
      className="stroke-lime"
      strokeWidth={1}
      strokeDasharray="2 2"
      vectorEffect={NS}
      style={{ opacity, scale }}
    />
  );
}

/**
 * The one scenario that violates a property: turns orange at VERIFY, is re-run several
 * times and sheds faults at REPRODUCE, and settles in lime once it is kept as a test.
 */
export function FailingPacket({ clock, geo }: { clock: Clock; geo: Geometry }) {
  const style = usePacketMotion(clock, geo, FAIL_PACKET);
  const orange = useTrack(clock, FAIL_COLOR.orange);
  const lime = useTrack(clock, FAIL_COLOR.lime);
  const neutral = useTransform([orange, lime], ([o, l]: number[]) => 1 - Math.max(o, l));
  const scaleX = useTrack(clock, COLLAPSE);
  const ringScale = useTrack(clock, RING_SCALE);
  const ringOpacity = useTrack(clock, RING_OPACITY);

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
      {/* Re-run echoes */}
      {Array.from({ length: ECHO_COUNT }, (_, k) => (
        <Echo key={k} k={k} clock={clock} />
      ))}
      {/* Opaque base so the rail does not show through */}
      <motion.rect
        x={-W_FULL / 2}
        y={-PACKET_H / 2}
        width={W_FULL}
        height={PACKET_H}
        className="fill-window"
        style={{ scaleX }}
      />
      <FailLayer clock={clock} opacity={neutral} frame="fill-surface-2 stroke-text" tick="fill-text" />
      <FailLayer clock={clock} opacity={orange} frame="fill-orange/15 stroke-orange" tick="fill-orange" />
      <FailLayer clock={clock} opacity={lime} frame="fill-lime/15 stroke-lime" tick="fill-lime" />
    </motion.g>
  );
}
