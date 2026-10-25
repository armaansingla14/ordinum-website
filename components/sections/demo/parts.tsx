import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import { cn } from "@/lib/cn";
import type { EvidenceClass } from "@/lib/content";

/* Small presentational pieces used only by the /demo sections. Server-safe (no hooks). */

/** "WALKTHROUGH / 001" -> ["WALKTHROUGH", "001"] */
function splitKicker(s: string): [string, string | undefined] {
  const i = s.lastIndexOf(" / ");
  return i === -1 ? [s, undefined] : [s.slice(0, i), s.slice(i + 3)];
}

export function DemoSectionHead({
  id,
  kicker,
  title,
  titleMuted,
  lede,
}: {
  id: string;
  kicker: string;
  title: string;
  titleMuted?: string;
  lede?: ReactNode;
}) {
  const [label, index] = splitKicker(kicker);
  return (
    <div className="max-w-[860px]">
      <Kicker index={index}>{label}</Kicker>
      <Heading id={id} muted={titleMuted} className="mt-6">
        {title}
      </Heading>
      {lede && <p className="mt-6 max-w-[680px] text-[16px] leading-[1.75] text-muted md:text-[17px]">{lede}</p>}
    </div>
  );
}

/** Glyph per evidence class, so classes are distinguishable without colour. */
const GLYPH: Record<EvidenceClass, string> = {
  "real-external-target": "□",
  "positive-control": "◇",
  "harness-artifact": "△",
  "expected-behavior": "○",
  unresolved: "?",
  "verified-defect": "●",
};

/** Evidence label as published in lib/content.ts, with one glyph per class it combines. */
export function EvidenceLabel({
  text,
  classes,
  size = "sm",
  className,
}: {
  text: string;
  classes: readonly EvidenceClass[];
  size?: "sm" | "lg";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex max-w-full items-start gap-3 border border-line-2 bg-window font-mono uppercase text-text",
        size === "lg" ? "px-4 py-3 text-[11.5px] leading-[1.55] tracking-[0.08em] sm:text-[12px]" : "px-2.5 py-1.5 text-[10px] leading-[1.5] tracking-[0.08em]",
        className,
      )}
    >
      <span aria-hidden="true" className="shrink-0 text-subtle">
        {classes.map((c) => GLYPH[c]).join(" ")}
      </span>
      <span className="min-w-0">
        <span className="sr-only">Evidence classification: </span>
        {text}
      </span>
    </p>
  );
}

/** k-of-n replay outcome: filled orange = the violation reproduced, hollow = it did not. */
export function ReplaySquares({
  failures,
  trials,
  decorative = false,
}: {
  failures: number;
  trials: number;
  decorative?: boolean;
}) {
  return (
    <span
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : `Violation reproduced in ${failures} of ${trials} replays`}
      className="inline-flex gap-[3px]"
    >
      {Array.from({ length: trials }, (_, i) => (
        <span key={i} className={cn("block size-[8px]", i < failures ? "bg-orange" : "border border-[#5d6b6c]")} />
      ))}
    </span>
  );
}

/** Mono source line: "SOURCE · experiments/…/meta.json". */
export function SourceLine({ kind = "Source", children, className }: { kind?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[10.5px] leading-[1.7] tracking-[0.04em] break-all text-quiet", className)}>
      <span className="text-lime uppercase">{kind}</span>
      <span aria-hidden="true" className="text-line-2">
        {" · "}
      </span>
      <span className="sr-only">: </span>
      {children}
    </p>
  );
}
