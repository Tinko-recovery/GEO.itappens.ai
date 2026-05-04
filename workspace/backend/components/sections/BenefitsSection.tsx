'use client'

import BenefitCard from '@/components/ui/BenefitCard'

/**
 * Benefits Section Component
 * 
 * Three benefit cards with:
 * - Icon (using Unicode symbols)
 * - Title
 * - One-sentence description
 * - Responsive grid (3 columns desktop, 1 mobile)
 */

const benefits = [
  {
    id: 1,
    icon: '📋',
    title: 'Never Lose Track of an Invoice',
    description: 'Centralized dashboard shows all your invoices in one place, organized by status.',
  },
  {
    id: 2,
    icon: '⏰',
    title: 'Automatic Payment Reminders',
    description: 'Send automated follow-ups to clients before payment is due—reduce late payments by up to 40%.',
  },
  {
    id: 3,
    icon: '💰',
    title: 'Get Paid Faster',
    description: 'Track payment status in real-time and identify overdue invoices instantly.',
  },
]

export default function BenefitsSection() {
  return (
    <section
      id="features"
      className="section-spacing bg-white"
    >
      <div className="container-responsive">
        {/* Section Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="heading-secondary text-gray-900 mb-4">
            Why Choose itappens?
          </h2>
          <p className="text-body text-gray-600 max-w-2xl mx-auto">
            Designed to help small businesses and freelancers manage invoices effortlessly.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.id} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  )
}
