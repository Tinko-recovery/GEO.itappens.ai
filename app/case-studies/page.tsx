import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { caseStudies } from "@/lib/content/caseStudies";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, faqSchema, schemaGraph } from "@/lib/seo/schema";

const selfCase = caseStudies[0];

export const metadata: Metadata = buildMetadata({
  title: "Case studies and proof",
  description:
    "The /case-studies page launches with the itappens.ai self-case and a proof posture designed for future client case studies.",
  path: "/case-studies",
  keywords: ["GEO case study", "AEO proof", "AI citation case study"],
  type: "article",
});

const caseStudiesSchema = schemaGraph(
  articleSchema({
    headline: selfCase.headline,
    description: selfCase.summary,
    path: "/case-studies",
    datePublished: selfCase.publishedAt,
    dateModified: selfCase.updatedAt,
  }),
  faqSchema(selfCase.faq),
);

export default function CaseStudiesPage() {
  return (
    <div className="page-shell">
      <JsonLd data={caseStudiesSchema} />
      <NavBar />
      <main>
        <header className="section" style={{ padding: '160px 0 100px', backgroundColor: 'var(--bg)' }}>
          <div className="container grid-2col">
            <div>
              <span className="overline">/case-studies</span>
              <h1 className="headline-xl" style={{ margin: '24px 0', letterSpacing: '-0.04em' }}>
                Proof starts with the <br />
                <span style={{ color: 'var(--accent)' }}>itappens.ai self-case.</span>
              </h1>
              <p className="text-sub" style={{ marginBottom: '40px' }}>{selfCase.summary}</p>
            </div>
            <div className="card-bento" style={{ padding: '40px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="overline">Evidence Label</span>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--text-dim)', fontWeight: 500 }}>{selfCase.evidenceLabel}</p>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                This page uses the itappens.ai deployment itself as live proof. Client case studies are added only when permission and verified data are ready.
              </p>
            </div>
          </div>
        </header>

        <section className="section" style={{ padding: '120px 0', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <dl className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {selfCase.metrics.map((metric) => (
                <div key={metric.label} className="card-bento" style={{ padding: '40px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', textAlign: 'center' }}>
                  <dt style={{ fontSize: '40px', fontWeight: 800, color: 'var(--accent)', marginBottom: '8px', letterSpacing: '-0.04em' }}>{metric.value}</dt>
                  <dd style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{metric.label}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{metric.detail}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section" style={{ padding: '120px 0', backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
          <div className="container-narrow">
            <article className="article-body" style={{ color: 'var(--text)', lineHeight: 1.8 }}>
              <span className="overline" style={{ marginBottom: '24px' }}>Self-Case Analysis</span>
              <h2 className="headline-lg" style={{ marginBottom: '48px' }}>{selfCase.headline}</h2>
              {selfCase.sections.map((section) => (
                <section key={section.heading} style={{ marginBottom: '60px' }}>
                  <h3 className="headline-md" style={{ marginBottom: '24px', color: 'var(--text)' }}>
                    {section.heading}
                  </h3>
                  {section.paragraphs.map((paragraph, pIdx) => (
                    <p key={pIdx} style={{ fontSize: '17px', color: 'var(--text-dim)', marginBottom: '24px' }}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </article>
          </div>
        </section>

        <section className="section" style={{ padding: '120px 0', borderTop: '1px solid var(--border)' }}>
          <div className="container-narrow">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span className="overline">Case FAQ</span>
              <h2 className="headline-lg" style={{ marginTop: '16px' }}>Technical clarity on <br /><span style={{ color: 'var(--accent)' }}>the evidence data.</span></h2>
            </div>
            <ul className="faq-list">
              {selfCase.faq.map((item) => (
                <li key={item.question} style={{ padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
                  <h3 className="faq-question" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>{item.question}</h3>
                  <div className="faq-answer">
                    <p style={{ color: 'var(--text-dim)', fontSize: '16px', lineHeight: 1.6 }}>{item.answer}</p>
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

