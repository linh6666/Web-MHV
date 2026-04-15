import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "www.mohinhviet.com.vn",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.mohinhviet.com.vn",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
