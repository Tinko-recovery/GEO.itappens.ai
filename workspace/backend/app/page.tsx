import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import BenefitsSection from '@/components/sections/BenefitsSection'
import ProductVisual from '@/components/sections/ProductVisual'
import PricingSection from '@/components/sections/PricingSection'
import WaitlistSection from '@/components/sections/WaitlistSection'

/**
 * Landing Page - Root Route (/)
 * 
 * Assembles all sections into a single-page marketing landing page.
 * Static generation (SSG) for optimal performance.
 */

export const dynamic = 'force-static'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <HeroSection />
        <BenefitsSection />
        <ProductVisual />
        <PricingSection />
        <WaitlistSection />
      </main>

      <Footer />
    </div>
  )
}
