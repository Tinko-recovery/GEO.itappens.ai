import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  serverExternalPackages: ["@prisma/client", "puppeteer-core", "@sparticuz/chromium"],
  env: {
    NEXT_PUBLIC_LOGIN_ROUTE: '/auth/login',
    NEXT_PUBLIC_PROFILE_ROUTE: '/auth/profile'
  }
};

export default nextConfig;
