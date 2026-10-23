# Ordinum Website

Marketing site for [ordinum.org](https://ordinum.org). Ordinum is coverage-guided fuzzing and verification infrastructure for autonomous systems.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router) + React 19 + TypeScript (strict)
- [Tailwind CSS v4](https://tailwindcss.com/) (design tokens in `app/globals.css` via `@theme`)
- [Motion](https://motion.dev/) (`motion/react`) for animation
- [Supabase](https://supabase.com/) for demo requests (written by a server action)
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

Schema lives in [`supabase/migrations`](supabase/migrations). The `waitlist` table accepts anonymous inserts only; reads, updates, and deletes are blocked for public clients. View signups in the Supabase dashboard.
