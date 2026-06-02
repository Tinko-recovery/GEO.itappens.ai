# Unit 02: Database Expansion for the Engine

## Goal
Expand the Prisma schema to support the advanced autoblogging features reverse-engineered from Blogauto.ai (Keyword Planning, Smart Scheduling, and E-commerce Injection).

## Design
We are keeping the architecture serverless-friendly. All state is managed in Neon via Prisma.

## Implementation

### 1. Prisma Schema Modifications
Modify `prisma/schema.prisma` to update the `AeoArticle` model.

**Add the following fields:**
- `seedKeyword String?`: The parent keyword cluster this article belongs to.
- `scheduledFor DateTime?`: The future date/time this article should be published.
- `isPaused Boolean @default(false)`: Allows the user to halt a scheduled article.
- `ecommerceUrl String?`: An optional product URL (Shopify/Woo) to inject into the article.

### 2. Migration
Run `npx prisma db push` (or `migrate dev` if using migrations, but for rapid prototyping `db push` is often used. We'll use `db push` since we're adding optional/default fields).

## Dependencies
- Prisma CLI.

## Verify when done
- [ ] `npx prisma generate` succeeds.
- [ ] Database schema is successfully updated.
