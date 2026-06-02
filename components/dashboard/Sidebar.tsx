import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#1a1c23] text-gray-300 flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-700">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          itappens<span className="text-[#3abeF9]">.ai</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        {/* Toolkit 1: Audit & Insight */}
        <div className="mb-6 px-4">
          <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Audit & Insight</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/dashboard" className="block px-2 py-2 text-sm rounded-md bg-[#2d303a] text-white font-medium">
                AI Visibility Audit
              </Link>
            </li>
            <li>
              <Link href="#" className="block px-2 py-2 text-sm rounded-md hover:bg-[#2d303a] hover:text-white transition-colors">
                Competitor Positioning
              </Link>
            </li>
          </ul>
        </div>

        {/* Toolkit 2: Semantic Engineering */}
        <div className="mb-6 px-4">
          <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Semantic Engineering</h3>
          <ul className="space-y-1">
            <li>
              <Link href="#" className="block px-2 py-2 text-sm rounded-md hover:bg-[#2d303a] hover:text-white transition-colors">
                Anchor Generator
              </Link>
            </li>
            <li>
              <Link href="#" className="block px-2 py-2 text-sm rounded-md hover:bg-[#2d303a] hover:text-white transition-colors">
                Schema GAP Analysis
              </Link>
            </li>
          </ul>
        </div>

        {/* Toolkit 3: Strategy Builder */}
        <div className="px-4">
          <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Strategy Builder</h3>
          <ul className="space-y-1">
            <li>
              <Link href="#" className="block px-2 py-2 text-sm rounded-md hover:bg-[#2d303a] hover:text-white transition-colors">
                Implementation Roadmap
              </Link>
            </li>
            <li>
              <Link href="/nimda" className="block px-2 py-2 text-sm rounded-md hover:bg-[#2d303a] hover:text-white transition-colors">
                Lead CRM (Admin)
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="bg-[#2d303a] rounded-md p-3 flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-2">Need Help?</span>
          <button className="w-full bg-[#3abeF9] hover:bg-blue-400 text-[#1a1c23] text-sm font-semibold py-1.5 rounded transition-colors">
            Book Retainer Call
          </button>
        </div>
      </div>
    </aside>
  );
}
