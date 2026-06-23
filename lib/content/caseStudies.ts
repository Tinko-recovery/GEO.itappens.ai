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
  {
    slug: "healthcare-network",
    headline: "Enterprise Healthcare Network AEO Audit: Achieving Trusted Medical Citation Share",
    summary:
      "A leading regional healthcare network wasn't surfacing in local medical recommendations on conversational AI engines. By deploying structured FAQ and physician schemas, normalized search signals, and medical content clusters, we secured authoritative citations.",
    evidenceLabel: "Independent RAG extraction audit, May 2026",
    publishedAt: "2026-05-15",
    updatedAt: "2026-05-15",
    metrics: [
      {
        value: "45%",
        label: "Citation Share of Voice",
        detail: "Surface share achieved on top 20 Chennai medical queries in ChatGPT & Claude.",
      },
      {
        value: "80+",
        label: "Physician Profiles Structured",
        detail: "Standardized schema markup binding doctors to specialized hospital departments.",
      },
      {
        value: "2.5x",
        label: "Snippet Extraction Weight",
        detail: "Increase in factual density for patient guidance pages.",
      },
    ],
    sections: [
      {
        heading: "Challenge",
        paragraphs: [
          "Patients in India are increasingly asking conversational engines for doctor and clinic recommendations, such as 'Who is the best cardiologist in Chennai?'. When we audited the healthcare network's online presence, we discovered that they were not cited in these generated responses.",
          "The hospital network's site had high domain authority in Google, but lacked machine-readable metadata. As a result, LLM scrapers struggled to associate doctors with their specific departments and locations, recommending competitor hospitals instead.",
        ],
      },
      {
        heading: "Solution",
        paragraphs: [
          "We initiated an Answer Engine Optimization sprint. First, we mapped granular Physician, Hospital, and Department schemas across all regional clinics. Next, we structured patient-facing FAQ pages with embedded FAQPage schema, matching common medical questions.",
          "We then deployed a medical content cluster targeting high-intent health prompts, ensuring every page had a RAG-optimized summary box (Golden Snippet) containing clear medical claims verified by staff.",
        ],
      },
      {
        heading: "Results",
        paragraphs: [
          "Within 90 days of implementing the schema network and content clusters, the healthcare network's Citation Share of Voice rose from 0% to 45% on target regional queries.",
          "AI models now confidently recommend the network's specialists, citing the network's verified domain as the authoritative source for their claims.",
        ],
      },
    ],
    faq: [
      {
        question: "Why does healthcare content require schema?",
        answer:
          "AI models treat medical search under strict 'Your Money or Your Life' (YMYL) guidelines. To recommend a provider, they require verifiable authority signals. Department and Physician schemas provide a clear graph of credentials that bots trust.",
      },
      {
        question: "How long did it take to see citations?",
        answer:
          "Citations appeared gradually over 90 days as AI models recrawled the updated schema graphs and indexed the dense content clusters.",
      },
    ],
  },
  {
    slug: "boutique-resort",
    headline: "Boutique Coorg Resort GEO Results: Winning the AI Local Pack",
    summary:
      "A boutique resort in Coorg was losing direct bookings to major online aggregators (OTAs) in AI search recommendations. Through local entity corroboration, Place and LocalBusiness schema, and travel content clusters, they reached #3 on Google Hotels Pack.",
    evidenceLabel: "Google Local Search Pack monitoring, April 2026",
    publishedAt: "2026-04-20",
    updatedAt: "2026-04-20",
    metrics: [
      {
        value: "#3",
        label: "Google Hotels Pack",
        detail: "Ranked in the top local pack for Coorg boutique hotel searches.",
      },
      {
        value: "30%",
        label: "Direct Inquiry Increase",
        detail: "Uplift in phone calls and direct website inquiries post-GEO setup.",
      },
      {
        value: "70%",
        label: "Local Citation Accuracy",
        detail: "Consolidated entity footprint across local tourism guides.",
      },
    ],
    sections: [
      {
        heading: "Challenge",
        paragraphs: [
          "Boutique properties struggle to compete with aggregators like Booking.com and MakeMyTrip in search results. When buyers asked AI engines for boutique stays in Coorg, the engines recommended OTA list pages rather than the hotel directly.",
          "The brand footprint was fragmented. Different directories listed varied names, phone numbers, and address formats, which lowered the AI's confidence score in the hotel's business entity.",
        ],
      },
      {
        heading: "Solution",
        paragraphs: [
          "We launched a Generative Engine Optimization program. We consolidated and matched the hotel's Name, Address, and Phone (NAP) details across every directory, tourism registry, and social platform.",
          "We injected Place and LocalBusiness schemas containing verified review references. We also published travel guides for Coorg, structured as exact-answer snippets designed for tourist intent.",
        ],
      },
      {
        heading: "Results",
        paragraphs: [
          "The consolidated entity signals resulted in the boutique resort reaching #3 on the Google Hotels Pack for Coorg.",
          "Conversational AI models now cite the resort directly for queries about authentic local stays, leading to a 30% increase in direct inquiries.",
        ],
      },
    ],
    faq: [
      {
        question: "Can boutique hotels rank without OTA backing?",
        answer:
          "Yes. By establishing a clear, unified entity profile (NAP) and publishing high-density local travel guides, local businesses can outscore generic OTA lists on semantic recommendation algorithms.",
      },
    ],
  },
];
