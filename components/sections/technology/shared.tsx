import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { MATURITY_LABELS, MATURITY_ORDER, type Maturity } from "@/lib/content";
import { MaturityMarker } from "@/components/ui/MaturityMarker";

/*
 * Helpers shared by the /product and /technology sections (both import from here).
 * Maturity vocabulary (lib/content.ts MATURITY_LABELS), never shown as counts or ratios:
 *   validated    "Built & validated"   solid lime square
 *   experimental "Built, experimental" lime outline with a lime core
 *   in-progress  "In progress"         dashed lime outline, half filled
 *   planned      "Planned"             dashed steel outline
 * The marker shape differs per level and the label text is always rendered next to it,
 * so maturity never relies on colour alone.
 */

/** "ARCHITECTURE / 001" -> ["ARCHITECTURE", "001"] */
export function splitLabel(s: string): [string, string | undefined] {
  const at = s.lastIndexOf(" / ");
  return at === -1 ? [s, undefined] : [s.slice(0, at), s.slice(at + 3)];
}

export const pad = (n: number) => String(n).padStart(2, "0");

export const mono = "font-mono text-[10px] leading-none tracking-[0.13em] uppercase";

/** Tighter rhythm than the default Section padding: these pages stack many sections. */
export const SECTION_PAD = "py-[64px] md:py-[100px]";

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
        "grid gap-7 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12 xl:gap-16",
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
          {lede && <p className="text-[16px] leading-[1.75] text-muted md:text-[17px]">{lede}</p>}
          {aside && <div className={cn(lede && "mt-6")}>{aside}</div>}
        </div>
      )}
    </Reveal>
  );
}

/** Mono maturity chip: marker + exact label (+ optional qualifier, e.g. "exploratory pilot"). */
export function MaturityChip({
  maturity,
  note,
  className,
}: {
  maturity: Maturity;
  note?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full shrink-0 items-center gap-2 border px-[7px] py-[5px] font-mono text-[10px] leading-[1.2] tracking-[0.12em] uppercase",
        maturity === "validated" && "border-lime/45 text-lime",
        maturity === "experimental" && "border-lime/35 text-lime",
        maturity === "in-progress" && "border-dashed border-lime/50 text-lime",
        maturity === "planned" && "border-dashed border-line-2 text-muted",
        className,
      )}
    >
      <MaturityMarker maturity={maturity} />
      <span className="min-w-0">
        {MATURITY_LABELS[maturity]}
        {note && <span className="text-subtle normal-case tracking-[0.04em]"> · {note}</span>}
      </span>
    </span>
  );
}

/** Inline legend of the four maturity labels (no counts). */
export function MaturityLegend({
  only,
  className,
}: {
  /** Restrict to the levels actually shown. Defaults to all four. */
  only?: readonly Maturity[];
  className?: string;
}) {
  const levels = MATURITY_ORDER.filter((m) => !only || only.includes(m));
  return (
    <ul aria-label="Maturity labels" className={cn("flex flex-wrap items-center gap-x-5 gap-y-3", className)}>
      {levels.map((m) => (
        <li
          key={m}
          className={cn(mono, "flex items-center gap-2", m === "planned" ? "text-muted" : "text-lime")}
        >
          <MaturityMarker maturity={m} />
          {MATURITY_LABELS[m]}
        </li>
      ))}
    </ul>
  );
}

/** Box treatment for a node of a given maturity. */
export function maturityBox(maturity: Maturity) {
  return cn(
    maturity === "validated" && "border border-lime/35 bg-surface",
    maturity === "experimental" && "border border-lime/20 bg-surface/70",
    maturity === "in-progress" && "border border-dashed border-lime/40 bg-surface/40",
    maturity === "planned" && "border border-dashed border-line-2 bg-transparent",
  );
}

/** Mono tag ("SCHEMATIC", provenance). */
export function MonoTag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-line-2 bg-window px-[7px] py-[5px] font-mono text-[10px] leading-none tracking-[0.12em] text-muted uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Quiet caveat line with a hairline rule on the left. */
export function Caveat({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("border-l border-line-2 pl-4 text-[13.5px] leading-[1.65] text-subtle", className)}>
      {children}
    </p>
  );
}

/** Native disclosure with the site's mono summary. Content is in the static HTML. */
export function Disclosure({
  summary,
  children,
  className,
}: {
  summary: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={cn("group/disc", className)}>
      <summary
        className={cn(
          mono,
          "inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-muted transition-colors hover:text-lime [&::-webkit-details-marker]:hidden",
        )}
      >
        <span aria-hidden="true" className="inline-block w-3 text-lime group-open/disc:hidden">
          +
        </span>
        <span aria-hidden="true" className="hidden w-3 text-lime group-open/disc:inline-block">
          −
        </span>
        {summary}
      </summary>
      <div className="pt-2 pb-1">{children}</div>
    </details>
  );
}

export { MaturityMarker };
