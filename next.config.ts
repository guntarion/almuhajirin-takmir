// next.config.ts
import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Explicitly set to "https"
        hostname: 'bucket-titianbakat-ai-project.sgp1.cdn.digitaloceanspaces.com',
        pathname: '/almuhajirin/avatars/**', // Allow all images in the avatars folder
      },
    ],
    unoptimized: false, // Enable image optimization
  },
};

const withPWACfg = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

// Use a type assertion to bypass the type conflict
// eslint-disable-next-line @typescript-eslint/no-explicit-any
module.exports = withPWACfg(nextConfig as any);
