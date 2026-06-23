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
  { value: "50+", label: "Platforms Tracked" },
  { value: "90-Day", label: "Core Engagement Model" },
  { value: "4-Pillar", label: "GEO Methodology" },
  { value: "Global", label: "B2B SaaS Focus" },
];

const values = [
  {
    title: "Engineering Over Guesswork",
    description: "Every recommendation is built on technical signals, structured data, and measurable citation outcomes — not opinions or vanity metrics.",
    color: "var(--blue)",
  },
  {
    title: "Entity-First Thinking",
    description: "We structure your brand as a machine-readable entity. LLMs don't rank pages — they cite entities they trust. We build that trust layer.",
    color: "var(--cyan)",
  },
  {
    title: "Outcome Accountability",
    description: "Citation share on target queries is the only metric that matters. We track it weekly and iterate until the number moves.",
    color: "var(--orange)",
  },
  {
    title: "Agentic-First Horizon",
    description: "We think in terms of where AI search is going, not where it has been. Our roadmap is always 18 months ahead of mainstream adoption.",
    color: "var(--blue)",
  },
];

export default function AboutPage() {
  return (
    <div className="page-shell">
      <JsonLd data={aboutSchema} />
      <NavBar />

      <main>
        {/* Hero */}
        <header className="section dark-section" style={{ padding: '160px 0 100px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(circle at 20% 50%, rgba(0, 194, 255, 0.1) 0%, transparent 50%)`,
            zIndex: 0
          }} />
          <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '900px' }}>
            <span className="overline" style={{ color: 'var(--cyan)' }}>About The Company</span>
            <h1 className="headline-xl" style={{ margin: '24px 0 40px', lineHeight: 1.05 }}>
              We make B2B SaaS brands{' '}
              <span style={{ color: 'var(--cyan)' }}>
                undeniable to AI.
              </span>
            </h1>
            <p className="text-large" style={{ maxWidth: '720px', color: 'rgba(255,255,255,0.7)' }}>
              itappens.ai is a dedicated Generative Engine Optimization consultancy. We build the technical and content infrastructure that causes ChatGPT, Perplexity, and Gemini to cite your brand as the primary authority in your category.
            </p>
          </div>
        </header>

        {/* Stats Bar */}
        <section style={{ borderTop: '1px solid var(--brand-border)', borderBottom: '1px solid var(--brand-border)', backgroundColor: '#fff' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0' }}>
            {stats.map((stat, i) => (
              <div key={i} style={{
                padding: '48px 32px',
                textAlign: 'center',
                borderRight: i < stats.length - 1 ? '1px solid var(--brand-border)' : 'none',
              }}>
                <p style={{ fontSize: '40px', fontWeight: 900, color: 'var(--blue)', margin: '0 0 8px', letterSpacing: '-0.04em' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--slate)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="section" style={{ backgroundColor: 'var(--brand-bg)', borderBottom: '1px solid var(--brand-border)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'center' }}>
            <div>
              <span className="overline">Our Mission</span>
              <h2 className="headline-lg">
                The next decade of discovery is{' '}
                <span style={{ color: 'var(--blue)' }}>AI-first.</span>
              </h2>
              <p className="text-large" style={{ marginTop: '24px' }}>
                Traditional search is built for humans who click links. Generative AI is built for models that synthesize answers. These are fundamentally different systems that require different optimization strategies.
              </p>
              <p className="text-large" style={{ marginTop: '24px' }}>
                itappens.ai exists to bridge that gap — turning complex B2B SaaS products into machine-readable entities that AI platforms trust and cite by default.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { label: 'Who We Serve', text: 'B2B SaaS founders and growth teams in the US, UK, Australia, and India who need AI visibility before their category saturates.' },
                { label: 'What We Build', text: 'Technical signal layers, answer-engine content clusters, entity graphs, and citation tracking systems — end-to-end.' },
                { label: 'How We Measure', text: 'Citation share on a defined set of high-intent queries. We track it weekly across ChatGPT, Perplexity, Gemini, and Claude.' },
              ].map((item, i) => (
                <div key={i} className="card-bento" style={{ padding: '32px 40px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase', marginBottom: '12px' }}>{item.label}</p>
                  <p style={{ fontSize: '15px', color: 'var(--slate)', lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section" style={{ backgroundColor: 'var(--brand-bg)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <span className="overline">Operating Principles</span>
              <h2 className="headline-lg">How we think about <span style={{ color: 'var(--blue)' }}>the work.</span></h2>
            </div>
            <div className="bento-grid">
              {values.map((v, i) => (
                <div key={i} className="card-bento" style={{ padding: '48px' }}>
                  <div style={{ width: '48px', height: '4px', backgroundColor: v.color, borderRadius: '2px', marginBottom: '32px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>{v.title}</h3>
                  <p style={{ fontSize: '15px', color: 'var(--slate)', lineHeight: 1.7, margin: 0 }}>{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="audit" className="section dark-section">
          <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
            <span className="overline" style={{ color: 'var(--cyan)' }}>Get Started</span>
            <h2 className="headline-lg">
              Ready to own your <br />
              <span style={{ color: 'var(--cyan)' }}>AI citation layer?</span>
            </h2>
            <p className="text-large" style={{ color: 'rgba(255,255,255,0.7)', marginTop: '24px', marginBottom: '48px' }}>
              Start with a free GEO snapshot. We'll map your current citation visibility, identify the top technical gaps, and outline the first 90-day action plan.
            </p>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/audit" className="btn-primary" style={{ padding: '16px 32px' }}>
                Get Free GEO Snapshot
              </a>
              <a href="/geo" className="btn-secondary" style={{ padding: '16px 32px' }}>
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
