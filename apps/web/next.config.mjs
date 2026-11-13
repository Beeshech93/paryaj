/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'NEW BRAND',
    NEXT_PUBLIC_REAL_MONEY_ENABLED: process.env.NEXT_PUBLIC_REAL_MONEY_ENABLED || 'true',
  },
};

export default nextConfig;

