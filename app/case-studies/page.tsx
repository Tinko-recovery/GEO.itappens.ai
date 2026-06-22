import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { caseStudies } from "@/lib/content/caseStudies";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, faqSchema, schemaGraph } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "AEO & GEO Case Studies | itappens.ai",
  description: "Explore our collection of Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) case studies, including local hospitality and enterprise healthcare.",
  path: "/case-studies",
  keywords: ["GEO case studies", "AEO client results", "AI citation proof"],
});

const selfCase = caseStudies[0];

const caseStudiesSchema = schemaGraph(
  articleSchema({
    headline: "itappens.ai Case Studies and Proof Directory",
    description: "Proof of citation growth, local search optimization, and structured schema implementation results for SaaS, healthcare, and hospitality brands.",
    path: "/case-studies",
    datePublished: selfCase.publishedAt,
    dateModified: selfCase.updatedAt,
  }),
  faqSchema(selfCase.faq)
);

export default function CaseStudiesPage() {
  return (
    <div className="page-shell">
      <JsonLd data={caseStudiesSchema} />
      <NavBar />
      <main>
        {/* Header */}
        <header className="section dark-section" style={{ padding: "160px 0 100px", position: "relative" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <span className="overline" style={{ color: "var(--cyan)" }}>/case-studies</span>
            <h1 className="headline-xl" style={{ margin: "24px 0", lineHeight: 1.1 }}>
              Evidence of AI <br />
              <span style={{ color: "var(--cyan)" }}>Citation Dominance.</span>
            </h1>
            <p className="text-large" style={{ color: "rgba(255,255,255,0.7)", maxWidth: "720px", margin: 0 }}>
              Discover how brands secure recommendations, build local pack rankings, and increase citation voice share across ChatGPT, Perplexity, Claude, and Gemini.
            </p>
          </div>
        </header>

        {/* Directory Grid */}
        <section className="section" style={{ padding: "120px 0", backgroundColor: "var(--light-bg)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "32px" }}>
              {caseStudies.map((study) => {
                // Find primary metric
                const primaryMetric = study.metrics[0];
                return (
                  <div key={study.slug} className="card-bento" style={{ 
                    backgroundColor: "#fff", 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "24px",
                    padding: "40px",
                    height: "100%"
                  }}>
                    <div>
                      <span className="badge-pill" style={{ display: "inline-block", fontSize: "11px", marginBottom: "16px" }}>
                        {study.evidenceLabel}
                      </span>
                      <h2 className="headline-md" style={{ color: "var(--navy)", margin: 0 }}>
                        {study.headline}
                      </h2>
                    </div>

                    {/* Metric Highlight Box */}
                    {primaryMetric && (
                      <div style={{ 
                        padding: "20px", 
                        backgroundColor: "var(--light-bg)", 
                        borderRadius: "12px",
                        textAlign: "center"
                      }}>
                        <div style={{ fontSize: "36px", fontWeight: 900, color: "var(--blue)" }}>
                          {primaryMetric.value}
                        </div>
                        <div style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", color: "var(--slate)" }}>
                          {primaryMetric.label}
                        </div>
                      </div>
                    )}

                    <p style={{ color: "var(--slate)", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                      {study.summary}
                    </p>

                    <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid var(--border-light)" }}>
                      <Link href={`/case-studies/${study.slug}`} className="btn-primary" style={{ display: "block", textAlign: "center" }}>
                        Read Case Study →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
