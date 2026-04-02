import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Ensures Next treats this folder as the project root (prototype repo lives inside a larger directory).
    root: __dirname,
  },
};

export default nextConfig;
