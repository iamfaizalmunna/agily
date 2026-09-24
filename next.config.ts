import type { NextConfig } from "next";

const lensApi = process.env.LENS_API_URL ?? "http://127.0.0.1:43124";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "bcrypt"],
  async rewrites() {
    return [
      {
        source: "/lens-api/:path*",
        destination: `${lensApi}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
