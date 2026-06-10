import { Key, Bot, Mail, CreditCard, Lock, Globe } from "lucide-react";

export default function SettingsPage() {
  const settingsBlocks = [
    {
      title: "Anthropic / Claude API",
      description: "Powers the Strategy Generation and Content Automation engines.",
      icon: <Bot className="w-5 h-5 text-indigo-400" />,
      status: process.env.ANTHROPIC_API_KEY ? "Connected" : "Missing Key",
      statusColor: process.env.ANTHROPIC_API_KEY ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
    },
    {
      title: "Firecrawl API",
      description: "Real-time web scraping for AEO citations and schema mapping.",
      icon: <Globe className="w-5 h-5 text-amber-400" />,
      status: process.env.FIRECRAWL_API_KEY ? "Connected" : "Missing Key",
      statusColor: process.env.FIRECRAWL_API_KEY ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
    },
    {
      title: "DataForSEO API",
      description: "Enterprise search engine tracking and keyword visibility data.",
      icon: <Key className="w-5 h-5 text-blue-400" />,
      status: (process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD) ? "Connected" : "Missing Credentials",
      statusColor: (process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD) ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
    },
    {
      title: "Resend Mail API",
      description: "Automated report delivery to clients.",
      icon: <Mail className="w-5 h-5 text-rose-400" />,
      status: process.env.RESEND_API_KEY ? "Connected" : "Missing Key",
      statusColor: process.env.RESEND_API_KEY ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"
    },
    {
      title: "Stripe Billing",
      description: "Credit-based monetization system for Agencies.",
      icon: <CreditCard className="w-5 h-5 text-purple-400" />,
      status: process.env.STRIPE_SECRET_KEY ? "Connected" : "Not Configured",
      statusColor: process.env.STRIPE_SECRET_KEY ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-400 bg-zinc-800"
    }
  ];

  return (
    <div className="p-8 text-white max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Platform Settings</h1>
        <p className="text-zinc-400">Manage your White-Label Agency connections and API limits.</p>
      </div>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">API Integrations</h2>
            <p className="text-sm text-zinc-500">Your core engine connections.</p>
          </div>
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Manage Keys
          </button>
        </div>
        
        <div className="divide-y divide-zinc-800">
          {settingsBlocks.map((block, idx) => (
            <div key={idx} className="p-6 flex items-start justify-between hover:bg-zinc-800/30 transition-colors">
              <div className="flex gap-4">
                <div className="mt-1 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                  {block.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{block.title}</h3>
                  <p className="text-sm text-zinc-400">{block.description}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${block.statusColor}`}>
                {block.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
