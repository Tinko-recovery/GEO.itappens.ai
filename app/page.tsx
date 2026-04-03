"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [heroText, setHeroText] = useState("who to trust in your category");

  useEffect(() => {
    const lines = [
      "who to trust in your category",
      "which brand to recommend",
      "what product to buy",
      "which consultant to hire",
      "where to go in your city"
    ];
    let idx = 0;

    const interval = setInterval(() => {
      const el = document.getElementById('heroRotate');
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(8px)';
        setTimeout(() => {
          idx = (idx + 1) % lines.length;
          setHeroText(lines[idx]);
          el.style.transition = 'opacity 0.4s, transform 0.4s';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 300);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (e: any) => {
    const item = e.currentTarget.parentElement;
    item.classList.toggle('open');
  };

  const handleAuditRequest = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const website = formData.get('website');
    const competitor = formData.get('competitor');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website, competitor }),
      });
      if (res.ok) {
        alert("Request sent successfully! We will be in touch.");
        e.target.reset();
      } else {
        alert("Failed to send request. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting request.");
    }
  };

  return (
    <>
      <nav>
        <div className="container nav-inner">
          <a href="#" className="nav-logo">it<span>appens</span>.ai</a>
          <ul className="nav-links">
            <li><a href="#system">How It Works</a></li>
            <li><a href="#roadmap">Roadmap</a></li>
            <li><a href="#founder">Founder</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="/insights">Insights</a></li>
          </ul>
          <div className="nav-cta">
            <a href="#cta" className="btn btn-primary">Free AI Audit →</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <span className="dot"></span>
            India's AI Brand Visibility Practice — 2026
          </div>

          <h1>
            When your customer asks AI<br />
            <span className="hero-rotate" id="heroRotate" style={{ transition: 'opacity 0.4s, transform 0.4s' }}>{heroText}</span>
          </h1>

          <p className="hero-sub">
            Your competitors appear in ChatGPT, Perplexity & Gemini answers — not because they're better,
            but because their brand data is structured for AI. We fix that.
          </p>

          <div className="hero-actions">
            <a href="#cta" className="btn btn-primary btn-lg">Start Free AI Audit →</a>
          </div>

          <p className="hero-social-proof">
            <span className="stars">★★★★★</span>
            &nbsp;Founder-direct · No sales call · India-focused
          </p>
        </div>
      </section>

      <div className="ai-logos">
        <div className="container">
          <p className="ai-logos-label">We engineer your visibility across</p>
          <div className="ai-logos-track">
            <div className="ai-logo-item"><span className="icon">🤖</span> ChatGPT</div>
            <div className="ai-logo-item"><span className="icon">🔍</span> Perplexity</div>
            <div className="ai-logo-item"><span className="icon">✦</span> Gemini</div>
            <div className="ai-logo-item"><span className="icon">◆</span> Claude</div>
            <div className="ai-logo-item"><span className="icon">𝕏</span> Grok</div>
            <div className="ai-logo-item"><span className="icon">🪟</span> Copilot</div>
          </div>
        </div>
      </div>

      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">&lt;200</div>
              <div className="stat-label">Indian brands<br />GEO-ready today</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">90d</div>
              <div className="stat-label">To first verified<br />AI citations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5×</div>
              <div className="stat-label">Growth in AI search<br />vs traditional search</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">8–12w</div>
              <div className="stat-label">Typical time to<br />first AI citations</div>
            </div>
          </div>
        </div>
      </section>

      <section className="pillars" id="system">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The 4-Pillar System</span>
            <h2>How your brand becomes<br />the default AI answer</h2>
            <p>Traditional SEO ranks you on Google. GEO gets you named by AI. These are two completely different games — and we play the new one.</p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-num">Pillar 01</div>
              <div className="pillar-icon">🧬</div>
              <h3>Semantic Identity Seeding</h3>
              <p>AI models don't find you by keyword — they recognise you as a known entity. We build the structured knowledge definition that makes AI models say your brand's name with confidence when answering questions in your category.</p>
              <span className="pillar-outcome">→ Your brand becomes a named entity, not just text</span>
            </div>

            <div className="pillar-card">
              <div className="pillar-num">Pillar 02</div>
              <div className="pillar-icon">⚡</div>
              <h3>Information Gain Content</h3>
              <p>AI models cite sources that provide unique, data-dense information — not generic blog posts. We engineer 12–18 high-value content pieces specifically designed to be extracted and quoted by AI reasoning engines.</p>
              <span className="pillar-outcome">→ Most clients achieve citations within 8–12 weeks</span>
            </div>

            <div className="pillar-card">
              <div className="pillar-num">Pillar 03</div>
              <div className="pillar-icon">🏗️</div>
              <h3>Machine-Readable Infrastructure</h3>
              <p>Deep JSON-LD Schema (Organisation, Service, FAQ, LocalBusiness) that gives AI crawlers like PerplexityBot the mathematical proof they need to trust and cite your brand. Without this, you're invisible to AI.</p>
              <span className="pillar-outcome">→ Full schema coverage on deployment</span>
            </div>

            <div className="pillar-card">
              <div className="pillar-num">Pillar 04</div>
              <div className="pillar-icon">📈</div>
              <h3>AI Citation Auditing</h3>
              <p>We run 200+ targeted prompts across ChatGPT, Perplexity, Gemini and Claude every two weeks to measure your brand's citation frequency. When AI model updates affect your visibility, we know within days.</p>
              <span className="pillar-outcome">→ Bi-weekly AI presence delta reports</span>
            </div>
          </div>
        </div>
      </section>

      <section className="roadmap" id="roadmap">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The 6-Phase Journey</span>
            <h2>From invisible to default answer.</h2>
            <p>A 90-day compounding roadmap. Each phase builds on the last — turning your brand from an unknown entity into the name AI models consistently recommend.</p>
          </div>

          <div className="phases-grid">
            <div className="phase-card">
              <div className="phase-number">1</div>
              <div className="phase-timing">Week 1–2</div>
              <h3>AI Presence Audit</h3>
              <p>200+ targeted prompts across ChatGPT, Perplexity, Gemini and Claude establish your baseline citation rate and competitor gap map.</p>
              <div className="phase-tags">
                <span className="phase-tag">Citation Report</span>
                <span className="phase-tag">Competitor Gap Map</span>
              </div>
            </div>

            <div className="phase-card">
              <div className="phase-number">2</div>
              <div className="phase-timing">Week 2–4</div>
              <h3>Entity Architecture</h3>
              <p>We design your semantic entity — the structured definition AI models use when reasoning about your brand in your category.</p>
              <div className="phase-tags">
                <span className="phase-tag">Brand Entity Doc</span>
                <span className="phase-tag">Knowledge Blueprint</span>
              </div>
            </div>

            <div className="phase-card">
              <div className="phase-number">3</div>
              <div className="phase-timing">Week 4–8</div>
              <h3>Content Sprint</h3>
              <p>12–18 high-information-gain content pieces engineered with data-dense, AI-extractable paragraphs. Precision GEO assets — not generic blog posts.</p>
              <div className="phase-tags">
                <span className="phase-tag">18 GEO Assets</span>
                <span className="phase-tag">Liftability Score</span>
              </div>
            </div>

            <div className="phase-card">
              <div className="phase-number">4</div>
              <div className="phase-timing">Week 6–10</div>
              <h3>Schema & Technical Layer</h3>
              <p>Full JSON-LD deployment. AI crawlers like PerplexityBot and OAI-SearchBot consume these directly to corroborate your content claims.</p>
              <div className="phase-tags">
                <span className="phase-tag">Full Schema Coverage</span>
                <span className="phase-tag">Data Validation</span>
              </div>
            </div>

            <div className="phase-card">
              <div className="phase-number">5</div>
              <div className="phase-timing">Week 8+</div>
              <h3>Citation Amplification</h3>
              <p>15+ authoritative third-party references — directories, press, industry databases — corroborating your entity claims across multiple sources.</p>
              <div className="phase-tags">
                <span className="phase-tag">15+ Entity References</span>
                <span className="phase-tag">Authority Map</span>
              </div>
            </div>

            <div className="phase-card">
              <div className="phase-number">6</div>
              <div className="phase-timing">Monthly · Ongoing</div>
              <h3>GEO Intelligence Layer</h3>
              <p>Monthly citation dashboards, quarterly entity refreshes, and real-time alerts when AI model updates affect your citation posture.</p>
              <div className="phase-tags">
                <span className="phase-tag">Monthly GEO Report</span>
                <span className="phase-tag">Entity Refresh</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="founder" id="founder">
        <div className="container">
          <div className="founder-inner">
            <div className="founder-content">
              <span className="section-tag" style={{ display: "inline-block", marginBottom: "1rem" }}>The Founder</span>
              <h2>Built on myself first.<br />Then built for you.</h2>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: 520 }}>
                I am Sadish Sugumaran — a digital strategist who got tired of watching Indian brands
                disappear from AI answers while their competitors got named. So I built the system that fixes it,
                starting with itappens.ai itself as the proof of concept.
              </p>
              <ul className="founder-bullets">
                <li>Founder-direct engagement — no junior teams, no templates</li>
                <li>Live proof: itappens.ai ranks in GEO for our own target queries</li>
                <li>India-first strategy — built for Indian brands, Indian cities, Indian buyers</li>
                <li>Small client roster per quarter — deep work, not volume</li>
              </ul>
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a
                  href="https://www.linkedin.com/company/itappens-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0077b5", color: "#fff", padding: "10px 18px", borderRadius: 8, fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Connect on LinkedIn
                </a>
                <a
                  href="mailto:sadish@itappens.ai"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "var(--text)", padding: "10px 18px", borderRadius: 8, fontWeight: 600, fontSize: "0.875rem", textDecoration: "none", border: "1.5px solid var(--border)" }}
                >
                  sadish@itappens.ai
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq" id="faq">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Common Questions</span>
            <h2>Everything you need to decide.</h2>
          </div>

          <div className="faq-list">
            <div className="faq-item open">
              <button className="faq-q" onClick={toggleFaq}>
                What exactly is Generative Engine Optimisation (GEO)?
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-a">GEO is the practice of structuring your brand's data, content, and technical infrastructure so that AI models (ChatGPT, Perplexity, Gemini, Claude) cite your brand when answering questions in your category. It's to AI what SEO was to Google — except the rules are completely different.</div>
            </div>

            <div className="faq-item">
              <button className="faq-q" onClick={toggleFaq}>
                How does itappens.ai get my brand cited in AI responses?
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-a">We work across four layers: your brand's semantic entity definition, high-information-gain content that AI models extract from, JSON-LD schema that AI crawlers consume, and a third-party citation network that corroborates your entity claims. All four layers compound together over 90 days.</div>
            </div>

            <div className="faq-item">
              <button className="faq-q" onClick={toggleFaq}>
                How long before I start appearing in AI responses?
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-a">Most clients see their first verifiable AI citations within 8–12 weeks of starting the engagement. We measure this with 200+ targeted prompts run bi-weekly so you can see the progress in concrete numbers, not vague claims.</div>
            </div>

            <div className="faq-item">
              <button className="faq-q" onClick={toggleFaq}>
                What is the ROI compared to traditional SEO or paid ads?
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-a">Traditional SEO takes 6–12 months for competitive keywords and resets with every algorithm update. Paid ads stop when you stop paying. GEO citations are entity-based — they compound over time and grow more authoritative as AI models learn from more data. The window is also unusually open right now: fewer than 200 Indian brands are GEO-optimised today.</div>
            </div>

            <div className="faq-item">
              <button className="faq-q" onClick={toggleFaq}>
                Do you work with all types of businesses?
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-a">We're India-focused and work best with service businesses, consultants, agencies, and product brands that have a specific category they want to own. We keep a small client roster per quarter — max 2 clients per niche per geography — so we can go deep, not wide.</div>
            </div>

            <div className="faq-item">
              <button className="faq-q" onClick={toggleFaq}>
                How do I get started?
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-a">Start with a Free AI Audit. We run your brand through 50+ targeted queries across ChatGPT, Perplexity, Gemini and Claude. You'll see exactly where you're cited, where you're invisible, and which competitor is taking your traffic. No sales call, no credit card. Just the data.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section" id="cta">
        <div className="container">
          <h2>See where your brand stands.<br />Free AI Audit.</h2>
          <p>We'll run your brand through 50+ queries across ChatGPT, Perplexity, Gemini and Claude. You'll see exactly where you're invisible — and which competitor is taking your spot.</p>

          <form className="cta-form" onSubmit={handleAuditRequest}>
            <input type="email" name="email" className="cta-input" placeholder="Corporate email address" required />
            <input type="url" name="website" className="cta-input" placeholder="Your website URL" required />
            <input type="url" name="competitor" className="cta-input" placeholder="Primary competitor URL" required />
            <button type="submit" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>Request AI Audit →</button>
            <p className="cta-guarantee">sadish@itappens.ai reviews every request personally. No spam.</p>
          </form>
        </div>
      </section>

      <footer>
        <div className="container footer-inner">
          <div className="footer-logo">it<span>appens</span>.ai</div>
          <div className="footer-links">
            <a href="/insights">Insights</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="https://www.linkedin.com/company/itappens-ai/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:sadish@itappens.ai">sadish@itappens.ai</a>
          </div>
          <div className="footer-copy">© 2026 Blocks & Loops Technologies Pvt Ltd · Bengaluru, India</div>
        </div>
      </footer>

      {/* WhatsApp Float — replace XXXXXXXXXX with your actual number */}
      <a
        href="https://wa.me/919353015844?text=Hi%20Sadish%2C%20I%20want%20a%20free%20AI%20audit%20for%20my%20brand."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          width: 56,
          height: 56,
          background: "#25d366",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,0.45)",
          zIndex: 999,
          textDecoration: "none",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}
