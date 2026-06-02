# Build Plan for itappens AEO

This document outlines the sequential units of work to reverse engineer the target SaaS capabilities into itappens AEO. Each unit must be completed and verified before moving to the next.

## Unit 01: The Public Marketing Landing Page
- **Builds:** A high-converting, dark-mode, glassmorphic landing page at the root (`app/(marketing)/page.tsx`) to sell the SaaS.
- **Features:** Hero section, features grid, pricing tables, and "Trusted By" sections (adapted from the target site for NewKRINN).
- **Dependencies:** None.

## Unit 02: Database Expansion for the Engine
- **Builds:** Modifications to `prisma/schema.prisma` to support advanced autoblogging features.
- **Features:** Adds `seedKeyword`, `scheduledFor`, `isPaused`, and `ecommerceUrl` fields to `AeoArticle`.
- **Dependencies:** Prisma.

## Unit 03: The AI Keyword Planner API
- **Builds:** `app/api/aeo/planner/route.ts`
- **Features:** Takes a single seed keyword and uses Claude Haiku to instantly generate a JSON array of 30 semantic topic clusters optimized for Answer Engines.
- **Dependencies:** Unit 02 (Database).

## Unit 04: The Keyword Planner UI
- **Builds:** A new tab/view in `SocialDashboard.tsx` for the Planner.
- **Features:** An input for the seed keyword, a loading state, and a grid view of the 30 generated topics with a 1-click "Approve & Queue All" button.
- **Dependencies:** Unit 03 (Planner API).

## Unit 05: Smart Scheduling Engine & Queue UI
- **Builds:** The drip-feed logic.
- **Features:** Modifies the Dashboard to show "Scheduled For" dates. Updates the background worker (`app/api/aeo/worker/route.ts`) to only process articles where `scheduledFor <= NOW()`.
- **Dependencies:** Unit 02 (Database).

## Unit 06: E-commerce Product Injection Logic
- **Builds:** The backend logic to naturally weave a provided `ecommerceUrl` into the generated article text as a recommended product.
- **Features:** Updates the Claude Haiku prompt in `lib/ai.ts` to accept an optional product link and seamlessly pitch it in the article context.
- **Dependencies:** Unit 02 (Database).
