import { useId } from "react";
import { cn } from "@/lib/cn";
import type { SequenceDiagramCopy, SequenceStep } from "@/lib/content";

/*
 * Sequence diagram for the product pages (server component, no motion).
 * md+: an SVG with one lifeline per actor and one arrow per step. Below md: the same steps as an
 * ordered list, so the diagram stays legible at 320px. Only one of the two is displayed at a time
 * (display:none hides the other from assistive tech too).
 * Colours: info = steel, fault = dashed steel, violation = orange (failures only), verdict = lime.
 * Conceptual diagrams carry a CONCEPTUAL tag; diagrams built from real data cite their artifact.
 */

const W = 760;
const PAD_X = 16;
const HEAD_H = 40;
const TOP = HEAD_H + 26;
const ROW = 46;

const STROKE: Record<SequenceStep["tone"], string> = {
  info: "#7d8c8a",
  fault: "#9aaba5",
  violation: "#ffa779",
  verdict: "#c1e29e",
};

const TEXT: Record<SequenceStep["tone"], string> = {
  info: "#d5dbd8",
  fault: "#c9d1ce",
  violation: "#ffa779",
  verdict: "#c1e29e",
};

const TONE_LABEL: Record<SequenceStep["tone"], string> = {
  info: "",
  fault: "Fault",
  violation: "Violation",
  verdict: "Verdict",
};

export default function SequenceDiagram({ diagram, className }: { diagram: SequenceDiagramCopy; className?: string }) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  const markerId = (tone: SequenceStep["tone"]) => `${uid}-arrow-${tone}`;

  const n = diagram.actors.length;
  const colW = (W - PAD_X * 2) / n;
  const laneX = (id: string) => {
    const i = diagram.actors.findIndex((a) => a.id === id);
    return PAD_X + (Math.max(i, 0) + 0.5) * colW;
  };
  const laneIndex = (id: string) => diagram.actors.findIndex((a) => a.id === id);
  const H = TOP + diagram.steps.length * ROW + 20;
  const actorLabel = (id: string) => diagram.actors.find((a) => a.id === id)?.label ?? id;

  /** Keep a label inside the drawing: anchor to the side when it sits over the outer lanes. */
  const labelAnchor = (x: number) => {
    if (x < W * 0.22) return { x: Math.max(x - colW * 0.4, PAD_X), anchor: "start" as const };
    if (x > W * 0.78) return { x: Math.min(x + colW * 0.4, W - PAD_X), anchor: "end" as const };
    return { x, anchor: "middle" as const };
  };

  return (
    <figure className={cn("border border-[#3c4749] bg-window", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <p className="font-mono text-[10.5px] tracking-[0.12em] text-[#c9d1ce] uppercase">Sequence · {diagram.actors.length} participants</p>
        {diagram.conceptual ? (
          <span className="inline-flex items-center border border-line-2 bg-bg px-[7px] py-[4px] font-mono text-[10px] leading-none tracking-[0.12em] text-muted uppercase">
            Conceptual
          </span>
        ) : (
          <span className="inline-flex items-center border border-lime/40 px-[7px] py-[4px] font-mono text-[10px] leading-none tracking-[0.12em] text-lime uppercase">
            From a recorded run
          </span>
        )}
      </div>

      {/* md+: SVG */}
      <div className="hidden px-3 py-4 md:block lg:px-6 lg:py-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          className="mx-auto block h-auto w-full max-w-[920px]"
        >
          <title id={titleId}>{diagram.title}</title>
          <desc id={descId}>{diagram.ariaLabel}</desc>
          <defs>
            {(Object.keys(STROKE) as SequenceStep["tone"][]).map((tone) => (
              <marker
                key={tone}
                id={markerId(tone)}
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="8"
                markerHeight="8"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L8 4 L0 8 z" fill={STROKE[tone]} />
              </marker>
            ))}
          </defs>

          {diagram.actors.map((a) => {
            const x = laneX(a.id);
            const boxW = Math.min(colW - 14, 168);
            return (
              <g key={a.id}>
                <rect x={x - boxW / 2} y={4} width={boxW} height={HEAD_H - 8} fill="#111619" stroke="#3b474b" />
                <text
                  x={x}
                  y={HEAD_H / 2 + 4}
                  textAnchor="middle"
                  fontSize="12.5"
                  fontWeight="600"
                  fill="#f2f3f0"
                  fontFamily="var(--font-inter), system-ui, sans-serif"
                >
                  {a.label}
                </text>
                <line x1={x} x2={x} y1={HEAD_H - 4} y2={H - 8} stroke="#2a3235" strokeDasharray="3 4" />
              </g>
            );
          })}

          {diagram.steps.map((step, i) => {
            const y = TOP + i * ROW + 18;
            const x1 = laneX(step.from);
            const x2 = laneX(step.to);
            const stroke = STROKE[step.tone];
            const dash = step.tone === "fault" ? "5 4" : undefined;
            const self = step.from === step.to;
            const label = labelAnchor(self ? x1 : (x1 + x2) / 2);
            return (
              <g key={`${step.label}-${i}`}>
                <text
                  x={self ? label.x : label.x}
                  y={y - 8}
                  textAnchor={label.anchor}
                  fontSize="12"
                  fill={TEXT[step.tone]}
                  stroke="#0c1113"
                  strokeWidth="5"
                  paintOrder="stroke"
                  strokeLinejoin="round"
                  fontFamily="var(--font-dm-mono), ui-monospace, monospace"
                >
                  <tspan fill="#7d8c8a">{String(i + 1).padStart(2, "0")} </tspan>
                  {step.label}
                </text>
                {self ? (
                  <path
                    d={`M${x1} ${y - 2} h30 v14 h-26`}
                    fill="none"
                    stroke={stroke}
                    strokeWidth="1.4"
                    strokeDasharray={dash}
                    markerEnd={`url(#${markerId(step.tone)})`}
                  />
                ) : (
                  <line
                    x1={x1 + (laneIndex(step.to) > laneIndex(step.from) ? 4 : -4)}
                    x2={x2 + (laneIndex(step.to) > laneIndex(step.from) ? -4 : 4)}
                    y1={y}
                    y2={y}
                    stroke={stroke}
                    strokeWidth="1.4"
                    strokeDasharray={dash}
                    markerEnd={`url(#${markerId(step.tone)})`}
                  />
                )}
                {(step.tone === "violation" || step.tone === "verdict") && (
                  <rect x={x2 - 3.5} y={y - 3.5} width="7" height="7" fill={stroke} />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Below md: the same sequence as a list. */}
      <ol className="divide-y divide-line md:hidden" aria-label={diagram.title}>
        {diagram.steps.map((step, i) => (
          <li key={`${step.label}-${i}`} className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-3 px-4 py-3">
            <span className="pt-[2px] font-mono text-[10.5px] tracking-[0.08em] text-subtle">{String(i + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <p className="font-mono text-[10px] leading-[1.5] tracking-[0.1em] text-subtle uppercase">
                {actorLabel(step.from)}
                {step.from !== step.to && (
                  <>
                    <span aria-hidden="true"> → </span>
                    <span className="sr-only"> to </span>
                    {actorLabel(step.to)}
                  </>
                )}
                {TONE_LABEL[step.tone] && <span className="ml-2" style={{ color: STROKE[step.tone] }}>· {TONE_LABEL[step.tone]}</span>}
              </p>
              <p className="mt-1 text-[14px] leading-[1.55]" style={{ color: TEXT[step.tone] }}>
                {step.label}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <figcaption className="border-t border-line px-4 py-3 text-[12.5px] leading-[1.6] text-subtle sm:px-5">
        {diagram.caption}
        {diagram.source && (
          <span className="mt-1 block font-mono text-[10.5px] tracking-[0.04em] break-all text-quiet">
            <span className="text-lime uppercase">Source</span>
            <span aria-hidden="true" className="text-line-2">
              {" · "}
            </span>
            {diagram.source}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
