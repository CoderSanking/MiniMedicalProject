/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ prevents ESLint from blocking builds
  },
};

module.exports = nextConfig;
