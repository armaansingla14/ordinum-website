import type { Metadata } from "next";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { pages } from "@/lib/content";

export const metadata: Metadata = {
  title: pages.contact.meta.title,
  description: pages.contact.meta.description,
  alternates: { canonical: pages.contact.href },
};

export default function ContactPage() {
  return <ClosingCTA asPageHeading />;
}
