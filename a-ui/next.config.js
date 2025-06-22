/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['localhost', 'hobbit-store.local'],
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
    NEXT_PUBLIC_APP_NAME: 'The Hobbit Store',
    NEXT_PUBLIC_DEFAULT_TENANT_ID: process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || '01JY9X0AN101C86WKVJXANZ567',
    NEXT_PUBLIC_DEFAULT_ENV_ID: process.env.NEXT_PUBLIC_DEFAULT_ENV_ID || 'DEVELOPMENT',
  },
};

module.exports = nextConfig;
