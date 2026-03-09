/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: [
      "storage.googleapis.com",
      "firebasestorage.googleapis.com",
      "v3b.fal.media",
      "fal.media",
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
