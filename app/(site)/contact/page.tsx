import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import ClosingCTA from "@/components/sections/ClosingCTA";

export const metadata: Metadata = pageMetadata("contact");

/** Request an evaluation: how it starts (#talk, kept for old links) and the form (#inquiry, form at #contact-form). */
export default function ContactPage() {
  return <ClosingCTA asPageHeading />;
}
