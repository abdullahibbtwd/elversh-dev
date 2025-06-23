import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'adept-hawk-370.convex.cloud',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
