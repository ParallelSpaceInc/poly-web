/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyparser: false,
  },
  // reactStrictMode: true,
  env: {
    S3_KEY_ID: process.env.S3_KEY_ID,
    S3_KEY: process.env.S3_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET: process.env.S3_BUCKET,
  },
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
