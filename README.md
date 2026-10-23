# Ordinum Website

Marketing site for [ordinum.org](https://ordinum.org). Ordinum is building continuous adversarial testing and verification infrastructure for interconnected software and hardware systems. It is research-stage; the first implemented integration is ROS 2 / Nav2 in simulation.

Pages: home, `/product`, `/technology`, `/research`, `/vision`, `/about`, `/contact` and `/terms`. All copy lives in `lib/content.ts`. See [`CLAUDE.md`](CLAUDE.md) for the project structure, conventions and the rules for technical claims.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router) + React 19 + TypeScript (strict)
- [Tailwind CSS v4](https://tailwindcss.com/) (design tokens in `app/globals.css` via `@theme`)
- [Motion](https://motion.dev/) (`motion/react`) for animation
- [Supabase](https://supabase.com/) for contact-form submissions (written by a server action)
- [Playwright](https://playwright.dev/) for smoke tests and screenshots
- Hosted on [Vercel](https://vercel.com/)

## Local development

Requires Node.js 20+.

```sh
npm install
cp .env.example .env   # then fill in the Supabase values
npm run dev            # http://localhost:8080
```

Other scripts:

| Command               | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `npm run build`       | Production build                                                |
| `npm run start`       | Serve the production build                                      |
| `npm run lint`        | Run ESLint                                                      |
| `npm run typecheck`   | Run `tsc --noEmit`                                              |
| `npm test`            | Playwright smoke tests against `next start` on port 3000 (build first) |
| `npm run screenshots` | Full-page and per-section screenshots (`SHOTS_DIR` sets output) |

First Playwright run: `npx playwright install chromium`.

## Deployment

Every push to `main` deploys to production on Vercel. Pushes to other branches get a preview URL.

Environment variables (server-only; set in Vercel → Project → Settings → Environment Variables):

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

## Database

Schema lives in [`supabase/migrations`](supabase/migrations). The `waitlist` table stores contact-form submissions and accepts anonymous inserts only; reads, updates, and deletes are blocked for public clients. View submissions in the Supabase dashboard.

The contact form's optional technology category, request type and hardest-failure fields are stored in the nullable `technology_category`, `request_type` and `hardest_failure` columns added by [`20261023000200_contact_form_fields.sql`](supabase/migrations/20261023000200_contact_form_fields.sql). The migration is additive (existing rows and RLS policies are unchanged). Apply it to the Supabase project before deploying a form that sends these fields.

## Evidence and provenance

Technical statements and proof visuals are based on the Ordinum product repository (branch `ordinum-2`; not linked here until the founder confirms it is public). [`lib/evidence.ts`](lib/evidence.ts) holds data copied from real experiment artifacts in that repository; its header lists the commit and the source files. `FACT_SOURCE` in `lib/content.ts` records the commit the site copy was checked against.
