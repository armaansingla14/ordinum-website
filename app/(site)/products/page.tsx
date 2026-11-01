import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import Capabilities from "@/components/sections/products/Capabilities";
import HowItWorks, { Delivery } from "@/components/sections/products/HowItWorks";
import Outputs from "@/components/sections/products/Outputs";
import { platform } from "@/lib/content";

export const metadata: Metadata = pageMetadata("products");

const JUMP = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#install", label: "What you install" },
  { href: "#capabilities", label: "Commands" },
  { href: "#outputs", label: "What you get" },
] as const;

/**
 * /products: one workflow, what you install, the commands and the outputs. Redirect targets:
 * /product, /solution (here), /how-it-works (#how-it-works). The architecture, the seven-stage
 * lifecycle and reproduction detail live on /security (#architecture, #lifecycle, #reproduction).
 */
export default function ProductsPage() {
  return (
    <>
      <PageHeader page="products">
        <nav aria-label="On this page" className="mt-10 md:mt-12">
          <ol className="flex flex-wrap gap-1">
            {JUMP.map((j, i) => (
              <li key={j.href}>
                <a
                  href={j.href}
                  className="inline-flex min-h-11 items-center gap-2 border border-line px-3 font-mono text-[10px] tracking-[0.12em] text-muted uppercase transition-colors duration-200 hover:border-lime/60 hover:text-lime"
                >
                  <span className="text-lime">{String(i + 1).padStart(2, "0")}</span>
                  {j.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageHeader>
      <HowItWorks />
      <Delivery />
      <Capabilities />
      <Outputs />
      <NextPage current="products" />
      <CtaBand current="products" copy={platform.cta} />
    </>
  );
}
