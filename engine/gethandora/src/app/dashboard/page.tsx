import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CreditsDisplay from '@/components/CreditsDisplay'
import AuthStatus from '@/components/auth/AuthStatus'
import { GenerationForm } from '@/components/dashboard/GenerationForm'
import { Sparkles, LayoutDashboard, Settings, History, Plus } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('credits_remaining')
    .eq('id', user.id)
    .single()

  const credits = profile?.credits_remaining || 0

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold">Get<span className="text-blue-500">T</span>handora</span>
              </div>
              <div className="hidden md:flex gap-4">
                <a href="/dashboard" className="text-sm font-medium text-white flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </a>
                <a href="/dashboard/history" className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-2 px-3 py-2 transition-colors">
                  <History className="w-4 h-4" /> History
                </a>
                <a href="/dashboard/settings" className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-2 px-3 py-2 transition-colors">
                  <Settings className="w-4 h-4" /> Settings
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CreditsDisplay />
              <div className="h-6 w-px bg-slate-800" />
              <AuthStatus />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">My Content Engine</h1>
            <p className="text-slate-400">Transform your ideas into high-conversion social content packs.</p>
          </div>
          {credits === 0 && (
            <a href="/pricing" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-900/20 transition-all animate-pulse">
              <Plus className="w-5 h-5" /> Buy Credits
            </a>
          )}
        </div>

        <GenerationForm />
      </main>
    </div>
  )
}
