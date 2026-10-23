import type { Metadata } from "next";
import CtaBand from "@/components/sections/CtaBand";
import HowItWorks from "@/components/sections/HowItWorks";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import WhatWeTest from "@/components/sections/WhatWeTest";
import { pages } from "@/lib/content";

export const metadata: Metadata = {
  title: pages.technology.meta.title,
  description: pages.technology.meta.description,
  alternates: { canonical: pages.technology.href },
};

export default function TechnologyPage() {
  return (
    <>
      <PageHeader page="technology" />
      <HowItWorks />
      <WhatWeTest />
      <NextPage current="technology" />
      <CtaBand />
    </>
  );
}
