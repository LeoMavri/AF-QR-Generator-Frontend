/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.diicot.cc/:path*",
      },
    ];
  },
  output: "standalone",
};

module.exports = nextConfig;
