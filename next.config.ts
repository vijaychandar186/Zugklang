import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'https://bug-free-orbit-5g96x4w4rjjvcrrg-3000.app.github.dev'
      ]
    }
  }
};

export default nextConfig;
