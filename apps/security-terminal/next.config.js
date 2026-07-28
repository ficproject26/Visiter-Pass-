import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@vos/database", "@vos/ui"],
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias['@vos/database'] = path.resolve(__dirname, '../../packages/database');
    config.resolve.alias['@vos/ui'] = path.resolve(__dirname, '../../packages/ui');
    return config;
  }
};

export default nextConfig;
