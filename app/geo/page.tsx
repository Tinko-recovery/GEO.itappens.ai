import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { geoFaqs, geoPackages, howItWorksSteps, pillars } from "@/lib/content/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema, howToSchema, schemaGraph, serviceSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "GEO services and methodology",
  description:
    "The itappens.ai GEO page covers the four-pillar methodology, Technical Signals package, delivery model, and commercial structure.",
  path: "/geo",
  keywords: ["GEO services India", "AEO consultant India", "GEO methodology"],
});

const geoSchema = schemaGraph(
  serviceSchema({
    name: "Generative Engine Optimization and Answer Engine Optimization services",
    description:
      "A four-pillar system covering Technical Signals, content clusters, entity-building, and tracking for brands that want to become the default AI answer.",
    path: "/geo",
  }),
  faqSchema(geoFaqs),
  howToSchema({
    name: "How itappens.ai runs a 90-day GEO program",
    description: "A staged approach covering Technical Signals, content, entity reinforcement, and weekly iteration.",
    path: "/geo",
    steps: howItWorksSteps,
  }),
);

export default function GeoPage() {
  return (
    <div className="page-shell">
      <JsonLd data={geoSchema} />
      <NavBar />
      <main>
        <header className="section page-hero">
          <div className="container grid-2col">
            <div>
              <p className="overline">/geo</p>
              <h1 className="headline-xl" style={{ marginBottom: 18 }}>
                The four-pillar GEO system built for the AI-first internet.
              </h1>
              <p className="text-sub" style={{ marginBottom: 24 }}>
                itappens.ai combines Technical Signals, answer-engine content, entity-building, and tracking into one operating
                model for brands that want to become the default answer across major AI platforms.
              </p>
              <div className="pill-list">
                <li>
                  <a className="btn-primary" href="/how-it-works">
                    See the execution system
                  </a>
                </li>
                <li>
                  <a className="btn-secondary" href="/case-studies">
                    Review the self-case
                  </a>
                </li>
              </div>
            </div>
            <aside className="cta-panel">
              <p className="overline">Commercial posture</p>
              <p style={{ marginBottom: 12 }}>
                The engagement starts with a fixed-scope Technical Signals sprint, then expands into a 90-day program for brands
                that want measurable citation gains on a defined query set.
              </p>
              <ul className="check-list">
                <li>Week 1: Technical Signals deployment</li>
                <li>Weeks 2-12: weekly answer clusters and entity reinforcement</li>
                <li>Weekly monitoring across the target answer engines</li>
              </ul>
            </aside>
          </div>
        </header>

        <section className="section section-muted">
          <div className="container">
            <p className="overline">What you buy</p>
            <h2 className="headline-lg" style={{ marginBottom: 18 }}>
              Pricing is structured around scope, not vanity volume.
            </h2>
            <div className="grid-pricing">
              {geoPackages.map((item) => (
                <article className="card" key={item.name}>
                  <p className="overline">{item.price}</p>
                  <h3 className="headline-md" style={{ marginBottom: 10 }}>
                    {item.name}
                  </h3>
                  <p style={{ marginBottom: 14 }}>{item.description}</p>
                  <ul className="check-list">
                    {item.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <p className="overline">Methodology</p>
            <h2 className="headline-lg" style={{ marginBottom: 18 }}>
              Four pillars, one operating model.
            </h2>
            <div className="grid-pillars">
              {pillars.map((pillar) => (
                <article className="card" key={pillar.title}>
                  <p className="overline">{pillar.tag}</p>
                  <h3 className="headline-md" style={{ marginBottom: 10 }}>
                    {pillar.title}
                  </h3>
                  <p>{pillar.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-muted">
          <div className="container grid-2col">
            <div>
              <p className="overline">Expected outcome</p>
              <h2 className="headline-lg" style={{ marginBottom: 18 }}>
                The aim is not more pages. The aim is higher citation share on target prompts.
              </h2>
              <p className="text-sub" style={{ marginBottom: 18 }}>
                The 90-day operating target is to move toward 70%+ citation share on selected query sets by aligning the
                technical layer, the answer layer, and the tracking loop. That target is a system goal, not a blanket guarantee.
              </p>
              <ul className="check-list">
                <li>Define the query set before publishing</li>
                <li>Match each page to a clear page role and schema type</li>
                <li>Use weekly tracking to decide the next iteration</li>
              </ul>
            </div>
            <div className="card">
              <p className="overline">The first 7 days</p>
              <ol className="steps-list">
                {howItWorksSteps.slice(0, 3).map((step) => (
                  <li key={step.name}>
                    <h3 className="headline-md" style={{ marginBottom: 8 }}>
                      {step.name}
                    </h3>
                    <p>{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container-narrow">
            <p className="overline">FAQ</p>
            <h2 className="headline-lg" style={{ marginBottom: 18 }}>
              The questions that shape scope and delivery.
            </h2>
            <ul className="faq-list">
              {geoFaqs.map((faq) => (
                <li key={faq.question}>
                  <h3 className="faq-question">{faq.question}</h3>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
