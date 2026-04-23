"use client";

import { useState } from "react";
import Script from "next/script";
import { ArrowRight, CheckCircle2, FileBadge2, ShieldCheck, Sparkles } from "lucide-react";

import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { AuditIntakeForm } from "@/components/audit/AuditIntakeForm";
import { AuditPreview } from "@/components/audit/AuditPreview";
import { PricingGrid } from "@/components/audit/PricingGrid";
import { Badge } from "@/components/ui/badge";

import type { AuditPlanKey } from "@/lib/audit/types";

const features = [
  "Free tier: limited crawl with technical + on-page score",
  "Paid tier: deep crawl, SERP + competitor data, GEO narrative, premium PDF",
  "Calibrated for Indian brands buying AI visibility retainers",
];

export default function AuditPage() {
  const [selectedPlan, setSelectedPlan] = useState<Exclude<AuditPlanKey, "free">>("growth");

  return (
    <div className="page-shell">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <NavBar />
      <main>
        {/* Header Hero Section */}
        <header className="section" style={{ padding: '120px 0 80px', backgroundColor: 'var(--bg)', position: 'relative' }}>
          <div className="container grid-2col" style={{ gap: '80px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '40px' }}>
              <span className="overline" style={{ color: 'var(--brand-blue)', backgroundColor: 'rgba(58, 190, 249, 0.08)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block', width: 'fit-content' }}>
                Diagnostic Engine
              </span>
              <h1 className="headline-xl" style={{ margin: '32px 0', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
                Benchmark your <br />
                <span style={{ 
                  background: 'linear-gradient(to right, var(--brand-blue), var(--brand-green))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>AI Visibility Index.</span>
              </h1>
              <p className="text-sub" style={{ marginBottom: '40px', fontSize: '18px', opacity: 0.8, maxWidth: '540px' }}>
                See exactly how ChatGPT, Perplexity, and SearchGPT perceive your brand. Our audit engine identifies technical gaps, entity drift, and citation opportunities.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {features.map((item) => (
                  <div key={item} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--text-dim)'
                  }}>
                    <CheckCircle2 className="h-5 w-5" style={{ color: 'var(--brand-green)', flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ width: '100%', maxWidth: '480px', marginLeft: 'auto' }}>
              <AuditIntakeForm selectedPlan={selectedPlan} />
            </div>
          </div>
        </header>

        {/* Pricing Plans Section - FULL WIDTH GRID */}
        <section id="pricing-plans" className="section" style={{ padding: '100px 0', backgroundColor: 'var(--surface-alt)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span className="overline" style={{ color: 'var(--brand-green)', backgroundColor: 'rgba(57, 181, 73, 0.08)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
                Report Tiers
              </span>
              <h2 className="headline-lg" style={{ marginTop: '24px' }}>Choose your <span style={{ color: 'var(--brand-green)' }}>Audit Tier.</span></h2>
              <p className="text-sub" style={{ maxWidth: '600px', margin: '20px auto 0', opacity: 0.7 }}>
                Select a one-time paid audit tier. Your selection below will update the checkout action in the intake form above.
              </p>
            </div>
            <PricingGrid selectedPlan={selectedPlan} onSelect={setSelectedPlan} />
          </div>
        </section>

        {/* Bento Trust Section */}
        <section className="section" style={{ padding: '100px 0', background: 'var(--bg)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              <div className="card-bento" style={{ padding: '40px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(58, 190, 249, 0.1)', width: 'fit-content', marginBottom: '24px' }}>
                   <ShieldCheck className="h-8 w-8" style={{ color: 'var(--brand-blue)' }} />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>Abuse-resistant</h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '15px', lineHeight: 1.7, opacity: 0.8 }}>Rate-limited processing and signed captcha challenges protect the integrity of every audit node.</p>
              </div>
              <div className="card-bento" style={{ padding: '40px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(57, 181, 73, 0.1)', width: 'fit-content', marginBottom: '24px' }}>
                   <FileBadge2 className="h-8 w-8" style={{ color: 'var(--brand-green)' }} />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>Report-first</h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '15px', lineHeight: 1.7, opacity: 0.8 }}>Every report includes a technical scoreboard, entity roadmap, and a premium PDF snapshot for stakeholders.</p>
              </div>
              <div className="card-bento" style={{ padding: '40px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(249, 217, 73, 0.1)', width: 'fit-content', marginBottom: '24px' }}>
                   <Sparkles className="h-8 w-8" style={{ color: 'var(--brand-yellow)' }} />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>Strategy-ready</h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '15px', lineHeight: 1.7, opacity: 0.8 }}>Designed to lead directly into our implementation retainers with clear, engine-by-engine actionable prioritization.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="section" style={{ padding: '100px 0', backgroundColor: 'var(--surface-alt)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <AuditPreview />
          </div>
        </section>

        {/* CTA Section */}
        <section className="section" style={{ padding: '120px 0', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
          <div className="container">
            <div style={{ 
              padding: '80px', 
              backgroundColor: 'var(--text)', 
              color: 'var(--bg)', 
              borderRadius: '32px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center',
              gap: '24px',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)'
            }}>
              <span className="overline" style={{ color: 'var(--brand-blue)', backgroundColor: 'rgba(58, 190, 249, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>Direct Implementation</span>
              <h2 className="headline-lg" style={{ color: 'var(--bg)', margin: 0, textShadow: 'none' }}>Implement the full GEO fix.</h2>
              <p style={{ maxWidth: '640px', opacity: 0.9, fontSize: '18px', lineHeight: 1.7 }}>
                Once you have your audit, book a strategy call with our engineering team to map out the 90-day technical signals and entity roadmap for AI dominance.
              </p>
              <a href="https://calendly.com/itappens/strategy-call" target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '18px 40px', fontSize: '16px', borderRadius: '12px', marginTop: '16px' }}>
                Book strategy call
                <ArrowRight className="h-5 w-5" style={{ marginLeft: '12px' }} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
