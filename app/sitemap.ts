import type { MetadataRoute } from "next";
import { pages } from "@/lib/content";

const SITE_URL = "https://ordinum.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    ...Object.values(pages).map((page) => ({
      url: `${SITE_URL}${page.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
