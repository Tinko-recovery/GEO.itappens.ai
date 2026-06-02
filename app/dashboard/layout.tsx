import { ReactNode } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Breadcrumbs from '@/components/dashboard/Breadcrumbs';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#f4f5f9] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
          <Breadcrumbs />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
