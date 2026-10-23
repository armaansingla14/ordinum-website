"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import type { ProblemCard } from "@/lib/content";
import { cn } from "@/lib/cn";

/* -------------------------------------------------------------------------- */
/* Schematic micro-diagrams for the four cross-layer failure patterns.         */
/* Lime = signal path, hairline = structure, orange = failure endpoint only.   */
/* Diagrams are decorative (aria-hidden); the causal chain is rendered as text. */
/* -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;

const svgVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
};

/** Structural layer: lanes, boundaries, labels. */
const baseV: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

/** Lime signal path draws in. */
const drawV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 1.1, ease: EASE } },
};

/** Failure endpoint lands last. */
const failV: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: EASE, delay: 0.35 } },
};

function Label({
  x,
  y,
  children,
  anchor = "start",
  tone = "subtle",
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  tone?: "subtle" | "muted" | "lime" | "orange";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={11}
      letterSpacing="0.08em"
      className={cn(
        "font-mono uppercase",
        tone === "subtle" && "fill-subtle",
        tone === "muted" && "fill-muted",
        tone === "lime" && "fill-lime",
        tone === "orange" && "fill-orange",
      )}
    >
      {children}
    </text>
  );
}

/** Orange failure endpoint: solid core + faint halo. */
function FailNode({ x, y }: { x: number; y: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={9} className="fill-none stroke-orange" strokeOpacity={0.35} />
      <circle cx={x} cy={y} r={4} className="fill-orange" />
    </>
  );
}

const arrowHead = (x: number, y: number, dir: "right" | "down" | "up" = "right") => {
  if (dir === "right") return `M${x - 5} ${y - 3.5} L${x} ${y} L${x - 5} ${y + 3.5}`;
  if (dir === "down") return `M${x - 3.5} ${y - 5} L${x} ${y} L${x + 3.5} ${y - 5}`;
  return `M${x - 3.5} ${y + 5} L${x} ${y} L${x + 3.5} ${y + 5}`;
};

/* 1. Stale sensor -> valid but unsafe action -------------------------------- */
function StaleDiagram() {
  const ticks = [70, 110, 150, 190];
  return (
    <>
      <motion.g variants={baseV}>
        <Label x={0} y={34}>World</Label>
        <Label x={0} y={66}>State</Label>
        <Label x={0} y={104}>Cmd</Label>
        {[30, 62, 100].map((y) => (
          <line key={y} x1={50} x2={316} y1={y} y2={y} className="stroke-line" strokeDasharray="1 3" />
        ))}
        {/* true pose keeps moving */}
        <line x1={70} x2={190} y1={30} y2={30} className="stroke-muted" strokeOpacity={0.6} />
        {ticks.map((x, i) => (
          <circle key={x} cx={x} cy={30} r={i === ticks.length - 1 ? 3.5 : 2.5} className="fill-muted" />
        ))}
        {/* sample taken once */}
        <line x1={70} x2={70} y1={33} y2={59} className="stroke-line-2" strokeDasharray="2 2" />
        {/* drift between world and belief */}
        <path d="M200 30 H206 V62 H200" className="fill-none stroke-line-2" />
        <Label x={213} y={50} tone="muted">Drift</Label>
      </motion.g>
      <motion.path
        variants={drawV}
        d="M70 62 H190 V100 H218"
        className="fill-none stroke-lime"
        strokeWidth={1.25}
      />
      <motion.g variants={baseV}>
        <circle cx={70} cy={62} r={2.5} className="fill-lime" />
        <Label x={130} y={56} anchor="middle" tone="lime">Stale</Label>
        <rect x={218} y={90} width={52} height={20} className="fill-window stroke-lime" />
        <Label x={244} y={104} anchor="middle" tone="lime">Valid</Label>
        <line x1={270} x2={286} y1={100} y2={100} className="stroke-lime" />
        <path d={arrowHead(288, 100)} className="fill-none stroke-lime" />
      </motion.g>
      <motion.g variants={failV}>
        <FailNode x={302} y={100} />
        <Label x={316} y={81} anchor="end" tone="orange">Unsafe</Label>
      </motion.g>
    </>
  );
}

/* 2. Timing jitter -> oscillation ------------------------------------------- */
const JITTER = [3, 8, 15, 6, 20, 12];
const WAVE_SPLIT = 222;

function wavePath(from: number, to: number) {
  const pts: string[] = [];
  for (let x = from; x <= to; x += 2) {
    const t = (x - 52) / (300 - 52);
    const amp = 1.5 + 25 * t * t;
    const y = 84 - amp * Math.sin(((x - 52) / 30) * Math.PI);
    pts.push(`${pts.length === 0 ? "M" : "L"}${x} ${y.toFixed(2)}`);
  }
  return pts.join(" ");
}

function JitterDiagram() {
  const expected = [60, 100, 140, 180, 220, 260];
  const endY = 84 - (1.5 + 25) * Math.sin(((300 - 52) / 30) * Math.PI);
  return (
    <>
      <motion.g variants={baseV}>
        <Label x={0} y={32}>Obs</Label>
        <Label x={0} y={88}>Ctrl</Label>
        <line x1={50} x2={316} y1={28} y2={28} className="stroke-line" strokeDasharray="1 3" />
        {expected.map((x) => (
          <line key={x} x1={x} x2={x} y1={21} y2={35} className="stroke-line-2" />
        ))}
        {expected.map((x, i) => (
          <line key={`d${x}`} x1={x} x2={x + JITTER[i]} y1={41} y2={41} className="stroke-line-2" strokeDasharray="1.5 1.5" />
        ))}
        <Label x={316} y={46} anchor="end" tone="muted">Late</Label>
        {/* setpoint */}
        <line x1={50} x2={316} y1={84} y2={84} className="stroke-line" strokeDasharray="4 3" />
      </motion.g>
      <motion.g variants={baseV}>
        {expected.map((x, i) => (
          <line key={`a${x}`} x1={x + JITTER[i]} x2={x + JITTER[i]} y1={21} y2={41} className="stroke-lime" strokeWidth={1.25} />
        ))}
      </motion.g>
      <motion.path variants={drawV} d={wavePath(52, WAVE_SPLIT)} className="fill-none stroke-lime" strokeWidth={1.25} />
      <motion.g variants={failV}>
        <path d={wavePath(WAVE_SPLIT, 300)} className="fill-none stroke-orange" strokeWidth={1.25} />
        <FailNode x={300} y={endY} />
        <Label x={316} y={126} anchor="end" tone="orange">Oscillation</Label>
      </motion.g>
    </>
  );
}

/* 3. Retry fork -> duplicated command ---------------------------------------- */
function RetryDiagram() {
  return (
    <>
      <motion.g variants={baseV}>
        <rect x={10} y={48} width={58} height={30} className="fill-window stroke-line-2" />
        <Label x={39} y={67} anchor="middle" tone="muted">Ctrl</Label>
        <rect x={186} y={48} width={58} height={30} className="fill-window stroke-line-2" />
        <Label x={215} y={67} anchor="middle" tone="muted">Act</Label>
        {/* ack lost on the way back */}
        <line x1={186} x2={68} y1={71} y2={71} className="stroke-line-2" strokeDasharray="3 3" />
        <path d="M123 66 L133 76 M133 66 L123 76" className="stroke-subtle" />
        <Label x={128} y={92} anchor="middle" tone="muted">Ack lost</Label>
      </motion.g>
      <motion.path variants={drawV} d="M68 55 H184" className="fill-none stroke-lime" strokeWidth={1.25} />
      <motion.path variants={drawV} d="M39 78 V110 H215 V80" className="fill-none stroke-lime" strokeWidth={1.25} />
      <motion.g variants={baseV}>
        <Label x={128} y={46} anchor="middle" tone="lime">Cmd</Label>
        <path d={arrowHead(185, 55)} className="fill-none stroke-lime" />
        <path d={arrowHead(215, 79, "up")} className="fill-none stroke-lime" />
        <Label x={128} y={126} anchor="middle" tone="lime">Retry / same cmd</Label>
      </motion.g>
      <motion.g variants={failV}>
        <path d="M244 63 L270 43 M244 63 L270 83" className="fill-none stroke-orange" />
        <circle cx={274} cy={40} r={4} className="fill-orange" />
        <circle cx={274} cy={86} r={4} className="fill-orange" />
        <circle cx={274} cy={40} r={9} className="fill-none stroke-orange" strokeOpacity={0.35} />
        <circle cx={274} cy={86} r={9} className="fill-none stroke-orange" strokeOpacity={0.35} />
        <text x={292} y={67} fontSize={11} className="fill-orange font-mono">
          ×2
        </text>
      </motion.g>
    </>
  );
}

/* 4. Software | firmware | physical boundary --------------------------------- */
function BoundaryDiagram() {
  return (
    <>
      <motion.g variants={baseV}>
        <Label x={53} y={11} anchor="middle" tone="muted">Software</Label>
        <Label x={160} y={11} anchor="middle" tone="muted">Firmware</Label>
        <Label x={266} y={11} anchor="middle" tone="muted">Physical</Label>
        {[106, 213].map((x) => (
          <line key={x} x1={x} x2={x} y1={22} y2={128} className="stroke-line-2" strokeDasharray="3 3" />
        ))}
        <Label x={53} y={40} anchor="middle">Contract A</Label>
        <Label x={160} y={40} anchor="middle">Contract B</Label>
        {/* what software expected to happen */}
        <line x1={213} x2={300} y1={84} y2={84} className="stroke-line-2" strokeDasharray="4 3" />
        <Label x={300} y={102} anchor="end" tone="muted">Expected</Label>
      </motion.g>
      <motion.path
        variants={drawV}
        d="M12 84 H150 L162 70 H213"
        className="fill-none stroke-lime"
        strokeWidth={1.25}
      />
      <motion.g variants={baseV}>
        <rect x={102.5} y={80.5} width={7} height={7} className="fill-window stroke-lime" />
        <rect x={209.5} y={66.5} width={7} height={7} className="fill-window stroke-lime" />
        <Label x={12} y={76} tone="lime">Intent</Label>
      </motion.g>
      <motion.g variants={failV}>
        <path d="M213 70 C 245 70, 262 54, 294 40" className="fill-none stroke-orange" strokeWidth={1.25} />
        <FailNode x={296} y={39} />
        <Label x={283} y={30} anchor="end" tone="orange">Diverges</Label>
      </motion.g>
    </>
  );
}

const DIAGRAMS: Record<string, () => ReactNode> = {
  "stale-sensor": StaleDiagram,
  "middleware-timing": JitterDiagram,
  "controller-retry": RetryDiagram,
  boundary: BoundaryDiagram,
};

function Diagram({ id }: { id: string }) {
  const reduce = useReducedMotion();
  const Body = DIAGRAMS[id];
  if (!Body) return null;
  return (
    <motion.svg
      viewBox="0 0 320 132"
      className="block h-auto w-full overflow-visible"
      aria-hidden="true"
      focusable="false"
      variants={svgVariants}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      <Body />
    </motion.svg>
  );
}

type FailureCardsProps = {
  cards: readonly ProblemCard[];
  className?: string;
};

/** 2x2 hairline grid of cross-layer failure patterns, each with a schematic causal-chain diagram. */
export default function FailureCards({ cards, className }: FailureCardsProps) {
  return (
    <ul className={cn("hairline-grid grid-cols-1 sm:grid-cols-2", className)}>
      {cards.map((card, i) => {
        const last = card.chain.length - 1;
        return (
          <li
            key={card.id}
            className="group flex flex-col bg-surface p-5 transition-colors duration-300 hover:bg-surface-2 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="label-mono text-[10px] text-lime">F.{String(i + 1).padStart(2, "0")}</span>
              <span className="label-mono text-right text-[10px] text-subtle">{card.layer}</span>
            </div>

            <div className="mt-4 border border-line bg-window px-3.5 pb-3 pt-3.5 transition-colors duration-300 group-hover:border-line-2">
              <Diagram id={card.id} />
            </div>

            <h3 className="mt-6 text-[19px] font-semibold leading-[1.25] tracking-title text-text">{card.title}</h3>

            <ol className="mt-4 space-y-[7px] font-mono text-[11.5px] leading-[1.5]" aria-label="Causal chain">
              {card.chain.map((step, j) => (
                <li key={step} className={cn("flex gap-2.5", j === last ? "text-orange" : "text-[#b7c4bf]")}>
                  <span aria-hidden="true" className={j === last ? "text-orange" : "text-subtle"}>
                    {j === last ? "■" : "→"}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <p className="mt-5 border-t border-line pt-4 text-[14px] leading-[1.7] text-muted">{card.detail}</p>
          </li>
        );
      })}
    </ul>
  );
}
