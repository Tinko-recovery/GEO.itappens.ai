import type { Metadata } from "next";

import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { answerPages } from "@/lib/content/answers";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Answers hub",
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
        <header className="section" style={{ padding: '160px 0 100px', backgroundColor: 'var(--bg)', position: 'relative' }}>
          <div className="container grid-2col" style={{ gap: '100px', alignItems: 'center' }}>
            <div>
              <span className="overline" style={{ color: 'var(--brand-blue)', backgroundColor: 'rgba(58, 190, 249, 0.08)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
                /answers
              </span>
              <h1 className="headline-xl" style={{ margin: '32px 0', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
                Query clusters built for <br />
                <span style={{ 
                  background: 'linear-gradient(to right, var(--brand-blue), var(--brand-green))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>AI Retrieval.</span>
              </h1>
              <p className="text-sub" style={{ marginBottom: '40px', fontSize: '18px', opacity: 0.8 }}>
                The answers hub contains exact-match pages for commercial, informational, and implementation prompts that matter
                to AEO and GEO demand generation.
              </p>
            </div>
            <div className="card-glass" style={{ padding: '48px', position: 'relative' }}>
               <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(to right, var(--brand-blue), var(--brand-green))' }} />
              <span className="overline" style={{ color: 'var(--text)', marginBottom: '24px', display: 'block' }}>Hub Usage</span>
              <ul className="check-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  "Exact-match prompt titles and semantic intros.",
                  "Interlinked related pages for cluster authority.",
                  "Schema and page roles aligned to LLM retrieval."
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: '15px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--brand-blue)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        <section className="section" style={{ padding: '120px 0', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
              {answerPages.map((page) => (
                <article key={page.slug} className="card-glass" style={{ 
                  padding: '48px', 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                  <div>
                    <span className="overline" style={{ fontSize: '12px', color: 'var(--brand-blue)' }}>Target Query: {page.query}</span>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, marginTop: '12px', lineHeight: 1.3, color: 'var(--text)' }}>
                      <a href={`/answers/${page.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {page.title}
                      </a>
                    </h2>
                  </div>
                  <p style={{ color: 'var(--text-dim)', fontSize: '15px', lineHeight: 1.7, opacity: 0.8 }}>{page.answerSummary}</p>
                  <ul className="check-list" style={{ marginTop: 'auto', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {page.keyTakeaways.slice(0, 2).map((item) => (
                      <li key={item} style={{ fontSize: '14px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--brand-green)' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a className="btn-secondary" href={`/answers/${page.slug}`} style={{ textAlign: 'center', width: '100%', padding: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: 600 }}>
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

