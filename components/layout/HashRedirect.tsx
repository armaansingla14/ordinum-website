"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * The site used to be one long page. Old shared links like ordinum.org/#research
 * still land on "/", so forward their hash to the page that now holds that section.
 *
 * Keys are the old single-page section ids; they must not be reused as section ids on
 * the home page (a matching hash would navigate away). Only targets with a hash need an
 * id on the destination page: "#architecture" is technology.architecture.id in
 * lib/content.ts (checked 2026-10-24). The old "why-ordinum" comparison and the "#vision"
 * block were folded into their pages in the focus pass, so those land on the page top.
 */
const MOVED: Record<string, string> = {
  product: "/product",
  "why-ordinum": "/product",
  technology: "/technology",
  stack: "/technology#architecture",
  research: "/research",
  "why-now": "/vision",
  vision: "/vision",
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
