import Anthropic from "@anthropic-ai/sdk";
import { AuditPlan, AuditStatus, PaymentStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { sendAuditReadyEmail } from "@/lib/email";
import { buildAbsoluteUrl, getHostname } from "@/lib/utils";

import { crawlSite } from "@/lib/audit/firecrawl";
import { fetchBacklinkSummary, fetchCompetitors, fetchKeywordIdeas, fetchSerpSnapshots } from "@/lib/audit/dataforseo";
import { buildAuditPrompt } from "@/lib/audit/prompt";
import { renderAuditHtml } from "@/lib/audit/report-html";
import { buildFacts, calculateScores } from "@/lib/audit/scoring";
import type { AuditFacts, AuditPlanKey, AuditReport } from "@/lib/audit/types";

const anthropic = env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: env.ANTHROPIC_API_KEY }) : null;

function enumToPlan(plan: AuditPlan): AuditPlanKey {
  return plan.toLowerCase() as AuditPlanKey;
}

function fallbackReport(facts: AuditFacts): AuditReport {
  const tierLabel =
    facts.plan === "free"
      ? "Free Snapshot"
      : facts.plan === "starter"
        ? "Starter Deep Audit"
        : facts.plan === "growth"
          ? "Growth Deep Audit"
          : "Authority Deep Audit";

  const pages = facts.crawl.pages
    .map((page) => ({
      url: page.url,
      title: page.title || page.h1 || "Untitled page",
      wordCount: page.wordCount,
      score:
        Number(Boolean(page.title)) * 20 +
        Number(Boolean(page.description)) * 15 +
        Number(Boolean(page.h1)) * 15 +
        Number(Boolean(page.canonical)) * 15 +
        Math.min(page.wordCount / 20, 20) +
        Math.min(page.internalLinks * 2, 15),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    siteUrl: facts.siteUrl,
    hostname: facts.hostname,
    plan: facts.plan,
    tierLabel,
    overallScore: facts.scores.overall,
    technicalScore: facts.scores.technical,
    onPageScore: facts.scores.onPage,
    geoReadinessScore: facts.scores.geoReadiness,
    authorityScore: facts.scores.authority,
    headline: `${facts.hostname} needs a tighter GEO + SEO operating layer before competitors lock in answer-engine citations.`,
    executiveSummary:
      "This audit combines crawl hygiene, SERP pressure, and GEO-specific extraction readiness into one operating picture. The brand has enough surface area to win, but the technical and entity layers need to become cleaner, denser, and easier for both search engines and LLM retrieval systems to trust.",
    ticker: [
      `${facts.crawl.pages.length} pages analysed`,
      `${facts.keywordIdeas.length} keyword opportunities modelled`,
      `${facts.competitors.length} competitors surfaced`,
      `${facts.backlinks?.referringDomains ?? 0} referring domains detected`,
    ],
    benchmark: [
      { label: "Technical", score: facts.scores.technical, note: "Core crawlability, canonicals, sitemap, schema, llms.txt." },
      { label: "On-page", score: facts.scores.onPage, note: "Title, metadata, content density, heading structure, internal linking." },
      { label: "GEO Readiness", score: facts.scores.geoReadiness, note: "Answer extractability, entity clarity, and citation-friendly formatting." },
      { label: "Authority", score: facts.scores.authority, note: "SERP competitiveness, backlink footing, and off-site corroboration." },
    ],
    quickWins: facts.quickWins.slice(0, 4).map((detail, index) => ({
      title: `Quick win ${index + 1}`,
      detail,
      impact: index < 2 ? "High" : "Medium",
    })),
    blockers: facts.blockers.slice(0, 4).map((detail, index) => ({
      title: `Blocker ${index + 1}`,
      detail,
      severity: index === 0 ? "Critical" : "High",
    })),
    serpHighlights: facts.serp.slice(0, 3).map((snapshot) => ({
      keyword: snapshot.keyword,
      winners: snapshot.topResults.slice(0, 3).map((item) => item.domain),
      itappensAngle: "Build a page that answers the exact query with stronger proof, structured FAQ blocks, and cleaner entity signals.",
    })),
    opportunities: facts.keywordIdeas.slice(0, 4).map((item, index) => ({
      keyword: item.keyword,
      whyItMatters: `The query shows ${item.searchVolume.toLocaleString("en-IN")} monthly demand and is a clean wedge for a citeable answer asset.`,
      priority: index === 0 ? "P1" : index < 3 ? "P2" : "P3",
    })),
    roadmap: [
      {
        phase: "Stabilize the crawl surface",
        window: "Days 0-30",
        goal: "Remove technical ambiguity and give crawlers a single clean brand narrative.",
        deliverables: [
          "Fix canonicals, sitemap, robots, and llms.txt.",
          "Add Organization, Service, FAQ, and Article schema where relevant.",
          "Rewrite the homepage and service pages into answer-first blocks.",
        ],
      },
      {
        phase: "Publish demand-mapped answer assets",
        window: "Days 31-60",
        goal: "Turn high-intent keywords into pages that can win both SERP clicks and AI citations.",
        deliverables: [
          "Ship the first answer cluster around money keywords and buyer objections.",
          "Build internal linking from homepage, service page, and FAQ blocks.",
          "Add original proof blocks and benchmark data to increase liftability.",
        ],
      },
      {
        phase: "Operationalize GEO as a retainer",
        window: "Days 61-90",
        goal: "Move from one-off fixes to repeatable citation growth and monthly reporting.",
        deliverables: [
          "Install monthly keyword + citation monitoring.",
          "Expand entity corroboration across third-party mentions and profiles.",
          "Run monthly report reviews tied to pipeline and lead quality outcomes.",
        ],
      },
    ],
    monetizationAngles: [
      "Higher-intent answer pages reduce leakage to competitor sites when prospects research in Google and ChatGPT.",
      "A cleaner entity layer makes outbound PR, directory profiles, and citations compound instead of fragment.",
      "The monthly retainer becomes justified by recurring report diffs, new clusters, and competitor-response cycles.",
    ],
    reportSections: [
      {
        title: "What The Crawl Shows",
        body: [
          `The crawler found ${facts.crawl.pages.length} readable pages. The strongest assets already have enough structure to rank and be cited, but too many pages still underperform on canonical clarity, schema coverage, or answer density.`,
          "The priority is not more pages for the sake of volume. The priority is fewer, sharper, better-structured pages that answer the exact commercial and informational prompts buyers already use.",
        ],
      },
      {
        title: "Where Competitors Beat You",
        body: [
          facts.competitors.length
            ? `Competitors such as ${facts.competitors.slice(0, 3).map((item) => item.domain).join(", ")} currently hold the cleaner search footprint. They are more likely to benefit from broader keyword intersections, stronger off-site signals, or clearer landing page intent.`
            : "SERP competitor data is still limited, but the visible result set suggests stronger pages are winning through clarity and proof, not just backlinks.",
          "That gap is exploitable. Most sites still do not package their expertise into dense answer blocks, explicit schema, and a deliberate entity narrative.",
        ],
      },
      {
        title: "What To Ship First",
        body: [
          "Ship the technical hygiene fixes and the first cluster of answer-led commercial pages in the same sprint. Doing only one of those two steps will slow the lift.",
          "Every new page should include explicit definitions, proof, unique information gain, and a visible CTA that turns visibility into booked conversations.",
        ],
      },
      {
        title: "Why This Becomes A GEO Retainer",
        body: [
          "The deep audit is the entry point, not the finish line. Once the first fixes are live, the site needs monthly monitoring, content iteration, competitor tracking, and entity corroboration to defend and compound visibility.",
          "That is where the retainer becomes commercially rational: each month adds cleaner data, better answers, and stronger answer-engine recall.",
        ],
      },
    ],
    chartSeries: [
      { name: "Technical", score: facts.scores.technical },
      { name: "On-page", score: facts.scores.onPage },
      { name: "GEO Readiness", score: facts.scores.geoReadiness },
      { name: "Authority", score: facts.scores.authority },
    ],
    topPages: pages,
    competitorTable: facts.competitors.slice(0, 8).map((item) => ({
      domain: item.domain,
      intersections: item.intersections,
      avgPosition: item.avgPosition,
      etv: item.etv,
    })),
    cta: {
      title: "Implement this full GEO fix and turn the audit into monthly citation lift.",
      body: "Book the strategy call if you want the itappens.ai team to execute the technical cleanup, answer asset buildout, and recurring GEO reporting loop.",
      buttonLabel: "Book strategy call",
      buttonUrl: env.NEXT_PUBLIC_CALENDLY_URL,
    },
  };
}

function extractJsonObject(input: string) {
  const start = input.indexOf("{");
  const end = input.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(input.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function generateNarrativeWithAnthropic(facts: AuditFacts) {
  if (!anthropic || facts.plan === "free") return null;

  const response = await anthropic.messages.create({
    model: env.ANTHROPIC_MODEL,
    max_tokens: 3200,
    temperature: 0.3,
    messages: [{ role: "user", content: buildAuditPrompt(facts) }],
  });

  const text = response.content.map((block) => ("text" in block ? block.text : "")).join("\n").trim();
  return extractJsonObject(text);
}

function mergeNarrative(base: AuditReport, narrative: Record<string, unknown> | null): AuditReport {
  if (!narrative) return base;

  return {
    ...base,
    headline: String(narrative.headline || base.headline),
    executiveSummary: String(narrative.executiveSummary || base.executiveSummary),
    ticker: Array.isArray(narrative.ticker) && narrative.ticker.length ? (narrative.ticker as string[]) : base.ticker,
    benchmark: Array.isArray(narrative.benchmark) && narrative.benchmark.length ? (narrative.benchmark as AuditReport["benchmark"]).slice(0, 4) : base.benchmark,
    quickWins: Array.isArray(narrative.quickWins) && narrative.quickWins.length ? (narrative.quickWins as AuditReport["quickWins"]).slice(0, 5) : base.quickWins,
    blockers: Array.isArray(narrative.blockers) && narrative.blockers.length ? (narrative.blockers as AuditReport["blockers"]).slice(0, 5) : base.blockers,
    serpHighlights: Array.isArray(narrative.serpHighlights) && narrative.serpHighlights.length ? (narrative.serpHighlights as AuditReport["serpHighlights"]).slice(0, 3) : base.serpHighlights,
    opportunities: Array.isArray(narrative.opportunities) && narrative.opportunities.length ? (narrative.opportunities as AuditReport["opportunities"]).slice(0, 4) : base.opportunities,
    roadmap: Array.isArray(narrative.roadmap) && narrative.roadmap.length ? (narrative.roadmap as AuditReport["roadmap"]).slice(0, 3) : base.roadmap,
    monetizationAngles: Array.isArray(narrative.monetizationAngles) && narrative.monetizationAngles.length ? (narrative.monetizationAngles as string[]).slice(0, 3) : base.monetizationAngles,
    reportSections: Array.isArray(narrative.reportSections) && narrative.reportSections.length ? (narrative.reportSections as AuditReport["reportSections"]).slice(0, 4) : base.reportSections,
  };
}

function deriveKeywords(inputKeywords: string[], crawlTitle?: string | null, hostname?: string) {
  const explicit = inputKeywords.filter(Boolean).slice(0, 6);
  if (explicit.length) return explicit;

  const derived = new Set<string>();
  const titleWords = (crawlTitle || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 4);

  if (hostname) derived.add(hostname.replace(/\.(com|in|ai|co)$/i, ""));
  for (const word of titleWords) derived.add(word);
  return Array.from(derived).slice(0, 4);
}

export async function generateAuditReport(input: { siteUrl: string; plan: AuditPlanKey; targetKeywords: string[]; crawlDepth: number }) {
  const hostname = getHostname(input.siteUrl);
  const crawl = await crawlSite(input.siteUrl, input.crawlDepth);
  const homepage = crawl.pages[0];
  const keywords = deriveKeywords(input.targetKeywords, homepage?.title, hostname);

  const [serp, keywordIdeas, competitors, backlinks] = await Promise.all([
    fetchSerpSnapshots(keywords),
    fetchKeywordIdeas(keywords[0] || hostname),
    fetchCompetitors(hostname),
    fetchBacklinkSummary(input.siteUrl),
  ]);

  const scores = calculateScores({
    siteUrl: input.siteUrl,
    crawl,
    serpCount: serp.length,
    competitorCount: competitors.length,
    keywordCount: keywordIdeas.length,
    backlinks: backlinks?.referringDomains || 0,
  });

  const facts = buildFacts({
    siteUrl: input.siteUrl,
    hostname,
    plan: input.plan,
    targetKeywords: keywords,
    crawl,
    serp,
    keywordIdeas,
    competitors,
    backlinks,
    scores,
  });

  const baseReport = fallbackReport(facts);
  const narrative = await generateNarrativeWithAnthropic(facts).catch(() => null);
  const report = mergeNarrative(baseReport, narrative);

  return { facts, report, html: renderAuditHtml(report) };
}

export async function runAuditJob(auditId: string) {
  const audit = await prisma.audit.findUnique({ where: { id: auditId } });
  if (!audit) throw new Error(`Audit ${auditId} not found`);

  await prisma.audit.update({
    where: { id: auditId },
    data: {
      status: AuditStatus.RUNNING,
      events: { create: { type: "audit.started", payload: { startedAt: new Date().toISOString() } } },
    },
  });

  try {
    const { report, html, facts } = await generateAuditReport({
      siteUrl: audit.siteUrl,
      plan: enumToPlan(audit.plan),
      targetKeywords: audit.targetKeywords,
      crawlDepth: audit.crawlDepth,
    });

    await prisma.audit.update({
      where: { id: auditId },
      data: {
        status: AuditStatus.COMPLETED,
        paymentStatus: audit.plan === AuditPlan.FREE ? PaymentStatus.NOT_REQUIRED : PaymentStatus.PAID,
        freeScore: audit.plan === AuditPlan.FREE ? report.overallScore : audit.freeScore,
        fullScore: audit.plan === AuditPlan.FREE ? audit.fullScore : report.overallScore,
        summaryJson: facts,
        reportJson: report,
        reportHtml: html,
        events: {
          create: {
            type: "audit.completed",
            payload: { reportUrl: buildAbsoluteUrl(`/audit/report/${audit.shareToken}`), overallScore: report.overallScore },
          },
        },
      },
    });

    if (audit.plan !== AuditPlan.FREE) {
      await sendAuditReadyEmail({ email: audit.email, siteUrl: audit.siteUrl, shareToken: audit.shareToken });
    }
  } catch (error) {
    await prisma.audit.update({
      where: { id: auditId },
      data: {
        status: AuditStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : "Unknown audit error",
        events: { create: { type: "audit.failed", payload: { message: error instanceof Error ? error.message : "Unknown error" } } },
      },
    });
    throw error;
  }
}
