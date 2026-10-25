import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import Connect from "@/components/sections/product/Connect";
import Outputs from "@/components/sections/product/Outputs";
import CtaBand from "@/components/sections/CtaBand";
import Runs from "@/components/sections/product/Runs";
import Status from "@/components/sections/product/Status";
import { product } from "@/lib/content";

export const metadata: Metadata = pageMetadata("product");

/**
 * /product (BRIEF section 4): what a team connects, what Ordinum runs (the one compact
 * architecture diagram), what an engineer receives (central, with the real report), what works
 * today and what is planned, then "Discuss your testing workflow".
 */
export default function ProductPage() {
  return (
    <>
      <PageHeader page="product" />
      <Connect />
      <Runs />
      <Outputs />
      <Status />
      <NextPage current="product" />
      <CtaBand current="product" copy={product.cta} />
    </>
  );
}
