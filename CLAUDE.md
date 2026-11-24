# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

One Render web service serves two independent React + Vite apps from a single Express process:

- **Corner Shop** (repo root: `src/`, `server/`) — grocery store at `/`. Express API + Neon Postgres.
- **Skyline Flights** (`apps/flights/`) — flight booking + airport-store pre-orders at `/flights/`. Client-only: mock data + localStorage, no backend or auth yet. Has its own `package.json`, `tsconfig.json`, `vite.config.ts` and lockfile.

The two apps share nothing at runtime; they link to each other with plain `<a href>` (full page loads).

## Commands

Corner Shop (root):
- `cp .env.example .env`, set `DATABASE_URL` (Neon), then `npm run dev` → http://localhost:3000. Vite runs as middleware inside Express; tables are created and seeded on boot (`server/migrate.ts`, idempotent).
- `npm run build` — `tsc --noEmit`, root Vite build, installs + builds `apps/flights`, then bundles `server/index.ts` to `dist/server.js` with esbuild. `npm start` runs the production bundle.

Skyline Flights (`apps/flights/`, run `npm install` there first):
- `npm run dev` → http://localhost:5173/flights/ (Vite `base` is `/flights/`, so the bare root 404s).
- `npm run build` — `tsc --noEmit && vite build`, outputs to `../../dist/client/flights`.

There is no test or lint setup in either app. Use `./node_modules/.bin/tsc --noEmit` (not `npx tsc`, which resolves to an unrelated npm package) for typechecking.

## Deployment

`render.yaml` defines one Node service: `npm ci --include=dev && npm run build`, `npm start`, health check `/api/health`, auto-deploy on commit to `main`. Requires `DATABASE_URL` in the Render dashboard; without it the server fails on boot and **both** apps go down.

Build order matters: root `vite build` has `emptyOutDir`, so it must run before the flights build writes into `dist/client/flights`. In production `server/index.ts` serves `dist/client` statically, then a `/flights` handler returns `flights/index.html` for extensionless GETs (SPA fallback), then the root `index.html` fallback. Keep `/flights` before the root fallback.

## Architecture

Both apps use a feature-folder layered pattern (`<feature>/<feature>-repo.ts`, `-service.ts`, `.types.ts`, `use-<feature>.ts`). Rules that need cross-file context:

- **UI → hook → service → repo.** Pages import hooks/services only; repos own transport/persistence. Server state goes through TanStack Query hooks.
- **Corner Shop**: the browser repos call `/api/*` via `src/lib/api.ts`, which sends an `x-client-id` header (anonymous identity from `src/lib/client-id.ts`, no auth) and validates every response with zod. Server side mirrors the structure: `server/<feature>/*-routes.ts` → `*-service.ts` → `*-repo.ts` using `@neondatabase/serverless`. Prices are integer cents.
- **Skyline Flights**: repos are deliberately `async` with fake latency so they can be swapped for `fetch` later. Swap points: `flight-repo.ts`, `product-repo.ts`, `booking-repo.ts`.
  - Flights are generated deterministically from route + date (`lib/seeded.ts`); seat availability is seeded the same way, so results are stable across reloads.
  - The in-progress trip (`draft`: flight, cabin, seats, shop items) is client state in a localStorage store (`lib/persisted-store.ts`, built for `useSyncExternalStore`), not Query. Confirmed bookings live in localStorage behind `booking-repo.ts` and are read via Query.
  - Flow/route guards: `/` → `/flights` → `/seats` → `/shop` → `/checkout` → `/trips/:id`. `/shop` and `/checkout` redirect to `/seats` until every passenger has a seat. On confirm, `navigate` must run **before** `draftService.clear()`, otherwise the empty-draft redirect wins and the confirmation page is skipped.
  - localStorage keys are versioned (`skyline.draft.v2`, `skyline.bookings.v2`). Zod parse failure silently resets to empty, so bump the version whenever a persisted schema changes.
  - Prices are whole USD; cabin multipliers and seat-row ranges live in `flight.types.ts`.

## Conventions specific to this repo

- `tsconfig` is strict with `noUncheckedIndexedAccess`; the root config only includes `src`, `server`, `vite.config.ts` (not `apps/`).
- Feature file names are short and singular (`order-service.ts`, `order-repo.ts`); no barrel `index.ts` files.
- Git history uses Conventional Commits and `docs/CHANGELOG.md` (dated `## YYYY-MM-DD` sections, one line per commit).
