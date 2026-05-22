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
      title: "Answers Hub | Intelligence | itappens.ai",
      description: "Data-driven answer pages for B2B SaaS GEO topics.",
      path: "/answers",
    });
  }

  return buildMetadata({
    title: page.title,
    description: page.description,
    path: `/answers/${page.slug}`,
    keywords: [page.query, "AEO", "GEO", "B2B SaaS"],
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
    .map((s) => answerPages.find((entry) => entry.slug === s))
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

  const currentIndex = answerPages.findIndex(p => p.slug === slug);
  const nextPost = currentIndex < answerPages.length - 1 ? answerPages[currentIndex + 1] : null;
  const prevPost = currentIndex > 0 ? answerPages[currentIndex - 1] : null;

  return (
    <div className="page-shell">
      <JsonLd data={pageSchema} />
      <NavBar />
      <main>
        <header className="dark-section" style={{ padding: '180px 0 100px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(circle at 20% 50%, rgba(0, 194, 255, 0.1) 0%, transparent 50%)`,
            zIndex: 0
          }} />
          <div className="container grid-2col" style={{ gap: '100px', alignItems: 'center', position: 'relative', zIndex: 10 }}>
            <div>
              <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--cyan)' }}>
                {page.query}
              </span>
              <h1 className="headline-xl" style={{ margin: '32px 0' }}>{page.title}</h1>
              <p className="text-large" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px' }}>{page.intro}</p>
              
              <div className="card-corporate" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>Direct Answer</span>
                <p style={{ fontSize: '20px', fontWeight: 600, color: 'white', lineHeight: 1.5 }}>{page.answerSummary}</p>
              </div>
            </div>
            <div className="card-corporate" style={{ padding: '48px', backgroundColor: '#fff' }}>
              <span className="badge-pill" style={{ marginBottom: '24px' }}>Key Takeaways</span>
              <ul className="check-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {page.keyTakeaways.map((item, i) => (
                  <li key={i} style={{ fontSize: '15px', color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--blue)' }} />
                     {item}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '40px' }}>
                <a className="btn-blue" href="/audit" style={{ fontSize: '13px', textAlign: 'center' }}>Run Audit</a>
                <a className="btn-ghost" href="/answers" style={{ fontSize: '13px', textAlign: 'center' }}>All Answers</a>
              </div>
            </div>
          </div>
        </header>

        <section style={{ padding: '120px 0', backgroundColor: '#fff' }}>
          <div className="container-narrow">
            <article style={{ color: 'var(--navy)', lineHeight: 1.8 }}>
              {page.sections.map((section, sIdx) => (
                <section key={section.heading} style={{ marginBottom: '80px' }}>
                  <h2 className="headline-md" style={{ marginBottom: '32px', fontWeight: 800 }}>{section.heading}</h2>
                  {section.paragraphs.map((paragraph, pIdx) => (
                    <p key={pIdx} style={{ fontSize: '18px', color: 'var(--slate)', marginBottom: '28px' }}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </article>
          </div>
        </section>

        <section style={{ padding: '120px 0', backgroundColor: 'var(--light-bg)', borderTop: '1px solid var(--border)' }}>
          <div className="container grid-2col" style={{ gap: '80px' }}>
            <div>
              <span className="badge-pill" style={{ marginBottom: '32px' }}>Related Inquiries</span>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {page.faq.map((item) => (
                  <li key={item.question} style={{ padding: '32px 0', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '16px' }}>{item.question}</h3>
                    <p style={{ color: 'var(--slate)', fontSize: '16px', lineHeight: 1.7 }}>{item.answer}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-corporate" style={{ padding: '48px', height: 'fit-content', backgroundColor: '#fff' }}>
              <span className="badge-pill" style={{ marginBottom: '32px' }}>Related Answers</span>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {relatedPages.map((item) => (
                  <li key={item.slug}>
                    <a href={`/answers/${item.slug}`} style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 600, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--blue)' }} />
                      {item.query}
                    </a>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '14px', color: 'var(--slate)', marginBottom: '40px', lineHeight: 1.7 }}>
                This page is part of our query-led knowledge graph, designed to reinforce retrieval and citation accuracy across LLM platforms.
              </p>
              <a className="btn-blue" href="/answers" style={{ width: '100%', textAlign: 'center' }}>
                Back to Knowledge Hub
              </a>
            </div>
          </div>
        </section>

        {/* Pagination Navigation */}
        <section style={{ padding: '60px 0 120px', backgroundColor: 'var(--light-bg)' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '40px' }}>
                    {prevPost ? (
                        <a href={`/answers/${prevPost.slug}`} className="card-bento" style={{ display: 'flex', flexDirection: 'column', gap: '8px', textDecoration: 'none' }}>
                            <span style={{ fontSize: '13px', color: 'var(--slate)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Previous Answer</span>
                            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.4 }}>{prevPost.query}</span>
                        </a>
                    ) : <div />}
                    
                    {nextPost ? (
                        <a href={`/answers/${nextPost.slug}`} className="card-bento" style={{ display: 'flex', flexDirection: 'column', gap: '8px', textDecoration: 'none', textAlign: 'right' }}>
                            <span style={{ fontSize: '13px', color: 'var(--slate)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Answer</span>
                            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.4 }}>{nextPost.query}</span>
                        </a>
                    ) : <div />}
                </div>
            </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}



