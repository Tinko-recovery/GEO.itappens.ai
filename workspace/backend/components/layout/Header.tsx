'use client'

/**
 * Header Component
 * 
 * Navigation header with logo and CTA button linking to eng_1's /signup endpoint.
 */

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container-responsive flex items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-blue-600">itappens</h1>
        </div>

        {/* Navigation CTA */}
        <nav className="flex items-center gap-4">
          <a
            href="https://app.itappens.ai/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </a>
        </nav>
      </div>
    </header>
  )
}
