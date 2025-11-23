import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dyfi4bwkp/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
