import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Portfolio screenshots are large PNGs; serve modern formats automatically.
    formats: ['image/avif', 'image/webp'],
  },
};

export default withNextIntl(nextConfig);
