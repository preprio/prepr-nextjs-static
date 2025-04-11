import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'demo-patterns.stream.prepr.io',
      },
      {
        hostname: 'preprhq-mike-01.stream.prepr.io',
      }
    ],
  },
};

export default nextConfig;
