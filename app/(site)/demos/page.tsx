import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import DemoGallery from "@/components/sections/demos/DemoGallery";

export const metadata: Metadata = pageMetadata("demos");

/** /demos: the gallery. Flagship (planted control, status only until a recording exists), Nav2 walkthrough, testbed planted control. */
export default function DemosPage() {
  return (
    <>
      <PageHeader page="demos" />
      <DemoGallery />
      <CtaBand current="demos" />
    </>
  );
}
