'use client'

/**
 * Benefit Card Component
 * 
 * Reusable card for displaying a single benefit:
 * - Icon
 * - Title
 * - Description
 */

interface BenefitCardProps {
  icon: string
  title: string
  description: string
}

export default function BenefitCard({
  icon,
  title,
  description,
}: BenefitCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300 animate-slideInUp">
      {/* Icon */}
      <div className="text-5xl mb-4">{icon}</div>

      {/* Title */}
      <h3 className="heading-tertiary text-gray-900 mb-3">{title}</h3>

      {/* Description */}
      <p className="text-body text-gray-600">{description}</p>
    </div>
  )
}
