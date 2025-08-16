import { Poppins, Noto_Kufi_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';
import { CartContextProvider } from '@/context/CartContext';
import NextTopLoader from 'nextjs-toploader';

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
  description: 'Your trusted online beauty hub',
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
         <NextTopLoader
          color="#FF671F" // هذا هو اللون البرتقالي الخاص بعلامتك التجارية
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false} // لإخفاء الدائرة الدوارة التي تأتي معه
          easing="ease"
          speed={200}
          shadow="0 0 10px #FF671F, 0 0 5px #FF671F"
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CartContextProvider>
            {children}
          </CartContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
