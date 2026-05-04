export type AuditPlanKey = "free" | "starter" | "growth" | "authority";
export type CheckoutProvider = "stripe" | "razorpay";

export type CrawlPage = {
  url: string;
  title?: string | null;
  description?: string | null;
  markdown?: string | null;
  html?: string | null;
  canonical?: string | null;
  statusCode?: number | null;
  wordCount: number;
  h1?: string | null;
  h2s: string[];
  internalLinks: number;
  externalLinks: number;
  schemaTypes: string[];
  hasRobotsMeta: boolean;
  hasOpenGraph: boolean;
};

export type CrawlSummary = {
  pages: CrawlPage[];
  mappedUrls: string[];
  sitemapUrl: string | null;
  robotsUrl: string | null;
  hasLlmsTxt: boolean;
};

export type SerpSnapshot = {
  keyword: string;
  topResults: Array<{
    rank: number;
    domain: string;
    title: string;
    url: string;
  }>;
};

export type KeywordOpportunity = {
  keyword: string;
  searchVolume: number;
  keywordDifficulty: number | null;
  intent: string;
};

export type CompetitorSnapshot = {
  domain: string;
  intersections: number;
  avgPosition: number | null;
  etv: number | null;
};

export type BacklinkSnapshot = {
  referringDomains: number;
  backlinks: number;
  dofollowBacklinks: number;
  rank: number | null;
};

export type AuditFacts = {
  siteUrl: string;
  hostname: string;
  plan: AuditPlanKey;
  targetKeywords: string[];
  crawl: CrawlSummary;
  serp: SerpSnapshot[];
  keywordIdeas: KeywordOpportunity[];
  competitors: CompetitorSnapshot[];
  backlinks: BacklinkSnapshot | null;
  scores: {
    technical: number;
    onPage: number;
    geoReadiness: number;
    authority: number;
    overall: number;
  };
  quickWins: string[];
  blockers: string[];
};

export type AuditReport = {
  version: string;
  generatedAt: string;
  siteUrl: string;
  hostname: string;
  plan: AuditPlanKey;
  tierLabel: string;
  overallScore: number;
  technicalScore: number;
  onPageScore: number;
  geoReadinessScore: number;
  authorityScore: number;
  headline: string;
  executiveSummary: string;
  ticker: string[];
  benchmark: Array<{
    label: string;
    score: number;
    note: string;
  }>;
  quickWins: Array<{
    title: string;
    detail: string;
    impact: "High" | "Medium" | "Low";
  }>;
  blockers: Array<{
    title: string;
    detail: string;
    severity: "Critical" | "High" | "Medium";
  }>;
  serpHighlights: Array<{
    keyword: string;
    winners: string[];
    itappensAngle: string;
  }>;
  opportunities: Array<{
    keyword: string;
    whyItMatters: string;
    priority: "P1" | "P2" | "P3";
  }>;
  roadmap: Array<{
    phase: string;
    window: string;
    goal: string;
    deliverables: string[];
  }>;
  monetizationAngles: string[];
  reportSections: Array<{
    title: string;
    body: string[];
  }>;
  chartSeries: Array<{
    name: string;
    score: number;
  }>;
  topPages: Array<{
    url: string;
    title: string;
    wordCount: number;
    score: number;
  }>;
  competitorTable: Array<{
    domain: string;
    intersections: number;
    avgPosition: number | null;
    etv: number | null;
  }>;
  cta: {
    title: string;
    body: string;
    buttonLabel: string;
    buttonUrl: string;
  };
};
