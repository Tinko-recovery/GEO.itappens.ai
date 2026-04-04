import type { Metadata } from "next";

import "./globals.css";
import "./pillar1.css";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
