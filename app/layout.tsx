import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "itappens.ai — Premium GEO Practice India | AI-Brand Optimization",
  description:
    "Specialized Generative Engine Optimization (GEO) agency. We engineer Indian brands into AI answers — ChatGPT, Perplexity, Gemini, Claude, and Grok.",
  keywords: [
    "GEO agency India", "generative engine optimization", "AI brand visibility",
    "ChatGPT brand citation", "Perplexity optimization", "entity architecture"
  ],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "itappens.ai — Get Your Brand Cited by AI",
    description: "India's first GEO practice. We engineer digital entities that AI models trust and recommend.",
    url: "https://itappens.ai",
    siteName: "itappens.ai",
    type: "website",
    locale: "en_IN",
  },
};

const identitySchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "itappens.ai",
  "description": "Specialized Digital Marketing Agency focusing on Generative Engine Optimization (GEO) and AI-first search visibility.",
  "url": "https://itappens.ai",
  "logo": "https://itappens.ai/favicon.svg",
  "email": "sadish@itappens.ai",
  "areaServed": { "@type": "Country", "name": "India" },
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
