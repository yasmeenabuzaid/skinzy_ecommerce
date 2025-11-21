import { Poppins, Noto_Kufi_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import Providers from '../providers';
import { getMessages } from 'next-intl/server';
import '../globals.css';
import Footer from './components/ui/Footer'; 
import Header from './components/ui/Header'; 
import PageTransitionWrapper from '../PageTransitionWrapper'; // ⭐️ تأكد من المسار
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

export default async function RootLayout({ children, params: { locale } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <html 
        lang={locale} 
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        suppressHydrationWarning 
    >
      {/* ⭐️ تأكد أن هذا السطر يبدأ مباشرة تحت وسم <html> */}
      <body className={`${poppins.variable} ${notoKufi.variable} font-sans`}>
        <NextTopLoader
          color="#FF671F"
//           height={3}
          showSpinner={false}
        />
          <Providers locale={locale} messages={messages}>
          <Header />
          <PageTransitionWrapper> 
  
          <main className="min-h-screen">
            {children}
          </main>
</PageTransitionWrapper>
          
          <Footer />
        </Providers>
      </body>
    </html>
  );
}