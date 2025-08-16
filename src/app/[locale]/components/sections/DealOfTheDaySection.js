'use client';
import React from 'react';
import { useOnScreen } from '@/hooks/useOnScreen';
import Image from 'next/image';
import Link from 'next/link'; // ✨ تم إضافة Link للزر
import { useLocale, useTranslations } from 'next-intl';

// ✨ تم تغيير اسم المكون ليعكس المحتوى الجديد
export default function AboutSection() {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  const locale = useLocale();
  const t = useTranslations('AboutSection'); // ✨ استخدام namespace جديد للترجمة

  return (
    <section
      ref={ref}
      className={`py-20 bg-white transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto px-4 max-w-screen-xl grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-20">
        
        {/* --- Image Column --- */}
        <div className="flex justify-center">
           {/* ✨ تم تغيير الصورة لواحدة أكثر ملاءمة */}
          <div className="w-full aspect-square overflow-hidden rounded-lg relative shadow-lg" style={{ minHeight: '350px' }}>
            <Image
              src="/about.png"
              alt={t('imageAlt')}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        </div>

        {/* --- Text Column --- */}
        {/* ✨ تم تغيير محاذاة النص لـ text-start لدعم اللغتين */}
        <div className="text-center md:text-start">
          <p className="text-orange-500 font-semibold mb-3 tracking-wider uppercase">{t('subtitle')}</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-5">
            {t('title')}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
            {t('description')}
          </p>

        </div>
      </div>
    </section>
  );
}