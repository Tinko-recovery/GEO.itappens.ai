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
          <h4 className="text-sm font-bold mb-6 uppercase tracking-wider text-brand-text">Solutions</h4>
          <ul className="flex flex-col gap-3 list-none p-0">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[15px] text-brand-text-muted hover:text-brand-primary transition-colors no-underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:w-1/4">
          <h4 className="text-sm font-bold mb-6 uppercase tracking-wider text-brand-text">Contact</h4>
          <ul className="flex flex-col gap-3 list-none p-0">
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
          <Link href="/terms" className="text-sm text-brand-text-muted hover:text-brand-text transition-colors no-underline">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
