import type { Metadata } from "next";
import About from "@/components/sections/About";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import { pages } from "@/lib/content";

export const metadata: Metadata = {
  title: pages.about.meta.title,
  description: pages.about.meta.description,
  alternates: { canonical: pages.about.href },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader page="about" />
      <About variant="charcoal" />
      <CtaBand />
    </>
  );
}
