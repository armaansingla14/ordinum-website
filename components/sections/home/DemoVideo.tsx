import FlagshipVideo from "@/components/sections/demos/FlagshipVideo";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { home } from "@/lib/content";
import { ArrowLink, SectionIntro } from "./shared";

const { demo } = home;

/**
 * Home section 2: the flagship PocketBase recording. The story in one paragraph (Ordinum finds the
 * planted defect, the engineer removes the cache, Ordinum checks the fixed build); FlagshipVideo
 * shows the planted-defect label before playback. One evidence link, no stats.
 */
export default function DemoVideo() {
  return (
    <Section id="demo" variant="charcoal" aria-labelledby="demo-title" className="py-[72px] md:py-[104px]">
      <SectionIntro kicker={demo.kicker} title={demo.title} titleMuted={demo.titleMuted} titleId="demo-title" lede={demo.lede} />
      <Reveal className="mt-10 md:mt-14" amount={0.05}>
        <FlagshipVideo />
      </Reveal>
      <ArrowLink href={demo.link.href} className="mt-4">
        {demo.link.label}
      </ArrowLink>
    </Section>
  );
}
