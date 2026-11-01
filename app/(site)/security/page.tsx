import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import { Boundaries, Fidelity, NetworkIsolation, Scope, SecurityContact } from "@/components/sections/security/Security";
import Architecture from "@/components/sections/technology/Architecture";
import Limitations from "@/components/sections/technology/Limitations";
import Reproduction from "@/components/sections/technology/Reproduction";

export const metadata: Metadata = pageMetadata("security");

/**
 * /security: scope, network isolation per integration (#network), operating limits, how a run
 * works (#architecture with the seven-stage #lifecycle; redirect target of /technology),
 * reproduction (#reproduction), what runs where, limitations and how to report a concern.
 */
export default function SecurityPage() {
  return (
    <>
      <PageHeader page="security" />
      <Scope />
      <NetworkIsolation />
      <Boundaries />
      <Architecture />
      <Reproduction />
      <Fidelity />
      <Limitations />
      <SecurityContact />
      <CtaBand current="security" />
    </>
  );
}
