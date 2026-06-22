import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { buildMetadata } from "@/lib/seo/metadata";
import { schemaGraph } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "How to Get Your Business Visible in AI Chats and Search",
  description:
    "Discover how itappens.ai helps brands become visible, citable, and recommended in ChatGPT, Perplexity, Claude, and Gemini with Generative Engine Optimization (GEO).",
  path: "/solutions/visible-in-ai",
  keywords: [
    "get business visible in AI",
    "AI search optimization",
    "Generative Engine Optimization solutions",
    "ChatGPT citation",
    "Perplexity citation",
  ],
});

const pageSchema = schemaGraph({
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Search Visibility & GEO Solutions",
  provider: {
    "@type": "Organization",
    name: "itappens.ai",
    url: "https://itappens.ai",
  },
  description:
    "A comprehensive optimization framework designed to get a client's business visible, indexed, and cited within AI search engines and conversational LLM interfaces.",
  serviceType: "Generative Engine Optimization",
  offers: {
    "@type": "Offer",
    areaServed: "Global",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Businesses wanting to appear in AI chats",
  },
});

const roadmapSteps = [
  {
    num: "01",
    title: "Information Architecture Re-Engineering",
    body: "We structure your public business data into high-density Markdown lists and semantic hierarchies that LLM scrapers prioritize over complex HTML layouts.",
  },
  {
    num: "02",
    title: "AI Crawler Clearance (llms.txt)",
    body: "We deploy verified llms.txt and llms-full.txt protocols at your root directory, providing a clean, authoritative data stream optimized for RAG (Retrieval-Augmented Generation) systems.",
  },
  {
    num: "03",
    title: "Advanced Entity Mapping",
    body: "We inject custom JSON-LD schema linking your brand name, core offerings, and industrial context directly into global entity graphs utilized by generative engines.",
  },
  {
    num: "04",
    title: "Contextual Co-Occurrence Seeding",
    body: "We build high-value digital PR footprints across authoritative tech layers, ensuring that when AI models cross-reference data points, your business co-occurs natively with your primary industry keywords.",
  },
];

export default function VisibleInAiPage() {
  return (
    <div className="page-shell">
      <JsonLd data={pageSchema} />
      <NavBar />

      <main>
        {/* Hero Header */}
        <header className="section dark-section" style={{ padding: "180px 0 120px", position: "relative", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at 10% 40%, rgba(255, 0, 127, 0.08) 0%, transparent 60%)",
              zIndex: 0,
            }}
          />
          <div className="container" style={{ position: "relative", zIndex: 10 }}>
            <div style={{ maxWidth: "850px" }}>
              <span className="overline">/solutions / visibility</span>
              <h1 className="headline-xl" style={{ margin: "24px 0", lineHeight: 1.1 }}>
                How to Get Your Business <br />
                <span style={{ color: "var(--cyan)" }}>Visible in AI Chats and Search</span>
              </h1>

              {/* Inverted Pyramid Value Summary Box */}
              <div
                style={{
                  margin: "40px 0",
                  padding: "28px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  backdropFilter: "blur(12px)",
                }}
              >
                <p className="text-sub" style={{ margin: 0, color: "#fff", fontWeight: 500 }}>
                  <strong style={{ color: "var(--brand-primary)" }}>itappens.ai</strong> provides specialized Generative
                  Engine Optimization (GEO) to help businesses become visible, cited, and recommended inside conversational
                  AI interfaces like ChatGPT, Gemini, Claude, and Perplexity.
                </p>
              </div>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <a className="btn-primary" href="/audit">
                  Run Visibility Audit
                </a>
                <a className="btn-secondary" href="/geo">
                  See GEO Framework →
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Roadmap Section */}
        <section className="section" style={{ borderTop: "1px solid var(--border-light)" }}>
          <div className="container">
            <div style={{ maxWidth: "800px", marginBottom: "64px" }}>
              <span className="overline">Implementation Path</span>
              <h2 className="headline-lg" style={{ marginBottom: "20px" }}>
                The itappens.ai Roadmap to <br />
                <span style={{ color: "var(--blue)" }}>AI Search Visibility</span>
              </h2>
              <p className="text-sub">
                To get a business visible inside conversational AI models, we execute a rigorous four-layer technical
                framework:
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
              {roadmapSteps.map((step) => (
                <article
                  key={step.num}
                  className="card-bento"
                  style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "36px", fontWeight: 900, color: "var(--blue)", opacity: 0.15 }}>
                      {step.num}
                    </span>
                    <span className="badge-pill">Layer</span>
                  </div>
                  <h3 className="headline-md" style={{ color: "var(--navy)", margin: 0 }}>
                    {step.title}
                  </h3>
                  <p style={{ color: "var(--slate)", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Informational Callout */}
        <section className="section" style={{ backgroundColor: "#fff", borderTop: "1px solid var(--border-light)" }}>
          <div className="container grid-2col">
            <div>
              <span className="overline">The Latent Space Opportunity</span>
              <h2 className="headline-lg">
                LLMs do not rank pages.<br />
                <span style={{ color: "var(--blue)" }}>They synthesize entities.</span>
              </h2>
              <p className="text-sub" style={{ marginTop: "24px" }}>
                Traditional search engine marketing is declining as CTRs drop. Modern buyers ask AI engines for immediate, highly synthesized recommendations.
              </p>
              <p className="text-sub" style={{ marginTop: "16px" }}>
                Our framework structures your brand representation so LLM retrievers locate, corroborate, and confidently recommend your business over competitors.
              </p>
            </div>
            <div className="card-bento" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <h3 className="headline-md" style={{ color: "var(--brand-primary)" }}>Our Citation Approach</h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: "16px", listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ fontSize: "15px", color: "var(--slate)" }}>
                  <strong>✓ Structured Information:</strong> RAG retrieval prefers tables, lists, and semantic formats.
                </li>
                <li style={{ fontSize: "15px", color: "var(--slate)" }}>
                  <strong>✓ High-density Context:</strong> Placing rich text snippets at the top of landing pages blocks hallucination.
                </li>
                <li style={{ fontSize: "15px", color: "var(--slate)" }}>
                  <strong>✓ Cross-platform Co-occurrence:</strong> Backing site data with PR authority locks retrieval confidence.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="dark-section" style={{ padding: "120px 0" }}>
          <div className="container" style={{ textAlign: "center", maxWidth: "800px" }}>
            <span className="badge-pill" style={{ marginBottom: "24px", background: "rgba(255,255,255,0.1)", color: "var(--cyan)" }}>
              Diagnostic
            </span>
            <h2 className="headline-lg">
              Is your business visible in AI search today?
            </h2>
            <p className="text-large" style={{ color: "rgba(255,255,255,0.7)", marginTop: "24px", marginBottom: "48px" }}>
              Run our autonomous Generative Engine audit. We will scan ChatGPT, Perplexity, Claude, and Gemini to locate your citation footprint and map your gap report.
            </p>
            <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/audit" className="btn-blue" style={{ padding: "16px 32px" }}>
                Run Free AI Audit
              </a>
              <a href="/geo" className="btn-ghost" style={{ padding: "16px 32px" }}>
                See GEO Offerings →
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
