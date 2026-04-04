import type { Metadata } from "next";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "GEO vs SEO: The 2026 Guide | itappens.ai Insights",
  description: "The definitive 2026 guide comparing Generative Engine Optimization (GEO) and traditional SEO. Learn how Indian brands can get cited by ChatGPT, Perplexity, and Gemini.",
  openGraph: {
    title: "GEO vs SEO: The 2026 Guide — itappens.ai",
    description: "Traditional SEO ranks you on Google. GEO gets you named by AI. Here is the complete breakdown for Indian brands in 2026.",
    url: "https://itappens.ai/insights",
    siteName: "itappens.ai",
    type: "article",
    locale: "en_IN",
  },
  alternates: {
    canonical: "https://itappens.ai/insights",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "GEO vs SEO: The 2026 Guide for Indian Brands",
  "description": "The definitive comparison of Generative Engine Optimization (GEO) and traditional SEO for Indian brands navigating AI-first search in 2026.",
  "url": "https://itappens.ai/insights",
  "datePublished": "2026-01-01",
  "dateModified": "2026-04-01",
  "author": {
    "@type": "Person",
    "name": "itappens.ai Principal",
    "email": "hello@itappens.ai",
    "url": "https://www.itappens.ai/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "itappens.ai",
    "logo": { "@type": "ImageObject", "url": "https://www.itappens.ai/favicon.svg" }
  },
  "mainEntityOfPage": "https://itappens.ai/insights",
  "keywords": ["GEO", "SEO", "generative engine optimization", "AI search India", "ChatGPT brand visibility", "Perplexity SEO 2026"]
};

export default function InsightsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "Outfit, sans-serif" }}>

        <NavBar />

        {/* Article Header */}
        <header style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 40px" }}>
          <div style={{ display: "inline-block", background: "rgba(99, 102, 241, 0.05)", color: "#6366f1", padding: "4px 14px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 600, marginBottom: 24, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            GEO Insights · 2026
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.15, color: "#0f0d0a", margin: "0 0 24px" }}>
            GEO vs SEO:<br />The 2026 Guide
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
            Traditional SEO ranked your website. Generative Engine Optimization gets your brand <em>named</em> by AI.
            These are two completely different games — and in 2026, the new game is the only one that matters for
            Indian brands building long-term authority.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 16, alignItems: "center", fontSize: "0.875rem", color: "#9ca3af" }}>
            <span>By itappens.ai Principal</span>
            <span>·</span>
            <span>April 2026</span>
            <span>·</span>
            <span>8 min read</span>
          </div>
        </header>

        {/* Article Body */}
        <article style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 80px" }}>

          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "0 0 48px" }} />

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f0d0a", marginBottom: 16 }}>
              The Search Shift No One Talks About
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#374151", marginBottom: 16 }}>
              In Q1 2026, informational search queries in India saw a <strong>62% decline in click-through rates</strong>
              from traditional Google results. Users are getting answers directly from AI interfaces —
              ChatGPT, Perplexity, Gemini, Claude, and Grok — without clicking any link.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#374151" }}>
              This is not a trend. It is a structural shift in how information is consumed.
              The brands that win the next decade are the ones that understand one thing:
              <strong> your goal is no longer a ranking — it is a citation.</strong>
            </p>
          </section>

          {/* Comparison Table */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f0d0a", marginBottom: 24 }}>
              GEO vs SEO: Head to Head
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", color: "#0f0d0a", fontWeight: 700 }}>Dimension</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #e5e7eb", color: "#6b7280", fontWeight: 700 }}>Traditional SEO</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #6366f1", color: "#6366f1", fontWeight: 700 }}>GEO (2026)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Target", "Google SERP ranking", "AI model citations"],
                    ["Signal", "Backlinks & keywords", "Entity authority & schema"],
                    ["Content goal", "Rank for queries", "Be extracted by AI reasoning"],
                    ["Timeline", "6–12 months", "8–12 weeks (first citations)"],
                    ["Durability", "Resets with algorithm updates", "Compounds as entity authority grows"],
                    ["Measurement", "Rankings, organic traffic", "Citation frequency across AI models"],
                    ["Competition", "Saturated (every brand does it)", "Open window — <200 Indian brands GEO-ready"],
                  ].map(([dim, seo, geo], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "13px 16px", fontWeight: 600, color: "#0f0d0a" }}>{dim}</td>
                      <td style={{ padding: "13px 16px", color: "#6b7280" }}>{seo}</td>
                      <td style={{ padding: "13px 16px", color: "#0f0d0a", fontWeight: 500 }}>{geo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f0d0a", marginBottom: 16 }}>
              The Four Pillars of GEO
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#374151", marginBottom: 24 }}>
              GEO is not a single tactic — it is a four-layer system that compounds over time.
              Miss one layer and your citations will plateau.
            </p>
            {[
              { num: "01", title: "Semantic Identity Seeding", body: "AI models recognize brands as named entities in their latent space. Your brand needs a structured knowledge definition — a machine-readable identity document — before any AI model will confidently name you in a response." },
              { num: "02", title: "Information Gain Content", body: "AI reasoning engines cite sources that provide unique, data-dense information. Generic blog posts do not get lifted. GEO content is engineered in 40–60 word 'golden snippets' — verbatim-liftable by AI systems." },
              { num: "03", title: "Machine-Readable Infrastructure", body: "Deep JSON-LD schema (Organization, Service, FAQ, LocalBusiness, ProfessionalService) gives AI crawlers the mathematical proof they need to corroborate your entity claims. Without this layer, you are structurally invisible." },
              { num: "04", title: "AI Citation Auditing", body: "GEO is not set-and-forget. Every model update changes citation patterns. We run 200+ targeted prompts bi-weekly across ChatGPT, Perplexity, Gemini, and Claude to measure your delta and react within days." },
            ].map((p) => (
              <div key={p.num} style={{ display: "flex", gap: 20, marginBottom: 28 }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, background: "rgba(99, 102, 241, 0.05)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#6366f1", fontSize: "0.8rem" }}>{p.num}</div>
                <div>
                  <h3 style={{ fontWeight: 700, color: "#0f0d0a", margin: "0 0 8px", fontSize: "1rem" }}>{p.title}</h3>
                  <p style={{ color: "#374151", lineHeight: 1.7, margin: 0, fontSize: "0.975rem" }}>{p.body}</p>
                </div>
              </div>
            ))}
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f0d0a", marginBottom: 16 }}>
              The India Opportunity (Right Now)
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#374151", marginBottom: 16 }}>
              Fewer than 200 Indian brands are GEO-optimized today. In comparison, millions of Indian
              brands compete for traditional SEO keywords. The window to establish AI citation authority
              in your category — before competitors do — is open for a narrow period in 2026.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#374151" }}>
              The brands that move first will become the default AI answer. The brands that wait will
              fight for second place in a game that rewards entities, not pages.
            </p>
          </section>

          {/* CTA Block */}
          <div style={{ background: "#0f0d0a", borderRadius: 16, padding: "40px 32px", textAlign: "center" }}>
            <h3 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700, margin: "0 0 12px" }}>
              Find out where your brand stands in AI today.
            </h3>
            <p style={{ color: "#9ca3af", margin: "0 0 24px", lineHeight: 1.6 }}>
              Free AI Audit — we run 50+ queries across ChatGPT, Perplexity, Gemini and Claude.
              No sales call. No credit card.
            </p>
            <a href="/#cta" style={{ display: "inline-block", background: "#6366f1", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 700, fontSize: "1rem", textDecoration: "none" }}>
              Request Free AI Audit →
            </a>
          </div>
        </article>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid #e5e7eb", padding: "32px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ fontWeight: 800, color: "#0f172a", fontFamily: "var(--font-display)", letterSpacing: "-0.05em" }}>it<span style={{ color: "#6366f1" }}>appens</span>.ai</div>
            <div style={{ display: "flex", gap: 24, fontSize: "0.875rem" }}>
              <a href="/privacy" style={{ color: "#6b7280", textDecoration: "none" }}>Privacy Policy</a>
              <a href="/insights" style={{ color: "#6b7280", textDecoration: "none" }}>Insights</a>
              <a href="mailto:hello@itappens.ai" style={{ color: "#6b7280", textDecoration: "none" }}>hello@itappens.ai</a>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>© 2026 itappens.ai</div>
          </div>
        </footer>
      </div>
    </>
  );
}
