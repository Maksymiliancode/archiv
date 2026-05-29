import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.allegroimg.com' },
      { protocol: 'https', hostname: 'img.allegro.pl' },
    ],
  },
};

export default nextConfig;
