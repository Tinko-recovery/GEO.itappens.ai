'use client'

import PricingCard from '@/components/ui/PricingCard'

/**
 * Pricing Section Component
 * 
 * Two-tier pricing layout:
 * - Free tier (Free during beta)
 * - Pro tier (Custom pricing, contact us)
 * 
 * Both tiers link to eng_1's /signup endpoint.
 */

const pricingTiers = [
  {
    id: 1,
    name: 'Free',
    price: '$0',
    period: 'Forever',
    description: 'Perfect for getting started',
    features: [
      'Up to 50 invoices/month',
      'Basic invoice tracking',
      'Email support',
      'Community access',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    id: 2,
    name: 'Pro',
    price: 'Custom',
    period: 'Contact us',
    description: 'For growing businesses',
    features: [
      'Unlimited invoices',
      'Advanced analytics',
      'Payment integrations',
      'Priority support',
      'Custom branding',
    ],
    cta: 'Talk to Sales',
    highlighted: true,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="section-spacing bg-white">
      <div className="container-responsive">
        {/* Section Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="heading-secondary text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-body text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade as you grow. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.id} {...tier} />
          ))}
        </div>
      </div>
    </section>
  )
}
