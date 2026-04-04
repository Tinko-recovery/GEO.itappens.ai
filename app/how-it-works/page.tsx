import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { howItWorksSteps } from "@/lib/content/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { howToSchema, schemaGraph, serviceSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "How the GEO system works",
  description:
    "The /how-it-works page explains the seven-step itappens.ai execution system from baseline audit through weekly iteration.",
  path: "/how-it-works",
  keywords: ["how GEO works", "AEO implementation", "Technical Signals rollout"],
});

const howItWorksSchema = schemaGraph(
  serviceSchema({
    name: "GEO implementation workflow",
    description:
      "A seven-step execution system covering audit, entity normalization, technical signals, answer clusters, and citation tracking.",
    path: "/how-it-works",
  }),
  howToSchema({
    name: "How itappens.ai deploys GEO",
    description: "Seven steps from the baseline audit to the weekly iteration loop.",
    path: "/how-it-works",
    steps: howItWorksSteps,
  }),
);

export default function HowItWorksPage() {
  return (
    <div className="page-shell">
      <JsonLd data={howItWorksSchema} />
      <NavBar />
      <main>
        <header className="section page-hero">
          <div className="container grid-2col">
            <div>
              <p className="overline">/how-it-works</p>
              <h1 className="headline-xl" style={{ marginBottom: 18 }}>
                The execution system behind the GEO and AEO program.
              </h1>
              <p className="text-sub" style={{ marginBottom: 24 }}>
                This page turns the methodology into an explicit operating flow so the delivery model is readable by buyers,
                internal operators, and AI systems that summarize how the service works.
              </p>
            </div>
            <aside className="proof-note">
              <p className="overline">Execution principle</p>
              <p>
                Technical Signals are completed first because they improve how every later page, schema block, and answer cluster
                is interpreted.
              </p>
            </aside>
          </div>
        </header>

        <section className="section">
          <div className="container">
            <ol className="timeline-list">
              {howItWorksSteps.map((step, index) => (
                <li id={`step-${index + 1}`} key={step.name} data-step={`${index + 1}`.padStart(2, "0")}>
                  <h2 className="headline-md" style={{ marginBottom: 10 }}>
                    {step.name}
                  </h2>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section-muted">
          <div className="container grid-2col">
            <article className="card">
              <p className="overline">Ownership map</p>
              <ul className="check-list">
                <li>Technical co-founder owns canonicals, schema, llms.txt, sitemap, and semantic HTML.</li>
                <li>Founder or category owner owns claims, offer language, and proof review.</li>
                <li>Content owner turns query gaps into weekly answer pages and supporting updates.</li>
                <li>Ops owner maintains the weekly engine-by-engine tracking log.</li>
              </ul>
            </article>
            <article className="card">
              <p className="overline">Release rhythm</p>
              <ul className="check-list">
                <li>Week 1: ship the Technical Signals package and canonical page set.</li>
                <li>Weeks 2-12: publish one deep query cluster per week.</li>
                <li>Every week: record citation movement and decide the next iteration.</li>
                <li>Every month: review proof posture and entity consistency across the site.</li>
              </ul>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
