import { ArrowUpRight, Binary, Bot, ChartColumnIncreasing, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const proofPoints = [
  {
    icon: Bot,
    title: "Entity-ready crawl",
    body: "We audit canonicals, schema, llms.txt, page intent, and answer-extractable formatting in one pass.",
  },
  {
    icon: ChartColumnIncreasing,
    title: "SERP + GEO blend",
    body: "The report combines SEO visibility with answer-engine readiness so the output sells both immediate fixes and monthly retainers.",
  },
  {
    icon: ShieldCheck,
    title: "Commercial roadmap",
    body: "Every report ends with a 30 / 60 / 90-day implementation sequence and a clear strategy-call CTA.",
  },
];

export function AuditPreview() {
  return (
    <div className="grid gap-6">
      <Card className="overflow-hidden border-slate-900 bg-slate-950 text-white">
        <CardContent className="relative p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />
          <Badge className="mb-4 w-fit bg-white/10 text-white" variant="default">
            Premium report engine
          </Badge>
          <h2 className="max-w-xl font-display text-4xl font-extrabold tracking-tight text-white">
            Paid audit reports that look board-ready, not like disposable lead magnets.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            The new `/audit` flow produces a high-trust HTML report with benchmark cards, ticker strips, roadmap blocks, competitor tables,
            and a PDF export that can be sent directly to founders or marketing heads.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-indigo-200">
                <Binary className="h-4 w-4" />
                Technical score
              </div>
              <div className="mt-4 font-display text-5xl font-black tracking-tight">72</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">Crawlable, but still leaking authority through weak entity markup and inconsistent page intent.</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-indigo-200">
                <Bot className="h-4 w-4" />
                GEO readiness
              </div>
              <div className="mt-4 font-display text-5xl font-black tracking-tight">58</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">Enough content exists to win citations, but not yet in the formats LLMs prefer to extract and trust.</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-indigo-200">
                <ArrowUpRight className="h-4 w-4" />
                Roadmap impact
              </div>
              <div className="mt-4 font-display text-5xl font-black tracking-tight">90d</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">Structured for a clear implementation sell-in: fixes now, answer assets next, monthly GEO thereafter.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {proofPoints.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardContent className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
