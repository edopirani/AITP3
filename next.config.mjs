import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

/** @type {import('next').NextConfig} */

// Fix `__dirname` for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"), // Maps "@/..." to "src/"
    };
    return config;
  },
};

export default nextConfig;