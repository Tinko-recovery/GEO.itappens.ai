import Link from "next/link";
import { Plus } from "lucide-react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function ClientsPage() {
  const clients = await prisma.agencyClient.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 text-white max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Clients</h1>
          <p className="text-zinc-400">Manage all your agency clients and their AEO/SEO campaigns.</p>
        </div>
        <Link 
          href="/admin/clients/new" 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Link>
      </div>
      
      {clients.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
          No clients added yet.
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className="px-6 py-4 font-medium">Client Name</th>
                <th className="px-6 py-4 font-medium">Website</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{client.name}</td>
                  <td className="px-6 py-4 text-zinc-400">{client.website}</td>
                  <td className="px-6 py-4">
                    <span className="bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full text-xs capitalize">
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/clients/${client.id}`} className="text-indigo-400 hover:text-indigo-300 font-medium">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
