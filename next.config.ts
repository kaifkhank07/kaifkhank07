import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dbh4spo4nbkkt.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
