"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { AuditReport } from "@/lib/audit/types";

type ReportViewerProps = {
  report: AuditReport;
  html: string;
};

export function ReportViewer({ report, html }: ReportViewerProps) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Overall", value: report.overallScore, variant: "accent" as const },
          { label: "Technical", value: report.technicalScore, variant: "default" as const },
          { label: "On-page", value: report.onPageScore, variant: "success" as const },
          { label: "GEO", value: report.geoReadinessScore, variant: "warning" as const },
        ].map((item) => (
          <Card key={item.label} className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <Badge variant={item.variant}>{item.label}</Badge>
              <div className="mt-4 font-display text-5xl font-black tracking-tight text-white">{item.value}</div>
              <p className="mt-2 text-sm text-slate-400">{report.hostname}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="bg-slate-900 text-slate-400">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="full">Full Report</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <img src={`https://logo.clearbit.com/${report.hostname}`} onError={(e) => e.currentTarget.style.display = 'none'} style={{ maxHeight: '32px', borderRadius: '6px' }} alt="" />
                <CardTitle className="text-white">Category Scores for {report.hostname}</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.chartSeries}>
                    <CartesianGrid vertical={false} stroke="#334155" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#94a3b8" />
                    <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} />
                    <Bar dataKey="score" radius={[10, 10, 0, 0]} fill="#e11d48" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">30 / 60 / 90-Day Roadmap</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {report.roadmap.map((phase) => (
                  <div key={phase.phase} className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
                    <Badge variant="accent">{phase.window}</Badge>
                    <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-white">{phase.phase}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-400">{phase.goal}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="full">
          <Card className="overflow-hidden border-slate-800 bg-slate-900">
            <CardContent className="p-0">
              <iframe className="h-[1200px] w-full border-0" srcDoc={html} title={`${report.hostname} audit report`} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
