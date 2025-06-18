import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
  experimental: {
    serverActions: true,
  },
  // Disable Turbopack for now as it has issues with Transformers.js
  turbo: {
    rules: {
      // Disable Turbopack for this package
      '@xenova/transformers': {
        loader: 'webpack',
      },
    },
  },
};

export default nextConfig;
