# Ordinum Website

Marketing site for [ordinum.org](https://ordinum.org), the system of record for AI decisions.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/) for the early-access waitlist
- Hosted on [Vercel](https://vercel.com/)

## Local development

Requires Node.js 18+.

```sh
npm install
cp .env.example .env   # then fill in the Supabase values
npm run dev            # http://localhost:8080
```

Other scripts:

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run build`   | Production build to `dist/`   |
| `npm run preview` | Serve the production build    |
| `npm run lint`    | Run ESLint                    |

## Deployment

Every push to `main` deploys to production on Vercel. Pushes to other branches get a preview URL.

Environment variables (set in Vercel → Project → Settings → Environment Variables):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Database

Schema lives in [`supabase/migrations`](supabase/migrations). The `waitlist` table accepts anonymous inserts only; reads, updates, and deletes are blocked for public clients. View signups in the Supabase dashboard.
