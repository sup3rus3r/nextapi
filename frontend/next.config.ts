import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source      : "/api/auth/:path*",
        destination : "/api/auth/:path*",
      },
      {
        source      : "/api/backend/:path*",
        destination : `${process.env.BACKEND_URL ?? "http://backend:8000"}/:path*`,
      },
      {
        source      : "/api/:path*",
        destination : `${process.env.BACKEND_URL ?? "http://backend:8000"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
