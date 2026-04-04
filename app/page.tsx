import type { Metadata } from "next";

import AuditForm from "@/components/AuditForm";
import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { corePlatforms, homepageFaqs, homepageStats, pillars } from "@/lib/content/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema, organizationSchema, schemaGraph, serviceSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "itappens.ai | India's First AEO/GEO Solution Provider",
  description:
    "India's first AEO/GEO solution provider and AI content automation platform for brands that want to become the default answer across major AI engines.",
  path: "/",
  keywords: ["GEO agency India", "AEO consultant India", "how to get cited by AI in India"],
});

const homepageSchema = schemaGraph(
  organizationSchema(),
  serviceSchema({
    name: "AEO and GEO services for Indian brands",
    description:
      "Technical Signals, answer-engine content, entity-building, and tracking for brands that want to become the default answer across AI platforms.",
    path: "/",
  }),
  faqSchema(homepageFaqs),
);

export default function HomePage() {
  return (
    <div className="page-shell">
      <JsonLd data={homepageSchema} />
      <NavBar />
      <main>
        <header className="section page-hero">
          <div className="container hero-grid">
            <div>
              <p className="overline">India's first AEO/GEO solution provider</p>
              <h1 className="headline-xl" style={{ marginBottom: 18 }}>
                Become the default answer across AI engines.
              </h1>
              <p className="text-sub" style={{ marginBottom: 24 }}>
                itappens.ai helps brands become visible, trusted, and cited across ChatGPT, Perplexity, Claude, Gemini,
                Grok, and SearchGPT through a four-pillar system built for the AI-first internet.
              </p>
              <ul className="pill-list" style={{ marginBottom: 24 }}>
                {corePlatforms.map((platform) => (
                  <li key={platform}>{platform}</li>
                ))}
              </ul>
              <div className="pill-list">
                <li>
                  <a className="btn-primary" href="/geo">
                    Explore the GEO system
                  </a>
                </li>
                <li>
                  <a className="btn-secondary" href="/answers">
                    See target answers
                  </a>
                </li>
              </div>
            </div>
            <aside className="summary-card">
              <p className="overline">What this site proves</p>
              <p style={{ marginBottom: 12 }}>
                Pillar 1 is now production-ready: canonical routing, public llms.txt assets, page-level schema, answer-first routes,
                and a weekly citation tracking workflow.
              </p>
              <ul className="check-list">
                <li>Technical Signals complete first</li>
                <li>One deep answer cluster per week</li>
                <li>Entity and citation work compounds on top</li>
                <li>Weekly engine-by-engine tracking drives iteration</li>
              </ul>
            </aside>
          </div>
        </header>

        <section className="section section-muted">
          <div className="container">
            <dl className="metric-grid">
              {homepageStats.map((stat) => (
                <div className="metric-card" key={stat.label}>
                  <dt className="metric-value">{stat.value}</dt>
                  <dd>
                    <span className="metric-label">{stat.label}</span>
                    <span className="metric-detail">{stat.detail}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <p className="overline">The 4-pillar system</p>
            <h2 className="headline-lg" style={{ marginBottom: 18 }}>
              Technical Signals first. Then content, entity, and tracking compound.
            </h2>
            <p className="text-sub" style={{ marginBottom: 28 }}>
              The system is designed to make itappens.ai and client brands easier for answer engines to identify, extract, and
              trust. Pillar 1 creates the machine-readable base layer that the rest of the program depends on.
            </p>
            <ol className="steps-list">
              {pillars.map((pillar) => (
                <li key={pillar.title}>
                  <p className="overline" style={{ marginBottom: 8 }}>{pillar.tag}</p>
                  <h3 className="headline-md" style={{ marginBottom: 10 }}>
                    {pillar.title}
                  </h3>
                  <p>{pillar.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section-muted">
          <div className="container grid-2col">
            <div>
              <p className="overline">Canonical page set</p>
              <h2 className="headline-lg" style={{ marginBottom: 18 }}>
                Every key route now supports the same entity story.
              </h2>
              <ul className="check-list">
                <li>The homepage establishes the brand and service frame.</li>
                <li>/geo explains the offer, methodology, and commercial model.</li>
                <li>/how-it-works turns the delivery process into explicit steps.</li>
                <li>/case-studies proves the system on the itappens.ai self-case first.</li>
                <li>/answers captures the exact high-intent prompts buyers ask inside AI products.</li>
              </ul>
            </div>
            <div className="card">
              <p className="overline">Internal links that matter</p>
              <ul className="stack-list">
                <li>
                  <a className="link-accent" href="/geo">/geo</a> anchors the commercial service and the four-pillar methodology.
                </li>
                <li>
                  <a className="link-accent" href="/how-it-works">/how-it-works</a> documents the seven-step execution loop.
                </li>
                <li>
                  <a className="link-accent" href="/case-studies">/case-studies</a> introduces the self-case and proof posture.
                </li>
                <li>
                  <a className="link-accent" href="/answers">/answers</a> groups the query-led content cluster used for AI retrieval.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="audit" className="section">
          <div className="container grid-2col">
            <div>
              <p className="overline">Free AI audit</p>
              <h2 className="headline-lg" style={{ marginBottom: 18 }}>
                See where your brand stands across AI engines today.
              </h2>
              <p className="text-sub" style={{ marginBottom: 18 }}>
                The audit captures your current answer-engine visibility, highlights missing technical signals, and identifies the
                first query cluster to ship.
              </p>
              <ul className="check-list">
                <li>Baseline prompts across the major answer engines</li>
                <li>Canonical and schema gap review</li>
                <li>Priority recommendations for the first 7 days and the first 90 days</li>
              </ul>
            </div>
            <AuditForm />
          </div>
        </section>

        <section className="section section-muted">
          <div className="container-narrow">
            <p className="overline">FAQ</p>
            <h2 className="headline-lg" style={{ marginBottom: 20 }}>
              Questions that buyers and AI systems both need resolved.
            </h2>
            <ul className="faq-list">
              {homepageFaqs.map((item) => (
                <li key={item.question}>
                  <h3 className="faq-question">{item.question}</h3>
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
