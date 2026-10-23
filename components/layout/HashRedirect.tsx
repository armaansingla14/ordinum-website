"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * The site used to be one long page. Old shared links like ordinum.org/#research
 * still land on "/", so forward their hash to the page that now holds that section.
 */
const MOVED: Record<string, string> = {
  product: "/product",
  "why-ordinum": "/product#why-ordinum",
  technology: "/technology",
  stack: "/technology#stack",
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
