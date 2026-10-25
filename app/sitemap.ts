import type { MetadataRoute } from "next";
import { pages, site, type PageKey } from "@/lib/content";

/**
 * Draft legal pages (Website Terms, Privacy Notice) are excluded and served with robots noindex
 * until the founder approves their exact text. Add them back here once approved.
 */
const DRAFT: readonly PageKey[] = ["terms", "privacy"];

/** Every public, indexable route: home plus every entry in lib/content.ts `pages` except the drafts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: site.url, lastModified, changeFrequency: "weekly", priority: 1 },
    ...(Object.entries(pages) as [PageKey, (typeof pages)[PageKey]][])
      .filter(([key]) => !DRAFT.includes(key))
      .map(([key, page]) => ({
        url: `${site.url}${page.href}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: key === "contact" ? 0.6 : 0.8,
      })),
  ];
}
