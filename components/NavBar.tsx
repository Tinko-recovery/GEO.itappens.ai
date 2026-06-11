'use client';

import { useEffect, useState } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import BrandLogo from "./BrandLogo";
import { primaryNav } from "@/lib/content/site";

export default function NavBar({ logoSuffix }: { logoSuffix?: string }) {
  const { user, isLoading } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 border-b ${
        scrolled ? 'bg-white/95 backdrop-blur-md border-brand-border py-3 shadow-sm' : 'bg-white border-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="no-underline" onClick={() => setMobileMenuOpen(false)}>
            <BrandLogo color="var(--brand-text)" suffix={logoSuffix} />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors ${
                isActive(link.href) ? 'text-brand-primary' : 'text-brand-text hover:text-brand-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoading && (
            user ? (
              <Link href="/itcontents" className="btn-primary py-2 px-4 text-sm rounded-lg">
                Dashboard
              </Link>
            ) : (
              <Link href="/audit" className="btn-primary py-2 px-4 text-sm rounded-lg">
                Start Free Audit
              </Link>
            )
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button 
            className="p-2 text-brand-text focus:outline-none" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-brand-border shadow-lg p-4 flex flex-col gap-4">
          {primaryNav.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)} 
              className={`text-base font-semibold py-2 ${
                isActive(link.href) ? 'text-brand-primary' : 'text-brand-text'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-brand-border flex flex-col">
            <Link href="/audit" className="btn-primary w-full justify-center" onClick={() => setMobileMenuOpen(false)}>
              Start Free Audit
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
