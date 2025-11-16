'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../ui/ProductCard.js';

// Helper Components
const SliderButton = ({ direction, onClick, 'aria-label': ariaLabel, disabled }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    disabled={disabled}
    className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full shadow-lg hidden md:flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 z-10 disabled:opacity-0 disabled:cursor-not-allowed ${
      direction === 'prev' ? 'left-0' : 'right-0'
    }`}
  >
    {direction === 'prev' ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
  </button>
);

const LoadingState = ({ t }) => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <p className="text-[#FF671F] font-semibold mb-1.5">{t('latestSubtitle')}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('latestTitle')}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-56 w-full mb-4"></div>
            <div className="bg-gray-200 rounded h-4 w-3/4 mb-2"></div>
            <div className="bg-gray-200 rounded h-4 w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ErrorState = ({ t, error }) => (
  <section className="py-20">
    <div className="container mx-auto px-4 text-center text-red-600 bg-red-50 p-8 rounded-lg">
      <h3 className="text-xl font-semibold mb-2">{t('error')}</h3>
      <p>{error?.message || 'An unexpected error occurred.'}</p>
    </div>
  </section>
);

// ⭐️ المكون الرئيسي يستقبل البيانات كـ props
export default function LatestProductsSlider({ products, isLoading, error }) {
  const sliderRef = useRef(null);
  const [canScroll, setCanScroll] = useState({ prev: false, next: true });
  const locale = useLocale();
  const t = useTranslations('productSlider');

  // ❌ تم حذف: const { products, isLoading, error } = useProductsQuery(); 

  const checkScrollability = useCallback(() => {
    const el = sliderRef.current;
    if (el) {
      const isAtStart = el.scrollLeft <= 0;
      const isAtEnd = el.scrollWidth - el.scrollLeft - el.clientWidth <= 1;
      setCanScroll({ prev: !isAtStart, next: !isAtEnd });
    }
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (el && products?.length > 0) {
      const handleScroll = () => checkScrollability();
      const handleResize = () => checkScrollability();
      el.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize);
      checkScrollability();
      return () => {
        el.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [products, checkScrollability]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) return <LoadingState t={t} />;
  if (error) return <ErrorState t={t} error={error} />;
  if (!products || products.length === 0) return null; // لا تعرض شيئًا إذا كانت البيانات فارغة

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-[#FF671F] font-semibold mb-1.5">{t('latestSubtitle')}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('latestTitle')}</h2>
        </div>
        <div className="relative px-0 md:px-8">
          <SliderButton direction="prev" onClick={() => scroll('prev')} aria-label="Previous products" disabled={!canScroll.prev} />
          <div
            ref={sliderRef}
            className="grid grid-flow-col auto-cols-[calc(50%-0.5rem)] sm:auto-cols-[calc(33.33%-0.66rem)] lg:auto-cols-[calc(25%-0.75rem)] gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 no-scrollbar"
          >
            {products.map((product) => (
              <div key={product.id} className="snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <SliderButton direction="next" onClick={() => scroll('next')} aria-label="Next products" disabled={!canScroll.next} />
        </div>
        <div className="text-center mt-12">
          <Link href={`/${locale}/subcategory`}>
            <span className="inline-block bg-white text-gray-800 font-semibold py-3 px-8 rounded-full border border-gray-300 hover:bg-[#FF671F] hover:text-white hover:border-[#FF671F] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1">
              {t('browseProducts')}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

