# Unit 03: The AI Keyword Planner API

## Goal
Create an API route `app/api/aeo/planner/route.ts` that takes a seed keyword and uses Claude Haiku to instantly generate a JSON array of 30 semantic topic clusters optimized for Answer Engines.

## Design
- Endpoint: `POST /api/aeo/planner`
- Payload: `{ seedKeyword: string }`
- Response: `{ topics: { title: string, targetQuery: string, estimatedVolume: string }[] }`

## Implementation

### 1. `app/api/aeo/planner/route.ts`
- Must wrap in `try/catch`.
- Verify user session via Auth0.
- Initialize `Anthropic` client.
- System prompt instructs Claude to generate 30 high-intent, long-tail AEO queries related to the `seedKeyword`.
- Enforce output format as raw JSON.
- Return the JSON to the client.

### 2. Validation
- Protect against missing `seedKeyword` or unauthorized requests.

## Dependencies
- `@auth0/nextjs-auth0`
- `@anthropic-ai/sdk` (already installed)

## Verify when done
- [ ] Endpoint is securely restricted to logged-in users.
- [ ] Haiku successfully returns a valid JSON array of 30 topics.
- [ ] No Prisma writes occur here (this is just the planning phase).
