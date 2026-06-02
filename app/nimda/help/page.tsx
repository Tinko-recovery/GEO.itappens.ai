import React from 'react';

export default function HelpGuidePage() {
  return (
    <div className="min-h-screen bg-[#f4f5f9] p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-sm border border-gray-200">
        
        <header className="mb-12 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">GEO Command Center: Official Product Guide</h1>
          <p className="text-gray-500 text-lg">A comprehensive manual for operating the itappens.ai platform and Universal Lead OS.</p>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[#1a1c23] mb-4 flex items-center">
            <span className="bg-[#3abeF9] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 shadow-md">1</span>
            Platform Overview
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The GEO Command Center is designed to transition users from a "curious prospect" into a high-ticket retainer client with zero human touch. It acts as an automated sales engineer, proving to brands that they are losing visibility on AI Answer Engines (ChatGPT, Perplexity, Claude) and capturing their contact information in exchange for the solution.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[#1a1c23] mb-4 flex items-center">
            <span className="bg-[#3abeF9] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 shadow-md">2</span>
            The Lead Capture Flow (Organic)
          </h2>
          <div className="bg-blue-50 border-l-4 border-[#3abeF9] p-5 rounded-r-md text-gray-700 mb-4">
            <h3 className="font-bold mb-2">Step-by-Step User Journey:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>The Hook:</strong> A prospect visits the homepage and sees the massive "AI Visibility Search" bar.</li>
              <li><strong>Engagement:</strong> They enter their domain (e.g., <code className="bg-white px-1 py-0.5 rounded border border-gray-200 text-xs">brand.com</code>) and click Search.</li>
              <li><strong>Anticipation:</strong> The system triggers a 3.5-second "Probing LLMs..." animation, establishing technical authority.</li>
              <li><strong>The Paywall:</strong> They are routed to the Dashboard. The top metrics are visible, but the actionable data (Semantic Anchors, LLM Proofs) is blurred out.</li>
              <li><strong>Conversion:</strong> To unlock the full report, they must submit their work email. This submission hits the Universal Lead API.</li>
            </ol>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[#1a1c23] mb-4 flex items-center">
            <span className="bg-[#3abeF9] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 shadow-md">3</span>
            The Universal Lead OS (Backend)
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The platform is powered by a multi-source database architecture. Instead of just relying on Apollo, the system tracks leads from multiple origins.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-800 mb-2">API Endpoint: <code className="text-[#3abeF9]">POST /api/leads</code></h4>
            <p className="text-sm text-gray-600 mb-3">You can pipe leads into this endpoint from Zapier, Make.com, or Apollo Webhooks. Required fields: <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">name</code>, <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">email</code>, <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">company</code>.</p>
            <h4 className="font-semibold text-gray-800 mb-2 mt-4">Prisma Database Fields:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li><strong>source:</strong> Tracks where the lead came from (organic_search, apollo, linkedin).</li>
              <li><strong>automationStatus:</strong> Tracks the current lifecycle (pending, scoring, nurturing, converted).</li>
              <li><strong>enrichedData:</strong> Stores JSON data like company revenue and employee headcount.</li>
              <li><strong>competitors:</strong> An array of competitor domains used to trigger FOMO alerts.</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[#1a1c23] mb-4 flex items-center">
            <span className="bg-[#3abeF9] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 shadow-md">4</span>
            Understanding the Dashboard Widgets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-800 mb-1">AI Visibility Audit</h3>
              <p className="text-sm text-gray-600">A visual health score that breaks down Technical Signals, Semantic Anchors, and Entity Associations. Designed to highlight critical failures immediately.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-800 mb-1">SEO vs. GEO Comparison</h3>
              <p className="text-sm text-gray-600">A bar chart proving that while a brand might have strong Traditional SEO traffic, they are losing entirely on AI Answer Engines.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-800 mb-1">Semantic Anchor Generator</h3>
              <p className="text-sm text-gray-600">A code-box widget that generates the exact JSON-LD schema the brand needs. This acts as the "solution" teased behind the paywall.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-800 mb-1">LLM Proof Widget (FOMO)</h3>
              <p className="text-sm text-gray-600">Shows side-by-side outputs from ChatGPT and Perplexity, explicitly pointing out where the AI is hallucinating or recommending a competitor instead of the user's brand.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#1a1c23] mb-4 flex items-center">
            <span className="bg-[#3abeF9] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 shadow-md">5</span>
            Next Steps & Roadmap
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Currently, leads are being stored directly in the PostgreSQL database. In Phase 2, we recommend building out the `/nimda` administrative CRM interface to view these leads, trigger manual FOMO email alerts, and manage the automated "Nurture" sequences based on the `enrichedData`.
          </p>
        </section>

      </div>
    </div>
  );
}
