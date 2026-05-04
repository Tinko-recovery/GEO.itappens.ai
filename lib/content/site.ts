export interface SiteConfig {
  name: string;
  legalName: string;
  url: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  sameAs: string[];
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

export const siteConfig: SiteConfig = {
  name: "itappens.ai",
  legalName: "Blocks and Loops Technologies Pvt Ltd",
  url: "https://www.itappens.ai",
  email: "hello@itappens.ai",
  phone: "+91 93530 15844",
  city: "Bengaluru",
  country: "India",
  sameAs: ["https://www.linkedin.com/company/itappens-ai/"],
  description:
    "India's first AEO/GEO solution provider and AI content automation platform for brands that want to become the default answer across ChatGPT, Perplexity, Claude, Gemini, Grok, and SearchGPT.",
};

export const corePlatforms = ["ChatGPT", "Perplexity", "Claude", "Gemini", "Grok", "SearchGPT"];

export const homepageStats = [
  {
    value: "7 days",
    label: "Technical Signals sprint",
    detail: "Complete the crawl, schema, canonical, and llms.txt layer first.",
  },
  {
    value: "90 days",
    label: "Citation window",
    detail: "Operate toward 70%+ citation share on target queries with weekly iteration.",
  },
  {
    value: "1 cluster",
    label: "Content cadence",
    detail: "Publish at least one deep answer cluster per week to compound visibility.",
  },
  {
    value: "6 engines",
    label: "Tracking coverage",
    detail: "Monitor citation presence across the major answer engines every week.",
  },
];

export const pillars = [
  {
    title: "Technical Signals",
    tag: "Pillar 1",
    body:
      "Normalize canonicals, entity schema, llms.txt, crawl assets, and semantic HTML so AI systems can extract a consistent machine-readable profile of the brand.",
  },
  {
    title: "Content Layer",
    tag: "Pillar 2",
    body:
      "Publish answer-first content clusters engineered for exact high-intent queries such as GEO agency India 2026 and how to get cited by AI in India.",
  },
  {
    title: "Entity and Citation Layer",
    tag: "Pillar 3",
    body:
      "Reinforce the same identity, service definitions, and claims across internal pages and third-party references so the entity graph stays consistent.",
  },
  {
    title: "Tracking and Iteration",
    tag: "Pillar 4",
    body:
      "Run weekly checks across major AI engines, compare citation movement, and use the gap report to decide the next content and technical pushes.",
  },
];

export const homepageFaqs: FaqItem[] = [
  {
    question: "What does itappens.ai do?",
    answer:
      "itappens.ai helps brands become visible, trusted, and repeatedly cited across AI platforms. The work combines technical signals, answer-engine content, entity-building, and weekly citation tracking.",
  },
  {
    question: "Why lead with Technical Signals first?",
    answer:
      "Technical Signals create the machine-readable base layer. Without clean canonicals, schema, llms.txt, and extractable HTML, later content and entity work compound more slowly.",
  },
  {
    question: "Who is this built for?",
    answer:
      "The primary focus is Indian SaaS companies, startups, agencies, and enterprise teams that want high-intent AI visibility and qualified inbound pipeline.",
  },
  {
    question: "How does AI content automation support GEO?",
    answer:
      "AI-native distribution across LinkedIn, Instagram, X, and YouTube strengthens repetition, recall, and citation signals around the same entity and category language.",
  },
];

export const geoFaqs: FaqItem[] = [
  {
    question: "What is included in the GEO engagement?",
    answer:
      "The engagement covers Technical Signals, weekly answer clusters, entity-building support, and recurring visibility audits so the brand can improve citation share over a 90-day period.",
  },
  {
    question: "Do you guarantee a fixed result?",
    answer:
      "No universal guarantee is made. The operating target is 70%+ citation share on chosen target queries within 90 days when the full system is implemented and iterated consistently.",
  },
  {
    question: "Why position itappens.ai as India-first?",
    answer:
      "The service is built for the Indian market context, buyer language, and AI query patterns, while still targeting the global answer engines where those buyers search.",
  },
  {
    question: "What does pricing look like?",
    answer:
      "Technical Signals can be delivered as a fixed-scope sprint. Ongoing GEO execution and the platform layer are scoped based on query set, content volume, and reporting depth.",
  },
];

export const howItWorksSteps: HowToStep[] = [
  {
    name: "Audit the baseline",
    text: "Map target queries, current citations, missing pages, and domain-level crawl signals before touching production.",
    url: "/how-it-works#step-1",
  },
  {
    name: "Normalize the entity",
    text: "Align organization identity, service definitions, contact data, and preferred URLs across the site.",
    url: "/how-it-works#step-2",
  },
  {
    name: "Ship Technical Signals",
    text: "Deploy llms.txt, schema, sitemap, robots, canonicals, and semantic HTML improvements in the first week.",
    url: "/how-it-works#step-3",
  },
  {
    name: "Launch answer clusters",
    text: "Publish exact-match answer pages for the highest-intent prompts that buyers ask inside AI products.",
    url: "/how-it-works#step-4",
  },
  {
    name: "Strengthen entity references",
    text: "Push the same category language and claims into internal pages and external references that corroborate the brand.",
    url: "/how-it-works#step-5",
  },
  {
    name: "Track weekly citations",
    text: "Review how often the brand appears, who is cited instead, and which supporting pages are referenced.",
    url: "/how-it-works#step-6",
  },
  {
    name: "Iterate from gaps",
    text: "Use the tracking data to prioritize the next page, schema refinement, or distribution push.",
    url: "/how-it-works#step-7",
  },
];

export const geoPackages = [
  {
    name: "Technical Signals Sprint",
    price: "Fixed scope",
    description:
      "Week-one deployment of llms.txt, schema, sitemap, robots, canonicals, semantic HTML, and page-level metadata.",
    features: [
      "Homepage, /geo, /how-it-works, /case-studies, and /answers technical setup",
      "Public crawl asset rollout",
      "Validation checklist and ownership map",
    ],
  },
  {
    name: "90-Day GEO System",
    price: "Custom scope",
    description:
      "Full four-pillar execution for brands that want to own a category query set across AI engines.",
    features: ["Weekly content cluster publishing", "Entity and citation support", "Weekly tracking and iteration loop"],
  },
  {
    name: "Platform + Advisory",
    price: "Custom scope",
    description:
      "Combine consulting with the platform layer for continuous audits, schema operations, and content automation support.",
    features: ["Visibility monitoring cadence", "Cross-channel content automation guidance", "Founder and team review rhythm"],
  },
];

export const primaryNav = [
  { label: "Home", href: "/" },
  { label: "GEO", href: "/geo" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Answers", href: "/answers" },
  { label: "Blog", href: "/blog" },
];
