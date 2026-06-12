"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function StatusTracker({ siteUrl }: { siteUrl: string }) {
  const router = useRouter();
  const [dots, setDots] = useState("");
  const [phase, setPhase] = useState("Initializing crawler");

  useEffect(() => {
    // Refresh the router data every 5 seconds
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    // Animate dots
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    // Rotate phases
    const phases = [
      "Initializing crawler",
      "Analyzing citation signals",
      "Mapping knowledge graphs",
      "Benchmarking against Claude & Perplexity",
      "Generating technical roadmap",
      "Finalizing GEO score",
    ];
    let i = 0;
    const phaseInterval = setInterval(() => {
      i = (i + 1) % phases.length;
      setPhase(phases[i]);
    }, 4000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(phaseInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative flex items-center justify-center w-32 h-32 mb-10">
        <div className="absolute inset-0 border-t-2 border-brand-primary rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-r-2 border-pink-500 rounded-full animate-spin shadow-[0_0_15px_rgba(225,29,72,0.5)]" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute inset-4 border-b-2 border-cyan-400 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        <Loader2 className="w-8 h-8 text-white animate-pulse" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-4">
        Analyzing {siteUrl}
      </h2>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-6 py-4 flex items-center gap-4 shadow-lg min-w-[320px]">
        <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
        <p className="text-slate-300 font-mono text-sm tracking-wide text-left flex-1">
          {phase}{dots}
        </p>
      </div>

      <p className="mt-8 text-slate-500 text-sm max-w-md">
        This deep analysis takes approximately 1-2 minutes. Please keep this page open; it will automatically refresh when your premium report is ready.
      </p>
    </div>
  );
}
