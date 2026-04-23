import { getCredits } from '@/utils/credits'

export default async function CreditsDisplay() {
  const credits = await getCredits()

  return (
    <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
      <span className="text-amber-400 font-bold">💎 {credits}</span>
      <span className="text-xs text-slate-400 uppercase tracking-wider">Credits</span>
    </div>
  )
}
