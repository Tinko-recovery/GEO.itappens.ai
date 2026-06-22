import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { buildMetadata } from "@/lib/seo/metadata";
import { howToSchema, organizationSchema, schemaGraph } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Building Citation Authority: How to Get AI Engines to Recommend Your Brand | itappens.ai",
  description: "Learn step-by-step how to build citation authority, establish cross-site corroboration, and optimize backlinks for LLM search recommendation systems.",
  path: "/citation-authority",
  keywords: ["Citation Authority", "Backlinks for LLMs", "AI Search citations", "AEO backlink strategy", "Offsite corroboration"],
});

const stepsData = [
  {
    name: "Establish a Consistent Entity Profile",
    text: "Normalize your brand name, legal name, address, phone number, and core services exactly across your domain schema, LinkedIn, Crunchbase, and leading directories. AI crawlers corroborate facts across multiple domains, and inconsistencies lower your confidence score."
  },
  {
    name: "Optimize Off-Site Corroboration",
    text: "Publish press releases, case proof metrics, and guest posts on high-authority domains that are already indexed and trusted as reference sites by AI bots. When multiple independent sites agree on your brand details, the model cites you with high confidence."
  },
  {
    name: "Implement Schema References",
    text: "Inject Organization, Service, and Person schemas linking your domain directly to your social profile links and directory listings using the sameAs property. This explicitly declares your entity nodes to database graphs."
  },
  {
    name: "Monitor Citation Share of Voice",
    text: "Run weekly automated query checks across ChatGPT, Claude, Gemini, and Perplexity. Identify search gap areas where competitors are cited instead, and build targeted content or backlink assets to bridge the gaps."
  }
];

const citationSchema = schemaGraph(
  organizationSchema(),
  howToSchema({
    name: "How to build citation authority for AI search engines",
    description: "A step-by-step blueprint to establishing brand credibility and securing citation footnotes across conversational AI platforms.",
    path: "/citation-authority",
    steps: stepsData,
  })
);

export default function CitationAuthorityPage() {
  return (
    <div className="page-shell">
      <JsonLd data={citationSchema} />
      <NavBar />

      <main>
        {/* Hero Section */}
        <header className="section dark-section" style={{ padding: "160px 0 100px", position: "relative" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <span className="overline" style={{ color: "var(--cyan)" }}>Pillar 4: Citation Building</span>
            <h1 className="headline-xl" style={{ margin: "24px 0", lineHeight: 1.1 }}>
              How to Build Citation <br />
              <span style={{ color: "var(--cyan)" }}>Authority in AI Engines</span>
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
                Summary Box (Citation Authority Snippet)
              </span>
              <p className="text-large" style={{ color: "#fff", margin: 0, fontWeight: 500, lineHeight: 1.6 }}>
                <strong>Citation Authority</strong> represents the probability that an answer engine will list your domain's URL as a footnote source in its generated response. Unlike traditional backlinks which focus on passing domain authority (PageRank), citation authority is earned by building crossplatform corroboration, ensuring your entity properties match exactly across the web, and unblocking AI bot access.
              </p>
            </div>
          </div>
        </header>

        {/* The Blueprint (HowTo steps rendering) */}
        <section className="section" style={{ padding: "100px 0", backgroundColor: "#fff" }}>
          <div className="container-narrow">
            <h2 className="headline-lg" style={{ marginBottom: "48px", textAlign: "center" }}>The Citation Authority <span style={{ color: "var(--blue)" }}>Blueprint.</span></h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              {stepsData.map((step, index) => (
                <div key={step.name} className="card-bento" style={{ 
                  backgroundColor: "var(--light-bg)", 
                  padding: "40px", 
                  borderRadius: "16px",
                  display: "grid",
                  gridTemplateColumns: "60px 1fr",
                  gap: "24px",
                  alignItems: "start"
                }}>
                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "50%", 
                    backgroundColor: "var(--blue)", 
                    color: "#fff", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: 900
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="headline-md" style={{ margin: "0 0 12px 0", color: "var(--navy)" }}>{step.name}</h3>
                    <p style={{ color: "var(--slate)", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Backlink Strategy for LLMs */}
        <section className="section" style={{ padding: "100px 0", backgroundColor: "var(--light-bg)", borderTop: "1px solid var(--border-light)" }}>
          <div className="container-narrow">
            <h2 className="headline-lg" style={{ marginBottom: "32px" }}>The Backlink Playbook for <span style={{ color: "var(--blue)" }}>Retrieval Engines</span></h2>
            <p className="text-sub" style={{ lineHeight: 1.8, marginBottom: "24px" }}>
              Traditional backlink acquisition focuses heavily on obtaining do-follow links with targeted anchor texts from sites with high domain authority. For answer engines, the rules are different.
            </p>
            <p className="text-sub" style={{ lineHeight: 1.8, marginBottom: "24px" }}>
              Retrieval models do not trace PageRank links dynamically during an answer generation session. Instead, they scan indices of pages that mention relevant concepts. Therefore, the value of a link is determined by the **contextual relevance of the mention**.
            </p>
            <p className="text-sub" style={{ lineHeight: 1.8, marginBottom: "40px" }}>
              Getting cited by directories and comparison tables that AI engines already use as reference corpuses (such as industry-specific catalogs, Wikipedia, or trusted press outlets) carries far higher citation weight than buying guest post links on random blogs.
            </p>

            {/* CTAs */}
            <div style={{ textAlign: "center", display: "flex", gap: "20px", justifyContent: "center" }}>
              <Link href="/solutions/visible-in-ai" className="btn-primary">
                Make My Business Visible in AI
              </Link>
              <Link href="/aeo" className="btn-secondary">
                Read about AEO Pillars
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
