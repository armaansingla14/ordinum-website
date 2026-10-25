import type { Metadata } from "next";
import { hero, pages, seo, site, type PageKey } from "@/lib/content";

/*
 * Per-page metadata built from `pages` and `seo` in lib/content.ts.
 *
 * A page that sets `openGraph` / `twitter` replaces the root objects from app/layout.tsx, so
 * these repeat type/siteName/locale and card/site. Next does NOT re-apply the file-based
 * app/opengraph-image.tsx / app/twitter-image.tsx (defined at the root segment) once a page
 * replaces `openGraph` / `twitter`, so the generated images are referenced explicitly here.
 * Keep alt/size in step with app/opengraph-image.tsx.
 */

const IMAGE_ALT = `Ordinum: ${hero.titleLine1} ${hero.titleLine2} ${hero.eyebrow}. ${hero.status}.`;
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: IMAGE_ALT, type: "image/png" };
const TWITTER_IMAGE = { url: "/twitter-image", width: 1200, height: 630, alt: IMAGE_ALT, type: "image/png" };

const OG_BASE = { type: "website" as const, siteName: site.name, locale: "en_US", images: [OG_IMAGE] };
const TWITTER_BASE = {
  card: "summary_large_image" as const,
  site: "@OrdinumAI",
  creator: "@OrdinumAI",
  images: [TWITTER_IMAGE],
};

/** Metadata for an inner page: short <title> (root template appends " · Ordinum"), full OG/Twitter title, own canonical. */
export function pageMetadata(key: PageKey): Metadata {
  const page = pages[key];
  const fullTitle = seo.pages[key];
  const description = page.meta.description;
  return {
    title: page.meta.title,
    description,
    alternates: { canonical: page.href },
    openGraph: { ...OG_BASE, url: page.href, title: fullTitle, description },
    twitter: { ...TWITTER_BASE, title: fullTitle, description },
  };
}

/** Metadata for the home page (app/(site)/page.tsx). */
export const homeMetadata: Metadata = {
  title: { absolute: seo.home.title },
  description: seo.home.description,
  alternates: { canonical: "/" },
  openGraph: { ...OG_BASE, url: "/", title: seo.home.ogTitle, description: seo.home.ogDescription },
  twitter: { ...TWITTER_BASE, title: seo.home.twitterTitle, description: seo.home.twitterDescription },
};
