import type { Metadata, Viewport } from "next";
import { DM_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";
import MotionProvider from "@/components/providers/MotionProvider";
import { about, seo, site } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const SOCIALS = [site.x, site.instagram, site.linkedinCompany];

/*
 * Root metadata. openGraph/twitter deliberately carry no title, description or url:
 * every route inherits this object, and Next fills og:title / og:description /
 * twitter:* from each page's own resolved title and description (see
 * postProcessMetadata in next/dist/lib/metadata/resolve-metadata.js). Setting them
 * here would stamp the home page's title and URL onto every inner page.
 * og:image / twitter:image come from app/opengraph-image.tsx and app/twitter-image.tsx.
 * A page that defines its own `openGraph` / `twitter` replaces these objects AND loses the
 * file-based images, so it must repeat type/siteName/locale and reference /opengraph-image and
 * /twitter-image explicitly (components/layout/metadata.ts does this for every page).
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: seo.home.title, template: "%s · Ordinum" },
  description: seo.home.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@OrdinumAI",
    creator: "@OrdinumAI",
  },
  // Icons come from app/icon.png and app/apple-icon.png (file conventions);
  // public/favicon.ico remains for clients that request it directly.
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0e10",
  colorScheme: "dark",
};

/*
 * Organization + WebSite structured data, from `site` and `seo` in lib/content.ts.
 * Founders come from `about.founders` (both approved for publication on 2026-10-24); a profile
 * with pendingConfirmation is left out. Name and LinkedIn only: no employer or title.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      logo: `${site.url}/icon.png`,
      email: site.email,
      description: seo.organizationDescription,
      sameAs: SOCIALS,
      founder: about.founders
        .filter((f) => !f.pendingConfirmation)
        .map((f) => ({ "@type": "Person", name: f.name, ...(f.linkedin ? { sameAs: [f.linkedin] } : {}) })),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      url: site.url,
      description: seo.home.description,
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmMono.variable}`}>
      <head>
        {/* Without JS, Reveal never animates in: show its server-rendered hidden state as-is. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body className="bg-bg font-sans text-text antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-lime focus:px-4 focus:py-3 focus:font-mono focus:text-[12px] focus:uppercase focus:tracking-[0.14em] focus:text-bg"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
