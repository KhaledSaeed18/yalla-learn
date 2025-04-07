import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'www.krasamo.com',
      'api.dicebear.com', // For avatar images
      'images.unsplash.com', // Common image source
      'res.cloudinary.com', // In case you're using Cloudinary
      'upload.wikimedia.org',
      'picsum.photos',
    ],
  },
};

export default nextConfig;
