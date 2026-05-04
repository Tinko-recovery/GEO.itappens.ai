export default function Hero() {
  const appSignupUrl = process.env.NEXT_PUBLIC_APP_SIGNUP_URL || '/signup';

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-secondary-900 leading-tight">
            Track Your Invoices.{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              Get Paid Faster.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed">
            Simple, fast, and reliable invoice tracking software. Monitor payment status in real-time,
            stay organized, and never miss a payment deadline again.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <a
              href={appSignupUrl}
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Free Trial
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-secondary-100 text-secondary-900 font-semibold hover:bg-secondary-200 transition-all duration-200"
            >
              Learn More
            </a>
          </div>

          {/* Trust indicator */}
          <div className="pt-4">
            <p className="text-sm text-secondary-500">No credit card required • Free for 14 days</p>
          </div>
        </div>

        {/* Feature preview (subtle) */}
        <div className="mt-16 sm:mt-24">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-secondary-200 bg-white">
            <div className="aspect-video bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-secondary-300 mb-4">📊</div>
                <p className="text-secondary-500">Dashboard preview coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
