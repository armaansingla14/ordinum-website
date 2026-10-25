import type { MetadataRoute } from "next";
import { pages, site, type PageKey } from "@/lib/content";

/** Legal pages (interim, founder-approved) are listed at low priority. */
const LEGAL: readonly PageKey[] = ["terms", "privacy"];

/** Every public, indexable route: home plus every entry in lib/content.ts `pages`. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: site.url, lastModified, changeFrequency: "weekly", priority: 1 },
    ...(Object.entries(pages) as [PageKey, (typeof pages)[PageKey]][])
      .map(([key, page]) => ({
        url: `${site.url}${page.href}`,
        lastModified,
        changeFrequency: LEGAL.includes(key) ? ("yearly" as const) : ("monthly" as const),
        priority: LEGAL.includes(key) ? 0.3 : key === "contact" ? 0.6 : 0.8,
      })),
  ];
}
