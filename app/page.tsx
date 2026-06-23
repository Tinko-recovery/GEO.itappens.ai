import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import SearchHeroSection from "@/components/sections/SearchHeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import SolutionSection from "@/components/sections/SolutionSection";
import ProofSection from "@/components/sections/ProofSection";

import { homepageFaqs } from "@/lib/content/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema, organizationSchema, schemaGraph, serviceSchema, breadcrumbSchema, localBusinessSchema } from "@/lib/seo/schema";
import { Suspense } from "react";

export const metadata: Metadata = buildMetadata({
  title: "itappens.ai | Global GEO & AEO Consultancy for B2B SaaS",
  description:
    "Answer Engine Optimization (AEO) & Generative Engine Optimization (GEO) consultancy. Get cited in ChatGPT, Perplexity, Claude, and Gemini through technical signals, content strategy, and entity authority building.",
  path: "/",
  keywords: ["GEO agency for SaaS", "AEO consultant B2B", "LLM citation optimization"],
});

const homepageSchema = schemaGraph(
  organizationSchema(),
  localBusinessSchema(),
  serviceSchema({
    name: "GEO and AEO consultancy for B2B SaaS",
    description:
      "Technical Signals, answer-engine content hubs, entity-building, and citation tracking for global SaaS brands.",
    path: "/",
  }),
  faqSchema(homepageFaqs),
  breadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Solutions", item: "/#solutions" },
  ])
);

export default function HomePage() {
  return (
    <div className="page-shell">
      <JsonLd data={homepageSchema} />
      <Suspense fallback={<div className="h-20 bg-white animate-pulse" />}>
        <NavBar />
      </Suspense>
      
      <main>
        <SearchHeroSection />
        <ProblemSection />
        <SolutionSection />
        <ProofSection />

        {/* FAQ Section */}
        <section className="section" style={{ borderTop: "1px solid var(--border-light)", backgroundColor: "#fff" }}>
          <div className="container-narrow">
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <span className="overline">Expertise</span>
              <h2 className="headline-lg">Frequently Asked Questions</h2>
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {homepageFaqs.map((item) => (
                <li key={item.question} style={{ padding: "24px 0", borderBottom: "1px solid var(--border-light)" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px", color: "var(--navy)" }}>{item.question}</h3>
                  <p style={{ color: "var(--slate)", fontSize: "16px", lineHeight: 1.6, margin: 0 }}>{item.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Suspense fallback={<div className="h-40 bg-brand-bg-muted" />}>
        <SiteFooter />
      </Suspense>
    </div>
  );
}
