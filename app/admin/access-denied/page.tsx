import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { signOut } from "@/lib/auth";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md p-8 bg-zinc-900 border border-red-900/30 rounded-xl shadow-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Your account is not authorized to access the Agency Automation Platform. This incident has been logged.
        </p>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          className="w-full mb-3"
        >
          <button
            type="submit"
            className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors"
          >
            Sign out
          </button>
        </form>

        <Link
          href="/"
          className="w-full py-3 px-4 bg-transparent hover:bg-zinc-800 text-zinc-300 font-semibold rounded-lg transition-colors border border-zinc-700 block text-center"
        >
          Return to public site
        </Link>
      </div>
    </div>
  );
}
