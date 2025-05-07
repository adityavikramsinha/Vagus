import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // opt-in ?? I dont think so.
    experimental: {
        reactCompiler: true,
        optimizePackageImports: ['icon-library'],
    },
    reactStrictMode: true,
};

export default nextConfig;
