import nextPwa from "next-pwa";
import { NextConfig } from "next";

const pwaConfig = nextPwa({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/your-api-url\.com\/.*/, // Replace with your API
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 1 day
        },
      },
    },
    {
      urlPattern: /.*/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 🚨 Ignores TypeScript errors during build
  },
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Increase the limit to 10MB
    },
  },
  images: {
    domains: ["res.cloudinary.com", "img.clerk.com"], // ✅ Allow images from Cloudinary
  },
  async headers() {
    return [
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  ...pwaConfig,
};

export default nextConfig;
