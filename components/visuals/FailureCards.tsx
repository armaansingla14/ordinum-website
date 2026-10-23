"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import type { FailureExample } from "@/lib/content";
import { cn } from "@/lib/cn";

/* -------------------------------------------------------------------------- */
/* Conceptual micro-diagrams for four cross-boundary failure patterns.         */
/* Domain-neutral on purpose: services, callers, caches, workers.              */
/* Lime = signal path, hairline = structure, orange = failure endpoint only.   */
/* Diagrams are decorative (aria-hidden); the pattern is described in text.    */
/* -------------------------------------------------------------------------- */

export type FailureDiagramId = "stale-authorization" | "retry-duplicate" | "restart-state" | "timeout-recovery";

const EASE = [0.16, 1, 0.3, 1] as const;
const VB_W = 280;
const VB_H = 120;

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
      fontSize={11.5}
      letterSpacing="0.07em"
      className={cn(
        // Below sm the card is narrower than the viewBox, so labels get larger user units
        // to stay legible (~10px at 320 wide, ~12px at 375).
        "font-mono uppercase max-sm:[font-size:13px]",
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

const arrowHead = (x: number, y: number, dir: "right" | "left" | "down" | "up" = "right") => {
  if (dir === "right") return `M${x - 5} ${y - 3.5} L${x} ${y} L${x - 5} ${y + 3.5}`;
  if (dir === "left") return `M${x + 5} ${y - 3.5} L${x} ${y} L${x + 5} ${y + 3.5}`;
  if (dir === "down") return `M${x - 3.5} ${y - 5} L${x} ${y} L${x + 3.5} ${y - 5}`;
  return `M${x - 3.5} ${y + 5} L${x} ${y} L${x + 3.5} ${y + 5}`;
};

/** Lane rule with a row label on the left. */
function Lane({ y, label }: { y: number; label: string }) {
  return (
    <>
      <Label x={0} y={y + 4}>
        {label}
      </Label>
      <line x1={64} x2={VB_W} y1={y} y2={y} className="stroke-line" strokeDasharray="1 3" />
    </>
  );
}

/* 1. Stale authorization: revoked at the source, still honored downstream --- */
function StaleAuthDiagram() {
  const revokeX = 150;
  return (
    <>
      <motion.g variants={baseV}>
        <Lane y={22} label="Auth" />
        <Lane y={62} label="Cache" />
        <Lane y={100} label="Req" />
        {/* the revocation, and everything after it */}
        <line x1={revokeX} x2={revokeX} y1={12} y2={112} className="stroke-line-2" strokeDasharray="3 3" />
        <path d={`M${revokeX - 4} 18 L${revokeX + 4} 26 M${revokeX + 4} 18 L${revokeX - 4} 26`} className="stroke-muted" />
        <Label x={revokeX + 9} y={15} tone="muted">
          Revoked
        </Label>
      </motion.g>
      {/* grant issued, copied to the cache, and kept */}
      <motion.path variants={drawV} d="M82 22 V62 H238" className="fill-none stroke-lime" strokeWidth={1.25} />
      <motion.g variants={baseV}>
        <circle cx={82} cy={22} r={2.5} className="fill-lime" />
        <Label x={88} y={55} tone="lime">
          Grant
        </Label>
        {/* a request after revocation reads the cached grant */}
        <line x1={222} x2={222} y1={98} y2={70} className="stroke-lime" />
        <path d={arrowHead(222, 68, "up")} className="fill-none stroke-lime" />
      </motion.g>
      <motion.g variants={failV}>
        <FailNode x={252} y={100} />
        <line x1={226} x2={242} y1={100} y2={100} className="stroke-orange" />
        <Label x={VB_W} y={117} anchor="end" tone="orange">
          Allowed
        </Label>
      </motion.g>
    </>
  );
}

/* 2. Retry: the reply is lost, the retry repeats the side effect ------------- */
function RetryDiagram() {
  return (
    <>
      <motion.g variants={baseV}>
        <rect x={6} y={40} width={62} height={30} className="fill-window stroke-line-2" />
        <Label x={37} y={59} anchor="middle" tone="muted">
          Client
        </Label>
        <rect x={160} y={40} width={66} height={30} className="fill-window stroke-line-2" />
        <Label x={193} y={59} anchor="middle" tone="muted">
          Service
        </Label>
        {/* reply lost on the way back */}
        <line x1={160} x2={68} y1={63} y2={63} className="stroke-line-2" strokeDasharray="3 3" />
        <path d="M109 58 L119 68 M119 58 L109 68" className="stroke-subtle" />
        <Label x={114} y={84} anchor="middle" tone="muted">
          Reply lost
        </Label>
      </motion.g>
      <motion.path variants={drawV} d="M68 47 H158" className="fill-none stroke-lime" strokeWidth={1.25} />
      <motion.path variants={drawV} d="M37 70 V102 H193 V72" className="fill-none stroke-lime" strokeWidth={1.25} />
      <motion.g variants={baseV}>
        <Label x={114} y={38} anchor="middle" tone="lime">
          Write
        </Label>
        <path d={arrowHead(159, 47)} className="fill-none stroke-lime" />
        <path d={arrowHead(193, 71, "up")} className="fill-none stroke-lime" />
        <Label x={114} y={117} anchor="middle" tone="lime">
          Retry, same write
        </Label>
      </motion.g>
      <motion.g variants={failV}>
        <path d="M226 55 L248 36 M226 55 L248 74" className="fill-none stroke-orange" />
        <circle cx={252} cy={33} r={4} className="fill-orange" />
        <circle cx={252} cy={77} r={4} className="fill-orange" />
        <circle cx={252} cy={33} r={9} className="fill-none stroke-orange" strokeOpacity={0.35} />
        <circle cx={252} cy={77} r={9} className="fill-none stroke-orange" strokeOpacity={0.35} />
        <text x={266} y={59} fontSize={11.5} className="fill-orange font-mono">
          ×2
        </text>
      </motion.g>
    </>
  );
}

/* 3. Restart: a dependency comes back with older state than its caller holds -- */
function Chip({ x, y, children, tone = "muted" }: { x: number; y: number; children: ReactNode; tone?: "muted" | "lime" }) {
  return (
    <>
      <rect
        x={x - 15}
        y={y - 9}
        width={30}
        height={18}
        className={cn("fill-window", tone === "lime" ? "stroke-lime" : "stroke-line-2")}
      />
      <Label x={x} y={y + 4} anchor="middle" tone={tone}>
        {children}
      </Label>
    </>
  );
}

function RestartDiagram() {
  const a = 30;
  const b = 92;
  return (
    <>
      <motion.g variants={baseV}>
        <Label x={0} y={a + 4}>
          A
        </Label>
        <Label x={0} y={b + 4}>
          B
        </Label>
        <line x1={24} x2={VB_W} y1={a} y2={a} className="stroke-muted" strokeOpacity={0.55} />
        {/* B's lifeline breaks while it restarts */}
        <line x1={24} x2={112} y1={b} y2={b} className="stroke-muted" strokeOpacity={0.55} />
        <line x1={112} x2={152} y1={b} y2={b} className="stroke-line-2" strokeDasharray="2 3" />
        <line x1={152} x2={VB_W} y1={b} y2={b} className="stroke-muted" strokeOpacity={0.55} />
        <Label x={132} y={b + 22} anchor="middle" tone="muted">
          Restart
        </Label>
        <Chip x={64} y={a}>
          v2
        </Chip>
        <Chip x={64} y={b}>
          v2
        </Chip>
        <line x1={64} x2={64} y1={a + 9} y2={b - 9} className="stroke-line-2" strokeDasharray="2 2" />
        <Chip x={180} y={b}>
          v1
        </Chip>
      </motion.g>
      {/* A acts on the state it believes B still holds */}
      <motion.path variants={drawV} d="M206 39 V83" className="fill-none stroke-lime" strokeWidth={1.25} />
      <motion.g variants={baseV}>
        <circle cx={206} cy={a} r={2.5} className="fill-lime" />
        <Label x={216} y={60} tone="lime">
          Op@v2
        </Label>
        <path d={arrowHead(206, 84, "down")} className="fill-none stroke-lime" />
      </motion.g>
      <motion.g variants={failV}>
        <FailNode x={206} y={b} />
        <Label x={VB_W} y={b + 22} anchor="end" tone="orange">
          Mismatch
        </Label>
      </motion.g>
    </>
  );
}

/* 4. Timeout: the caller recovers while the original operation still lands --- */
function TimeoutDiagram() {
  const caller = 30;
  const worker = 88;
  const deadline = 136;
  return (
    <>
      <motion.g variants={baseV}>
        <Label x={0} y={caller + 4}>
          Caller
        </Label>
        <Label x={0} y={worker + 4}>
          Worker
        </Label>
        <line x1={64} x2={VB_W} y1={caller} y2={caller} className="stroke-line" strokeDasharray="1 3" />
        <line x1={64} x2={VB_W} y1={worker} y2={worker} className="stroke-line" strokeDasharray="1 3" />
        {/* the slow operation keeps running past the caller's deadline */}
        <rect x={84} y={worker - 5} width={128} height={10} className="fill-surface-2 stroke-line-2" />
        <line x1={deadline} x2={deadline} y1={12} y2={worker + 18} className="stroke-line-2" strokeDasharray="3 3" />
        <Label x={deadline - 6} y={16} anchor="end" tone="muted">
          Timeout
        </Label>
        <Label x={204} y={worker + 22} anchor="end" tone="muted">
          Still running
        </Label>
      </motion.g>
      {/* request, then a recovery path that assumes the operation failed */}
      <motion.path variants={drawV} d="M76 30 V82" className="fill-none stroke-lime" strokeWidth={1.25} />
      <motion.path variants={drawV} d={`M${deadline} 30 H230 V${worker - 7}`} className="fill-none stroke-lime" strokeWidth={1.25} />
      <motion.g variants={baseV}>
        <circle cx={76} cy={caller} r={2.5} className="fill-lime" />
        <path d={arrowHead(76, 82, "down")} className="fill-none stroke-lime" />
        <Label x={deadline + 6} y={24} tone="lime">
          Recover
        </Label>
        <path d={arrowHead(230, worker - 7, "down")} className="fill-none stroke-lime" />
      </motion.g>
      <motion.g variants={failV}>
        <line x1={212} x2={222} y1={worker} y2={worker} className="stroke-orange" />
        <FailNode x={230} y={worker} />
        <Label x={VB_W} y={worker + 22} anchor="end" tone="orange">
          Unsafe
        </Label>
      </motion.g>
    </>
  );
}

const DIAGRAMS: Record<FailureDiagramId, () => ReactNode> = {
  "stale-authorization": StaleAuthDiagram,
  "retry-duplicate": RetryDiagram,
  "restart-state": RestartDiagram,
  "timeout-recovery": TimeoutDiagram,
};

function Diagram({ id }: { id: FailureDiagramId }) {
  const reduce = useReducedMotion();
  const Body = DIAGRAMS[id];
  return (
    <motion.svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
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

export type FailureCard = {
  diagram: FailureDiagramId;
  /** One example, or a cause followed by its consequence. */
  examples: readonly FailureExample[];
};

type FailureCardsProps = {
  cards: readonly FailureCard[];
  className?: string;
};

/**
 * 2x2 hairline grid of conceptual cross-boundary failure patterns. Each card pairs a
 * schematic diagram with the pattern in words: a single example, or cause -> consequence.
 */
export default function FailureCards({ cards, className }: FailureCardsProps) {
  return (
    <ul className={cn("hairline-grid grid-cols-1 sm:grid-cols-2", className)}>
      {cards.map((card, i) => {
        const last = card.examples.length - 1;
        return (
          <li
            key={card.diagram}
            className="group flex min-w-0 flex-col bg-surface p-4 transition-colors duration-300 hover:bg-surface-2 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="label-mono text-[10px] text-lime">F.{String(i + 1).padStart(2, "0")}</span>
            </div>

            <div className="mt-4 border border-line bg-window px-2.5 pt-3 pb-2.5 transition-colors duration-300 group-hover:border-line-2 sm:px-3.5 sm:pt-3.5 sm:pb-3">
              <Diagram id={card.diagram} />
            </div>

            <h3 className="mt-6 text-[19px] leading-[1.25] font-semibold tracking-title text-balance text-text">
              {card.examples.map((ex, j) => (
                <span key={ex.id}>
                  {j > 0 && (
                    <>
                      <span aria-hidden="true" className="text-subtle">
                        {" → "}
                      </span>
                      <span className="sr-only">, leading to </span>
                    </>
                  )}
                  {j > 0 ? ex.title.toLowerCase() : ex.title}
                </span>
              ))}
            </h3>

            <ol className="mt-4 space-y-3 border-t border-line pt-4" aria-label="Pattern">
              {card.examples.map((ex, j) => (
                <li key={ex.id} className="flex gap-3 text-[14px] leading-[1.65] text-muted">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-[7px] inline-block size-[6px] shrink-0",
                      j === last ? "bg-orange" : "border border-lime",
                    )}
                  />
                  <span>{ex.detail}</span>
                </li>
              ))}
            </ol>
          </li>
        );
      })}
    </ul>
  );
}
