import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { STATUS_LABELS, type Status } from "@/lib/content";

/** "ARCHITECTURE / 001" -> ["ARCHITECTURE", "001"] */
export function splitLabel(s: string): [string, string | undefined] {
  const at = s.lastIndexOf(" / ");
  return at === -1 ? [s, undefined] : [s.slice(0, at), s.slice(at + 3)];
}

export const pad = (n: number) => String(n).padStart(2, "0");

export const STATUS_ORDER = [
  "implemented",
  "in-development",
  "planned",
] as const satisfies readonly Status[];

export function countStatus(
  items: readonly { status: Status }[],
  status: Status,
) {
  return items.filter((i) => i.status === status).length;
}

/** Numbered section head: kicker + h2 on the left, lede (and optional aside) on the right. */
export function SectionIntro({
  kicker,
  title,
  titleMuted,
  titleId,
  lede,
  aside,
  className,
}: {
  kicker: string;
  title: string;
  titleMuted?: string;
  titleId: string;
  lede?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  const [label, index] = splitLabel(kicker);
  return (
    <Reveal
      className={cn(
        "grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12 xl:gap-16",
        className,
      )}
    >
      <div>
        <Kicker index={index}>{label}</Kicker>
        <Heading id={titleId} muted={titleMuted} className="mt-6 max-w-[18ch]">
          {title}
        </Heading>
      </div>
      {(lede || aside) && (
        <div className="max-w-[540px]">
          {lede && (
            <p className="text-[16px] leading-[1.8] text-muted md:text-[17px]">
              {lede}
            </p>
          )}
          {aside && <div className={cn(lede && "mt-6")}>{aside}</div>}
        </div>
      )}
    </Reveal>
  );
}

/**
 * Square status marker; shape differs per status so it never relies on color alone.
 * implemented = solid lime; in-development = outlined lime; planned = dashed steel.
 * SVG so the dashes render reliably at this size.
 */
export function StatusMarker({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 9 9"
      className={cn("size-[9px] shrink-0", className)}
    >
      {status === "implemented" && (
        <rect x="0" y="0" width="9" height="9" className="fill-lime" />
      )}
      {status === "in-development" && (
        <>
          <rect
            x="0.5"
            y="0.5"
            width="8"
            height="8"
            fill="none"
            className="stroke-lime"
            strokeWidth="1"
          />
          <rect x="3" y="3" width="3" height="3" className="fill-lime" />
        </>
      )}
      {status === "planned" && (
        <rect
          x="0.5"
          y="0.5"
          width="8"
          height="8"
          fill="none"
          className="stroke-subtle"
          strokeWidth="1"
          strokeDasharray="2 1.5"
        />
      )}
    </svg>
  );
}

/** Mono status chip (marker + label). */
export function StatusChip({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 border px-[7px] py-[4px] font-mono text-[10px] leading-none tracking-[0.12em] whitespace-nowrap uppercase",
        status === "implemented" && "border-lime/45 text-lime",
        status === "in-development" && "border-dashed border-lime/60 text-lime",
        status === "planned" && "border-dashed border-line-2 text-muted",
        className,
      )}
    >
      <StatusMarker status={status} />
      {STATUS_LABELS[status]}
    </span>
  );
}

/** Box treatment for a node/card of a given status. */
export function statusBox(status: Status) {
  return cn(
    status === "implemented" && "border border-lime/35 bg-surface",
    status === "in-development" &&
      "border border-dashed border-lime/55 bg-surface/60",
    status === "planned" && "border border-dashed border-line-2 bg-transparent",
  );
}

/** Mono "CONCEPTUAL" / provenance tag. */
export function MonoTag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-line-2 bg-window px-[7px] py-[4px] font-mono text-[10px] leading-none tracking-[0.12em] text-muted uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
