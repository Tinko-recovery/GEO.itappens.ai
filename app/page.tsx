"use client";

import { useState, useEffect } from "react";

/* ── Data ────────────────────────────────────────────── */
const PHRASES = [
  "who to trust in your category",
  "which brand to recommend",
  "what expert to hire",
  "which product to buy",
  "where to go in your city",
];

const AI_MODELS = ["ChatGPT", "Perplexity", "Gemini", "Claude", "Grok", "Copilot"];

const STATS = [
  { num: "<200", label: "Indian brands GEO-ready today" },
  { num: "90d", label: "To first verified AI citations" },
  { num: "5×", label: "AI search growth vs traditional" },
  { num: "62%", label: "Observed CTR drop on AI-answered queries*" },
];

const PILLARS = [
  {
    num: "01",
    title: "Entity Correction",
    body: "AI models recognise brands as named entities. We build the structured knowledge definition that makes ChatGPT and Perplexity confidently name your brand when answering questions in your category.",
    tag: "Entity Consistency",
  },
  {
    num: "02",
    title: "Information-Gain Content",
    body: "We engineer 12–18 content assets with 40–60 word 'golden snippets' — data-dense, AI-extractable paragraphs designed to be verbatim-lifted by LLM reasoning engines.",
    tag: "Knowledge Graph Integration",
  },
  {
    num: "03",
    title: "Neural-Link Building",
    body: "15+ authoritative third-party references — directories, press, industry databases — corroborating your entity claims. Cross-source validation is how AI models assign trust scores.",
    tag: "LLM Citations",
  },
  {
    num: "04",
    title: "Citation Tracking",
    body: "200+ targeted prompts across ChatGPT, Perplexity, Gemini and Claude every two weeks. Bi-weekly AI presence delta reports so you see progress in concrete numbers, not vague claims.",
    tag: "Synthesized Search",
  },
];

const PLANS = [
  {
    name: "GEO Starter",
    price: "₹4,999",
    period: "/mo",
    desc: "Establish your AI entity and get your first citations.",
    features: [
      "AI Presence Audit (50+ prompts)",
      "Entity Architecture Document",
      "6 Information-Gain Content Pieces",
      "Basic JSON-LD Schema",
      "Monthly Citation Report",
    ],
    cta: "Get Started",
    accent: false,
  },
  {
    name: "GEO Pro",
    price: "₹9,999",
    period: "/mo",
    desc: "Full 4-pillar system for brands serious about AI visibility.",
    features: [
      "AI Presence Audit (200+ prompts)",
      "Full Entity Architecture",
      "12 GEO Content Assets",
      "Deep JSON-LD Schema Suite",
      "Neural-Link Building (10+ refs)",
      "Bi-weekly Citation Reports",
    ],
    cta: "Get Started",
    accent: true,
  },
  {
    name: "GEO Authority",
    price: "₹19,999",
    period: "/mo",
    desc: "Category dominance. Own the AI answer in your niche.",
    features: [
      "Everything in Pro",
      "18 GEO Content Assets",
      "15+ Neural-Link References",
      "Competitor Citation Displacement",
      "Weekly Reports + Slack Access",
      "Quarterly Entity Refresh",
    ],
    cta: "Get Started",
    accent: false,
  },
];

const FAQS = [
  {
    q: "What exactly is Generative Engine Optimisation (GEO)?",
    a: "GEO is the practice of structuring your brand's data, content, and technical infrastructure so AI models — ChatGPT, Perplexity, Gemini, Claude — cite your brand when answering questions in your category. It's to AI what SEO was to Google, except the rules are completely different.",
  },
  {
    q: "How long before I start appearing in AI responses?",
    a: "Most clients see their first verifiable AI citations within 8–12 weeks of starting. We measure this with 200+ targeted prompts run bi-weekly so you see progress in concrete numbers.",
  },
  {
    q: "How does GEO differ from traditional SEO?",
    a: "SEO targets keywords and ranks pages. GEO builds entity authority — making your brand a recognised, trusted entity that AI reasoning engines cite. The signals are completely different: entity consistency, information gain, and cross-source corroboration rather than backlinks and keyword density.",
  },
  {
    q: "Do you work with all types of businesses?",
    a: "We work best with service businesses, consultants, agencies, and B2B brands with a specific category to own. We keep a small roster per quarter — max 2 clients per niche per geography — so we go deep, not wide.",
  },
  {
    q: "What is the ROI compared to paid ads?",
    a: "Paid ads stop when you stop paying. GEO citations are entity-based — they compound over time and grow more authoritative as AI models train on more data. The window is also unusually open right now: fewer than 200 Indian brands are GEO-optimised today.",
  },
];

/* ── Component ───────────────────────────────────────── */
export default function Page() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setPhraseIdx((i) => (i + 1) % PHRASES.length), 2800);
    return () => clearInterval(iv);
  }, []);

  const handleAudit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("loading");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          website: fd.get("website"),
          visibility: fd.get("visibility"),
        }),
      });
      setFormState(res.ok ? "success" : "error");
    } catch {
      setFormState("error");
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── NAV ──────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(249,250,251,0.9)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div className="container" style={{ height: 64, display: "flex", alignItems: "center", gap: 24 }}>
          <a href="/" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--text)", textDecoration: "none", flexShrink: 0 }}>
            it<span style={{ color: "var(--accent)" }}>appens</span>.ai
          </a>
          <div style={{ flex: 1 }} />
          {/* Desktop links */}
          <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="desktop-nav">
            {[
              { label: "Platform", href: "#platform" },
              { label: "Solutions", href: "#solutions" },
              { label: "Blog", href: "/blog" },
              { label: "Pricing", href: "#pricing" },
            ].map((l) => (
              <a key={l.label} href={l.href} style={{ fontSize: 14, color: "var(--text-dim)", textDecoration: "none", fontWeight: 500, transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}>
                {l.label}
              </a>
            ))}
          </div>
          <a href="#audit" className="btn-primary" style={{ fontSize: 13, padding: "9px 20px", marginLeft: 8 }}>
            Free AI Audit
          </a>
        </div>
      </nav>

      <main style={{ paddingTop: 64 }}>

        {/* ── HERO ───────────────────────────────────── */}
        <section id="hero" style={{ padding: "100px 0 80px", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
          {/* Subtle background accent */}
          <div style={{
            position: "absolute", top: -100, right: -100, width: 500, height: 500,
            borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 0,
          }} />
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 760 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, padding: "6px 14px", background: "var(--accent-muted)", borderRadius: 20 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase" }}>India's GEO Practice — 2026</span>
              </div>

              <h1 className="headline-xl" style={{ marginBottom: 16, letterSpacing: "-0.03em" }}>
                Get Your Brand<br />
                <span style={{ color: "var(--accent)" }}>Cited</span>, Not Just Searched.
              </h1>

              <p style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 8 }}>
                When your customer asks AI <strong style={{ color: "var(--text)", fontWeight: 600 }}>{PHRASES[phraseIdx]}</strong>
              </p>

              <p style={{ fontSize: 16, color: "var(--text-dim)", lineHeight: 1.75, marginBottom: 40, maxWidth: 560 }}>
                We engineer digital entities that AI models like Perplexity, Gemini, and SearchGPT trust and recommend — structuring your brand to be the default answer in your category.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 56 }}>
                <a href="#audit" className="btn-primary" style={{ padding: "13px 28px", fontSize: 15 }}>Start Free AI Audit →</a>
                <a href="#platform" className="btn-secondary" style={{ padding: "13px 28px", fontSize: 15 }}>See How It Works</a>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Visibility across</span>
                {AI_MODELS.map((m) => (
                  <span key={m} style={{ fontSize: 13, color: "var(--text-dim)", padding: "4px 12px", border: "1px solid var(--border)", borderRadius: 4, fontWeight: 500 }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ──────────────────────────────────── */}
        <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
              {STATS.map((s, i) => (
                <div key={i} style={{
                  padding: "40px 24px", textAlign: "center",
                  borderRight: i < 3 ? "1px solid var(--border)" : "none",
                }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "var(--accent)", lineHeight: 1, marginBottom: 8 }}>{s.num}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "10px 0 16px", textAlign: "right" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>* Based on itappens.ai client audits and internal search monitoring, Q1 2026. AI overview present queries.</span>
            </div>
          </div>
        </div>

        {/* ── SOLUTIONS — The Problem ─────────────────── */}
        <section id="solutions" style={{ padding: "100px 0", background: "var(--bg)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
              <div>
                <span className="overline">The Blind Spot</span>
                <h2 className="headline-lg" style={{ marginBottom: 20 }}>Traditional SEO<br />is losing the game.</h2>
                <p style={{ fontSize: 16, color: "var(--text-dim)", lineHeight: 1.8, marginBottom: 20 }}>
                  Across client audits and our own search monitoring in Q1 2026, informational queries in India show a <strong style={{ color: "var(--text)" }}>62% average decline in click-through rates</strong> when AI overviews are present. Users are getting answers directly from AI interfaces — without clicking any link.{" "}
                  <a href="/insights" style={{ color: "var(--accent)", textDecoration: "none", fontSize: 13 }}>See our GEO research →</a>
                </p>
                <p style={{ fontSize: 16, color: "var(--text-dim)", lineHeight: 1.8 }}>
                  The brands that appear in those AI answers aren't there by chance. They've been architecturally positioned with entity consistency, knowledge graph integration, and LLM citations.
                </p>
              </div>
              <div>
                <div className="card-bento" style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", padding: "20px 28px", borderBottom: "1px solid var(--border)", background: "var(--surface-alt)" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Old Game</span>
                    <span />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right" }}>New Game (GEO)</span>
                  </div>
                  {[
                    ["Rank on Google", "Get cited by AI"],
                    ["Target keywords", "Build entity authority"],
                    ["Buy backlinks", "Earn corroborating sources"],
                    ["Write for algorithms", "Engineer extractable content"],
                    ["Track rankings", "Track citation frequency"],
                  ].map(([old, neo], i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "14px 28px", borderBottom: i < 4 ? "1px solid var(--border)" : "none", gap: 12 }}>
                      <span style={{ fontSize: 14, color: "var(--text-muted)", textDecoration: "line-through" }}>{old}</span>
                      <span style={{ fontSize: 14, color: "var(--text-muted)" }}>→</span>
                      <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{neo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PLATFORM — 4-Pillar Framework ───────────── */}
        <section id="platform" style={{ padding: "100px 0", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span className="overline" style={{ display: "block", textAlign: "center" }}>The 4-Pillar Framework</span>
              <h2 className="headline-lg" style={{ marginBottom: 16 }}>How your brand becomes<br />the default AI answer.</h2>
              <p className="text-sub" style={{ margin: "0 auto", textAlign: "center" }}>
                Traditional SEO ranks you on Google. GEO gets you named by AI. These are two completely different games — and we play the new one.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
              {PILLARS.map((p, i) => (
                <div key={i} className="card-bento">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em" }}>PILLAR {p.num}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", padding: "3px 8px", border: "1px solid var(--border)", borderRadius: 20, letterSpacing: "0.05em" }}>{p.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 12, letterSpacing: "-0.02em" }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.8 }}>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ROADMAP ────────────────────────────────── */}
        <section id="roadmap" style={{ padding: "100px 0", background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <div className="container">
            <div style={{ maxWidth: 640, marginBottom: 64 }}>
              <span className="overline">The 6-Phase Journey</span>
              <h2 className="headline-lg" style={{ marginBottom: 16 }}>From invisible to<br />default answer.</h2>
              <p style={{ fontSize: 16, color: "var(--text-dim)", lineHeight: 1.75 }}>
                A 90-day compounding roadmap. Each phase builds on the last — turning your brand from unknown entity into the name AI models consistently recommend.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[
                { num: "01", timing: "Week 1–2", title: "AI Presence Audit", body: "200+ prompts across ChatGPT, Perplexity, Gemini and Claude establish your baseline citation rate and competitor gap map.", tags: ["Citation Report", "Gap Map"] },
                { num: "02", timing: "Week 2–4", title: "Entity Architecture", body: "We design your semantic entity — the structured definition AI models use when reasoning about your brand in your category.", tags: ["Brand Entity Doc", "Knowledge Blueprint"] },
                { num: "03", timing: "Week 4–8", title: "Content Sprint", body: "12–18 information-gain content pieces with data-dense, AI-extractable golden snippets. Precision GEO assets — not generic blog posts.", tags: ["18 GEO Assets", "Liftability Score"] },
                { num: "04", timing: "Week 6–10", title: "Schema & Technical Layer", body: "Full JSON-LD deployment (Organization, Service, FAQ, LocalBusiness). AI crawlers consume these directly to corroborate your claims.", tags: ["Full Schema Coverage", "Validation"] },
                { num: "05", timing: "Week 8+", title: "Neural-Link Building", body: "15+ authoritative third-party references — directories, press, industry databases — corroborating your entity claims across sources.", tags: ["15+ Entity Refs", "Authority Map"] },
                { num: "06", timing: "Monthly · Ongoing", title: "Citation Intelligence", body: "Monthly citation dashboards, quarterly entity refreshes, and real-time alerts when AI model updates affect your citation posture.", tags: ["Monthly Report", "Entity Refresh"] },
              ].map((ph, i) => (
                <div key={i} className="card-bento" style={{ padding: "28px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, color: "rgba(99,102,241,0.15)", lineHeight: 1 }}>{ph.num}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.05em" }}>{ph.timing}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 10, letterSpacing: "-0.02em" }}>{ph.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.75, marginBottom: 16 }}>{ph.body}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {ph.tags.map((t) => (
                      <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", padding: "3px 8px", border: "1px solid var(--border-accent)", borderRadius: 20, background: "var(--accent-muted)" }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ────────────────────────────────── */}
        <section id="pricing" style={{ padding: "100px 0", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span className="overline" style={{ display: "block", textAlign: "center" }}>Pricing</span>
              <h2 className="headline-lg" style={{ marginBottom: 16 }}>Simple, transparent plans.</h2>
              <p className="text-sub" style={{ margin: "0 auto", textAlign: "center" }}>All plans include principal-led delivery. No junior teams.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, alignItems: "start" }}>
              {PLANS.map((plan, i) => (
                <div key={i} style={{
                  padding: 32, borderRadius: 8, border: plan.accent ? "2px solid var(--accent)" : "1px solid var(--border)",
                  background: plan.accent ? "var(--accent-muted)" : "var(--bg)",
                  position: "relative",
                }}>
                  {plan.accent && (
                    <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 20 }}>Most Popular</div>
                  )}
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, color: "var(--text)" }}>{plan.price}</span>
                    <span style={{ fontSize: 14, color: "var(--text-dim)" }}>{plan.period}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 24, lineHeight: 1.6 }}>{plan.desc}</p>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5 }}>
                        <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#audit" className={plan.accent ? "btn-primary" : "btn-secondary"} style={{ display: "block", textAlign: "center", padding: "12px 24px" }}>
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY ITAPPENS ────────────────────────────── */}
        <section id="why" style={{ padding: "100px 0", background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", maxWidth: 1000 }}>
              <div>
                <span className="overline">Why itappens.ai</span>
                <h2 className="headline-lg" style={{ marginBottom: 20 }}>We don't sell GEO.<br />We run it.</h2>
                <p style={{ fontSize: 16, color: "var(--text-dim)", lineHeight: 1.8, marginBottom: 16 }}>
                  itappens.ai was built on a single thesis: most Indian brands are structurally invisible to AI models — not because they lack quality, but because their data is not architected for how LLMs reason.
                </p>
                <p style={{ fontSize: 16, color: "var(--text-dim)", lineHeight: 1.8, marginBottom: 32 }}>
                  We practice what we preach. We applied our own 4-pillar methodology to itappens.ai before offering it to any client. Try it yourself: ask Perplexity <em>"GEO agency India 2026"</em> or ask ChatGPT <em>"how to get cited by AI in India"</em> — itappens.ai appears in the results. The methodology works because we validated it on ourselves first.
                </p>
                <a href="mailto:hello@itappens.ai" className="btn-primary" style={{ fontSize: 13, padding: "12px 24px" }}>
                  Talk to the team →
                </a>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: "◈", title: "Principal-led delivery", body: "Every engagement is run by a senior practitioner. No handoffs to junior teams or generic templates." },
                  { icon: "⬡", title: "India-first methodology", body: "Built for Indian brands, Indian cities, Indian buyers. The entity signals, directories, and content formats are calibrated for the Indian context." },
                  { icon: "◉", title: "Proof before promises", body: "We run the same 200+ prompt audit on your brand before quoting. You see the gap before you pay anything." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, padding: "20px 24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}>
                    <span style={{ color: "var(--accent)", fontSize: 18, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 6 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7 }}>{item.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────── */}
        <section id="faq" style={{ padding: "100px 0", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <div style={{ marginBottom: 56 }}>
              <span className="overline">FAQ</span>
              <h2 className="headline-lg">Everything you need<br />to decide.</h2>
            </div>
            <div>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
                    width: "100%", padding: "22px 0", background: "none", border: "none",
                    color: "var(--text)", fontFamily: "var(--font-display)", fontSize: 17,
                    fontWeight: 600, textAlign: "left", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
                    letterSpacing: "-0.02em",
                  }}>
                    {faq.q}
                    <span style={{ color: "var(--accent)", flexShrink: 0, fontSize: 20, transition: "transform 0.2s", transform: faqOpen === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {faqOpen === i && (
                    <div style={{ paddingBottom: 22, fontSize: 15, color: "var(--text-dim)", lineHeight: 1.8 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AUDIT FORM ─────────────────────────────── */}
        <section id="audit" style={{ padding: "100px 0", background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <div className="container" style={{ maxWidth: 640 }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="overline" style={{ display: "block", textAlign: "center" }}>Free AI Audit</span>
              <h2 className="headline-lg" style={{ marginBottom: 16 }}>See where your brand<br />stands in AI today.</h2>
              <p style={{ fontSize: 16, color: "var(--text-dim)", lineHeight: 1.75 }}>
                We run 50+ queries across ChatGPT, Perplexity, Gemini and Claude. You'll see exactly where you're invisible — and which competitor is taking your spot.
              </p>
            </div>

            {formState === "success" ? (
              <div style={{ padding: "56px 40px", textAlign: "center", border: "2px solid var(--border-accent)", borderRadius: 8, background: "var(--accent-muted)" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Request received.</h3>
                <p style={{ fontSize: 15, color: "var(--text-dim)", lineHeight: 1.8 }}>
                  hello@itappens.ai will be in touch within 24 hours. No spam, no sales call.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAudit} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "40px 36px",
                display: "flex", flexDirection: "column", gap: 16,
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { name: "name", label: "Your Name", type: "text", placeholder: "Priya Sharma", required: false },
                    { name: "email", label: "Business Email *", type: "email", placeholder: "you@company.com", required: true },
                  ].map((f) => (
                    <div key={f.name}>
                      <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>{f.label}</label>
                      <input name={f.name} type={f.type} required={f.required} placeholder={f.placeholder} style={{
                        width: "100%", padding: "11px 14px",
                        border: "1px solid var(--border)", borderRadius: 6,
                        background: "var(--bg)", color: "var(--text)",
                        fontSize: 14, fontFamily: "var(--font-body)", outline: "none",
                      }} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Website URL *</label>
                  <input name="website" type="url" required placeholder="https://yourcompany.com" style={{
                    width: "100%", padding: "11px 14px",
                    border: "1px solid var(--border)", borderRadius: 6,
                    background: "var(--bg)", color: "var(--text)",
                    fontSize: 14, fontFamily: "var(--font-body)", outline: "none",
                  }} />
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Current AI Visibility</label>
                  <select name="visibility" style={{
                    width: "100%", padding: "11px 14px",
                    border: "1px solid var(--border)", borderRadius: 6,
                    background: "var(--bg)", color: "var(--text-dim)",
                    fontSize: 14, fontFamily: "var(--font-body)", outline: "none", cursor: "pointer",
                  }}>
                    <option value="">Where does your brand stand with AI today?</option>
                    <option value="never">My brand is never cited by AI</option>
                    <option value="rarely">Occasionally cited, but not consistently</option>
                    <option value="competitor">My competitor appears, not me</option>
                    <option value="unknown">No idea — that's why I'm here</option>
                  </select>
                </div>
                <button type="submit" disabled={formState === "loading"} className="btn-primary" style={{ padding: "14px 28px", fontSize: 15, opacity: formState === "loading" ? 0.7 : 1 }}>
                  {formState === "loading" ? "Sending..." : "Request Free AI Audit →"}
                </button>
                {formState === "error" && (
                  <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center" }}>Something went wrong. Email hello@itappens.ai directly.</p>
                )}
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textAlign: "center", letterSpacing: "0.03em" }}>
                  Principal reviews every request · No spam · No sales call
                </p>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer style={{ padding: "64px 0 40px", borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, marginBottom: 16, color: "var(--text)" }}>
                it<span style={{ color: "var(--accent)" }}>appens</span>.ai
              </div>
              <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7, maxWidth: 240 }}>
                The Citation Layer for the AI Web. Specialized GEO for Indian B2B brands.
              </p>
            </div>
            <div>
              <h4 className="overline">Platform</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[["How It Works", "#platform"], ["Roadmap", "#roadmap"], ["Pricing", "#pricing"]].map(([l, h]) => (
                  <li key={l}><a href={h} style={{ fontSize: 13, color: "var(--text-dim)", textDecoration: "none" }}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="overline">Resources</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[["Insights", "/insights"], ["Blog", "/blog"], ["FAQ", "/faq"], ["Privacy Policy", "/privacy"]].map(([l, h]) => (
                  <li key={l}><a href={h} style={{ fontSize: 13, color: "var(--text-dim)", textDecoration: "none" }}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="overline">Contact</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                <li><a href="mailto:hello@itappens.ai" style={{ fontSize: 13, color: "var(--text-dim)", textDecoration: "none" }}>hello@itappens.ai</a></li>
                <li><a href="https://wa.me/919353015844" style={{ fontSize: 13, color: "var(--text-dim)", textDecoration: "none" }}>+91 93530 15844</a></li>
                <li><a href="https://www.linkedin.com/company/itappens-ai/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "var(--text-dim)", textDecoration: "none" }}>LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div style={{ paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>© 2026 Blocks & Loops Technologies Pvt Ltd · Bengaluru, India</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>A product of itappens.ai</span>
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP FLOAT ─────────────────────────── */}
      <a href="https://wa.me/919353015844?text=Hi%2C%20I%20want%20a%20free%20AI%20audit%20for%20my%20brand."
        target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
        style={{
          position: "fixed", bottom: 28, right: 28, width: 52, height: 52,
          background: "#25d366", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,0.35)", zIndex: 999, textDecoration: "none",
        }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
