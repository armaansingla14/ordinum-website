"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import OrdinumMark from "@/components/brand/OrdinumMark";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { nav } from "@/lib/content";
import { resolveHref } from "@/lib/nav";
import MobileMenu, { NavAnchor } from "./MobileMenu";

/** True once the page has scrolled past a few pixels. */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);
  return scrolled;
}

/** The nav href that owns the current route ("/technology" for "/technology"), or null. */
function activeHref(pathname: string) {
  const match = nav.links.find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`));
  return match ? match.href : null;
}

export default function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const scrolled = useScrolled();
  const active = activeHref(pathname);
  // The primary CTA points at a section of /contact; mark it current on that page.
  const ctaPath = nav.demo.href.split("#")[0];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[62px] border-b bg-[rgb(11_14_16/0.85)] backdrop-blur-xl backdrop-saturate-150 lg:h-[72px]",
        "transition-[border-color,box-shadow] duration-300 ease-out",
        scrolled
          ? "border-line shadow-[0_18px_40px_-28px_rgb(0_0_0/0.9)]"
          : "border-line/45 shadow-none",
      )}
    >
      <Container className="flex h-full items-center justify-between gap-6">
        <NavAnchor
          href={onHome ? "#top" : "/"}
          aria-label="Ordinum, home"
          className="-mx-1 flex shrink-0 items-center gap-3 px-1 py-2 text-text"
        >
          <OrdinumMark className="size-7" />
          <span className="text-[19px] font-bold leading-none tracking-[-0.065em] lg:text-[20px]">ORDINUM</span>
        </NavAnchor>

        <nav aria-label="Primary" className="hidden h-full lg:block">
          <ul className="flex h-full items-center gap-8 xl:gap-10">
            {nav.links.map((link) => {
              const isActive = active === link.href;
              return (
                <li key={link.href} className="relative flex h-full items-center">
                  <NavAnchor
                    href={resolveHref(link.href, onHome)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "py-2 text-[12px] font-medium uppercase leading-none tracking-[0.09em] transition-colors duration-200",
                      isActive ? "text-text" : "text-[#c1c9c6] hover:text-lime",
                    )}
                  >
                    {link.label}
                  </NavAnchor>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-px bg-lime"
                      transition={{ type: "spring", stiffness: 420, damping: 38 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <Button href={nav.bookCall.href} variant="secondary" size="sm" className="hidden xl:inline-flex">
            {nav.bookCall.label}
          </Button>
          <Button
            href={resolveHref(nav.demo.href, onHome)}
            size="sm"
            icon="→"
            aria-current={pathname === ctaPath ? "page" : undefined}
            className="hidden px-4 py-[11px] sm:inline-flex lg:px-[18px] lg:py-[13px]"
          >
            {nav.demo.label}
          </Button>
          <MobileMenu onHome={onHome} active={active} />
        </div>
      </Container>
    </header>
  );
}
