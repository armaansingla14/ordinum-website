import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import About from "@/components/sections/About";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import Story from "@/components/sections/about/Story";

export const metadata: Metadata = pageMetadata("about");

/** /about: why we are building Ordinum and what we bring, then the two co-founders. */
export default function AboutPage() {
  return (
    <>
      <PageHeader page="about" />
      <Story />
      <About variant="charcoal" />
      <CtaBand current="about" />
    </>
  );
}
