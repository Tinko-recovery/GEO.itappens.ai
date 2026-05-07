import type { Metadata } from "next";

import "./globals.css";

import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "itappens.ai | Global GEO & AEO Consultancy for B2B SaaS",
    template: "%s | itappens.ai",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: siteConfig.url,
  },
    "GEO agency for SaaS",
    "AEO consultant B2B",
    "how to get cited by ChatGPT",
    "llms.txt for SaaS",
    "LLM citation optimization",
    "AI search visibility consultant",
  ],
  openGraph: {
    title: "itappens.ai | Global GEO & AEO Consultancy for B2B SaaS",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "itappens.ai | Global GEO & AEO Consultancy for B2B SaaS",
    description: siteConfig.description,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", rel: "shortcut icon" },
    ],
    apple: [
      { url: "/favicon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
};

import Auth0Provider from '@/components/providers/Auth0Provider';
import { Suspense } from 'react';
import JsonLd from "@/components/JsonLd";
import { organizationSchema, faqSchema, schemaGraph } from "@/lib/seo/schema";
import { buyerFaqs } from "@/lib/content/site";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteSchema = schemaGraph(
    organizationSchema(),
    faqSchema(buyerFaqs, "/")
  );

  return (
    <html lang="en-US">
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="AI Summary" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="Full AI Reference" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1, noarchive" />
        <JsonLd data={siteSchema} />
      </head>
      <body>
        <Auth0Provider>
          <Suspense fallback={<div className="min-h-screen bg-bg animate-pulse" />}>
            {children}
          </Suspense>
        </Auth0Provider>
      </body>
    </html>
  );
}
