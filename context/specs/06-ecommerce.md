# Unit 06: E-Commerce Product Injection Logic

## Goal
Allow users to optionally provide an E-Commerce Product URL (like a Shopify/WooCommerce link). During article generation, Claude should seamlessly inject this product into the article as a recommended solution, converting readers to buyers.

## Design
- **API `POST /api/aeo/articles`:** Update to accept an optional `ecommerceUrl`.
- **Worker:** Fetch the `ecommerceUrl` from the article record.
- **AI Logic `lib/ai.ts`:** Update the `generateAEOArticle` prompt. If `ecommerceUrl` is provided, append instructions for Claude to naturally weave it into the content (e.g., in a "Recommended Solution" or "How to solve this" section).

## Implementation

### 1. `app/api/aeo/articles/route.ts`
- Extract `ecommerceUrl` from `req.json()`.
- Pass it to `tx.aeoArticle.create()`.

### 2. `lib/ai.ts`
- Update `generateAEOArticle(topic: string, ecommerceUrl?: string | null)` to accept the URL.
- If `ecommerceUrl` exists, inject a prompt constraint: `"The user is trying to sell a product at this URL: ${ecommerceUrl}. You MUST weave a contextual, natural-sounding recommendation for this product into the article, ideally as the ultimate solution to the problem being discussed. Include the exact URL as an HTML href link."`

### 3. `app/api/aeo/worker/route.ts`
- Read `article.ecommerceUrl`.
- Pass it to `generateAEOArticle(topic, article.ecommerceUrl)`.

## Dependencies
- None.

## Verify when done
- [ ] Passing an ecommerce URL successfully modifies the Claude prompt.
- [ ] Generated articles include the `<a>` tag pointing to the product.
