import { PricingSection } from '@/components/PricingSection'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Sparkles, ArrowLeft } from 'lucide-react'

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <a href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
                <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold">Get<span className="text-blue-500">T</span>handora</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-10">
        <PricingSection />
      </main>
    </div>
  )
}
