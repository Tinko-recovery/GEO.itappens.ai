import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, organizationSchema, schemaGraph } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "AI Content Clusters: Establishing Topical Authority for LLMs | itappens.ai",
  description: "Learn how to structure content clusters that establish topical authority and feed LLM retrieval systems accurate brand signals.",
  path: "/content-clusters",
  keywords: ["AI Content Clusters", "Topical Authority", "LLM content strategy", "Answer Engine content"],
});

const clustersSchema = schemaGraph(
  organizationSchema(),
  articleSchema({
    headline: "AI Content Clusters for Answer Engines",
    description: "An in-depth explanation of how topical authority is evaluated by Large Language Models and how content clusters establish credibility.",
    path: "/content-clusters",
    datePublished: "2026-06-22",
    dateModified: "2026-06-22",
  })
);

export default function ContentClustersPage() {
  return (
    <div className="page-shell">
      <JsonLd data={clustersSchema} />
      <NavBar />

      <main>
        {/* Hero Section */}
        <header className="section dark-section" style={{ padding: "160px 0 100px", position: "relative" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <span className="overline" style={{ color: "var(--cyan)" }}>Pillar 3: AI Content Strategy</span>
            <h1 className="headline-xl" style={{ margin: "24px 0", lineHeight: 1.1 }}>
              AI Content Clusters <br />
              <span style={{ color: "var(--cyan)" }}>for Answer Engines</span>
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
                Summary Box (Content Cluster Snippet)
              </span>
              <p className="text-large" style={{ color: "#fff", margin: 0, fontWeight: 500, lineHeight: 1.6 }}>
                <strong>AI Content Clusters</strong> are semantically grouped collections of highfactualdensity pages designed to build topical authority for Large Language Models. By structuring content around a parent pillar page connected to detailed child nodes via strict internal linking, content clusters ensure that LLM retrieval models find complete, corroborated answers to complex industry queries, driving higher citation share.
              </p>
            </div>
          </div>
        </header>

        {/* Detailed Explanation */}
        <section className="section" style={{ padding: "100px 0", backgroundColor: "#fff" }}>
          <div className="container-narrow">
            <h2 className="headline-lg" style={{ marginBottom: "32px" }}>Why LLMs Demand <span style={{ color: "var(--blue)" }}>Topical Authority</span></h2>
            <p className="text-sub" style={{ lineHeight: 1.8, marginBottom: "24px" }}>
              Unlike traditional search engine optimization which evaluates keywords in isolation, generative search models look at your domain's semantic coverage. If a user asks ChatGPT or Gemini a technical question, the system's re-ranking algorithm evaluates if your domain possesses complete topical depth.
            </p>
            <p className="text-sub" style={{ lineHeight: 1.8, marginBottom: "40px" }}>
              Publishing a single, disjointed page about your product is no longer enough. To win citations, you must construct a **semantic hub**—proving to retrieval-augmented generation (RAG) models that your entity fully understands the topic from the fundamental concepts to the granular execution details.
            </p>

            <h2 className="headline-lg" style={{ marginBottom: "32px", marginTop: "64px" }}>Case Proof: Real-World Content Clusters</h2>
            
            <div className="card-bento" style={{ backgroundColor: "var(--light-bg)", padding: "40px", marginBottom: "32px", borderLeft: "4px solid var(--blue)" }}>
              <h3 className="headline-md" style={{ color: "var(--navy)", margin: "0 0 12px 0" }}>Boutique Resort: Local Authority Cluster</h3>
              <p style={{ color: "var(--slate)", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                To optimize <strong>a boutique resort in Coorg</strong>, we built a dense cluster around local tourism, premium stay experiences, and Coorg travel guides. Instead of trying to rank for general travel terms, the clusters provided high-density answers for niche traveller prompts. When combined with LocalBusiness and Place schema markups, this content structure drove the hotel to rank #3 in the Google Hotels and local search recommendations pack.
              </p>
            </div>

            <div className="card-bento" style={{ backgroundColor: "var(--light-bg)", padding: "40px", borderLeft: "4px solid var(--blue)" }}>
              <h3 className="headline-md" style={{ color: "var(--navy)", margin: "0 0 12px 0" }}>Healthcare Network: Medical Topic Clusters</h3>
              <p style={{ color: "var(--slate)", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                For **a leading healthcare network**, we mapped specialized medical query clusters. AI search crawlers require absolute accuracy for YMYL (Your Money or Your Life) topics. By linking physician entities to detailed clinic pages, publishing exact Q&A schema maps, and structuring articles around disease symptoms and treatments, the hospital established a machine-readable medical knowledge base that AI engines frequently reference.
              </p>
            </div>
          </div>
        </section>

        {/* Structural Rules Section */}
        <section className="section" style={{ padding: "100px 0", backgroundColor: "var(--light-bg)", borderTop: "1px solid var(--border-light)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <span className="overline">How We Build Clusters</span>
              <h2 className="headline-lg">Cluster Rules for <span style={{ color: "var(--blue)" }}>AI Ingestion.</span></h2>
            </div>
            
            <div className="bento-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              <div className="card-corporate" style={{ padding: "32px", backgroundColor: "#fff" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px", color: "var(--navy)" }}>1. Strict Semantic Hierarchy</h3>
                <p style={{ color: "var(--slate)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  Link child nodes directly back to the parent pillar page using explicit entity anchor texts. This maps the boundary of your knowledge base for retrieval systems.
                </p>
              </div>
              <div className="card-corporate" style={{ padding: "32px", backgroundColor: "#fff" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px", color: "var(--navy)" }}>2. Factual Density Over Length</h3>
                <p style={{ color: "var(--slate)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  Avoid conversational filler and corporate throat-clearing. LLM parsers score chunks based on fact-to-word ratios. Write concisely and use bullet lists.
                </p>
              </div>
              <div className="card-corporate" style={{ padding: "32px", backgroundColor: "#fff" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px", color: "var(--navy)" }}>3. Unambiguous Entity Links</h3>
                <p style={{ color: "var(--slate)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  Inject schema markup that references external identifiers (like Wikipedia or Wikidata entries) to remove all ambiguity about the concepts you discuss.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ textAlign: "center", marginTop: "80px", display: "flex", gap: "20px", justifyContent: "center" }}>
              <Link href="/case-studies" className="btn-primary">
                Review Case Studies
              </Link>
              <Link href="/blog" className="btn-secondary">
                Read Blog Articles →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
