import {
  CheckCircle,
  TrendingUp,
  Clock,
  Shield,
} from 'lucide-react';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: CheckCircle,
    title: 'Track Invoice Status',
    description:
      'Monitor every invoice in real-time. Know exactly when payments are received, pending, or overdue at a glance.',
  },
  {
    icon: TrendingUp,
    title: 'Get Paid Faster',
    description:
      'Automatic reminders and clear payment tracking help ensure your clients pay on time. Less chasing, more revenue.',
  },
  {
    icon: Clock,
    title: 'Save Time Daily',
    description:
      'Spend less time managing spreadsheets and more time growing your business. Automated workflows do the heavy lifting.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description:
      'Your financial data is protected with enterprise-grade security. We handle compliance so you can focus on growth.',
  },
];

export default function Features() {
  return (
    <section id="features" className="w-full py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-secondary-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-4">
            Powerful Features for Modern Businesses
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Everything you need to manage invoices efficiently and get paid on time.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col gap-4 p-6 rounded-xl bg-white border border-secondary-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex-shrink-0">
                  <Icon className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 text-sm leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 sm:mt-24 text-center">
          <p className="text-secondary-700 mb-6">
            Ready to streamline your invoicing process?
          </p>
          <a
            href={process.env.NEXT_PUBLIC_APP_SIGNUP_URL || '/signup'}
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Your Free Trial
          </a>
        </div>
      </div>
    </section>
  );
}
