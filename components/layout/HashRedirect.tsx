"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * The site used to be one long page. Old shared links like ordinum.org/#research
 * still land on "/", so forward their hash to the page that now holds that section.
 *
 * Keys are the old single-page section ids; they must not be reused as section ids on
 * the home page (a matching hash would navigate away). Targets with a hash point at ids
 * that exist on the new pages (checked 2026-10-23):
 *   #why-ordinum  -> product/Approaches.tsx      #architecture -> technology/Architecture.tsx
 *   #vision       -> sections/Vision.tsx
 * "stack" (the old "what we test" layer stack) now lives in the Technology architecture.
 */
const MOVED: Record<string, string> = {
  product: "/product",
  "why-ordinum": "/product#why-ordinum",
  technology: "/technology",
  stack: "/technology#architecture",
  research: "/research",
  "why-now": "/vision",
  vision: "/vision#vision",
  about: "/about",
  contact: "/contact",
};

export default function HashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const target = MOVED[window.location.hash.slice(1)];
    if (target) router.replace(target);
  }, [router]);

  return null;
}
