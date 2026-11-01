import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import Capabilities from "@/components/sections/products/Capabilities";
import HowItWorks from "@/components/sections/products/HowItWorks";
import Outputs from "@/components/sections/products/Outputs";
import Architecture from "@/components/sections/technology/Architecture";
import Reproduction from "@/components/sections/technology/Reproduction";
import { platform } from "@/lib/content";

export const metadata: Metadata = pageMetadata("products");

const JUMP = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#architecture", label: "Architecture" },
  { href: "#reproduction", label: "Reproduction" },
  { href: "#outputs", label: "Outputs" },
] as const;

/**
 * /products: platform overview. Redirect targets: /product, /solution (here), /technology
 * (#architecture), /how-it-works (#how-it-works). Isolation and limitations live on /security.
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
      <Capabilities />
      <Architecture />
      <Reproduction />
      <Outputs />
      <NextPage current="products" />
      <CtaBand current="products" copy={platform.cta} />
    </>
  );
}
