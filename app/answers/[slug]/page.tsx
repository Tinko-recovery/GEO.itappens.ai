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

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getAnswerBySlug(params.slug);

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

export default function AnswerDetailPage({ params }: { params: { slug: string } }) {
  const page = getAnswerBySlug(params.slug);

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
    faqSchema(page.faq),
  );

  return (
    <div className="page-shell">
      <JsonLd data={pageSchema} />
      <NavBar />
      <main>
        <header className="section page-hero">
          <div className="container grid-2col">
            <div>
              <p className="overline">{page.query}</p>
              <h1 className="headline-xl" style={{ marginBottom: 18 }}>
                {page.title}
              </h1>
              <p className="text-sub" style={{ marginBottom: 18 }}>
                {page.intro}
              </p>
              <div className="answer-summary">
                <p className="overline">Direct answer</p>
                <p>{page.answerSummary}</p>
              </div>
            </div>
            <aside className="cta-panel">
              <p className="overline">Key takeaways</p>
              <ul className="check-list" style={{ marginBottom: 18 }}>
                {page.keyTakeaways.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="pill-list">
                <li>
                  <a className="btn-secondary" href="/geo">
                    /geo
                  </a>
                </li>
                <li>
                  <a className="btn-secondary" href="/how-it-works">
                    /how-it-works
                  </a>
                </li>
                <li>
                  <a className="btn-secondary" href="/case-studies">
                    /case-studies
                  </a>
                </li>
              </div>
            </aside>
          </div>
        </header>

        <section className="section">
          <article className="container-narrow article-body">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </article>
        </section>

        <section className="section section-muted">
          <div className="container grid-2col">
            <div>
              <p className="overline">Visible FAQ</p>
              <ul className="faq-list">
                {page.faq.map((item) => (
                  <li key={item.question}>
                    <h3 className="faq-question">{item.question}</h3>
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="card">
              <p className="overline">Related answers</p>
              <ul className="stack-list" style={{ marginBottom: 18 }}>
                {relatedPages.map((item) => (
                  <li key={item.slug}>
                    <a className="link-accent" href={`/answers/${item.slug}`}>
                      {item.query}
                    </a>
                  </li>
                ))}
              </ul>
              <p style={{ marginBottom: 12 }}>
                This page is part of the same internal cluster used to reinforce retrieval and citation signals.
              </p>
              <a className="btn-primary" href="/answers">
                Back to /answers
              </a>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
