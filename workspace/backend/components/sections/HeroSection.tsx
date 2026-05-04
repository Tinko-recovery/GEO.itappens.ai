'use client'

/**
 * Hero Section Component
 * 
 * Above-the-fold section with:
 * - Bold headline (value prop)
 * - Single-sentence subheadline
 * - Primary CTA button linking to eng_1's /signup
 * - Responsive design (mobile-first)
 */

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-white py-20 md:py-32 lg:py-40">
      <div className="container-responsive">
        <div className="max-w-3xl mx-auto text-center animate-slideInUp">
          {/* Headline */}
          <h1 className="heading-primary mb-6 text-gray-900">
            Never Lose Track of Your Invoices
          </h1>

          {/* Subheadline */}
          <p className="text-body text-gray-600 mb-8 md:mb-10">
            Know exactly who owes you and get paid faster with intelligent invoice tracking.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.itappens.ai/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block text-center"
            >
              Start Free Trial
            </a>
            <a
              href="#features"
              className="btn-secondary inline-block text-center"
            >
              Learn More
            </a>
          </div>

          {/* Trust Badge (Optional) */}
          <p className="text-sm text-gray-500 mt-8">
            ✓ No credit card required • ✓ 14-day free trial
          </p>
        </div>
      </div>
    </section>
  )
}
