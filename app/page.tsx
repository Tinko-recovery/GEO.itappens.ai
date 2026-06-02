import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import SearchHeroSection from "@/components/sections/SearchHeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import SolutionSection from "@/components/sections/SolutionSection";
import ProofSection from "@/components/sections/ProofSection";
import PricingSection from "@/components/sections/PricingSection";
import GEOExplanation from "@/components/sections/GEOExplanation";
import { homepageFaqs } from "@/lib/content/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema, organizationSchema, schemaGraph, serviceSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "itappens.ai | Global GEO & AEO Consultancy for B2B SaaS",
  description:
    "itappens.ai is a dedicated GEO consultancy helping international B2B SaaS brands and startups get cited in ChatGPT, Perplexity, and Gemini.",
  path: "/",
  keywords: ["GEO agency for SaaS", "AEO consultant B2B", "LLM citation optimization"],
});

const homepageSchema = schemaGraph(
  organizationSchema(),
  serviceSchema({
    name: "GEO and AEO consultancy for B2B SaaS",
    description:
      "Technical Signals, answer-engine content hubs, entity-building, and citation tracking for global SaaS brands.",
    path: "/",
  }),
  faqSchema(homepageFaqs),
);

import { Suspense } from "react";

export default function HomePage() {
  return (
    <div className="page-shell">
      <JsonLd data={homepageSchema} />
      <Suspense fallback={<div className="h-20 bg-slate-900 animate-pulse" />}>
        <NavBar />
      </Suspense>
      
      <main>
        <SearchHeroSection />
        <ProblemSection />
        <SolutionSection />
        <ProofSection />
        <PricingSection />

        {/* FAQ Section */}
        <section className="section" style={{ backgroundColor: '#fff' }}>
          <div className="container-narrow">
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <span className="badge-pill" style={{ marginBottom: '24px' }}>Expertise</span>
              <h2 className="headline-lg">Frequently Asked Questions</h2>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {homepageFaqs.map((item) => (
                <li key={item.question} style={{ padding: '32px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--navy)' }}>{item.question}</h3>
                  <p style={{ color: 'var(--slate)', fontSize: '16px', lineHeight: 1.7 }}>{item.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Suspense fallback={<div className="h-40 bg-slate-900" />}>
        <SiteFooter />
      </Suspense>
    </div>
  );
}


