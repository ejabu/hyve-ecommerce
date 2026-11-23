# Corner Shop

One Node process serves the React UI and the `/api` routes. Data lives in Neon Postgres.

## Run locally
1. `cp .env.example .env` and set `DATABASE_URL` to your Neon connection string.
2. `npm run dev` → http://localhost:3000 (Vite runs inside Express; tables are created and seeded on boot).

## Deploy (single artifact)
`npm run build` then `npm start`. Needs `DATABASE_URL` (and optionally `PORT`) in the environment.
Output: `dist/client` (static UI) + `dist/server.js`; run with production `node_modules` installed.
