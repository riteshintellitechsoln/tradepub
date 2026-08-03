# TradeHub

A lead-generation ebook platform (TradePub-style): business professionals trade
their company contact details for whitepapers, ebooks, and reports.

## Module 1: Project Setup — done

Files created in this module and why:

| File | Purpose |
|---|---|
| `package.json` | Pins exact dependency versions: Next.js 15 (App Router), React 19, Prisma, NextAuth v5, Zod, React Hook Form, bcryptjs, Resend, Cloudinary, AWS S3 SDK (R2-compatible), Radix primitives for shadcn/ui, Upstash rate limiting. |
| `tsconfig.json` | Strict TypeScript config with `@/*` path alias to `src/*`. `noUncheckedIndexedAccess` on for safer array/object access. |
| `next.config.ts` | Allows Cloudinary/R2/S3 image domains, sets baseline security headers (X-Frame-Options, nosniff, etc.), raises server action body limit for form uploads. |
| `tailwind.config.ts` | shadcn/ui-compatible design tokens (HSL CSS variables), dark mode via class, container widths, entrance animations. |
| `postcss.config.js` | Required to run Tailwind. |
| `components.json` | shadcn/ui CLI config — component style, aliases, icon library. |
| `.env.example` | Every environment variable the app will need across all 20 modules (DB, auth, email, storage, rate limiting, download tokens). Copy to `.env` and fill in. |
| `.gitignore` | Standard Next.js/Prisma ignores, plus `.env*`. |
| `eslint.config.mjs` | Flat ESLint config extending `next/core-web-vitals` + `next/typescript`. |
| `src/app/globals.css` | Tailwind layers + full light/dark theme as HSL CSS variables. |
| `src/app/layout.tsx` | Minimal root layout (real providers — theme, session, toaster — arrive in Module 6). |
| `src/app/page.tsx` | Placeholder home page just to confirm the app boots. Real Home page is Module 9. |

## Why manual setup instead of `create-next-app`

This build environment has no internet access, so dependencies can't be
installed here. Everything is hand-written to match what `create-next-app`
+ `shadcn init` would produce, so it runs correctly the moment you install
on your own machine.

## Getting it running locally

```bash
npm install
cp .env.example .env   # then fill in real values
npm run dev
```

You need a PostgreSQL database reachable at `DATABASE_URL` before Module 3
(Prisma Schema) becomes runnable — a free Neon or Supabase Postgres instance
works fine for development.

## Module 2: Folder Structure — done

```
src/
├── app/
│   ├── (marketing)/          # Public site — shares one Navbar/Footer layout
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # / (Home)
│   │   ├── category/page.tsx           # /category
│   │   ├── category/[slug]/page.tsx    # /category/[slug]
│   │   ├── book/[slug]/page.tsx        # /book/[slug]
│   │   ├── search/page.tsx             # /search
│   │   ├── my-library/page.tsx         # /my-library
│   │   ├── download/page.tsx           # /download
│   │   └── thank-you/page.tsx          # /thank-you
│   ├── (auth)/               # Centered, chrome-free layout
│   │   ├── layout.tsx
│   │   └── login/page.tsx              # /login
│   ├── admin/                # Sidebar shell, protected by middleware
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # /admin (Dashboard)
│   │   ├── books/[...]                 # CRUD
│   │   ├── categories/page.tsx
│   │   ├── companies/page.tsx
│   │   ├── users/page.tsx
│   │   ├── leads/page.tsx
│   │   ├── downloads/page.tsx
│   │   ├── email-logs/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── settings/page.tsx
│   ├── api/                  # Route handlers (all 8 spec'd endpoints, stubbed 501 for now)
│   ├── layout.tsx             # Root: <html>/<body> only
│   ├── globals.css
│   ├── not-found.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/           # shadcn/ui generated primitives (populated as each module needs one)
│   ├── layout/       # Navbar, Footer, MobileNav — Modules 7-8
│   ├── books/        # BookCard, BookGrid — Module 11
│   ├── categories/   # CategoryCard — Module 10
│   ├── forms/        # EmailGateForm, LeadForm — Module 14
│   ├── admin/        # Sidebar, DataTable — Module 16
│   ├── shared/       # EmptyState, Pagination, LoadingSpinner
│   └── providers/    # ThemeProvider, SessionProvider — Module 6
├── lib/
│   ├── db.ts                 # Prisma client singleton — Module 3
│   ├── auth.ts                # NextAuth config — Module 5
│   ├── tokens.ts               # Secure download token sign/verify — Module 13
│   ├── rate-limit.ts           # Upstash rate limiter — Module 13
│   ├── constants.ts             # Categories, industries, email blocklist
│   ├── utils.ts                  # cn() helper
│   ├── validations/              # Zod schemas: email, lead, book, category
│   ├── email/                     # Resend client + templates — Module 15
│   └── storage/                    # Cloudinary + R2 clients — Module 13/16
├── hooks/                # useDebounce, useMediaQuery
├── types/                # Shared TS types + next-auth.d.ts augmentation
├── actions/              # Server actions: books, leads, download
├── config/               # site.ts — name, description, nav
└── middleware.ts         # Protects /admin/* (real check added in Module 5)

prisma/                   # schema.prisma + seed.ts — Module 3
```

**Key architecture decisions:**

- **Route groups `(marketing)` and `(auth)`** let the public site, the login
  screen, and the admin panel each have their own layout (chrome) without
  affecting the URL path — `/login` stays `/login`, not `/(auth)/login`.
- **`/admin` is a plain folder, not a route group**, since it needs to actually
  appear in the URL and is the one tree `middleware.ts` protects via its
  `matcher`.
- **Every stub file states which module builds it out**, so nothing here is a
  mystery placeholder — you can trace any file straight to the module that
  gives it real logic.
- **`actions/` (server actions) is separate from `app/api/`** — the REST routes
  in the spec are kept for external/programmatic access and admin CRUD, while
  server actions handle in-app form submissions that benefit from React's
  built-in pending/error states without a hand-rolled fetch.

## Module 3: Prisma Schema — done

**File:** `prisma/schema.prisma`

All 11 tables from the spec, plus the enums needed to keep them type-safe:

| Model | Purpose | Key design choice |
|---|---|---|
| `Admin` | Back-office login | Separate from `User` — has `AdminRole` (`SUPER_ADMIN`/`ADMIN`/`EDITOR`) for the RBAC in Module 16 |
| `User` | Optional visitor account ("My Library") | Matches NextAuth's Prisma-adapter shape exactly, so Module 5 drops in without migration changes |
| `Session` / `VerificationToken` | NextAuth adapter tables | Field names are fixed by NextAuth — do not rename |
| `Category` | Book taxonomy | `slug` unique + `order` for manual nav ordering; seeded with your 21 categories in Module 4 |
| `Company` | **Publisher/vendor**, not the lead's employer | Managed via Admin > Companies CRUD; `Book.companyId` points here |
| `Book` | The ebook/whitepaper itself | `pdfFileKey` stores the private R2 object key — never a public URL — since every download must go through the signed-token flow; `viewCount`/`downloadCount` are denormalized counters so listing pages don't need `COUNT(*)` joins |
| `BookCategory` | Explicit many-to-many join | Chosen over an implicit Prisma m-n so category placement can carry metadata later without a migration |
| `Lead` | **The person** — one row per unique company email | Deduped by `email @unique`; `companyName`/`companyDomain` are free text (a visitor's employer isn't a managed entity, unlike `Company`) |
| `Download` | **The event** — one row per download attempt | Splits cleanly from `Lead` so one person can appear once but download many books; stores `tokenHash` (never the raw token) with its own expiry and `DownloadStatus` lifecycle |
| `EmailLog` | One row per send *attempt* | Supports resends and gives Admin > Email Logs full delivery history per download |

**Enums added beyond the spec's literal table list** (needed to make the
above type-safe rather than stringly-typed): `AdminRole`, `BookStatus`,
`BookFormat`, `CompanySize`, `DownloadStatus`, `EmailStatus`.

**Also updated in this module:**
- `src/lib/db.ts` — real Prisma client singleton (dev-mode hot-reload safe)
- `src/lib/constants.ts` — `DEPARTMENTS`, `INDUSTRIES`, `COMPANY_SIZE_OPTIONS` for the Lead Form's dropdowns (categories are *not* here — they're DB-backed content, seeded in Module 4)
- `src/types/index.ts` — re-exports of the Prisma model types plus two composite types (`BookWithRelations`, `BookCardData`) the UI will actually consume

**Can't run here:** `prisma generate` and `prisma migrate dev` both need
network access (to fetch the Prisma engine binaries) and a real Postgres
connection string — neither is available in this sandbox. Once you have
`DATABASE_URL` set in `.env`, run:

```bash
npx prisma generate     # generates the typed client the code above imports
npx prisma migrate dev --name init   # creates the tables
```

Module 4 (Database) covers getting a Postgres instance, running the first
migration, and seeding categories/admin/sample data.

## Module 4: Database — done

**Files created/updated:**

| File | Purpose |
|---|---|
| `prisma/seed.ts` | Seeds all 21 spec'd categories (in order), 6 sample publisher `Company` rows, 8 sample `Book` rows spread across those categories/publishers, and one default `Admin` (`SUPER_ADMIN`) |
| `docker-compose.yml` | Optional one-command local Postgres, as an alternative to a hosted instance |
| `package.json` | Added `"prisma": { "seed": "tsx prisma/seed.ts" }` so `prisma migrate reset` / `prisma db seed` auto-run it |
| `.env.example` | Added `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — the seed script reads these instead of hardcoding credentials |

**Seed script design choices:**
- Everything is written with `upsert`, so re-running the seed is safe and
  won't create duplicate categories/companies/admins.
- Book cover images point at `placehold.co` placeholders and `pdfFileKey`
  points at a fake `placeholders/<slug>.pdf` key — both get replaced with
  real Cloudinary/R2 uploads once the Admin book form ships in Module 16.
  This keeps Module 4 self-contained without depending on storage credentials.
- The default admin password is **not** hardcoded — it's read from
  `SEED_ADMIN_PASSWORD`, falling back to `ChangeMe@123` with a console
  warning so it's impossible to silently ship the default into a real
  environment.

### Getting a real database connected (pick one)

**Option A — hosted Postgres (recommended, works from Vercel too):**
1. Create a free project on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the connection string into `DATABASE_URL` in `.env`.

**Option B — local Postgres via Docker:**
```bash
docker compose up -d
# DATABASE_URL="postgresql://tradehub:tradehub@localhost:5432/tradehub?schema=public"
```

### Running the migration and seed

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init   # creates all 11 tables
npm run db:seed                       # runs prisma/seed.ts
npx prisma studio                     # optional: browse the seeded data
```

**Still can't run any of this here** — no network access for the Prisma
engine binaries and no live Postgres in this sandbox. Everything above is
written to run correctly the moment you execute it locally with a real
`DATABASE_URL`.

## Module 5: Authentication — done

**The core challenge this module solves:** Next.js Middleware runs on the
Edge runtime, which can't open a Postgres connection or run bcrypt's native
comparisons — but Prisma and bcrypt are exactly what checking a login
requires. So the config is split in two:

| File | Runtime | Contains |
|---|---|---|
| `src/lib/auth.config.ts` | Edge-safe | `pages`, `session` strategy, and the `authorized()` callback that decides whether a request into `/admin/*` may proceed |
| `src/lib/auth.ts` | Node only | Everything above **plus** the `Credentials` provider (Prisma + bcrypt) and the `PrismaAdapter` |
| `src/middleware.ts` | Edge | Imports **only** `auth.config.ts` — importing the full config here would ship Prisma into the Edge bundle and fail at deploy time |

**One login form serves two audiences.** The single Credentials provider in
`auth.ts` checks the `Admin` table first (back office), then falls back to
`User` (a "My Library" member who has set a password). Both wrong-password
and no-such-account return the same generic `null` — the login form can't be
used to enumerate valid emails.

**Files created/updated:**

| File | Purpose |
|---|---|
| `src/lib/validations/auth.ts` | Zod schema for the login form |
| `src/lib/rbac.ts` | `ADMIN_ROLES` + `isAdminRole()` — the single source of truth for "what counts as staff" |
| `src/lib/auth.config.ts` | Edge-safe NextAuth config |
| `src/lib/auth.ts` | Full NextAuth config: Credentials provider, Prisma adapter, JWT callbacks that stamp `role`/`id` onto the token and session |
| `src/lib/session.ts` | `getCurrentUser()` / `requireAdmin()` helpers for Server Components and Actions |
| `src/types/next-auth.d.ts` | Module augmentation adding `id`/`role` to `Session.user` and the JWT |
| `src/middleware.ts` | Real `/admin/*` guard — redirects to `/login?callbackUrl=...` on failure |
| `src/app/api/auth/[...nextauth]/route.ts` | Exports NextAuth's `GET`/`POST` handlers |
| `src/app/(auth)/login/page.tsx` | Real login page — server-checks the session first and bounces already-signed-in users straight to `/admin` or `/my-library` |
| `src/components/forms/login-form.tsx` | Client form: React Hook Form + Zod + `signIn("credentials", { redirect: false })` |
| `src/components/providers/session-provider.tsx` | Wraps `next-auth/react`'s `SessionProvider`; created now, **mounted in Module 6's root layout** |
| `src/components/ui/{button,input,label,card,form}.tsx` | First shadcn/ui primitives — introduced now because the login form needs them; later modules (Navbar, Lead Form, Admin CRUD) reuse these same files rather than duplicating |

**About the spec's `POST /api/auth/login` and `POST /api/auth/logout`:**
these are served by NextAuth's own catch-all route — specifically
`POST /api/auth/callback/credentials` for sign-in and `POST /api/auth/signout`
for sign-out. Hand-rolling separate endpoints would just re-implement CSRF
protection, cookie handling, and JWT signing that NextAuth already does
correctly.

**To verify once you have Module 4's database running:**
```bash
npm run dev
# visit /login and sign in with the seed admin:
#   email:    value of SEED_ADMIN_EMAIL (default admin@tradehub.com)
#   password: value of SEED_ADMIN_PASSWORD (default ChangeMe@123)
# should redirect to /admin
# visiting /admin while signed out should redirect to /login
```

Also add to `.env`:
```
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
```

## Module 6: Layout — done

**File rewritten:** `src/app/layout.tsx` — this is where every provider the
app needs gets mounted, once, at the root.

| Concern | How it's handled |
|---|---|
| **Fonts** | Two Google Fonts loaded via `next/font`, exposed as the `--font-sans` / `--font-display` CSS variables that `tailwind.config.ts` already mapped back in Module 1. **Inter** for body/UI text (forms, tables, admin screens need legibility at small sizes), **Plus Jakarta Sans** for headings (a distinct geometric display face, so Home/Book Detail don't read as a stock Next.js app once real content lands in Module 9) |
| **Dark/light mode** | `ThemeProvider` (wraps `next-themes`) with `attribute="class"`, `defaultTheme="system"` — toggling is exposed to the rest of the app via the new `ModeToggle` button, ready for the Navbar to place in Module 7 |
| **Auth session** | `SessionProvider` (built in Module 5) mounted here — from this point on, any client component anywhere in the tree can call `useSession()` |
| **Notifications** | `sonner`'s `<Toaster />` mounted once at the root — the Lead Form (Module 14) and every Admin CRUD action (Module 16) will call `toast.success()`/`toast.error()` rather than each building its own notification UI |
| **Base SEO** | `metadataBase` (from `NEXT_PUBLIC_APP_URL`) + a title template (`%s | TradeHub`) so every page's `<title>` composes automatically from just its own segment |

**Also added, as standard Next.js layout-level conventions:**
- `src/app/loading.tsx` — root Suspense fallback (a centered spinner) for any route segment without its own loading state
- `src/app/error.tsx` — root error boundary with a "Try again" reset button

**New reusable piece:** `src/components/shared/mode-toggle.tsx` — a
light/dark toggle button, built now but not placed anywhere yet; Module 7
drops it into the Navbar.

**To verify:**
```bash
npm run dev
```
The placeholder home page should now render in the Inter/Plus Jakarta Sans
pairing, respect your OS dark/light setting, and DevTools should show no
hydration warnings.

## Module 7: Navbar — done

**Files created:**

| File | Purpose |
|---|---|
| `src/components/ui/dropdown-menu.tsx` | shadcn/ui DropdownMenu primitives (Topics mega-menu + account menu) |
| `src/components/ui/sheet.tsx` | shadcn/ui Sheet (slide-in drawer) primitives, for the mobile nav |
| `src/components/ui/separator.tsx` | Small utility primitive used inside the mobile sheet |
| `src/actions/categories.ts` | `getActiveCategories()` — a direct Prisma read used by the `(marketing)` layout (a Server Component), no API round trip |
| `src/components/layout/search-bar.tsx` | Routes to `/search?q=...` on submit; Module 11 owns what `/search` does with it |
| `src/components/layout/topics-menu.tsx` | The "Topics" dropdown — every category, one click away |
| `src/components/layout/user-nav.tsx` | Session-aware account area: "Sign In" when logged out; an avatar dropdown (My Library, Admin Dashboard if applicable, Sign out) when logged in |
| `src/components/layout/mobile-nav.tsx` | Full nav collapsed into a slide-in Sheet below the `md` breakpoint |
| `src/components/layout/navbar.tsx` | Composes all of the above |
| `src/app/(marketing)/layout.tsx` | Updated to fetch categories once and render the real `<Navbar />` |

**Why "Topics" and "Categories" are two separate nav items** (your spec lists
both): they do different jobs. **Topics** is a quick-access dropdown listing
every category so a returning visitor can jump straight to one. **Categories**
is a plain link to `/category`, the full browsable grid with filters/search/
pagination that Module 10 builds. This mirrors how TradePub itself splits a
"Browse by Topic" menu from a full category index, rather than making the
same list do both jobs.

**Architecture note:** `Navbar` is a Server Component — it receives
`categories` as a prop (fetched once, no client waterfall) and only delegates
to Client Components for the pieces that need interactivity: the search
input, the Topics dropdown, the session-aware account menu, and the mobile
Sheet. `SearchBar` deliberately avoids `useSearchParams()` (which would force
a Suspense boundary onto every single page, since the Navbar renders
everywhere) — it just always starts empty.

**To verify:**
```bash
npm run dev
```
- Desktop: logo, Topics dropdown (21 seeded categories), Categories link, search box, mode toggle, and Sign In/account menu should all render.
- Shrink the window below `md`: everything collapses into a hamburger → Sheet.
- Sign in as your seed admin at `/login` → the account menu should now show your email, an "Admin Dashboard" entry, and "Sign out".

## Module 8: Footer — done

**Files created:**

| File | Purpose |
|---|---|
| `src/components/layout/footer.tsx` | Four-column footer: brand + social links, a Browse column reusing the same `categories` prop the Navbar already has, a Company column, and a "For Publishers" column (a mailto CTA — a nod to TradePub's actual business model, where vendors pay to have their content distributed) |
| `src/app/(marketing)/privacy/page.tsx` | Real Privacy Policy content |
| `src/app/(marketing)/terms/page.tsx` | Real Terms of Service content |
| `src/app/(marketing)/layout.tsx` | Renders the real `<Footer />`, replacing the Module 2 stub comment |
| `src/app/sitemap.ts` | Added `/privacy` and `/terms` |
| `tailwind.config.ts` / `package.json` | Registered `@tailwindcss/typography` for the `prose` classes on the two legal pages |

**Why Privacy Policy and Terms exist at all** — they're not in your numbered
20-module list, but the Lead Form (Module 14) is required to collect a
consent checkbox, and a consent checkbox needs somewhere to link to. Rather
than leave `/privacy` and `/terms` as dead links or "coming soon" stubs, I
wrote real (template-level) content now, while building the Footer that
links to them. **Flagging clearly: this is a starting template, not legal
advice** — swap in your actual data practices, retention periods, and
contact addresses before launch.

**To verify:**
```bash
npm run dev
```
Footer should appear on every public page with your 6 highest-priority
seeded categories, and `/privacy` and `/terms` should both render.

## Module 9: Home Page — done

**This is where the visual identity actually gets decided.** Rather than a
generic SaaS-blue/cream-and-terracotta landing page, TradeHub is framed as
what it actually is — a business resource *library* — via:

- **Deep navy primary** (`--primary`, updated app-wide from the Module 1
  placeholder blue) + **one brass/gold "seal" accent**, spent only on
  Featured badges and a single hero rule. Everything else stays quiet.
- **The signature interaction:** hovering a Book Card doesn't just show
  buttons — a torn-ticket-style **"Download Pass"** panel slides up from the
  bottom edge, dashed border and all. It's the one deliberate, subject-specific
  risk on an otherwise restrained UI.
- **The hero's visual is real content**, not stock art or an abstract shape —
  three actual seeded book covers, fanned and rotated like a stack on a
  reading table.

**Files created:**

| File | Purpose |
|---|---|
| `src/components/books/book-card.tsx` | **The** reusable Book Card (Cover, Title, Company, Description, Category, hover reveal) — built here because Home needs it first, but Modules 10–12 reuse this exact component |
| `src/components/books/book-grid.tsx` | Responsive grid wrapper, reused everywhere books are listed |
| `src/components/home/hero.tsx` | Masthead headline, stat row, fanned cover-stack visual |
| `src/components/home/section-header.tsx` | Reusable "eyebrow + title + view all" pattern for every section |
| `src/components/home/category-scroller.tsx` | "Popular Categories" — horizontal scroll on mobile, grid from `sm` up |
| `src/components/ui/badge.tsx` | New shadcn/ui primitive — powers the Featured/Trending badges |
| `src/actions/books.ts` | Filled in for real: `getFeaturedBooks()`, `getLatestBooks()`, `getTrendingBooks()` — all sharing one `bookCardSelect` so nothing beyond what the card needs (no `pdfFileKey`, no raw counts) ever reaches the client |
| `src/actions/categories.ts` | Added `getCategoriesWithBookCounts()` for the category scroller |
| `src/actions/stats.ts` | Hero stat numbers — **deliberately excludes raw download count**, since that reads as "0, broken" on a fresh install rather than "0, honest"; real download totals belong in Admin Analytics (Module 18) |
| `src/app/(marketing)/page.tsx` | The real Home page, replacing the Module 1 placeholder |
| `src/app/globals.css`, `tailwind.config.ts`, `next.config.ts` | Finalized brand tokens (`--primary`, new `--seal`), and allowed `placehold.co` (the seed data's cover host) through `next/image` |

**Worth knowing:** Featured and Trending only show 2 items each right now,
since that's how many the seed data flags — the sections render fine at any
count and will fill out as an Admin flags more books in Module 16.

**To verify:**
```bash
npm run dev
```
Home should show the navy/gold identity, a hero with 3 fanned covers,
Popular Categories, Featured Resources, Latest Resources, and Trending Now
— hovering any book cover should reveal the Download Pass panel.

## Module 10: Categories — done

**Files created/updated:**

| File | Purpose |
|---|---|
| `src/app/(marketing)/category/page.tsx` | Real index page — all categories as cards, book count on each |
| `src/app/(marketing)/category/[slug]/page.tsx` | Real detail page — grid, filters, search, sort, pagination, all spec'd requirements |
| `src/components/categories/category-filter-bar.tsx` | Client component: search (debounced), format filter, publisher filter, sort |
| `src/components/shared/pagination.tsx` | Reusable windowed pagination (`1 … 4 5 6 … 12`), pure server-renderable links |
| `src/components/shared/empty-state.tsx` | Reusable "nothing matches" panel |
| `src/actions/books.ts` | Added `getBooksByCategory()` (filter + sort + paginate, one indexed query) and `getCompaniesInCategory()` |
| `src/actions/categories.ts` | Added `getCategoryBySlug()` |
| `src/lib/constants.ts` | Added `BOOK_FORMAT_OPTIONS` and `SORT_OPTIONS` |

**The core design decision: the URL is the only state.** Every control —
search text, format, publisher, sort, page number — reads from and writes to
`searchParams`. `CategoryFilterBar` doesn't hold its own "currently applied
filters" state; it just pushes a new URL and lets the Server Component
re-fetch. That means every filtered/sorted/paginated view is a real,
shareable, bookmarkable link — refresh, copy the URL, send it to a
colleague, and you get the exact same results back.

**What "Filters" means here, since the spec didn't spell it out:** filter by
**Format** (Ebook/Whitepaper/Report/etc.) and by **Publisher** — and the
publisher dropdown only ever lists publishers that actually have a book in
that category, so there's never a filter option that zeroes out the results.

**To verify:**
```bash
npm run dev
```
Visit `/category` → should show all 21 seeded categories with counts. Click
into one (e.g. Security) → try the search box, switch Sort to "Most
Popular," and confirm the URL updates and results change accordingly. With
only 8 seeded books total, pagination won't visibly kick in yet (12 per
page) — the `Pagination` component itself renders nothing when
`totalPages <= 1`, which you can confirm once Module 16 lets you add more.

## Module 11: Books — done

**Files created/updated:**

| File | Purpose |
|---|---|
| `src/app/(marketing)/search/page.tsx` | Real full-text search page — search, category/format/publisher filters, sort, pagination |
| `src/components/books/search-filter-bar.tsx` | Like Module 10's `CategoryFilterBar`, plus a Category selector (since `/search` isn't scoped to one) |
| `src/app/api/books/route.ts` | `GET /api/books` now real — same `getBooks()` query as the page, so API results and browser results can never drift apart |
| `src/hooks/use-filter-params.ts` | **New**: extracted the URL-writing logic that `CategoryFilterBar` had inline, so `SearchFilterBar` doesn't duplicate it |
| `src/actions/books.ts` | **Refactored**: `getBooksByCategory()` is now a thin wrapper around a new general-purpose `getBooks()` (category becomes just one more optional filter). `/category/[slug]` needed zero changes for this — same function signature, same behavior. Added `getPublishingCompanies()` |

**Worth calling out — a refactor, not just new code:** Module 10's
`CategoryFilterBar` had its URL-param-writing logic written inline. Rather
than copy-pasting it into `SearchFilterBar`, I pulled it into
`useFilterParams()` and updated `CategoryFilterBar` to use it too. Both
filter bars are now ~20 lines shorter and share one implementation to keep
in sync.

**`GET /api/books` and `/search` are guaranteed to agree** — both call the
exact same `getBooks()` function. There's no separate "API filtering logic"
that could quietly drift out of sync with what a visitor sees when they
search in the browser.

**To verify:**
```bash
npm run dev
```
Use the Navbar's search box → lands on `/search?q=...` with matching
results. Try `/search` with no query at all → should list all 8 seeded
books, newest first. Try `GET /api/books?format=EBOOK` directly in the
browser or curl → should return the same set as filtering by Ebook on the
search page.

## Module 12: Book Details — done

**Files created/updated:**

| File | Purpose |
|---|---|
| `src/app/(marketing)/book/[slug]/page.tsx` | Real detail page — large cover, title, publisher, pages, language, publish date, tags, description, Download CTA, Related Resources |
| `src/actions/books.ts` | Added `getBookBySlug()`, `getRelatedBooks()`, `incrementBookViewCount()` |
| `src/app/sitemap.ts` | Now dynamic — every published book and active category gets a real sitemap entry, not just the static top-level routes |

**Real SEO on the one page it matters most for.** Every other page relies on
the site-wide defaults from Module 6's root layout, but a book detail page is
what actually gets pasted into Slack, LinkedIn, or an email when someone
shares a resource — so this page gets its own `generateMetadata()` with
OpenGraph and Twitter Card tags pointing at the real cover image, plus a
schema.org `Book` JSON-LD block (the spec's "Structured Data" requirement,
made concrete here rather than left as an abstract line item).

**Two small design decisions worth knowing:**
- **Drafts 404 on the public site**, even if someone guesses or bookmarks
  the slug — only `status: "PUBLISHED"` books render. A draft is only
  visible through Admin > Books once Module 16 exists.
- **View count increments are fire-and-forget** (`void ...catch(() => {})`)
  — a failed analytics write should never be the reason a visitor sees an
  error page.

**Related Resources** ranks by `downloadCount` rather than recency — "what
else do people interested in this topic actually download" is a better
signal than "what was published most recently."

**To verify:**
```bash
npm run dev
```
Click any book from Home or a Category page → should show the full detail
page with the Download button, and — since only 8 seeded books share
overlapping categories — a handful of Related Resources at the bottom.
View source (or check a social-share preview tool) to confirm the OpenGraph
image resolves to the real cover.

## Module 13: Download Flow — done

**This is the heart of the platform**, so the file list is longer than
usual — but every piece maps directly to a step in your Download Flow
diagram.

| Spec step | File(s) |
|---|---|
| Click Download | `BookCard` / Book Detail (already link to `/download?book=slug` since Module 9) |
| Company Email Check | `src/lib/validations/email.ts` — real free-domain blocklist, replacing the Module 2 stub |
| Lead Form | `src/lib/validations/lead.ts` + `src/components/download/download-wizard.tsx` — **minimal on purpose**, see below |
| Database Save | `src/actions/download.ts` → `initiateDownload()` |
| Generate Secure Token | `src/lib/tokens.ts` — HMAC-signed, only the *hash* ever persisted |
| Email PDF | **Stubbed** — logged to console, real `EmailLog`/`Download` status rows written, actual Resend send is Module 15 |
| Thank You Page | `src/app/(marketing)/thank-you/page.tsx` |

**Why the Lead Form here is deliberately minimal (name + email + consent
only):** your module list separates "Download Flow" (13) from "Lead Form"
(14) — building the *full* field set (phone, company, job title, location,
department, industry, company size) here would blur that boundary and make
Module 13 impossible to test in isolation. Instead, this module proves the
*entire pipeline* end-to-end — email gate → save → token → thank-you — with
just enough form to exercise it. Module 14 swaps in the full form; nothing
downstream needs to change shape when it does, since the extra fields are
additive to `leadSchema`.

**Also newly real:**
- `src/lib/rate-limit.ts` — Upstash sliding-window limiter on the public
  download endpoint, with a **graceful no-op fallback** when Upstash isn't
  configured (this sandbox, or before you've provisioned it) — the limiter
  never crashes the app for missing env vars, it just stops limiting.
- `src/lib/storage/r2.ts` — signed R2 download URLs, same graceful-null
  pattern when R2 credentials are absent.
- `GET /api/download?token=...` — the actual link that will go in the
  emailed message: verifies the token, checks it against the *hash* stored
  in `Download.tokenHash` (never the raw token), marks the row `DOWNLOADED`,
  and redirects to a signed URL.

**On the spec's `POST /api/download`:** an emailed link is always *clicked*
(a GET), never POSTed — so I implemented the literal POST route as a JSON
API equivalent of the `/download` page's flow (same payload shape,
delegates to the same `initiateDownload()`), and put the real file-serving
logic on GET, which is what the email link actually needs to be. Same
reasoning as Module 5's NextAuth routes: match the mechanism to how HTTP
actually works rather than the literal method the spec named.

**One semantic call worth flagging:** `Book.downloadCount` increments at
lead-conversion time (form submitted), not at file-click time. This matches
how TradePub-style platforms actually work — the monetizable event for a
publisher is the completed lead, whether or not the person later opens the
PDF — but it's a judgment call, not a fact from the spec.

**Can't fully verify end-to-end here** — no live Postgres, no Upstash, no
R2 in this sandbox. But locally, once your `.env` has `DATABASE_URL` and
`NEXTAUTH_SECRET`/`DOWNLOAD_TOKEN_SECRET` set:

```bash
npm run dev
```
Click Download on any book → enter a Gmail address → should be rejected
with the company-email message. Enter a real business email → step 2 →
submit → should land on `/thank-you`, and your terminal should log the
stubbed "would send" line with a real, verifiable token URL. Check
`npx prisma studio` afterward — you should see a new `Lead`, `Download`
(status `EMAIL_SENT`), and `EmailLog` (status `QUEUED`) row.

## Module 14: Lead Form — done

**Files created/updated:**

| File | Purpose |
|---|---|
| `src/lib/validations/lead.ts` | The **full** `leadSchema` — every field from your spec (name, company email, phone, company, job title, country, state, city, department, industry, company size, consent), replacing Module 13's minimal version |
| `src/lib/constants.ts` | Added `COUNTRIES` — ~190 countries for the Country selector |
| `src/components/ui/select.tsx` | New shadcn/ui primitive — powers every dropdown in the form (Department, Industry, Company Size, Country) |
| `src/components/forms/lead-form.tsx` | **The real Lead Form** — its own reusable component (as originally planned back in Module 2's folder structure), not inline in the wizard |
| `src/components/download/download-wizard.tsx` | Simplified — now just owns step state + the email gate; delegates everything from "Full name" onward to `LeadForm` |
| `src/actions/download.ts` | `initiateDownload()` now takes the full `LeadInput` and writes every real field to the `Lead` row — Module 13's placeholder values (`phone: ""`, `companySize: "SIZE_1_10"`, etc.) are gone |

**Why `LeadForm` is its own component, not inline in the wizard:** the
spec's original folder plan (Module 2) called this out explicitly —
`components/forms/LeadForm`. Keeping it separate means it's reusable
anywhere else the app might need to capture a lead outside the download
flow, and it keeps `DownloadWizard` legible: one file for orchestration
(which step is active, the email gate), one file for the actual data
capture.

**A deliberate simplification worth knowing:** State and City are free-text
inputs, not dependent dropdowns tied to Country. Building an accurate
state/province dataset for ~190 countries would be a lot of data for
marginal benefit — free text works everywhere in the world, not just the
handful of countries with a clean admin-division list (US, Canada, India,
etc.). Easy to upgrade later if you want cascading dropdowns for specific
countries.

**Nothing downstream had to change shape** — this was the whole point of
keeping Module 13's `leadSchema` additive. `Lead.upsert()`'s `create`/`update`
blocks just went from placeholder strings to the real form values; the
Download/Token/EmailLog logic around it is untouched.

**To verify:**
```bash
npm run dev
```
Start a download → step 1 (email) same as before → step 2 should now show
the full form: Name, Phone, Company, Job Title, Department, Industry,
Company Size (all as proper dropdowns), Country/State/City, and the consent
checkbox. Submit → `/thank-you` as before. `npx prisma studio` → the new
`Lead` row should have every field populated, not just name/email.

## Module 15: Email — done

**Files created/updated:**

| File | Purpose |
|---|---|
| `src/lib/email/templates/download-email.tsx` | The real React Email template — TradeHub-branded (navy + brass/gold, matching Module 9's identity), with the cover image, title, publisher, and a Download Now button |
| `src/lib/email/resend.ts` | Real Resend client, replacing the Module 2 stub — same graceful-degradation pattern as `rate-limit.ts`/`storage/r2.ts`: no `RESEND_API_KEY` means a clear failure, not a crash |
| `src/actions/download.ts` | `initiateDownload()`'s console.log stub is gone — it now really calls `sendDownloadEmail()` and branches on the real result. Added `resendDownloadEmail()` for future Admin use |
| `src/app/api/send-email/route.ts` | Real, admin-protected implementation of the spec's `POST /api/send-email` |

**A behavior change worth flagging clearly: email failure now fails the
whole request.** In Module 13/14, the flow always ended at `/thank-you`
because the email step was just a `console.log`. Now, if Resend can't
deliver the email — including simply not being configured — `initiateDownload()`
returns a real failure and the visitor sees an honest error instead of a
Thank You page for an email that never went out. The `Lead` and `Download`
rows are still kept either way (there's a genuine contact worth preserving
for follow-up), but the person doesn't get told it worked when it didn't.

**`resendDownloadEmail()` issues a fresh token**, not the original — the
first one may already be expired or used — and every attempt gets its own
`EmailLog` row, so delivery history stays accurate per attempt rather than
overwriting the original send's record.

**On `POST /api/send-email`:** rather than a generic "send arbitrary email"
endpoint (which would be an open spam-relay surface), it wraps
`resendDownloadEmail()` and requires a known `downloadId`. It's also
**already admin-protected** — gated via `auth()` + `isAdminRole()` from
Module 5, rather than left open until Module 16's UI exists to call it.

**This module needs a real `RESEND_API_KEY` to test the happy path** —
same caveat as needing a real `DATABASE_URL`. Resend has a free tier that
works fine for this:

```bash
# in .env
RESEND_API_KEY="re_..."
EMAIL_FROM="TradeHub <you@yourdomain.com>"   # must be a domain verified in Resend
```

**To verify:**
```bash
npm run dev
```
Without `RESEND_API_KEY` set: complete a download → should now see an
honest error message instead of reaching `/thank-you` (this is the correct
behavior, not a bug). With a real key configured: same flow should land on
`/thank-you` and a real email should arrive with the branded template and a
working Download Now button.

## Module 16: Admin Panel — done

The biggest module so far. Here's the shape of it rather than a flat file
list — every CRUD screen follows one of two patterns, chosen deliberately
per entity.

### Pattern A: Dialog-based CRUD (Categories, Companies)

A category or publisher has 4-6 simple fields, so create/edit/delete all
happen from **one page** via a modal — no dedicated `/new` or `/[id]`
routes. `CategoryManager` / `CompanyManager` (client components) own the
table + Dialog + form; `src/actions/admin/categories.ts` /
`.../companies.ts` (Server Actions) own the actual mutations, each starting
with `requireAdmin()` and re-validating with the same Zod schema the form
uses client-side.

### Pattern B: Dedicated pages (Books)

Books have far more fields (including file references), so they get real
pages: `/admin/books`, `/admin/books/new`, `/admin/books/[id]`, all sharing
one `BookForm` component. `src/actions/admin/books.ts` holds
`createBook()`, `updateBook()`, and `archiveBook()`.

### Read-only lists (Users, Leads, Downloads, Email Logs)

All four reuse the same three pieces: `AdminSearchBox` (URL-is-the-state
search, same `useFilterParams` hook from Module 11), `AdminTable` (a plain
server-renderable table), and the existing `Pagination` component from
Module 10. No new pattern needed — the public Category/Search pages already
solved "searchable, paginated list."

### Decisions worth understanding

- **"Delete" archives Books, but really deletes Categories/Companies.**
  `Book` cascades to `Download` on delete (see the schema) — a hard delete
  would silently erase real lead/download history. So `archiveBook()` just
  sets `status: "ARCHIVED"`, which every public query already filters out.
  Categories and Companies don't carry that risk (`BookCategory` deletion
  just un-tags a book; `Company` deletion is blocked outright by the
  schema's `onDelete: Restrict` if it still has books — caught and
  surfaced as "still has N books," not a raw Prisma error).
- **API routes call the same Server Actions the UI uses**, but check
  `auth()`/`isAdminRole()` themselves first, rather than relying on each
  action's own `requireAdmin()`. That function calls `redirect()`, which is
  built for pages/actions React renders — not Route Handlers. Checking
  first means an unauthorized request gets a clean JSON 401 before the
  action (and its `redirect()`) is ever reached.
- **No file-upload widget yet.** Cover images and PDF keys are plain URL/
  text inputs with an explicit note in the form. Building a Cloudinary/R2
  upload UI without real credentials to test against would be guesswork —
  the same graceful-degradation philosophy as `storage/r2.ts` (Module 13):
  don't pretend a capability exists when it can't be verified.
- **Settings is informational, not editable.** The spec's 11 tables don't
  include a `Settings` model, so there's nowhere to persist admin-editable
  config yet. Everything that matters (email blocklist, sender identity,
  token TTL) lives in `.env` — the settings page just shows the current
  values, honestly, rather than faking a form that doesn't save anywhere.
- **`/admin`'s dashboard is intentionally light** — live counts linking to
  each section, not charts. Module 17 (Dashboard) and 18 (Analytics) build
  the real thing on top of this.

**Files touched:** every stub under `src/app/admin/` from Module 2 is now
real; new admin components under `src/components/admin/`; new Server
Actions under `src/actions/admin/`; new schemas
`src/lib/validations/{book,category,company}.ts`; two new shadcn/ui
primitives (`dialog.tsx`, `textarea.tsx`); `POST /api/books`,
`PUT`/`DELETE /api/books/[id]`, and the Categories equivalents are now real
and admin-gated.

**To verify:**
```bash
npm run dev
```
Sign in as your seed admin → `/admin` should show live counts. Try
creating a category (Dialog), creating a publisher (Dialog), creating a
book (full page, pick the publisher/categories you just made), then edit
and archive it. Check Leads/Downloads/Email Logs — they should already
show real data from any downloads you've completed since Module 13.

## Module 17: Dashboard — done

**Files created/updated:**

| File | Purpose |
|---|---|
| `src/actions/admin/dashboard.ts` | `getDashboardStats()` (with weekly deltas), `getDownloadsTimeSeries()`, `getRecentLeads()`, `getRecentDownloads()`, `getTopBooks()` |
| `src/components/admin/downloads-chart.tsx` | First real use of `recharts` — a dependency that's sat unused since Module 1 |
| `src/app/admin/page.tsx` | Rebuilt: stat cards (now with "+N this week" deltas) + a 14-day downloads trend chart + three activity panels (Recent Leads, Recent Downloads, Top Books) |

**Where the line is drawn from Module 18 (Analytics), since the two could
easily blur together:** this page answers *"what's happening right now"* —
no date-range picker, no filtering, no exports, no per-category
breakdowns. Analytics answers *"how are we trending, and why"* — that's a
genuinely different job, which is why it's worth keeping as its own module
rather than just piling more charts onto this page.

**The time-series chart buckets in JS, not SQL.** `getDownloadsTimeSeries()`
fetches raw `createdAt` timestamps for the window and buckets them by
calendar day itself, rather than a database `GROUP BY`. That's the right
call at dashboard scale — simple, portable across any Postgres version,
and always returns exactly 14 points (including zero-download days) so the
chart never has gaps. A real analytics query at much higher volume would
want to push that aggregation into SQL instead.

**Chart colors reference the same CSS variables as the rest of the app**
(`hsl(var(--primary))`) rather than a hardcoded hex — it automatically
matches dark mode instead of looking wrong in one of the two themes.

**Honest about the data you'll actually see:** with no live database in
this sandbox, none of this can be verified end-to-end here. Once you're
running locally with real usage from Modules 13-15, the widgets fill in —
until then, "No leads yet" / "No downloads yet" is the *correct* state, not
a bug.

**To verify:**
```bash
npm run dev
```
Complete a few downloads through the real flow (Modules 13-15), then visit
`/admin` → stat cards should show live counts with weekly deltas, the chart
should show a bump on today's date, and Recent Leads/Downloads/Top Books
should reflect what you just did.

## Module 18: Analytics — done

**Files created/updated:**

| File | Purpose |
|---|---|
| `src/lib/analytics.ts` | **New**: `bucketByDay()` — extracted from Module 17's dashboard once this module needed the exact same day-bucketing logic for arbitrary date ranges. Module 17's `getDownloadsTimeSeries()` now calls this too, rather than duplicating it |
| `src/actions/admin/analytics.ts` | `getDownloadsSeriesForRange()`, `getDownloadsByCategory()`, `getDownloadsByPublisher()`, `getLeadsByIndustry()`, `getLeadsByCompanySize()` — all scoped by one `range` param |
| `src/components/admin/analytics-range-picker.tsx` | 7d/30d/90d segmented control — plain server-renderable `<Link>`s, zero client JS |
| `src/components/admin/breakdown-list.tsx` | Ranked list with proportional bars, reused for all four breakdowns |
| `src/app/admin/analytics/page.tsx` | The real page, replacing the Module 2 stub |

**Where this differs from Module 17's Dashboard**, since the boundary
matters: Dashboard has zero filtering — it's "what's happening right now."
Analytics is entirely organized around one `range` query param (7/30/90
days), and every chart and breakdown on the page reflects that same window
— consistent with the URL-is-the-state pattern every filterable page in
this app has used since Module 10.

**One counting choice worth being explicit about:** "Downloads by Category"
lets a single download count toward *every* category its book is tagged
with, rather than picking one. A book tagged both "Security" and "Cloud"
genuinely represents demand in both — forcing the totals to add up to
exactly the download count would mean arbitrarily picking a "primary"
category and undercounting the other, which is less honest, not more.

**Why breakdowns are ranked lists with bars, not pie charts:** for "top N"
comparisons, a sorted list with proportional bar lengths is easier to scan
than wedge angles, and it doesn't degrade into unreadable thin slices past
5-6 items the way a pie chart does. The line/area chart stays for the one
place a trend over time is actually the point.

**As with every other data-dependent module, this can't be verified
end-to-end in this sandbox** — no live database. Once you're running
locally with real usage, switching the range picker should visibly change
every chart and breakdown together.

**To verify:**
```bash
npm run dev
```
Visit `/admin/analytics` → try switching between 7/30/90 days → the URL
should update to `?range=7d` etc., and the chart + all four breakdowns
should refetch for that window.

## Module 19: Testing — done

**Files created:**

| File | Purpose |
|---|---|
| `vitest.config.ts` | Vitest + `vite-tsconfig-paths`, so tests use the same `@/*` import alias as the app — no separate path mapping to keep in sync |
| `.prettierrc.json` | Was missing since Module 1 despite `prettier` being a dependency — added now alongside the other quality tooling |
| `tests/lib/validations/email.test.ts` | Free-domain rejection, case-insensitivity, malformed input |
| `tests/lib/validations/lead.test.ts` | Full schema acceptance/rejection, the `state`/`city` defaulting behavior, `leadFormSchema`'s email omission |
| `tests/lib/tokens.test.ts` | Sign/verify round-trip, tamper rejection, the exact hash invariant `GET /api/download` depends on |
| `tests/lib/rbac.test.ts` | `isAdminRole()` against every real role plus null/undefined |
| `tests/lib/utils.test.ts` | `slugify()` and `cn()` |
| `tests/lib/analytics.test.ts` | `bucketByDay()` — correct bucketing, zero-filling, window exclusion, ordering |
| `tests/actions/download.test.ts` | The highest-value test here — see below |
| `.github/workflows/ci.yml` | Runs `lint` + `test` on every push/PR |

**What's covered and why these specifically:** every pure function with no
external dependency (a validation schema, a token, a string utility, a
bucketing algorithm) is fully unit-testable in isolation, fast, and needs
no database or browser. That's what this suite is.

**The one test worth reading closely: `tests/actions/download.test.ts`.**
It mocks `@/lib/db` to **throw** if any query is attempted at all, then
asserts that invalid input (a Gmail address, consent not given, a bad
`companySize`) gets rejected by `initiateDownload()` *before* any database
call happens. This exists specifically as a regression guard: if someone
later reorders the function and validation stops happening first, this
test fails loudly — rather than the bug surfacing as a rejected email
quietly creating a `Lead` row anyway.

**What this suite deliberately does NOT cover, and why:**
- **The full Download → Token → Email → Thank You pipeline against a real
  database.** That needs either a real Postgres instance (an integration
  test) or a much larger Prisma mock than is worth maintaining by hand.
  If you want this, the standard next step is a test database + Vitest's
  `beforeEach`/`afterEach` to reset it between tests.
- **Anything rendered in a browser** (page load, clicking through the
  Download Wizard, the Admin CRUD dialogs). That's the job of an E2E tool
  like **Playwright**, not Vitest — recommended as the next investment if
  this project continues past Module 20, aimed first at the download flow
  and admin login, since those are the highest-value paths to protect.
- **React component rendering** (e.g., does `BookCard` show the right
  badge). Doable with `@testing-library/react` + jsdom, deliberately left
  out here to keep this module focused on logic that's cheap to get very
  high confidence in, rather than spreading thin across every layer.

**To run:**
```bash
npm install
npm run test        # single run
npm run test:watch  # watch mode
npm run lint
```

**Can run in this sandbox** — unlike every previous module, this one needs
no database, no API keys, and no network access, so I could actually
execute it here if `npm install` were possible. It isn't (no network in
this container), but nothing about these tests depends on anything outside
plain Node + the source files already in this repo.

## Module 20: Deployment — done

**Files created/updated:**

| File | Purpose |
|---|---|
| `DEPLOYMENT.md` | **The actual runbook** — env variable checklist (grouped by "what breaks if it's missing" rather than a flat list), infra provisioning order, first-deploy steps, migration/seed steps, a post-deploy smoke-test checklist, and ongoing-ops notes |
| `vercel.json` | Wires up a daily cron (`/api/cron/expire-downloads`) |
| `src/app/api/cron/expire-downloads/route.ts` | Sweeps `Download` rows that expired without ever being clicked — otherwise those just sit at `PENDING`/`EMAIL_SENT` forever, making Downloads/Analytics look healthier than reality |
| `src/app/api/health/route.ts` | A **real** health check — pings Postgres, not just "the process is alive" |
| `prisma/seed.ts` | Added a `SEED_SAMPLE_DATA` flag — production seeding gets real categories and a real admin account, but skips the demo publishers/books that are useful in local dev and wrong in production |
| `package.json` | Added `db:migrate:deploy` (`prisma migrate deploy`) — the production-safe migration command, distinct from `migrate dev` |
| `.env.example` | Added `CRON_SECRET` and `SEED_SAMPLE_DATA` |

**The one thing worth understanding about the whole runbook:** migrations
and seeding are **deliberately not automatic** on deploy. A schema change
or a seed run reaching production is a conscious, separate action you take
from your own machine with production credentials pulled in for that one
command — never a side effect of `git push`. That's slower than wiring
`prisma migrate deploy` into the build command, and that's the point: a
bad migration should never be able to silently break an otherwise-fine
deploy.

**The demo-data safeguard is the most likely thing to actually save you a
real mistake:** without `SEED_SAMPLE_DATA=false`, running the seed script
against production would put "Microsoft," "Cisco," and 8 placeholder
ebooks with fake `placehold.co` covers live on your real site. The flag
defaults to seeding sample data (so local dev stays exactly as easy as
it's been since Module 4) and only production's seed command needs to
override it.

---

## Post-completion audit — two gaps closed

After Module 20, a full sweep for leftover stub markers turned up two
real gaps that had slipped through: `/my-library` was still Module 2's
one-line placeholder, and `POST /api/leads` was still returning `501`.
Both are now real:

- **`/my-library`** — a public, email-based self-service lookup (no
  account required), matching how TradePub's own "My Library" actually
  works: you prove you're the person behind an email by having received a
  download link there. A signed-in `User` (Module 5) skips the lookup form
  and uses their session email directly. New files: `src/actions/library.ts`
  (`getLibraryByEmail()`, rate-limited to discourage using it as an
  email-enumeration probe; `requestLibraryResend()`, which re-checks that
  a download actually belongs to the email provided before ever resending
  — closing a real gap where the underlying `resendDownloadEmail()` had no
  ownership check of its own), plus `LibraryLookupForm` and
  `LibraryResendButton` components.
- **`POST /api/leads`** — rather than build a second, parallel "just save
  a lead" pathway that the rest of the app never actually uses, this route
  is an intentional alias for the same `initiateDownload()` that
  `POST /api/download` and the Download Wizard call. In this platform's
  actual design, there is no lead capture independent of a download
  request — the spec's own flow diagram has the Lead Form feeding directly
  into Database Save, never standing alone.

Every route and page in the app was re-audited after this fix; nothing
else was left stubbed.

---

## Project status: all 20 modules complete

1. **Project Setup** ✅
2. **Folder Structure** ✅
3. **Prisma Schema** ✅
4. **Database** ✅
5. **Authentication** ✅
6. **Layout** ✅
7. **Navbar** ✅
8. **Footer** ✅
9. **Home Page** ✅
10. **Categories** ✅
11. **Books** ✅
12. **Book Details** ✅
13. **Download Flow** ✅
14. **Lead Form** ✅
15. **Email** ✅
16. **Admin Panel** ✅
17. **Dashboard** ✅
18. **Analytics** ✅
19. **Testing** ✅
20. **Deployment** ✅

**Before this actually goes live**, work through `DEPLOYMENT.md` in full —
particularly provisioning real Resend/R2/Upstash credentials (everything
in this build gracefully degrades without them, which made every module
demonstrable on its own, but a real launch needs all three), and replace
the template legal content in `/privacy` and `/terms` from Module 8 with
real policy content reviewed for your actual data practices and
jurisdiction.
