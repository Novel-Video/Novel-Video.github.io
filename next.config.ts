import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/Novel-Video.github.io' : '',
  trailingSlash: true,
};

export default nextConfig;
