"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, FileText } from "lucide-react";

type Post = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  author: { name: string; email: string };
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Blog Content</h1>
        <Link 
          href="/admin/blog/new" 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          New Post
        </Link>
      </div>

      {loading ? (
        <div className="text-zinc-400">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <FileText className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No posts yet</h3>
          <p className="text-zinc-400">Get started by creating your first blog post.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-zinc-950 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Title</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Author</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{post.title}</td>
                  <td className="px-6 py-4 text-zinc-300">{post.author.name || post.author.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${post.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
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
