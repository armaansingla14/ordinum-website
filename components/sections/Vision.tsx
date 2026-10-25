import type { SectionVariant } from "@/components/ui/Section";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { MATURITY_LABELS, MATURITY_ORDER, vision, type Maturity } from "@/lib/content";
import { MaturityChip, MaturityMarker, SectionIntro } from "./vision/shared";

/** "Under way. Parts are built; ..." -> ["Under way", "Parts are built; ..."] */
function splitNote(note: string): [string, string | undefined] {
  const at = note.indexOf(". ");
  const head = (at === -1 ? note : note.slice(0, at)).replace(/\.$/, "");
  const rest = at === -1 ? undefined : note.slice(at + 2).trim() || undefined;
  return [head, rest];
}

/**
 * "Core engine and ROS 2 / Nav2: built & validated" -> text + maturity, when the suffix is one
 * of the four canonical labels. Items without a label take the phase's fallback (planned).
 */
function parseItem(item: string, fallback: Maturity): { text: string; maturity: Maturity; labelled: boolean } {
  const at = item.lastIndexOf(": ");
  if (at !== -1) {
    const suffix = item.slice(at + 2).trim().toLowerCase();
    const match = MATURITY_ORDER.find((m) => MATURITY_LABELS[m].toLowerCase() === suffix);
    if (match) return { text: item.slice(0, at), maturity: match, labelled: true };
  }
  return { text: item, maturity: fallback, labelled: false };
}

/**
 * /vision 02: three phases on a progression rail (vertical on mobile, horizontal on desktop).
 * Only the initial phase has built parts; each built part carries its own canonical maturity
 * label, so "under way" never reads as "done". id="vision" is kept for old /#vision links
 * (components/layout/HashRedirect).
 */
export default function Vision({ variant = "charcoal" }: { variant?: SectionVariant } = {}) {
  const { phases } = vision;
  const count = phases.items.length;

  return (
    <Section id="vision" variant={variant} aria-labelledby="phases-title">
      <SectionIntro kicker={phases.kicker} title={phases.title} titleId="phases-title" />

      <Reveal as="ol" stagger={0.1} amount={0.15} className="mt-14 grid md:mt-20 lg:grid-cols-3">
        {phases.items.map((p, i) => {
          const active = p.maturity !== "planned";
          const isLast = i === count - 1;
          const [chip, detail] = splitNote(p.statusNote);
          return (
            <RevealItem as="li" key={p.n} className="relative pb-12 pl-9 last:pb-0 lg:pb-0 lg:pl-0">
              {/* Progression rail */}
              <div
                aria-hidden="true"
                className="absolute top-0 bottom-0 left-0 w-[13px] lg:static lg:flex lg:h-[13px] lg:w-auto lg:items-center"
              >
                <span className="absolute top-[2px] left-0 lg:static">
                  <span
                    className={cn(
                      "block size-[13px]",
                      active ? "border border-lime bg-charcoal p-[3px]" : "border border-dashed border-line-2 bg-charcoal",
                    )}
                  >
                    {active && <span className="block size-full bg-lime" />}
                  </span>
                </span>
                <span
                  className={cn(
                    "absolute top-[22px] bottom-[-2px] left-[6px] w-0 border-l border-dashed border-line-2 lg:static lg:mx-3 lg:h-0 lg:w-auto lg:flex-1 lg:border-t lg:border-l-0",
                    isLast && "hidden lg:block",
                  )}
                />
              </div>

              <article
                aria-labelledby={`phase-${p.n}`}
                className={cn("lg:mt-9 lg:border-l lg:pr-10 lg:pl-8 xl:pr-12", active ? "lg:border-lime/40" : "lg:border-line")}
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                  <p className={cn("label-mono flex items-center gap-3", active ? "text-lime" : "text-muted")}>
                    <span>{p.n}</span>
                    <span aria-hidden="true" className={active ? "text-lime/60" : "text-subtle"}>
                      /
                    </span>
                    <span>{p.name}</span>
                  </p>
                  <MaturityChip maturity={p.maturity} label={chip} />
                </div>
                <h3
                  id={`phase-${p.n}`}
                  className="mt-6 text-[22px] leading-[1.2] font-[550] tracking-title text-balance text-text md:text-[24px]"
                >
                  {p.title}
                </h3>
                <p className="mt-4 max-w-[440px] text-[15px] leading-[1.75] text-muted">{p.body}</p>
                <ul className="mt-7 border-t border-line">
                  {p.items.map((raw) => {
                    const item = parseItem(raw, "planned");
                    return (
                      <li
                        key={raw}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line py-3 text-[14px] leading-[1.5] tracking-[-0.01em] text-[#c3cbc9]"
                      >
                        <span className="flex items-baseline gap-3">
                          <MaturityMarker maturity={item.maturity} className="relative top-[1px] size-[7px]" />
                          {item.text}
                        </span>
                        {item.labelled && (
                          <span className="pl-[19px] font-mono text-[10px] tracking-[0.1em] text-lime uppercase">
                            {MATURITY_LABELS[item.maturity]}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {detail && <p className="mt-4 text-[13px] leading-[1.6] text-subtle">{detail}</p>}
              </article>
            </RevealItem>
          );
        })}
      </Reveal>
    </Section>
  );
}
