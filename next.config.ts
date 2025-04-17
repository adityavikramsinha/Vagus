import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // opt-in ?? I dont think so.
    experimental : {
        reactCompiler : true
    },
  reactStrictMode: true,
};

export default nextConfig;
