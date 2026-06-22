import type { MetadataRoute } from "next";

import { answerPages } from "@/lib/content/answers";
import { caseStudies } from "@/lib/content/caseStudies";
import { siteConfig } from "@/lib/content/site";
import { getSortedPostsData } from "@/lib/blog";

const staticRoutes = [
  "",
  "/about",
  "/aeo",
  "/geo",
  "/geo-guide",
  "/how-it-works",
  "/content-clusters",
  "/citation-authority",
  "/case-studies",
  "/answers",
  "/blog",
  "/faq",
  "/insights",
  "/privacy",
  "/itcontents",
  "/solutions/visible-in-ai",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const caseEntries = caseStudies.map((study) => ({
    url: `${siteConfig.url}/case-studies/${study.slug}`,
    lastModified: new Date(study.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  let blogEntries: any[] = [];
  try {
    const posts = await getSortedPostsData();
    blogEntries = posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  } catch (err) {
    console.error("Failed to load blog sitemap entries:", err);
  }

  return [...staticEntries, ...answerEntries, ...caseEntries, ...blogEntries];
}
