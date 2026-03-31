/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "v3b.fal.media" },
      { protocol: "https", hostname: "fal.media" },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
