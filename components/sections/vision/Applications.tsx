import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { vision } from "@/lib/content";
import { pad, SectionIntro, StatusMarker } from "./shared";

/** The application area that is also the current validation environment. */
const isCurrent = (name: string) => name.toLowerCase().startsWith("robotics");

/**
 * /vision 03: application areas to explore (not markets served), then the stance on
 * existing specialized tools: integrate and coordinate, not replace.
 */
export default function Applications() {
  const { applications, tools } = vision;

  return (
    <Section id="applications" aria-labelledby="applications-title">
      <SectionIntro
        kicker={applications.kicker}
        title={applications.title}
        titleId="applications-title"
        lede={applications.lede}
      />

      <Reveal as="ul" stagger={0.06} className="hairline-grid mt-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
        {applications.items.map((a, i) => {
          const current = isCurrent(a.name);
          return (
            <RevealItem
              as="li"
              key={a.name}
              className="flex flex-col bg-surface p-7 transition-colors duration-200 hover:bg-surface-2 md:min-h-[236px] md:p-9"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <span className="font-mono text-[11px] tracking-[0.08em] text-lime">{pad(i + 1)}</span>
                <span
                  className={
                    current
                      ? "inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-lime uppercase"
                      : "inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-subtle uppercase"
                  }
                >
                  <StatusMarker status={current ? "implemented" : "planned"} />
                  {current ? "First validation environment" : "To explore"}
                </span>
              </div>
              <h3 className="mt-10 text-[22px] leading-[1.2] font-semibold tracking-title text-text md:mt-12">{a.name}</h3>
              <p className="mt-4 text-[14px] leading-[1.8] text-muted">{a.body}</p>
            </RevealItem>
          );
        })}
      </Reveal>

      <Reveal className="mt-20 border-t border-line pt-10 md:mt-28 md:pt-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-12">
          <p className="label-mono pt-2 text-lime">Existing tools</p>
          <p className="max-w-[30ch] text-[clamp(26px,2.8vw,40px)] leading-[1.15] font-semibold tracking-display text-balance text-text">
            {tools}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
