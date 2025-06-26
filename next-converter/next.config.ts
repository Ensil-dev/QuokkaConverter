import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['@ffmpeg-installer/ffmpeg'],
    serverComponentsExternalPackages: ['ffmpeg-static']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  env: {
    PORT: process.env.PORT || '3001'
  }
};

export default nextConfig;
