import { createClient } from "./actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SubmitButton from "@/components/SubmitButton";

export default function NewClientPage() {
  return (
    <div className="p-8 text-white max-w-3xl mx-auto">
      <Link href="/admin/clients" className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Clients
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Onboard New Client</h1>
        <p className="text-zinc-400">Fill out the client brief to kick off the automated AEO and SEO audits.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        <form action={createClient} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Client Name *</label>
              <input name="name" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Acme Corp" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Website URL *</label>
              <input name="website" type="url" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://acme.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">ICP Description</label>
            <textarea name="icp" rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Who are their ideal customers?" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Competitors</label>
            <input name="competitors" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. competitor1.com, competitor2.com (comma separated)" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Target Markets</label>
            <select name="targetMarkets" multiple className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24">
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="IN">India</option>
              <option value="Global">Global</option>
            </select>
            <p className="text-xs text-zinc-500">Hold Ctrl/Cmd to select multiple</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Services Offered</label>
            <input name="services" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. SaaS, Consulting, Marketing (comma separated)" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Goals</label>
            <textarea name="goals" rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="What are they trying to achieve?" />
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
