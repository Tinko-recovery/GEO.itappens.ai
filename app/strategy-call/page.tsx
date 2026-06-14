import type { Metadata } from "next";
import { Suspense } from "react";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Book a Strategy Call | itappens.ai",
  description: "Schedule your free 30-minute AEO strategy session with our technical SEO and AI discovery experts.",
};

export default function StrategyCallPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-brand-text bg-brand-bg">
      <Suspense fallback={<div className="h-20 bg-white animate-pulse" />}>
        <NavBar />
      </Suspense>
      
      <main className="flex-grow pt-24 pb-32">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 mb-6 text-sm font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 rounded-full uppercase tracking-wider">
              Take Action
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-text mb-6">
              Book Your Strategy Call
            </h1>
            <p className="text-xl text-brand-text-muted max-w-2xl mx-auto leading-relaxed">
              Let's review your AEO audit together and build a concrete roadmap for dominating AI answer engines like ChatGPT, Perplexity, and Gemini.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-brand-border overflow-hidden">
            <div className="grid md:grid-cols-5 h-[700px]">
              
              {/* Left Sidebar Info */}
              <div className="hidden md:block col-span-2 bg-brand-bg-muted p-10 border-r border-brand-border">
                <h3 className="text-2xl font-bold mb-4 text-brand-primary">What to expect</h3>
                <ul className="space-y-8 text-brand-text-muted mt-8">
                  <li className="flex items-start">
                    <div className="text-brand-text font-bold mr-4 mt-0.5">1</div>
                    <p>Deep dive into your custom AEO audit and current visibility scores.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-brand-text font-bold mr-4 mt-0.5">2</div>
                    <p>Analysis of your competitors' technical SEO footprints in AI engines.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-brand-text font-bold mr-4 mt-0.5">3</div>
                    <p>A custom 90-day action plan to build authority and trigger citations.</p>
                  </li>
                </ul>

                <div className="mt-16">
                  <p className="text-sm text-brand-text-muted mb-4">Embed your Calendly, HubSpot, or Cal.com booking link right here.</p>
                  <input type="text" placeholder="Paste Link Here" className="w-full px-4 py-3 border border-brand-border rounded-lg bg-white" disabled />
                </div>
              </div>

              {/* Right Calendar Area */}
              <div className="col-span-5 md:col-span-3 p-0 md:p-8 bg-white flex flex-col h-full overflow-y-auto">
                
                {/* Testimonial moved to top right */}
                <div className="mb-8 p-6 bg-white rounded-xl border border-brand-border shadow-sm">
                  <p className="italic text-sm text-brand-text-muted mb-4">
                    "The strategy call completely changed how we view our content architecture. We saw a 300% increase in Perplexity citations within 2 months."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-blue-400 mr-3"></div>
                    <div>
                      <p className="font-bold text-sm">Sarah Jenkins</p>
                      <p className="text-xs text-brand-text-muted">CMO, TechFlow SaaS</p>
                    </div>
                  </div>
                </div>

                {/* Calendar Placeholder */}
                <div className="flex-grow w-full border-2 border-dashed border-brand-border rounded-xl flex flex-col items-center justify-center p-8 bg-brand-bg/30">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Calendar Integration</h3>
                  <p className="text-brand-text-muted text-center max-w-sm mb-6">
                    This box will be replaced by the interactive calendar once we embed the link.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Suspense fallback={<div className="h-40 bg-brand-bg-muted" />}>
        <SiteFooter />
      </Suspense>
    </div>
  );
}
