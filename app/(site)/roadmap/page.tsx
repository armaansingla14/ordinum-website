import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import RoadmapList from "@/components/sections/roadmap/RoadmapList";
import Mission from "@/components/sections/vision/Mission";
import WhyNow from "@/components/sections/vision/WhyNow";

export const metadata: Metadata = pageMetadata("roadmap");

/** /roadmap (formerly /vision): in progress and planned work, the long-term direction, and why now (#why-now). */
export default function RoadmapPage() {
  return (
    <>
      <PageHeader page="roadmap" />
      <RoadmapList />
      <Mission />
      <WhyNow />
      <CtaBand current="roadmap" />
    </>
  );
}
