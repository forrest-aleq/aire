# Aire

Find sellers before anyone else does.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Routes

- `/` — Landing page
- `/login` — Sign in (any email/password works in this build)
- `/signup` — Request access
- `/today` — Today's leads (default after sign-in)
- `/situations` — All 16 categories Aire watches
- `/outreach` — Letters & texts going out
- `/calling` — Live dialer with coaching
- `/front-desk` — AI phone that takes seller callbacks
- `/pipeline` — Kanban of every lead in motion
- `/market` — Your territory dashboard
- `/leads/[id]` — Lead detail page
- `/kit` — Design kit (tokens, primitives, patterns)

## Auth

This build uses a cookie-based mock auth. The `/api/login` route accepts any
non-empty email/password and sets an `aire-session` cookie. Middleware at the
root checks this cookie on every `/today`, `/leads/*`, etc. request and bounces
unauthenticated users to `/login`. Replace with real auth (NextAuth, Clerk,
Supabase, your own) when you're ready.

## Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- lucide-react for icons
- Inline styles + design tokens (no Tailwind/CSS framework)
- Google Fonts: Newsreader (serif), Inter Tight (sans), JetBrains Mono

## Where things live

```
app/
  page.tsx                  landing
  login/                    sign in
  signup/                   request access
  api/login, api/logout     cookie auth endpoints
  (app)/
    layout.tsx              sidebar + topbar shell (auth-gated)
    today/                  InboxPage
    leads/[id]/             LeadDetailPage
    situations, outreach, calling, front-desk, pipeline, market

components/
  primitives.tsx            Tag, SituationTag, Score, Btn, Stat, etc.
  house.tsx                 procedural SVG house
  map.tsx                   territory map
  sidebar.tsx               nav
  topbar.tsx                search + new lead

lib/
  tokens.ts                 colors, fonts
  data.ts                   LEADS, SITUATION, PIPELINE_*

middleware.ts               auth redirect logic
```
