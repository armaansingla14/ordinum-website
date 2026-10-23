import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import PlatformMap from "@/components/visuals/PlatformMap";
import { platformVision } from "@/lib/content";
import { SectionIntro } from "./shared";

/**
 * Home section 3: the long-term scope, every domain connected to one shared core.
 * PlatformMap carries the CONCEPTUAL tag, the status legend and the platformVision.label caption.
 */
export default function PlatformVisionSection() {
  return (
    <Section id="platform" variant="charcoal" aria-labelledby="platform-title">
      <SectionIntro
        kicker={platformVision.kicker}
        title={platformVision.title}
        titleMuted={platformVision.titleMuted}
        titleId="platform-title"
        lede={platformVision.lede}
      />
      <Reveal className="mt-12 md:mt-16" amount={0.1}>
        <PlatformMap variant="home" />
      </Reveal>
    </Section>
  );
}
