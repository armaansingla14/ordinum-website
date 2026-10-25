import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import { MaturityMarker } from "@/components/ui/MaturityMarker";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { MATURITY_LABELS, integration, type IntegrationId, type LabeledResult, type Maturity } from "@/lib/content";
import { ClassChip } from "./badges";

/** "TOY BENCHMARK / 002" -> ["TOY BENCHMARK", "002"] */
export function splitKicker(s: string): [string, string | undefined] {
  const i = s.lastIndexOf(" / ");
  return i === -1 ? [s, undefined] : [s.slice(0, i), s.slice(i + 3)];
}

/** Numbered section head: mono kicker, h2 with muted continuation, optional lede and aside. */
export function SectionHead({
  kicker,
  title,
  titleMuted,
  lede,
  id,
  aside,
  immediate,
}: {
  kicker: string;
  title: string;
  titleMuted?: string;
  lede?: ReactNode;
  /** id of the h2, for aria-labelledby on the section. */
  id: string;
  aside?: ReactNode;
  /** Server-render visible (first section on the page). */
  immediate?: boolean;
}) {
  const [label, index] = splitKicker(kicker);
  return (
    <Reveal immediate={immediate} className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
      <div className={cn(aside ? "lg:col-span-7" : "lg:col-span-9")}>
        <Kicker index={index}>{label}</Kicker>
        <Heading id={id} muted={titleMuted} className="mt-6">
          {title}
        </Heading>
        {lede && <p className="mt-7 max-w-[680px] text-[16px] leading-[1.75] text-muted md:text-[17px]">{lede}</p>}
      </div>
      {aside && <div className="lg:col-span-5">{aside}</div>}
    </Reveal>
  );
}

/** Mono h3 used for sub-blocks inside a research section. */
export function SubHead({ children, id, className }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <h3 id={id} className={cn("label-mono text-subtle", className)}>
      {children}
    </h3>
  );
}

/**
 * Integration maturity marker (CLAUDE.md): validated = solid lime, experimental = outlined lime,
 * in progress = dashed lime, planned = dashed steel. Label text is MATURITY_LABELS verbatim.
 * Server-side only (reads lib/content.ts); client visuals use badges.tsx.
 */
export function MaturityMark({ maturity, note, className }: { maturity: Maturity; note?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[10px] leading-[1.4] tracking-[0.12em] uppercase",
        maturity === "planned" ? "text-subtle" : "text-lime",
        className,
      )}
    >
      <MaturityMarker maturity={maturity} />
      <span>
        {MATURITY_LABELS[maturity]}
        {note && <span className="text-subtle"> · {note}</span>}
      </span>
    </span>
  );
}

/** Section-head aside for a target: maturity marker plus what kind of system it is. */
export function TargetAside({ id }: { id: IntegrationId }) {
  const i = integration(id);
  return (
    <div className="flex flex-col gap-3 border border-line bg-surface p-5 lg:ml-auto lg:max-w-[360px]">
      <p className="text-[14px] font-semibold tracking-[-0.01em] text-text">{i.name}</p>
      <MaturityMark maturity={i.maturity} note={i.maturityNote} />
      {i.targetKind && <p className="font-mono text-[10.5px] tracking-[0.08em] text-subtle uppercase">{i.targetKind}</p>}
    </div>
  );
}

/** Labeled results: what was run, what happened, and the evidence chip. Every result carries one. */
export function ResultList({ results, id }: { results: readonly LabeledResult[]; id?: string }) {
  return (
    <Reveal as="ul" aria-labelledby={id} amount={0.1} className="mt-4 border-t border-line">
      {results.map((r) => (
        <li
          key={r.what}
          className="grid grid-cols-1 gap-x-8 gap-y-3 border-b border-line py-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)_minmax(0,1fr)] md:items-start"
        >
          <p className="text-[15px] font-semibold leading-[1.45] tracking-[-0.01em] text-text">{r.what}</p>
          <p className="text-[14.5px] leading-[1.65] text-muted">{r.result}</p>
          <div className="md:justify-self-end">
            {r.classes.length > 0 ? (
              <ClassChip classes={r.classes} label={r.label} />
            ) : (
              /* Not an evidence class (e.g. an infrastructure error): plain text, never badge-styled. */
              <p className="text-[13px] leading-[1.5] text-subtle italic">{r.label}</p>
            )}
          </div>
        </li>
      ))}
    </Reveal>
  );
}

/** Plain bullet list; `mark` matches the status vocabulary (solid = shown, dashed = not shown). */
export function Bullets({
  items,
  mark = "rule",
  className,
}: {
  items: readonly string[];
  mark?: "rule" | "solid" | "dashed";
  className?: string;
}) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((x) => (
        <li key={x} className="flex gap-3 text-[15px] leading-[1.65] text-text">
          <span
            aria-hidden="true"
            className={cn(
              "shrink-0",
              mark === "rule" && "mt-[12px] h-px w-3 bg-line-2",
              mark === "solid" && "mt-[8px] size-[7px] bg-lime",
              mark === "dashed" && "mt-[8px] size-[7px] border border-dashed border-[#7d8c8a]",
            )}
          />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}
