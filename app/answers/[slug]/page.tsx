import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { answerPages, getAnswerBySlug } from "@/lib/content/answers";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, faqSchema, schemaGraph } from "@/lib/seo/schema";

export function generateStaticParams() {
  return answerPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getAnswerBySlug(slug);

  if (!page) {
    return buildMetadata({
      title: "Answers hub",
      description: "High-intent answer pages for AEO and GEO topics.",
      path: "/answers",
    });
  }

  return buildMetadata({
    title: page.title,
    description: page.description,
    path: `/answers/${page.slug}`,
    keywords: [page.query, "AEO India", "GEO India"],
    type: "article",
  });
}

export default async function AnswerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getAnswerBySlug(slug);

  if (!page) {
    notFound();
  }

  const relatedPages = page.relatedSlugs
    .map((slug) => answerPages.find((entry) => entry.slug === slug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const pageSchema = schemaGraph(
    articleSchema({
      headline: page.title,
      description: page.description,
      path: `/answers/${page.slug}`,
      datePublished: page.publishedAt,
      dateModified: page.updatedAt,
    }),
    faqSchema(page.faq, `/answers/${page.slug}`),
  );

  return (
    <div className="page-shell">
      <JsonLd data={pageSchema} />
      <NavBar />
      <main>
        <header className="section" style={{ padding: '160px 0 100px', backgroundColor: 'var(--bg)', position: 'relative' }}>
          <div className="container grid-2col" style={{ gap: '100px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="overline" style={{ color: 'var(--brand-blue)', backgroundColor: 'rgba(58, 190, 249, 0.08)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
                {page.query}
              </span>
              <h1 className="headline-xl" style={{ margin: '32px 0', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{page.title}</h1>
              <p className="text-sub" style={{ marginBottom: '40px', fontSize: '18px', opacity: 0.8 }}>{page.intro}</p>
              
              <div className="card-glass" style={{ padding: '48px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: 'var(--brand-blue)' }} />
                <span className="overline" style={{ fontSize: '12px', color: 'var(--brand-blue)', marginBottom: '20px', display: 'block' }}>Direct Answer</span>
                <p style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', lineHeight: 1.5 }}>{page.answerSummary}</p>
              </div>
            </div>
            <div className="card-bento" style={{ padding: '56px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div>
                <span className="overline" style={{ marginBottom: '20px', color: 'var(--text)' }}>Key Takeaways</span>
                <ul className="check-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {page.keyTakeaways.map((item, i) => (
                    <li key={i} style={{ fontSize: '15px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--brand-green)' }} />
                       {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <a className="btn-secondary" href="/audit" style={{ fontSize: '13px', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>Run Audit</a>
                <a className="btn-secondary" href="/answers" style={{ fontSize: '13px', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>All Answers</a>
              </div>
            </div>
          </div>
        </header>

        <section className="section" style={{ padding: '120px 0', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
          <div className="container-narrow">
            <article className="article-body" style={{ color: 'var(--text)', lineHeight: 1.8 }}>
              {page.sections.map((section, sIdx) => (
                <section key={section.heading} style={{ marginBottom: '80px' }}>
                  <h2 className="headline-md" style={{ marginBottom: '32px', color: 'var(--text)', fontWeight: 800 }}>{section.heading}</h2>
                  {section.paragraphs.map((paragraph, pIdx) => (
                    <p key={pIdx} style={{ fontSize: '18px', color: 'var(--text-dim)', marginBottom: '28px', opacity: 0.9 }}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </article>
          </div>
        </section>

        <section className="section" style={{ padding: '120px 0', backgroundColor: 'var(--surface-alt)', borderTop: '1px solid var(--border)' }}>
          <div className="container grid-2col" style={{ gap: '80px' }}>
            <div>
              <span className="overline" style={{ marginBottom: '48px', color: 'var(--brand-yellow)', display: 'block' }}>Related Inquiries</span>
              <ul className="faq-list" style={{ listStyle: 'none' }}>
                {page.faq.map((item) => (
                  <li key={item.question} style={{ padding: '32px 0', borderBottom: '1px solid var(--border)' }}>
                    <h3 className="faq-question" style={{ fontSize: '19px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>{item.question}</h3>
                    <div className="faq-answer">
                      <p style={{ color: 'var(--text-dim)', fontSize: '16px', lineHeight: 1.7, opacity: 0.8 }}>{item.answer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-glass" style={{ padding: '56px', height: 'fit-content', position: 'relative' }}>
               <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--brand-blue)' }} />
              <span className="overline" style={{ marginBottom: '32px', color: 'var(--text)', display: 'block' }}>Related Answers</span>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {relatedPages.map((item) => (
                  <li key={item.slug}>
                    <a href={`/answers/${item.slug}`} style={{ color: 'var(--brand-blue)', textDecoration: 'none', fontWeight: 600, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--brand-blue)' }} />
                      {item.query}
                    </a>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '15px', color: 'var(--text-dim)', marginBottom: '40px', lineHeight: 1.7, opacity: 0.7 }}>
                This page is part of our query-led knowledge graph, designed to reinforce retrieval and citation accuracy across LLM platforms.
              </p>
              <a className="btn-primary" href="/answers" style={{ width: '100%', textAlign: 'center', padding: '16px', borderRadius: '12px' }}>
                Back to all answers hub
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

