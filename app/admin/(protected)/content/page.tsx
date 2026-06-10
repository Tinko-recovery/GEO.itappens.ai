export default function ContentQueuePage() {
  return (
    <div className="p-8 text-white max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Queue</h1>
        <p className="text-zinc-400">Review, approve, and publish AI-generated content across all clients.</p>
      </div>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
        No content items pending review.
      </div>
    </div>
  );
}
