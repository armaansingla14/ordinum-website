import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import MoreRuns, { FlagshipDemo } from "@/components/sections/demos/DemoGallery";

export const metadata: Metadata = pageMetadata("demos");

/** /demos: the flagship recording at the top (#demo-flagship, with its strip and result card), then the other runs as compact cards. */
export default function DemosPage() {
  return (
    <>
      <PageHeader page="demos">
        <FlagshipDemo />
      </PageHeader>
      <MoreRuns />
      <CtaBand current="demos" />
    </>
  );
}
