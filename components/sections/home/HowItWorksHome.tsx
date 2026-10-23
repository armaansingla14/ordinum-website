import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import Lifecycle from "@/components/visuals/Lifecycle";
import { hero, lifecycle } from "@/lib/content";
import { SectionIntro } from "./shared";

/** Home section 4: the seven-stage loop. Lifecycle renders the stages, the CONCEPTUAL flow and the guidance note. */
export default function HowItWorksHome() {
  return (
    <Section id="how-it-works" aria-labelledby="how-it-works-title">
      <SectionIntro
        kicker={lifecycle.kicker}
        title={lifecycle.title}
        titleMuted={lifecycle.titleMuted}
        titleId="how-it-works-title"
        lede={lifecycle.lede}
      />

      <Reveal className="mt-12 md:mt-16" amount={0.1}>
        <Lifecycle />
      </Reveal>

      <div className="mt-8 flex justify-end border-t border-line pt-6">
        <Link
          href={hero.secondaryCta.href}
          className="group inline-flex min-h-11 items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime uppercase underline-offset-4 hover:underline"
        >
          {hero.secondaryCta.label}
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </Section>
  );
}
