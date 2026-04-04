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
    url: siteConfig.url,
    logo: `${siteConfig.url}/favicon.svg`,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    sameAs: siteConfig.sameAs,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressCountry: "IN",
    },
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

export function faqSchema(items: FaqItem[]): Schema {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
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
      "@id": `${siteConfig.url}/#organization`,
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

export function schemaGraph(...nodes: Schema[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
