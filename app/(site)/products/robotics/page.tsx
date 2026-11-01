import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import ProductArea from "@/components/sections/products/ProductArea";

export const metadata: Metadata = pageMetadata("robotics");

/** /products/robotics: product-area template, copy in lib/content.ts `productAreas.robotics`. */
export default function RoboticsPage() {
  return <ProductArea area="robotics" />;
}
