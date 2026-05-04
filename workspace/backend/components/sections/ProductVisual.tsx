'use client'

import Image from 'next/image'

/**
 * Product Visual Component
 * 
 * Displays a screenshot or GIF of the dashboard using next/image for optimization.
 * Lazy-loaded to prevent blocking hero render.
 */

export default function ProductVisual() {
  return (
    <section className="section-spacing bg-gray-50">
      <div className="container-responsive">
        {/* Section Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="heading-secondary text-gray-900 mb-4">
            Intuitive Dashboard
          </h2>
          <p className="text-body text-gray-600 max-w-2xl mx-auto">
            See all your invoices at a glance. Track payments, send reminders, and get insights.
          </p>
        </div>

        {/* Product Image */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden shadow-2xl bg-white">
            <Image
              src="/assets/dashboard-preview.png"
              alt="itappens Dashboard Preview"
              fill
              className="object-cover"
              priority={false}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
            />
          </div>
        </div>

        {/* Fallback Text (if image doesn't load) */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Dashboard preview loading...
        </div>
      </div>
    </section>
  )
}
