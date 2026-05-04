import { Mail, Twitter, Linkedin, Github } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

const socialLinks: SocialLink[] = [
  {
    icon: Twitter,
    href: 'https://twitter.com/invoicetracker',
    label: 'Twitter',
  },
  {
    icon: Linkedin,
    href: 'https://linkedin.com/company/invoicetracker',
    label: 'LinkedIn',
  },
  {
    icon: Github,
    href: 'https://github.com/invoicetracker',
    label: 'GitHub',
  },
  {
    icon: Mail,
    href: 'mailto:hello@invoiceapp.com',
    label: 'Email',
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-secondary-900 text-secondary-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 pb-16 border-b border-secondary-800">
          {/* Brand section */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white">Invoice Tracker</h3>
              <p className="text-secondary-400 text-sm mt-2">
                Get paid faster with simple invoice tracking.
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                {navLinks.slice(0, 2).map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-secondary-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {navLinks.slice(2).map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-secondary-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:hello@invoiceapp.com"
                    className="text-secondary-400 hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#waitlist"
                    className="text-secondary-400 hover:text-white transition-colors duration-200"
                  >
                    Waitlist
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Copyright */}
          <div>
            <p className="text-secondary-400 text-sm">
              &copy; {currentYear} Invoice Tracker. All rights reserved.
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-400 hover:text-white transition-colors duration-200"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Secondary CTA */}
        <div className="mt-16 pt-16 border-t border-secondary-800 text-center">
          <p className="text-secondary-400 mb-4">Still deciding?</p>
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors duration-200"
          >
            Join the Waitlist
          </a>
        </div>
      </div>
    </footer>
  );
}
