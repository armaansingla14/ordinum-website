import type { Metadata } from "next";
import CtaBand from "@/components/sections/CtaBand";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import Vision from "@/components/sections/Vision";
import Applications from "@/components/sections/vision/Applications";
import Mission from "@/components/sections/vision/Mission";
import { pages } from "@/lib/content";

export const metadata: Metadata = {
  title: pages.vision.meta.title,
  description: pages.vision.meta.description,
  alternates: { canonical: pages.vision.href },
};

export default function VisionPage() {
  return (
    <>
      <PageHeader page="vision" />
      <Mission />
      <Vision variant="charcoal" />
      <Applications />
      <NextPage current="vision" />
      <CtaBand />
    </>
  );
}
