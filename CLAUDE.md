# Ordinum Website

Marketing site for ordinum.org: a single landing page plus /terms. Next.js 15 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4 + Motion (`motion/react`), deployed on Vercel. Repo is public.

## Commands
- `npm run dev`: dev server on http://localhost:8080
- `npm run build`: production build (run before committing to catch type/build errors; `/` and `/terms` must stay static)
- `npm run start`: serve the production build (`-- -p 3000` for Playwright)
- `npm run lint`: ESLint (should report 0 errors)
- `npm run typecheck`: `tsc --noEmit`
- `npm test`: Playwright smoke tests (starts `next start` on port 3000; run `npm run build` first)
- `npm run screenshots`: full-page + per-section screenshots at 1440/768/390, reduced and full motion; output dir via `SHOTS_DIR`

## Structure
- `app/`: `layout.tsx` (fonts, metadata, JSON-LD), `page.tsx` (composes the sections in order), `globals.css` (Tailwind v4 `@theme` tokens), `terms/`, `not-found.tsx`, `opengraph-image.tsx`, `sitemap.ts`, `robots.ts`, `actions/request-demo.ts` (server action)
- `components/sections/`: one server component per landing-page section
- `components/visuals/`: animated/diagram client components (PipelineHero, LayerStack, CoverageBars, ...)
- `components/layout/`: Navbar, MobileMenu, Footer
- `components/ui/`: primitives (Section, Container, Topline, Kicker, Heading, Button, Reveal); reuse these
- `components/brand/OrdinumMark.tsx`: the Saturn logo as a single SVG path
- `components/forms/DemoForm.tsx`: demo-request form (works without JS)
- `lib/content.ts`: ALL site copy and numbers live here; edit copy here, not in components
- `lib/schema.ts`: zod schema shared by form and server action; `lib/supabase/`: server client + DB types
- `supabase/migrations/`: database schema (the `waitlist` table, anonymous insert-only via RLS)
- `tests/`: Playwright specs; `playwright.config.ts` at root
- `@/*` is aliased to the repo root (`@/components/...`, `@/lib/...`)

## Conventions
- Server components by default; `"use client"` only for interactive/animated pieces.
- Respect `prefers-reduced-motion` (MotionConfig `reducedMotion="user"`); animate transform/opacity only.
- Lime `#c1e29e` is the accent; orange `#ffa779` is reserved for failures/invariant violations.
- Never invent facts, customers, pilots or metrics. Every number must match the research facts; visual simulations are labeled illustrative.

## Deployment
- Pushing to `main` deploys to production on Vercel; other branches get preview URLs.
- `vercel.json` only sets `{"framework":"nextjs"}`; do not add SPA rewrites (they break Next routing).
- Env vars `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` are server-only (read by the server action, never exposed to the client). They live in `.env` locally (gitignored, see `.env.example`) and in Vercel project settings.

## Rules
- Never commit `.env` or any secrets.
- The site must contain no references to Lovable (no `lovable-tagger`, meta tags, or links).
- Contact email is armaan@ordinum.org; canonical domain is https://ordinum.org.
