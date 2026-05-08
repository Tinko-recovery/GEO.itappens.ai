import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import SolutionSection from "@/components/sections/SolutionSection";
import ProofSection from "@/components/sections/ProofSection";
import PricingSection from "@/components/sections/PricingSection";
import AuditForm from "@/components/AuditForm";
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
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <ProofSection />
        <PricingSection />

        {/* Integrated Audit Section */}
        <section id="audit" className="dark-section" style={{ padding: '120px 0' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
            <div>
              <span className="badge-pill" style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.1)', color: 'var(--cyan)' }}>
                Free Intelligence Audit
              </span>
              <h2 className="headline-lg">
                See where your brand stands <br />
                <span style={{ color: 'var(--cyan)' }}>across AI engines today.</span>
              </h2>
              <p className="text-large" style={{ color: 'rgba(255,255,255,0.7)', marginTop: '24px' }}>
                Our proprietary snapshot captures your current answer-engine visibility, highlights entity drift, and identifies the exact query clusters you need to own.
              </p>
              <ul style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none', padding: 0 }}>
                {[
                  "Baseline prompts across ChatGPT & Perplexity",
                  "Entity schema and canonical gap report",
                  "Priority roadmap for the first 90 days"
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-corporate" style={{ padding: '48px', color: 'var(--slate-dark)' }}>
              <AuditForm />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{ padding: '120px 0', backgroundColor: '#fff' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <span className="badge-pill" style={{ marginBottom: '24px' }}>Expertise</span>
              <h2 className="headline-lg">Frequently Asked Questions</h2>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {homepageFaqs.map((item) => (
                <li key={item.question} style={{ padding: '32px 0', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>{item.question}</h3>
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


