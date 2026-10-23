import type { MetadataRoute } from "next";
import { pages, site } from "@/lib/content";

/** Every public route: home, the inner pages from lib/content.ts `pages` (incl. /contact), and /terms. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: site.url, lastModified, changeFrequency: "weekly", priority: 1 },
    ...Object.values(pages).map((page) => ({
      url: `${site.url}${page.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: page.href === "/contact" ? 0.6 : 0.8,
    })),
    { url: `${site.url}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
