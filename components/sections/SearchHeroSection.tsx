'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SearchHeroSection() {
  const [domain, setDomain] = useState('');
  const [isProbing, setIsProbing] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    
    setIsProbing(true);
    
    // Simulate LLM Probing Delay
    setTimeout(() => {
      router.push(`/audit?domain=${encodeURIComponent(domain)}`);
    }, 3500);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-brand-bg">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Decorative Blob */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-brand-primary to-[#fc89e9] opacity-20 sm:opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      <div className="container relative z-10 max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-medium rounded-full text-brand-primary bg-brand-primary/10 border border-brand-primary/20">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary"></span>
            AEO & GEO Consultancy
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-brand-text mb-6">
            Make Agentic Search Your <span className="text-brand-primary">#1 Sales Channel.</span>
          </h1>
          <p className="text-xl text-brand-text-muted mb-10 max-w-2xl mx-auto font-light">
            Dominate Google AI Overviews, ChatGPT, Claude, and Perplexity. Audit your visibility and build content that gets cited.
          </p>

          {!isProbing ? (
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="relative flex flex-col sm:flex-row items-center bg-white p-2 rounded-2xl border border-brand-border shadow-lg">
                <div className="hidden sm:block pl-4 text-brand-text-muted">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                  type="text" 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="Enter your domain (e.g. yourbrand.com)"
                  className="w-full bg-transparent border-none px-4 py-4 text-lg text-brand-text focus:outline-none focus:ring-0 placeholder-gray-400"
                  required
                />
                <button 
                  type="submit" 
                  className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors whitespace-nowrap mt-2 sm:mt-0"
                >
                  Analyze Visibility
                </button>
              </div>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-brand-border shadow-lg"
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <h3 className="text-xl font-semibold text-brand-text animate-pulse">Probing LLMs...</h3>
                <p className="text-sm text-brand-text-muted">Fetching live citations from ChatGPT, Claude, and Perplexity for {domain}</p>
                
                <div className="w-full bg-brand-bg-muted h-2 rounded-full mt-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5, ease: "linear" }}
                    className="h-full bg-brand-primary"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
