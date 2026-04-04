import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Generative Engine Optimization | itappens.ai",
  description: "Answers to the most common questions about GEO, AI search visibility, and how itappens.ai engineers Indian brands into ChatGPT, Perplexity, and Gemini answers.",
  alternates: { canonical: "https://itappens.ai/faq" },
  openGraph: {
    title: "FAQ — itappens.ai GEO Agency",
    description: "Everything you need to know about Generative Engine Optimization for Indian brands.",
    url: "https://itappens.ai/faq",
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
      "acceptedAnswer": { "@type": "Answer", "text": "GEO is the practice of structuring your brand's data, content, and technical infrastructure so that AI models — ChatGPT, Perplexity, Gemini, Claude — cite your brand when answering questions in your category. It's to AI what SEO was to Google, except the signals are completely different: entity consistency, information gain, and cross-source corroboration rather than backlinks and keyword density." }
    },
    {
      "@type": "Question",
      "name": "How long before my brand starts appearing in AI responses?",
      "acceptedAnswer": { "@type": "Answer", "text": "Most clients see their first verifiable AI citations within 8–12 weeks of starting. We measure this with 200+ targeted prompts run bi-weekly across ChatGPT, Perplexity, Gemini and Claude so you see progress in concrete numbers." }
    },
    {
      "@type": "Question",
      "name": "How does GEO differ from traditional SEO?",
      "acceptedAnswer": { "@type": "Answer", "text": "SEO targets keywords and ranks web pages. GEO builds entity authority — making your brand a recognised, trusted entity that AI reasoning engines cite. The signals are completely different: entity consistency, knowledge graph integration, and LLM citations rather than backlinks and keyword density." }
    },
    {
      "@type": "Question",
      "name": "What types of businesses does itappens.ai work with?",
      "acceptedAnswer": { "@type": "Answer", "text": "We work best with service businesses, consultants, agencies, and B2B product brands that have a specific category they want to own in AI responses. We keep a small client roster per quarter — max 2 clients per niche per geography — so we go deep, not wide." }
    },
    {
      "@type": "Question",
      "name": "What does a Free AI Audit include?",
      "acceptedAnswer": { "@type": "Answer", "text": "The Free AI Audit runs 50+ targeted prompts across ChatGPT, Perplexity, Gemini and Claude to establish your current citation rate and competitor gap. You receive a report showing where your brand is cited, where it's invisible, and which competitors are appearing in your place. No credit card, no sales call." }
    },
    {
      "@type": "Question",
      "name": "How does GEO pricing work?",
      "acceptedAnswer": { "@type": "Answer", "text": "itappens.ai offers three plans: GEO Starter (₹4,999/mo), GEO Pro (₹9,999/mo), and GEO Authority (₹19,999/mo). All plans are monthly with no lock-in. The difference is the depth of the 4-pillar system applied — content volume, citation network size, and reporting frequency." }
    },
  ]
};

const FAQS = [
  {
    category: "Understanding GEO",
    items: [
      {
        q: "What is Generative Engine Optimization (GEO)?",
        a: "GEO is the practice of structuring your brand's data, content, and technical infrastructure so that AI models — ChatGPT, Perplexity, Gemini, Claude — cite your brand when answering questions in your category. It's to AI what SEO was to Google, except the signals are completely different: entity consistency, information gain, and cross-source corroboration rather than backlinks and keyword density.",
      },
      {
        q: "Why is GEO different from traditional SEO?",
        a: "SEO targets keywords and ranks web pages. GEO builds entity authority — making your brand a recognised, trusted entity that AI reasoning engines cite. Traditional SEO takes 6–12 months and resets with every algorithm update. GEO citations compound over time and grow more authoritative as AI models train on more data.",
      },
      {
        q: "Which AI models does GEO affect?",
        a: "Our methodology targets the six primary AI models where brand citations occur: ChatGPT (OpenAI), Perplexity, Gemini (Google), Claude (Anthropic), Grok (xAI), and Microsoft Copilot. We run audits across all six platforms bi-weekly.",
      },
      {
        q: "Is GEO relevant for Indian businesses specifically?",
        a: "Yes — and urgently so. Fewer than 200 Indian brands are GEO-optimised today. The window to establish AI citation authority in your category before competitors do is open right now in 2026, but it's closing fast as awareness spreads. India-specific entity signals, directories, and content formats require a different approach than Western GEO methodologies.",
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
        a: "Most clients see their first verifiable AI citations within 8–12 weeks of starting engagement. We measure this with 200+ targeted prompts run bi-weekly so you see progress in concrete numbers — not vague claims about 'improving visibility'.",
      },
      {
        q: "What is the 4-Pillar Framework?",
        a: "The 4-Pillar Framework is our core methodology: (1) Entity Correction — building the structured knowledge definition AI models use to identify your brand; (2) Information-Gain Content — engineering 40–60 word 'golden snippets' that AI systems verbatim-lift; (3) Neural-Link Building — 15+ authoritative third-party corroborating sources; (4) Citation Tracking — bi-weekly 200+ prompt audits across all AI platforms.",
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
        a: "We offer three monthly plans: GEO Starter (₹4,999/mo) for establishing your AI entity and first citations; GEO Pro (₹9,999/mo) for the full 4-pillar system; GEO Authority (₹19,999/mo) for category dominance. All plans are monthly with no lock-in contracts.",
      },
      {
        q: "How many clients do you take on per quarter?",
        a: "We maintain a small client roster — a maximum of 2 clients per niche per geography per quarter. This is deliberate: deep, effective GEO work is incompatible with high-volume agency models. We go deep, not wide.",
      },
      {
        q: "What is the ROI compared to paid ads?",
        a: "Paid ads stop the moment you stop paying. GEO citations are entity-based — they compound over time and grow more authoritative as AI models train on more data. The investment in entity authority pays dividends across every AI model update, whereas paid traffic requires continuous spend to maintain.",
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)" }}>

        {/* Nav */}
        <nav style={{ borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "rgba(249,250,251,0.95)", backdropFilter: "blur(12px)", zIndex: 100 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 24 }}>
            <a href="/" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--text)", textDecoration: "none" }}>
              it<span style={{ color: "var(--accent)" }}>appens</span>.ai
            </a>
            <a href="/" style={{ fontSize: 13, color: "var(--text-dim)", textDecoration: "none" }}>← Back to home</a>
            <a href="/insights" style={{ fontSize: 13, color: "var(--text-dim)", textDecoration: "none" }}>Insights</a>
            <a href="/blog" style={{ fontSize: 13, color: "var(--text-dim)", textDecoration: "none" }}>Blog</a>
            <div style={{ flex: 1 }} />
            <a href="/#audit" style={{ background: "var(--accent)", color: "#fff", padding: "9px 20px", borderRadius: 6, fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
              Free AI Audit →
            </a>
          </div>
        </nav>

        {/* Header */}
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 48px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 16 }}>FAQ</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.05em", marginBottom: 16, lineHeight: 1.1 }}>
            Everything you need to decide.
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-dim)", lineHeight: 1.75 }}>
            Common questions about GEO, AI search visibility, and how itappens.ai works.
          </p>
        </div>

        {/* FAQ Sections */}
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 80px" }}>
          {FAQS.map((section, si) => (
            <div key={si} style={{ marginBottom: 56 }}>
              <h2 style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24, paddingBottom: 12, borderBottom: "2px solid var(--accent)" }}>
                {section.category}
              </h2>
              {section.items.map((item, i) => (
                <div key={i} style={{ borderBottom: "1px solid var(--border)", padding: "24px 0" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text)", marginBottom: 12, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                    {item.q}
                  </h3>
                  <p style={{ fontSize: 15, color: "var(--text-dim)", lineHeight: 1.8 }}>{item.a}</p>
                </div>
              ))}
            </div>
          ))}

          {/* CTA */}
          <div style={{ padding: "40px", background: "var(--accent-muted)", border: "1px solid var(--border-accent)", borderRadius: 8, textAlign: "center" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text)", marginBottom: 12, letterSpacing: "-0.03em" }}>
              Still have questions?
            </h3>
            <p style={{ fontSize: 15, color: "var(--text-dim)", marginBottom: 24, lineHeight: 1.7 }}>
              Start with a Free AI Audit — we'll run your brand through 50+ queries and show you exactly where you stand.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/#audit" style={{ background: "var(--accent)", color: "#fff", padding: "12px 24px", borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                Request Free AI Audit →
              </a>
              <a href="mailto:hello@itappens.ai" style={{ background: "transparent", color: "var(--text)", padding: "12px 24px", borderRadius: 6, fontWeight: 500, fontSize: 14, textDecoration: "none", border: "1px solid var(--border)" }}>
                hello@itappens.ai
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--text)" }}>it<span style={{ color: "var(--accent)" }}>appens</span>.ai</span>
            <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
              <a href="/insights" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Insights</a>
              <a href="/blog" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Blog</a>
              <a href="/privacy" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Privacy</a>
              <a href="mailto:hello@itappens.ai" style={{ color: "var(--text-dim)", textDecoration: "none" }}>hello@itappens.ai</a>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>© 2026 Blocks & Loops Technologies Pvt Ltd</span>
          </div>
        </footer>
      </div>
    </>
  );
}
