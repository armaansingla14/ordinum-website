# Ordinum Website

Marketing site for ordinum.org. It has a home page plus /products (overview) with /products/software, /products/agents and /products/robotics, /roadmap, /demos and /demos/nav2-walkthrough, /labs and /labs/[slug], /evidence/[case], /security, /about and /contact, and the interim legal pages /terms and /privacy. Old URLs (/product, /technology, /research, /vision, /demo, /solution, /how-it-works, /problem) are single-hop 308 redirects in `next.config.ts`. Stack: Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4 and Motion (`motion/react`), deployed on Vercel. The repo is public.

Positioning: Ordinum is building continuous adversarial testing and verification infrastructure for interconnected software and hardware (software, AI, infrastructure, firmware, hardware, robotics). The headline is "Find failures that only appear when systems interact." It is research-stage.
- **ROS 2 / Nav2 (simulation)** is the first integration that is Built & validated.
- **The MQTT (Eclipse Mosquitto) adapter and the four-process cross-system testbed** are Built, experimental.
- **The NanoMQ bridge** is In progress.
- **PocketBase 0.40.6** (Software & APIs) and the **agents kit** (planted reference fixtures only; no third-party agent tested) are Built, experimental. Mosquitto 2.0.22 and NanoMQ 0.25.7 are real integrations with negative results (0 FAIL).
- **Roadmap only:** Transactions (In progress, no numbers, no page); native fuzzing, emulated firmware, device transport, physical hardware (Planned).
- Do not describe Ordinum as a robotics-only or "coverage-guided fuzzing for autonomous systems" company.

## Commands
- `npm run dev`: dev server on http://localhost:8080
- `npm run build`: production build. Run it before committing to catch type and build errors. Every page must stay static.
- `npm run start`: serve the production build (`-- -p 3000` for Playwright)
- `npm run lint`: ESLint (should report 0 errors)
- `npm run typecheck`: `tsc --noEmit`
- `npm test`: Playwright tests. It starts `next start` on port 3000, so run `npm run build` first. If Chromium's system libraries live outside the default path, set `PLAYWRIGHT_CHROMIUM_LIBS` (see `playwright.config.ts`).
  - `tests/routes.ts`: the shared ROUTES and REDIRECTS lists.
  - `tests/site.spec.ts`:
    - all routes at 320–1920 px: one h1, no overflow, no console errors
    - nav disclosures by keyboard (Escape returns focus, outside click / focus-out close, not hover-only), the mobile accordion and focus trap, the CTA
    - every internal href on every route returns 200 with no redirect; old URLs redirect in one hop; hash forwarding
    - titles (home exactly "Ordinum", others end " | Ordinum"), canonical, OG and JSON-LD, sitemap
    - evidence packages (only published files linked; SHA-256 matches), Labs articles, /demos media status
    - form labels; Nav2 walkthrough steps, without JS and by keyboard
    - the homepage word budget: at most 960 words, 60% of the 1,600-word pre-focus baseline
  - `tests/claims.site.spec.ts`: the forbidden-claims guard over rendered text, head, sitemap and source (skipping the verbatim artifacts in `public/evidence/`), plus the LinkedIn allowlist for client JS.
- `npm run screenshots`: full-page and per-section screenshots of every page at 320–1920, with reduced and full motion. Set the output directory with `SHOTS_DIR`; filter with `SHOTS_ROUTES` (names like `products-software`), `SHOTS_WIDTHS`, `SHOTS_MODES`, `SHOTS_EXTRAS=0`.

## Structure
- `app/`:
  - `layout.tsx`: fonts, root metadata from `seo` in `lib/content.ts`, and Organization + WebSite JSON-LD. The founders in the JSON-LD come from `about.founders`.
  - `globals.css`: Tailwind v4 `@theme` tokens
  - `not-found.tsx`
  - `opengraph-image.tsx`: generated at build, with a maturity strip of the product areas from the nav's Products group. `twitter-image.tsx` re-exports it.
  - `sitemap.ts`: iterates `pages`, `labsArticles` and `evidencePackages` (never a redirected URL)
  - `robots.ts`
  - `actions/request-demo.ts`: the server action that writes to `inquiries`
- **Page metadata:** use `pageMetadata(key)`, `routeMetadata({...})` (data-driven routes) and `homeMetadata` from `components/layout/metadata.ts`. They set the short title, description, own canonical, and full OG/Twitter titles from `seo.pages`. The root template is `"%s | Ordinum"`; the home `<title>` is exactly "Ordinum" (absolute).
  - Root metadata sets no OG/Twitter title, description or url, so it never stamps the home title onto inner pages.
  - A page that defines its own `openGraph` replaces the root object. It must repeat `type`/`siteName`/`locale`, and it loses the file-based image, so it must reference `/opengraph-image` and `/twitter-image` explicitly. The helper (`components/layout/metadata.ts`) does both.
- `app/(site)/`: the route group.
  - `layout.tsx` renders Navbar + `<main>` + Footer for every page.
  - `page.tsx` is home.
  - One folder per route: `products/` (+ `software/`, `agents/`, `robotics/`), `roadmap/`, `demos/` (+ `nav2-walkthrough/`), `labs/` (+ `[slug]/`), `evidence/[case]/`, `security/`, `about/`, `contact/`, `terms/` and `privacy/`. Dynamic routes use `generateStaticParams` with `dynamicParams = false`.
- **Home** sections, in order: hero (CTAs "See Ordinum in action" → /demos and "Talk to us"), a short recorded Nav2 run (`#recorded-run`, labeled "Recorded run"), the four-stage workflow (`#workflow`, PipelineHero), product areas with status, the failure-to-fix flagship case (planted, labeled), selected Labs articles, operating boundaries with the pilot invitation, then the CTA band.
  - The seven-stage lifecycle (`lifecycle`, anchor `#lifecycle`) and the architecture (`#architecture`) live on /products.
  - Keep home copy within the word budget.
- **Product-area pages** use `components/sections/products/ProductArea.tsx` with `productAreas` copy: customer & job, what you connect/define, (robotics: one block per integration with its boundaries), one `SequenceDiagram` (CONCEPTUAL unless built from real data, which cites its artifact), demo or honest status, actual outputs, prerequisites / custom work / limitations, Labs + evidence links, one CTA.
- `components/sections/`: shared and home sections at the top level, and page-specific sections in subfolders.
  - `PageHeader`: the inner-page h1, with optional `children` under the lede.
  - `NextPage`: follows `pageOrder`, which is products → software → agents → robotics → roadmap.
  - `CtaBand`: the sage design-partner band closing each page except /contact.
    - Pass `current` so a button never links to its own page. On /demos, the secondary button becomes "Book a call".
    - The optional `copy` prop takes page-specific text, for example `product.cta`.
- `components/visuals/`: diagram and animated client components. `TraceTimeline` and `EvidenceReport` render real Nav2 trace and report data from `lib/evidence.ts`. Lazy-load heavy interactive visuals below the fold, and keep an accessible SSR fallback.
- `components/layout/`:
  - `Navbar` + `NavDisclosure`:
    - Top level (`nav.entries`): Products (disclosure: Platform overview, Software & APIs, AI Agents, Robotics & Connected Systems, Roadmap, each with a one-line description and maturity label), Demos, Ordinum Labs, Resources (disclosure: Security), Company (disclosure: About, Contact).
    - Disclosures are buttons with `aria-expanded`/`aria-controls`; click, Enter or Space open them, never hover alone. Escape closes and returns focus; an outside click, focus leaving the group and a route change close them.
    - The primary CTA is "Talk to us" → `/contact#talk`, plus "Book a call".
  - `MobileMenu`: the same entries; groups are accordion sections inside the sheet (focus trap kept). The section owning the current route starts expanded.
  - `Footer`: a one-line thesis, one status line, link columns, and Terms + Privacy links
  - `HashRedirect`: forwards old `/#section` links to their final pages (never to a redirecting URL)
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
  - `platform`, `productAreas`, `roadmap`, `demos`, `security`, `home`
  - `flagship` + `FLAGSHIP_LABEL`, `HOSTED_CI_STATUS`, `AI_METHODS_NOTE` (founder-approved wording; use verbatim)
  - `contact`, `legal`, `footer`
  - `FACT_SOURCE`: facts checked against product `ordinum-2` head `44284b0`; evidence pinned at the stable checkpoint `768a9b5` (checked 1 November 2026). `researchNote` dates the research summary (`124dde072`).
  - `content_contract.md` (outside the repo) documents the shapes.
- `lib/evidence.ts`: typed data copied from real artifacts in the product repo (`armaansingla14/ordinum`, branch `ordinum-2`, private). The artifacts were copied at `c25ba4f` and are unchanged at `768a9b5`; the header lists the source files. Do not edit a value without re-checking the source file.
- `lib/labs.ts`: typed Ordinum Labs articles (slug, category, leading result + label, author Armaan Singla, date/revision, question, system, method, results, limitations, related, reproducibility links to /evidence/*, correction history, `AI_METHODS_NOTE`). "In preparation" entries have a title only: no results, no page, no link.
- `lib/evidence-packages.ts`: the manifest of EXPECTED files per `/evidence/<case>`. `lib/evidence-files.ts` (server-only) links a file only if `public/evidence/<case>/<file>` exists at build time, with size and a build-time SHA-256; otherwise "Artifact pending publication".
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
  - "independent review", treasury numbers or "M17" (transactions is a roadmap entry only)
  - reuse percentages
  - "beats random" or superiority over baselines
  - comparisons with named competitors
  - "first/only/most advanced/industry-leading/guaranteed" language

  Do not caricature other approaches. `tests/claims.site.spec.ts` enforces the list.
- **Reproduction:** do not claim "deterministic replay" beyond what the repo supports.
  - Exact replay works only on deterministic targets: the toy robot, and the testbed's lockstep build.
  - Nav2 and MQTT use statistical reproduction.
- **Nav2 violations:** the three reproduced Nav2 violations are harness, oracle or configuration artifacts, not Nav2 defects. Never relabel them.
- **Video:** there is no demo video yet. Do not write "Watch the demo" or call anything a video. The CTA is "See Ordinum in action" → /demos. `demoPage.media` stays disabled; the flagship card on /demos shows "Recording in production". The claims guard allows "Watch the demo" only once `demoPage.media` has a reviewed video.
- **Flagship:** every PocketBase number travels with `FLAGSHIP_LABEL` ("Controlled positive control — a defect planted in Ordinum's own test harness, not a PocketBase bug"). Every end-to-end fix demonstration uses a planted control.
- **Reviews:** write "review by separate AI review agents", never "independent review". Labs articles carry `AI_METHODS_NOTE`.
- **Hosted CI:** use `HOSTED_CI_STATUS` verbatim.
- **Private repo:** do not copy files, reports, traces or logs from the private product repo into this repo or `public/` without separate founder authorization. The only authorized path is the founder-run export script into `public/evidence/{pocketbase-verified-fix,nav2-success-mismatch,testbed-planted-control}/`; never edit those files.
- **Team:** two co-founders, Armaan Singla and Aarav Singla. Both profiles, including Aarav's LinkedIn (`/in/aaravsinglaa`), were approved for publication on 2026-10-24, so `ABOUT_PROFILES_PENDING` is false. Any profile with `pendingConfirmation: true` must not be rendered.
- **Legal:** /terms (Website Terms) and /privacy (Privacy Notice) are interim pages approved by the founders on 25 October 2026, pending legal review. Do not change their text without founder (ideally legal) approval.

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
