import type { SectionVariant } from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import Topline from "@/components/ui/Topline";
import { cn } from "@/lib/cn";
import { topline, vision, type PhaseLabel } from "@/lib/content";

/** "THE VISION / 008" -> ["THE VISION", "008"] */
function splitLabel(s: string): [string, string | undefined] {
  const at = s.lastIndexOf(" / ");
  return at === -1 ? [s, undefined] : [s.slice(0, at), s.slice(at + 3)];
}

/** "The goal: no autonomous ..." -> ["The goal", "No autonomous ..."] */
function splitClosing(s: string): [string | undefined, string] {
  const at = s.indexOf(": ");
  if (at === -1 || at > 24) return [undefined, s];
  const rest = s.slice(at + 2);
  return [s.slice(0, at), rest.charAt(0).toUpperCase() + rest.slice(1)];
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Timeline marker: solid lime (Today), outlined (Next), dashed (Tomorrow). */
function Marker({ label }: { label: PhaseLabel }) {
  if (label === "Today") {
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
        label === "Next" ? "border border-text/70" : "border border-dashed border-line-2",
      )}
    />
  );
}

export default function Vision({ variant = "charcoal" }: { variant?: SectionVariant } = {}) {
  const [kicker, index] = splitLabel(vision.kicker);
  const [lineIndex, lineLabel] = topline[7].split(" / ") as [string, string];
  const [closingLabel, closingText] = splitClosing(vision.closing);
  const count = vision.phases.length;

  return (
    <Section id="vision" variant={variant} aria-labelledby="vision-title" className="pt-0 md:pt-0">
      <Topline index={lineIndex} contained={false}>
        {lineLabel}
      </Topline>

      <Reveal className="mt-[64px] grid gap-8 md:mt-[100px] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12 xl:gap-16">
        <div>
          <Kicker index={index}>{kicker}</Kicker>
          <Heading id="vision-title" className="mt-6 max-w-[17ch]">
            {vision.title}
          </Heading>
        </div>
        <p className="max-w-[540px] text-[16px] leading-[1.8] text-muted md:text-[17px]">{vision.lede}</p>
      </Reveal>

      <Reveal as="ol" stagger={0.1} amount={0.15} className="mt-14 grid md:mt-20 lg:grid-cols-3">
        {vision.phases.map((phase, i) => {
          const isToday = phase.label === "Today";
          const isLast = i === count - 1;
          return (
            <RevealItem
              as="li"
              key={phase.label}
              className="relative pb-12 pl-10 last:pb-0 lg:pb-0 lg:pl-0"
            >
              {/* ---- Progression rail ---------------------------------------- */}
              {/* Mobile: vertical, down the left edge. Desktop: horizontal, across the top. */}
              <div aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-[13px] lg:static lg:flex lg:h-[13px] lg:w-auto lg:items-center">
                <span className="absolute top-[2px] left-0 lg:static">
                  <Marker label={phase.label} />
                </span>
                {!isLast && (
                  <span
                    className={cn(
                      "absolute top-[22px] bottom-[-2px] left-[6px] w-0 border-l lg:static lg:mx-3 lg:h-0 lg:w-auto lg:flex-1 lg:border-t lg:border-l-0",
                      isToday ? "border-lime/60" : "border-dashed border-line-2",
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

              {/* ---- Phase content ------------------------------------------- */}
              <div className={cn("lg:mt-9 lg:border-l lg:pr-10 lg:pl-8 xl:pr-12", isToday ? "lg:border-lime/50" : "lg:border-line")}>
                <p className={cn("label-mono flex items-center gap-3", isToday ? "text-lime" : "text-muted")}>
                  <span>{pad(i + 1)}</span>
                  <span aria-hidden="true" className={isToday ? "text-lime/60" : "text-subtle"}>
                    /
                  </span>
                  <span>{phase.label}</span>
                  {isToday && (
                    <span className="ml-1 border border-lime/40 px-1.5 py-[2px] text-[9px] leading-none tracking-[0.12em]">
                      Now
                    </span>
                  )}
                </p>
                <h3 className="mt-5 text-[24px] leading-[1.15] font-[550] tracking-title text-balance text-text md:text-[26px]">
                  {phase.title}
                </h3>
                <p className="mt-4 max-w-[420px] text-[15px] leading-[1.75] text-muted">{phase.body}</p>
                <ul className="mt-7 border-t border-line">
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-3 border-b border-line py-3 text-[14px] leading-[1.5] tracking-[-0.01em] text-[#c3cbc9]"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "relative top-[-1px] size-[6px] shrink-0",
                          isToday ? "bg-lime" : phase.label === "Next" ? "border border-muted" : "border border-dashed border-subtle",
                        )}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          );
        })}
      </Reveal>

      <Reveal className="mt-20 border-t border-line pt-10 md:mt-28 md:pt-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-12">
          {closingLabel && <p className="label-mono pt-2 text-lime">{closingLabel}</p>}
          <p className="max-w-[22ch] text-[clamp(30px,3.6vw,52px)] leading-[1.08] font-semibold tracking-display text-balance text-text">
            {closingText}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
