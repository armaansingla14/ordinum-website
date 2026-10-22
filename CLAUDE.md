# Ordinum Website

Marketing site for ordinum.org. Vite + React 18 + TypeScript + Tailwind + shadcn/ui, deployed on Vercel. Repo is public.

## Commands
- `npm run dev`: dev server on http://localhost:8080
- `npm run build`: production build (run before committing to catch type/build errors)
- `npm run lint`: ESLint (should report 0 errors)

## Structure
- `src/pages/`: one component per route; routes are declared in `src/App.tsx`
- `src/components/`: site components (Header, Footer, Layout, WaitlistForm, OrdinumLogo, RingBackground)
- `src/components/ui/`: shadcn/ui primitives; prefer reusing these over new primitives
- `src/integrations/supabase/`: Supabase client and generated DB types
- `supabase/migrations/`: database schema (the `waitlist` table, anonymous insert-only via RLS)
- `@/` is aliased to `src/`

## Deployment
- Pushing to `main` deploys to production on Vercel; other branches get preview URLs.
- `vercel.json` rewrites all paths to `index.html` so client-side routes survive refreshes.
- Env vars `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` live in `.env` locally (gitignored, see `.env.example`) and in Vercel project settings.

## Rules
- Never commit `.env` or any secrets.
- The site must contain no references to Lovable (no `lovable-tagger`, meta tags, or links).
- Contact email is armaan@ordinum.org; canonical domain is https://ordinum.org.
