/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: true, // For Hostinger compatibility - serve images directly
  },
  // Ensure uploads directory is not treated as a page
  async rewrites() {
    return [];
  },
};

export default nextConfig;
