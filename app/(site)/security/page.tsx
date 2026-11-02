import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import { Boundaries, DataHandling, Deployment, HostedCi, NetworkIsolation, SecurityContact } from "@/components/sections/security/Security";

export const metadata: Metadata = pageMetadata("security");

/**
 * /security: deployment (#deployment), data handling (#data), network isolation per integration
 * (#network), operating limits, hosted CI (#ci) and how to report a concern (#report). How a run
 * works moved to /products (#architecture, #lifecycle, #reproduction).
 */
export default function SecurityPage() {
  return (
    <>
      <PageHeader page="security" />
      <Deployment />
      <DataHandling />
      <NetworkIsolation />
      <Boundaries />
      <HostedCi />
      <SecurityContact />
      <CtaBand current="security" />
    </>
  );
}
