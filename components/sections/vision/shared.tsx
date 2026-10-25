import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { MATURITY_LABELS, type Maturity } from "@/lib/content";
import { MaturityMarker } from "@/components/ui/MaturityMarker";

/*
 * Small helpers shared by /vision and /about. The maturity marker follows the site-wide
 * convention (lib/content.ts, Maturity): validated = solid lime, experimental = outlined lime,
 * in progress = dashed lime, planned = dashed steel. Shape differs per level, so status never
 * relies on color alone.
 */

/** "THE AMBITION / 001" -> ["THE AMBITION", "001"] */
export function splitLabel(s: string): [string, string | undefined] {
  const at = s.lastIndexOf(" / ");
  return at === -1 ? [s, undefined] : [s.slice(0, at), s.slice(at + 3)];
}

export const pad = (n: number) => String(n).padStart(2, "0");

/** Numbered section head: kicker + h2 on the left, optional lede on the right. */
export function SectionIntro({
  kicker,
  title,
  titleMuted,
  titleId,
  lede,
  className,
}: {
  kicker: string;
  title: string;
  titleMuted?: string;
  titleId: string;
  lede?: ReactNode;
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
      {lede && <p className="max-w-[540px] text-[16px] leading-[1.8] text-muted md:text-[17px]">{lede}</p>}
    </Reveal>
  );
}

/** Mono chip: marker + label (defaults to the canonical maturity label). */
export function MaturityChip({
  maturity,
  label,
  className,
}: {
  maturity: Maturity;
  label?: string;
  className?: string;
}) {
  const lime = maturity !== "planned";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 border px-[7px] py-[4px] font-mono text-[10px] leading-none tracking-[0.12em] whitespace-nowrap uppercase",
        lime ? "text-lime" : "text-muted",
        maturity === "validated" && "border-lime/45",
        maturity === "experimental" && "border-lime/30",
        maturity === "in-progress" && "border-dashed border-lime/60",
        maturity === "planned" && "border-dashed border-line-2",
        className,
      )}
    >
      <MaturityMarker maturity={maturity} />
      {label ?? MATURITY_LABELS[maturity]}
    </span>
  );
}

export { MaturityMarker };
