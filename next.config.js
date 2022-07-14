/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: `/getResource/:path*`,
        destination: `http://125.131.177.217:30201/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
