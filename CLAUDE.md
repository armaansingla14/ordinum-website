# Ordinum Website

Marketing site for ordinum.org: a home page plus /product, /technology, /research, /vision, /about, /contact and /terms. Next.js 15 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4 + Motion (`motion/react`), deployed on Vercel. Repo is public.

Positioning: Ordinum is building continuous adversarial testing and verification infrastructure for interconnected software and hardware (software, AI, infrastructure, firmware, hardware, robotics). It is research-stage. ROS 2 / Nav2 is the first implemented integration, not the whole company; do not describe Ordinum as a robotics-only or "coverage-guided fuzzing for autonomous systems" company.

## Commands
- `npm run dev`: dev server on http://localhost:8080
- `npm run build`: production build (run before committing to catch type/build errors; every page must stay static)
- `npm run start`: serve the production build (`-- -p 3000` for Playwright)
- `npm run lint`: ESLint (should report 0 errors)
- `npm run typecheck`: `tsc --noEmit`
- `npm test`: Playwright smoke tests (starts `next start` on port 3000; run `npm run build` first). If Chromium's system libraries live outside the default path, set `PLAYWRIGHT_CHROMIUM_LIBS` (see `playwright.config.ts`)
- `npm run screenshots`: full-page + per-section screenshots of every page at 1440/768/390, reduced and full motion; output dir via `SHOTS_DIR`

## Structure
- `app/`: `layout.tsx` (fonts, root metadata from `seo` in `lib/content.ts`, Organization + WebSite JSON-LD), `globals.css` (Tailwind v4 `@theme` tokens), `not-found.tsx`, `opengraph-image.tsx` (generated at build; `twitter-image.tsx` re-exports it), `sitemap.ts`, `robots.ts`, `actions/request-demo.ts` (server action)
- Root metadata sets no OG/Twitter title, description or url, so every page's og:title/description fall back to its own `title`/`description`. A page that defines its own `openGraph` replaces the root object: repeat `type`/`siteName`/`locale` and leave `images` unset so the generated image is re-applied.
- `app/(site)/`: route group; `layout.tsx` renders Navbar + `<main>` + Footer for every page; `page.tsx` (home) and one folder per page (`product/`, `technology/`, `research/`, `vision/`, `about/`, `contact/`, `terms/`) composing sections
- `components/sections/`: shared and home sections at the top level; page-specific sections in `about/`, `product/`, `research/`, `technology/`, `vision/`. `PageHeader` (inner-page h1, optional `children` under the lede), `NextPage`, `CtaBand` (sage design-partnership band closing each page; pass `current="research"` on /research) and `ExploreGrid` (home) tie the pages together
- `components/visuals/`: diagram/animated client components. Key visuals: `PlatformMap` (cross-system architecture, conceptual), `Lifecycle` (Define → Generate → Execute → Observe → Verify → Reproduce → Regress), `TraceTimeline` and `EvidenceReport` (real Nav2 trace and report data from `lib/evidence.ts`)
- `components/layout/`: Navbar (active item from the current route; primary CTA "Talk to us" → /contact, plus "Book a call"), MobileMenu, Footer, HashRedirect (forwards old `/#section` links to their pages)
- `components/ui/`: primitives (Section, Container, Topline, Kicker, Heading, Button, Reveal); reuse these
- `components/brand/OrdinumMark.tsx`: the Saturn logo as a single SVG path (do not modify)
- `components/forms/DemoForm.tsx`: contact form (works without JS)
- `lib/content.ts`: ALL site copy and numbers live here (including `seo`, `pages` headers/metadata, `pageOrder`, `STATUS_LABELS`, `REQUEST_TYPES`, `TECHNOLOGY_CATEGORIES`); edit copy here, not in components. `FACT_SOURCE` records the product repo commit the technical statements were checked against
- `lib/evidence.ts`: typed data copied from real artifacts in the product repo (`armaansingla14/ordinum`, branch `ordinum-2`; commit and source files listed in its header). Do not edit a value without re-checking the source file
- `lib/schema.ts`: zod schema shared by form and server action (option allowlists come from `lib/content.ts`); `lib/supabase/`: server client + DB types
- `supabase/migrations/`: database schema (the `waitlist` table, anonymous insert-only via RLS)
- `tests/`: Playwright specs; `playwright.config.ts` at root
- `@/*` is aliased to the repo root (`@/components/...`, `@/lib/...`)

## Conventions
- Server components by default; `"use client"` only for interactive/animated pieces.
- Respect `prefers-reduced-motion` (MotionConfig `reducedMotion="user"`); animate transform/opacity only.
- Lime `#c1e29e` is the accent; orange `#ffa779` is reserved for failures/invariant violations.
- Status must be unambiguous: implemented = solid lime marker; in development = outlined/dashed lime; planned = dashed steel. Conceptual visuals carry a "CONCEPTUAL" tag; visuals built from real data cite the artifact path.
- Diagrams must be legible at 320px and keyboard-usable if interactive.

## Claims
- Never invent facts, customers, partners, pilots, vulnerabilities, endorsements or metrics. Every technical claim must trace to the product repo or a founder-confirmed fact; planned is not implemented.
- The v1 benchmark results were withdrawn. None of their numbers may appear as performance claims (only, optionally, in the clearly labeled withdrawn-results note on /research, which currently contains no numbers).
- No "deterministic replay" claims beyond what the repo supports (exact replay on the deterministic toy target; Nav2 is statistical reproduction). No "first/only/most advanced/guaranteed" language; do not caricature other approaches.
- Team: two co-founders, Armaan Singla and Aarav Singla. Profiles with `pendingConfirmation: true` in `lib/content.ts` (`ABOUT_PROFILES_PENDING`) must not be rendered until the founder approves them.
- Legal: do not change the Terms text or add a Privacy link/page without founder and legal approval.

## Deployment
- Pushing to `main` deploys to production on Vercel; other branches get preview URLs.
- `vercel.json` only sets `{"framework":"nextjs"}`; do not add SPA rewrites (they break Next routing).
- Env vars `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` are server-only (read by the server action, never exposed to the client). They live in `.env` locally (gitignored, see `.env.example`) and in Vercel project settings.

## Database
- `waitlist` stores contact-form submissions: email (required, case-insensitive unique), company, role, message, plus the optional `technology_category`, `request_type` and `hardest_failure` columns.
- Those three columns come from `supabase/migrations/20261023000200_contact_form_fields.sql` (additive, nullable, RLS unchanged). Until that migration is applied to the production project, the deployed form must not send them; apply it before deploying the new form.

## Rules
- Never commit `.env` or any secrets.
- The site must contain no references to Lovable (no `lovable-tagger`, meta tags, or links).
- Contact email is armaan@ordinum.org; canonical domain is https://ordinum.org.
