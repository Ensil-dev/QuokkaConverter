import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['@ffmpeg/ffmpeg']
  },
  serverExternalPackages: ['ffmpeg-static'],
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
  },
  // FFmpeg WebAssembly 파일을 정적 파일로 제공
  async headers() {
    return [
      {
        source: '/ffmpeg/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
