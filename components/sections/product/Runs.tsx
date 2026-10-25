import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { product } from "@/lib/content";
import { SECTION_PAD, SectionIntro, mono, pad } from "../technology/shared";

/**
 * 002 What Ordinum runs, with the page's ONE compact architecture diagram: a four-column flow
 * (your system -> adapter -> Ordinum engine -> you receive). Server-rendered; the columns are an
 * ordered list, so the flow reads without the arrows. Horizontal from lg, stacked below.
 */
export default function Runs() {
  const r = product.runs;
  const cols = r.diagram.columns;

  return (
    <Section id="runs" variant="charcoal" aria-labelledby="runs-title" className={SECTION_PAD}>
      <SectionIntro kicker={r.kicker} title={r.title} titleMuted={r.titleMuted} titleId="runs-title" lede={r.body} />

      <Reveal className="mt-12 md:mt-16" amount={0.1}>
        <figure className="border border-[#3c4749] bg-window p-4 sm:p-5 md:p-6">
          <figcaption className="sr-only">{r.diagram.ariaLabel}</figcaption>
          <ol className="grid gap-8 lg:grid-cols-4">
            {cols.map((col, i) => {
              const engine = col.id === "engine";
              const last = i === cols.length - 1;
              return (
                <li key={col.id} className="relative flex min-w-0">
                  <div
                    className={cn(
                      "relative flex-1 p-4 sm:p-5",
                      engine ? "border border-lime/40 bg-surface" : "border border-line-2",
                    )}
                  >
                    {engine && (
                      <div aria-hidden="true" className="grid-bg-flat pointer-events-none absolute inset-0" />
                    )}
                    <p className={cn(mono, "relative flex items-baseline gap-2", engine ? "text-lime" : "text-subtle")}>
                      <span className="text-lime">{pad(i + 1)}</span>
                      {col.label}
                    </p>
                    <ul className="relative mt-4 space-y-2">
                      {col.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[14px] leading-[1.45] text-text">
                          <span
                            aria-hidden="true"
                            className={cn("mt-[6px] size-[5px] shrink-0", engine ? "bg-lime" : "border border-subtle")}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {!last && (
                    <span
                      aria-hidden="true"
                      className="absolute top-full left-0 flex h-8 w-full items-center justify-center text-subtle lg:top-0 lg:left-full lg:h-full lg:w-8"
                    >
                      <span className="font-mono text-[13px] lg:hidden">↓</span>
                      <span className="hidden font-mono text-[13px] lg:inline">→</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </figure>
      </Reveal>
    </Section>
  );
}
