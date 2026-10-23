import type { Metadata } from "next";
import CtaBand from "@/components/sections/CtaBand";
import Differentiation from "@/components/sections/Differentiation";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import Pillars from "@/components/sections/Pillars";
import { pages } from "@/lib/content";

export const metadata: Metadata = {
  title: pages.product.meta.title,
  description: pages.product.meta.description,
  alternates: { canonical: pages.product.href },
};

export default function ProductPage() {
  return (
    <>
      <PageHeader page="product" />
      <Pillars variant="charcoal" />
      <Differentiation />
      <NextPage current="product" />
      <CtaBand />
    </>
  );
}
