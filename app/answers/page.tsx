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
        <header className="section page-hero">
          <div className="container grid-2col">
            <div>
              <p className="overline">/answers</p>
              <h1 className="headline-xl" style={{ marginBottom: 18 }}>
                Query pages built for the prompts buyers ask inside AI products.
              </h1>
              <p className="text-sub">
                The answers hub contains exact-match pages for commercial, informational, and implementation prompts that matter
                to AEO and GEO demand generation. Each page links back to the core service, methodology, and proof routes.
              </p>
            </div>
            <aside className="cta-panel">
              <p className="overline">How to use the hub</p>
              <ul className="check-list">
                <li>Use exact-match titles and intros for the target prompts.</li>
                <li>Interlink related pages so the query cluster behaves like a system.</li>
                <li>Keep schema, summaries, and page roles aligned to the visible content.</li>
              </ul>
            </aside>
          </div>
        </header>

        <section className="section">
          <div className="container grid-3col">
            {answerPages.map((page) => (
              <article className="card" key={page.slug}>
                <p className="overline">{page.query}</p>
                <h2 className="headline-md" style={{ marginBottom: 12 }}>
                  <a className="link-accent" href={`/answers/${page.slug}`}>
                    {page.title}
                  </a>
                </h2>
                <p style={{ marginBottom: 16 }}>{page.answerSummary}</p>
                <ul className="check-list" style={{ marginBottom: 16 }}>
                  {page.keyTakeaways.slice(0, 2).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a className="btn-secondary" href={`/answers/${page.slug}`}>
                  Read answer
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
