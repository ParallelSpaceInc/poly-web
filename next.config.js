/** @type {import('next').NextConfig} */
const nextConfig = {
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
        destination: process.env.RESOURCE_URL,
      },
    ];
  },
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"],
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};
module.exports = nextConfig;
