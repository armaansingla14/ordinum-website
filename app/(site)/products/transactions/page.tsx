import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import ProductArea from "@/components/sections/products/ProductArea";

export const metadata: Metadata = pageMetadata("transactions");

/**
 * /products/transactions: product-area template, copy in lib/content.ts `productAreas.transactions`.
 * Every claim here is about Ordinum's own transaction reference application (release candidate,
 * test-only keys), never real payment software (tests/claims.site.spec.ts).
 */
export default function TransactionsPage() {
  return <ProductArea area="transactions" />;
}
