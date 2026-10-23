import type { Metadata } from "next";
import CtaBand from "@/components/sections/CtaBand";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import Vision from "@/components/sections/Vision";
import WhyNow from "@/components/sections/WhyNow";
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
      <WhyNow />
      <Vision variant="default" />
      <NextPage current="vision" />
      <CtaBand />
    </>
  );
}
