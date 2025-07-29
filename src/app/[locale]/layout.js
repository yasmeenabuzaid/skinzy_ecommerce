import { Poppins, Noto_Kufi_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';
import { CartContextProvider } from '@/context/CartContext';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-kufi',
});

export const metadata = {
  title: 'Skinzy Care',
  description: 'High-quality products.',
};

export default async function RootLayout({ children, params }) {
  const locale = params.locale;

  if (!locale || !['en', 'ar'].includes(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${poppins.variable} ${notoKufi.variable} font-sans`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CartContextProvider>
            {children}
          </CartContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
