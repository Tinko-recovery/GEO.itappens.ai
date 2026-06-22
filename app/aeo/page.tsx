import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, faqSchema, organizationSchema, schemaGraph, serviceSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "What is Answer Engine Optimization (AEO)? | itappens.ai",
  description: "A deep dive into Answer Engine Optimization (AEO). Learn how to make your brand the primary cited source in conversational AI search engines.",
  path: "/aeo",
  keywords: ["Answer Engine Optimization", "AEO guide", "LLM citations", "AI Search visibility"],
});

const aeoFaqs = [
  {
    question: "How does Answer Engine Optimization (AEO) differ from traditional SEO?",
    answer: "Traditional SEO focuses on optimizing keyword positioning and building page authority to rank high in the 10 blue links of search engine results pages. AEO, on the other hand, structures your digital footprint specifically for machine readability so that conversational AI engines like ChatGPT and Perplexity can synthesize your data into direct answers and attribute them to you via citation links."
  },
  {
    question: "What is the Inverted Pyramid content structure in AEO?",
    answer: "The Inverted Pyramid structure places a concise, bolded 60–80 word summary definition directly under the main heading. This is followed by structured bullets, lists, or tables that explain the details, and finally, deep explanatory prose. This layout allows LLM web scraper agents to extract a high-density, accurate answer chunk immediately, maximizing citation frequency."
  },
  {
    question: "Why is multi-platform corroboration important for AEO?",
    answer: "Conversational AI models do not trust single-source claims. When compiling answers, retrieval systems look for cross-site consensus. If your entity profile (name, services, phone, details) is identical and verified across your domain, LinkedIn, Crunchbase, and third-party directories, the AI engine's confidence score increases, leading to a much higher chance of being cited as the recommended solution."
  },
  {
    question: "Which AI engines should I optimize for?",
    answer: "You should optimize for the major conversational platforms including ChatGPT (OpenAI), Perplexity AI, Claude (Anthropic), Google Gemini, and SearchGPT. While their underlying LLM families differ, they all employ Retrieval-Augmented Generation (RAG) pipelines that ingest structured sitemaps and raw text chunks."
  },
  {
    question: "Does AEO require paid API integrations?",
    answer: "No. AEO operates on organic crawler extraction. AI platforms use automated user-agent bots (like GPTBot, ClaudeBot, and Google-Extended) to sweep and index public web pages. Your optimizations are made completely on-page via structured schema networks and clean HTML."
  },
  {
    question: "What is Share of Model Voice (SOMV) in citation analytics?",
    answer: "Share of Model Voice (SOMV) replaces standard rank positioning in AEO. Because conversational outputs are dynamic and personalized, SOMV tracks the mathematical percentage of times your brand is cited as a source across a designated benchmark of 50–100 target queries."
  },
  {
    question: "Can growth-stage startups compete with enterprise domains in AI search?",
    answer: "Yes. Retrieval engines evaluate factual density and exact semantic matches over legacy backlink authority. Startups that deploy precise JSON-LD entities and clean, single-intent content clusters frequently out-citation older domains that host unstructured copy."
  },
  {
    question: "How does the llms.txt file help with crawler indexation?",
    answer: "An llms.txt file is a markdown asset placed in your root folder that acts as a summary directory. It helps scrapers quickly map sitemap routes, documentation hubs, and entity pages without consuming excessive crawl budgets, speeding up citation updates."
  }
];

const aeoSchema = schemaGraph(
  organizationSchema(),
  serviceSchema({
    name: "Answer Engine Optimization (AEO)",
    description: "Structuring technical signals, optimizing schema networks, and building content clusters to maximize AI citation share.",
    path: "/aeo",
  }),
  articleSchema({
    headline: "What is Answer Engine Optimization (AEO)?",
    description: "A complete guide to making your business visible in conversational AI answer engines like ChatGPT, Claude, and Gemini.",
    path: "/aeo",
    datePublished: "2026-06-22",
    dateModified: "2026-06-22",
  }),
  faqSchema(aeoFaqs, "/aeo")
);

const subsections = [
  {
    num: "01",
    title: "The Shift from Links to Generative Syntheses",
    description: "Traditional search engines act as directories, directing users to click outward to external websites. Generative engines read, summarize, and synthesize the internet's information directly within the chat window. AEO shifts your goal from winning clicks to winning the citations that power these summaries."
  },
  {
    num: "02",
    title: "How RAG (Retrieval-Augmented Generation) Triggers Citations",
    description: "Answer engines do not make up facts; they pull text passages from a vectorized index of web crawls, score their relevance and factual density, and pass them to the LLM to generate the final response. If your website provides structured, high-density passages, it earns the citation."
  },
  {
    num: "03",
    title: "Structural Page Requirements for LLM Extraction",
    description: "To make your pages easy for LLMs to extract, you must use clear semantic HTML headers (H1, H2, H3), place a bolded summary definition of 60–80 words (the Golden Snippet) at the top, and back it up with tables, markdown lists, and structured JSON-LD data."
  },
  {
    num: "04",
    title: "Entity Authority & Off-Site Corroboration",
    description: "AI engines corroborate claims by scanning multiple domains. If your company's name, offerings, and leadership are mentioned consistently across directories, LinkedIn, news releases, and industry publications, your entity authority score increases, making your site a trusted reference."
  },
  {
    num: "05",
    title: "Monitoring Share of Voice across AI Platforms",
    description: "Unlike tracking Google rank positions, tracking AEO requires measuring your Share of Model Voice (SOMV). This is the frequency with which your brand is cited across multiple query runs in platforms like ChatGPT, Claude, Gemini, and Perplexity when users ask commercial-intent questions."
  }
];

export default function AeoPillarPage() {
  return (
    <div className="page-shell">
      <JsonLd data={aeoSchema} />
      <NavBar />

      <main>
        {/* Hero Section */}
        <header className="section dark-section" style={{ padding: "160px 0 100px", position: "relative" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <span className="overline" style={{ color: "var(--cyan)" }}>Pillar 1: Answer Engine Optimization</span>
            <h1 className="headline-xl" style={{ margin: "24px 0", lineHeight: 1.1 }}>
              What is Answer Engine <br />
              <span style={{ color: "var(--cyan)" }}>Optimization (AEO)?</span>
            </h1>
            
            {/* The Golden Snippet (60-80 words, snippet-optimized) */}
            <div className="card-bento" style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.05)", 
              border: "1px solid rgba(255, 255, 255, 0.1)", 
              padding: "32px",
              marginTop: "40px",
              borderRadius: "16px"
            }}>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--cyan)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
                Summary Box (AEO Snippet)
              </span>
              <p className="text-large" style={{ color: "#fff", margin: 0, fontWeight: 500, lineHeight: 1.6 }}>
                <strong>Answer Engine Optimization (AEO)</strong> is a digital marketing methodology that optimizes a brand's web presence for retrieval by conversational AI systems like ChatGPT, Perplexity, and Gemini. By implementing structured entity schemas, factual content clusters, and cross-site verification, AEO ensures your website is parsed as the authoritative source and cited as the recommended answer in generated AI search responses.
              </p>
            </div>
          </div>
        </header>

        {/* Subsections Grid */}
        <section className="section" style={{ padding: "120px 0", backgroundColor: "var(--light-bg)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "80px" }}>
              <span className="overline">Framework Detail</span>
              <h2 className="headline-lg">The 5 Pillars of <span style={{ color: "var(--blue)" }}>AEO Authority.</span></h2>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
              {subsections.map((sub) => (
                <div key={sub.num} className="card-bento" style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "40px", backgroundColor: "#fff" }}>
                  <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--blue)", opacity: 0.3 }}>
                    {sub.num}
                  </div>
                  <h3 className="headline-md" style={{ margin: 0, color: "var(--navy)" }}>{sub.title}</h3>
                  <p style={{ color: "var(--slate)", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                    {sub.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ textAlign: "center", marginTop: "80px", display: "flex", gap: "20px", justifyContent: "center" }}>
              <Link href="/solutions/visible-in-ai" className="btn-primary">
                Get Visible in AI Solutions
              </Link>
              <Link href="/case-studies" className="btn-secondary">
                See Our Case Studies
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section" style={{ padding: "120px 0", borderTop: "1px solid var(--border-light)", backgroundColor: "#fff" }}>
          <div className="container-narrow">
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <span className="overline">FAQ</span>
              <h2 className="headline-lg">Common questions about <span style={{ color: "var(--blue)" }}>AEO strategy.</span></h2>
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {aeoFaqs.map((faq, index) => (
                <li key={index} style={{ padding: "24px 0", borderBottom: "1px solid var(--border-light)" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px", color: "var(--navy)" }}>{faq.question}</h3>
                  <p style={{ color: "var(--slate)", fontSize: "16px", lineHeight: 1.6, margin: 0 }}>{faq.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
