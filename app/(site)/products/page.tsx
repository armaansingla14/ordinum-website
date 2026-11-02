import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import Capabilities from "@/components/sections/products/Capabilities";
import HowItWorks, { Delivery, Engine } from "@/components/sections/products/HowItWorks";
import Outputs from "@/components/sections/products/Outputs";
import Architecture from "@/components/sections/technology/Architecture";
import Limitations from "@/components/sections/technology/Limitations";
import Reproduction from "@/components/sections/technology/Reproduction";
import { platform } from "@/lib/content";

export const metadata: Metadata = pageMetadata("products");

const JUMP = [
  { href: "#how-it-works", label: "Workflow" },
  { href: "#engine", label: "One engine" },
  { href: "#delivery", label: "Delivery" },
  { href: "#capabilities", label: "Commands" },
  { href: "#outputs", label: "What you get" },
  { href: "#architecture", label: "How a run works" },
] as const;

/**
 * /products: one workflow (#how-it-works), one shared engine (#engine), delivery (#delivery),
 * the commands, the outputs, and a compact "how a run works": #architecture (redirect target of
 * /technology) with the seven-stage #lifecycle behind a disclosure, #reproduction and
 * #limitations. Redirect targets: /product, /solution (here), /how-it-works (#how-it-works).
 */
export default function ProductsPage() {
  return (
    <>
      <PageHeader page="products">
        <nav aria-label="On this page" className="mt-8 md:mt-10">
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
      <Engine />
      <Delivery />
      <Capabilities />
      <Outputs />
      <Architecture />
      <Reproduction />
      <Limitations />
      <NextPage current="products" />
      <CtaBand current="products" copy={platform.cta} />
    </>
  );
}
