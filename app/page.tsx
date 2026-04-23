import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import ProofSection from "@/components/sections/ProofSection";
import GEOExplanation from "@/components/sections/GEOExplanation";
import AuditForm from "@/components/AuditForm";
import { homepageFaqs } from "@/lib/content/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema, organizationSchema, schemaGraph, serviceSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "itappens.ai | India's First AEO/GEO Solution Provider",
  description:
    "India's first AEO/GEO solution provider and AI content automation platform for brands that want to become the default answer across major AI engines.",
  path: "/",
  keywords: ["GEO agency India", "AEO consultant India", "how to get cited by AI in India"],
});

const homepageSchema = schemaGraph(
  organizationSchema(),
  serviceSchema({
    name: "AEO and GEO services for Indian brands",
    description:
      "Technical Signals, answer-engine content, entity-building, and tracking for brands that want to become the default answer across AI platforms.",
    path: "/",
  }),
  faqSchema(homepageFaqs),
);

import { Suspense } from "react";

export default function HomePage() {
  return (
    <div className="page-shell">
      <JsonLd data={homepageSchema} />
      <Suspense fallback={<div className="h-20 bg-surface animate-pulse" />}>
        <NavBar />
      </Suspense>
      
      <main>
        <HeroSection />
        <ProblemSection />
        <ProofSection />
        <GEOExplanation />

        {/* Integrated Audit Section */}
        <section id="pricing" style={{ padding: '140px 0', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
          <div className="container grid-2col" style={{ gap: '100px', alignItems: 'center' }}>
            <div>
              <span className="overline" style={{ color: 'var(--brand-blue)', backgroundColor: 'rgba(58, 190, 249, 0.08)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
                Free AI Audit
              </span>
              <h2 className="headline-lg" style={{ marginTop: '24px', lineHeight: 1.1 }}>
                See where your brand stands <br />
                <span style={{ 
                  background: 'linear-gradient(to right, var(--brand-blue), var(--brand-green))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>across AI engines today.</span>
              </h2>
              <p className="text-sub" style={{ marginTop: '32px', fontSize: '17px', opacity: 0.8 }}>
                The snapshot captures your current answer-engine visibility, highlights missing technical signals, and identifies the first query cluster to ship.
              </p>
              <ul className="check-list" style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  "Baseline prompts across the major answer engines",
                  "Canonical and schema gap review",
                  "Priority recommendations for the first 90 days"
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-dim)', fontSize: '15px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--brand-blue)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-glass" style={{ padding: '48px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(to right, var(--brand-blue), var(--brand-green), var(--brand-yellow), var(--brand-red))' }} />
              <AuditForm />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section" style={{ padding: '140px 0', background: 'var(--surface-alt)', borderTop: '1px solid var(--border)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <span className="overline" style={{ color: 'var(--brand-yellow)', backgroundColor: 'rgba(249, 217, 73, 0.08)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
                FAQ
              </span>
              <h2 className="headline-lg" style={{ marginTop: '24px', lineHeight: 1.1 }}>
                Questions that buyers and <br />
                <span style={{ color: 'var(--brand-yellow)' }}>AI systems both need resolved.</span>
              </h2>
            </div>
            <ul className="faq-list" style={{ listStyle: 'none' }}>
              {homepageFaqs.map((item) => (
                <li key={item.question} style={{ padding: '32px 0', borderBottom: '1px solid var(--border)' }}>
                  <h3 className="faq-question" style={{ fontSize: '19px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>{item.question}</h3>
                  <div className="faq-answer">
                    <p style={{ color: 'var(--text-dim)', fontSize: '16px', lineHeight: 1.7, opacity: 0.8 }}>{item.answer}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Suspense fallback={<div className="h-40 bg-surface" />}>
        <SiteFooter />
      </Suspense>
    </div>
  );
}

