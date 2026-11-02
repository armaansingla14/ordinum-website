import FlagshipBlock from "@/components/sections/demos/FlagshipBlock";
import Kicker from "@/components/ui/Kicker";
import Section from "@/components/ui/Section";
import { home } from "@/lib/content";

const { demo } = home;

/**
 * Home section 2, directly under the hero: the flagship PocketBase recording, the before/after
 * result card (which carries the planted-defect label, once) and the five-step strip. Not
 * wrapped in Reveal: it is above the fold at 1440x900 and must paint immediately.
 */
export default function DemoVideo() {
  return (
    <Section id="demo" variant="charcoal" aria-labelledby="demo-title" className="border-t-0 pt-7 pb-14 md:pt-8 md:pb-20">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-baseline lg:gap-6">
        <Kicker>{demo.kicker}</Kicker>
        <h2 id="demo-title" className="text-[22px] leading-[1.25] font-semibold tracking-title text-text md:text-[24px]">
          {demo.title}
        </h2>
      </div>
      <p className="mt-1.5 text-[15px] leading-[1.6] text-muted">{demo.lede}</p>
      <FlagshipBlock className="mt-4" />
    </Section>
  );
}
