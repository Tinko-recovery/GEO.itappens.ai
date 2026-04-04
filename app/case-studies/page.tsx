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
        <header className="section page-hero">
          <div className="container grid-2col">
            <div>
              <p className="overline">/case-studies</p>
              <h1 className="headline-xl" style={{ marginBottom: 18 }}>
                Proof starts with the public self-case.
              </h1>
              <p className="text-sub" style={{ marginBottom: 18 }}>{selfCase.summary}</p>
            </div>
            <aside className="proof-note">
              <p className="overline">Evidence label</p>
              <p style={{ marginBottom: 12 }}>{selfCase.evidenceLabel}</p>
              <p>
                This page uses only the itappens.ai deployment itself. Client case studies are added later only when verified proof,
                permission, and supporting screenshots are ready.
              </p>
            </aside>
          </div>
        </header>

        <section className="section section-muted">
          <div className="container">
            <dl className="metric-grid">
              {selfCase.metrics.map((metric) => (
                <div className="metric-card" key={metric.label}>
                  <dt className="metric-value">{metric.value}</dt>
                  <dd>
                    <span className="metric-label">{metric.label}</span>
                    <span className="metric-detail">{metric.detail}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section">
          <article className="container-narrow article-body">
            <p className="overline">Self-case article</p>
            <h2 className="headline-lg">{selfCase.headline}</h2>
            {selfCase.sections.map((section) => (
              <section key={section.heading}>
                <h3 className="headline-md" style={{ marginBottom: 12 }}>
                  {section.heading}
                </h3>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </article>
        </section>

        <section className="section section-muted">
          <div className="container-narrow">
            <p className="overline">FAQ</p>
            <ul className="faq-list">
              {selfCase.faq.map((item) => (
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
