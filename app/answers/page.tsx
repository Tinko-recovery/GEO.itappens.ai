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
        <header className="dark-section" style={{ padding: '180px 0 100px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(circle at 20% 50%, rgba(0, 194, 255, 0.1) 0%, transparent 50%)`,
            zIndex: 0
          }} />
          <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '900px' }}>
            <span className="badge-pill" style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.1)', color: 'var(--cyan)' }}>
              Knowledge Graph / answers
            </span>
            <h1 className="headline-xl" style={{ margin: '24px 0 40px' }}>
              Query clusters built for <br />
              <span style={{ color: 'var(--cyan)' }}>AI Retrieval.</span>
            </h1>
            <p className="text-large" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '720px' }}>
              The answers hub contains exact-match pages for commercial, informational, and implementation prompts that matter
              to AEO and GEO demand generation.
            </p>
          </div>
        </header>

        <section style={{ padding: '100px 0', backgroundColor: 'var(--light-bg)' }}>
          <div className="container">
            <div className="bento-grid">
              {answerPages.map((page) => (
                <article key={page.slug} className="card-corporate" style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase' }}>Target Query: {page.query}</span>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, marginTop: '12px', lineHeight: 1.3 }}>
                      <a href={`/answers/${page.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {page.title}
                      </a>
                    </h2>
                  </div>
                  <p style={{ color: 'var(--slate)', fontSize: '15px', lineHeight: 1.7 }}>{page.answerSummary}</p>
                  <ul className="check-list" style={{ marginTop: 'auto', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {page.keyTakeaways.slice(0, 2).map((item) => (
                      <li key={item} style={{ fontSize: '14px', color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--blue)' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a className="btn-ghost" href={`/answers/${page.slug}`} style={{ textAlign: 'center', width: '100%', padding: '14px', fontSize: '14px', border: '1px solid var(--border)' }}>
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


