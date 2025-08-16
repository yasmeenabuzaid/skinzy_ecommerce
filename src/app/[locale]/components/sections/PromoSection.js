'use client';
import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useOnScreen } from '../../../../hooks/useOnScreen';

// ✨ --- أيقونات جديدة للخدمات --- ✨
const ShieldCheckIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const TruckIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const HeadsetIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);
// --- نهاية الأيقونات ---

// ✨ تم تغيير اسم المكون لـ ServicesSection
export default function ServicesSection() {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  const locale = useLocale();
  const t = useTranslations('services');

  // ✨ بيانات الخدمات مع الأيقونات
  const services = [
    {
      icon: <ShieldCheckIcon className="w-10 h-10 text-orange-500" />,
      title: t('items.0.title'),
      description: t('items.0.description'),
    },
    {
      icon: <TruckIcon className="w-10 h-10 text-orange-500" />,
      title: t('items.1.title'),
      description: t('items.1.description'),
    },
    {
      icon: <HeadsetIcon className="w-10 h-10 text-orange-500" />,
      title: t('items.2.title'),
      description: t('items.2.description'),
    },
  ];

  return (
    <section
      ref={ref}
      className={`py-20 bg-orange-50 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto px-4">
        {/* --- Section Header --- */}
        <div className="text-center mb-12">
          <p className="text-orange-500 font-semibold mb-2 uppercase tracking-wider">{t('subtitle')}</p>
          <h2 className="text-4xl font-bold text-gray-800">{t('title')}</h2>
        </div>

        {/* --- Services Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              // ✨ تصميم بطاقة الخدمة
              className="bg-white p-8 rounded-xl shadow-md text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="flex justify-center mb-5">
                <div className="bg-orange-100 p-4 rounded-full">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}