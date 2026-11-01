import CtaBand from "@/components/sections/CtaBand";
import Hero from "@/components/sections/Hero";
import DemoVideo from "@/components/sections/home/DemoVideo";
import SelectedLabs from "@/components/sections/home/SelectedLabs";
import TestingAreas from "@/components/sections/home/TestingAreas";
import Workflow from "@/components/sections/home/Workflow";
import HashRedirect from "@/components/layout/HashRedirect";
import { homeMetadata } from "@/components/layout/metadata";
import { ctaBand } from "@/lib/content";

export const metadata = homeMetadata;

/**
 * Home (copy pass, 1 November 2026): what Ordinum does, who uses it and how it is delivered; the
 * flagship PocketBase recording; three workflow steps; testing areas with their integrations and
 * maturity labels; two Labs articles; one pilot invitation (the CTA band, with "Book a call" as
 * its second button so no CTA repeats the hero). The only h1 is in <Hero />.
 * Keep main text within the 650-word budget (tests/site.spec.ts).
 */
export default function HomePage() {
  return (
    <>
      <HashRedirect />
      <Hero />
      <DemoVideo />
      <Workflow />
      <TestingAreas />
      <SelectedLabs />
      <CtaBand current="home" copy={{ title: ctaBand.title, titleMuted: ctaBand.titleMuted, body: ctaBand.body, primary: ctaBand.demo, secondary: ctaBand.bookCall }} />
    </>
  );
}
