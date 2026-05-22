"use client";

import { useState } from "react";
import Script from "next/script";
import { ArrowRight, CheckCircle2, ShieldCheck, Database, GitBranch, TerminalSquare, SearchCode, ServerCog } from "lucide-react";

import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { AuditIntakeForm } from "@/components/audit/AuditIntakeForm";
import type { AuditPlanKey } from "@/lib/audit/types";

const features = [
  "Crawl: Analyze existing citation signals & knowledge graphs.",
  "Benchmark: Measure against ChatGPT, Claude, and Perplexity.",
  "Optimize: Generate a technical roadmap to bridge the semantic gap.",
];

export default function AuditPage() {
  const [selectedPlan, setSelectedPlan] = useState<Exclude<AuditPlanKey, "free">>("growth");

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "GeoAudit AI",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": "An enterprise-grade Generative Engine Optimization (GEO) audit tool that analyzes brand visibility and citation signals across major LLMs.",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Generative Engine Optimization (GEO)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Generative Engine Optimization (GEO) is the process of structuring your brand's digital footprint and entity data so that Answer Engines like ChatGPT, Perplexity, and Google AI Overviews reliably recommend your products and services."
            }
          },
          {
            "@type": "Question",
            "name": "How does the GeoAudit AI tool work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The engine crawls your website and compares your entity prominence against major LLMs. It generates a roadmap identifying technical gaps, missing citations, and semantic bridging opportunities."
            }
          },
          {
            "@type": "Question",
            "name": "Why do B2B companies need GEO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Decision makers are increasingly using LLMs for research instead of traditional search engines. If your brand is not explicitly cited by ChatGPT or Claude as a category leader, you lose high-intent pipeline."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="page-shell">
      <Script 
        id="geo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      
      <NavBar />
      
      <main>
        {/* Header Hero Section */}
        <section className="section dark-section" aria-label="Hero">
          <div className="container grid-2col">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <TerminalSquare className="h-5 w-5" style={{ color: 'var(--cyan)' }} />
                <span className="overline" style={{ marginBottom: 0 }}>
                  Enterprise GEO Intelligence
                </span>
              </div>
              <h1 className="headline-xl" style={{ margin: '0 0 32px 0' }}>
                Master the <br />
                <span style={{ color: 'var(--cyan)' }}>Generative Layer.</span>
              </h1>
              <p className="text-sub" style={{ marginBottom: '40px', maxWidth: '540px' }}>
                Answer Engines have replaced search. Our diagnostic engine maps exactly how ChatGPT, Claude, and Perplexity perceive your brand, revealing the precise technical and semantic gaps costing you pipeline.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {features.map((item) => (
                  <div key={item} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '12px', 
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#fff'
                  }}>
                    <CheckCircle2 className="h-5 w-5" style={{ color: 'var(--cyan)', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card-bento" style={{ width: '100%', maxWidth: '520px', marginLeft: 'auto', color: 'var(--navy)' }}>
              <AuditIntakeForm selectedPlan={selectedPlan} />
            </div>
          </div>
        </section>

        {/* Technical Bento Grid */}
        <section className="section" aria-label="Features">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 className="headline-lg">
                Diagnostic Capabilities
              </h2>
              <p className="text-sub" style={{ maxWidth: '600px', margin: '0 auto' }}>
                Enterprise-grade analysis to reverse-engineer Answer Engine logic.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              
              <article className="card-bento" style={{ borderTop: '4px solid var(--cyan)' }}>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(6, 182, 212, 0.1)', width: 'fit-content', marginBottom: '24px' }}>
                   <GitBranch className="h-6 w-6" style={{ color: 'var(--cyan)' }} />
                </div>
                <h3 className="headline-md" style={{ marginBottom: '16px' }}>Entity Health Monitoring</h3>
                <p className="text-sub" style={{ fontSize: '15px' }}>
                  Track how LLMs associate your brand with core industry topics. We identify semantic drift and recommend structural fixes to strengthen your knowledge graph presence.
                </p>
              </article>

              <article className="card-bento" style={{ borderTop: '4px solid var(--blue)' }}>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(37, 99, 235, 0.1)', width: 'fit-content', marginBottom: '24px' }}>
                   <Database className="h-6 w-6" style={{ color: 'var(--blue)' }} />
                </div>
                <h3 className="headline-md" style={{ marginBottom: '16px' }}>Real-time Citation Tracking</h3>
                <p className="text-sub" style={{ fontSize: '15px' }}>
                  Monitor which third-party domains are feeding data about your company to Answer Engines. Prioritize digital PR and link-building efforts based on actual RAG impact.
                </p>
              </article>

              <article className="card-bento" style={{ borderTop: '4px solid var(--slate)' }}>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(71, 85, 105, 0.1)', width: 'fit-content', marginBottom: '24px' }}>
                   <SearchCode className="h-6 w-6" style={{ color: 'var(--slate)' }} />
                </div>
                <h3 className="headline-md" style={{ marginBottom: '16px' }}>Semantic Gap Analysis</h3>
                <p className="text-sub" style={{ fontSize: '15px' }}>
                  Compare your technical content structure against competitors. We provide explicit schema, markdown, and content velocity recommendations to outrank them in AI answers.
                </p>
              </article>
              
              <article className="card-bento" style={{ borderTop: '4px solid var(--cyan)' }}>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(6, 182, 212, 0.1)', width: 'fit-content', marginBottom: '24px' }}>
                   <ShieldCheck className="h-6 w-6" style={{ color: 'var(--cyan)' }} />
                </div>
                <h3 className="headline-md" style={{ marginBottom: '16px' }}>Abuse-Resistant Audits</h3>
                <p className="text-sub" style={{ fontSize: '15px' }}>
                  Our proprietary engine is protected by signed captcha challenges and rate-limiting, ensuring high-fidelity outputs for enterprise domains without compromising data integrity.
                </p>
              </article>

            </div>
          </div>
        </section>

        {/* Answer Engine Optimized FAQ */}
        <section className="section" style={{ backgroundColor: '#fff', borderTop: '1px solid var(--border-light)' }} aria-label="Frequently Asked Questions">
          <div className="container-narrow">
            <div style={{ marginBottom: '48px', textAlign: 'center' }}>
              <span className="overline">FAQ</span>
              <h2 className="headline-lg">
                Frequently Asked Questions
              </h2>
              <p className="text-sub">
                Understanding the mechanics of Generative Engine Optimization.
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <article className="card-bento">
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>
                  What is Generative Engine Optimization (GEO)?
                </h3>
                <p style={{ color: 'var(--slate)', fontSize: '15px', lineHeight: 1.7 }}>
                  Generative Engine Optimization (GEO) is the process of structuring your brand's digital footprint and entity data so that Answer Engines like ChatGPT, Perplexity, and Google AI Overviews reliably recommend your products and services. Unlike traditional SEO, GEO focuses on context, semantic density, and authoritative citations.
                </p>
              </article>

              <article className="card-bento">
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>
                  How does the GeoAudit AI tool work?
                </h3>
                <ul style={{ color: 'var(--slate)', fontSize: '15px', lineHeight: 1.7, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Crawl Phase:</strong> The engine analyzes your website's schema, semantic structure, and technical health.</li>
                  <li><strong>Retrieval Phase:</strong> It queries live LLMs (ChatGPT, Claude, Perplexity) to assess brand perception and citation frequency.</li>
                  <li><strong>Synthesis Phase:</strong> It generates a technical roadmap identifying specific gaps and actionable bridging strategies.</li>
                </ul>
              </article>

              <article className="card-bento">
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>
                  Why do B2B companies need GEO?
                </h3>
                <p style={{ color: 'var(--slate)', fontSize: '15px', lineHeight: 1.7 }}>
                  Decision makers are increasingly using LLMs for research, vendor comparison, and technical evaluation instead of traditional search engines. If your brand is not explicitly cited by these AI models as a category leader, you lose high-intent pipeline before they ever reach your website.
                </p>
              </article>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section dark-section" aria-label="Call to Action">
          <div className="container">
            <div className="card-bento" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center',
              gap: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ServerCog className="h-5 w-5" style={{ color: 'var(--cyan)' }} />
                <span className="overline" style={{ marginBottom: 0 }}>
                  Direct Implementation
                </span>
              </div>
              <h2 className="headline-lg">Execute the GEO Blueprint.</h2>
              <p className="text-sub" style={{ maxWidth: '640px' }}>
                Once you have your audit, our engineering team can map out the 90-day technical signals and entity roadmap required for total AI dominance.
              </p>
              <a href="mailto:hello@itappens.ai" className="btn-primary" style={{ marginTop: '16px' }}>
                Contact Engineering
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  );
}
