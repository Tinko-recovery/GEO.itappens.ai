import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { siteConfig } from "@/lib/content/site";
import { organizationSchema, personSchema, schemaGraph } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "About Sadish Sugumaran | Founder of itappens.ai",
  description: "Learn about the philosophy and background of Sadish Sugumaran, the founder of itappens.ai and a dedicated GEO consultant.",
};

const aboutSchema = schemaGraph(
  organizationSchema(),
  personSchema({
    name: "Sadish Sugumaran",
    jobTitle: "Founder & GEO Consultant",
    description: "Founder of itappens.ai and dedicated GEO consultant, helping global B2B SaaS brands become the primary cited source in ChatGPT, Perplexity, and Gemini.",
    sameAs: ["https://www.linkedin.com/in/sadishsugumaran/"], // Placeholder LinkedIn
  })
);

export default function AboutPage() {
  return (
    <div className="page-shell">
      <JsonLd data={aboutSchema} />
      <NavBar />
      
      <main>
        <header className="section" style={{ padding: '160px 0 100px', backgroundColor: 'var(--bg)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <span className="overline" style={{ color: 'var(--brand-blue)', backgroundColor: 'rgba(58, 190, 249, 0.08)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
              The Founder
            </span>
            <h1 className="headline-xl" style={{ margin: '32px 0', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
              Sadish Sugumaran
            </h1>
            <p className="text-sub" style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '40px' }}>
              Founder, itappens.ai | GEO Consultant
            </p>
            
            <div className="card-glass" style={{ padding: '48px', borderLeft: '4px solid var(--brand-blue)' }}>
              <h2 className="headline-md" style={{ marginBottom: '24px', fontWeight: 800 }}>Philosophy</h2>
              <p style={{ fontSize: '22px', lineHeight: 1.5, fontStyle: 'italic', color: 'var(--text)', marginBottom: '32px' }}>
                "GEO is not rebranded SEO. It's a new discipline built for how AI models retrieve and cite information."
              </p>
            </div>
          </div>
        </header>

        <section className="section" style={{ padding: '100px 0', borderTop: '1px solid var(--border)', background: 'var(--surface-alt)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <h2 className="headline-md" style={{ marginBottom: '40px' }}>The Approach</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--text-dim)', fontSize: '18px', lineHeight: 1.8 }}>
              <p>
                Sadish founded itappens.ai with a single conviction: the next decade of brand discovery will be won not by ranking, but by <strong>being cited</strong>. As generative AI models become the primary interface for research and buying decisions, the brands that engineer their information for machine retrieval will dominate their categories.
              </p>
              <p>
                His work sits at the intersection of technical infrastructure and content strategy. Every engagement at itappens.ai is built around "Citation Engineering"—a systematic process of structuring brand data so that LLMs like ChatGPT, Perplexity, and Gemini can accurately retrieve, verify, and cite it.
              </p>
              <p>
                itappens.ai serves B2B SaaS founders and growth teams across the US, UK, Australia, and India who need to move beyond traditional SEO and establish durable AI visibility before their category becomes saturated.
              </p>
            </div>

            <div style={{ marginTop: '64px' }}>
              <a href="https://www.linkedin.com/in/sadishsugumaran/" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '16px 32px', borderRadius: '12px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
