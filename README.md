# Movers Rwanda

Production website and admin dashboard for Movers Rwanda — a React (Vite) frontend, an Express/PostgreSQL API, and a shared validation package, in an npm-workspaces monorepo.

```
movers-rwanda/
├── apps/
│   ├── web/            React 18 + Vite + TypeScript — public site + /admin/* dashboard
│   └── api/             Express + TypeScript + Drizzle ORM + PostgreSQL
├── packages/
│   └── shared/            zod schemas + types shared by web and api
├── movers-rwanda/           the original static HTML/CSS/JS demo (kept for reference)
├── render.yaml                Render Blueprint — deploys the API (database is a separate Neon project)
├── vercel.json                 Vercel config — deploys the frontend (apps/web)
└── package.json
```

## Prerequisites

- Node.js 20+
- A PostgreSQL 14+ database (local or hosted)
- (Optional, for image uploads) a free [Cloudinary](https://cloudinary.com) account

## First-time setup

```bash
npm install
cp apps/api/.env.example apps/api/.env      # fill in DATABASE_URL and JWT_SECRET
cp apps/web/.env.example apps/web/.env      # defaults to http://localhost:4000

npm run build:shared                        # compiles packages/shared, needed before the api/web dev servers can import it
npm run db:generate                         # (only if you change apps/api/src/db/schema.ts)
npm run db:migrate                          # creates the tables in your database
npm run db:seed                             # creates the first admin login + starter content
```

`db:seed` prints the admin email/password it created (override with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars before running it) — **change this password immediately in production** by logging into `/admin` and updating the `admin_users` row, or re-seeding with real values before going live.

## Running in development

```bash
npm run dev:api     # http://localhost:4000
npm run dev:web     # http://localhost:5173
```

Whenever you change something in `packages/shared`, re-run `npm run build:shared` (or `npm run dev -w packages/shared` to watch) so both apps pick up the change.

- Public site: `http://localhost:5173`
- Admin dashboard: `http://localhost:5173/admin/login`

## What's where

- **Public site** (`apps/web/src/pages/HomePage.tsx` + `components/sections`): hero, quote form, services, service areas, testimonials, gallery, blog teaser, FAQ — ported 1:1 from the original static demo, now with live data.
- **Admin dashboard** (`apps/web/src/pages/admin`): leads inbox, and CRUD for services, gallery, testimonials, service areas, blog posts, and site settings (phone/WhatsApp/email/social links) — all editable without a code change.
- **API** (`apps/api/src/routes`): REST endpoints backing all of the above. `POST /api/leads` is public (rate-limited + honeypot); everything else under `/admin` scope requires the admin auth cookie.
- **Database schema**: `apps/api/src/db/schema.ts` (Drizzle). Migrations live in `apps/api/src/db/migrations`.

## Image uploads

Gallery photos, service photos, and blog cover images are uploaded straight from the browser to Cloudinary using a short-lived signature the API mints (`POST /api/uploads/sign`) — the Cloudinary API secret never leaves the server. Without `CLOUDINARY_*` env vars set, the sign endpoint returns a clear "not configured" error rather than failing silently.

## Deploying

Three pieces, three places: **frontend on Vercel**, **API on Render**, **database on Neon** (a dedicated production project, separate from your local dev one).

1. Push this repo to GitHub (done) and connect it in both the Vercel and Render dashboards.
   - **Vercel**: "Add New Project" → import this repo. It reads `vercel.json` at the repo root for the build command and output directory — leave the project's Root Directory setting at the repo root (don't override it).
   - **Render**: "New Blueprint" → this repo. It reads `render.yaml` for the API service.
2. Set env vars:
   - **Render** (`movers-rwanda-api`): `DATABASE_URL` (production Neon connection string, with `?sslmode=require`), `CORS_ORIGIN` (your Vercel URL, e.g. `https://moversrwanda.vercel.app`, plus your custom domain once attached — comma-separated), `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
   - **Vercel** (project settings → Environment Variables): `VITE_API_URL` (the Render API's URL, e.g. `https://movers-rwanda-api.onrender.com`), then redeploy (Vite bakes env vars in at build time).
3. Run `npm run db:seed` once against the production database (e.g. from your machine with `DATABASE_URL` temporarily set to the production one) with real `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` values to create the real admin login.
4. Point your paid domain's DNS: the marketing site's domain (e.g. `moversrwanda.com`) at Vercel (custom domain settings in the Vercel dashboard), and optionally a subdomain (e.g. `api.moversrwanda.com`) at Render for the API. Both issue free auto-renewing TLS certificates once the records verify.

## Notes on what changed from the original demo

The original `movers-rwanda/` static site had a few sections that were intentionally faked for the demo — a quote form with no backend, four placeholder testimonials explicitly marked as fake, and eight styled gradient blocks standing in for real gallery photos. All three are now real: the quote form writes to the database and shows up in the admin leads inbox, testimonials and gallery start empty and are populated by the client through the admin dashboard, not invented.
