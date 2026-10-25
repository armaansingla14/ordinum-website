# Ordinum Website

Marketing site for [ordinum.org](https://ordinum.org). Ordinum builds adversarial testing and verification for systems built from interacting parts. It finds failures that only appear when those systems interact. It is research-stage:
- The first validated integration is ROS 2 / Nav2 in simulation.
- An MQTT broker adapter and a four-process cross-system testbed are experimental.

**Pages:**
- home
- `/demo`: a step-by-step walkthrough of a real Nav2 run. It is not in the main nav; the hero and calls to action link to it.
- `/product`, `/technology`, `/research`, `/vision`, `/about`, `/contact`
- `/terms` and `/privacy`: interim legal pages (see [Legal pages](#legal-pages))

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
| `npm run screenshots` | Full-page and per-section screenshots (`SHOTS_DIR` sets output) |

First Playwright run: `npx playwright install chromium`. If Chromium's system libraries are outside the default path, set `PLAYWRIGHT_CHROMIUM_LIBS` (see `playwright.config.ts`).

**What `npm test` covers:**
- every route at seven widths from 320 to 1920 px: one `h1`, no console errors, no horizontal overflow
- navigation, legacy redirects and old `/#section` links
- canonical URLs and social metadata, the sitemap and robots, the 404 page
- labels on the contact form
- the `/demo` steps: present without JavaScript and reachable by keyboard
- a homepage word budget: at most 960 words, which is 60% of the 1,600-word baseline before the focus pass
- a claims guard (`tests/claims.site.spec.ts`), which fails on withdrawn benchmark numbers and on banned phrasing in rendered pages, metadata and source files

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
- **`FACT_SOURCE` in `lib/content.ts`:** records the commit the site copy was checked against, currently `124dde072` (checked 24 October 2026).
- **[`lib/evidence.ts`](lib/evidence.ts):** holds data copied from real experiment artifacts at commit `c25ba4f`, which are unchanged at `124dde072`. Its header lists the source files.
- **Not published:** the original HTML reports and any demo video, until the founder authorizes them separately.
