import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'www.krasamo.com',
      'api.dicebear.com',
      'images.unsplash.com',
      'upload.wikimedia.org',
      'picsum.photos',
      'images.ctfassets.net'
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
