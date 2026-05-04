import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "GEO vs SEO: The 2026 Guide | itappens.ai Insights",
  description: "The definitive 2026 guide comparing Generative Engine Optimization (GEO) and traditional SEO. Learn how Indian brands can get cited by ChatGPT, Perplexity, and Gemini.",
  openGraph: {
    title: "GEO vs SEO: The 2026 Guide — itappens.ai",
    description: "Traditional SEO ranks you on Google. GEO gets you named by AI. Here is the complete breakdown for Indian brands in 2026.",
    url: "https://www.itappens.ai/insights",
    siteName: "itappens.ai",
    type: "article",
    locale: "en_IN",
  },
  alternates: {
    canonical: "https://www.itappens.ai/insights",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "GEO vs SEO: The 2026 Guide for Indian Brands",
  "description": "The definitive comparison of Generative Engine Optimization (GEO) and traditional SEO for Indian brands navigating AI-first search in 2026.",
  "url": "https://www.itappens.ai/insights",
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
  "mainEntityOfPage": "https://www.itappens.ai/insights",
  "keywords": ["GEO", "SEO", "generative engine optimization", "AI search India", "ChatGPT brand visibility", "Perplexity SEO 2026"]
};

export default function InsightsPage() {
  return (
    <div className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <NavBar />
      <main>
        <header className="section" style={{ padding: '160px 0 60px', backgroundColor: 'var(--bg)' }}>
          <div className="container-narrow">
            <span className="overline" style={{ color: 'var(--accent)', marginBottom: '24px', display: 'block' }}>GEO Insights · 2026 Edition</span>
            <h1 className="headline-xl" style={{ margin: '24px 0', letterSpacing: '-0.04em' }}>
              GEO vs SEO: <br />
              <span style={{ color: 'var(--accent)' }}>The 2026 Definitive Guide.</span>
            </h1>
            <p className="text-sub" style={{ marginBottom: '32px', fontSize: '20px' }}>
              Traditional SEO ranked your website. Generative Engine Optimization gets your brand <em>named</em> by AI. 
              In 2026, the citation is the only metric that builds long-term authority.
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span>By itappens.ai Principal</span>
              <span>·</span>
              <span>8 min read</span>
            </div>
          </div>
        </header>

        <section className="section" style={{ padding: '0 0 100px' }}>
          <div className="container-narrow">
            <article className="article-body" style={{ color: 'var(--text)', lineHeight: 1.8 }}>
              <section style={{ marginBottom: '64px' }}>
                <h2 className="headline-md" style={{ marginBottom: '24px', color: 'var(--text)' }}>The Search Shift No One Talks About</h2>
                <p style={{ fontSize: '18px', color: 'var(--text-dim)', marginBottom: '24px' }}>
                  In Q1 2026, informational search queries in India saw a <strong>62% decline in click-through rates</strong>
                  from traditional Google results. Users are getting answers directly from AI interfaces.
                </p>
                <p style={{ fontSize: '18px', color: 'var(--text-dim)' }}>
                  This is not a trend. It is a structural shift. The brands that win the next decade are the ones that understand one thing:
                  <strong> your goal is no longer a ranking — it is a verifiable citation.</strong>
                </p>
              </section>

              <section style={{ marginBottom: '64px' }}>
                <h2 className="headline-md" style={{ marginBottom: '32px', color: 'var(--text)' }}>GEO vs SEO: Head to Head</h2>
                <div style={{ 
                  overflowX: 'auto', 
                  backgroundColor: 'var(--surface)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '24px',
                  padding: '32px'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)' }}>
                        <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text)', fontWeight: 800 }}>Dimension</th>
                        <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)' }}>Traditional SEO</th>
                        <th style={{ padding: '16px', textAlign: 'left', color: 'var(--accent)', fontWeight: 800 }}>GEO (2026)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Target", "Google SERP ranking", "AI model citations"],
                        ["Signal", "Backlinks & keywords", "Entity authority & schema"],
                        ["Content goal", "Rank for queries", "Be extracted by AI reasoning"],
                        ["Timeline", "6–12 months", "8–12 weeks"],
                        ["Measurement", "Rankings, traffic", "Citation frequency"],
                        ["Competition", "Saturated", "Open Window (<200 brands)"],
                      ].map(([dim, seo, geo], i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '16px', fontWeight: 700, color: 'var(--text)' }}>{dim}</td>
                          <td style={{ padding: '16px', color: 'var(--text-dim)' }}>{seo}</td>
                          <td style={{ padding: '16px', color: 'var(--text)', fontWeight: 600 }}>{geo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section style={{ marginBottom: '64px' }}>
                <h2 className="headline-md" style={{ marginBottom: '32px', color: 'var(--text)' }}>The Four Pillars of GEO</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {[
                    { num: "01", title: "Semantic Identity", body: "AI models recognize brands as named entities in their latent space. Your brand needs a machine-readable identity definition before any AI model will confidently name you." },
                    { num: "02", title: "Information Gain", body: "AI reasoning engines cite sources that provide unique, data-dense information. GEO content is engineered in 'golden snippets' — verbatim-liftable by AI systems." },
                    { num: "03", title: "Machine Infrastructure", body: "Deep JSON-LD schema (Organization, Service, FAQ) gives AI crawlers the mathematical proof they need to corroborate your entity claims." },
                    { num: "04", title: "AI Citation Auditing", body: "Every model update changes citation patterns. We run targeted prompts bi-weekly to measure your delta and react within days." },
                  ].map((p) => (
                    <div key={p.num} className="card-bento" style={{ padding: '32px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', gap: '24px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--accent-soft)', 
                        color: 'var(--accent)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 800,
                        flexShrink: 0
                      }}>{p.num}</div>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{p.title}</h3>
                        <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--text-dim)', margin: 0 }}>{p.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div style={{ 
                marginTop: '80px', 
                padding: '64px', 
                backgroundColor: 'var(--text)', 
                color: 'var(--surface)', 
                borderRadius: '32px', 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px'
              }}>
                <span className="overline" style={{ color: 'var(--accent)' }}>Direct Impact</span>
                <h2 className="headline-lg" style={{ color: 'var(--surface)', margin: 0 }}>Benchmarking your presence.</h2>
                <p style={{ maxWidth: '560px', opacity: 0.8, fontSize: '17px', lineHeight: 1.6 }}>
                  Find out where your brand stands in AI today. We run 50+ queries across ChatGPT, Perplexity, Gemini and Claude.
                </p>
                <a href="/audit" className="btn-primary" style={{ padding: '18px 40px' }}>
                  Request Free AI Audit →
                </a>
              </div>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
