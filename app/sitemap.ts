import type { MetadataRoute } from "next";

import { answerPages } from "@/lib/content/answers";
import { siteConfig } from "@/lib/content/site";

const staticRoutes = [
  "",
  "/geo",
  "/how-it-works",
  "/case-studies",
  "/answers",
  "/blog",
  "/faq",
  "/insights",
  "/privacy",
  "/itcontents",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  const answerEntries = answerPages.map((page) => ({
    url: `${siteConfig.url}/answers/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...staticEntries, ...answerEntries];
}
