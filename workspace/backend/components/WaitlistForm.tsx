'use client';

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

type FormStatus = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Client-side validation
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setStatus('success');
        setMessage(data.message || "You're on the waitlist!");
        setEmail('');

        // Fire Plausible custom event
        if (typeof window !== 'undefined' && window.plausible) {
          window.plausible('Waitlist Signup');
        }
      } else if (response.status === 409) {
        setStatus('duplicate');
        setMessage(data.message || 'Email already on waitlist.');
      } else if (response.status === 400) {
        setStatus('error');
        setMessage(data.message || 'Please provide a valid email address.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Waitlist form error:', err);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section id="waitlist" className="w-full py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 to-primary-700">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Join the Waitlist
          </h2>
          <p className="text-lg text-primary-100">
            Be among the first to access Invoice Tracker. Early access users get lifetime discounts.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white font-semibold mb-3">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-200 pointer-events-none" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Clear message on input change
                  if (status !== 'idle') {
                    setStatus('idle');
                  }
                }}
                placeholder="you@example.com"
                disabled={status === 'loading'}
                aria-invalid={status === 'error' || status === 'duplicate'}
                aria-describedby={status !== 'idle' ? 'form-message' : undefined}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-secondary-900 placeholder-secondary-400 border border-transparent focus:border-transparent focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`w-full py-3 rounded-lg font-semibold text-center transition-all duration-200 ${
              status === 'loading'
                ? 'bg-white text-primary-600 opacity-50 cursor-not-allowed'
                : 'bg-white text-primary-600 hover:bg-primary-50 shadow-lg hover:shadow-xl'
            }`}
          >
            {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
          </button>

          {/* Status messages */}
          {status === 'success' && (
            <div
              id="form-message"
              className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200"
            >
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">{message}</p>
                <p className="text-sm text-green-700 mt-1">
                  Check your email for updates and early access details.
                </p>
              </div>
            </div>
          )}

          {status === 'duplicate' && (
            <div
              id="form-message"
              className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200"
            >
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">{message}</p>
                <p className="text-sm text-blue-700 mt-1">
                  We'll notify you as soon as Invoice Tracker is available.
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div
              id="form-message"
              className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">{message}</p>
                <p className="text-sm text-red-700 mt-1">
                  Please try again or contact support if the problem persists.
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Privacy notice */}
        <p className="text-center text-primary-100 text-sm mt-8">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
