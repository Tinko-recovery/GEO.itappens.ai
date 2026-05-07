import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { organizationSchema, schemaGraph } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "About itappens.ai | Global GEO & AEO Consultancy",
  description: "itappens.ai is a dedicated Generative Engine Optimization consultancy helping global B2B SaaS companies become the primary cited authority in ChatGPT, Perplexity, and Gemini.",
};

const aboutSchema = schemaGraph(organizationSchema());

const stats = [
  { value: "3+", label: "AI Platforms Tracked" },
  { value: "90-Day", label: "Core Engagement Model" },
  { value: "4-Pillar", label: "GEO Methodology" },
  { value: "Global", label: "B2B SaaS Focus" },
];

const values = [
  {
    title: "Engineering Over Guesswork",
    description: "Every recommendation is built on technical signals, structured data, and measurable citation outcomes — not opinions or vanity metrics.",
    color: "var(--brand-blue)",
  },
  {
    title: "Entity-First Thinking",
    description: "We structure your brand as a machine-readable entity. LLMs don't rank pages — they cite entities they trust. We build that trust layer.",
    color: "var(--brand-green)",
  },
  {
    title: "Outcome Accountability",
    description: "Citation share on target queries is the only metric that matters. We track it weekly and iterate until the number moves.",
    color: "var(--brand-orange)",
  },
  {
    title: "Agentic-First Horizon",
    description: "We think in terms of where AI search is going, not where it has been. Our roadmap is always 18 months ahead of mainstream adoption.",
    color: "var(--brand-pink)",
  },
];

export default function AboutPage() {
  return (
    <div className="page-shell">
      <JsonLd data={aboutSchema} />
      <NavBar />

      <main>
        {/* Hero */}
        <header style={{ padding: '180px 0 120px', backgroundColor: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(circle at 20% 50%, rgba(0, 245, 255, 0.06) 0%, transparent 50%),
                         radial-gradient(circle at 80% 50%, rgba(255, 0, 122, 0.06) 0%, transparent 50%)`,
            zIndex: 0
          }} />
          <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '900px' }}>
            <span className="overline" style={{ marginBottom: '24px' }}>About The Company</span>
            <h1 className="headline-xl" style={{ margin: '24px 0 40px', lineHeight: 1.05 }}>
              We make B2B SaaS brands{' '}
              <span style={{ color: 'var(--brand-blue)', textShadow: '0 0 40px rgba(0, 245, 255, 0.25)' }}>
                undeniable to AI.
              </span>
            </h1>
            <p className="text-sub" style={{ fontSize: '20px', lineHeight: 1.8, maxWidth: '720px', color: 'var(--text-dim)' }}>
              itappens.ai is a dedicated Generative Engine Optimization consultancy. We build the technical and content infrastructure that causes ChatGPT, Perplexity, and Gemini to cite your brand as the primary authority in your category.
            </p>
          </div>
        </header>

        {/* Stats Bar */}
        <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-alt)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0' }}>
            {stats.map((stat, i) => (
              <div key={i} style={{
                padding: '48px 32px',
                textAlign: 'center',
                borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <p style={{ fontSize: '40px', fontWeight: 900, color: 'var(--brand-blue)', fontFamily: 'var(--font-display)', margin: '0 0 8px', letterSpacing: '-0.04em' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section style={{ padding: '140px 0', backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'center' }}>
            <div>
              <span className="overline" style={{ marginBottom: '24px' }}>Our Mission</span>
              <h2 className="headline-lg" style={{ margin: '24px 0 32px', lineHeight: 1.1 }}>
                The next decade of discovery is{' '}
                <span style={{ color: 'var(--brand-blue)' }}>AI-first.</span>
              </h2>
              <p style={{ fontSize: '18px', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: '24px' }}>
                Traditional search is built for humans who click links. Generative AI is built for models that synthesize answers. These are fundamentally different systems that require fundamentally different optimization strategies.
              </p>
              <p style={{ fontSize: '18px', color: 'var(--text-dim)', lineHeight: 1.8 }}>
                itappens.ai exists to bridge that gap — turning complex B2B SaaS products into clear, machine-readable entities that AI platforms trust, retrieve, and cite by default.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { label: 'Who We Serve', text: 'B2B SaaS founders and growth teams in the US, UK, Australia, and India who need AI visibility before their category saturates.' },
                { label: 'What We Build', text: 'Technical signal layers, answer-engine content clusters, entity graphs, and citation tracking systems — end-to-end.' },
                { label: 'How We Measure', text: 'Citation share on a defined set of high-intent queries. We track it weekly across ChatGPT, Perplexity, Gemini, and Claude.' },
              ].map((item, i) => (
                <div key={i} className="card-glass" style={{ padding: '32px 40px' }}>
                  <p style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--brand-blue)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>{item.label}</p>
                  <p style={{ fontSize: '15px', color: 'var(--text-dim)', lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section style={{ padding: '140px 0', backgroundColor: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '700px', margin: '0 auto 80px' }}>
              <span className="overline" style={{ marginBottom: '24px' }}>Operating Principles</span>
              <h2 className="headline-lg" style={{ margin: '24px 0 0', lineHeight: 1.1 }}>
                How we think about{' '}
                <span style={{ color: 'var(--brand-blue)' }}>the work.</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {values.map((v, i) => (
                <div key={i} className="card-glass" style={{ padding: '48px' }}>
                  <div style={{ width: '48px', height: '4px', backgroundColor: v.color, borderRadius: '2px', marginBottom: '32px', boxShadow: `0 0 12px ${v.color}` }} />
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px', letterSpacing: '-0.02em' }}>{v.title}</h3>
                  <p style={{ fontSize: '15px', color: 'var(--text-dim)', lineHeight: 1.7, margin: 0 }}>{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '140px 0', backgroundColor: 'var(--bg)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <span className="overline" style={{ marginBottom: '24px' }}>Get Started</span>
            <h2 className="headline-lg" style={{ margin: '24px 0 32px', lineHeight: 1.1 }}>
              Ready to own your{' '}
              <span style={{ color: 'var(--brand-blue)' }}>AI citation layer?</span>
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: '56px' }}>
              Start with a free GEO snapshot. We'll map your current citation visibility, identify the top technical gaps, and outline the first 90-day action plan.
            </p>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/audit" className="btn-primary" style={{ padding: '20px 48px', fontSize: '16px', borderRadius: '14px' }}>
                Get Free GEO Snapshot
              </a>
              <a href="/geo" className="btn-secondary" style={{ padding: '20px 48px', fontSize: '16px', borderRadius: '14px' }}>
                See the Framework →
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
