import Link from "next/link";
import { primaryNav, siteConfig } from "@/lib/content/site";
import BrandLogo from "./BrandLogo";

export default function SiteFooter() {
  return (
    <footer className="bg-brand-bg-muted text-brand-text border-t border-brand-border py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-12 md:gap-20">
        <div className="md:w-1/3">
          <Link href="/" className="inline-block mb-6 no-underline">
            <BrandLogo color="var(--brand-text)" />
          </Link>
          <p className="text-base leading-relaxed text-brand-text-muted max-w-sm">
            The Global Authority in Generative Engine Optimization. We help B2B SaaS brands become the primary cited authority in the AI era.
          </p>
        </div>
        
        <div className="md:w-1/4">
          <h4 className="text-sm font-bold mb-6 uppercase tracking-wider text-brand-text">Pillars & Solutions</h4>
          <ul className="flex flex-col gap-3 list-none p-0">
            <li>
              <Link href="/aeo" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                AEO Guide (Answer Engine)
              </Link>
            </li>
            <li>
              <Link href="/geo" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                GEO Framework (Generative)
              </Link>
            </li>
            <li>
              <Link href="/content-clusters" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                AI Content Clusters
              </Link>
            </li>
            <li>
              <Link href="/citation-authority" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                Citation Authority Building
              </Link>
            </li>
            <li>
              <Link href="/solutions/visible-in-ai" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                AI Visibility Program
              </Link>
            </li>
            <li>
              <Link href="/case-studies" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                Case Proofs
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:w-1/4">
          <h4 className="text-sm font-bold mb-6 uppercase tracking-wider text-brand-text">Resources & Crawling</h4>
          <ul className="flex flex-col gap-3 list-none p-0">
            <li>
              <Link href="/blog" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                GEO Blog
              </Link>
            </li>
            <li>
              <Link href="/answers" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                AI Answers Hub
              </Link>
            </li>
            <li>
              <Link href="/geo-guide" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                2026 GEO Guide
              </Link>
            </li>
            <li>
              <Link href="/insights" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                GEO vs SEO Insights
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                Service FAQ
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                How It Works
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:w-1/4">
          <h4 className="text-sm font-bold mb-6 uppercase tracking-wider text-brand-text">Company</h4>
          <ul className="flex flex-col gap-3 list-none p-0">
            <li>
              <Link href="/about" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/audit" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                Request Free Audit
              </Link>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="text-[15px] font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors no-underline">
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a href={siteConfig.sameAs[0]} target="_blank" rel="noreferrer" className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-brand-text-muted">
          &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-sm text-brand-text-muted hover:text-brand-text transition-colors no-underline">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
