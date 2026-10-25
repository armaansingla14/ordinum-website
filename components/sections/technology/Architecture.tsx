import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import Lifecycle from "@/components/visuals/Lifecycle";
import PlatformMap from "@/components/visuals/PlatformMap";
import { lifecycle, technology } from "@/lib/content";
import { Disclosure, SECTION_PAD, SectionIntro, splitLabel } from "./shared";

/**
 * Section 1: one-page architecture overview (PlatformMap: three tiers, every node labelled with
 * its maturity), then the seven-stage lifecycle (anchor #lifecycle, linked from the home hero),
 * collapsed behind a disclosure below md.
 */
export default function Architecture() {
  const a = technology.architecture;
  const [lcLabel, lcIndex] = splitLabel(lifecycle.kicker);
  return (
    <Section id={a.id} aria-labelledby={`${a.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={a.kicker} title={a.title} titleMuted={a.titleMuted} titleId={`${a.id}-title`} lede={a.lede} />

      <Reveal className="mt-12 md:mt-16" amount={0.05}>
        <PlatformMap />
      </Reveal>

      <div id={lifecycle.id} className="mt-20 md:mt-28">
        <Reveal className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12 xl:gap-16">
          <div>
            <Kicker index={lcIndex}>{lcLabel}</Kicker>
            <Heading as="h3" id="lifecycle-title" muted={lifecycle.titleMuted} className="mt-5 max-w-[20ch] text-[clamp(30px,3vw,42px)]/[1.1]">
              {lifecycle.title}
            </Heading>
          </div>
          <p className="max-w-[540px] text-[16px] leading-[1.75] text-muted">{lifecycle.lede}</p>
        </Reveal>
        {/* md+: the lifecycle in full. Below md: behind a disclosure (the content is in the static HTML). */}
        <Reveal className="mt-10 hidden md:mt-12 md:block" amount={0.05}>
          <Lifecycle />
        </Reveal>
        <Disclosure summary={lifecycle.disclosure} className="mt-6 md:hidden">
          <Lifecycle className="mt-2" />
        </Disclosure>
      </div>
    </Section>
  );
}
