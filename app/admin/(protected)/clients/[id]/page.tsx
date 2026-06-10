import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Download, Wrench, CheckCircle, FileText } from "lucide-react";
import { revalidatePath } from "next/cache";

import { runAeoAudit } from "@/lib/engines/aeo-audit";
import { runSeoAudit } from "@/lib/engines/seo-audit";
import { generateStrategy } from "@/lib/engines/strategy";
import { executeStrategyContent } from "@/lib/engines/content";

const prisma = new PrismaClient();

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const client = await prisma.agencyClient.findUnique({
    where: { id: resolvedParams.id },
    include: {
      audits: { orderBy: { createdAt: 'desc' }, take: 2 },
      strategies: { orderBy: { createdAt: 'desc' } },
      contentItems: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!client) return notFound();

  const aeoAudit = client.audits.find(a => a.type === "aeo");
  const seoAudit = client.audits.find(a => a.type === "seo");

  return (
    <div className="p-8 text-white max-w-5xl mx-auto">
      <Link href="/admin/clients" className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clients
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{client.name}</h1>
          <a href={client.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
            {client.website}
          </a>
        </div>
        
        <div className="flex gap-3">
          <form action={async () => {
            "use server";
            // Run audits in parallel
            await Promise.all([
              runAeoAudit(client.id),
              runSeoAudit(client.id)
            ]);
            revalidatePath(`/admin/clients/${client.id}`);
          }}>
            <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Play className="w-4 h-4" /> Run Audits
            </button>
          </form>
          
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AEO Audit Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <h2 className="text-xl font-semibold">AEO Audit</h2>
            {aeoAudit?.status === "completed" ? (
              <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> {aeoAudit.score}% Score
              </span>
            ) : (
              <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-xs font-medium uppercase">
                {aeoAudit?.status || "Not Run"}
              </span>
            )}
          </div>
          
          {aeoAudit?.status === "completed" ? (
            <div className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-sm">
                <p className="text-zinc-400 mb-1">AI Reasoning</p>
                <p className="text-zinc-200">{(aeoAudit.results as any)?.ai_evaluation?.reasoning || "Analyzed by Claude 3.7."}</p>
              </div>
              <form action={async () => {
                "use server";
                // 1. Generate Strategies based on Audit
                const stratRes = await generateStrategy(client.id);
                // 2. Automatically execute the first strategy as a test fix
                if (stratRes.success && stratRes.strategies && stratRes.strategies.length > 0) {
                  await executeStrategyContent(stratRes.strategies[0].id);
                }
                revalidatePath(`/admin/clients/${client.id}`);
              }}>
                <button className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                  <Wrench className="w-4 h-4" /> Fix AEO Issues
                </button>
              </form>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Run an audit to analyze AI Answer Engine Optimization.</p>
          )}
        </div>

        {/* SEO Audit Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <h2 className="text-xl font-semibold">SEO Audit</h2>
            {seoAudit?.status === "completed" ? (
              <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> {seoAudit.score}% Score
              </span>
            ) : (
              <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-xs font-medium uppercase">
                {seoAudit?.status || "Not Run"}
              </span>
            )}
          </div>
          
          {seoAudit?.status === "completed" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block">Tech Health</span>
                  <span className="text-lg font-bold text-white">{(seoAudit.results as any)?.technical_health || 0}</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block">Keywords</span>
                  <span className="text-lg font-bold text-white">{(seoAudit.results as any)?.keyword_visibility || 0}</span>
                </div>
              </div>
              <form action={async () => {
                "use server";
                // Trigger strategy specifically targeting SEO (for MVP we just run the general generator)
                const stratRes = await generateStrategy(client.id);
                if (stratRes.success && stratRes.strategies && stratRes.strategies.length > 0) {
                  // Execute the second strategy to simulate a different fix
                  const targetStrat = stratRes.strategies[1] || stratRes.strategies[0];
                  await executeStrategyContent(targetStrat.id);
                }
                revalidatePath(`/admin/clients/${client.id}`);
              }}>
                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                  <Wrench className="w-4 h-4" /> Fix SEO Issues
                </button>
              </form>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Run an audit to analyze traditional Search Engine Optimization.</p>
          )}
        </div>
      </div>

      {/* Generated Fixes / Content Queue */}
      {(client.strategies.length > 0 || client.contentItems.length > 0) && (
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 border-b border-zinc-800 pb-4">Generated Fixes & Content</h2>
          <div className="space-y-3">
            {client.contentItems.map(item => (
              <div key={item.id} className="flex flex-col bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 className="font-medium text-white">{item.title}</h4>
                      <span className="text-xs text-zinc-500 uppercase">{item.type}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-medium capitalize">
                    {item.status}
                  </span>
                </div>
                <div className="bg-zinc-900 rounded p-3 text-xs text-zinc-400 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto border border-zinc-800">
                  {item.content.substring(0, 300)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
