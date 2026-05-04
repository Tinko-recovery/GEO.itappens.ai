import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { howItWorksSteps } from "@/lib/content/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { howToSchema, schemaGraph, serviceSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "How the GEO system works",
  description:
    "The /how-it-works page explains the seven-step itappens.ai execution system from baseline audit through weekly iteration.",
  path: "/how-it-works",
  keywords: ["how GEO works", "AEO implementation", "Technical Signals rollout"],
});

const howItWorksSchema = schemaGraph(
  serviceSchema({
    name: "GEO implementation workflow",
    description:
      "A seven-step execution system covering audit, entity normalization, technical signals, answer clusters, and citation tracking.",
    path: "/how-it-works",
  }),
  howToSchema({
    name: "How itappens.ai deploys GEO",
    description: "Seven steps from the baseline audit to the weekly iteration loop.",
    path: "/how-it-works",
    steps: howItWorksSteps,
  }),
);

export default function HowItWorksPage() {
  return (
    <div className="page-shell">
      <JsonLd data={howItWorksSchema} />
      <NavBar />
      <main>
        <header className="section" style={{ padding: '160px 0 100px', backgroundColor: 'var(--bg)' }}>
          <div className="container grid-2col">
            <div>
              <span className="overline">/how-it-works</span>
              <h1 className="headline-xl" style={{ margin: '24px 0', letterSpacing: '-0.04em' }}>
                The execution system behind the itappens.ai <span style={{ color: 'var(--accent)' }}>program.</span>
              </h1>
              <p className="text-sub" style={{ marginBottom: '40px' }}>
                This page turns our four-pillar methodology into an explicit operating flow so the delivery model is transparent for buyers and machine-readable for AI agents.
              </p>
            </div>
            <div className="card-bento" style={{ padding: '40px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="overline">Execution Principle</span>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--text-dim)' }}>
                Technical Signals are completed first because they create the semantic "permission" for every later page, schema block, and answer cluster to be interpreted correctly by LLMs.
              </p>
            </div>
          </div>
        </header>

        <section className="section" style={{ padding: '120px 0', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <span className="overline">The 7-Step Loop</span>
              <h2 className="headline-lg" style={{ marginTop: '16px' }}>From Baseline <span style={{ color: 'var(--accent)' }}>to Default Answer.</span></h2>
            </div>
            <div className="timeline" style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '800px', margin: '0 auto' }}>
              {howItWorksSteps.map((step, index) => (
                <div key={step.name} style={{ display: 'flex', gap: '32px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--accent-soft)', 
                    color: 'var(--accent)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 800,
                    flexShrink: 0,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{step.name}</h3>
                    <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text-dim)' }}>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ padding: '120px 0', backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
          <div className="container grid-2col">
            <article className="card-bento" style={{ padding: '48px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px' }}>
              <span className="overline" style={{ marginBottom: '24px' }}>Ownership Map</span>
              <ul className="check-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.5 }}><strong>Technical Co-founder:</strong> Owns canonicals, schema, llms.txt, and semantic HTML.</li>
                <li style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.5 }}><strong>Category Owner:</strong> Owns claims, offer language, and proof review.</li>
                <li style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.5 }}><strong>Content Team:</strong> Converts query gaps into weekly answer pages.</li>
                <li style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.5 }}><strong>Operations:</strong> Maintains the weekly citation tracking log.</li>
              </ul>
            </article>
            <article className="card-bento" style={{ padding: '48px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px' }}>
              <span className="overline" style={{ marginBottom: '24px' }}>Release Rhythm</span>
              <ul className="check-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.5 }}><strong>Week 1:</strong> Build and ship Technical Signals and canonical set.</li>
                <li style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.5 }}><strong>Weeks 2-12:</strong> Publish one deep query cluster per week.</li>
                <li style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.5 }}><strong>Every Week:</strong> Record citation movement and adjust strategy.</li>
                <li style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.5 }}><strong>Every Month:</strong> Review entity consistency across external nodes.</li>
              </ul>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

