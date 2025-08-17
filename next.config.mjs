import createNextIntlPlugin from 'next-intl/plugin';

// The path has been corrected from 'i1n' to 'i18n'
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'atechdevelopmentstorage.blob.core.windows.net',
      },
    ],
  },
  staticPageGenerationTimeout: 300,
};

export default withNextIntl(nextConfig);