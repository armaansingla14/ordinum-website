import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { footer, vision } from "@/lib/content";
import { pad, splitLabel, StatusChip, StatusMarker } from "./shared";

/** The one scope line that has a working integration today (ROS 2 / Nav2, in simulation). */
const isFirstIntegration = (item: string) => item.toLowerCase().startsWith("robotics");

/**
 * /vision 01: the mission, and the long-term scope shown as an ambition register.
 * Every scope line is planned; the robotics line carries a separate, smaller note for the
 * single integration that exists, so the list never reads as current support.
 */
export default function Mission() {
  const { intro, scope } = vision;
  const [label, index] = splitLabel(intro.kicker);

  return (
    <Section id="mission" aria-labelledby="mission-title">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-6 lg:pr-6">
          <Kicker index={index}>{label}</Kicker>
          <Heading id="mission-title" className="mt-6 max-w-[16ch]">
            {intro.title}
          </Heading>
          <div className="mt-8 max-w-[560px] space-y-5 text-[16px] leading-[1.8] text-muted md:text-[17px]">
            {intro.body.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.06} className="lg:col-span-6">
          <figure
            aria-labelledby="scope-title"
            className="border border-line-2 bg-window shadow-[0_28px_70px_rgba(0,0,0,0.34)]"
          >
            {/* Window bar */}
            <div className="flex min-h-[47px] flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-5 py-3 md:px-6">
              <p id="scope-title" className="font-mono text-[10px] tracking-[0.13em] text-[#a5b1ad] uppercase">
                {scope.title}
              </p>
              <StatusChip status="planned" label="Ambition" />
            </div>

            <ol className="px-5 md:px-6">
              {scope.items.map((item, i) => {
                const first = isFirstIntegration(item);
                return (
                  <li
                    key={item}
                    className="grid grid-cols-[28px_minmax(0,1fr)] items-baseline gap-x-3 border-b border-line py-3.5 last:border-b-0 sm:grid-cols-[36px_minmax(0,1fr)_auto]"
                  >
                    <span className="font-mono text-[11px] tracking-[0.08em] text-subtle">{pad(i + 1)}</span>
                    <span className="flex items-baseline gap-3 text-[15px] leading-[1.45] tracking-[-0.012em] text-[#c3cbc9]">
                      <StatusMarker status="planned" className="relative top-[1px]" />
                      {item}
                    </span>
                    {first && (
                      <span className="col-start-2 mt-2 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-lime uppercase sm:col-start-3 sm:mt-0">
                        <StatusMarker status="implemented" />
                        ROS 2 / Nav2 · sim
                        <span className="sr-only">: first implemented integration, in simulation</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>

            <figcaption className="border-t border-line px-5 py-4 text-[13px] leading-[1.6] text-muted md:px-6">
              {scope.note}
              <span className="mt-2 block font-mono text-[10px] tracking-[0.1em] text-subtle uppercase">{footer.status}</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>

    </Section>
  );
}
