'use client'

import { useState } from 'react'
import { Check, Sparkles, Zap, Shield } from 'lucide-react'
import { RAZORPAY_KEY_ID } from '@/utils/razorpay'

const PACKS = [
  { id: 'starter', name: 'Starter Pack', price: 499, credits: 90, desc: 'Perfect for creators starting out.' },
  { id: 'growth', name: 'Growth Pack', price: 999, credits: 180, desc: 'Ideal for small agencies.', popular: true },
  { id: 'pro', name: 'Pro Pack', price: 1999, credits: 360, desc: 'Built for power users.' },
]

const SUBS = [
  { id: 'starter_sub', name: 'Starter Monthly', price: 399, credits: 90, desc: 'Billed monthly. Save 20%.' },
  { id: 'growth_sub', name: 'Growth Monthly', price: 799, credits: 180, desc: 'Billed monthly. Better value.', popular: true },
  { id: 'pro_sub', name: 'Pro Monthly', price: 1599, credits: 360, desc: 'Billed monthly. Maximum output.' },
]

export function PricingSection() {
  const [isSubscription, setIsSubscription] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const currentPlans = isSubscription ? SUBS : PACKS

  const handlePayment = async (planId: string) => {
    const plan = currentPlans.find(p => p.id === planId)
    if (!plan) return

    setLoading(planId)
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId, 
          type: isSubscription ? 'subscription' : 'pack',
          amount: plan.price,
          credits: plan.credits
        }),
      })

      const order = await response.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "GetThandora",
        description: `Purchase of ${planId} plan`,
        order_id: order.order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: plan.price,
                credits: plan.credits,
                planId,
              }),
            })
            if (!verifyRes.ok) {
              const err = await verifyRes.json()
              console.error('Payment verification failed:', err)
              alert('Payment was received but verification failed. Please contact support.')
              return
            }
          } catch (err) {
            console.error('Verify-payment network error:', err)
          }
          window.location.href = '/dashboard?payment=success'
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#2563eb",
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error('Payment Error:', err)
      alert("Payment failed to initialize. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <section className="py-24 px-4 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10">
            Choose the plan that fits your content needs. Both packs and subscriptions include all features.
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isSubscription ? 'text-white' : 'text-slate-500'}`}>One-time Packs</span>
            <button 
              onClick={() => setIsSubscription(!isSubscription)}
              className="w-14 h-8 bg-slate-800 rounded-full p-1 relative transition-colors border border-slate-700"
            >
              <div className={`w-6 h-6 bg-blue-600 rounded-full transition-transform ${isSubscription ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-medium ${isSubscription ? 'text-white' : 'text-slate-500'}`}>Monthly (Save 20%)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {currentPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative bg-slate-900/50 border ${plan.popular ? 'border-blue-500 shadow-lg shadow-blue-900/10' : 'border-slate-800'} rounded-3xl p-8 flex flex-col hover:border-slate-700 transition-all`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm">{plan.desc}</p>
              </div>

              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">₹{plan.price}</span>
                <span className="text-slate-500 text-sm font-medium">{isSubscription ? '/mo' : ''}</span>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                <div className="flex items-center gap-3 text-slate-200">
                  <div className="w-5 h-5 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="font-bold">{plan.credits} Social Credits</span>
                </div>
                {[
                  'Claude 3.5 Content Copy',
                  'DALL-E 3 Image Generation',
                  'Direct Publish to Buffer',
                  '30 Days Credit Validity',
                  '24/7 Support Entry'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                    <Check className="w-4 h-4 text-slate-600" />
                    {feature}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handlePayment(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {loading === plan.id ? 'Processing...' : `Get ${plan.credits} Credits`}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10 text-slate-600" />
            <div>
              <p className="text-white font-bold">Secure Payment via Razorpay</p>
              <p className="text-slate-500 text-sm">Your data is encrypted. We never store credit card details.</p>
            </div>
          </div>
          <div className="flex gap-4 grayscale opacity-50">
             {/* Simple placeholders for payment icons if needed */}
             <div className="text-xs font-bold text-slate-600 uppercase border border-slate-800 px-2 py-1">UPI</div>
             <div className="text-xs font-bold text-slate-600 uppercase border border-slate-800 px-2 py-1">VISA</div>
             <div className="text-xs font-bold text-slate-600 uppercase border border-slate-800 px-2 py-1">MASTERCARD</div>
          </div>
        </div>
      </div>
    </section>
  )
}
