import CtaBand from "@/components/sections/CtaBand";
import Hero from "@/components/sections/Hero";
import Ambition from "@/components/sections/home/Ambition";
import DemoVideo from "@/components/sections/home/DemoVideo";
import SelectedLabs from "@/components/sections/home/SelectedLabs";
import TestingAreas from "@/components/sections/home/TestingAreas";
import Workflow from "@/components/sections/home/Workflow";
import HashRedirect from "@/components/layout/HashRedirect";
import { homeMetadata } from "@/components/layout/metadata";

export const metadata = homeMetadata;

/**
 * Home (9/10 pass, 1 November 2026), in order: hero; the flagship recording with its five-step
 * strip and before/after card (#demo, above the fold at 1440x900); the workflow diagram; the four
 * product areas plus the planned row; the ambition and the agentic loop; three Labs articles; the
 * evaluation band. The only h1 is in <Hero />. Keep main text within the 650-word budget.
 */
export default function HomePage() {
  return (
    <>
      <HashRedirect />
      <Hero />
      <DemoVideo />
      <Workflow />
      <TestingAreas />
      <Ambition />
      <SelectedLabs />
      <CtaBand current="home" />
    </>
  );
}
