import CtaBand from "@/components/sections/CtaBand";
import Hero from "@/components/sections/Hero";
import Boundaries from "@/components/sections/home/Boundaries";
import DemoProof from "@/components/sections/home/DemoProof";
import FailureToFix from "@/components/sections/home/FailureToFix";
import ProductAreas from "@/components/sections/home/ProductAreas";
import SelectedLabs from "@/components/sections/home/SelectedLabs";
import Workflow from "@/components/sections/home/Workflow";
import HashRedirect from "@/components/layout/HashRedirect";
import { homeMetadata } from "@/components/layout/metadata";

export const metadata = homeMetadata;

/**
 * Home (release, 1 November 2026): hero; a short recorded run; the four-stage workflow; product
 * areas with status; the failure-to-fix case (planted, labeled); selected Labs articles;
 * operating boundaries and the pilot invitation; the CTA band. The only h1 is in <Hero />.
 * Keep main text within the 960-word budget (tests/site.spec.ts).
 */
export default function HomePage() {
  return (
    <>
      <HashRedirect />
      <Hero />
      <DemoProof />
      <Workflow />
      <ProductAreas />
      <FailureToFix />
      <SelectedLabs />
      <Boundaries />
      <CtaBand current="home" />
    </>
  );
}
