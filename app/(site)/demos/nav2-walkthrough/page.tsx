import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import DemoProvenance from "@/components/sections/demo/DemoProvenance";
import FullEvidence from "@/components/sections/demo/FullEvidence";
import OtherRuns from "@/components/sections/demo/OtherRuns";
import { EvidenceLabel } from "@/components/sections/demo/parts";
import RecordedMediaSlot from "@/components/sections/demo/RecordedMediaSlot";
import Walkthrough from "@/components/sections/demo/Walkthrough";
import { demoWalkthrough } from "@/lib/content";

export const metadata: Metadata = pageMetadata("nav2Walkthrough");

/** /demos/nav2-walkthrough (formerly /demo): the Nav2 success_mismatch run, step by step. */
export default function Nav2WalkthroughPage() {
  return (
    <>
      <PageHeader page="nav2Walkthrough">
        <div className="mt-8 flex flex-col items-start gap-3 md:mt-10">
          <EvidenceLabel size="lg" text={demoWalkthrough.label} classes={demoWalkthrough.labelClasses} />
          <p className="text-[15px] leading-[1.6] text-muted">{demoWalkthrough.qualifier}.</p>
        </div>
        {/* Future recorded video + hosted reports. Renders nothing until enabled in lib/content.ts. */}
        <RecordedMediaSlot />
      </PageHeader>
      <Walkthrough />
      <FullEvidence />
      <OtherRuns />
      <DemoProvenance />
      <CtaBand current="nav2Walkthrough" />
    </>
  );
}
