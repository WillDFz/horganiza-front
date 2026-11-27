import type { NextConfig } from "next";

const apiBackendUrl = process.env.API_BACKEND_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    if (!apiBackendUrl) {
      return {
        beforeFiles: [],
        afterFiles: [],
        fallback: [],
      };
    }

    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${apiBackendUrl}/:path*`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
