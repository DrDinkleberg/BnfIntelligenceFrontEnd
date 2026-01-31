/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Cloud Run deployment - creates minimal standalone output
  output: 'standalone',

  // React strict mode for catching issues early
  reactStrictMode: true,

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile photos
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
      },
    ],
    // Use sharp for image optimization in production
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },

  // Security headers (also in middleware, but good to have here as backup)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  // Rewrites for API proxying (if needed)
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      // Example: redirect old routes
      // {
      //   source: '/old-route',
      //   destination: '/new-route',
      //   permanent: true,
      // },
    ]
  },

  // Webpack customization
  webpack: (config, { isServer }) => {
    // Fix for some npm packages that don't work well with webpack
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.run.app'],
    },
  },

  // TypeScript - fail build on type errors
  typescript: {
    // Set to true to ignore errors during build (not recommended for production)
    ignoreBuildErrors: false,
  },

  // ESLint - fail build on lint errors
  eslint: {
    // Set to true to ignore errors during build (not recommended for production)
    ignoreDuringBuilds: false,
  },

  // Powered by header (disable for security)
  poweredByHeader: false,

  // Compression (Cloud Run handles this, but good for local)
  compress: true,

  // Generate ETags for caching
  generateEtags: true,

  // Page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
}

module.exports = nextConfig
