// next.config.ts
import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
};

const withPWACfg = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWACfg(nextConfig);
