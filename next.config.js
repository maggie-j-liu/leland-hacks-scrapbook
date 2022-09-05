/** @type {import('next').NextConfig} */
const { withSuperjson } = require("next-superjson");
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = withSuperjson()(nextConfig);
