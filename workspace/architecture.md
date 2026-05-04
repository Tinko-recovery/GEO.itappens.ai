# Technical Architecture: Invoice Tracker Marketing Landing Page

## Overview

A **statically-exported Next.js 14 marketing site** deployed on Vercel. Its sole dynamic capability is a server-side API route that writes waitlist sign-ups to Supabase. All other pages are pre-rendered HTML/CSS/JS with zero server runtime cost.

---

## System Diagram

```
                        ┌─────────────────────────────────┐
                        │         User's Browser           │
                        └────────────┬────────────────────┘
                                     │ HTTPS
                        ┌────────────▼────────────────────┐
                        │        Vercel CDN / Edge         │
                        │  (Static HTML + Next.js runtime) │
                        └──┬─────────────────────┬────────┘
                           │                     │
              Static pages │            POST /api/waitlist
                           │                     │
                  ┌────────▼────────┐   ┌────────▼────────────┐
                  │  Next.js 14     │   │  Next.js API Route   │
                  │  App Router     │   │  (Node.js serverless │
                  │  Static Export  │   │   function on Vercel)│
                  └─────────────────┘   └────────┬────────────┘
                                                 │ Supabase JS SDK
                                        ┌────────▼────────────┐
                                        │  Supabase (Postgres) │
                                        │  waitlist table      │
                                        └─────────────────────┘
```

---

## Tech Stack

| Layer        | Technology                          | Rationale                              |
|--------------|-------------------------------------|----------------------------------------|
| Framework    | Next.js 14 (App Router)             | Static export + API routes in one repo |
| Language     | TypeScript                          | Type safety across components & API    |
| Styling      | Tailwind CSS                        | Utility-first, no runtime overhead     |
| Icons        | Lucide React                        | Tree-shakable, consistent icon set     |
| Database     | Supabase (Postgres)                 | Managed DB + instant REST/SDK          |
| Deployment   | Vercel                              | Zero-config Next.js hosting + CDN      |
| Analytics    | Plausible Analytics                 | Lightweight, privacy-friendly          |
| Fonts        | Google Fonts (via next/font)        | Automatic optimization                 |

---

## Project File Structure

```
/
├── app/
│   ├── layout.tsx                  # Root layout: metadata, fonts, analytics
│   ├── page.tsx                    # Home page — assembles all sections
│   ├── api/
│   │   └── waitlist/
│   │       └── route.ts            # POST /api/waitlist (server-side API)
│   └── globals.css                 # Tailwind base styles
│
├── components/
│   ├── Hero.tsx                    # Hero section component
│   ├── Features.tsx                # Feature highlights grid
│   ├── Pricing.tsx                 # Pricing tiers table
│   ├── WaitlistForm.tsx            # Email capture + form logic
│   └── Footer.tsx                  # Footer with nav + social links
│
├── lib/
│   └── supabaseClient.ts           # Supabase client singleton (anon key)
│   └── supabaseAdmin.ts            # Supabase admin client (service role key — server only)
│
├── types/
│   └── waitlist.ts                 # Shared TypeScript interfaces
│
├── public/
│   ├── robots.txt                  # SEO: allow all crawlers
│   ├── sitemap.xml                 # SEO: page index
│   └── og-image.png                # Open Graph share image
│
├── next.config.js                  # output: 'export', env var forwarding
├── tailwind.config.ts              # Tailwind theme tokens
└── .env.local                      # Local dev secrets (never committed)
```

---

## Database Schema

### Supabase — `waitlist` Table

```sql
CREATE TABLE waitlist (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT        NOT NULL UNIQUE,
  source      TEXT        NOT NULL DEFAULT 'landing_page',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast duplicate-check lookups
CREATE UNIQUE INDEX waitlist_email_idx ON waitlist (email);
```

**Row-Level Security:** RLS enabled. No client-side reads or writes are permitted directly. All inserts go through the server-side API route using the **service role key**, which bypasses RLS. The anon key is available for future use (e.g., client-side Supabase auth) but does **not** have INSERT permissions on this table.

---

## API Endpoints

### `POST /api/waitlist`

**File:** `app/api/waitlist/route.ts`

**Purpose:** Validate an email address and insert it into the Supabase waitlist table.

**Request:**
```
POST /api/waitlist
Content-Type: application/json

{ "email": "user@example.com" }
```

**Response Matrix:**

| Scenario              | HTTP Status | Response Body                                           |
|-----------------------|-------------|--------------------------------------------------------|
| Success               | `200`       | `{ "message": "You're on the waitlist!" }`             |
| Duplicate email       | `409`       | `{ "message": "Email already on waitlist." }`          |
| Invalid email format  | `400`       | `{ "message": "Please provide a valid email address." }`|
| Missing email field   | `400`       | `{ "message": "Email is required." }`                  |
| Supabase/server error | `500`       | `{ "message": "Something went wrong. Please try again." }` |

**Server-side logic flow:**
```
1. Parse JSON body → extract `email`
2. Guard: email present?         → 400 if missing
3. Guard: email passes regex?    → 400 if invalid
4. Supabase insert (service key) → catch unique constraint violation → 409
5. Success                       → 200
6. Any other DB error            → log server-side, return 500 (no DB details exposed)
```

**CORS:** Restrict `Access-Control-Allow-Origin` to the landing page domain via environment variable (`NEXT_PUBLIC_SITE_URL`).

---

## Component Architecture

### `app/layout.tsx` — Root Layout
- Exports Next.js `Metadata` object (title, description, og:*, twitter:card, canonical)
- Loads Google Fonts via `next/font/google`
- Injects Plausible `<Script>` with `strategy="afterInteractive"`
- Renders `<html>`, `<body>`, and slots for page content

### `app/page.tsx` — Home Page
- Server Component (no `'use client'`)
- Composes all section components in order:
  ```tsx
  <Hero />
  <Features />
  <Pricing />
  <WaitlistForm />   ← placed mid-page or above fold
  <Footer />
  ```

### `components/Hero.tsx`
- **Props:** None (copy is hardcoded or sourced from a constants file)
- Headline, subheadline, gradient background
- Primary CTA: `<a href={process.env.NEXT_PUBLIC_APP_SIGNUP_URL}>Start Free Trial</a>`
- `'use client'` NOT required — pure presentational

### `components/Features.tsx`
- **Props:** None
- Renders a responsive CSS Grid of `FeatureCard` sub-components
- Each card: `{ icon: LucideIcon, title: string, description: string }`
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### `components/Pricing.tsx`
- **Props:** None
- Two-tier card layout: Free Trial | Pro
- Each tier lists features with checkmarks
- CTAs: Free → `NEXT_PUBLIC_APP_SIGNUP_URL`; Pro → `NEXT_PUBLIC_STRIPE_CHECKOUT_URL` or waitlist link

### `components/WaitlistForm.tsx`
- **`'use client'`** — requires React state & fetch
- **Local state:**
  ```ts
  email: string
  status: 'idle' | 'loading' | 'success' | 'duplicate' | 'error'
  ```
- Client-side email regex check before `fetch('/api/waitlist', ...)`
- Fires `window.plausible('Waitlist Signup')` on 200 response
- Accessible: `<label>`, `aria-live` region for status messages, `aria-describedby` on error

### `components/Footer.tsx`
- **Props:** None
- Logo/brand name, nav links, social icons (Lucide), copyright
- Secondary CTA: "Still deciding? Join the waitlist" → scrolls to `#waitlist`

---

## Environment Variables

| Variable                         | Scope         | Used In                          | Description                          |
|----------------------------------|---------------|----------------------------------|--------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`       | Public        | `lib/supabaseClient.ts`          | Supabase project URL                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Public        | `lib/supabaseClient.ts`          | Supabase anon/public key             |
| `SUPABASE_SERVICE_ROLE_KEY`      | **Server only** | `lib/supabaseAdmin.ts` (API route only) | Supabase service role key — never exposed to browser |
| `NEXT_PUBLIC_APP_SIGNUP_URL`     | Public        | Hero, Pricing CTAs               | URL to eng_1's signup page           |
| `NEXT_PUBLIC_STRIPE_CHECKOUT_URL`| Public        | Pricing CTA                      | Stripe checkout or placeholder       |
| `NEXT_PUBLIC_SITE_URL`           | Public        | CORS header, canonical URL       | This site's domain                   |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`   | Public        | `layout.tsx` script tag          | Plausible tracking domain            |

> ⚠️ **Security rule:** Any variable without the `NEXT_PUBLIC_` prefix is **only** accessible in server-side API routes and is never bundled into client-side JavaScript.

---

## SEO Assets

**`public/robots.txt`**
```
User-agent: *
Allow: /
Sitemap: https://www.invoiceapp.com/sitemap.xml
```

**`public/sitemap.xml`**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.invoiceapp.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## Data Flow: Waitlist Submission

```
User types email → client-side regex check
        │
        ▼ (valid format)
WaitlistForm sets status = 'loading'
        │
        ▼
fetch POST /api/waitlist { email }
        │
        ├─── 200 → status = 'success', clear input, fire plausible event
        ├─── 409 → status = 'duplicate', show friendly message
        ├─── 400 → status = 'error', show validation message
        └─── 500 → status = 'error', show generic retry message
```

---

## Deployment Architecture

```
GitHub Repo (main branch)
        │
        │  push / PR merge
        ▼
Vercel CI/CD Pipeline
  ├─ next build (static export)
  ├─ Output: /out directory → Vercel CDN
  └─ API routes → Vercel Serverless Functions (Node.js)
        │
        ▼
Custom Domain (www.invoiceapp.com)
  ├─ Static pages served from CDN edge nodes
  └─ /api/* routed to serverless functions
```

**Separate Vercel project** from eng_1's application to allow independent deploys, environment configs, and domain routing.

---

## Security Considerations

1. **Service role key is server-only** — never referenced in any `'use client'` component or `NEXT_PUBLIC_` variable.
2. **Email never logged** — API route must not log the raw email to avoid PII in Vercel logs.
3. **Rate limiting** — Consider adding Vercel's Edge Middleware or an upstream rate-limit (e.g., upstash/ratelimit) on `/api/waitlist` to prevent abuse. Phase 2 item.
4. **Input sanitization** — Server-side regex validation before any DB interaction; Supabase parameterized queries via SDK prevent SQL injection.
5. **Error opacity** — 500 responses return only a generic message; DB errors are logged server-side only.
6. **CORS** — API route restricts `Access-Control-Allow-Origin` to `NEXT_PUBLIC_SITE_URL`.

---

## Key Interfaces (TypeScript)

```ts
// types/waitlist.ts

export interface WaitlistRequestBody {
  email: string;
}

export interface WaitlistResponseBody {
  message: string;
}

export interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlighted: boolean;
}
```

---

## Out of Scope (Phase 2)

- User authentication (handled by eng_1's app)
- Stripe payment processing on this site
- Email confirmation/welcome email on waitlist signup (suggest Supabase Edge Functions + Resend)
- A/B testing of hero copy
- Rate limiting on the API route
- Admin dashboard for viewing waitlist entries (use Supabase Studio for now)
