import { getHostname } from "@/lib/utils";

import type { AuditFacts, CrawlPage, CrawlSummary } from "@/lib/audit/types";

function scorePage(page: CrawlPage) {
  let score = 0;
  if (page.title && page.title.length >= 25) score += 15;
  if (page.description && page.description.length >= 90) score += 15;
  if (page.h1) score += 10;
  if (page.canonical) score += 10;
  if (page.wordCount >= 350) score += 10;
  if (page.schemaTypes.length) score += 10;
  if (page.hasOpenGraph) score += 10;
  if (page.internalLinks >= 4) score += 10;
  if (page.externalLinks >= 1) score += 5;
  if (page.h2s.length >= 2) score += 5;
  return score;
}

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function buildQuickWins(crawl: CrawlSummary, hostname: string) {
  const wins: string[] = [];
  const homepage = crawl.pages[0];

  if (!crawl.hasLlmsTxt) wins.push(`Publish /llms.txt with canonical GEO source pages for ${hostname}.`);
  if (!crawl.sitemapUrl) wins.push("Expose a clean XML sitemap and reference it in robots.txt.");
  if (homepage && !homepage.schemaTypes.length) wins.push("Add Organization + Service + FAQ schema to the core money pages.");
  if (homepage && !homepage.canonical) wins.push("Set a canonical on the homepage and all service pages.");
  if (homepage && homepage.wordCount < 250) wins.push("Expand the homepage with extractable answer blocks and proof-rich copy.");
  if (!wins.length) wins.push("Convert the strongest FAQ and proof sections into answer-first snippets for AI retrieval.");

  return wins;
}

function buildBlockers(crawl: CrawlSummary) {
  const blockers: string[] = [];
  const thinPages = crawl.pages.filter((page) => page.wordCount < 180);
  const pagesWithoutH1 = crawl.pages.filter((page) => !page.h1);
  const pagesWithoutSchema = crawl.pages.filter((page) => !page.schemaTypes.length);

  if (!crawl.pages.length) blockers.push("The crawler returned no readable pages.");
  if (thinPages.length >= Math.max(2, Math.floor(crawl.pages.length / 2))) blockers.push("Most crawled pages are too thin to become citeable answer assets.");
  if (pagesWithoutH1.length >= 2) blockers.push("Key pages are missing a single clear H1 heading.");
  if (pagesWithoutSchema.length >= 2) blockers.push("Core pages do not expose JSON-LD schema for entity clarity.");
  if (!crawl.robotsUrl) blockers.push("robots.txt is missing or inaccessible.");

  return blockers;
}

export function calculateScores(input: {
  siteUrl: string;
  crawl: CrawlSummary;
  serpCount: number;
  competitorCount: number;
  keywordCount: number;
  backlinks: number;
}) {
  const pageScores = input.crawl.pages.map(scorePage);
  const avgPageScore = average(pageScores);
  const schemaCoverage =
    input.crawl.pages.length === 0
      ? 0
      : Math.round((input.crawl.pages.filter((page) => page.schemaTypes.length).length / input.crawl.pages.length) * 100);

  const canonicalCoverage = average(input.crawl.pages.map((page) => Number(Boolean(page.canonical)) * 100));

  const technical = Math.round(
    Number(Boolean(input.crawl.robotsUrl)) * 15 +
      Number(Boolean(input.crawl.sitemapUrl)) * 15 +
      Number(Boolean(input.crawl.hasLlmsTxt)) * 20 +
      canonicalCoverage * 0.25 +
      schemaCoverage * 0.25,
  );

  const onPage = Math.round(avgPageScore);
  const geoReadiness = Math.min(
    100,
    Math.round(
      Number(Boolean(input.crawl.hasLlmsTxt)) * 20 +
        schemaCoverage * 0.2 +
        Math.min(input.keywordCount * 6, 24) +
        Math.min(input.serpCount * 8, 24) +
        Math.min(input.crawl.pages.length * 3, 12),
    ),
  );

  const authority = Math.min(
    100,
    Math.round(Math.min(input.backlinks / 8, 30) + Math.min(input.competitorCount * 7, 35) + Math.min(input.serpCount * 5, 35)),
  );

  const overall = Math.round(technical * 0.32 + onPage * 0.28 + geoReadiness * 0.25 + authority * 0.15);

  return { technical, onPage, geoReadiness, authority, overall };
}

export function buildFacts(input: Omit<AuditFacts, "quickWins" | "blockers">): AuditFacts {
  const hostname = getHostname(input.siteUrl);
  return {
    ...input,
    quickWins: buildQuickWins(input.crawl, hostname),
    blockers: buildBlockers(input.crawl),
  };
}
