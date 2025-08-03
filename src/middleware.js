import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ar'],

  // Used when no locale matches
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/', '/(ar|en)/:path*']
};

// -----------------------------------------------------------------------------