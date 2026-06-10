"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {pending ? "Running AI Audits (10-20s)..." : "Save & Start Audits"}
    </button>
  );
}
