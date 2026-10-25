import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import ClosingCTA from "@/components/sections/ClosingCTA";

export const metadata: Metadata = pageMetadata("contact");

/** Two paths: talk to the founders (#talk) or send an inquiry (#inquiry, form at #contact-form). */
export default function ContactPage() {
  return <ClosingCTA asPageHeading />;
}
