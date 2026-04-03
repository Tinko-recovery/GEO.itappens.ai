import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "itappens.ai — AI Content Automation & GEO Platform",
  description:
    "Your brand, on every platform, every day. Automatically. itappens.ai automates your social media content across LinkedIn, Instagram, Twitter/X and YouTube — and engineers your brand into AI search answers.",
  keywords: [
    "GEO agency India", "AI content automation", "social media automation India",
    "ChatGPT brand visibility", "itappens ai", "LinkedIn automation India",
    "generative engine optimization", "AI social media marketing", "content automation SaaS"
  ],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
  openGraph: {
    title: "itappens.ai — Your Brand on Every Platform, Every Day",
    description: "AI-powered content automation + GEO. We generate, schedule, and publish daily content across all your channels while you focus on your business.",
    url: "https://itappens.ai", siteName: "itappens.ai", type: "website", locale: "en_IN",
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'itappens.ai logo' }],
  },
  twitter: { card: "summary_large_image", title: "itappens.ai — AI Content Automation", description: "Your brand, on every platform, every day. Automatically." },
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
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(identitySchema) }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
