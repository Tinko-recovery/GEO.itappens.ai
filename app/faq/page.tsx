import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "FAQ â€” Generative Engine Optimization | itappens.ai",
  description: "Answers to the most common questions about GEO, AI search visibility, and how itappens.ai engineers Indian brands into ChatGPT, Perplexity, and Gemini answers.",
  alternates: { canonical: "https://www.itappens.ai/faq" },
  openGraph: {
    title: "FAQ â€” itappens.ai GEO Agency",
    description: "Everything you need to know about Generative Engine Optimization for Indian brands.",
    url: "https://www.itappens.ai/faq",
    siteName: "itappens.ai",
    type: "website",
    locale: "en_IN",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Generative Engine Optimization (GEO)?",
      "acceptedAnswer": { "@type": "Answer", "text": "GEO is the practice of structuring your brand's data, content, and technical infrastructure so that AI models â€” ChatGPT, Perplexity, Gemini, Claude â€” cite your brand when answering questions in your category. It's to AI what SEO was to Google, except the signals are completely different: entity consistency, information gain, and cross-source corroboration rather than backlinks and keyword density." }
    },
    {
      "@type": "Question",
      "name": "How long before my brand starts appearing in AI responses?",
      "acceptedAnswer": { "@type": "Answer", "text": "Most clients see their first verifiable AI citations within 8â€“12 weeks of starting. We measure this with 200+ targeted prompts run bi-weekly across ChatGPT, Perplexity, Gemini and Claude so you see progress in concrete numbers." }
    },
    {
      "@type": "Question",
      "name": "How does GEO differ from traditional SEO?",
      "acceptedAnswer": { "@type": "Answer", "text": "SEO targets keywords and ranks web pages. GEO builds entity authority â€” making your brand a recognised, trusted entity that AI reasoning engines cite. The signals are completely different: entity consistency, knowledge graph integration, and LLM citations rather than backlinks and keyword density." }
    },
    {
      "@type": "Question",
      "name": "What types of businesses does itappens.ai work with?",
      "acceptedAnswer": { "@type": "Answer", "text": "We work best with service businesses, consultants, agencies, and B2B product brands that have a specific category they want to own in AI responses. We keep a small client roster per quarter â€” max 2 clients per niche per geography â€” so we go deep, not wide." }
    },
    {
      "@type": "Question",
      "name": "What does a Free AI Audit include?",
      "acceptedAnswer": { "@type": "Answer", "text": "The Free AI Audit runs 50+ targeted prompts across ChatGPT, Perplexity, Gemini and Claude to establish your current citation rate and competitor gap. You receive a report showing where your brand is cited, where it's invisible, and which competitors are appearing in your place. No credit card, no sales call." }
    },
    {
      "@type": "Question",
      "name": "How does GEO pricing work?",
      "acceptedAnswer": { "@type": "Answer", "text": "itappens.ai offers three plans: GEO Starter (â‚¹4,999/mo), GEO Pro (â‚¹9,999/mo), and GEO Authority (â‚¹19,999/mo). All plans are monthly with no lock-in. The difference is the depth of the 4-pillar system applied â€” content volume, citation network size, and reporting frequency." }
    },
  ]
};

const FAQS = [
  {
    category: "Understanding GEO",
    items: [
      {
        q: "What is Generative Engine Optimization (GEO)?",
        a: "GEO is the practice of structuring your brand's data, content, and technical infrastructure so that AI models â€” ChatGPT, Perplexity, Gemini, Claude â€” cite your brand when answering questions in your category. It's to AI what SEO was to Google, except the signals are completely different: entity consistency, information gain, and cross-source corroboration rather than backlinks and keyword density.",
      },
      {
        q: "Why is GEO different from traditional SEO?",
        a: "SEO targets keywords and ranks web pages. GEO builds entity authority â€” making your brand a recognised, trusted entity that AI reasoning engines cite. Traditional SEO takes 6â€“12 months and resets with every algorithm update. GEO citations compound over time and grow more authoritative as AI models train on more data.",
      },
      {
        q: "Which AI models does GEO affect?",
        a: "Our methodology targets the six primary AI models where brand citations occur: ChatGPT (OpenAI), Perplexity, Gemini (Google), Claude (Anthropic), Grok (xAI), and Microsoft Copilot. We run audits across all six platforms bi-weekly.",
      },
      {
        q: "Is GEO relevant for Indian businesses specifically?",
        a: "Yes â€” and urgently so. Fewer than 200 Indian brands are GEO-optimised today. The window to establish AI citation authority in your category before competitors do is open right now in 2026, but it's closing fast as awareness spreads. India-specific entity signals, directories, and content formats require a different approach than Western GEO methodologies.",
      },
    ],
  },
  {
    category: "The Process",
    items: [
      {
        q: "What does a Free AI Audit include?",
        a: "The Free AI Audit runs 50+ targeted prompts across ChatGPT, Perplexity, Gemini and Claude to establish your current citation rate and competitor gap map. You receive a report showing exactly where your brand is cited, where it's invisible, and which competitors are appearing in your place. No credit card, no sales call required.",
      },
      {
        q: "How long before I start appearing in AI responses?",
        a: "Most clients see their first verifiable AI citations within 8â€“12 weeks of starting engagement. We measure this with 200+ targeted prompts run bi-weekly so you see progress in concrete numbers â€” not vague claims about 'improving visibility'.",
      },
      {
        q: "What is the 4-Pillar Framework?",
        a: "The 4-Pillar Framework is our core methodology: (1) Entity Correction â€” building the structured knowledge definition AI models use to identify your brand; (2) Information-Gain Content â€” engineering 40â€“60 word 'golden snippets' that AI systems verbatim-lift; (3) Neural-Link Building â€” 15+ authoritative third-party corroborating sources; (4) Citation Tracking â€” bi-weekly 200+ prompt audits across all AI platforms.",
      },
      {
        q: "Do I need to change my existing website?",
        a: "Not necessarily. We layer GEO infrastructure on top of your existing digital presence. The primary changes are JSON-LD schema additions, new GEO content assets, and third-party entity references. We do not require a website rebuild.",
      },
    ],
  },
  {
    category: "Pricing & Engagement",
    items: [
      {
        q: "How does pricing work?",
        a: "We offer three monthly plans: GEO Starter (â‚¹4,999/mo) for establishing your AI entity and first citations; GEO Pro (â‚¹9,999/mo) for the full 4-pillar system; GEO Authority (â‚¹19,999/mo) for category dominance. All plans are monthly with no lock-in contracts.",
      },
      {
        q: "How many clients do you take on per quarter?",
        a: "We maintain a small client roster â€” a maximum of 2 clients per niche per geography per quarter. This is deliberate: deep, effective GEO work is incompatible with high-volume agency models. We go deep, not wide.",
      },
      {
        q: "What is the ROI compared to paid ads?",
        a: "Paid ads stop the moment you stop paying. GEO citations are entity-based â€” they compound over time and grow more authoritative as AI models train on more data. The investment in entity authority pays dividends across every AI model update, whereas paid traffic requires continuous spend to maintain.",
      },
      {
        q: "How do I get started?",
        a: "Start with the Free AI Audit. We run your brand through 50+ targeted queries and send you the gap report. From there, if there's a fit, we'll discuss which plan is appropriate for your category and timeline.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <NavBar />
      <main>
        <header className="section" style={{ padding: '160px 0 100px', backgroundColor: 'var(--bg)' }}>
          <div className="container-narrow">
            <span className="overline">FAQ</span>
            <h1 className="headline-xl" style={{ margin: '24px 0', letterSpacing: '-0.04em' }}>
              Everything you need <br />
              <span style={{ color: 'var(--accent)' }}>to decide.</span>
            </h1>
            <p className="text-sub" style={{ marginBottom: '40px' }}>
              Common questions about Generative Engine Optimization, AI search visibility, and how itappens.ai engineers citation signals.
            </p>
          </div>
        </header>

        <section className="section" style={{ padding: '0 0 120px' }}>
          <div className="container-narrow">
            {FAQS.map((section, si) => (
              <div key={si} style={{ marginBottom: '80px' }}>
                <h2 className="overline" style={{ 
                  color: 'var(--accent)', 
                  marginBottom: '32px', 
                  paddingBottom: '16px', 
                  borderBottom: '2px solid var(--accent-soft)',
                  width: 'fit-content'
                }}>
                  {section.category}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                  {section.items.map((item, i) => (
                    <div key={i} style={{ paddingBottom: '48px', borderBottom: '1px solid var(--border)' }}>
                      <h3 className="headline-sm" style={{ marginBottom: '16px', color: 'var(--text)' }}>
                        {item.q}
                      </h3>
                      <p style={{ fontSize: '16px', color: 'var(--text-dim)', lineHeight: 1.8 }}>{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* CTA */}
            <div style={{ 
              marginTop: '100px', 
              padding: '80px', 
              backgroundColor: 'var(--text)', 
              color: 'var(--surface)', 
              borderRadius: '32px', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px'
            }}>
              <span className="overline" style={{ color: 'var(--accent)' }}>Still have questions?</span>
              <h2 className="headline-lg" style={{ color: 'var(--surface)', margin: 0 }}>Start with a Free AI Audit.</h2>
              <p style={{ maxWidth: '600px', opacity: 0.8, fontSize: '17px', lineHeight: 1.6 }}>
                We'll run your brand through 50+ queries across ChatGPT, Perplexity, and Gemini to show you exactly where you stand.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '16px' }}>
                <a href="/audit" className="btn-primary" style={{ padding: '18px 40px' }}>
                  Run Audit →
                </a>
                <a href="mailto:hello@itappens.ai" className="btn-secondary" style={{ padding: '18px 40px', color: 'var(--surface)', borderColor: 'rgba(255,255,255,0.2)' }}>
                  Email us
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
