export default function SemanticAnchorGenerator() {
  const codeMock = `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Brand",
  "url": "https://yourbrand.com",
  "logo": "https://yourbrand.com/logo.png",
  "sameAs": [
    "https://twitter.com/yourbrand",
    "https://linkedin.com/company/yourbrand"
  ],
  "knowsAbout": [
    "Artificial Intelligence",
    "Supply Chain Optimization",
    "Logistics Software"
  ],
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "4.9",
      "bestRating": "5"
    }
  }
}`;

  return (
    <div className="bg-[#1a1c23] rounded-lg border border-gray-700 shadow-sm p-5 h-full flex flex-col text-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white">Semantic Anchor Generator</h3>
        <button className="text-xs bg-[#2d303a] hover:bg-gray-700 px-3 py-1 rounded border border-gray-600 transition-colors">
          Copy JSON-LD
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Missing Schema detected. Inject this semantic anchor into your head tag to improve entity extraction across LLMs.
      </p>
      <div className="bg-black/50 p-4 rounded-md flex-1 overflow-x-auto border border-gray-800">
        <pre className="text-xs font-mono text-[#3abeF9] leading-relaxed">
          <code>{codeMock}</code>
        </pre>
      </div>
    </div>
  );
}
