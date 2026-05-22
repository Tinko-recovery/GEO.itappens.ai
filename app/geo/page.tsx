import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import GEOExplanation from "@/components/sections/GEOExplanation";
import { geoFaqs, geoPackages, howItWorksSteps, pillars } from "@/lib/content/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema, howToSchema, schemaGraph, serviceSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "GEO services and methodology",
  description:
    "The itappens.ai GEO page covers the four-pillar methodology, Technical Signals package, delivery model, and commercial structure.",
  path: "/geo",
  keywords: ["GEO services India", "AEO consultant India", "GEO methodology"],
});

const geoSchema = schemaGraph(
  serviceSchema({
    name: "Generative Engine Optimization and Answer Engine Optimization services",
    description:
      "A four-pillar system covering Technical Signals, content clusters, entity-building, and tracking for brands that want to become the default AI answer.",
    path: "/geo",
  }),
  faqSchema(geoFaqs, "/geo"),
  howToSchema({
    name: "How itappens.ai runs a 90-day GEO program",
    description: "A staged approach covering Technical Signals, content, entity reinforcement, and weekly iteration.",
    path: "/geo",
    steps: howItWorksSteps,
  }),
);

export default function GeoPage() {
  return (
    <div className="page-shell">
      <JsonLd data={geoSchema} />
      <NavBar />
      <main>
        <header className="section dark-section">
          <div className="container">
            <div style={{ maxWidth: '800px' }}>
              <span className="overline">/geo system</span>
              <h1 className="headline-xl">
                The four-pillar GEO system <br />
                <span style={{ color: 'var(--cyan)' }}>for the AI-First Internet.</span>
              </h1>
              <p className="text-sub" style={{ marginBottom: '40px' }}>
                itappens.ai combines Technical Signals, answer-engine content, entity-building, and tracking into one operating
                model for brands that want to become the default answer across major AI platforms.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <a className="btn-primary" href="/how-it-works">
                  See execution system
                </a>
                <a className="btn-secondary" href="/case-studies">
                  Review self-case
                </a>
              </div>
            </div>
          </div>
        </header>

        <section className="section" style={{ borderTop: '1px solid var(--border-light)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span className="overline">Commercial Posture</span>
              <h2 className="headline-lg">
                Outcome-based <span style={{ color: 'var(--blue)' }}>investment tiers.</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              {geoPackages.map((item) => (
                <article key={item.name} className="card-bento" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <span className="overline">{item.price}</span>
                    <h3 className="headline-md">{item.name}</h3>
                  </div>
                  <p className="text-sub" style={{ fontSize: '15px' }}>{item.description}</p>
                  <ul style={{ marginTop: 'auto', listStyle: 'none', padding: 0 }}>
                    {item.features.map((feature) => (
                      <li key={feature} style={{ padding: '8px 0', fontSize: '14px', color: 'var(--navy)' }}>• {feature}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <GEOExplanation />

        <section className="section" style={{ backgroundColor: '#fff', borderTop: '1px solid var(--border-light)' }}>
          <div className="container grid-2col">
            <div>
              <span className="overline">Expected Outcome</span>
              <h2 className="headline-lg">
                Higher citation share on <br />
                <span style={{ color: 'var(--blue)' }}>target high-intent prompts.</span>
              </h2>
              <p className="text-sub" style={{ marginTop: '24px' }}>
                The 90-day operating target is to move toward 70%+ citation share on selected query sets by aligning the
                technical layer, the answer layer, and the tracking loop.
              </p>
              <ul style={{ marginTop: '32px', listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '8px 0', fontSize: '15px' }}>✓ Define the query set before publishing</li>
                <li style={{ padding: '8px 0', fontSize: '15px' }}>✓ Match each page to a clear entity role</li>
                <li style={{ padding: '8px 0', fontSize: '15px' }}>✓ Weekly tracking drives immediate iteration</li>
              </ul>
            </div>
            <div className="card-bento">
              <span className="overline">The First 7 Days</span>
              <ol style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '32px', listStyle: 'none', padding: 0 }}>
                {howItWorksSteps.slice(0, 3).map((step, index) => (
                  <li key={step.name}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--navy)' }}>{index + 1}. {step.name}</h3>
                    <p style={{ color: 'var(--slate)', fontSize: '15px', lineHeight: 1.6 }}>{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="section" style={{ borderTop: '1px solid var(--border-light)' }}>
          <div className="container-narrow">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span className="overline">FAQ</span>
              <h2 className="headline-lg">
                The questions that shape <br />
                <span style={{ color: 'var(--blue)' }}>scope and delivery.</span>
              </h2>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {geoFaqs.map((faq) => (
                <li key={faq.question} style={{ padding: '24px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--navy)' }}>{faq.question}</h3>
                  <div className="faq-answer">
                    <p style={{ color: 'var(--slate)', fontSize: '16px', lineHeight: 1.6 }}>{faq.answer}</p>
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

