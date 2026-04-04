import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "itappens.ai — The Citation Layer for the AI Web",
  description:
    "We engineer your brand into AI answers. Specialised Generative Engine Optimization (GEO) for Indian B2B and Industrial sectors. Get cited by ChatGPT, Perplexity, and Gemini.",
  keywords: [
    "GEO agency India", "AI search visibility", "LLM citation engineering",
    "Perplexity optimization", "KIADB digital marketing", "SearchGPT visibility"
  ],
  alternates: {
    canonical: 'https://www.itappens.ai/',
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "itappens.ai — Get Your Brand Cited by AI",
    description: "India's first GEO practice. We ensure your brand is the primary source when LLMs answer questions.",
    url: "https://www.itappens.ai/",
    siteName: "itappens.ai",
    type: "website",
    locale: "en_IN",
  },
};

const identitySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.itappens.ai/#organization",
      "name": "itappens.ai",
      "url": "https://www.itappens.ai/",
      "logo": "https://www.itappens.ai/favicon.svg",
      "email": "hello@itappens.ai",
      "sameAs": [
        "https://www.linkedin.com/company/itappens-ai/"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bengaluru",
        "addressCountry": "IN"
      }
    },
    {
      "@type": "ProfessionalService",
      "name": "itappens.ai",
      "description": "Specialised Digital Marketing Agency focusing on Generative Engine Optimization (GEO) and AI-first search visibility.",
      "url": "https://www.itappens.ai/",
      "logo": "https://www.itappens.ai/favicon.svg",
      "email": "hello@itappens.ai",
      "sameAs": [
        "https://www.linkedin.com/company/itappens-ai/"
      ],
      "areaServed": { "@type": "Country", "name": "India" },
      "knowsAbout": [
        "Generative Engine Optimization (GEO)",
        "AI Search Visibility",
        "LLM Citation Engineering",
        "Digital Entity Consistency",
        "Information Gain Content Strategy",
        "Knowledge Graph Optimization",
        "KIADB Industrial Digital Marketing",
        "B2B Manufacturing Lead Generation"
      ]
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(identitySchema) }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
