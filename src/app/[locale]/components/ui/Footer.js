'use client';
import React from 'react';
import { useOnScreen } from '../../../../hooks/useOnScreen';
import { Twitter, Facebook, Instagram, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function Footer() {
  const [ref] = useOnScreen({ threshold: 0.1 });
  const locale = useLocale();

  // الترجمات (يمكنك تعديل النصوص حسب اللغة)
  const texts = {
    en: {
        dontMissOffer: "Don't miss offer",
        emailPlaceholder: 'Email',
        quickLinks: 'Quick links',
        home: 'Home',
        shop: 'Shop',
        login: 'Login',
        checkout: 'Checkout',
        company: 'Company',
        // addressLine: '99 New Theme St. XY, USA 12345',
        email: 'info@skinzycare.com',
        phone: '0793053337 - 0793053338',
about: 'Skinzy Care is committed to offering professional skincare solutions with natural ingredients, ensuring healthy and glowing skin for everyone.',
        copyright: '© Skinzy Care. All Rights Reserved.',
    },
    ar: {
        dontMissOffer: 'لا تفوت العرض',
        emailPlaceholder: 'البريد الإلكتروني',
        quickLinks: 'روابط سريعة',
        home: 'الرئيسية',
        shop: 'المتجر',
        login: 'تسجيل الدخول',
        checkout: 'الدفع',
        company: 'الشركة',
        // addressLine: '٩٩ شارع نيو ثيم، XY، الولايات المتحدة 12345',
        email: 'info@skinzycare.com',
        phone: '0793053337 - 0793053338',
about: 'Skinzy Care ملتزمة بتقديم حلول عناية احترافية بالبشرة بمكونات طبيعية، لضمان بشرة صحية ومشرقة للجميع.',
        copyright: '© Skinzy Care. جميع الحقوق محفوظة.',
    }
  };

  const t = texts[locale] || texts.en;
  const primaryColor = '#ff671f';

  return (
    <footer ref={ref} className="bg-[#ff671f] text-white pt-20 mt-10 transition-all duration-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16">
          
          {/* Section 1: Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-5">{t.dontMissOffer}</h3>
            <form className="relative">
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                className="w-full py-3 pl-5 pr-12 rounded-full bg-white/20 border border-white/50 placeholder:text-white/80 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                style={{ color: primaryColor }}
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-5">{t.quickLinks}</h3>
            <ul className="space-y-2.5">
              <li><Link href={`/${locale}`} className="text-sm hover:opacity-80 transition-opacity">{t.home}</Link></li>
              <li><Link href={`/${locale}/subcategory`} className="text-sm hover:opacity-80 transition-opacity">{t.shop}</Link></li>
              <li><Link href={`/${locale}/auth/login`} className="text-sm hover:opacity-80 transition-opacity">{t.login}</Link></li>
              <li><Link href={`/${locale}/checkout`} className="text-sm hover:opacity-80 transition-opacity">{t.checkout}</Link></li>
            </ul>
          </div>

          {/* Section 3: Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-5">{t.company}</h3>
            <address className="text-white/80 text-sm not-italic leading-relaxed space-y-2">
              {/* <p>{t.addressLine}</p> */}
              <Link href={`mailto:${t.email}`} className="hover:text-white transition-colors">{t.email}</Link><br />
              <Link href={`tel:${t.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{t.phone}</Link>
              <p className="mt-2">{t.about}</p>
            </address>
          </div>

          {/* Section 4: Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-5">Follow Us</h3>
            <div className="flex gap-3">
              <Link href="https://www.facebook.com/profile.php?id=61574964286607&rdid=0k8iaoTm0BuSADV7" aria-label="Facebook" className="hover:text-white transition-colors"><Facebook size={20} /></Link>
              <Link href="https://www.instagram.com/skincarejo8" aria-label="Instagram" className="hover:text-white transition-colors"><Instagram size={20} /></Link>
              {/* <Link href="#" aria-label="Twitter" className="hover:text-white transition-colors"><Twitter size={20} /></Link> */}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/30 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/80 text-center">
          <p>{t.copyright}</p>
          <img src="/logo.png" alt="Logo" className="h-6" />
        </div>
      </div>
    </footer>
  );
}
