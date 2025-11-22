const createNextIntlPlugin = require('next-intl/plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// next-intl config
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
     {
      protocol: 'https',
      hostname: 'example.com', // <-- أضيفي هذا
    },
     {
      protocol: 'https',
     hostname: 'cdn.shopify.com',
    },
  ],
},

  staticPageGenerationTimeout: 300,
};

// combine plugins (bundleAnalyzer + nextIntl)
module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
