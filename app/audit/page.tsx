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
    <div className="page-shell" style={{ backgroundColor: '#0A192F', color: '#D9E2FF', fontFamily: 'var(--font-inter, sans-serif)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Script 
        id="geo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      
      <NavBar />
      
      <main style={{ flex: '1' }}>
        {/* Header Hero Section */}
        <section aria-label="Hero" style={{ padding: '160px 0 80px', position: 'relative', borderBottom: '1px solid #233554', backgroundColor: '#07122A' }}>
          <div className="container grid-2col" style={{ gap: '80px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <TerminalSquare className="h-5 w-5" style={{ color: '#00E5FF' }} />
                <span style={{ color: '#00E5FF', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase' }}>
                  Enterprise GEO Intelligence
                </span>
              </div>
              <h1 style={{ margin: '0 0 32px 0', fontSize: '56px', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#ffffff' }}>
                Master the <br />
                <span style={{ color: '#00E5FF' }}>Generative Layer.</span>
              </h1>
              <p style={{ marginBottom: '40px', fontSize: '18px', lineHeight: 1.6, maxWidth: '540px', color: '#8892B0' }}>
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
                    color: '#D9E2FF'
                  }}>
                    <CheckCircle2 className="h-5 w-5" style={{ color: '#00E5FF', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ width: '100%', maxWidth: '520px', marginLeft: 'auto' }}>
              <AuditIntakeForm selectedPlan={selectedPlan} />
            </div>
          </div>
        </section>

        {/* Technical Bento Grid */}
        <section aria-label="Features" style={{ padding: '120px 0', backgroundColor: '#0A192F' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em', marginBottom: '16px' }}>
                Diagnostic Capabilities
              </h2>
              <p style={{ color: '#8892B0', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                Enterprise-grade analysis to reverse-engineer Answer Engine logic.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              
              <article style={{ padding: '40px', border: '1px solid #233554', backgroundColor: '#112240', borderRadius: '8px', transition: 'border-color 0.3s ease' }}>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(0, 229, 255, 0.1)', width: 'fit-content', marginBottom: '24px', border: '1px solid rgba(0,229,255,0.2)' }}>
                   <GitBranch className="h-6 w-6" style={{ color: '#00E5FF' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#ffffff' }}>Entity Health Monitoring</h3>
                <p style={{ color: '#8892B0', fontSize: '15px', lineHeight: 1.6 }}>
                  Track how LLMs associate your brand with core industry topics. We identify semantic drift and recommend structural fixes to strengthen your knowledge graph presence.
                </p>
              </article>

              <article style={{ padding: '40px', border: '1px solid #233554', backgroundColor: '#112240', borderRadius: '8px', transition: 'border-color 0.3s ease' }}>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(27, 79, 222, 0.2)', width: 'fit-content', marginBottom: '24px', border: '1px solid rgba(27, 79, 222, 0.5)' }}>
                   <Database className="h-6 w-6" style={{ color: '#4da6ff' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#ffffff' }}>Real-time Citation Tracking</h3>
                <p style={{ color: '#8892B0', fontSize: '15px', lineHeight: 1.6 }}>
                  Monitor which third-party domains are feeding data about your company to Answer Engines. Prioritize digital PR and link-building efforts based on actual RAG impact.
                </p>
              </article>

              <article style={{ padding: '40px', border: '1px solid #233554', backgroundColor: '#112240', borderRadius: '8px', transition: 'border-color 0.3s ease' }}>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)', width: 'fit-content', marginBottom: '24px', border: '1px solid #233554' }}>
                   <SearchCode className="h-6 w-6" style={{ color: '#D9E2FF' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#ffffff' }}>Semantic Gap Analysis</h3>
                <p style={{ color: '#8892B0', fontSize: '15px', lineHeight: 1.6 }}>
                  Compare your technical content structure against competitors. We provide explicit schema, markdown, and content velocity recommendations to outrank them in AI answers.
                </p>
              </article>
              
              <article style={{ padding: '40px', border: '1px solid #233554', backgroundColor: '#112240', borderRadius: '8px', transition: 'border-color 0.3s ease' }}>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(0, 229, 255, 0.1)', width: 'fit-content', marginBottom: '24px', border: '1px solid rgba(0,229,255,0.2)' }}>
                   <ShieldCheck className="h-6 w-6" style={{ color: '#00E5FF' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#ffffff' }}>Abuse-Resistant Audits</h3>
                <p style={{ color: '#8892B0', fontSize: '15px', lineHeight: 1.6 }}>
                  Our proprietary engine is protected by signed captcha challenges and rate-limiting, ensuring high-fidelity outputs for enterprise domains without compromising data integrity.
                </p>
              </article>

            </div>
          </div>
        </section>

        {/* Answer Engine Optimized FAQ */}
        <section aria-label="Frequently Asked Questions" style={{ padding: '120px 0', borderTop: '1px solid #233554', backgroundColor: '#07122A' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em', marginBottom: '16px' }}>
                Frequently Asked Questions
              </h2>
              <p style={{ color: '#8892B0', fontSize: '18px' }}>
                Understanding the mechanics of Generative Engine Optimization.
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <article style={{ padding: '32px', border: '1px solid #233554', backgroundColor: '#112240', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>
                  What is Generative Engine Optimization (GEO)?
                </h3>
                <p style={{ color: '#8892B0', fontSize: '15px', lineHeight: 1.7 }}>
                  Generative Engine Optimization (GEO) is the process of structuring your brand's digital footprint and entity data so that Answer Engines like ChatGPT, Perplexity, and Google AI Overviews reliably recommend your products and services. Unlike traditional SEO, GEO focuses on context, semantic density, and authoritative citations.
                </p>
              </article>

              <article style={{ padding: '32px', border: '1px solid #233554', backgroundColor: '#112240', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>
                  How does the GeoAudit AI tool work?
                </h3>
                <ul style={{ color: '#8892B0', fontSize: '15px', lineHeight: 1.7, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Crawl Phase:</strong> The engine analyzes your website's schema, semantic structure, and technical health.</li>
                  <li><strong>Retrieval Phase:</strong> It queries live LLMs (ChatGPT, Claude, Perplexity) to assess brand perception and citation frequency.</li>
                  <li><strong>Synthesis Phase:</strong> It generates a technical roadmap identifying specific gaps and actionable bridging strategies.</li>
                </ul>
              </article>

              <article style={{ padding: '32px', border: '1px solid #233554', backgroundColor: '#112240', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>
                  Why do B2B companies need GEO?
                </h3>
                <p style={{ color: '#8892B0', fontSize: '15px', lineHeight: 1.7 }}>
                  Decision makers are increasingly using LLMs for research, vendor comparison, and technical evaluation instead of traditional search engines. If your brand is not explicitly cited by these AI models as a category leader, you lose high-intent pipeline before they ever reach your website.
                </p>
              </article>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section aria-label="Call to Action" style={{ padding: '120px 0', borderTop: '1px solid #233554', backgroundColor: '#0A192F' }}>
          <div className="container">
            <div style={{ 
              padding: '80px 40px', 
              backgroundColor: '#112240', 
              border: '1px solid #233554',
              borderRadius: '8px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center',
              gap: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ServerCog className="h-5 w-5" style={{ color: '#00E5FF' }} />
                <span style={{ color: '#00E5FF', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase' }}>
                  Direct Implementation
                </span>
              </div>
              <h2 style={{ color: '#ffffff', fontSize: '40px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Execute the GEO Blueprint.</h2>
              <p style={{ maxWidth: '640px', color: '#8892B0', fontSize: '18px', lineHeight: 1.6 }}>
                Once you have your audit, our engineering team can map out the 90-day technical signals and entity roadmap required for total AI dominance.
              </p>
              <a href="#" style={{ 
                padding: '16px 32px', 
                fontSize: '15px', 
                fontWeight: 600,
                borderRadius: '4px', 
                marginTop: '16px',
                backgroundColor: '#00E5FF',
                color: '#0A192F',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease'
              }}>
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
