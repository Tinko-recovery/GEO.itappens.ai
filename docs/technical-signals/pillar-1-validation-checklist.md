# Pillar 1 Validation Checklist

## Deployment files
- [ ] `public/llms.txt` is public and returns 200.
- [ ] `public/llms-full.txt` is public and returns 200.
- [ ] `public/robots.txt` points to `https://www.itappens.ai/sitemap.xml`.
- [ ] `app/sitemap.ts` generates the canonical route list.

## Route validation
- [ ] `/` returns 200 and has a single canonical URL on the www domain.
- [ ] `/geo` returns 200 and exposes Service + FAQPage + HowTo JSON-LD.
- [ ] `/how-it-works` returns 200 and exposes Service + HowTo JSON-LD.
- [ ] `/case-studies` returns 200 and exposes Article JSON-LD with real dates.
- [ ] `/answers` returns 200 and links to all answer detail pages.
- [ ] Each answer detail page returns 200 and exposes Article + visible FAQ data.

## Markup checks
- [ ] Each page has one visible h1.
- [ ] Section headings descend in order.
- [ ] Metrics use `dl` where appropriate.
- [ ] Process steps use `ol`.
- [ ] Secondary proof blocks use `aside` only when they are not the main content.

## Domain and crawl checks
- [ ] Bare-domain requests redirect to `https://www.itappens.ai`.
- [ ] No route-level canonical points to the bare domain.
- [ ] Sitemap contains the 7 answer pages plus the core public routes.
- [ ] llms.txt and metadata use the same preferred URLs.

## Build checks
- [ ] `npm run build` passes.
- [ ] There are no schema/runtime type errors during build.
- [ ] Internal links among `/geo`, `/how-it-works`, `/case-studies`, and `/answers` all resolve.
