import type { Metadata } from "next";
import { hero, heroStatusLine, pages, seo, site, type PageKey } from "@/lib/content";

/*
 * Per-page metadata built from `pages` and `seo` in lib/content.ts.
 *
 * A page that sets `openGraph` / `twitter` replaces the root objects from app/layout.tsx, so
 * these repeat type/siteName/locale and card/site. Next does NOT re-apply the file-based
 * app/opengraph-image.tsx / app/twitter-image.tsx (defined at the root segment) once a page
 * replaces `openGraph` / `twitter`, so the generated images are referenced explicitly here.
 * Keep alt/size in step with app/opengraph-image.tsx.
 */

const IMAGE_ALT = `Ordinum: ${hero.titleLine1} ${hero.titleLine2} ${hero.eyebrow}. ${heroStatusLine}.`;
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: IMAGE_ALT, type: "image/png" };
const TWITTER_IMAGE = { url: "/twitter-image", width: 1200, height: 630, alt: IMAGE_ALT, type: "image/png" };

const OG_BASE = { type: "website" as const, siteName: site.name, locale: "en_US", images: [OG_IMAGE] };
const TWITTER_BASE = {
  card: "summary_large_image" as const,
  site: "@OrdinumAI",
  creator: "@OrdinumAI",
  images: [TWITTER_IMAGE],
};

/** Metadata for an inner page: short <title> (root template appends " | Ordinum"), full OG/Twitter title, own canonical. */
export function pageMetadata(key: PageKey): Metadata {
  const page = pages[key];
  return routeMetadata({
    href: page.href,
    title: page.meta.title,
    fullTitle: seo.pages[key],
    description: page.meta.description,
  });
}

/** Same shape for routes generated from data (Labs articles, evidence packages). */
export function routeMetadata({
  href,
  title,
  fullTitle,
  description,
  type = "website",
}: {
  href: string;
  title: string;
  fullTitle?: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  const ogTitle = fullTitle ?? title;
  return {
    title,
    description,
    alternates: { canonical: href },
    openGraph: { ...OG_BASE, type, url: href, title: ogTitle, description },
    twitter: { ...TWITTER_BASE, title: ogTitle, description },
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
