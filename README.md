# Ordinum Website

Marketing site for [ordinum.org](https://ordinum.org). Ordinum is a local testing tool for engineers: connect a system, define the rules it must obey, run controlled failure scenarios, reproduce what fails and check the fix. It ships as a CLI (`ordinum`, installed from source) and Python integration interfaces, with custom integrations written alongside pilot teams, and runs on your machine. It is research-stage:
- ROS 2 / Nav2 in simulation is Built & validated.
- PocketBase (one host), the `ordinum.agents` kit (planted fixtures only), MQTT (Eclipse Mosquitto 2.0.22 with a NanoMQ 0.25.7 edge bridge, on by default) and a four-process testbed are Built, experimental.

**Pages:**
- home
- home: what Ordinum does and how it is delivered, the flagship recording, three workflow steps, testing areas with maturity labels, two Labs articles, one pilot invitation
- **Products:** `/products` (one workflow `#how-it-works`, what you install, commands, outputs), `/products/software`, `/products/agents`, `/products/robotics`, `/roadmap`
- **Demos:** `/demos` (the flagship PocketBase recording at the top, `#demo-flagship`, then the other runs) and `/demos/nav2-walkthrough` (the step-by-step Nav2 run, formerly `/demo`)
- **Ordinum Labs:** `/labs` (published articles only) and `/labs/[slug]` (typed articles in `lib/labs.ts`)
- **Evidence packages:** `/evidence/[case]` (manifest in `lib/evidence-packages.ts`; files in `public/evidence/<case>/`)
- `/security` (network isolation per integration `#network`, operating limits, how a run works `#architecture` / `#lifecycle` / `#reproduction`), `/about`, `/contact`
- `/terms` and `/privacy`: interim legal pages (see [Legal pages](#legal-pages))
- Old URLs (`/product`, `/technology`, `/research`, `/vision`, `/demo`, `/solution`, `/how-it-works`, `/problem`) redirect in one 308 hop (`next.config.ts`).

All copy lives in `lib/content.ts`. See [`CLAUDE.md`](CLAUDE.md) for the project structure, conventions and the rules for technical claims.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router) + React 19 + TypeScript (strict)
- [Tailwind CSS v4](https://tailwindcss.com/) (design tokens in `app/globals.css` via `@theme`)
- [Motion](https://motion.dev/) (`motion/react`) for animation
- [Supabase](https://supabase.com/) for contact-form inquiries (written by a server action)
- [Resend](https://resend.com/) for optional new-inquiry email notifications (plain `fetch`, no SDK)
- [Playwright](https://playwright.dev/) for smoke tests, claims checks and screenshots
- Hosted on [Vercel](https://vercel.com/)

## Local development

Requires Node.js 20+.

```sh
npm install
cp .env.example .env   # then fill in the Supabase values (Resend is optional)
npm run dev            # http://localhost:8080
```

Other scripts:

| Command               | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `npm run build`       | Production build                                                |
| `npm run start`       | Serve the production build                                      |
| `npm run lint`        | Run ESLint                                                      |
| `npm run typecheck`   | Run `tsc --noEmit`                                              |
| `npm test`            | Playwright tests against `next start` on port 3000 (build first) |
| `npm run screenshots` | Full-page and per-section screenshots (`SHOTS_DIR` sets output; `SHOTS_ROUTES`, `SHOTS_WIDTHS`, `SHOTS_MODES`, `SHOTS_EXTRAS=0` filter) |

First Playwright run: `npx playwright install chromium`. If Chromium's system libraries are outside the default path, set `PLAYWRIGHT_CHROMIUM_LIBS` (see `playwright.config.ts`). If port 3000 is busy, set `PLAYWRIGHT_PORT`.

**What `npm test` covers:**
- every route (`tests/routes.ts`) at seven widths from 320 to 1920 px: one `h1`, no console errors, no horizontal overflow
- the nav disclosures (keyboard open, Escape returns focus, outside click and focus-out close, not hover-only) and the mobile accordion
- the home structure (hero with delivery line, recording, three steps, testing areas, two articles, one CTA band) and the moved anchors (`#how-it-works` on `/products`; `#architecture`, `#lifecycle`, `#reproduction`, `#network` on `/security`)
- every internal link on every route returns 200 without a redirect; old URLs redirect in one hop; old `/#section` links
- titles (home is exactly "Ordinum", others end " | Ordinum"), canonical URLs, social metadata, JSON-LD with both co-founders, sitemap and robots, the 404 page
- evidence packages: only published files are linked, and each matches its SHA-256; both PocketBase terminal logs are served
- the `/demos` recording (captions, transcript, decodes, never autoplays), Labs articles (question and result first, author, date, methods note, evidence links), the CI sentence
- labels on the contact form; the Nav2 walkthrough steps without JavaScript and by keyboard
- a homepage word budget: at most 650 words (the copy pass cut the 778-word home page by about a third)
- a claims guard (`tests/claims.site.spec.ts`), which fails on withdrawn benchmark numbers and on banned phrasing (including "independent review", treasury/M17 numbers, retired test counts and meta headings) in rendered pages, metadata and source files, and on any em dash in rendered text or `<head>`

## Deployment

Every push to `main` deploys to production on Vercel. Pushes to other branches get a preview URL.

Environment variables are server-only. Set them in Vercel → Project → Settings → Environment Variables.

| Variable | Required | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | yes | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | yes | Publishable (anon) key; the server action inserts into `inquiries` |
| `RESEND_API_KEY` | no | Turns on new-inquiry emails. When it is unset, notifications are skipped and a single log line is written that contains no submission content. |
| `INQUIRY_NOTIFY_TO` | no | Recipient(s) for notifications, comma-separated. Defaults to `armaan@ordinum.org`. |
| `INQUIRY_NOTIFY_FROM` | no | Sender. Defaults to Resend's shared test sender; production should use an address on a domain verified in Resend. |

A notification failure never fails a submission. Submission content is never logged. Tests may only send to Resend's test recipient, `delivered@resend.dev`.

## Database

The schema lives in [`supabase/migrations`](supabase/migrations).

**`inquiries`** (from [`20261024000000_inquiries.sql`](supabase/migrations/20261024000000_inquiries.sql)) stores contact-form submissions. It is append-only, so repeat inquiries from the same email are kept.
- **Columns:** `email`, `company`, `working_on`, `message`, `technology_category`, `request_type` and `source`. Length limits are enforced by CHECK constraints.
- **Access:** RLS allows anonymous `INSERT` only. There is no `SELECT` policy, and updates and deletes are denied. Read submissions in the Supabase dashboard.
- **Rate limit:** a `BEFORE INSERT` trigger rejects a sixth insert for the same `lower(email)` within one hour, with SQLSTATE `P0429`. The form shows a "try again later" message when that happens.
- **Spam:** the server action also uses a honeypot field and a minimum fill time.

**`waitlist`** is the previous contact table. Its unique email index meant it silently dropped repeat messages. Its data is preserved and untouched, but the site no longer writes to it.

Apply the `inquiries` migration to the Supabase project before deploying the form that writes to it.

## Legal pages

`/terms` (Website Terms) and `/privacy` (Privacy Notice) are **interim pages, approved by the founders on 25 October 2026**, pending legal review. Each page shows that status at the top, and both are linked from the footer and the contact form. The text lives in `legal` in `lib/content.ts`, and it replaces the old Terms of Service, which remain in git history.

Do not change their wording without founder approval (ideally after legal review).

## Evidence and provenance

Technical statements and proof visuals are based on the Ordinum product repository (branch `ordinum-2`). That repository is private and is not linked here.
- **`FACT_SOURCE` in `lib/content.ts`:** facts checked against product head `44284b0`; evidence pinned at the stable checkpoint `768a9b5` (checked 1 November 2026). The research summary in Labs reflects `124dde072`, with updates noted.
- **Test figure:** `TEST_SUITE_STATUS`, "2229 passed, 32 skipped (local full suite at product commit 768a9b5)". **CI:** `HOSTED_CI_STATUS`, "Ordinum's own repository runs its light test jobs on GitHub Actions, and they pass. CI for your pipeline: templates exist, not yet run on a hosted runner."
- **`flagship` in `lib/content.ts`:** the PocketBase planted-defect run of 1 November 2026 at `768a9b5`. It is always labeled "Planted defect in our client path, not a PocketBase bug." The fixed build is the same harness without the planted cache: the engineer changes the code and Ordinum checks the fixed build.
- **[`lib/evidence.ts`](lib/evidence.ts):** data copied from real Nav2 and toy artifacts at commit `c25ba4f`, unchanged at `768a9b5`. Its header lists the source files.
- **Evidence packages:** `lib/evidence-packages.ts` lists the files each `/evidence/<case>` page expects. The files are exported into `public/evidence/<case>/` by a founder-run, founder-authorized script; never copy them by hand. A file is linked only if it exists at build time, with its size and a SHA-256 computed at build; otherwise the page says "Artifact pending publication". Terminal logs are committed through the `.gitignore` exception `!public/evidence/**/*.log`.
- **Media:** the flagship PocketBase recording (1:35, real terminal output, captions and transcript) is in `public/media/` and plays on `/demos#demo-flagship` and the home page. CTAs are "Watch the demo", "Talk to us" and "Book a call". There is no Nav2 video; `demoPage.media` stays disabled.
