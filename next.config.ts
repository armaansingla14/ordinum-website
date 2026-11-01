import type { NextConfig } from "next";

/**
 * Static-friendly CSP. Next's inline bootstrap scripts and the JSON-LD block need
 * 'unsafe-inline' for scripts (nonces would force dynamic rendering). Dev needs 'unsafe-eval'.
 */
const isDev = process.env.NODE_ENV !== "production";
const csp = [
  "default-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    // Every old URL goes to its final page in one hop (308). Keep REDIRECTS in tests/site.spec.ts in step.
    return [
      // Pages retired in the labs + products release (1 November 2026).
      { source: "/product", destination: "/products", permanent: true },
      { source: "/technology", destination: "/security#architecture", permanent: true },
      { source: "/research", destination: "/labs/research-summary", permanent: true },
      { source: "/vision", destination: "/roadmap", permanent: true },
      { source: "/demo", destination: "/demos/nav2-walkthrough", permanent: true },
      // Legacy routes from the previous site, repointed directly (no chains).
      { source: "/solution", destination: "/products", permanent: true },
      { source: "/how-it-works", destination: "/products#how-it-works", permanent: true },
      // The home page no longer has a #problem section.
      { source: "/problem", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
