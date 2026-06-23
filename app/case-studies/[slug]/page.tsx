import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { caseStudies } from "@/lib/content/caseStudies";
import { articleSchema, faqSchema, schemaGraph } from "@/lib/seo/schema";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const study = caseStudies.find((cs) => cs.slug === slug);
  if (!study) return {};
  return {
    title: `${study.headline} | itappens.ai`,
    description: study.summary,
    alternates: { canonical: `https://www.itappens.ai/case-studies/${study.slug}` },
  };
}

export default async function CaseStudyDetailPage(props: Props) {
  const { slug } = await props.params;
  const study = caseStudies.find((cs) => cs.slug === slug);

  if (!study) {
    notFound();
  }

  const detailSchema = schemaGraph(
    articleSchema({
      headline: study.headline,
      description: study.summary,
      path: `/case-studies/${study.slug}`,
      datePublished: study.publishedAt,
      dateModified: study.updatedAt,
    }),
    faqSchema(study.faq, `/case-studies/${study.slug}`)
  );

  return (
    <div className="page-shell">
      <JsonLd data={detailSchema} />
      <NavBar />

      <main>
        {/* Header */}
        <header className="section" style={{ padding: "160px 0 100px", backgroundColor: "var(--bg)" }}>
          <div className="container grid-2col">
            <div>
              <Link href="/case-studies" style={{ 
                fontSize: "14px", 
                fontWeight: 700, 
                color: "var(--blue)", 
                textDecoration: "none",
                display: "inline-block",
                marginBottom: "24px"
              }}>
                ← Back to Case Studies
              </Link>
              <span className="overline" style={{ display: "block", marginBottom: "16px" }}>{study.evidenceLabel}</span>
              <h1 className="headline-xl" style={{ margin: "16px 0 24px 0", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
                {study.headline}
              </h1>
              <p className="text-sub" style={{ marginBottom: 0 }}>{study.summary}</p>
            </div>
            <div className="card-bento" style={{ 
              padding: "40px", 
              display: "flex", 
              flexDirection: "column", 
              gap: "16px",
              justifyContent: "center"
            }}>
              <span className="overline">Proof Grounding</span>
              <p style={{ fontSize: "15px", lineHeight: 1.6, color: "var(--text-dim)", fontWeight: 500, margin: 0 }}>
                This data has been corroborated across major conversational AI models and local search signals.
              </p>
            </div>
          </div>
        </header>

        {/* Metrics Grid */}
        <section className="section" style={{ padding: "80px 0", borderTop: "1px solid var(--brand-border)", backgroundColor: "var(--light-bg)" }}>
          <div className="container">
            <dl className="metric-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {study.metrics.map((metric) => (
                <div key={metric.label} className="card-bento" style={{ 
                  padding: "40px", 
                  textAlign: "center" 
                }}>
                  <dt style={{ fontSize: "40px", fontWeight: 800, color: "var(--blue)", marginBottom: "8px", letterSpacing: "-0.04em" }}>
                    {metric.value}
                  </dt>
                  <dd style={{ display: "flex", flexDirection: "column", gap: "4px", margin: 0 }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {metric.label}
                    </span>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      {metric.detail}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Study Content Sections */}
        <section className="section" style={{ padding: "120px 0", backgroundColor: "#fff", borderTop: "1px solid var(--brand-border)" }}>
          <div className="container-narrow">
            <article className="article-body" style={{ color: "var(--text)", lineHeight: 1.8 }}>
              {study.sections.map((section) => (
                <section key={section.heading} style={{ marginBottom: "60px" }}>
                  <h3 className="headline-md" style={{ marginBottom: "24px", color: "var(--navy)" }}>
                    {section.heading}
                  </h3>
                  {section.paragraphs.map((paragraph, pIdx) => (
                    <p key={pIdx} style={{ fontSize: "17px", color: "var(--text-dim)", marginBottom: "24px" }}>
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </article>
          </div>
        </section>

        {/* Study FAQ List */}
        <section className="section" style={{ padding: "120px 0", borderTop: "1px solid var(--brand-border)", backgroundColor: "var(--light-bg)" }}>
          <div className="container-narrow">
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <span className="overline">Case FAQ</span>
              <h2 className="headline-lg" style={{ marginTop: "16px" }}>Technical details and <br /><span style={{ color: "var(--blue)" }}>attribution methodology.</span></h2>
            </div>
            <ul className="faq-list" style={{ listStyle: "none", padding: 0 }}>
              {study.faq.map((item) => (
                <li key={item.question} style={{ padding: "24px 0", borderBottom: "1px solid var(--brand-border)" }}>
                  <h3 className="faq-question" style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px", color: "var(--navy)" }}>
                    {item.question}
                  </h3>
                  <p style={{ color: "var(--text-dim)", fontSize: "16px", lineHeight: 1.6, margin: 0 }}>
                    {item.answer}
                  </p>
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
