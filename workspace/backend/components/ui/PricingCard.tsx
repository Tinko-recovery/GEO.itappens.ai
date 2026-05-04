'use client'

/**
 * Pricing Card Component
 * 
 * Reusable card for displaying a single pricing tier:
 * - Name
 * - Price
 * - Features list
 * - CTA button linking to eng_1's /signup
 */

interface PricingCardProps {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  highlighted,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-lg p-8 transition-all duration-300 ${
        highlighted
          ? 'bg-blue-50 border-2 border-blue-600 shadow-lg'
          : 'bg-gray-50 border-2 border-gray-200'
      }`}
    >
      {/* Highlight Badge */}
      {highlighted && (
        <div className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
          Most Popular
        </div>
      )}

      {/* Tier Name */}
      <h3 className="heading-tertiary text-gray-900 mb-2">{name}</h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-6">{description}</p>

      {/* Price */}
      <div className="mb-6">
        <p className="text-4xl font-bold text-gray-900">{price}</p>
        <p className="text-sm text-gray-600">{period}</p>
      </div>

      {/* Features List */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-3">✓</span>
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <a
        href="https://app.itappens.ai/signup"
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full inline-block text-center py-3 px-6 font-semibold rounded-lg transition-colors ${
          highlighted
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
        }`}
      >
        {cta}
      </a>
    </div>
  )
}
