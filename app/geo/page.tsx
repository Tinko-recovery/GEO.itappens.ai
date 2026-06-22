import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { geoFaqs, geoPackages, howItWorksSteps } from "@/lib/content/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, howToSchema, organizationSchema, schemaGraph, serviceSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "What is Generative Engine Optimization (GEO)? | itappens.ai",
  description: "A deep dive into Generative Engine Optimization (GEO). Structure your brand to be cited and recommended in AI answers.",
  path: "/geo",
  keywords: ["Generative Engine Optimization", "GEO guide", "LLM citations", "AI Search optimization"],
});

const geoSchema = schemaGraph(
  organizationSchema(),
  serviceSchema({
    name: "Generative Engine Optimization (GEO)",
    description: "Structuring technical signals, optimizing schema networks, and building content clusters to maximize AI citation share.",
    path: "/geo",
  }),
  articleSchema({
    headline: "What is Generative Engine Optimization (GEO)?",
    description: "Learn how Generative Engine Optimization (GEO) ensures your brand is recommended and cited across Large Language Models like ChatGPT, Gemini, and Perplexity.",
    path: "/geo",
    datePublished: "2026-06-22",
    dateModified: "2026-06-22",
  }),
  howToSchema({
    name: "How to implement a GEO strategy",
    description: "A step-by-step roadmap to optimizing your website's content and structure for Large Language Models.",
    path: "/geo",
    steps: howItWorksSteps,
  })
);

const subsections = [
  {
    num: "01",
    title: "Defining GEO in the Agentic Era",
    description: "Generative Engine Optimization (GEO) is the evolutionary successor to traditional search optimization. Instead of ranking in a list of web URLs, GEO focuses on positioning your brand inside the text responses synthesized by Large Language Models (LLMs) and autonomous AI agents."
  },
  {
    num: "02",
    title: "Factual Density vs. Conversational Copy",
    description: "AI engines rely on text chunking to rank information. Unlike human readers who enjoy narrative styling, LLM retrieval systems prioritize high-density factual information, statistics, and concrete claims. Removing conversational filler from your pages increases your retrieval score."
  },
  {
    num: "03",
    title: "AI Scraper Agents and Crawl Budgets (robots.txt & llms.txt)",
    description: "To be cited, your website must first be crawled by AI engines. Optimizing your robots.txt file to grant access to crawlers like GPTBot and ClaudeBot, combined with publishing a structured llms.txt file in your root folder, allows engines to index your site efficiently."
  },
  {
    num: "04",
    title: "Optimizing for Sentiment and Brand Consensus",
    description: "AI systems don't just retrieval-ground facts; they analyze sentiment. When recommending vendors or platforms, they scan directories, forums, and customer review platforms to establish a brand consensus. Positive external sentiment directly increases citation likelihood."
  },
  {
    num: "05",
    title: "The Staged GEO Execution Framework",
    description: "A successful GEO rollout is structured in stages: starting with baseline audit mapping, deploying Technical Signals (schema, canonicals, crawlers), launching intent-focused answer content clusters, and continuously tracking citation share to drive iterations."
  }
];

export default function GeoPillarPage() {
  return (
    <div className="page-shell">
      <JsonLd data={geoSchema} />
      <NavBar />

      <main>
        {/* Hero Section */}
        <header className="section dark-section" style={{ padding: "160px 0 100px", position: "relative" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <span className="overline" style={{ color: "var(--cyan)" }}>Pillar 2: Generative Engine Optimization</span>
            <h1 className="headline-xl" style={{ margin: "24px 0", lineHeight: 1.1 }}>
              What is Generative Engine <br />
              <span style={{ color: "var(--cyan)" }}>Optimization (GEO)?</span>
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
                Summary Box (GEO Snippet)
              </span>
              <p className="text-large" style={{ color: "#fff", margin: 0, fontWeight: 500, lineHeight: 1.6 }}>
                <strong>Generative Engine Optimization (GEO)</strong> is the technical and content optimization framework designed to make websites and brand profiles readable, indexable, and referenceable by AI search engines. By optimizing factual content structure, resolving crawl errors, and verifying brand data points, GEO guarantees your business is recommended inside LLM answer syntheses.
              </p>
            </div>
          </div>
        </header>

        {/* Subsections Grid */}
        <section className="section" style={{ padding: "120px 0", backgroundColor: "var(--light-bg)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "80px" }}>
              <span className="overline">System Overview</span>
              <h2 className="headline-lg">The 5 Core Concepts of <span style={{ color: "var(--blue)" }}>GEO Success.</span></h2>
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

            {/* Link back to AEO */}
            <div style={{ textAlign: "center", marginTop: "64px" }}>
              <p style={{ fontSize: "16px", color: "var(--slate)" }}>
                Need to understand the retrieval framework?{" "}
                <Link href="/aeo" style={{ color: "var(--blue)", fontWeight: 700, textDecoration: "underline" }}>
                  Read about Answer Engine Optimization (AEO) →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Staged Execution Guide (HowTo rendering) */}
        <section className="section" style={{ backgroundColor: "#fff", borderTop: "1px solid var(--border-light)" }}>
          <div className="container grid-2col">
            <div>
              <span className="overline">Methodology</span>
              <h2 className="headline-lg">
                The 90-Day Staged <br />
                <span style={{ color: "var(--blue)" }}>GEO Implementation.</span>
              </h2>
              <p className="text-sub" style={{ marginTop: "24px" }}>
                Becoming a trusted source in AI engines is not a one-time configuration. We align your technical database nodes, sitemaps, semantic content networks, and corroboration profiles over a 90-day execution sprint.
              </p>
              <ul style={{ marginTop: "32px", listStyle: "none", padding: 0 }}>
                <li style={{ padding: "8px 0", fontSize: "15px" }}>✓ Fully transparent crawl metrics validation</li>
                <li style={{ padding: "8px 0", fontSize: "15px" }}>✓ Content structured for automatic RAG vectorization</li>
                <li style={{ padding: "8px 0", fontSize: "15px" }}>✓ Weekly monitoring against major LLM engines</li>
              </ul>
            </div>
            <div className="card-bento" style={{ backgroundColor: "var(--light-bg)" }}>
              <span className="overline">Execution Steps</span>
              <ol style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "24px", listStyle: "none", padding: 0 }}>
                {howItWorksSteps.slice(0, 4).map((step, index) => (
                  <li key={step.name}>
                    <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px", color: "var(--navy)" }}>{index + 1}. {step.name}</h3>
                    <p style={{ color: "var(--slate)", fontSize: "14px", lineHeight: 1.5, margin: 0 }}>{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Commercial Section (Pricing tiers from site content) */}
        <section className="section" style={{ borderTop: "1px solid var(--border-light)", backgroundColor: "var(--light-bg)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <span className="overline">Pricing Plans</span>
              <h2 className="headline-lg">
                Outcome-based <span style={{ color: "var(--blue)" }}>investment tiers.</span>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
              {geoPackages.map((item) => (
                <article key={item.name} className="card-bento" style={{ display: "flex", flexDirection: "column", gap: "24px", backgroundColor: "#fff" }}>
                  <div>
                    <span className="overline">{item.price}</span>
                    <h3 className="headline-md" style={{ margin: "4px 0 0" }}>{item.name}</h3>
                  </div>
                  <p className="text-sub" style={{ fontSize: "15px", margin: 0 }}>{item.description}</p>
                  <ul style={{ marginTop: "auto", listStyle: "none", padding: 0 }}>
                    {item.features.map((feature) => (
                      <li key={feature} style={{ padding: "8px 0", fontSize: "14px", color: "var(--navy)" }}>• {feature}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section" style={{ borderTop: "1px solid var(--border-light)", backgroundColor: "#fff" }}>
          <div className="container-narrow">
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <span className="overline">FAQ</span>
              <h2 className="headline-lg">
                The questions that shape <br />
                <span style={{ color: "var(--blue)" }}>scope and delivery.</span>
              </h2>
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {geoFaqs.map((faq) => (
                <li key={faq.question} style={{ padding: "24px 0", borderBottom: "1px solid var(--border-light)" }}>
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
