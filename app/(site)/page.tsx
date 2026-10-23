import CtaBand from "@/components/sections/CtaBand";
import ExploreGrid from "@/components/sections/ExploreGrid";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import DemoProof from "@/components/sections/home/DemoProof";
import HowItWorksHome from "@/components/sections/home/HowItWorksHome";
import PlatformVisionSection from "@/components/sections/home/PlatformVisionSection";
import WhatWorksToday from "@/components/sections/home/WhatWorksToday";
import HashRedirect from "@/components/layout/HashRedirect";

/**
 * Home, in the order of the founder brief (section 4): hero, problem, platform vision,
 * how it works, what works today, a real demonstration, then onward links and the
 * design-partnership band. The only h1 is in <Hero />.
 */
export default function HomePage() {
  return (
    <>
      <HashRedirect />
      <Hero />
      <Problem />
      <PlatformVisionSection />
      <HowItWorksHome />
      <WhatWorksToday />
      <DemoProof />
      <ExploreGrid />
      <CtaBand current="home" />
    </>
  );
}
