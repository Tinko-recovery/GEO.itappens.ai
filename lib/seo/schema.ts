import type { FaqItem, HowToStep } from "@/lib/content/site";

import { siteConfig } from "@/lib/content/site";
import { absoluteUrl } from "@/lib/seo/metadata";

type Schema = Record<string, unknown>;

type ServiceInput = {
  name: string;
  description: string;
  path: string;
};

type ArticleInput = {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
};

type HowToInput = {
  name: string;
  description: string;
  path: string;
  steps: HowToStep[];
};

export function organizationSchema(): Schema {
  return {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/favicon.svg`,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    sameAs: siteConfig.sameAs,
    areaServed: "Worldwide",
    foundingDate: "2025",
    knowsAbout: siteConfig.knowsAbout,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    founder: {
      "@type": "Person",
      name: "Sadish Sugumaran",
      jobTitle: "Founder & Principal",
      sameAs: [
        "https://www.linkedin.com/in/sadish-sugumaran-a890b016/"
      ]
    }
  };
}

export function serviceSchema(input: ServiceInput): Schema {
  return {
    "@type": "Service",
    serviceType: input.name,
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: {
      "@id": `${siteConfig.url}/#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: siteConfig.country,
    },
  };
}

export function faqSchema(items: FaqItem[], path?: string): Schema {
  return {
    "@type": "FAQPage",
    mainEntityOfPage: path ? { "@id": absoluteUrl(path) } : undefined,
    mainEntity: items.map((item, index) => ({
      "@type": "Question",
      "@id": path ? `${absoluteUrl(path)}#q${index + 1}` : undefined,
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        "@id": path ? `${absoluteUrl(path)}#a${index + 1}` : undefined,
        text: item.answer,
      },
    })),
  };
}

export function articleSchema(input: ArticleInput): Schema {
  return {
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: absoluteUrl(input.path),
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    mainEntityOfPage: absoluteUrl(input.path),
    author: {
      "@type": "Person",
      name: "Sadish Sugumaran",
      jobTitle: "Founder & Principal",
      sameAs: [
        "https://www.linkedin.com/in/sadish-sugumaran-a890b016/"
      ]
    },
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
  };
}

export function howToSchema(input: HowToInput): Schema {
  return {
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    step: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: step.url ? absoluteUrl(step.url) : undefined,
    })),
  };
}

export function breadcrumbSchema(items: { name: string; item: string }[]): Schema {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": absoluteUrl(item.item),
    })),
  };
}

export function schemaGraph(...nodes: Schema[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
