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
├── render.yaml                Render Blueprint — deploys api + web (database is a separate Neon project)
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

Database: a dedicated **production** Neon project/database (separate from your local dev one). `render.yaml` deploys the API and static frontend as a Render Blueprint:

1. Push this repo to GitHub/GitLab and connect it in the Render dashboard as a new Blueprint.
2. After the first deploy, set these env vars in the Render dashboard (not committed anywhere):
   - `movers-rwanda-api`: `DATABASE_URL` (production Neon connection string, with `?sslmode=require`), `CORS_ORIGIN` (the frontend's URL), `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
   - `movers-rwanda-web`: `VITE_API_URL` (the API's URL), then trigger a redeploy of the static site (Vite bakes env vars in at build time).
3. Run `npm run db:seed` once against the production database (e.g. via Render's shell, with `DATABASE_URL` set to the production one) with real `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` values to create the real admin login.
4. Point your paid domain's DNS at Render (custom domain settings on each service) — Render issues free auto-renewing TLS certificates once the records verify.

## Notes on what changed from the original demo

The original `movers-rwanda/` static site had a few sections that were intentionally faked for the demo — a quote form with no backend, four placeholder testimonials explicitly marked as fake, and eight styled gradient blocks standing in for real gallery photos. All three are now real: the quote form writes to the database and shows up in the admin leads inbox, testimonials and gallery start empty and are populated by the client through the admin dashboard, not invented.
