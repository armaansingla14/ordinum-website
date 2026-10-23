import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { STATUS_LABELS, type Status } from "@/lib/content";

/*
 * Home-page helpers. The status marker/chip mirror components/sections/product/shared.tsx so
 * every page reads the same; they should move to a shared ui primitive at integration.
 */

/** "THE PROBLEM / 001" -> ["THE PROBLEM", "001"] */
export function splitLabel(s: string): [string, string | undefined] {
  const at = s.lastIndexOf(" / ");
  return at === -1 ? [s, undefined] : [s.slice(0, at), s.slice(at + 3)];
}

/** Numbered kicker + h2 with muted continuation; optional lede on the right from lg up. */
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
  aside?: ReactNode;
}) {
  const [label, index] = splitLabel(kicker);
  return (
    <Reveal className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12 xl:gap-16">
      <div>
        <Kicker index={index}>{label}</Kicker>
        <Heading id={titleId} muted={titleMuted} className="mt-6">
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
 * implemented = solid lime; in development = dashed lime outline; planned = dashed steel outline.
 */
export function StatusMarker({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-[7px] shrink-0",
        status === "implemented" && "bg-lime",
        status === "in-development" && "border border-dashed border-lime",
        status === "planned" && "border border-dashed border-subtle",
        className,
      )}
    />
  );
}

/** Mono status chip. Shape, border and color all differ per status, so it never relies on color alone. */
export function StatusChip({ status, label, className }: { status: Status; label?: string; className?: string }) {
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
      {label ?? STATUS_LABELS[status]}
    </span>
  );
}

/** Small mono tag, e.g. "Conceptual". */
export function MonoTag({ children, className }: { children: ReactNode; className?: string }) {
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
