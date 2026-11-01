# Ordinum Website

Marketing site for ordinum.org. Pages: home, `/products` (platform overview), `/products/software`, `/products/agents`, `/products/robotics`, `/roadmap`, `/demos`, `/demos/nav2-walkthrough`, `/labs` and `/labs/[slug]`, `/evidence/[case]`, `/security`, `/about`, `/contact`, and the interim legal pages `/terms` and `/privacy`. Stack: Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4 and Motion (`motion/react`), deployed on Vercel. The repo is public.

Positioning: Ordinum is a local testing tool for engineers. They connect a system, define the rules it must obey, run controlled failure scenarios, reproduce failures and check fixes. The headline is "Find failures that only appear when systems interact." It is research-stage.
- **Delivery today** (`delivery` in `lib/content.ts`): the `ordinum` CLI, installed from source (`pip install -e`, not on PyPI); Python integration interfaces (the adapter contract, `ordinum init`, declarative TOML config, the `ordinum.agents` kit); and custom integrations written with pilots. It runs on your machine. Never imply a hosted service or dashboard, automatic code repair, or universal security coverage. The engineer changes the code; Ordinum checks the fixed build.
- **ROS 2 / Nav2 (simulation)** is Built & validated.
- **PocketBase (one host), the agents kit (planted fixtures only), MQTT (Eclipse Mosquitto with a NanoMQ edge bridge) and the four-process testbed** are Built, experimental.
- **Transactions and CI for your pipeline** are In progress (roadmap only). Native fuzzing, emulated firmware, device transport and physical hardware are Planned.
- Do not describe Ordinum as a robotics-only or "coverage-guided fuzzing for autonomous systems" company.

## Commands
- `npm run dev`: dev server on http://localhost:8080
- `npm run build`: production build. Run it before committing to catch type and build errors. Every page must stay static.
- `npm run start`: serve the production build (`-- -p 3000` for Playwright)
- `npm run lint`: ESLint (should report 0 errors)
- `npm run typecheck`: `tsc --noEmit`
- `npm test`: Playwright tests. It starts `next start` on port 3000 (`PLAYWRIGHT_PORT` overrides it), so run `npm run build` first. If Chromium's system libraries live outside the default path, set `PLAYWRIGHT_CHROMIUM_LIBS` (see `playwright.config.ts`).
  - `tests/site.spec.ts`:
    - all routes (`tests/routes.ts`) at 320–1920 px: one h1, no overflow, no console errors
    - nav, CTAs, redirects and hash forwarding, moved anchors
    - home structure (hero, demo, three steps, testing areas, two articles, one CTA band)
    - canonical, OG and JSON-LD (both co-founders), sitemap
    - evidence packages (only published files linked, SHA-256 match; both PocketBase terminal logs served)
    - `/demos` recording, Labs article order, the CI sentence, form labels
    - the Nav2 walkthrough without JS and by keyboard
    - the homepage word budget: at most 650 words (the copy pass cut the 778-word home page by about a third)
  - `tests/claims.site.spec.ts`: the forbidden-claims guard over rendered text, head, sitemap and source; the em-dash rule over rendered text and head; the LinkedIn allowlist for client JS.
- `npm run screenshots`: full-page and per-section screenshots of every page at 320–1920, with reduced and full motion. Set the output directory with `SHOTS_DIR`.

## Structure
- `app/`:
  - `layout.tsx`: fonts, root metadata from `seo` in `lib/content.ts`, and Organization + WebSite JSON-LD. The founders in the JSON-LD come from `about.founders`.
  - `globals.css`: Tailwind v4 `@theme` tokens
  - `not-found.tsx`
  - `opengraph-image.tsx`: generated at build, with a maturity strip built from the nav's Products group. `twitter-image.tsx` re-exports it.
  - `sitemap.ts`: iterates `pages`, Labs articles and evidence packages
  - `robots.ts`
  - `actions/request-demo.ts`: the server action that writes to `inquiries`
- **Page metadata:** use `pageMetadata(key)` and `homeMetadata` from `components/layout/metadata.ts` (and `routeMetadata` for Labs and evidence routes). They set the short title, description, own canonical, and full OG/Twitter titles from `seo.pages`.
  - Root metadata sets no OG/Twitter title, description or url, so it never stamps the home title onto inner pages.
  - A page that defines its own `openGraph` replaces the root object. It must repeat `type`/`siteName`/`locale`, and it loses the file-based image, so it must reference `/opengraph-image` and `/twitter-image` explicitly. The helper does both.
- `app/(site)/`: the route group. `layout.tsx` renders Navbar + `<main>` + Footer for every page; `page.tsx` is home; one folder per route.
- **Home** sections, in order (ids `top`, `demo`, `workflow`, `areas`, `labs`, `get-started`):
  1. Hero: what Ordinum does, who uses it, the delivery line; CTAs "Watch the demo" (`/demos#demo-flagship`) and "Talk to us"; status row with exact maturity labels.
  2. The flagship PocketBase recording (`components/sections/home/DemoVideo.tsx` with `FlagshipVideo`): a planted defect in our client path, found by Ordinum, removed by the engineer, the fixed build checked. One evidence link, no stats.
  3. Three workflow steps (`WORKFLOW_STAGES`): Connect and define rules, Run failure scenarios, Reproduce and check the fix.
  4. Testing areas and their integrations with maturity labels (`testingAreas`).
  5. Two Labs articles.
  6. One pilot invitation: the CTA band, whose second button is "Book a call" so nothing repeats the hero.
  - Keep home copy within the 650-word budget. Do not reintroduce the Nav2 showcase, a stats grid or a separate boundaries block on home.
- **`/products`**: one workflow (`#how-it-works`), what you install (`#install`), commands (`#capabilities`) and outputs (`#outputs`).
- **Product pages** (`components/sections/products/ProductArea.tsx`, copy in `productAreas`) answer, in order: what you can test and the failures it checks, what you connect, one example with one visual (`SequenceDiagram`), what you get, what works today, how to try it. Robotics carries the Nav2 example.
- **`/demos`**: the flagship recording inside the page header (`#demo-flagship`), with the failure and the result in plain words, captions, transcript and evidence links; then the other runs as compact cards.
- **`/security`**: scope, network isolation per integration (`#network`, the only place isolation is described; other pages link to it), operating limits, how a run works (`#architecture` with the seven-stage `#lifecycle`), `#reproduction`, what runs where, limitations, reporting a concern.
- **Labs**: the index lists published articles only. Articles (`components/sections/labs/ArticleView.tsx`) lead with the question and the result, then results in detail, system, method, evidence, limitations, related work, corrections and the AI methods note last.
- `components/sections/`: shared and home sections at the top level, page-specific sections in subfolders.
  - `PageHeader`: the inner-page h1, with optional `children` under the lede.
  - `NextPage`: follows `pageOrder` (products → software → agents → robotics → roadmap).
  - `CtaBand`: the sage pilot band closing each page except /contact. Pass `current` so a button never links to its own page (on /demos the secondary becomes "Book a call"). The optional `copy` prop takes page-specific text.
- `components/visuals/`: diagram and animated client components. `TraceTimeline` and `EvidenceReport` render real Nav2 trace and report data from `lib/evidence.ts`; `SequenceDiagram`, `Lifecycle` and `PlatformMap` render copy from `lib/content.ts`. Lazy-load heavy interactive visuals below the fold, and keep an accessible SSR fallback.
- `components/layout/`:
  - `Navbar`: Products (disclosure), Demos, Ordinum Labs, Resources (disclosure), Company (disclosure); primary CTA "Talk to us" → `/contact#talk`, plus "Book a call".
  - `MobileMenu`, `NavDisclosure`, `Footer` (one-line thesis, link columns, Terms + Privacy)
  - `HashRedirect`: forwards old `/#section` links to their pages (`#technology` and `#stack` → `/security#architecture`)
  - `metadata.ts`
- `components/ui/`: primitives (Section, Container, Topline, Kicker, Heading, Button, Reveal). Reuse these.
- `components/brand/OrdinumMark.tsx`: the Saturn logo as a single SVG path. Do not modify it.
- `components/forms/DemoForm.tsx`: the contact form, which works without JS.
  - Visible fields: work email*, company, "What are you working on?" and message.
  - Technology category and request type sit inside a closed "More details" disclosure.
  - It links to /privacy.
- `lib/content.ts`: ALL site copy and numbers live here. Edit copy here, not in components. It includes:
  - `seo`, `nav`, `pages`, `pageOrder`, `hero`, `home`, `ctaBand`, `delivery`, `testingAreas`
  - `MATURITY_LABELS`, `EVIDENCE_CLASS_LABELS`, `integrations`, `MQTT_SETUP`, `demoWalkthrough`, `flagship`, `flagshipVideo`, `demos`
  - `HOSTED_CI_STATUS`, `TEST_SUITE_STATUS`, `FLAGSHIP_LABEL`, `AI_METHODS_NOTE`: use verbatim
  - `security`, `technology`, `lifecycle`, `research`, `contact`, `legal`, `footer`
  - `FACT_SOURCE`: facts checked against product head `44284b0`; evidence pinned at the stable checkpoint `768a9b5` (checked 1 November 2026). The research summary reflects `124dde072`, with updates noted.
- `lib/labs.ts`: typed Labs articles. `lib/evidence-packages.ts`: the expected files of each `/evidence/<case>` page; `lib/evidence-files.ts` links a file only if it exists at build time, with its SHA-256.
- `lib/evidence.ts`: typed data copied from real artifacts in the product repo (`armaansingla14/ordinum`, branch `ordinum-2`, private). The artifacts were copied at `c25ba4f` and are unchanged at `768a9b5`; the header lists the source files. Do not edit a value without re-checking the source file.
- `lib/schema.ts`: the zod schema shared by the form and the server action. Option allowlists come from `lib/content.ts`.
- `lib/notify.server.ts`: the Resend notification (server-only)
- `lib/supabase/`: the server client and DB types
- `supabase/migrations/`: the database schema (see Database)
- `tests/`: Playwright specs and `routes.ts`. `playwright.config.ts` is at the root.
- `@/*` is aliased to the repo root (`@/components/...`, `@/lib/...`).

## Conventions
- Server components by default; `"use client"` only for interactive or animated pieces.
- Respect `prefers-reduced-motion` (MotionConfig `reducedMotion="user"`). Animate transform and opacity only.
- Lime `#c1e29e` is the accent, used sparingly. Orange `#ffa779` is reserved for failures and invariant violations (and the planted-defect banner on the recording). Corners are square, with hairlines and numbered mono kickers. Do not add new gradients or glass effects.
- **Copy:** short, direct sentences. Headings name a capability, a result or a customer task, never the site's own honesty ("Honest status", "labeled for what it is" and similar are banned). No em dashes anywhere visible, including titles, OG text and aria labels. State each qualification once, where its claim appears; details live on the evidence pages and in Labs. CTA labels are exactly "Talk to us", "Book a call" and "Watch the demo". Say "ground-truth checks", not "independent checks".
- **Integration maturity:** use exactly `MATURITY_LABELS`. Never write a bare "Implemented".

  | Label | Marker |
  |---|---|
  | Built & validated | solid lime |
  | Built, experimental | outlined lime |
  | In progress | dashed lime |
  | Planned | dashed steel |

  Always show an integration's scope with its label, for example "simulation only".
- **Evidence labels:** use exactly `EVIDENCE_CLASS_LABELS`: Real external target, Controlled positive control, Harness artifact, Expected behavior, Unresolved, and Independently verified defect. None of the last kind exist, so never render one.
- Conceptual visuals carry a "CONCEPTUAL" tag. Visuals built from real data cite the artifact path.
- Diagrams must be legible at 320px, and keyboard-usable if interactive.

## Claims
- Never invent facts, customers, partners, pilots, conversations, vulnerabilities, endorsements or metrics. Every technical claim must trace to the product repo at `FACT_SOURCE.commit` / `FACT_SOURCE.evidenceCommit`, or to a founder-confirmed fact. Planned is not implemented.
- Pilot and design-partner copy is an invitation. Never claim existing customers, partners, users or ongoing conversations.
- The v1 benchmark results were withdrawn. None of their numbers may appear. The only exception is the clearly labeled withdrawn-results note in the Labs research summary inside `[data-withdrawn]`, which currently contains no numbers.
- Do not use any of these:
  - "parts built" progress ratios
  - any test figure other than `TEST_SUITE_STATUS`: "2229 passed, 32 skipped (local full suite at product commit 768a9b5)". The old "523 passed, 1 skipped" and the count 764 are retired.
  - reuse percentages
  - "beats random" or superiority over baselines
  - comparisons with named competitors
  - "first/only/most advanced/industry-leading/guaranteed" language

  Do not caricature other approaches. `tests/claims.site.spec.ts` enforces the list.
- **CI:** use only `HOSTED_CI_STATUS`: "Ordinum's own repository runs its light test jobs on GitHub Actions, and they pass. CI for your pipeline: templates exist, not yet run on a hosted runner." `ordinum ci` replays saved cases locally.
- **MQTT:** use `MQTT_SETUP`. Eclipse Mosquitto 2.0.22 is the system under test (dynamic security and persistence) with a NanoMQ 0.25.7 edge bridge, on by default, both pinned by digest. The bridge has been stable in 80 of 80 rounds. Limits: the bridge session is not durable (edge deliveries are positive evidence only), the edge broker allows anonymous local clients on 127.0.0.1, and there is no egress firewall. Results: 0 FAIL so far (latest blind campaign with the bridge on: 612 executions, 0 confirmed). The bridge is not "In progress".
- **Network isolation:** describe it only in the per-integration table on `/security#network` (`security.network`). PocketBase binds 127.0.0.1 inside `unshare -rn`; Nav2 uses Docker `--network none`; MQTT uses a per-session Docker network with ports on 127.0.0.1 only and no egress firewall; the testbed uses Unix sockets and `unshare -rn` when available, otherwise an audit hook (not a sandbox); the agents kit makes no isolation claim. The non-Docker workflow showed 0 non-local network events offline; Docker targets were not tested offline; it is not an air gap. Never generalize ("targets run with no network").
- **Reproduction:** do not claim "deterministic replay" beyond what the repo supports.
  - Exact replay works only on deterministic targets: the toy robot, and the testbed's lockstep build.
  - Nav2 and MQTT use statistical reproduction.
- **Flagship run:** the PocketBase run is a planted defect in our own client path, labeled `FLAGSHIP_LABEL` ("Planted defect in our client path, not a PocketBase bug."). The "fix" is the same harness without the planted cache. Copy says the engineer changes the code and Ordinum checks the fixed build; never imply Ordinum repairs code.
- **Nav2 violations:** the three reproduced Nav2 violations are harness, oracle or configuration artifacts, not Nav2 defects. Never relabel them.
- **Agents and transactions:** agents means the `ordinum.agents` kit plus planted fixtures we wrote; no third-party agent application has been tested. The newer agents and transactions work is unmerged branch work: transactions stay a roadmap entry with no numbers, and no milestone names.
- **Recording:** the flagship PocketBase recording (1:35, captions and transcript in `public/media`) is published; "Watch the demo" → `/demos#demo-flagship`. There is no Nav2 video; `demoPage.media` stays disabled.
- **Private repo:** do not copy files, reports, traces or logs from the private product repo into this repo or `public/` without separate founder authorization. The files in `public/evidence/` were exported by a founder-run script; both PocketBase terminal logs are committed (the `.gitignore` exception `!public/evidence/**/*.log`).
- **Team:** two co-founders, Armaan Singla and Aarav Singla. Both profiles, including Aarav's LinkedIn (`/in/aaravsinglaa`), were approved for publication on 2026-10-24, so `ABOUT_PROFILES_PENDING` is false. Any profile with `pendingConfirmation: true` must not be rendered.
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
