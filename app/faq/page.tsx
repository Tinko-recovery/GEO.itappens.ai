import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { faqSchema as buildFaqSchema, schemaGraph } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Service FAQ | Intelligence Hub | itappens.ai",
  description: "Answers to common questions about Generative Engine Optimization (GEO), AI search visibility, and our implementation methodology.",
  alternates: { canonical: "https://www.itappens.ai/faq" },
};

const FAQS = [
  {
    category: "Understanding GEO",
    items: [
      {
        q: "What is Generative Engine Optimization (GEO)?",
        a: "GEO is the practice of structuring your brand's data, content, and technical infrastructure so that AI models - ChatGPT, Perplexity, Gemini, Claude - cite your brand when answering questions in your category. It's the evolution of SEO for the age of answer engines.",
      },
      {
        q: "How does GEO differ from traditional SEO?",
        a: "SEO targets keyword rankings in search results. GEO builds entity authority - making your brand a recognized, trusted source that AI models cite. While SEO focuses on clicks, GEO focuses on citation share and extraction accuracy.",
      },
      {
        q: "Which AI models does GEO affect?",
        a: "Our system targets the primary engines where brand citations occur: ChatGPT, Perplexity, Gemini, Claude, Grok, and SearchGPT. We track visibility across all these platforms weekly.",
      },
    ],
  },
  {
    category: "The System",
    items: [
      {
        q: "What does the Free AI Audit include?",
        a: "The audit runs targeted prompts across major AI models to establish your current citation rate and competitor gap. You receive a report showing where your brand is cited and where competitors are appearing in your place.",
      },
      {
        q: "How long before I start appearing in AI responses?",
        a: "Most brands see their first verifiable citation movement within 8-12 weeks of implementing the 4-pillar system. This is measured against concrete query sets and audited weekly.",
      },
      {
        q: "What is the 4-Pillar Framework?",
        a: "Our methodology consists of: (1) Technical Signals - machine-readable structure; (2) Content Layer - answer-first query clusters; (3) Entity Corroboration - cross-source consistency; (4) Tracking - weekly citation auditing.",
      },
    ],
  },
  {
    category: "Engagement",
    items: [
      {
        q: "How does pricing work?",
        a: "We offer three tiers: Technical Signals Sprint (Fixed scope setup), 90-Day GEO System (Full execution), and Platform + Advisory (Ongoing operations). All pricing is scoped to the query volume and category depth.",
      },
      {
        q: "Do you work with international brands?",
        a: "Yes. While we have deep roots in India, we primarily serve global B2B SaaS brands and startups in the US, UK, and Australia where the AI decision journey is most mature.",
      },
    ],
  },
];

export default function FAQPage() {
  const pageSchema = schemaGraph(
    buildFaqSchema(FAQS.flatMap(s => s.items.map(i => ({ question: i.q, answer: i.a }))), "/faq")
  );

  return (
    <div className="page-shell">
      <JsonLd data={pageSchema} />
      <NavBar />
      <main>
        <header className="dark-section" style={{ padding: '180px 0 100px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(circle at 20% 50%, rgba(0, 194, 255, 0.1) 0%, transparent 50%)`,
            zIndex: 0
          }} />
          <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '900px' }}>
            <span className="badge-pill" style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.1)', color: 'var(--cyan)' }}>
              Service FAQ
            </span>
            <h1 className="headline-xl" style={{ margin: '24px 0 40px' }}>
              Everything you need <br />
              <span style={{ color: 'var(--cyan)' }}>to decide.</span>
            </h1>
            <p className="text-large" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Common questions about Generative Engine Optimization, AI search visibility, and our implementation methodology.
            </p>
          </div>
        </header>

        <section style={{ padding: '100px 0', backgroundColor: '#fff' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            {FAQS.map((section, si) => (
              <div key={si} style={{ marginBottom: '80px' }}>
                <h2 className="badge-pill" style={{ marginBottom: '40px' }}>
                  {section.category}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                  {section.items.map((item, i) => (
                    <div key={i} style={{ paddingBottom: '48px', borderBottom: '1px solid var(--border)' }}>
                      <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: 'var(--navy)' }}>
                        {item.q}
                      </h3>
                      <p style={{ fontSize: '17px', color: 'var(--slate)', lineHeight: 1.8 }}>{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="card-corporate" style={{ 
              marginTop: '60px', 
              padding: '60px', 
              backgroundColor: 'var(--navy)', 
              color: 'white', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px'
            }}>
              <span style={{ color: 'var(--cyan)', fontWeight: 800, textTransform: 'uppercase', fontSize: '13px' }}>Still have questions?</span>
              <h2 className="headline-md" style={{ margin: 0 }}>Start with a Free AI Audit.</h2>
              <p style={{ maxWidth: '600px', opacity: 0.8, fontSize: '17px' }}>
                We'll run your brand through 50+ queries across ChatGPT, Perplexity, and Gemini to show you exactly where you stand.
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <a href="/audit" className="btn-blue">
                  Run Audit Now
                </a>
                <a href="mailto:hello@itappens.ai" className="btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
                  Email Strategy Team
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

