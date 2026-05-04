import { env } from "@/lib/env";
import { getHostname, normalizeSiteUrl } from "@/lib/utils";

import type { CrawlPage, CrawlSummary } from "@/lib/audit/types";

function parseHeading(html: string | null | undefined, tag: "h1" | "h2") {
  if (!html) return tag === "h1" ? null : [];

  const matcher = new RegExp(`<${tag}[^>]*>(.*?)<\\/${tag}>`, "gis");
  const values: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(html))) {
    values.push(match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  }

  return tag === "h1" ? values[0] || null : values.filter(Boolean);
}

function countLinks(html: string | null | undefined, hostname: string) {
  if (!html) return { internal: 0, external: 0 };

  const matches = html.match(/href="([^"]+)"/gi) || [];
  let internal = 0;
  let external = 0;

  for (const rawMatch of matches) {
    const href = rawMatch.replace(/^href="/i, "").replace(/"$/, "");
    if (href.startsWith("/") || href.includes(hostname)) {
      internal += 1;
    } else if (/^https?:\/\//i.test(href)) {
      external += 1;
    }
  }

  return { internal, external };
}

function parseSchemaTypes(html: string | null | undefined) {
  if (!html) return [];

  const scripts = html.match(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || [];
  const types = new Set<string>();

  for (const script of scripts) {
    const text = script.replace(/<script[^>]*>|<\/script>/gi, "").trim();
    for (const typeMatch of text.matchAll(/"@type"\s*:\s*"([^"]+)"/g)) {
      types.add(typeMatch[1]);
    }
  }

  return Array.from(types);
}

async function firecrawlRequest<T>(path: string, body: Record<string, unknown>) {
  if (!env.FIRECRAWL_API_KEY) {
    return null;
  }

  const response = await fetch(`${env.FIRECRAWL_API_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Firecrawl request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

async function scrapePage(url: string): Promise<CrawlPage | null> {
  const hostname = getHostname(url);

  try {
    const result = await firecrawlRequest<{
      data?: {
        markdown?: string;
        html?: string;
        metadata?: {
          title?: string;
          description?: string;
          canonical?: string;
          statusCode?: number;
        };
      };
    }>("/v1/scrape", {
      url,
      formats: ["markdown", "html"],
      onlyMainContent: true,
    });

    const data = result?.data;
    const html = data?.html || "";
    const markdown = data?.markdown || "";
    const links = countLinks(html, hostname);

    return {
      url,
      title: data?.metadata?.title || null,
      description: data?.metadata?.description || null,
      markdown,
      html,
      canonical: data?.metadata?.canonical || null,
      statusCode: data?.metadata?.statusCode || null,
      wordCount: markdown.split(/\s+/).filter(Boolean).length,
      h1: parseHeading(html, "h1") as string | null,
      h2s: parseHeading(html, "h2") as string[],
      internalLinks: links.internal,
      externalLinks: links.external,
      schemaTypes: parseSchemaTypes(html),
      hasRobotsMeta: /<meta[^>]+name=["']robots["']/i.test(html),
      hasOpenGraph: /<meta[^>]+property=["']og:/i.test(html),
    };
  } catch {
    return null;
  }
}

async function fetchText(url: string) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    return response.ok ? await response.text() : null;
  } catch {
    return null;
  }
}

export async function crawlSite(siteUrl: string, limit: number): Promise<CrawlSummary> {
  const normalized = normalizeSiteUrl(siteUrl);
  const hostname = getHostname(normalized);
  const mappedUrls = new Set<string>([normalized]);

  if (env.FIRECRAWL_API_KEY) {
    try {
      const mapResult = await firecrawlRequest<{ data?: { links?: string[] } }>("/v1/map", {
        url: normalized,
        limit,
        ignoreSitemap: false,
      });

      for (const link of mapResult?.data?.links || []) {
        if (getHostname(link) === hostname) {
          mappedUrls.add(link);
        }
      }
    } catch {
      // fall back to homepage-only crawl
    }
  }

  const selectedUrls = Array.from(mappedUrls).slice(0, limit);
  const pages = (await Promise.all(selectedUrls.map((url) => scrapePage(url)))).filter(Boolean) as CrawlPage[];

  const robotsUrl = new URL("/robots.txt", normalized).toString();
  const llmsUrl = new URL("/llms.txt", normalized).toString();
  const sitemapUrl = new URL("/sitemap.xml", normalized).toString();

  const [robotsText, llmsText, sitemapText] = await Promise.all([
    fetchText(robotsUrl),
    fetchText(llmsUrl),
    fetchText(sitemapUrl),
  ]);

  return {
    pages,
    mappedUrls: selectedUrls,
    robotsUrl: robotsText ? robotsUrl : null,
    sitemapUrl: sitemapText ? sitemapUrl : null,
    hasLlmsTxt: Boolean(llmsText),
  };
}
