import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { STATUS_LABELS, type Status } from "@/lib/content";

/** "THREE LAYERS / 002" -> ["THREE LAYERS", "002"] */
export function splitLabel(s: string): [string, string | undefined] {
  const at = s.lastIndexOf(" / ");
  return at === -1 ? [s, undefined] : [s.slice(0, at), s.slice(at + 3)];
}

export const pad = (n: number) => String(n).padStart(2, "0");

/** Kicker + h2 (with optional muted line) on the left, lede on the right. Same rhythm as the other sections. */
export function SectionIntro({
  kicker,
  title,
  titleMuted,
  titleId,
  lede,
  aside,
}: {
  kicker: string;
  title: string;
  titleMuted?: string;
  titleId: string;
  lede?: ReactNode;
  /** Extra content under the lede (legend, tags). */
  aside?: ReactNode;
}) {
  const [label, index] = splitLabel(kicker);
  return (
    <Reveal className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12 xl:gap-16">
      <div>
        <Kicker index={index}>{label}</Kicker>
        <Heading id={titleId} muted={titleMuted} className="mt-6 max-w-[17ch]">
          {title}
        </Heading>
      </div>
      {(lede || aside) && (
        <div className="max-w-[540px]">
          {lede && <p className="text-[16px] leading-[1.8] text-muted md:text-[17px]">{lede}</p>}
          {aside && <div className={cn(lede && "mt-6")}>{aside}</div>}
        </div>
      )}
    </Reveal>
  );
}

/**
 * Square status marker.
 * implemented = solid lime; in-development = outlined lime; planned = dashed steel.
 */
export function StatusMarker({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-[7px] shrink-0",
        status === "implemented" && "bg-lime",
        status === "in-development" && "border border-lime",
        status === "planned" && "border border-dashed border-[#7d8c8a]",
        className,
      )}
    />
  );
}

/** Mono status chip. Shape and color differ per status, so it never relies on color alone. */
export function StatusChip({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 border px-[7px] py-[4px] font-mono text-[10px] leading-none tracking-[0.12em] whitespace-nowrap uppercase",
        status === "implemented" && "border-lime/45 text-lime",
        status === "in-development" && "border-dashed border-lime/60 text-lime",
        status === "planned" && "border-dashed border-line-2 text-subtle",
        className,
      )}
    >
      <StatusMarker status={status} />
      {STATUS_LABELS[status]}
    </span>
  );
}

/** "In development" is left out: nothing on this page qualifies (see STATUS_LABELS in lib/content.ts). */
const LEGEND_ORDER = ["implemented", "planned"] as const satisfies readonly Status[];

/** Inline legend of the three statuses, plus an optional "Conceptual" tag. */
export function StatusLegend({ conceptual = false, className }: { conceptual?: boolean; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-3", className)}>
      {conceptual && (
        <span className="border border-line-2 bg-window px-[7px] py-[4px] font-mono text-[10px] leading-none tracking-[0.12em] text-muted uppercase">
          Conceptual
        </span>
      )}
      <ul aria-label="Status legend" className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {LEGEND_ORDER.map((s) => (
          <li key={s} className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-subtle uppercase">
            <StatusMarker status={s} />
            {STATUS_LABELS[s]}
          </li>
        ))}
      </ul>
    </div>
  );
}
