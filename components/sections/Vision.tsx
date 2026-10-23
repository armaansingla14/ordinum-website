import type { SectionVariant } from "@/components/ui/Section";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { vision, type Status } from "@/lib/content";
import { SectionIntro, StatusChip, StatusMarker } from "./vision/shared";

/**
 * When each horizon sits, by position. UI labels only; status comes from content.ts.
 * TODO(content): move to vision.horizons.items[i].when.
 */
const WHEN = ["Today", "Next", "Long-term aspiration"] as const;

/** Rail marker: solid lime (built today), outlined (next), dashed (aspiration). */
function RailMarker({ index, status }: { index: number; status: Status }) {
  if (status === "implemented") {
    return (
      <span aria-hidden="true" className="relative grid size-[13px] place-items-center bg-lime shadow-[0_0_22px_rgb(193_226_158/0.55)]">
        <span className="size-[3px] bg-bg" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block size-[13px] bg-charcoal",
        index === 1 ? "border border-text/60" : "border border-dashed border-line-2",
      )}
    />
  );
}

/**
 * /vision 02: three horizons on a progression rail (vertical on mobile, horizontal on desktop).
 * Only the first is built; the other two carry a "Planned" chip and dashed markers.
 * id="vision" is kept for old /#vision links (components/layout/HashRedirect).
 */
export default function Vision({ variant = "charcoal" }: { variant?: SectionVariant } = {}) {
  const { horizons } = vision;
  const count = horizons.items.length;

  return (
    <Section id="vision" variant={variant} aria-labelledby="horizons-title">
      <SectionIntro kicker={horizons.kicker} title={horizons.title} titleId="horizons-title" />

      <Reveal as="ol" stagger={0.1} amount={0.15} className="mt-14 grid md:mt-20 lg:grid-cols-3">
        {horizons.items.map((h, i) => {
          const built = h.status === "implemented";
          const isLast = i === count - 1;
          const when = WHEN[i] ?? h.name;
          return (
            <RevealItem as="li" key={h.n} className="relative pb-12 pl-10 last:pb-0 lg:pb-0 lg:pl-0">
              {/* ---- Progression rail ---------------------------------------- */}
              <div
                aria-hidden="true"
                className="absolute top-0 bottom-0 left-0 w-[13px] lg:static lg:flex lg:h-[13px] lg:w-auto lg:items-center"
              >
                <span className="absolute top-[2px] left-0 lg:static">
                  <RailMarker index={i} status={h.status} />
                </span>
                {!isLast && (
                  <span
                    className={cn(
                      "absolute top-[22px] bottom-[-2px] left-[6px] w-0 border-l lg:static lg:mx-3 lg:h-0 lg:w-auto lg:flex-1 lg:border-t lg:border-l-0",
                      built ? "border-lime/60" : "border-dashed border-line-2",
                    )}
                  />
                )}
                {isLast && (
                  <span className="hidden lg:mx-3 lg:flex lg:flex-1 lg:items-center">
                    <span className="h-0 flex-1 border-t border-dashed border-line-2" />
                    <svg viewBox="0 0 8 10" className="h-2.5 w-2 text-line-2" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 1l5 4-5 4" />
                    </svg>
                  </span>
                )}
              </div>

              {/* ---- Horizon content ----------------------------------------- */}
              <article
                aria-labelledby={`horizon-${h.n}`}
                className={cn("lg:mt-9 lg:border-l lg:pr-10 lg:pl-8 xl:pr-12", built ? "lg:border-lime/50" : "lg:border-line")}
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                  <p className={cn("label-mono flex items-center gap-3", built ? "text-lime" : "text-muted")}>
                    <span>{h.n}</span>
                    <span aria-hidden="true" className={built ? "text-lime/60" : "text-subtle"}>
                      /
                    </span>
                    <span>{when}</span>
                  </p>
                  <StatusChip status={h.status} label={built ? "Built today" : undefined} />
                </div>
                <p className="mt-6 font-mono text-[11px] tracking-[0.1em] text-subtle uppercase">{h.name}</p>
                <h3
                  id={`horizon-${h.n}`}
                  className="mt-3 text-[24px] leading-[1.15] font-[550] tracking-title text-balance text-text md:text-[26px]"
                >
                  {h.title}
                </h3>
                <p className="mt-4 max-w-[420px] text-[15px] leading-[1.75] text-muted">{h.body}</p>
                <ul className="mt-7 border-t border-line">
                  {h.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-3 border-b border-line py-3 text-[14px] leading-[1.5] tracking-[-0.01em] text-[#c3cbc9]"
                    >
                      <StatusMarker status={h.status} className="relative top-[1px] size-[7px]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          );
        })}
      </Reveal>
    </Section>
  );
}

