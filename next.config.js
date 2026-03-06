/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coditas-brand-assets.web.app",
        pathname: "/logos/**",
      },
      {
        protocol: "https",
        hostname: "people.zoho.in",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;