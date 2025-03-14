import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BASE_URL: 'http://localhost:4002',
    JWT_SECRET_AUTH: process.env.JWT_SECRET
  }
};

export default nextConfig;
