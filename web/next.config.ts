import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Ensure Next doesn't infer the workspace root outside the repo
  outputFileTracingRoot: path.join(__dirname, ".."),
  // Allow builds to proceed despite lint warnings/errors when verifying setup
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
