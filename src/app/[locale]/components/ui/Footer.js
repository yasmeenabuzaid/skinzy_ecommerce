'use client';
import React from 'react';
import { useOnScreen } from '../../../../hooks/useOnScreen';
import { Twitter, Facebook, Instagram, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function Footer() {
  const [ref] = useOnScreen({ threshold: 0.1 });
  const locale = useLocale();

  // الترجمات
  const texts = {
    en: {
      dontMissOffer: "Don't miss offer",
      emailPlaceholder: 'Email',
      quickLinks: 'Quick links',
      home: 'Home',
      shop: 'Shop',
      login: 'Login',
      checkout: 'Checkout',
      storePolicy: 'Store policy',
      privacyPolicy: 'Privacy Policy',
      refundPolicy: 'Refund Policy',
      shippingPolicy: 'Shipping Policy',
      company: 'Company',
      addressLine: '99 New Theme St. XY, USA 12345',
      email: 'demo@example.com',
      phone: '+01 123 456 789',
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
      storePolicy: 'سياسة المتجر',
      privacyPolicy: 'سياسة الخصوصية',
      refundPolicy: 'سياسة الاسترجاع',
      shippingPolicy: 'سياسة الشحن',
      company: 'الشركة',
      addressLine: '٩٩ شارع نيو ثيم، XY، الولايات المتحدة 12345',
      email: 'demo@example.com',
      phone: '+01 123 456 789',
      copyright: '© Skinzy Care. جميع الحقوق محفوظة.',
    }
  };

  const t = texts[locale] || texts.en;

  return (
    <footer ref={ref} className="bg-gray-100 pt-20 mt-10 transition-all duration-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16">
          <div>
            <h3 className="text-lg font-semibold mb-5">{t.dontMissOffer}</h3>
            <form className="relative">
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                className="w-full py-3 pl-5 pr-12 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#ef8172] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-[#ef8172] transition-colors"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5">{t.quickLinks}</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href={`/${locale}`} className="text-gray-500 hover:text-gray-800 text-sm">{t.home}</Link>
              </li>
              <li>
                <Link href={`/${locale}/subcategory`} className="text-gray-500 hover:text-gray-800 text-sm">{t.shop}</Link>
              </li>
              <li>
                <Link href={`/${locale}/auth/login`} className="text-gray-500 hover:text-gray-800 text-sm">{t.login}</Link>
              </li>
              <li>
                <Link href={`/${locale}/checkout`} className="text-gray-500 hover:text-gray-800 text-sm">{t.checkout}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5">{t.storePolicy}</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href={`/${locale}/privacypolicy`} className="text-gray-500 hover:text-gray-800 text-sm">{t.privacyPolicy}</Link>
              </li>
              <li>
                <Link href={`/${locale}/refundpolicy`} className="text-gray-500 hover:text-gray-800 text-sm">{t.refundPolicy}</Link>
              </li>
              <li>
                <Link href={`/${locale}/shippingpolicy`} className="text-gray-500 hover:text-gray-800 text-sm">{t.shippingPolicy}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5">{t.company}</h3>
            <address className="text-gray-500 text-sm not-italic leading-relaxed space-y-2">
              <p>{t.addressLine}</p>
              <Link href="mailto:demo@example.com" className="hover:text-gray-800">{t.email}</Link><br />
              <Link href="tel:+0123456789" className="hover:text-gray-800">{t.phone}</Link>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <Link href="https://www.facebook.com/profile.php?id=61574964286607&rdid=0k8iaoTm0BuSADV7" aria-label="Facebook" className="hover:text-gray-800"><Facebook size={18} /></Link>
            <Link href="https://www.instagram.com/skincarejo8" aria-label="Instagram" className="hover:text-gray-800"><Instagram size={18} /></Link>
          </div>
          <p>{t.copyright}</p>
          <img src="/logo.png" alt="Logo" className="h-6" />
        </div>
      </div>
    </footer>
  );
}
