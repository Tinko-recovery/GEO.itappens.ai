import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { answerPages } from "@/lib/content/answers";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Intelligence Hub | GEO & AEO Answer Assets",
  description:
    "The /answers hub groups the high-intent query pages that support itappens.ai visibility across major AI engines.",
  path: "/answers",
  keywords: ["AEO answers", "GEO answers", "AI visibility questions"],
});

export default function AnswersHubPage() {
  return (
    <div className="page-shell">
      <NavBar />
      <main>
        <header className="section dark-section">
          <div className="container-narrow">
            <span className="badge-pill" style={{ marginBottom: '24px' }}>
              Knowledge Graph / answers
            </span>
            <h1 className="headline-xl" style={{ margin: '24px 0 40px' }}>
              Query clusters built for <br />
              <span style={{ color: 'var(--cyan)' }}>AI Retrieval.</span>
            </h1>
            <p className="text-sub" style={{ maxWidth: '720px' }}>
              The answers hub contains exact-match pages for commercial, informational, and implementation prompts that matter
              to AEO and GEO demand generation.
            </p>
          </div>
        </header>

        <section className="section" style={{ backgroundColor: 'var(--light-bg)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              {answerPages.map((page) => (
                <article key={page.slug} className="card-bento" style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}>
                  <div>
                    <span className="overline">Target Query: {page.query}</span>
                    <h2 className="headline-md" style={{ marginTop: '12px' }}>
                      <a href={`/answers/${page.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {page.title}
                      </a>
                    </h2>
                  </div>
                  <p className="text-sub" style={{ fontSize: '15px' }}>{page.answerSummary}</p>
                  <ul style={{ marginTop: 'auto', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0 }}>
                    {page.keyTakeaways.slice(0, 2).map((item) => (
                      <li key={item} style={{ fontSize: '14px', color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--blue)', flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a className="btn-secondary" href={`/answers/${page.slug}`} style={{ width: '100%' }}>
                    View full answer
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}


