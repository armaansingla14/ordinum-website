import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import ProductArea from "@/components/sections/products/ProductArea";

export const metadata: Metadata = pageMetadata("agents");

/** /products/agents: product-area template, copy in lib/content.ts `productAreas.agents`. */
export default function AgentsPage() {
  return <ProductArea area="agents" />;
}
