"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/clients", label: "Clients" },
    { href: "/admin/content", label: "Content Queue" },
    { href: "/admin/reports", label: "Reports" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-zinc-800">
        <BrandLogo color="white" suffix="ADMIN" />
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
