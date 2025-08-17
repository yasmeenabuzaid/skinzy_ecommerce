'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from 'next-intl';
import useBrandsQuery from "../../../../hooks/useBrandsQuery";

// No changes needed for this Intersection Observer hook
const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return [ref, isVisible];
};

const BrandsSection = memo(function BrandsSection() {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  const { brands, isLoadingBrands, errorBrands } = useBrandsQuery();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('brandsSection');

  const handleBrandClick = useCallback((brandId) => {
    router.push(`/${locale}/brands/${brandId}`);
  }, [router, locale]);
  
  const animationDuration = (brands?.length || 10) * 0.9;

  if (isLoadingBrands) return <p className="text-center py-16">{t('loading')}</p>;
  if (errorBrands) return <p className="text-center text-red-500 py-16">{t('error')} {errorBrands.message}</p>;
  if (!brands?.length) return <p className="text-center py-16">{t('noBrands')}</p>;
  
  return (
    <section
      ref={ref}
      className={`py-16 bg-gray-50 border-y border-gray-200 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
    <div 
  className="flex flex-nowrap justify-start hover:[animation-play-state:paused] animate-scroll-left"
  style={{ '--animation-duration': `${animationDuration}s` }}
>
  {/* الحل: نكرر القائمة مرتين فقط، هذا كافٍ تمامًا */}
  {[...brands, ...brands].map((brand, index) => (
    <div
      key={`${brand.id}-${index}`}
      className="w-52 flex-shrink-0 flex items-center justify-center px-8 cursor-pointer group"
      onClick={() => handleBrandClick(brand.id)}
    >
      <Image
        src={brand.image || "/placeholder-brand.svg"}
        alt={brand.name || 'Brand Logo'}
        width={200}
        height={64}
        className="object-contain opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ color: 'transparent' }}
      />
    </div>
  ))}
</div>
        </div>
      </div>
    </section>
  );
});


export default function App() {
  const t = useTranslations('brandsSection');

  return (
    <div className="bg-white font-sans">
      <main>
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 mb-1.5">{t('shopByCategories')}</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-12">
            {t('ourSeasonBrands')}
          </h2>
          <BrandsSection />
        </div>
      </main>
    </div>
  );
}