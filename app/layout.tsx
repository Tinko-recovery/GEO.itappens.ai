import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "itappens.ai — GEO Agency India | Get Your Brand Cited by AI",
  description:
    "Specialized Generative Engine Optimization (GEO) agency. We engineer Indian brands into the answers given by ChatGPT, Perplexity, Gemini, Claude, and Grok — not just ranked, cited.",
  keywords: [
    "GEO agency India", "generative engine optimization", "AI brand visibility India",
    "ChatGPT brand citation", "Perplexity SEO India", "AI search optimization",
    "LLM citation strategy", "entity optimization", "itappens ai", "Sadish Sugumaran GEO"
  ],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
  openGraph: {
    title: "itappens.ai — Get Your Brand Cited, Not Just Searched",
    description: "We engineer digital entities that AI models like Perplexity, Gemini, and SearchGPT trust and recommend. India's first GEO practice.",
    url: "https://itappens.ai", siteName: "itappens.ai", type: "website", locale: "en_IN",
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'itappens.ai — GEO Agency India' }],
  },
  twitter: { card: "summary_large_image", title: "itappens.ai — Get Your Brand Cited by AI", description: "India's GEO practice. We engineer brands into AI answers — ChatGPT, Perplexity, Gemini." },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://itappens.ai",
  },
};

/* ── JSON-LD: ProfessionalService Schema ── */
const identitySchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "itappens.ai",
  "description": "Specialized Digital Marketing Agency focusing on Generative Engine Optimization (GEO) and AI-first search visibility. We engineer Indian brands into the answers given by ChatGPT, Perplexity, Gemini, Claude, and Grok.",
  "url": "https://itappens.ai",
  "logo": "https://itappens.ai/logo.png",
  "image": "https://itappens.ai/logo.png",
  "email": "sadish@itappens.ai",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bengaluru",
    "addressRegion": "Karnataka",
    "addressCountry": "IN"
  },
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "serviceType": ["Generative Engine Optimization", "AI Brand Visibility", "Content Automation", "Digital Marketing"],
  "sameAs": [
    "https://www.linkedin.com/company/itappens-ai/",
    "https://wa.me/919353015844"
  ],
  "offers": [
    { "@type": "Offer", "name": "Growth", "price": "4999", "priceCurrency": "INR", "billingDuration": "P1M" },
    { "@type": "Offer", "name": "Pro", "price": "9999", "priceCurrency": "INR", "billingDuration": "P1M" },
    { "@type": "Offer", "name": "Pro + GEO", "price": "19999", "priceCurrency": "INR", "billingDuration": "P1M" }
  ],
  "knowsAbout": ["Generative Engine Optimization", "AI Search", "Large Language Models", "Brand Entity Architecture", "JSON-LD Schema", "SEO", "Content Marketing"],
  "keywords": ["GEO agency India", "AI search visibility", "ChatGPT brand citation", "Perplexity SEO", "generative engine optimization India", "AI content automation"]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(identitySchema) }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
