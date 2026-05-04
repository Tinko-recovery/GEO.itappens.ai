# Architecture Document: itappens.ai Marketing Landing Page

**Project**: Public Marketing Landing Page  
**Domain**: itappens.ai  
**Engineer**: eng_2  
**Coordinates With**: eng_1 (app subdomain + Supabase instance)  
**Last Updated**: Sprint 1

---

## 1. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Edge-compatible, SSR + static |
| Styling | Tailwind CSS | Mobile-first utility classes |
| Database | Supabase (PostgreSQL) | Shared instance with eng_1 |
| ORM/Client | @supabase/supabase-js | Server-side only (service role key) |
| Hosting | Vercel | Auto-deploy from GitHub |
| Icons | Lucide Icons or Heroicons | Free, consistent SVG icon set |
| Images | next/image | Built-in optimization + lazy loading |

---

## 2. Repository & Folder Structure

```
itappens-landing/
├── app/                          # Next.js 14 App Router root
│   ├── layout.tsx                # Root layout (fonts, metadata, global styles)
│   ├── page.tsx                  # Landing page (assembles all sections)
│   └── api/
│       └── waitlist/
│           └── route.ts          # POST /api/waitlist endpoint
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx       # Headline, subheadline, primary CTA
│   │   ├── BenefitsSection.tsx   # Three benefit cards
│   │   ├── ProductVisual.tsx     # Screenshot / GIF of dashboard
│   │   ├── PricingSection.tsx    # Free beta / Pro tier cards
│   │   └── WaitlistSection.tsx   # Waitlist form + inline success/error
│   ├── ui/
│   │   ├── BenefitCard.tsx       # Reusable single benefit card
│   │   ├── PricingCard.tsx       # Reusable single pricing tier card
│   │   ├── WaitlistForm.tsx      # Controlled form with validation states
│   │   └── Button.tsx            # Reusable CTA button component
│   └── layout/
│       ├── Header.tsx            # Logo + nav CTA link to eng_1 /signup
│       └── Footer.tsx            # Privacy, Terms, Contact, Social links
├── public/
│   └── assets/
│       └── dashboard-preview.png # Product screenshot (from eng_1)
├── lib/
│   └── supabase.ts               # Supabase server client (service role key)
├── types/
│   └── waitlist.ts               # TypeScript types for waitlist payload
├── .env.local                    # Local env vars (gitignored)
├── .env.example                  # Placeholder env template (committed)
├── tailwind.config.ts
├── next.config.ts
├── README.md
├── DEPLOYMENT.md
└── API.md
```

---

## 3. Database Schema

> **Instance**: Supabase (shared with eng_1 — confirm URL + service key with eng_1 before sprint start)

### Table: `waitlist`

```sql
CREATE TABLE waitlist (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source     TEXT NOT NULL DEFAULT 'landing_page'
);

-- Index for fast duplicate checks
CREATE UNIQUE INDEX waitlist_email_idx ON waitlist (email);
```

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Auto-generated |
| email | TEXT | NOT NULL, UNIQUE | Lowercased before insert |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | UTC timestamp |
| source | TEXT | NOT NULL, DEFAULT 'landing_page' | Differentiates signup sources |

**Coordination note**: If eng_1 already created a `waitlist` table with a different schema, align on column names (especially `createdAt` vs `created_at`) before writing the Supabase client.

---

## 4. API Endpoints

### `POST /api/waitlist`

**File**: `app/api/waitlist/route.ts`  
**Runtime**: Node.js (server-side only — service role key must never reach the client)

#### Request
```http
POST /api/waitlist
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Success Response — `200 OK`
```json
{
  "success": true,
  "message": "Email added to waitlist"
}
```

#### Error Responses

| Status | Condition | Body |
|---|---|---|
| 400 | Missing or invalid email format | `{ "success": false, "message": "Please provide a valid email address" }` |
| 405 | Non-POST method | `{ "success": false, "message": "Method not allowed" }` |
| 409 | Duplicate email (optional alt to upsert) | `{ "success": false, "message": "This email is already on the waitlist" }` |
| 500 | Database or unexpected error | `{ "success": false, "message": "Something went wrong. Please try again." }` |

#### Handler Logic (Pseudocode)
```
1. Reject non-POST methods → 405
2. Parse body → extract email
3. Server-side regex validation → reject invalid → 400
4. Normalize: email.toLowerCase().trim()
5. Build payload: { email, created_at: new Date(), source: 'landing_page' }
6. Supabase upsert with ON CONFLICT (email) DO NOTHING
7. Return 200 { success: true }
8. Catch DB errors → log server-side → return 500
```

---

## 5. Component Architecture

### Page Assembly (`app/page.tsx`)
```
<Header />
  <HeroSection />       ← Above-the-fold: headline + CTA → eng_1 /signup
  <BenefitsSection />   ← Three benefit cards (icon + title + description)
  <ProductVisual />     ← next/image screenshot, lazy-loaded
  <PricingSection />    ← Free beta + Pro tier, CTA → eng_1 /signup
  <WaitlistSection />   ← Email form + inline success/error states
<Footer />
```

### `WaitlistForm.tsx` — State Machine

```
States: idle → loading → success | error

idle:    Show email input + submit button (enabled)
loading: Disable button, show spinner inside button
success: Hide form, show inline "You're on the list!" message
error:   Show inline error message, re-enable form for retry
```

### `lib/supabase.ts` — Server Client
```typescript
// ONLY imported by server-side code (API routes, Server Components)
// NEVER imported by client components
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)
```

---

## 6. Environment Variables

| Variable | Used In | Exposed to Client? | Notes |
|---|---|---|---|
| `SUPABASE_URL` | `lib/supabase.ts` | ❌ No | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | `lib/supabase.ts` | ❌ No | Service role key — never use anon key here |

### `.env.example`
```env
# Supabase (shared instance — coordinate with eng_1)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

> ⚠️ **Security Rule**: No `NEXT_PUBLIC_` prefixed Supabase variables. All DB access goes through the `/api/waitlist` server route. The client never touches Supabase directly.

---

## 7. Data Flow Diagram

```
User (Browser)
     │
     │  1. Fills email + clicks Submit
     ▼
WaitlistForm.tsx (Client Component)
     │
     │  2. POST /api/waitlist  { email }
     ▼
app/api/waitlist/route.ts (Server — Node.js)
     │
     │  3. Validate → normalize → build payload
     ▼
lib/supabase.ts (Supabase Admin Client)
     │
     │  4. UPSERT into waitlist table
     ▼
Supabase PostgreSQL (shared DB)
     │
     │  5. 200 OK { success: true }
     ▼
WaitlistForm.tsx → renders success state (no redirect)
```

```
CTA Buttons (Hero + Pricing)
     │
     │  Hard <a href> link (no Next.js router)
     ▼
eng_1 Production Domain /signup
```

---

## 8. Rendering Strategy

| Route | Strategy | Reason |
|---|---|---|
| `/` (landing page) | Static Generation (SSG) | No dynamic data; best for Core Web Vitals + SEO |
| `/api/waitlist` | Server-side (Node.js runtime) | Needs service role key; cannot be static |

> Use `export const dynamic = 'force-static'` on `app/page.tsx` to ensure static export. The API route will automatically remain server-side.

---

## 9. Performance & Accessibility Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 90 |
| Lighthouse SEO | ≥ 90 |
| First Contentful Paint | < 1.5s |
| Page Load (total) | < 3s |
| Heading hierarchy | h1 → h2 → h3 (no skipping) |
| Images | All have `alt` text |
| Form inputs | Labelled with `<label>` or `aria-label` |

---

## 10. Deployment Architecture

```
GitHub (main branch)
     │
     │  Auto-deploy on push
     ▼
Vercel (Build: next build)
     │
     ├─ Static assets → Vercel CDN Edge Network
     ├─ /api/waitlist → Vercel Serverless Function (Node.js)
     └─ Custom domain: itappens.ai → DNS A record → Vercel
```

**DNS Configuration**:
- `itappens.ai` → Vercel (this project, eng_2)
- `app.itappens.ai` (or `/app` subroute) → eng_1's deployment  
- Coordinate with eng_1 to confirm subdomain vs. subroute approach

---

## 11. Cross-Team Coordination (eng_2 ↔ eng_1)

| Item | Action Required | Owner |
|---|---|---|
| Supabase instance URL | Confirm shared vs. dedicated | eng_1 confirms → eng_2 uses |
| `SUPABASE_SERVICE_KEY` | Share securely (not via repo) | eng_1 or DevOps |
| `waitlist` table schema | Confirm or create together | Both |
| eng_1 `/signup` URL | Confirm production URL | eng_1 confirms → eng_2 hard-codes in CTAs |
| Product screenshot/GIF | eng_1 provides asset | eng_1 → eng_2 |
| Domain/subdomain config | Confirm itappens.ai routing strategy | Both |

---

## 12. Security Checklist

- [ ] `SUPABASE_SERVICE_KEY` never in any client bundle (no `NEXT_PUBLIC_` prefix)
- [ ] Server-side email validation in API route (never trust client-only validation)
- [ ] Supabase client instantiated only in `lib/supabase.ts` (server-side file)
- [ ] No auth logic on landing page — it is a pure marketing surface
- [ ] `.env.local` added to `.gitignore`
- [ ] Rate limiting on `/api/waitlist` (future: add Vercel Edge middleware or upstash/ratelimit)

---

## 13. Future Improvements (Post-MVP)

| Item | Priority | Notes |
|---|---|---|
| Email verification / double opt-in | High | Send confirmation email via Resend or SendGrid |
| SEO metadata (OG tags, sitemap.xml) | High | Add in `app/layout.tsx` |
| Analytics (PostHog or Plausible) | Medium | Track CTA clicks, form submissions |
| Rate limiting on API route | Medium | Prevent abuse of waitlist endpoint |
| A/B testing hero copy | Medium | Vercel Edge Config or PostHog flags |
| Error monitoring (Sentry) | Medium | Catch production API errors |
| Admin view of waitlist | Low | Supabase dashboard is sufficient for now |

---

*Architecture authored by Lead Engineer (eng_2). Review before sprint kickoff and update after any schema or routing changes agreed with eng_1.*
