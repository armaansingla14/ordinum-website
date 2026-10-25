import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import Research from "@/components/sections/Research";

export const metadata: Metadata = pageMetadata("research");

export default function ResearchPage() {
  return (
    <>
      <PageHeader page="research" />
      <Research />
      <NextPage current="research" />
      <CtaBand current="research" />
    </>
  );
}
