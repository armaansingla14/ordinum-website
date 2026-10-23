import type { ReactNode } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

/** Shared chrome for every site page: sticky nav, a single <main> skip target, footer. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="relative focus:outline-none">
        {children}
      </main>
      <Footer onHome={false} />
    </>
  );
}
