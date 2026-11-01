import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import ProductArea from "@/components/sections/products/ProductArea";

export const metadata: Metadata = pageMetadata("software");

/** /products/software: product-area template, copy in lib/content.ts `productAreas.software`. */
export default function SoftwarePage() {
  return <ProductArea area="software" />;
}
