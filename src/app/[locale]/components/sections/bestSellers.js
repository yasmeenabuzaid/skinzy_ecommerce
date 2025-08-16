'use client';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import ProductCard from '../ui/ProductCard.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useProductsQuery from '../../../../hooks/useProductsQuery.js';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  return [ref, isVisible];
};

export default function ProductSliderSection({
  title,
  subtitle,
  buttonText,
  buttonLink,
}) {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const locale = useLocale();
  const t = useTranslations('productSlider');
  const { products, isLoading, error } = useProductsQuery();
  const router = useRouter();

  // ترتيب المنتجات حسب sold_count من الأعلى للأقل
  const bestSellers = useMemo(() => {
    if (!products) return [];
    return [...products].sort((a, b) => b.sold_count - a.sold_count).slice(0, 8);
  }, [products]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth / 2;
      sliderRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center text-gray-500">{t('loading')}</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center text-red-500">
          {t('error')} {error.message}
        </div>
      </section>
    );
  }
  return (
    <section
      ref={ref}
      className={`py-20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-gray-500 mb-1.5">{subtitle || t('defaultSubtitle')}</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">{title}</h2>
        </div>

        <div
          className="relative px-0 md:px-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && (
            <button
              onClick={() => scroll('prev')}
              aria-label="Previous products"
              className="absolute top-1/2 -translate-y-1/2 -left-2 md:left-0 w-10 h-10 bg-[#FF671F] text-white rounded-full hidden md:flex items-center justify-center hover:bg-opacity-80 transition-opacity z-10"
            >
              <ChevronLeft size={20} />
            </button>
          )}

           <div
  ref={sliderRef}
  className="grid grid-cols-2 gap-4 md:flex md:gap-8 md:overflow-x-auto md:snap-x md:snap-mandatory md:pb-4 no-scrollbar"
>
           {bestSellers.map((product) => (
  <div
    key={product.id}
    className="md:snap-start md:flex-shrink-0 md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)] xl:w-[calc(25%-1.5rem)]"
  >
    <ProductCard product={product} />
  </div>
))}

          </div>

          {isHovered && (
            <button
              onClick={() => scroll('next')}
              aria-label="Next products"
              className="absolute top-1/2 -translate-y-1/2 -right-2 md:right-0 w-10 h-10 bg-[#FF671F] text-white rounded-full hidden md:flex items-center justify-center hover:bg-opacity-80 transition-opacity z-10"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {buttonText && buttonLink && (
          <div className="text-center mt-12">
            <Link href={buttonLink}>
              <span className="inline-block bg-gray-100 text-gray-800 font-semibold py-3.5 px-8 rounded-full border border-gray-300 hover:bg-[#FF671F] hover:text-white hover:border-[#FF671F] transition-all cursor-pointer">
                {buttonText || t('defaultButtonText')}
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
