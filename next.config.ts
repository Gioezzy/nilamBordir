import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // protocol: "https",
        // hostname: "res.cloudinary.com",
        // port: "",
        // pathname: "/dyfi4bwkp/**",
        protocol: "https",
        hostname: "mvxsbyqdvtnqtcalhnrp.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
