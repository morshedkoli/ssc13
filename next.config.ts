import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // bcrypt is a native module; mark it so Next.js doesn't try to bundle it
  serverExternalPackages: ["bcrypt"],
};

export default nextConfig;
