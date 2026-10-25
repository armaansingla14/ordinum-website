import { technology } from "@/lib/content";
import { splitLabel } from "./shared";

const SECTIONS = [
  technology.architecture,
  technology.adapters,
  technology.contract,
  technology.faults,
  technology.reproduction,
  technology.safety,
  technology.limitations,
] as const;

/** Compact jump list of the seven sections, rendered under the page header. */
export default function OnThisPage() {
  return (
    <nav aria-label="On this page" className="mt-10 md:mt-12">
      <ol className="flex flex-wrap gap-x-1 gap-y-1">
        {SECTIONS.map((s) => {
          const [label, index] = splitLabel(s.kicker);
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="inline-flex min-h-11 items-center gap-2 border border-line px-3 font-mono text-[10px] tracking-[0.12em] text-muted uppercase transition-colors duration-200 hover:border-lime/60 hover:text-lime"
              >
                {index && <span className="text-lime">{index.slice(-2)}</span>}
                {label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
