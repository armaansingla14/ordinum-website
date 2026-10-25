import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
// Types only: this module is imported by client visuals, so it must not pull lib/content.ts into the bundle.
import type { EvidenceClass } from "@/lib/content";
import type { EvidenceLabel } from "@/lib/evidence";

/* Small presentational primitives shared by the research sections and the evidence visuals. */

/** Artifact label (lib/evidence.ts) -> site evidence class (same mapping as evidenceClassOf in lib/content.ts). */
const ARTIFACT_CLASS: Record<EvidenceLabel, EvidenceClass> = {
  "normal-behavior": "expected-behavior",
  "positive-control": "positive-control",
  "harness-artifact": "harness-artifact",
  "verified-defect": "verified-defect",
};

/** Small mono tag with a 1px border. */
export function Tag({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "lime" | "orange" | "quiet";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border px-2 py-[3px] font-mono text-[10px] leading-[1.5] tracking-[0.1em] uppercase",
        tone === "neutral" && "border-line-2 text-text",
        tone === "lime" && "border-lime/60 text-lime",
        tone === "orange" && "border-orange/60 text-orange",
        tone === "quiet" && "border-line text-subtle",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Glyph per evidence class, so labels are distinguishable without relying on colour.
 * "Real external target" describes the system, so the glyph of a combined label is the result class.
 */
const CLASS_GLYPH: Record<EvidenceClass, string> = {
  "real-external-target": "□",
  "expected-behavior": "○",
  "positive-control": "◇",
  "harness-artifact": "△",
  unresolved: "?",
  "verified-defect": "●",
};

/** Evidence chip for a result: precomputed label text ("Real external target · Harness artifact"). */
export function ClassChip({
  classes,
  label,
  className,
}: {
  classes: readonly EvidenceClass[];
  /** Rendered text, e.g. LabeledResult.label. */
  label: string;
  className?: string;
}) {
  const outcome = classes.find((c) => c !== "real-external-target") ?? classes[0];
  const defect = outcome === "verified-defect";
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-start gap-2 border px-2.5 py-1.5 font-mono text-[10px] leading-[1.5] tracking-[0.08em] uppercase",
        outcome === undefined ? "border-line text-subtle" : defect ? "border-orange/60 text-orange" : "border-line-2 text-text",
        className,
      )}
    >
      <span aria-hidden="true" className="text-subtle">
        {outcome === undefined ? "–" : CLASS_GLYPH[outcome]}
      </span>
      <span className="min-w-0">
        <span className="sr-only">Evidence label: </span>
        {label}
      </span>
    </span>
  );
}

/**
 * Evidence badge keyed by the artifact label stored in lib/evidence.ts. `text` is what is shown
 * (use the site vocabulary, e.g. "Real external target · Harness artifact").
 */
export function EvidenceBadge({ label, text, className }: { label: EvidenceLabel; text: string; className?: string }) {
  return <ClassChip classes={[ARTIFACT_CLASS[label]]} label={text} className={className} />;
}

/** k-of-n replay outcome as n squares: filled orange = the violation reproduced, hollow = it did not. */
export function ReplayDots({ failures, trials, className }: { failures: number; trials: number; className?: string }) {
  return (
    <span
      role="img"
      aria-label={`Violation reproduced in ${failures} of ${trials} replays`}
      className={cn("inline-flex gap-[3px]", className)}
    >
      {Array.from({ length: trials }, (_, i) => (
        <span
          key={i}
          className={cn("block size-[8px]", i < failures ? "bg-orange" : "border border-[#5d6b6c]")}
        />
      ))}
    </span>
  );
}

/** Mono provenance line: "REAL TRACE · docs/demo/..." */
export function Provenance({ kind, children, className }: { kind: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[10.5px] leading-[1.7] tracking-[0.06em] text-[#8a9894] break-words", className)}>
      <span className="text-lime uppercase">{kind}</span>
      <span aria-hidden="true" className="text-line-2">
        {" · "}
      </span>
      <span className="sr-only">: </span>
      {children}
    </p>
  );
}
