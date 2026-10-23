import type { Metadata, Viewport } from "next";
import { DM_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";
import MotionProvider from "@/components/providers/MotionProvider";
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

const SITE_URL = "https://ordinum.org";
const TITLE = "Ordinum — Coverage-guided fuzzing for autonomous systems";
const DESCRIPTION =
  "Ordinum breaks autonomous systems before reality does. Coverage-guided fuzzing and verification infrastructure for robotics and autonomous software.";
const SOCIALS = [
  "https://x.com/OrdinumAI",
  "https://www.instagram.com/ordinumai",
  "https://www.linkedin.com/company/ordinum-ai",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · Ordinum" },
  description: DESCRIPTION,
  applicationName: "Ordinum",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Ordinum",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@OrdinumAI",
    creator: "@OrdinumAI",
    title: TITLE,
    description: DESCRIPTION,
  },
  // Icons come from app/icon.png and app/apple-icon.png (file conventions);
  // public/favicon.ico remains for clients that request it directly.
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0e10",
  colorScheme: "dark",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ordinum",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  email: "armaan@ordinum.org",
  description: DESCRIPTION,
  sameAs: SOCIALS,
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
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
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
