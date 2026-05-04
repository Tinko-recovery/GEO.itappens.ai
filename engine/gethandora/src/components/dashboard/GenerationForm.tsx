'use client'

import { useState } from 'react'
import { handleGenerate } from '@/app/dashboard/actions'
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon, Send } from 'lucide-react'

type Platform = 'linkedin' | 'instagram'

const PLATFORMS: { id: Platform; label: string }[] = [
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'instagram', label: 'Instagram' },
]

export function GenerationForm() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    // Buffer state
    const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(new Set(['linkedin']))
    const [bufferStatus, setBufferStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [bufferError, setBufferError] = useState<string | null>(null)

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setResult(null)
        setBufferStatus('idle')
        setBufferError(null)

        const formData = new FormData(e.currentTarget)
        const response: any = await handleGenerate(formData)

        if (response.error) {
            setError(response.error)
        } else {
            setResult(response.data)
        }
        setLoading(false)
    }

    function togglePlatform(platform: Platform) {
        setSelectedPlatforms(prev => {
            const next = new Set(prev)
            if (next.has(platform)) {
                next.delete(platform)
            } else {
                next.add(platform)
            }
            return next
        })
        setBufferStatus('idle')
    }

    async function sendToBuffer() {
        if (!result || selectedPlatforms.size === 0) return
        setBufferStatus('loading')
        setBufferError(null)

        try {
            const res = await fetch('/api/buffer/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platforms: Array.from(selectedPlatforms),
                    linkedin_personal: result.linkedin_personal,
                    linkedin_brand: result.linkedin_brand,
                    twitter: result.twitter,
                    instagram: result.instagram,
                    image_url: result.image_url,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setBufferStatus('error')
                setBufferError(data.error || 'Failed to queue posts')
            } else {
                const failed = data.results?.filter((r: any) => !r.success)
                if (failed?.length) {
                    setBufferStatus('error')
                    setBufferError(`Failed: ${failed.map((f: any) => `${f.platform} — ${f.error}`).join('; ')}`)
                } else {
                    setBufferStatus('success')
                }
            }
        } catch {
            setBufferStatus('error')
            setBufferError('Network error — check connection')
        }
    }

    function copyText(text: string) {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {!result ? (
                <form onSubmit={onSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-2">Topic of the day</label>
                            <textarea
                                name="topic"
                                required
                                rows={2}
                                placeholder="What should your content be about? (e.g. The impact of AI on hospitality in 2024)"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Brand Name</label>
                            <input name="brandName" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. GetThandora" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Niche</label>
                            <input name="niche" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. SaaS Marketing" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Tone</label>
                            <select name="tone" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none">
                                <option>Professional & Authority</option>
                                <option>Punchy & Aggressive</option>
                                <option>Warm & Welcoming</option>
                                <option>Educational & Helpful</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Target Audience</label>
                            <input name="targetAudience" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Startup Founders" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end relative z-10">
                        <button
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating Magic...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Create Content Pack
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-4 rounded-xl bg-red-900/20 border border-red-900/50 flex items-center gap-3 text-red-400 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                </form>
            ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center bg-green-950/20 border border-green-900/30 p-4 rounded-2xl">
                        <div className="flex items-center gap-3 text-green-400">
                            <CheckCircle2 className="w-6 h-6" />
                            <span className="font-bold">Generation Complete!</span>
                        </div>
                        <button onClick={() => setResult(null)} className="text-sm text-slate-400 hover:text-white underline decoration-slate-700 underline-offset-4">
                            Start over
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Copy Preview */}
                        <div className="space-y-6">
                            {[
                                { label: 'LinkedIn Personal', content: result.linkedin_personal },
                                { label: 'LinkedIn Brand', content: result.linkedin_brand },
                                { label: 'Twitter / X', content: result.twitter },
                                { label: 'Instagram', content: result.instagram }
                            ].map((p, i) => (
                                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                                    <div className="bg-slate-800/50 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                                        {p.label}
                                        <button
                                            onClick={() => copyText(p.content)}
                                            className="text-blue-500 hover:text-blue-400"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <div className="p-5 text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                                        {p.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Image Preview & Actions */}
                        <div className="space-y-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden sticky top-24">
                                <div className="bg-slate-800/50 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <ImageIcon className="w-3 h-3" /> AI Visualization
                                </div>
                                <div className="aspect-square bg-slate-950 relative">
                                    {result.image_url ? (
                                        <img src={result.image_url} alt="Generated Visual" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-800">
                                            <ImageIcon className="w-20 h-20" />
                                        </div>
                                    )}
                                </div>

                                {/* Buffer Queue Section */}
                                <div className="p-6 space-y-4">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Queue to Buffer</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {PLATFORMS.map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => togglePlatform(p.id)}
                                                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                                                        selectedPlatforms.has(p.id)
                                                            ? 'bg-blue-600 border-blue-500 text-white'
                                                            : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                                                    }`}
                                                >
                                                    {p.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={sendToBuffer}
                                        disabled={bufferStatus === 'loading' || selectedPlatforms.size === 0}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm"
                                    >
                                        {bufferStatus === 'loading' ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Queuing...</>
                                        ) : bufferStatus === 'success' ? (
                                            <><CheckCircle2 className="w-4 h-4 text-green-400" /><span className="text-green-400">Queued to Buffer!</span></>
                                        ) : (
                                            <><Send className="w-4 h-4" /> Send to Buffer Queue</>
                                        )}
                                    </button>

                                    {bufferStatus === 'error' && bufferError && (
                                        <div className="flex items-start gap-2 text-red-400 text-xs bg-red-950/30 border border-red-900/40 rounded-lg p-3">
                                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                            {bufferError}
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 border-t border-slate-800 bg-slate-950/50">
                                    <h4 className="text-xs font-bold text-amber-500 uppercase tracking-tight mb-2">Want even better results?</h4>
                                    <p className="text-sm text-slate-400 mb-4">Our Pro agencies get citation tracking and SEO authority automated.</p>
                                    <a href="https://itappens.ai" className="text-sm font-bold text-white hover:text-blue-400 flex items-center gap-1 group">
                                        Visit itappens.ai <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function ArrowRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
