import { Check } from 'lucide-react';

interface PricingTier {
  name: string;
  description: string;
  price: string;
  billingPeriod: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlighted: boolean;
}

const tiers: PricingTier[] = [
  {
    name: 'Free Trial',
    description: 'Perfect for getting started',
    price: 'Free',
    billingPeriod: 'Forever free',
    features: [
      '5 invoices per month',
      'Basic dashboard',
      'Email support',
      '7-day payment reminders',
    ],
    ctaLabel: 'Start Free Trial',
    ctaHref: process.env.NEXT_PUBLIC_APP_SIGNUP_URL || '/signup',
    highlighted: false,
  },
  {
    name: 'Professional',
    description: 'For growing businesses',
    price: '$29',
    billingPeriod: '/month, billed annually',
    features: [
      'Unlimited invoices',
      'Advanced analytics & reports',
      'Priority email & chat support',
      'Automated payment reminders',
      'Team collaboration',
      'Custom branding',
    ],
    ctaLabel: 'Upgrade to Pro',
    ctaHref: process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || '/waitlist',
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="w-full py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Choose the plan that fits your business. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto mb-16">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative flex flex-col rounded-xl transition-all duration-200 ${
                tier.highlighted
                  ? 'ring-2 ring-primary-600 shadow-xl md:scale-105'
                  : 'border border-secondary-200 hover:shadow-lg'
              } ${tier.highlighted ? 'bg-gradient-to-b from-primary-50 to-white' : 'bg-white'} p-8`}
            >
              {/* Popular badge */}
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full bg-primary-600 text-white text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier name and description */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                  {tier.name}
                </h3>
                <p className="text-secondary-600 text-sm">
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-secondary-900">
                    {tier.price}
                  </span>
                </div>
                <p className="text-secondary-600 text-sm mt-2">
                  {tier.billingPeriod}
                </p>
              </div>

              {/* CTA Button */}
              <a
                href={tier.ctaHref}
                className={`block w-full py-3 rounded-lg font-semibold text-center transition-all duration-200 mb-8 ${
                  tier.highlighted
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                    : 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200'
                }`}
              >
                {tier.ctaLabel}
              </a>

              {/* Features list */}
              <div className="space-y-4 flex-grow">
                <p className="text-secondary-700 font-semibold text-sm uppercase tracking-wider">
                  What's included
                </p>
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ or bottom note */}
        <div className="text-center">
          <p className="text-secondary-600">
            Need a custom plan?{' '}
            <a href="mailto:hello@invoiceapp.com" className="text-primary-600 font-semibold hover:text-primary-700">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
