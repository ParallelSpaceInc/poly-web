/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: `/getResource/:path*`,
        destination: `http://localhost:30201/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
