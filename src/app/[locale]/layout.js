import { Poppins, Noto_Kufi_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import Providers from '../providers';
import { getMessages } from 'next-intl/server';
import '../globals.css';
import Footer from './components/ui/Footer';
import Header from './components/ui/Header';

// ⭐ Fonts
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-kufi',
  display: 'swap',
});

// ⭐ Viewport Configuration
export const viewport = {
  themeColor: '#FF671F', // لون الثيم للموبايل
};

export const metadata = {
  title: 'Skinzy Care',
  description: 'Your trusted online beauty hub',
};

// 🟢 التعديل الأهم هنا: params وعد (Promise) ويجب انتظاره
export default async function RootLayout({ children, params }) {
  
  // 1. انتظار الـ params (حل مشكلة Server Error)
  const { locale } = await params;

  // 2. التحقق من اللغة
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  // 3. جلب الرسائل
  const messages = await getMessages(locale);

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      // قمع تحذيرات الهيدريشن على مستوى الصفحة
      suppressHydrationWarning
    >
      {/* ❌ تم حذف <head> اليدوي لأنه يسبب أخطاء 404 مع globals.css */}
      
      <body 
        className={`${poppins.variable} ${notoKufi.variable} font-sans`}
        // 🟢 هذا السطر يحل مشكلة Smart Unit Converter Extension
        suppressHydrationWarning={true} 
      >
        <NextTopLoader color="#FF671F" showSpinner={false} />

        <Providers locale={locale} messages={messages}>
          <Header />
          
          <main className="min-h-screen">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}