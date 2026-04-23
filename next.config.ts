import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  serverExternalPackages: ["@prisma/client", "puppeteer-core", "@sparticuz/chromium"],
};

export default nextConfig;
