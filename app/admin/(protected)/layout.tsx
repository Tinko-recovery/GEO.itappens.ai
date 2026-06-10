import { ReactNode } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between px-8">
          <div className="text-sm font-medium text-zinc-400">
            itappens.ai Agency Platform
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-300">sadish.sugumaran@itappens.ai</span>
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}>
              <button type="submit" className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
