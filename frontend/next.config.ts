import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: process.env.NEXT_ALLOWED_DEV_ORIGINS
    ? process.env.NEXT_ALLOWED_DEV_ORIGINS.split(',').map((s) => s.trim())
    : ['localhost:3000'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }
    ]
  },
  turbopack: {
    root: __dirname
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' }
        ]
      }
    ];
  }
};

export default withSentryConfig(nextConfig, {
  // Sentry organization and project (set in env or hardcode)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Upload source maps to Sentry during build (requires SENTRY_AUTH_TOKEN)
  silent: !process.env.CI,
  widenClientFileUpload: true,

  // Automatically instrument server components and API routes
  autoInstrumentServerFunctions: true,

  // Hide source maps from the browser bundle
  hideSourceMaps: true,

  // Reduces bundle size by tree-shaking unused Sentry code
  disableLogger: true,

  // Automatically annotate React components for easier debugging
  reactComponentAnnotation: { enabled: true },

  // Tunnel Sentry requests through your own domain (bypass ad-blockers)
  tunnelRoute: '/monitoring',
});
