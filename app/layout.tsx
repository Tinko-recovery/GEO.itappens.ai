import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CursorSpotlight from "@/components/CursorSpotlight";
import BackgroundMesh from "@/components/BackgroundMesh";

export const metadata: Metadata = {
  title: "itappens.ai — India's GEO Practice | Generative Engine Optimization",
  description:
    "When your customer asks ChatGPT who to trust in your industry — your name should be the answer. itappens.ai engineers AI citations for Indian brands.",
  keywords: [
    "GEO agency India", "Generative Engine Optimization India", "AI citation growth",
    "ChatGPT brand visibility", "itappens ai", "Blocks and Loops Technologies",
    "AI search optimization India 2026", "generative engine optimization",
  ],
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
  openGraph: {
    title: "itappens.ai — India's GEO Practice",
    description: "When your customer asks ChatGPT who to trust in your industry — your name should be the answer.",
    url: "https://itappens.ai", siteName: "itappens.ai", type: "website", locale: "en_IN",
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'itappens.ai logo' }],
  },
  twitter: { card: "summary_large_image", title: "itappens.ai — Generative Engine Optimization", description: "India's pioneer in GEO. Be found where AI answers." },
  robots: { index: true, follow: true },
};

/* ── JSON-LD: ProfessionalService Schema ── */
const identitySchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "itappens.ai",
  "description": "India's GEO (Generative Engine Optimisation) practice. We engineer AI citations so your brand appears in ChatGPT, Perplexity, Gemini and Claude recommendations.",
  "url": "https://itappens.ai",
  "logo": "https://itappens.ai/logo.png",
  "founder": {
    "@type": "Person",
    "@id": "https://itappens.ai/#sadish",
    "name": "Sadish Sugumaran",
    "jobTitle": "Founder"
  },
  "serviceType": ["Generative Engine Optimisation", "GEO", "AI Brand Visibility", "AI Citation Engineering"],
  "areaServed": ["India", "Tamil Nadu", "Chennai", "Bangalore", "Mumbai", "Hosur"],
  "knowsAbout": ["GEO", "AI Search Optimisation", "ChatGPT brand visibility", "Perplexity citations"]
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
      <body style={{ fontFamily: "var(--font-body)" }}>
        <LenisProvider>
          <div className="grain-overlay" />
          <div className="mesh-bg" />
          <CursorSpotlight />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
