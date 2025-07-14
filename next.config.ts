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
          {
      protocol: 'https',
      hostname: 'blissful-pigeon-291.convex.cloud',
      port: '',
      pathname: '/**',
    },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
