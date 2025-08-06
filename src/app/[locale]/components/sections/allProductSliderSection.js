'use client';
import React, { useState, useRef } from 'react';
// Assuming useOnScreen is a custom hook you have
// import { useOnScreen } from '../../../../hooks/useOnScreen'; 
import ProductCard from '../ui/ProductCard.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useProductsQuery from '../../../../hooks/useProductsQuery';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

// Mock hook for demonstration purposes
const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(true); // Default to true for demo
  return [ref, isVisible];
};


export default function LatestProductsSlider() {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const locale = useLocale();
  const t = useTranslations('productSlider');
  const router = useRouter();

  // Fetch latest products by created_at
  const { products, isLoading, error } = useProductsQuery({
    sortBy: 'created_at',
    order: 'desc',
    limit: 15,
  });

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
        <div className="text-center mb-12">
          <p className="text-gray-500 mb-1.5">{t('latestSubtitle') || 'وصل حديثاً'}</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">{t('latestTitle') || 'أجدد المنتجات'}</h2>
        </div>

        <div
          className="relative px-0 md:px-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* --- START: Slider Buttons (Desktop Only) --- */}
          {isHovered && (
            <button
              onClick={() => scroll('prev')}
              aria-label="Previous products"
              className="absolute top-1/2 -translate-y-1/2 -left-2 md:left-0 w-10 h-10 bg-[#ef8172] text-white rounded-full hidden md:flex items-center justify-center hover:bg-opacity-80 transition-opacity z-10"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {/* --- END: Slider Buttons --- */}

          {/* START OF CHANGES:
            - On mobile (default): Use `grid grid-cols-2 gap-4` to display products in a 2-column grid.
            - On medium screens and up (`md:`): Switch to `flex` and `overflow-x-auto` to create the horizontal slider.
          */}
          <div
            ref={sliderRef}
            className="grid grid-cols-2 gap-4 md:flex md:gap-8 md:overflow-x-auto md:snap-x md:snap-mandatory md:pb-4 md:scrollbar-hide"
          >
            {products.map((product) => (
              /*
                - On mobile: This div has no specific width, so it fills a grid cell.
                - On `md` and up: It gets the necessary classes for the flex slider.
              */
              <div
                key={product.id}
                className="md:snap-start md:flex-shrink-0 md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)] xl:w-[calc(25%-1.5rem)]"
              >
                <Link href={`/${locale}/products/${product.id}`} className="block h-full">
                  <ProductCard product={product} />
                </Link>
              </div>
            ))}
          </div>
          {/* END OF CHANGES */}
          
          {/* --- START: Slider Buttons (Desktop Only) --- */}
          {isHovered && (
            <button
              onClick={() => scroll('next')}
              aria-label="Next products"
              className="absolute top-1/2 -translate-y-1/2 -right-2 md:right-0 w-10 h-10 bg-[#ef8172] text-white rounded-full hidden md:flex items-center justify-center hover:bg-opacity-80 transition-opacity z-10"
            >
              <ChevronRight size={20} />
            </button>
          )}
          {/* --- END: Slider Buttons --- */}
        </div>

        <div className="text-center mt-12">
          <Link href={`/${locale}/subcategory`}>
            <span className="inline-block bg-gray-100 text-gray-800 font-semibold py-3.5 px-8 rounded-full border border-gray-300 hover:bg-[#ef8172] hover:text-white hover:border-[#ef8172] transition-all cursor-pointer">
              {t('browseProducts') || 'تصفح كل المنتجات'}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
