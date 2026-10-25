import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { MaturityMark } from "@/components/visuals/pipeline/maturity";
import { MATURITY_LABELS, type Maturity } from "@/lib/content";

/*
 * Home-page helpers. The maturity chip follows the CLAUDE.md marker rules (see
 * components/visuals/pipeline/maturity.tsx); it could move to a shared ui primitive.
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
    <Reveal className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-12 xl:gap-16">
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

/** Mono maturity chip. Marker shape, border and text all differ per level, so it never relies on color alone. */
export function MaturityChip({ maturity, className }: { maturity: Maturity; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 border px-[7px] py-[4px] font-mono text-[10px] leading-none tracking-[0.12em] whitespace-nowrap uppercase",
        maturity === "validated" && "border-lime/50 bg-lime/[0.06] text-lime",
        maturity === "experimental" && "border-lime/35 text-lime",
        maturity === "in-progress" && "border-dashed border-lime/50 text-lime/85",
        maturity === "planned" && "border-dashed border-line-2 text-subtle",
        className,
      )}
    >
      <MaturityMark maturity={maturity} />
      {MATURITY_LABELS[maturity]}
    </span>
  );
}

/** Mono arrow link ("SEE THE FULL WALKTHROUGH →"). */
export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime uppercase underline-offset-4 hover:underline",
        className,
      )}
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </Link>
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
