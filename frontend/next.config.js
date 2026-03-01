/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ["storage.googleapis.com", "firebasestorage.googleapis.com"],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
