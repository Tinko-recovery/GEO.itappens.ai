import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signInWithGoogle } from '@/app/auth/actions'
import { PricingSection } from '@/components/PricingSection'
import { Sparkles, Zap, ShieldCheck, ArrowRight, Quote, Linkedin, Instagram } from 'lucide-react'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">
                Get<span className="text-blue-500">T</span>handora
              </span>
            </div>
            <form action={signInWithGoogle}>
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border border-slate-700">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-4 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
          
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Stop staring at a <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
                blank screen.
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              The ultimate content engine for LinkedIn, X, and Instagram. 
              Generate viral posts and pixel-perfect images in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <form action={signInWithGoogle}>
                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                  Get Started for Free <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-500" /> No credit card required
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> 1 Free generation
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-20 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Claude 3.5 Sonnet',
                  desc: 'High-converting copy that sounds uniquely like your brand voice.',
                  icon: Sparkles
                },
                {
                  title: 'DALL-E 3 Images',
                  desc: 'Bespoke, professional visuals generated for every single post.',
                  icon: Sparkles
                },
                {
                  title: 'One-Click Publishing',
                  desc: 'Integrate with Buffer and push to all social channels instantly.',
                  icon: Zap
                }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-colors">
                  <f.icon className="w-10 h-10 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-slate-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof — KR Inn Sample */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">Real Output. Real Brands.</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                See what Thandora created for <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">KR Inn, Coorg</span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                One topic. One click. Four platform-ready posts and a custom AI image — generated in under 30 seconds.
              </p>
            </div>

            {/* Input pill */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                <p className="text-slate-300 text-sm">
                  <span className="text-slate-500 font-medium">Topic: </span>
                  "Why boutique stays in Coorg are winning over luxury hotel chains in 2024"
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* LinkedIn Post */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-colors">
                <div className="bg-slate-800/60 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Linkedin className="w-3.5 h-3.5 text-blue-500" /> LinkedIn Personal
                </div>
                <div className="p-6 text-slate-300 text-sm leading-relaxed">
                  <p>The hospitality industry is going through a silent revolution — and most big hotel chains are missing it entirely.</p>
                  <br />
                  <p>At <strong className="text-white">KR Inn, Coorg</strong>, we don't compete on square footage or lobby chandeliers.</p>
                  <br />
                  <p>We compete on something no 5-star can buy:</p>
                  <p className="text-blue-400 font-medium mt-2">👉 Waking up to mist over coffee estates.<br />
                  👉 A host who remembers your name (and your dietary restrictions).<br />
                  👉 A fire pit, a hammock, and genuine silence.</p>
                  <br />
                  <p className="text-slate-400">Travellers in 2024 aren't looking for uniformity. They want authenticity. Are you offering it?</p>
                  <p className="text-slate-500 text-xs mt-4">#Coorg #BoutiqueHospitality #TravelIndia #KRInn</p>
                </div>
              </div>

              {/* Instagram Post */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-pink-500/40 transition-colors">
                <div className="bg-slate-800/60 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" /> Instagram Caption
                </div>
                <div className="p-6 text-slate-300 text-sm leading-relaxed">
                  <p>Mist. Coffee. Silence.</p>
                  <p className="text-slate-400 mt-1">That's what awaits you at KR Inn, nestled in the heart of Coorg.</p>
                  <br />
                  <p>While big hotels offer uniformity, we offer an experience that actually stays with you long after checkout.</p>
                  <br />
                  <p className="text-pink-400">✨ Handcrafted breakfasts<br />
                  🌿 Estate walks at dawn<br />
                  ☕ Filter coffee that actually tastes like Coorg</p>
                  <br />
                  <p className="text-slate-400">Book your escape. Link in bio.</p>
                  <p className="text-slate-500 text-xs mt-4">#KRInn #Coorg #BoutiqueHotel #CoorHills #IndiaTravel #WeekendGetaway</p>
                </div>
              </div>

              {/* Twitter Post */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-500/40 transition-colors">
                <div className="bg-slate-800/60 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span className="text-slate-300 font-bold text-base leading-none">𝕏</span> Twitter / X
                </div>
                <div className="p-6 text-slate-300 text-sm leading-relaxed">
                  <p>Big hotels sell rooms. Boutique stays sell <em>stories</em>.</p>
                  <br />
                  <p>At KR Inn, Coorg — every guest leaves with one they'll tell for years.</p>
                  <br />
                  <p className="text-slate-400">The era of cookie-cutter travel is ending. Authenticity wins. 🏡</p>
                  <p className="text-slate-500 text-xs mt-4">#BoutiqueTravel #Coorg #KRInn</p>
                </div>
              </div>

              {/* AI Image placeholder */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-colors">
                <div className="bg-slate-800/60 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> DALL-E 3 Image Generated
                </div>
                <div className="aspect-square bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 relative flex items-center justify-center">
                  <div className="text-center px-8">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-indigo-400" />
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      "A misty Coorg coffee estate at sunrise, seen from a wooden boutique cottage deck, warm golden light, cinematic photography"
                    </p>
                    <p className="text-xs text-indigo-400 mt-3 font-medium">Auto-generated image prompt</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-16 max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
              <Quote className="w-8 h-8 text-blue-500/40 mx-auto mb-4" />
              <p className="text-slate-300 text-lg leading-relaxed italic mb-6">
                "We used to spend hours every week on social content. GetThandora cut that to 5 minutes. Our LinkedIn engagement went up 3x in the first month."
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  KR
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-sm">Kiran R.</p>
                  <p className="text-slate-500 text-xs">Owner, KR Inn — Coorg</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PricingSection />
      </main>

      <footer className="border-t border-slate-900 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">© 2024 GetThandora. Built by itappens.ai</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-blue-400">Terms</a>
            <a href="#" className="hover:text-blue-400">Privacy</a>
            <a href="https://itappens.ai" className="hover:text-amber-500 font-medium">Powered by itappens.ai</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
