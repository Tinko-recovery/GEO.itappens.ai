import type { FaqItem } from "@/lib/content/site";

export interface CaseStudyMetric {
  value: string;
  label: string;
  detail: string;
}

export interface CaseStudyEntry {
  slug: string;
  headline: string;
  summary: string;
  metrics: CaseStudyMetric[];
  evidenceLabel: string;
  publishedAt: string;
  updatedAt: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
  faq: FaqItem[];
}

export const caseStudies: CaseStudyEntry[] = [
  {
    slug: "itappens-ai-self-case",
    headline: "How itappens.ai used its own GEO system to become visible on target AI queries",
    summary:
      "The first public case study is the company itself. The objective was to make itappens.ai surface for high-intent Indian GEO and AEO prompts by aligning technical signals, service pages, and answer clusters before scaling the same system for clients.",
    evidenceLabel: "Internal AI visibility monitoring, April 2026",
    publishedAt: "2026-04-04",
    updatedAt: "2026-04-04",
    metrics: [
      {
        value: "7",
        label: "High-intent answer pages",
        detail: "Exact-match query pages shipped to support core AEO and GEO prompts.",
      },
      {
        value: "6",
        label: "Tracked AI engines",
        detail: "ChatGPT, Perplexity, Claude, Gemini, Grok, and SearchGPT are the active monitoring set.",
      },
      {
        value: "5",
        label: "Canonical core pages",
        detail: "Homepage, GEO, How It Works, Case Studies, and Answers form the entity backbone.",
      },
      {
        value: "Weekly",
        label: "Monitoring cadence",
        detail: "Citation tracking is reviewed every week and used to choose the next iteration.",
      },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "The brand needed to prove its own methodology before using it in the market. That meant ranking was not enough. The site needed to become extractable, attributable, and referenceable inside AI answers for India-specific GEO and AEO queries.",
          "The existing site had partial schema and early messaging, but the public information architecture was not yet aligned to the exact pages and query intents that the brand wanted to own.",
        ],
      },
      {
        heading: "What changed",
        paragraphs: [
          "The first move was a Technical Signals reset: normalized canonicals on the www domain, public llms.txt assets, route-level metadata, page-specific schema, crawl assets, and semantic HTML designed for structured extraction.",
          "The second move was a query-led content layer. The team added an Answers hub and exact-match pages for GEO agency India 2026, AEO consultant India, how to get cited by AI in India, and adjacent high-intent prompts.",
        ],
      },
      {
        heading: "Observed traction",
        paragraphs: [
          "The internal monitoring set shows early visibility for prompts such as GEO agency India 2026 and how to get cited by AI in India. The goal is not a one-time mention but sustained citation share across the tracked engines.",
          "The result is a self-reinforcing structure: core service pages establish the entity, answer pages support retrieval and extraction, and weekly monitoring identifies where the next iteration should go.",
        ],
      },
      {
        heading: "What this proves",
        paragraphs: [
          "This self-case proves the delivery model before it is applied to client categories. It also creates a reusable public proof asset that can be cited when buyers ask how GEO is implemented in practice.",
          "Future case studies can follow the same structure once client metrics, screenshots, and permissioned proof are ready for publication.",
        ],
      },
    ],
    faq: [
      {
        question: "Why launch with a self-case first?",
        answer:
          "A self-case lets the team show the operating model without inventing client proof. It creates a real public example of how Technical Signals, answer pages, and citation tracking work together.",
      },
      {
        question: "Are the metrics client results?",
        answer:
          "No. These metrics describe the itappens.ai deployment itself and the current internal monitoring setup. Client case studies will be added only with verified proof.",
      },
      {
        question: "What happens next?",
        answer:
          "The next step is to keep publishing weekly clusters, expand corroborating references, and record citation movement across the tracked engines.",
      },
    ],
  },
];
