# Unit 05: Smart Scheduling Engine & Queue UI

## Goal
Implement a drip-feed scheduling system so that when 30 articles are queued, they don't all publish on the same day. Instead, they are spaced out (e.g., 1 per day). The background worker must only process articles whose `scheduledFor` date has passed.

## Design
- **API `POST /api/aeo/articles`:** When queuing multiple articles, we need a way to increment their `scheduledFor` date based on existing queued articles.
- **Worker `POST /api/aeo/worker`:** When QStash calls the cron endpoint every hour, it should only select articles where `status == 'PENDING'` AND `scheduledFor <= NOW()` AND `isPaused == false`.
- **UI:** The Queue tab should display the exact `scheduledFor` time.

## Implementation

### 1. Update `/api/aeo/articles/route.ts`
When an article is created:
- Query the DB for the most recent `scheduledFor` date for this user/site.
- If one exists and is in the future, set the new article's `scheduledFor` to `latestDate + 24 hours` (or a random interval between 12-36 hours for organic patterns, but let's stick to 24 hours for simplicity).
- If none exist, set `scheduledFor` to `NOW()` (publish immediately).

### 2. Update `/api/aeo/worker/route.ts`
Modify the Prisma query that fetches the next article to process.
```typescript
const article = await tx.aeoArticle.findFirst({
  where: {
    status: 'PENDING',
    isPaused: false,
    scheduledFor: {
      lte: new Date()
    }
  },
  // ...
});
```

## Dependencies
- Prisma

## Verify when done
- [ ] Approving 30 articles spaces their dates out by 1 day each.
- [ ] The Queue UI shows "Scheduled: Tomorrow", "Scheduled: in 2 days", etc.
- [ ] The worker ignores articles scheduled in the future.
