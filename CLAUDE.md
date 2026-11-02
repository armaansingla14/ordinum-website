# Ordinum Website

Marketing site for ordinum.org. Pages: home; **Products** (`/products` platform overview, `/products/software`, `/products/agents` "AI agent security", `/products/robotics` "Robotics & connected systems", `/products/transactions` "Transaction assurance", `/roadmap`); **Demos** (`/demos`, `/demos/nav2-walkthrough`); **Ordinum Labs** (`/labs`, `/labs/[slug]`); evidence packages (`/evidence/[case]`); `/security`, `/about`, `/contact`; the interim legal pages `/terms` and `/privacy`. Stack: Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4 and Motion (`motion/react`), deployed on Vercel. The repo is public.

Positioning (9/10 pass, 1 November 2026): Ordinum is building continuous security testing for software, firmware and hardware. The headline is "Find security failures before they reach the real world." Today it reproduces failures, checks the engineer's fix and keeps confirmed cases as regression tests. It is research-stage.
- **Available today:** software and APIs (PocketBase, stable), AI-agent reference applications (release candidate), robotics in simulation (ROS 2 / Nav2, Built & validated, simulation only), and our own transaction reference application (release candidate).
- **Planned:** firmware, native fuzzing, devices and physical hardware. Shown on the roadmap and as a "Planned" row, never as product pages.
- **Delivery:** "Ordinum runs on your machines as a CLI with Python integrations. Evaluations are guided by the founders." No hosted product, no public or self-serve install, no install commands on the site, no promised repository access, no implied pilot agreement.
- **Agentic loop:** a labeled vision diagram (Today / In development / Planned). Only a seed-suggestion interface is in development; there is no language model in the loop.
- Do not frame Ordinum as a "small local testing tool"; state the platform ambition, then the current delivery plainly.

## Commands
- `npm run dev`: dev server on http://localhost:8080
- `npm run build`: production build. Run it before committing to catch type and build errors. Every page must stay static.
- `npm run start`: serve the production build (`-- -p 3000` for Playwright)
- `npm run lint`: ESLint (should report 0 errors)
- `npm run typecheck`: `tsc --noEmit`
- `npm test`: Playwright tests. It starts `next start` on port 3000 (`PLAYWRIGHT_PORT` overrides), so run `npm run build` first. If Chromium's system libraries live outside the default path, set `PLAYWRIGHT_CHROMIUM_LIBS` (see `playwright.config.ts`).
  - `tests/site.spec.ts`:
    - all routes (`tests/routes.ts`) at 320–1920 px: one h1, no overflow, no console errors
    - nav disclosures, mobile menu, redirects (one hop) and hash forwarding
    - CTAs: every `/contact` link says "Request an evaluation", every "Watch demo" goes to `/#demo`, no "Book a call" / "Talk to us" / "Talk to the founders" anywhere, Cal.com linked only on `/contact`
    - home: section order (`top, demo, workflow, areas, ambition, labs, get-started`), the five-step strip, the planted label exactly once in `#demo`, and the recording starting inside a 1440×900 viewport
    - product template order (`test, example, connect, runs, outputs, today, evaluate`), the agents `#scope` split, the transactions page
    - `/products` holds `#how-it-works`, `#engine`, `#delivery`, `#architecture`, `#lifecycle`, `#reproduction`; `/security` holds `#deployment`, `#data`, `#network`, `#ci`, `#report`
    - canonical, OG and JSON-LD, sitemap; evidence files linked only when published and SHA-256 checked
    - Labs article order (`finding, tested, why-it-matters, how-it-worked, what-it-shows, not-established, artifacts, methods-note`) and index order
    - form labels, validation message, "what happens next"; `/demos/nav2-walkthrough` without JS and by keyboard
    - the homepage word budget: at most 650 words
  - `tests/claims.site.spec.ts`: the forbidden-claims guard over rendered text, head, sitemap and source; the em-dash and hype-word rules (rendered only); transaction copy must carry "reference application"; agent copy must say planted vs real, ours, release candidate; the LinkedIn allowlist for client JS.
- `npm run screenshots`: full-page and per-section screenshots of every page at 320–1920, with reduced and full motion. Set the output directory with `SHOTS_DIR`.

## Structure
- `app/`:
  - `layout.tsx`: fonts, root metadata from `seo` in `lib/content.ts`, and Organization + WebSite JSON-LD. The founders in the JSON-LD come from `about.founders`.
  - `globals.css`: Tailwind v4 `@theme` tokens; long identifiers in `main` wrap (`overflow-wrap: anywhere`).
  - `not-found.tsx`, `opengraph-image.tsx` (headline plus a maturity strip from the Products nav group; `twitter-image.tsx` re-exports it), `sitemap.ts` (iterates `pages`, Labs articles and evidence packages), `robots.ts`
  - `actions/request-demo.ts`: the server action that writes to `inquiries`
- **Page metadata:** use `pageMetadata(key)` / `routeMetadata()` and `homeMetadata` from `components/layout/metadata.ts`. Home title is exactly "Ordinum"; inner pages use descriptive short titles from `pages[*].meta.title` plus " | Ordinum", and full OG/Twitter titles from `seo.pages`. A page that defines its own `openGraph` replaces the root object, so the helper repeats `type`/`siteName`/`locale` and references `/opengraph-image` and `/twitter-image` explicitly.
- `app/(site)/`: the route group. `layout.tsx` renders Navbar + `<main>` + Footer. `page.tsx` is home; one folder per route.
- **Home** (≤ 650 words), in order: hero (h1, lede, availability, delivery, "Request an evaluation" + "Watch demo"); `#demo` (the 1:35 recording, the before/after result card carrying the planted label once, the five-step strip); `#workflow` (five-step diagram); `#areas` (four product-area cards with maturity and stable/release-candidate tags, plus the planned firmware/hardware row); `#ambition` (agentic loop diagram); `#labs` (three cards); the evaluation band.
- `components/sections/`: shared and home sections at the top level, page-specific sections in subfolders.
  - `PageHeader`: the inner-page h1, with optional `children` under the lede.
  - `NextPage`: follows `pageOrder` (products → software → agents → robotics → transactions → roadmap).
  - `CtaBand`: the sage band closing each page except /contact: primary "Request an evaluation", secondary "Watch demo" (dropped on home and /demos, which already show the recording). Optional `copy` for page-specific text.
  - `products/ProductArea.tsx`: the product template (who and failures, example failure with one visual, connect, what Ordinum runs, evidence, what works today with channel tags, how to evaluate). Agents add `#scope` (testing agents = built; agents doing security work = vision).
  - `demos/FlagshipBlock.tsx` (video + `BeforeAfter` + `DemoStrip`, shared by home and /demos), `demos/FlagshipVideo.tsx` (no autoplay, `preload="none"`, captions, transcript), `demos/SeekButton.tsx` (strip timestamps seek the video on click).
  - `labs/ArticleView.tsx`: the article order above, technical details in a closed `<details>`.
- `components/visuals/`: diagrams and real-data visuals. `WorkflowDiagram` and `AgenticLoop` are tagged "Diagram". `BeforeAfter` (PocketBase 10/10 vs 0/10) and `GoalPlot` (Nav2 true path, goal, 0.35 m radius, SUCCEEDED at 11.61 s, labeled "Recorded simulation trace · harness artifact, not a Nav2 bug") are built from real data. `TraceTimeline` and `EvidenceReport` render real Nav2 data from `lib/evidence.ts`.
- `components/layout/`: `Navbar` (Products, Demos, Ordinum Labs, Resources, Company; one header CTA "Request an evaluation" → `/contact`), `MobileMenu`, `NavDisclosure`, `Footer`, `HashRedirect` (old `/#section` links; `#technology`/`#stack` → `/products#architecture`), `metadata.ts`
- `components/ui/`: primitives (Section, Container, Kicker, Heading, Button, Reveal, MaturityMarker). Reuse these.
- `components/brand/OrdinumMark.tsx`: the Saturn logo as a single SVG path. Do not modify it.
- `components/forms/DemoForm.tsx`: the contact form, which works without JS. Visible fields: work email*, company, "What are you working on?" and message; technology category and request type inside a closed "More details" disclosure. Pending, validation, success and failure copy plus a "what happens next" line come from `contact.form`. It links to /privacy.
- `lib/content.ts`: ALL site copy and numbers live here. Edit copy here, not in components. It includes `seo`, `nav`, `PRIMARY_CTA`, `WATCH_DEMO`, `pages`, `pageOrder`, `MATURITY_LABELS`, `CHANNEL_LABELS`, `EVIDENCE_CLASS_LABELS`, `hero`, `home`, `agenticLoop`, `testingAreas`, `productAreas`, `platform`, `security`, `contact`, `legal`, `footer`, `FACT_SOURCE`, `TEST_SUITE_STATUS`, `HOSTED_CI_STATUS`, `flagship`.
- `lib/labs.ts`: typed Labs articles. `lib/evidence-packages.ts`: the manifest of expected files per `/evidence/<case>`. A file is linked only if it exists in `public/evidence/<case>/` at build time, with a SHA-256 computed at build; otherwise "Artifact pending publication". `agent-reference-cancel` is filled by a founder-run export script.
- `lib/evidence.ts`: typed data copied from real artifacts in the product repo (`armaansingla14/ordinum`, private). Do not edit a value without re-checking the source file.
- `lib/schema.ts`: the zod schema shared by the form and the server action. Option allowlists come from `lib/content.ts`.
- `lib/notify.server.ts`: the Resend notification (server-only). `lib/supabase/`: the server client and DB types. `supabase/migrations/`: the database schema.
- `tests/`: Playwright specs and `routes.ts`. `playwright.config.ts` is at the root.
- `@/*` is aliased to the repo root (`@/components/...`, `@/lib/...`).

## Conventions
- Server components by default; `"use client"` only for interactive or animated pieces.
- Respect `prefers-reduced-motion` (MotionConfig `reducedMotion="user"`). Animate transform and opacity only.
- Lime `#c1e29e` is the accent, used sparingly. Orange `#ffa779` is reserved for failures and invariant violations (and the planted-defect banner on the recording). Corners are square, with hairlines and numbered mono kickers. Do not add new gradients or glass effects.
- **Copy:** short, direct sentences. Headings name a capability, a result or a customer task, never the site's own honesty ("Honest status", "labeled for what it is" and similar are banned). No em dashes anywhere visible, including titles, OG text and aria labels. State each qualification once, where its claim appears; details live on the evidence pages and in Labs. CTA labels are exactly "Talk to us", "Book a call" and "Watch the demo". Say "ground-truth checks", not "independent checks".
- **Integration maturity:** use exactly `MATURITY_LABELS`, and tag what works today with `CHANNEL_LABELS` (stable checkpoint vs release candidate). Never write a bare "Implemented".

  | Label | Marker |
  |---|---|
  | Built & validated | solid lime |
  | Built, experimental | outlined lime |
  | In progress | dashed lime |
  | Planned | dashed steel |

  Always show an integration's scope with its label, for example "simulation only".
- **Evidence labels:** use exactly `EVIDENCE_CLASS_LABELS`: Real external target, Controlled positive control, Harness artifact, Expected behavior, Unresolved, and Independently verified defect. None of the last kind exist, so never render one.
- Conceptual visuals carry a "CONCEPTUAL" tag; explanatory diagrams carry "Diagram". Visuals built from real data cite the artifact path.
- Diagrams must be legible at 320px, and keyboard-usable if interactive.

## Claims
- Never invent facts, customers, partners, pilots, conversations, vulnerabilities, endorsements or metrics. Every technical claim must trace to the product repo (stable checkpoint `768a9b5`, or the release candidate `ordinum-2-release` with code gates at `5a05996`) or to a founder-confirmed fact, and must say which. Planned is not implemented.
- **Current figures:** tests "2,506 passed, 32 skipped, 0 failed" at release candidate 5a05996 (stable 768a9b5: 2,229 / 32 / 0). Hosted CI, one sentence (`HOSTED_CI_STATUS`): light jobs of Ordinum's own repo have passed on GitHub Actions (2,460 passed at 0d6c4ac); the heavy Docker suite has never run hosted; customer CI is templates only.
- **CTAs:** primary "Request an evaluation" → `/contact` everywhere; secondary "Watch demo" → `/#demo`. No "Book a call", "Talk to us" or "Talk to the founders" buttons; the Cal.com link appears only as a small inline option on `/contact`. Do not write "Watch the demo".
- **Flagship (PocketBase):** always labeled "Planted defect in our client path, not a PocketBase bug." On the home demo block the label appears once, beside the result.
- **Agents:** our own reference application (9 planted defects, 9/9 PASS FIXED, `ci` 9 PASS, release candidate), plus one real, unplanted bug Ordinum found in our own hardened reference agent (cancel of delegated work missed an in-flight sub-agent call; confirmed 5/5; fixed test-first in 9a70c5c; after the fix the strict verdict is CANNOT_VERIFY; no review round logged). Always say "our own reference application", "not third-party software", "release candidate". The local-model run (qwen2.5:1.5b via Ollama + LangGraph, 14/20 vs 0/20) is one small model; never call it a first.
- **Transactions:** our own transaction reference application, release candidate, test-only keys, not real payment software. Copy must carry "reference application".
- Design-partner and evaluation copy is an invitation. Never claim existing customers, partners, users, pilots or ongoing conversations.
- The v1 benchmark results were withdrawn. None of their numbers may appear. The only exception is the clearly labeled withdrawn-results note in the Labs research summary inside `[data-withdrawn]`, which contains no numbers.
- Do not use any of these:
  - "parts built" progress ratios, reuse percentages
  - the test count 764 or the retired "523 passed, 1 skipped"
  - "beats random" or superiority over baselines
  - comparisons with named competitors
  - "first/only/most advanced/industry-leading/guaranteed" language
  - "revolutionary", "seamless", "unlock", "military-grade", em dashes
  - install commands (`pip install`, "installed from source")

  Do not caricature other approaches. `tests/claims.site.spec.ts` enforces the list.
- **Reproduction:** exact replay works only on deterministic targets (the toy robot, the testbed's lockstep build). Nav2 and MQTT use statistical reproduction.
- **Nav2 violations:** the three reproduced Nav2 violations are harness, oracle or configuration artifacts, not Nav2 defects. Never relabel them.
- **Video:** the only recording is the 1:35 PocketBase run in `public/media` (captions, transcript, no autoplay). There is no Nav2 video.
- **Private repo:** do not copy files, reports, traces or logs from the private product repo into this repo or `public/` without separate founder authorization. Evidence packages are filled only by founder-run export scripts.
- **Team:** two co-founders, Armaan Singla and Aarav Singla ("Co-founder", no other titles). Both profiles were approved for publication on 2026-10-24. Any profile with `pendingConfirmation: true` must not be rendered.
- **Legal:** /terms (Website Terms) and /privacy (Privacy Notice) are interim pages approved by the founders on 25 October 2026, pending legal review. Do not change their text without founder (ideally legal) approval.

## Deployment
- Pushing to `main` deploys to production on Vercel; other branches get preview URLs. No production deploy without founder approval.
- `vercel.json` only sets `{"framework":"nextjs"}`. Do not add SPA rewrites; they break Next routing.
- Old URLs redirect in one 308 hop (`next.config.ts`, mirrored in `tests/routes.ts`): `/product` → `/products`, `/technology` → `/security#architecture`, `/research` → `/labs/research-summary`, `/vision` → `/roadmap`, `/demo` → `/demos/nav2-walkthrough`, `/solution` → `/products`, `/how-it-works` → `/products#how-it-works`, `/problem` → `/`.
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
