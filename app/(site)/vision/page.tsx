import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import Vision from "@/components/sections/Vision";
import Mission from "@/components/sections/vision/Mission";
import WhyNow from "@/components/sections/vision/WhyNow";

export const metadata: Metadata = pageMetadata("vision");

/** /vision: the ambition and long-term scope, three phases, then why now. */
export default function VisionPage() {
  return (
    <>
      <PageHeader page="vision" />
      <Mission />
      <Vision variant="charcoal" />
      <WhyNow />
      <NextPage current="vision" />
      <CtaBand current="vision" />
    </>
  );
}
