import { evidencePackages } from "../lib/evidence-packages";
import { labsArticles } from "../lib/labs";

/** Every public, static route (shared by the site, claims and screenshot specs). */
export const ROUTES = [
  "/",
  "/products",
  "/products/software",
  "/products/agents",
  "/products/robotics",
  "/roadmap",
  "/demos",
  "/demos/nav2-walkthrough",
  "/labs",
  ...labsArticles.map((a) => `/labs/${a.slug}`),
  "/security",
  ...evidencePackages.map((p) => `/evidence/${p.slug}`),
  "/about",
  "/contact",
  "/terms",
  "/privacy",
] as const;

/** Old URL -> final URL, one 308 hop each (next.config.ts). */
export const REDIRECTS = [
  ["/product", "/products"],
  ["/technology", "/security#architecture"],
  ["/research", "/labs/research-summary"],
  ["/vision", "/roadmap"],
  ["/demo", "/demos/nav2-walkthrough"],
  ["/solution", "/products"],
  ["/how-it-works", "/products#how-it-works"],
  ["/problem", "/"],
] as const;
