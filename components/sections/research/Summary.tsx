import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { FACT_SOURCE, research } from "@/lib/content";
import { splitKicker } from "./shared";

const s = research.summary;

/** In-page index, built from each section's id and kicker. */
const SECTIONS = [research.nav2, research.toy, research.crossSystem, research.mqtt, research.limitations, research.reproducibility, research.methodology];

const COLUMNS = [
  { key: "demonstrated", ...s.demonstrated, mark: "solid" },
  { key: "unproven", ...s.unproven, mark: "steel" },
  { key: "next", ...s.next, mark: "dashed" },
] as const;

/**
 * Executive summary, first on /research (BRIEF section 6): demonstrated / not yet proven / testing next.
 * The page header already carries the summary title, so this section is headed by its kicker only.
 */
export default function Summary() {
  const [label, index] = splitKicker(s.kicker);
  return (
    <Section id="summary" aria-labelledby="summary-title" className="py-[64px] md:py-[96px]">
      <Reveal immediate>
        <h2 id="summary-title" className="label-mono text-lime">
          {label}
          {index && (
            <>
              <span aria-hidden="true"> / </span>
              <span className="sr-only">, section </span>
              {index}
            </>
          )}
        </h2>
      </Reveal>

      <Reveal immediate className="hairline-grid mt-8 grid-cols-1 md:grid-cols-3">
        {COLUMNS.map((c) => (
          <div key={c.key} className={cn("flex flex-col p-6 sm:p-8", c.key === "demonstrated" ? "bg-surface" : "bg-bg")}>
            <h3 className="flex items-center gap-3 text-[18px] font-semibold tracking-[-0.02em] text-text">
              <span
                aria-hidden="true"
                className={cn(
                  "inline-block size-[9px] shrink-0",
                  c.mark === "solid" && "bg-lime",
                  c.mark === "dashed" && "border border-dashed border-lime",
                  c.mark === "steel" && "border border-dashed border-[#7d8c8a]",
                )}
              />
              {c.label}
            </h3>
            <ul className="mt-6 space-y-4">
              {c.items.map((x) => (
                <li key={x} className="flex gap-3 text-[15px] leading-[1.65] text-muted">
                  <span aria-hidden="true" className="mt-[12px] h-px w-3 shrink-0 bg-line-2" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>

      <Reveal immediate className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <p className="max-w-[560px] font-mono text-[10.5px] leading-[1.7] tracking-[0.04em] text-[#8a9894]">
          <span className="text-lime uppercase">As of {FACT_SOURCE.commitShort}</span>
          <span aria-hidden="true" className="text-line-2">
            {" · "}
          </span>
          {s.asOf}
        </p>
        <nav aria-label="On this page">
          <ol className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10.5px] tracking-[0.1em] uppercase lg:justify-end">
            {SECTIONS.map((x) => {
              const [name, n] = splitKicker(x.kicker);
              return (
                <li key={x.id}>
                  <a
                    href={`#${x.id}`}
                    className="inline-flex min-h-8 items-center gap-1.5 text-muted underline decoration-line-2 underline-offset-4 transition-colors duration-200 hover:text-lime hover:decoration-lime"
                  >
                    {n && <span className="text-subtle">{n}</span>}
                    {name}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </Reveal>
    </Section>
  );
}
