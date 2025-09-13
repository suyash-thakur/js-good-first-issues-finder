import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow builds to proceed despite lint warnings/errors when verifying setup
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
