# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev      # next dev — http://localhost:3000
npm run build    # next build (uses incremental tsconfig + tsbuildinfo)
npm run start    # next start (after build)
npm run lint     # next lint
```

No test runner is configured. TypeScript is `strict: false` (see `tsconfig.json`); type-checking happens implicitly via `next build`.

## What this product is

Aire is a positioning prototype for an "acquisition intelligence platform" — a SaaS for real-estate wholesale/fix-and-flip operators. Two ideas drive every screen:

1. **Six proprietary "moat" signals** — pre-event categories no other vendor surfaces at scale (pre-probate, pre-divorce, incarceration risk, old-roof permit, drive-by computer vision, estate-sale activity). Plus ten standard-coverage categories.
2. **TCPA-safe AI workflow** — Aire does NOT autonomously cold-call sellers with synthetic voice (that's not legally deployable post-FCC Feb 2024 ruling). Mailers (Lob) and human-dialed calls are the outbound; AI runs inbound (Front Desk on Retell), as a whisper coach during human dials, and for AI-drafted scripts the operator approves before send. Every screen reinforces this.

Pricing ladders by territory and exclusivity, not feature gating: Operator $499/city, Operator + Exclusive $2,500/city, Regional $1,500/state, Regional + Exclusive $7,500/state, National $4,000, Enterprise custom. The moat signals are exclusive — one operator per territory.

## Architecture

Next.js 14 App Router app with **mock cookie auth**, **no CSS framework** (inline styles + tokens), **mobile-responsive via a `useIsMobile` hook**, and **a single in-memory seed dataset** every page renders against. There is no backend, no DB, no real auth — this is a high-fidelity product prototype.

### Auth boundary

Auth is enforced in `middleware.ts`, not in pages. The pattern is:

1. `POST /api/login` (`app/api/login/route.ts`) accepts any non-empty email/password and sets an `aire-session` cookie (value = the email).
2. `middleware.ts` defines a `PROTECTED` prefix list **and** a matching `config.matcher`. Both must be updated together when adding a gated route.
3. Public pages (`/`, `/login`, `/signup`, `/kit`) live in `app/` directly. Authenticated pages live in the **`app/(app)/` route group**, which shares a chrome via `app/(app)/layout.tsx` → `<AppShell email={...}>`.

When you add a new authenticated page, put it under `app/(app)/<route>/` **and** add the prefix to both `PROTECTED` and `matcher` in `middleware.ts` — being inside `(app)/` does not by itself gate the route.

The `(app)/layout.tsx` is a server component that reads cookies and passes `email` to `<AppShell>` (`components/app-shell.tsx`, client). `AppShell` owns mobile-drawer state and mounts `<Sidebar/>`, `<TopBar/>`, `<Toaster/>`, and `<CommandPalette/>`.

### Routes

- `/` — Landing (six-tier pricing, signal taxonomy, territory exclusivity pitch)
- `/login` — Mock auth (any email/password)
- `/signup` — Territory request form
- `/kit` — Design kit (tokens + primitives, public)
- `/today` — **Acquisition Inbox** (label "Inbox" in nav)
- `/situations` — **Signal Engine** (label "Signals")
- `/outreach` — **Outreach Engine** (mailers + consent-gated SMS)
- `/calling` — **Dialer** with AI whisper coach (label "Dialer")
- `/front-desk` — Inbound AI receptionist
- `/pipeline` — Kanban
- `/market` — **Territory** dashboard (label "Territory")
- `/leads/[id]` — Lead detail

Routes are stable; sidebar **labels** were rewritten to operator vocabulary. If you rename a route, also update `NAV_COUNTS` in `lib/data.ts`, the palette in `components/command-palette.tsx`, and `middleware.ts`.

### Shared platform pieces

| Concern               | File                                  | Notes |
|-----------------------|---------------------------------------|-------|
| Design tokens         | `lib/tokens.ts`                       | `C` palette, `SERIF`/`SANS`/`MONO` |
| Primitives            | `components/primitives.tsx`           | `Tag`, `SituationTag`, `Score`, `Btn`, `Stat`, `PageTitle`, `SectionHeader` |
| Brand wordmark        | `components/wordmark.tsx`             | Italic serif "Aire" + accent dot; `size`/`variant`/`mark` |
| App chrome            | `components/app-shell.tsx`            | Client wrapper that owns drawer state + mounts Toaster/Palette |
| Mobile drawer + chip  | `components/sidebar.tsx`              | Reads `NAV_COUNTS`; derives identity from email |
| ⌘K search + ⌘K hint   | `components/topbar.tsx`               | Search bar is a button that opens the palette |
| Command palette       | `components/command-palette.tsx`      | `openCommandPalette()` singleton; pages + recent leads + actions |
| Toast system          | `components/toast.tsx`                | `toast({ title, sub?, tone? })` singleton; mounted by `AppShell` |
| Onboarding modal      | `components/onboarding.tsx`           | 4-step intro on first-ever sign-in; sets `aire-onboarded` localStorage flag and suppresses the welcome toast for that session |
| Mobile detection      | `lib/hooks.ts` — `useIsMobile(720)`   | SSR-safe; default breakpoint 720px |
| Relative time         | `lib/hooks.ts` — `useRelativeTime`    | Auto-ticks every 30s for "X min ago" |
| Seed data             | `lib/data.ts`                         | `SITUATION`, `LEADS`, `NAV_COUNTS`, `SITUATION_KEYS_MOAT/STANDARD`, `PIPELINE_*` |

### SITUATION taxonomy

`SITUATION` in `lib/data.ts` is the canonical map of all signals. Each entry has:

- `label` — operator-correct display name (e.g. "Pre-probate match", not "Recently inherited")
- `icon` — lucide icon
- `tier: 'moat' | 'standard'` — drives proprietary vs commodity treatment in `/situations` and `/market`
- `priority: boolean` — legacy alias (`true` iff `tier === 'moat'`); used by `SituationTag` styling
- `reason` — operator-facing why-this-signal-matters
- `source` — operator-facing data provenance (e.g. "Obituary scraping + ownership cross-ref")

If you change a key, update every `LEADS[*].situations`/`primary` reference that uses it. The six moat keys: `inherited-recent`, `separating`, `owner-in-jail`, `old-roof`, `vacant-damaged`, `estate-sale`. Use `SITUATION_KEYS_MOAT` / `SITUATION_KEYS_STANDARD` for grouping.

### Styling system

There is no Tailwind, CSS-in-JS library, or CSS module system. All styling is **inline `style={{}}` objects** that reference tokens from `lib/tokens.ts`. Mobile responsiveness comes from `useIsMobile()` returning a boolean that conditionals inline styles (grid-template-columns, padding, font-size). No media queries.

When building UI, reuse the primitives in `components/primitives.tsx` (`Tag`, `SituationTag`, `Score`, `Btn`, `Stat`, `PageTitle`, `SectionHeader`) before reaching for raw `<div>`s — they encode the visual language. Match their inline-style + tokens approach in new components rather than introducing a new styling mechanism.

The `/kit` route (`app/kit/page.tsx`) is a living reference page that renders every token and primitive — read it (or run the app and open `/kit`) before designing new UI to see what already exists. If you add a primitive or token, surface it on `/kit` so the kit stays the source of truth.

### Compliance positioning (matters for copy)

Every outbound-facing screen reinforces the TCPA-safe stance:

- `/calling` footer: "Human-dialed · AI whispers, never speaks for you."
- `/outreach`: "Mail-first, consent-gated SMS. No autonomous AI calling."
- `/front-desk` subtitle: "Inbound only. Sellers call your tracked number…"
- `/situations` footer: "Public records only. No purchased PII."

When adding outbound flows, keep this posture: AI drafts, operator approves and sends; cold AI calling is off the table.

### Lead-aware dialer

`/calling` is **not** a static demo — it reads `?lead=`, `?tone=`, and optional `?contact=` from the URL and renders the matching lead, primary contact (or `?contact=N` for the picked relative), and a script generated from a signal-archetype template (empathetic / practical / neighborly, mapped from caring / direct / family tone). Substitution vars: `${first}`, `${street}`, `${operator}` (the operator's first name from the cookie email).

The marquee lead **L-2847** (Margaret Holloway / Daniel) has a hand-tuned script preserved as a special case — but only when the operator picks the caring tone. Direct and family-focused fall through to the generic archetype.

Wiring: every `Call …` button across `/leads/[id]` builds the URL with `URLSearchParams` and routes. Don't duplicate that pattern — call `onOpenDialer(tone, contactIdx?)` from the lead detail.

### Cross-page navigation contract

- `/situations` row click → `/today?signal={key}` (filtered Inbox with a clearable chip).
- `/today` reads `?signal=` and filters `LEADS.filter(l => l.situations.includes(signal))`.
- `/pipeline` card click → `/leads/[leadId]` when `PIPELINE_CARDS[i].leadId` exists; otherwise a toast saying the card was added manually.
- `/leads/[id]` opens the dialer with current `?tone=` from the local state and optional `?contact=N` from the per-contact phone button.

### Path alias

`@/*` resolves to the repo root (see `tsconfig.json`). Imports use `@/lib/...`, `@/components/...`.
