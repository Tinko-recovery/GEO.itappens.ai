import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex-1 flex items-center justify-center h-full min-h-[60vh]">
      <div className="flex flex-col items-center gap-4 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium animate-pulse">Loading data...</p>
      </div>
    </div>
  );
}
