import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import Adapters from "@/components/sections/technology/Adapters";
import Architecture from "@/components/sections/technology/Architecture";
import Contract from "@/components/sections/technology/Contract";
import Faults from "@/components/sections/technology/Faults";
import Limitations from "@/components/sections/technology/Limitations";
import OnThisPage from "@/components/sections/technology/OnThisPage";
import Reproduction from "@/components/sections/technology/Reproduction";
import Safety from "@/components/sections/technology/Safety";

export const metadata: Metadata = pageMetadata("technology");

/**
 * /technology, seven sections in order (BRIEF section 5): architecture (+ the seven-stage
 * lifecycle), adapters and their maturity (+ one engine, four targets), the execution and
 * verification contract, fault injection and observation, reproduction and minimization,
 * isolation and safety, current limitations.
 */
export default function TechnologyPage() {
  return (
    <>
      <PageHeader page="technology">
        <OnThisPage />
      </PageHeader>
      <Architecture />
      <Adapters />
      <Contract />
      <Faults />
      <Reproduction />
      <Safety />
      <Limitations />
      <NextPage current="technology" />
      <CtaBand current="technology" />
    </>
  );
}
