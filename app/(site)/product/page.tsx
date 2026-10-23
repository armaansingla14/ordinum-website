import type { Metadata } from "next";
import CtaBand from "@/components/sections/CtaBand";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import Approaches from "@/components/sections/product/Approaches";
import EngineerOutputs from "@/components/sections/product/EngineerOutputs";
import PlatformLayers from "@/components/sections/product/PlatformLayers";
import ProductIntro from "@/components/sections/product/ProductIntro";
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
      <ProductIntro />
      <PlatformLayers />
      <EngineerOutputs />
      <Approaches />
      <NextPage current="product" />
      <CtaBand />
    </>
  );
}
