/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/topik",
        destination: "/topics",
      },
      {
        source: "/topik/:path*",
        destination: "/topics/:path*",
      },
    ];
  },
};

export default nextConfig;
