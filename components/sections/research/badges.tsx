import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Status } from "@/lib/content";
import type { EvidenceLabel } from "@/lib/evidence";

/* Small presentational primitives shared by the research sections and the evidence visuals. */

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
 * Status marker used across the site:
 * implemented = solid lime square, in development = outlined lime (dashed), planned = dashed steel.
 */
export function StatusMark({ status, label }: { status: Status; label?: string }) {
  const text =
    label ?? (status === "implemented" ? "Implemented" : status === "in-development" ? "In development" : "Planned");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[10px] leading-none tracking-[0.12em] uppercase",
        status === "planned" ? "text-subtle" : "text-lime",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block size-[9px] shrink-0",
          status === "implemented" && "bg-lime",
          status === "in-development" && "border border-dashed border-lime",
          status === "planned" && "border border-dashed border-[#7d8c8a]",
        )}
      />
      {text}
    </span>
  );
}

/** Glyph per evidence label, so labels are distinguishable without relying on colour. */
const LABEL_STYLE: Record<EvidenceLabel, { glyph: string; className: string }> = {
  "normal-behavior": { glyph: "○", className: "border-line-2 text-text" },
  "positive-control": { glyph: "◇", className: "border-line-2 text-text" },
  "harness-artifact": { glyph: "△", className: "border-line-2 text-text" },
  "verified-defect": { glyph: "●", className: "border-orange/60 text-orange" },
};

/** Evidence classification badge (BRIEF 4.6 labels). Always rendered with its full text. */
export function EvidenceBadge({ label, text, className }: { label: EvidenceLabel; text: string; className?: string }) {
  const s = LABEL_STYLE[label];
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-start gap-2 border px-2.5 py-1.5 font-mono text-[10px] leading-[1.5] tracking-[0.08em] uppercase",
        s.className,
        className,
      )}
    >
      <span aria-hidden="true" className="text-subtle">
        {s.glyph}
      </span>
      <span className="min-w-0">
        <span className="sr-only">Classification: </span>
        {text}
      </span>
    </span>
  );
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
