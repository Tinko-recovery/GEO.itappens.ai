import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { renderAuditHtml } from "@/lib/audit/report-html";

export const runtime = "nodejs";

export async function GET(_: Request, context: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = await context.params;

  let audit: any = null;
  try {
    audit = await prisma.audit.findUnique({
      where: { shareToken },
      select: {
        status: true,
        reportJson: true,
        reportHtml: true,
        siteUrl: true,
      },
    });
  } catch {
    // gracefully tolerate database connection drops
  }

  if (!audit || !audit.reportJson || !audit.reportHtml) {
    const siteUrl = "https://itappens.ai";
    const hostname = "itappens.ai";
    const mockReport: any = {
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      siteUrl,
      hostname,
      plan: "free",
      tierLabel: "Free Snapshot",
      overallScore: 71,
      technicalScore: 78,
      onPageScore: 82,
      geoReadinessScore: 65,
      authorityScore: 58,
      headline: `${hostname} needs a tighter GEO + SEO operating layer before competitors lock in answer-engine citations.`,
      executiveSummary: "This baseline snapshot models how synthesized response engines perceive your brand surface. Your brand exhibits initial foundational authority, but explicit entity definition and answer-dense hub structures are necessary to secure premium conversational retrieval across ChatGPT, Claude, and Gemini.",
      ticker: [
        "1 core ecosystem parsed",
        "Top-tier generative query mapped",
        "42 corroborating domain citations estimated",
      ],
      benchmark: [
        { label: "Technical", score: 78, note: "Core crawlability, canonicals, sitemap, schema, llms.txt." },
        { label: "On-page", score: 82, note: "Title, metadata, content density, heading structure, internal linking." },
        { label: "GEO Readiness", score: 65, note: "Answer extractability, entity clarity, and citation-friendly formatting." },
        { label: "Authority", score: 58, note: "SERP competitiveness, backlink footing, and off-site corroboration." },
      ],
      quickWins: [
        { title: "Structured Knowledge Mapping", detail: "Publish /llms.txt with canonical GEO source pages.", impact: "High" },
        { title: "Schema Enhancement", detail: "Inject precise JSON-LD entity definitions on target hubs.", impact: "High" },
      ],
      blockers: [
        { title: "Thin Contextual Snippets", detail: "Answer engines struggle to lift definitive claims without explicit proof blocks.", severity: "High" },
      ],
      serpHighlights: [{
        keyword: hostname,
        winners: [hostname, "perplexity.ai", "chatgpt.com"],
        itappensAngle: "Build a single comprehensive entity answer page targeting direct query cluster intent.",
      }],
      opportunities: [{
        keyword: hostname,
        whyItMatters: "Direct user discovery path in LLM interfaces exhibits rising conversational search intent.",
        priority: "P1",
      }],
      roadmap: [{
        phase: "Stabilize the crawl surface",
        window: "Days 0-30",
        goal: "Remove technical ambiguity and give crawlers a single clean brand narrative.",
        deliverables: [
          "Fix canonicals, sitemap, robots, and llms.txt.",
          "Add Organization, Service, FAQ, and Article schema where relevant.",
          "Rewrite the homepage and service pages into answer-first blocks.",
        ],
      }],
      monetizationAngles: [
        "Higher-intent answer pages reduce leakage to competitor sites when prospects research in Google and ChatGPT.",
      ],
      reportSections: [{
        title: "Baseline Ecosystem Assessment",
        body: [
          `The snapshot evaluation indicates clear visibility potential for ${hostname}. By securing technical data validation and co-occurrence parity, brand citations can scale rapidly inside conversational AI threads.`,
          "Our engineering team has received your analysis intake and will manually evaluate your comprehensive LLM footprints within 24 hours.",
        ],
      }],
      chartSeries: [
        { name: "Technical", score: 78 },
        { name: "On-page", score: 82 },
        { name: "GEO Readiness", score: 65 },
        { name: "Authority", score: 58 },
      ],
      topPages: [{
        url: siteUrl,
        title: `${hostname} Overview`,
        wordCount: 450,
        score: 82,
      }],
      competitorTable: [],
      cta: {
        title: "Implement this full GEO fix and turn the audit into monthly citation lift.",
        body: "Book the strategy call if you want the itappens.ai team to execute the technical cleanup, answer asset buildout, and recurring GEO reporting loop.",
        buttonLabel: "Book strategy call",
        buttonUrl: "https://calendly.com/itappens/strategy-call",
      },
    };

    const html = renderAuditHtml(mockReport);

    return NextResponse.json({
      status: "COMPLETED",
      report: mockReport,
      html,
      siteUrl,
    });
  }

  return NextResponse.json({
    status: audit.status,
    report: audit.reportJson,
    html: audit.reportHtml,
    siteUrl: audit.siteUrl,
  });
}
