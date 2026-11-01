import type { MetadataRoute } from "next";
import { pages, site, type PageKey } from "@/lib/content";
import { evidencePackages } from "@/lib/evidence-packages";
import { labsArticles } from "@/lib/labs";

/** Legal pages (interim, founder-approved) are listed at low priority. */
const LEGAL: readonly PageKey[] = ["terms", "privacy"];

/**
 * Every public, indexable route: home, every entry in lib/content.ts `pages`, each published
 * Labs article and each evidence package. Redirected legacy URLs are not listed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: site.url, lastModified, changeFrequency: "weekly", priority: 1 },
    ...(Object.entries(pages) as [PageKey, (typeof pages)[PageKey]][]).map(([key, page]) => ({
      url: `${site.url}${page.href}`,
      lastModified,
      changeFrequency: LEGAL.includes(key) ? ("yearly" as const) : ("monthly" as const),
      priority: LEGAL.includes(key) ? 0.3 : key === "contact" ? 0.6 : 0.8,
    })),
    ...labsArticles.map((a) => ({
      url: `${site.url}/labs/${a.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...evidencePackages.map((p) => ({
      url: `${site.url}/evidence/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
