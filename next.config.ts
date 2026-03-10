import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // TODO AFTER GOT DOMAIN REMOVE
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://13.63.94.34/api/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'swiperjs.com',
        port: '',
        pathname: '/demos/images/**',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);