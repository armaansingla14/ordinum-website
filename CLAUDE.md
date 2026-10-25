# Ordinum Website

Marketing site for ordinum.org. It has a home page plus /demo, /product, /technology, /research, /vision, /about and /contact, and the legal drafts /terms and /privacy. Stack: Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4 and Motion (`motion/react`), deployed on Vercel. The repo is public.

Positioning: Ordinum is building continuous adversarial testing and verification infrastructure for interconnected software and hardware (software, AI, infrastructure, firmware, hardware, robotics). The headline is "Find failures that only appear when systems interact." It is research-stage.
- **ROS 2 / Nav2 (simulation)** is the first integration that is Built & validated.
- **The MQTT (Eclipse Mosquitto) adapter and the four-process cross-system testbed** are Built, experimental.
- **The NanoMQ bridge** is In progress.
- Do not describe Ordinum as a robotics-only or "coverage-guided fuzzing for autonomous systems" company.

## Commands
- `npm run dev`: dev server on http://localhost:8080
- `npm run build`: production build. Run it before committing to catch type and build errors. Every page must stay static.
- `npm run start`: serve the production build (`-- -p 3000` for Playwright)
- `npm run lint`: ESLint (should report 0 errors)
- `npm run typecheck`: `tsc --noEmit`
- `npm test`: Playwright tests. It starts `next start` on port 3000, so run `npm run build` first. If Chromium's system libraries live outside the default path, set `PLAYWRIGHT_CHROMIUM_LIBS` (see `playwright.config.ts`).
  - `tests/site.spec.ts`:
    - all routes at 320–1920 px: one h1, no overflow, no console errors
    - nav, CTA, redirects and hash forwarding
    - canonical, OG and JSON-LD, sitemap
    - form labels
    - `/demo` steps, without JS and by keyboard
    - the homepage word budget: at most 960 words, 60% of the 1,600-word pre-focus baseline
  - `tests/claims.site.spec.ts`: the forbidden-claims guard over rendered text, head, sitemap and source, plus the LinkedIn allowlist for client JS.
- `npm run screenshots`: full-page and per-section screenshots of every page at 320–1920, with reduced and full motion. Set the output directory with `SHOTS_DIR`.

## Structure
- `app/`:
  - `layout.tsx`: fonts, root metadata from `seo` in `lib/content.ts`, and Organization + WebSite JSON-LD. The founders in the JSON-LD come from `about.founders`.
  - `globals.css`: Tailwind v4 `@theme` tokens
  - `not-found.tsx`
  - `opengraph-image.tsx`: generated at build, with a maturity strip from `platformVision.domains`. `twitter-image.tsx` re-exports it.
  - `sitemap.ts`: iterates `pages`, so it includes /demo, /terms and /privacy
  - `robots.ts`
  - `actions/request-demo.ts`: the server action that writes to `inquiries`
- **Page metadata:** use `pageMetadata(key)` and `homeMetadata` from `components/layout/metadata.ts`. They set the short title, description, own canonical, and full OG/Twitter titles from `seo.pages`.
  - Root metadata sets no OG/Twitter title, description or url, so it never stamps the home title onto inner pages.
  - A page that defines its own `openGraph` replaces the root object. It must repeat `type`/`siteName`/`locale`, and it loses the file-based image, so it must reference `/opengraph-image` and `/twitter-image` explicitly. The helper (`components/layout/metadata.ts`) does both.
- `app/(site)/`: the route group.
  - `layout.tsx` renders Navbar + `<main>` + Footer for every page.
  - `page.tsx` is home.
  - There is one folder per page: `demo/`, `product/`, `technology/`, `research/`, `vision/`, `about/`, `contact/`, `terms/` and `privacy/`.
- **Home** has six sections: hero, one conceptual problem example, a real run (links to /demo), the four-stage workflow (Connect, Stress-test, Verify, Reproduce & prevent), progress with maturity labels, and founders followed by the CTA band.
  - The seven-stage lifecycle (`lifecycle`, anchor `#lifecycle`) lives on /technology only.
  - Keep home copy within the word budget.
- `components/sections/`: shared and home sections at the top level, and page-specific sections in subfolders.
  - `PageHeader`: the inner-page h1, with optional `children` under the lede.
  - `NextPage`: follows `pageOrder`, which is product → technology → research → vision → about.
  - `CtaBand`: the sage design-partner band closing each page except /contact.
    - Pass `current` so a button never links to its own page. On /demo, the secondary button becomes "Book a call".
    - The optional `copy` prop takes page-specific text, for example `product.cta`.
- `components/visuals/`: diagram and animated client components. `TraceTimeline` and `EvidenceReport` render real Nav2 trace and report data from `lib/evidence.ts`. Lazy-load heavy interactive visuals below the fold, and keep an accessible SSR fallback.
- `components/layout/`:
  - `Navbar`:
    - Nav items are Product, Technology, Research, Vision and About, with the active item taken from the current route.
    - The primary CTA is "Talk to us" → `/contact#talk`, plus "Book a call".
    - /demo is not a nav item.
  - `MobileMenu`
  - `Footer`: a one-line thesis, one status line, link columns, and Terms + Privacy links
  - `HashRedirect`: forwards old `/#section` links to their pages
  - `metadata.ts`
- `components/ui/`: primitives (Section, Container, Topline, Kicker, Heading, Button, Reveal). Reuse these.
- `components/brand/OrdinumMark.tsx`: the Saturn logo as a single SVG path. Do not modify it.
- `components/forms/DemoForm.tsx`: the contact form, which works without JS.
  - Visible fields: work email*, company, "What are you working on?" and message.
  - Technology category and request type sit inside a closed "More details" disclosure.
  - It links to /privacy.
- `lib/content.ts`: ALL site copy and numbers live here. Edit copy here, not in components. It includes:
  - `seo`, `nav`, `pages`, `pageOrder`
  - `MATURITY_LABELS`, `EVIDENCE_CLASS_LABELS`, `integrations`, `demoWalkthrough`
  - `contact`, `legal`, `footer`
  - `FACT_SOURCE`: the product-repo commit the technical statements were checked against (currently `124dde072`, checked 24 October 2026)
  - `content_contract.md` (outside the repo) documents the shapes.
- `lib/evidence.ts`: typed data copied from real artifacts in the product repo (`armaansingla14/ordinum`, branch `ordinum-2`, private). The artifacts were copied at `c25ba4f` and are unchanged at `124dde072`; the header lists the source files. Do not edit a value without re-checking the source file.
- `lib/schema.ts`: the zod schema shared by the form and the server action. Option allowlists come from `lib/content.ts`.
- `lib/notify.server.ts`: the Resend notification (server-only)
- `lib/supabase/`: the server client and DB types
- `supabase/migrations/`: the database schema (see Database)
- `tests/`: Playwright specs. `playwright.config.ts` is at the root.
- `@/*` is aliased to the repo root (`@/components/...`, `@/lib/...`).

## Conventions
- Server components by default; `"use client"` only for interactive or animated pieces.
- Respect `prefers-reduced-motion` (MotionConfig `reducedMotion="user"`). Animate transform and opacity only.
- Lime `#c1e29e` is the accent, used sparingly. Orange `#ffa779` is reserved for failures and invariant violations. Corners are square, with hairlines and numbered mono kickers. Do not add new gradients or glass effects.
- **Integration maturity:** use exactly `MATURITY_LABELS`. Never write a bare "Implemented".

  | Label | Marker |
  |---|---|
  | Built & validated | solid lime |
  | Built, experimental | outlined lime |
  | In progress | dashed lime |
  | Planned | dashed steel |

  Always show an integration's `maturityNote` and scope with its label, for example "simulation only".
- **Evidence labels:** use exactly `EVIDENCE_CLASS_LABELS`: Real external target, Controlled positive control, Harness artifact, Expected behavior, Unresolved, and Independently verified defect. None of the last kind exist, so never render one.
- Conceptual visuals carry a "CONCEPTUAL" tag. Visuals built from real data cite the artifact path.
- Diagrams must be legible at 320px, and keyboard-usable if interactive.

## Claims
- Never invent facts, customers, partners, pilots, conversations, vulnerabilities, endorsements or metrics. Every technical claim must trace to the product repo at `FACT_SOURCE.commit`, or to a founder-confirmed fact. Planned is not implemented.
- Design-partner copy is an invitation. Never claim existing customers, partners, users or ongoing conversations.
- The v1 benchmark results were withdrawn. None of their numbers may appear. The only exception is the clearly labeled withdrawn-results note on /research inside `[data-withdrawn]`, which currently contains no numbers.
- Do not use any of these:
  - "parts built" progress ratios
  - the test count 764 (the only test figure is "523 passed, 1 skipped", from the validation log)
  - reuse percentages
  - "beats random" or superiority over baselines
  - comparisons with named competitors
  - "first/only/most advanced/industry-leading/guaranteed" language

  Do not caricature other approaches. `tests/claims.site.spec.ts` enforces the list.
- **Reproduction:** do not claim "deterministic replay" beyond what the repo supports.
  - Exact replay works only on deterministic targets: the toy robot, and the testbed's lockstep build.
  - Nav2 and MQTT use statistical reproduction.
- **Nav2 violations:** the three reproduced Nav2 violations are harness, oracle or configuration artifacts, not Nav2 defects. Never relabel them.
- **Video:** there is no demo video yet. Do not write "Watch the demo" or call anything a video. The CTA is "See Ordinum in action" → /demo.
- **Private repo:** do not copy files, reports, traces or logs from the private product repo into this repo or `public/` without separate founder authorization.
- **Team:** two co-founders, Armaan Singla and Aarav Singla. Both profiles, including Aarav's LinkedIn (`/in/aaravsinglaa`), were approved for publication on 2026-10-24, so `ABOUT_PROFILES_PENDING` is false. Any profile with `pendingConfirmation: true` must not be rendered.
- **Legal:** /terms (Website Terms) and /privacy (Privacy Notice) are interim drafts marked "Draft — pending founder approval". Do not change their text, or publish them to production, without founder (ideally legal) approval.

## Deployment
- Pushing to `main` deploys to production on Vercel; other branches get preview URLs. No production deploy without founder approval.
- `vercel.json` only sets `{"framework":"nextjs"}`. Do not add SPA rewrites; they break Next routing.
- **Env vars** are all server-only: read by the server action, never exposed to the client. They live in `.env` locally (gitignored, see `.env.example`) and in Vercel project settings.
  - `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`: required.
  - `RESEND_API_KEY`: optional. Without it, notifications are skipped with one content-free log line.
  - `INQUIRY_NOTIFY_TO`: defaults to armaan@ordinum.org.
  - `INQUIRY_NOTIFY_FROM`: use a verified-domain sender in production.
- **Notifications:** a failed notification never fails a submission. Submission content is never logged. Tests may send only to `delivered@resend.dev`.

## Database
- **`inquiries`** (`supabase/migrations/20261024000000_inquiries.sql`) stores contact-form submissions. It is append-only, so repeat inquiries are kept.
  - **Columns:** `email`, `company`, `working_on`, `message`, `technology_category`, `request_type` and `source`, with CHECK length limits.
  - **Access:** RLS allows anonymous INSERT only, with no SELECT and with UPDATE and DELETE denied.
  - **Rate limit:** a BEFORE INSERT trigger rejects more than 5 rows per `lower(email)` per hour with SQLSTATE `P0429`, which the form shows as `contact.form.messages.rateLimited`.
  - **Deploy order:** apply the migration before deploying the form that writes to it.
- **`waitlist`** is the previous table: a case-insensitive unique email column, plus the optional `technology_category`, `request_type` and `hardest_failure` columns. It is preserved and untouched, but no longer written to. Never drop its data.

## Rules
- Never commit `.env` or any secrets.
- The site must contain no references to Lovable (no `lovable-tagger`, meta tags, or links).
- Contact email is armaan@ordinum.org; canonical domain is https://ordinum.org.
