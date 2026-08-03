# TradeHub — Deployment Runbook

Target platform: **Vercel** (per the spec). This doc is the single
checklist to go from "code is done" to "live in production" — everything
here has been referenced piecemeal in each module's README section;
this pulls it into one ordered runbook.

---

## 1. Environment variable checklist

Every variable below is already documented inline in `.env.example` —
this table just groups them by what breaks if they're missing, so you can
tell at a glance what's actually required for a working production
deploy vs. what degrades gracefully.

| Variable | Required? | If missing |
|---|---|---|
| `DATABASE_URL` | **Required** | Nothing works — every page reads from Postgres |
| `NEXTAUTH_URL` | **Required** (prod value = your real domain) | Auth callbacks resolve to the wrong host |
| `NEXTAUTH_SECRET` | **Required** | NextAuth refuses to start signing sessions |
| `DOWNLOAD_TOKEN_SECRET` | **Required** | Download links can't be signed or verified |
| `DOWNLOAD_TOKEN_TTL_MINUTES` | Optional (defaults to 30) | Just changes link lifetime |
| `RESEND_API_KEY` | **Required for the download flow to complete** | `initiateDownload()` fails the whole request — see Module 15's README note. The site still browses fine; downloads don't |
| `EMAIL_FROM` | **Required alongside `RESEND_API_KEY`** | Must be a domain verified in Resend, or sends fail |
| `CLOUDINARY_*` | Not yet wired to a real upload UI (Module 16) | No effect yet — cover images are pasted URLs today |
| `R2_*` | **Required for real downloads to serve a real file** | `getSignedDownloadUrl()` returns `null`; visitors hit the "storage not configured" error page |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Optional | Rate limiting silently no-ops — fine at launch, add before you expect real traffic |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Only read by `prisma/seed.ts` | Only matters the moment you seed; not read by the running app |
| `SEED_SAMPLE_DATA` | Only read by `prisma/seed.ts` | **Set to `false` for production** — see step 4 |
| `CRON_SECRET` | Required for the expiry-sweep cron | Cron requests get rejected with 401 (safe failure, just means stale `PENDING` rows linger longer) |
| `NEXT_PUBLIC_APP_URL` | **Required** (prod value = your real domain) | Emailed download links, sitemap, and OpenGraph URLs all point at `localhost` |

**Where to set these in Vercel:** Project Settings → Environment Variables.
Set production values separately from Preview/Development if they differ
(they should, at minimum, for `DATABASE_URL` and `NEXT_PUBLIC_APP_URL`).

---

## 2. Provision infrastructure (do this before the first deploy)

1. **Database** — a production Postgres instance (Neon or Supabase both
   work). Do **not** reuse your local dev database.
2. **Resend** — verify your sending domain (Resend → Domains). `EMAIL_FROM`
   must use that verified domain or every send fails.
3. **Cloudflare R2** — create the bucket named in `R2_BUCKET_NAME`, generate
   an API token scoped to it.
4. **Upstash Redis** (optional at launch, recommended soon after) — create
   a database, copy the REST URL/token.

---

## 3. First deploy

1. Push this repo to GitHub.
2. Import it in Vercel → it auto-detects Next.js, no config needed beyond
   env vars.
3. Set every **Required** variable from the table above in Vercel's
   environment settings.
4. Deploy.

The build itself (`next build`) doesn't touch the database — migrations
are a separate, deliberate step (next).

---

## 4. Run migrations + seed (production database)

Do this from your local machine with `DATABASE_URL` pointed at the
**production** database (pull it via `vercel env pull` or copy it from
Vercel's dashboard) — not as part of the automatic build, so a bad
migration can never silently break a deploy that was otherwise fine.

```bash
npx prisma migrate deploy    # applies migrations — this is the prod-safe
                              # command; migrate dev is for local dev only

SEED_SAMPLE_DATA=false \
SEED_ADMIN_EMAIL=you@yourcompany.com \
SEED_ADMIN_PASSWORD='a-real-generated-password' \
npm run db:seed
```

`SEED_SAMPLE_DATA=false` is important — without it, the seed script adds
the 6 demo publishers and 8 demo books from local dev into production.
With it set, you still get all 21 categories and one real admin account,
with none of the placeholder content.

---

## 5. Post-deploy smoke test

Work through this every time, not just the first deploy:

- [ ] `/` loads, shows real categories (or an empty state if you haven't
      added books yet — that's correct, not broken)
- [ ] `/category` and a `/category/[slug]` page both load
- [ ] `/login` → sign in with the admin account you just seeded → lands on
      `/admin`
- [ ] `/admin` dashboard shows live counts
- [ ] Create one real Book + Category + Company through the Admin UI
- [ ] From the public site, start a download on that book with **your own
      real business email** → confirm you receive the email → click the
      link → confirm the file downloads and `/admin/downloads` shows it as
      `DOWNLOADED`
- [ ] `GET /api/health` returns `{ "status": "ok" }`
- [ ] Check `/robots.txt` and `/sitemap.xml` both render

---

## 6. Ongoing operations

- **Uptime monitoring**: point any monitor (Vercel's own, UptimeRobot,
  Better Uptime, etc.) at `GET /api/health` — it pings the database, not
  just "is the process up."
- **Email delivery**: Resend's dashboard shows delivery/bounce/complaint
  rates per send — check it if `/admin/email-logs` shows unexpected
  `FAILED` rows.
- **Rate-limit hits**: visible in the Upstash dashboard once configured.
- **Database backups**: Neon and Supabase both do automatic backups on
  paid tiers — confirm your plan actually includes them; don't assume.
- **The expiry-sweep cron** (`vercel.json`) runs daily at 03:00 UTC and
  needs `CRON_SECRET` set to do anything (see the table above).

---

## What's intentionally NOT automated

- **Migrations don't run automatically on deploy.** A schema change
  reaching production is a deliberate, reviewed action, not a side effect
  of pushing to `main`.
- **Seeding never runs automatically.** Same reasoning, doubly so — it
  writes an admin account.
- **There's no auto-scaling config to write.** Vercel's serverless
  functions scale on their own; the only capacity planning that matters
  here is your Postgres connection limit as traffic grows (Neon/Supabase's
  connection pooling modes handle this — enable pooled connections if you
  see connection-limit errors under load).
