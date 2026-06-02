export default function LLMProofWidget() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">LLM Threat Assessment (Proof)</h3>
        <span className="text-xs text-gray-500">Query: "Best Solutions in [Industry]"</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* ChatGPT Mock */}
        <div className="bg-gray-50 rounded border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">C</div>
            <span className="text-sm font-semibold text-gray-700">ChatGPT (GPT-4o)</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-gray-300 pl-3">
            "...While many companies offer services in this space, <strong className="bg-yellow-100 text-yellow-800 px-1 rounded">Competitor X</strong> and <strong className="bg-yellow-100 text-yellow-800 px-1 rounded">Competitor Y</strong> are widely recognized as industry leaders due to their recent integrations. (Note: Your brand is completely hallucinated or missing here)."
          </p>
        </div>

        {/* Perplexity Mock */}
        <div className="bg-gray-50 rounded border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">P</div>
            <span className="text-sm font-semibold text-gray-700">Perplexity AI</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-gray-300 pl-3">
            "Based on recent sources, <strong className="bg-yellow-100 text-yellow-800 px-1 rounded">Competitor X</strong> dominates the market <span className="text-xs text-blue-500 cursor-pointer">[1]</span><span className="text-xs text-blue-500 cursor-pointer">[2]</span>. There is limited authoritative information available to confirm if other brands offer the same level of capability."
          </p>
        </div>
      </div>
    </div>
  );
}
