import CtaBand from "@/components/sections/CtaBand";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import DemoProof from "@/components/sections/home/DemoProof";
import Founders from "@/components/sections/home/Founders";
import WhatWorksToday from "@/components/sections/home/WhatWorksToday";
import HashRedirect from "@/components/layout/HashRedirect";
import { homeMetadata } from "@/components/layout/metadata";

export const metadata = homeMetadata;

/**
 * Home (founder brief section 3): hero, whose visual carries the four stages of what Ordinum
 * does; the problem (one conceptual example); the product working on a real run; progress and
 * the platform vision; founders, closed by the design-partner band. The only h1 is in <Hero />.
 */
export default function HomePage() {
  return (
    <>
      <HashRedirect />
      <Hero />
      <Problem />
      <DemoProof />
      <WhatWorksToday />
      <Founders />
      <CtaBand current="home" />
    </>
  );
}
