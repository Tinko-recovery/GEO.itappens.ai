import { env } from "@/lib/env";
import { getHostname } from "@/lib/utils";

import type { BacklinkSnapshot, CompetitorSnapshot, KeywordOpportunity, SerpSnapshot } from "@/lib/audit/types";

function getAuthHeader() {
  if (!env.DATAFORSEO_LOGIN || !env.DATAFORSEO_PASSWORD) {
    return null;
  }

  return `Basic ${Buffer.from(`${env.DATAFORSEO_LOGIN}:${env.DATAFORSEO_PASSWORD}`).toString("base64")}`;
}

async function dataForSeoRequest<T>(path: string, tasks: unknown[]) {
  const auth = getAuthHeader();
  if (!auth) {
    return null;
  }

  const response = await fetch(`${env.DATAFORSEO_API_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tasks),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`DataForSEO request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchSerpSnapshots(keywords: string[], language = "English", location = 2840) {
  if (!keywords.length) return [] as SerpSnapshot[];

  try {
    const response = await dataForSeoRequest<{
      tasks?: Array<{
        result?: Array<{
          keyword?: string;
          items?: Array<{
            rank_absolute?: number;
            domain?: string;
            title?: string;
            url?: string;
          }>;
        }>;
      }>;
    }>(env.DATAFORSEO_SERP_ENDPOINT, keywords.map((keyword) => ({ keyword, language_name: language, location_code: location })));

    return (response?.tasks || [])
      .flatMap((task) => task.result || [])
      .map((result) => ({
        keyword: result.keyword || "",
        topResults: (result.items || []).slice(0, 8).map((item) => ({
          rank: item.rank_absolute || 0,
          domain: item.domain || "",
          title: item.title || "",
          url: item.url || "",
        })),
      }))
      .filter((item) => item.keyword);
  } catch {
    return [];
  }
}

export async function fetchKeywordIdeas(seedKeyword: string, location = 2840) {
  if (!seedKeyword) return [] as KeywordOpportunity[];

  try {
    const response = await dataForSeoRequest<{
      tasks?: Array<{
        result?: Array<{
          items?: Array<{
            keyword?: string;
            keyword_info?: {
              search_volume?: number;
            };
            keyword_properties?: {
              keyword_difficulty?: number;
            };
            search_intent_info?: {
              main_intent?: string;
            };
          }>;
        }>;
      }>;
    }>(env.DATAFORSEO_KEYWORDS_ENDPOINT, [{ keywords: [seedKeyword], location_code: location, include_serp_info: true }]);

    return (response?.tasks || [])
      .flatMap((task) => task.result || [])
      .flatMap((result) => result.items || [])
      .slice(0, 12)
      .map((item) => ({
        keyword: item.keyword || "",
        searchVolume: item.keyword_info?.search_volume || 0,
        keywordDifficulty: item.keyword_properties?.keyword_difficulty || null,
        intent: item.search_intent_info?.main_intent || "mixed",
      }))
      .filter((item) => item.keyword);
  } catch {
    return [];
  }
}

export async function fetchCompetitors(domain: string, location = 2840) {
  if (!domain) return [] as CompetitorSnapshot[];

  try {
    const response = await dataForSeoRequest<{
      tasks?: Array<{
        result?: Array<{
          items?: Array<{
            domain?: string;
            intersections?: number;
            avg_position?: number;
            etv?: number;
          }>;
        }>;
      }>;
    }>(env.DATAFORSEO_COMPETITORS_ENDPOINT, [{ target: domain, location_code: location, limit: 10 }]);

    return (response?.tasks || [])
      .flatMap((task) => task.result || [])
      .flatMap((result) => result.items || [])
      .map((item) => ({
        domain: item.domain || "",
        intersections: item.intersections || 0,
        avgPosition: item.avg_position || null,
        etv: item.etv || null,
      }))
      .filter((item) => item.domain && item.domain !== domain);
  } catch {
    return [];
  }
}

export async function fetchBacklinkSummary(siteUrl: string) {
  const target = getHostname(siteUrl);

  try {
    const response = await dataForSeoRequest<{
      tasks?: Array<{
        result?: Array<{
          items?: Array<{
            referring_domains?: number;
            backlinks?: number;
            dofollow?: number;
            rank?: number;
          }>;
        }>;
      }>;
    }>(env.DATAFORSEO_BACKLINKS_ENDPOINT, [{ target, internal_list_limit: 1 }]);

    const first = response?.tasks?.[0]?.result?.[0]?.items?.[0];
    if (!first) return null as BacklinkSnapshot | null;

    return {
      referringDomains: first.referring_domains || 0,
      backlinks: first.backlinks || 0,
      dofollowBacklinks: first.dofollow || 0,
      rank: first.rank || null,
    } as BacklinkSnapshot;
  } catch {
    return null;
  }
}
