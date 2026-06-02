# Project Overview

## What we are building
**itappens AEO** is a highly cost-effective, fully automated Answer Engine Optimization (AEO) and SEO autoblogging platform. It serves as an internal engine (initially for clients like NewKRINN's Verdict) to autonomously research, write, illustrate, and publish deep-dive, AI-generated content directly to WordPress at scale. It completely reverse-engineers the capabilities of blogauto.ai but operates at a fraction of the cost by leveraging Claude 3.5 Haiku and Unsplash.

## Goals
1. Provide a completely hands-off content automation pipeline from idea to published WordPress post.
2. Maintain extreme cost-efficiency (pennies per article) using Haiku and free APIs.
3. Serve as a lead-generation and e-commerce sales engine by intelligently injecting product links.
4. Scale easily to handle multiple clients (e.g., NewKRINN's Verdict) under one dashboard.

## Core User Flow
1. User logs in via Auth0 and connects their WordPress site (URL, Username, App Password).
2. User navigates to the **Keyword Planner** and enters a seed keyword (e.g., "Real Estate").
3. The system generates a 30-day topic cluster map.
4. User clicks "Approve All" to send them to the **Queue**.
5. The **Smart Scheduler** automatically schedules them to publish at optimal drip intervals.
6. The background worker (Upstash QStash) processes each article at its scheduled time: 
   - Claude 3.5 Haiku writes the 2000-word HTML article.
   - Unsplash fetches the featured image.
   - The WordPress REST API uploads the image and publishes the post.
7. The user views published analytics and remaining credits on the dashboard.

## Features
- **Smart Queue & Scheduler:** Cron-driven drip publishing.
- **AI Content Planner:** Bulk topic generation based on seed keywords.
- **E-commerce Injector:** Auto-inserts specific product URLs into articles to drive sales.
- **Multi-site Management:** Manage distinct WordPress sites and credentials securely.
- **Credit System:** Track API usage via a scalable credit deduction system.

## In Scope
- Next.js 15 App Router dashboard for itappens AEO.
- Background worker execution via Upstash QStash.
- Claude 3.5 Haiku text generation.
- Unsplash image fetching.
- WordPress REST API integrations.
- Auth0 Authentication.

## Out of Scope
- Native image generation models (FLUX/Midjourney) are OUT OF SCOPE due to cost constraints (unless explicitly overridden by the user).
- Integration with Ghost, Webflow, or Shopify blogs (WordPress ONLY for now).
- Complex multi-tenant RBAC (Role Based Access Control) beyond simple user-email isolation.

## Success Criteria
- A user can connect a WordPress site, generate 30 topics instantly, and the system successfully trickles them out to the live blog over a month without any further human intervention.
