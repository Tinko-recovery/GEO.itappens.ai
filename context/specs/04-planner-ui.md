# Unit 04: The Keyword Planner UI

## Goal
Build the UI in `components/social/SocialDashboard.tsx` to allow users to generate keyword clusters and bulk-approve them into the generation queue.

## Design
- Follow the `ui-context.md` dark-mode, glassmorphic design.
- We need a new Tab system at the top of the dashboard: "Planner", "Queue", "Sites".
- The **Planner** tab:
  - A prominent input field for the Seed Keyword (e.g., "Real Estate Connecticut").
  - A button to "Generate 30-Day Cluster".
  - A loading state (pulse or spinner) while waiting for the AI.
  - A grid of generated topics displaying Title, Target Query, and Volume.
  - A "Queue All" button that iterates over the generated list and POSTs them to `/api/aeo/articles`, then clears the list.

## Implementation

### 1. Tab System
- Introduce `activeTab` state (`'planner' | 'queue' | 'sites'`).
- Update the main render block to switch between these views. (Currently it just shows everything at once).

### 2. Planner View
- State: `seedKeyword` (string), `isGenerating` (boolean), `generatedTopics` (array).
- On generate: POST to `/api/aeo/planner`.
- On approve: Loop over `generatedTopics`, POST to `/api/aeo/articles` for each (with a slight delay to avoid rate limits, or just standard `Promise.all` but let's do sequential to prevent hitting 30 DB connections simultaneously).
- Once approved, switch tab to 'Queue' to show them.

## Dependencies
- Lucide React (already used).

## Verify when done
- [ ] User can switch tabs.
- [ ] User can enter a keyword and see the list populate.
- [ ] Approving the list successfully queues them in the DB and deducts credits.
