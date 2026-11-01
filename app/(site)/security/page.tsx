import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import { Boundaries, Fidelity, SecurityContact } from "@/components/sections/security/Security";
import Limitations from "@/components/sections/technology/Limitations";

export const metadata: Metadata = pageMetadata("security");

/** /security: Ordinum's operating boundaries (from the former /technology isolation and limitations sections). */
export default function SecurityPage() {
  return (
    <>
      <PageHeader page="security" />
      <Boundaries />
      <Fidelity />
      <SecurityContact />
      <Limitations />
      <CtaBand current="security" />
    </>
  );
}
