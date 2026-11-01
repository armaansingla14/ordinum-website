"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * The site used to be one long page. Old shared links like ordinum.org/#research
 * still land on "/", so forward their hash straight to the page that now holds that section
 * (final URLs, never a route that redirects again).
 *
 * Keys are the old single-page section ids; they must not be reused as section ids on the home
 * page (a matching hash would navigate away). Home ids today: top, recorded-run, workflow,
 * product-areas, failure-to-fix, labs, boundaries, get-started. Hash targets exist on their
 * pages: #architecture (technology.architecture.id) on /products, #why-now on /roadmap.
 */
const MOVED: Record<string, string> = {
  product: "/products",
  "why-ordinum": "/products",
  technology: "/products#architecture",
  stack: "/products#architecture",
  research: "/labs/research-summary",
  "why-now": "/roadmap#why-now",
  vision: "/roadmap",
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
