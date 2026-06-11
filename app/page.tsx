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
import { faqSchema, organizationSchema, schemaGraph, serviceSchema } from "@/lib/seo/schema";
import { Suspense } from "react";

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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-brand-text bg-brand-bg">
      <JsonLd data={homepageSchema} />
      <Suspense fallback={<div className="h-20 bg-white animate-pulse" />}>
        <NavBar />
      </Suspense>
      
      <main className="flex-grow">
        <SearchHeroSection />
        <ProblemSection />
        <SolutionSection />
        <ProofSection />

        {/* FAQ Section */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 mb-6 text-sm font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 rounded-full uppercase tracking-wider">
                Expertise
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-text">
                Frequently Asked Questions
              </h2>
            </div>
            <ul className="space-y-8">
              {homepageFaqs.map((item) => (
                <li key={item.question} className="pb-8 border-b border-brand-border last:border-0">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-brand-text">{item.question}</h3>
                  <p className="text-lg text-brand-text-muted leading-relaxed">{item.answer}</p>
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
