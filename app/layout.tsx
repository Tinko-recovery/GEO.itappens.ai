import type { Metadata } from "next";

import "./globals.css";

import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "itappens.ai | India's First AEO/GEO Solution Provider",
    template: "%s | itappens.ai",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: siteConfig.url,
  },
  keywords: [
    "GEO agency India",
    "AEO consultant India",
    "how to get cited by AI in India",
    "llms.txt generation",
    "schema for AI search visibility",
    "AI content automation India",
  ],
  openGraph: {
    title: "itappens.ai | India's First AEO/GEO Solution Provider",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "itappens.ai | India's First AEO/GEO Solution Provider",
    description: siteConfig.description,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

import Auth0Provider from '@/components/providers/Auth0Provider';
import { Suspense } from 'react';
import JsonLd from "@/components/JsonLd";
import { organizationSchema } from "@/lib/seo/schema";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="AI Summary" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="Full AI Reference" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1, noarchive" />
      </head>
      <body>
        <JsonLd data={organizationSchema()} />
        <Auth0Provider>
          <Suspense fallback={<div className="min-h-screen bg-bg animate-pulse" />}>
            {children}
          </Suspense>
        </Auth0Provider>
      </body>
    </html>
  );
}
