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
          <Card key={item.label}>
            <CardContent className="p-6">
              <Badge variant={item.variant}>{item.label}</Badge>
              <div className="mt-4 font-display text-5xl font-black tracking-tight text-slate-950">{item.value}</div>
              <p className="mt-2 text-sm text-slate-500">{report.hostname}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="full">Full Report</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle>Category Scores</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.chartSeries}>
                    <CartesianGrid vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="score" radius={[10, 10, 0, 0]} fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>30 / 60 / 90-Day Roadmap</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {report.roadmap.map((phase) => (
                  <div key={phase.phase} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <Badge variant="accent">{phase.window}</Badge>
                    <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-slate-950">{phase.phase}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{phase.goal}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="full">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <iframe className="h-[1200px] w-full border-0" srcDoc={html} title={`${report.hostname} audit report`} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
