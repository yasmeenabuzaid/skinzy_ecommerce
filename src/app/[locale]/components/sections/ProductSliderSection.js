'use client';
import React, { useState, useRef } from 'react';
import { useOnScreen } from '../../../../hooks/useOnScreen';
import ProductCard from '../ui/ProductCard.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useProductsQuery from '../../../../hooks/useProductsQuery';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

export default function ProductSliderSection({ title, subtitle, filters, buttonText, buttonLink }) {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  const sliderRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState(filters ? filters[0] : '');
  const [isHovered, setIsHovered] = useState(false);
  const locale = useLocale();
  const t = useTranslations('productSlider'); // use translation namespace

  const { products, isLoading, error } = useProductsQuery();
  const router = useRouter();

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth / 2;
      sliderRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
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
        <div className="container mx-auto px-4 text-center text-red-500">{t('error')} {error}</div>
      </section>
    );
  }

  return (
    <section ref={ref} className={`py-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-gray-500 mb-1.5">{subtitle || t('defaultSubtitle')}</p>
          <h2 className="text-4xl font-semibold text-gray-800">{title}</h2>
        </div>

        {filters && (
          <div className="flex justify-center flex-wrap gap-2.5 mb-12">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`py-2.5 px-6 text-sm font-medium border rounded-full transition-colors ${
                  activeFilter === filter
                    ? 'bg-[#ef8172] text-white border-[#ef8172]'
                    : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        <div
          className="relative px-0 md:px-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && (
            <button onClick={() => scroll('prev')} className="absolute top-1/2 -translate-y-1/2 -left-2 md:left-0 w-10 h-10 bg-[#ef8172] text-white rounded-full hidden md:flex items-center justify-center hover:bg-opacity-80 transition-opacity z-10">
              <ChevronLeft size={20} />
            </button>
          )}

          <div ref={sliderRef} className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
            {products.map(product => (
              <div
                key={product.id}
                className="snap-start flex-shrink-0 w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.33%-1.33rem)] lg:w-[calc(25%-1.5rem)] xl:w-[calc(20%-1.6rem)]"
              >
                <Link href={`/${locale}/products/${product.id}`}>
                  <ProductCard product={product} />
                </Link>
              </div>
            ))}
          </div>

          {isHovered && (
            <button onClick={() => scroll('next')} className="absolute top-1/2 -translate-y-1/2 -right-2 md:right-0 w-10 h-10 bg-[#ef8172] text-white rounded-full hidden md:flex items-center justify-center hover:bg-opacity-80 transition-opacity z-10">
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {buttonText && (
          <div className="text-center mt-12">
            <Link href={buttonLink}>
              <span className="inline-block bg-gray-100 text-gray-800 font-semibold py-3.5 px-8 rounded-full border border-gray-300 hover:bg-[#ef8172] hover:text-white hover:border-[#ef8172] transition-all cursor-pointer">
                {buttonText || t('defaultButtonText')}
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
