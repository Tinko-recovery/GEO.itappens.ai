import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Use default SSR (not static export) so /api/waitlist works as Serverless Function
  // If you want static export in the future, set output: 'export' below
  // output: 'export',

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Redirects (e.g., from /waitlist to home)
  async redirects() {
    return []
  },

  // Rewrites (if needed for proxying)
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    }
  },

  // Environment variables
  env: {
    // SUPABASE_URL and SUPABASE_SERVICE_KEY are set via vercel env vars
    // Not defined here to avoid accidental exposure
  },

  // Webpack config (optional, for advanced customization)
  webpack: (config, { isServer }) => {
    return config
  },
}

export default nextConfig
