'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from 'next-intl';
import useBrandsQuery from "../../../../hooks/useBrandsQuery";

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

function BrandsSection() {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  const { brands, isLoadingBrands, errorBrands } = useBrandsQuery();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('brandsSection');

  const handleBrandClick = (brandId) => {
    router.push(`/${locale}/brands/${brandId}`);
  };

  const animationDuration = (brands?.length || 10) * 3;

  if (isLoadingBrands) return <p className="text-center py-16">{t('loading')}</p>;
  if (errorBrands) return <p className="text-center text-red-500 py-16">{t('error')} {errorBrands.message}</p>;
  if (!brands?.length) return <p className="text-center py-16">{t('noBrands')}</p>;

  return (
    <>
      <style>
        {`
          @keyframes scroll-left {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              transform: translate3d(-50%, 0, 0);
            }
          }
          .animate-scroll-left {
            will-change: transform;
            animation: scroll-left ${animationDuration}s linear infinite;
          }
        `}
      </style>
      <section
        ref={ref}
        className={`py-16 bg-gray-50 border-y border-gray-200 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <div className="flex animate-scroll-left hover:[animation-play-state:paused]">
              {[...brands, ...brands].map((brand, index) => (
                <div
                  key={`${brand.id}-${index}`}
                  className="w-52 flex-shrink-0 flex items-center justify-center px-8 cursor-pointer"
                  onClick={() => handleBrandClick(brand.id)}
                >
                  <img
                    src={brand.image || "https://placehold.co/208x64/f0f0f0/333?text=Brand"}
                    alt={brand.name || 'Brand Logo'}
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/208x64/f0f0f0/333?text=Error'; }}
                    className="max-h-16 object-contain opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

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
