# Architecture

## Technology Stack

| Layer | Technology | Role |
|-------|------------|------|
| Framework | Next.js 15 (App Router) | Full-stack meta-framework for UI and API routes. |
| Language | TypeScript | Static typing and compiler safety. |
| Database | Neon (PostgreSQL) | Serverless relational database for state and users. |
| ORM | Prisma | Database modeling, migrations, and querying. |
| Authentication | Auth0 | Secure user session management and logins. |
| Background Jobs | Upstash QStash | Serverless webhooks and cron scheduling for long-running AI tasks. |
| AI Text Generation | Anthropic (Claude 3.5 Haiku) | Fast, structured, low-cost content writing. |
| Media / Images | Unsplash API | $0 cost, high-quality stock photography. |
| Styling | Tailwind CSS | Utility-first CSS framework (pre-existing in repo). |

## System Boundaries

- `app/api/aeo/*`: Owns all backend REST logic for the itappens AEO engine. Never returns UI.
- `app/(marketing)/*`: Owns the public-facing landing pages (to sell the software).
- `app/(dashboard)/*`: Owns the authenticated user dashboard.
- `lib/`: Owns pure business logic (AI generation, WP API wrappers, encryption). Must not contain UI components.
- `components/social/*`: Owns the specific UI components for the AEO dashboard.

## Storage Model

- **Database (Neon/Prisma):** Stores User credits, Site credentials (encrypted), Article metadata (topic, status, logs).
- **External Storage (WordPress):** The actual generated image files are uploaded directly to the client's WordPress Media Library. We do NOT store generated images on our own servers/S3 to save costs.
- **Cache:** Upstash Redis (if needed later for rate limiting).

## Authentication & Access Model

- Sessions are managed by `@auth0/nextjs-auth0`.
- All API routes mutating or reading data MUST verify the session via `auth0.getSession()`.
- Records in the DB (`AeoSite`, `AeoArticle`) are scoped to the `email` of the authenticated user.
- Site passwords (WP App Passwords) MUST be symmetrically encrypted in the DB using `aes-256-gcm`.

## Invariants (Rules the codebase must never violate)

1. **Never block the main thread for AI:** The AI generation process (Claude + WP Upload) takes 15-30+ seconds. This MUST NEVER happen synchronously in a user-facing API route. It must always be offloaded to `app/api/aeo/worker` via Upstash QStash.
2. **Cost supremacy:** Image generation defaults to Unsplash ($0). Text defaults to Haiku ($0.00x). Never import expensive models (Sonnet/GPT-4o) without explicit justification.
3. **Auth at the boundary:** Every single `app/api/aeo/*` route must check `auth0.getSession()` before hitting Prisma.
4. **Prisma Client reuse:** The Prisma client must be imported from `lib/db.ts` to prevent connection exhaustion in serverless environments.
5. **No Edge runtime for DB:** Prisma does not natively support Edge without Accelerate. All DB-dependent API routes must remain on the default `nodejs` runtime.
