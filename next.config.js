/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coditas-brand-assets.web.app",
        pathname: "/logos/**",
      },
    ],
  },
};

module.exports = nextConfig;