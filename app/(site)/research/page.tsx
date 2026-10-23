import type { Metadata } from "next";
import CtaBand from "@/components/sections/CtaBand";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import Research from "@/components/sections/Research";
import { pages } from "@/lib/content";

export const metadata: Metadata = {
  title: pages.research.meta.title,
  description: pages.research.meta.description,
  alternates: { canonical: pages.research.href },
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader page="research" />
      <Research />
      <NextPage current="research" />
      <CtaBand />
    </>
  );
}
