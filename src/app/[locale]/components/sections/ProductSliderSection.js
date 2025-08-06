'use client';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import ProductCard from '../ui/ProductCard.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useProductsQuery from '../../../../hooks/useProductsQuery';
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
  const [activeFilter, setActiveFilter] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const locale = useLocale();
  const t = useTranslations('productSlider');
  const { products, isLoading, error } = useProductsQuery();
  const router = useRouter();

  const filters = useMemo(() => {
    if (!products || products.length === 0) return [];
    const counts = {};
    products.forEach(product => {
      const subCatId = product.sub_category_id;
      if (subCatId) {
        counts[subCatId] = (counts[subCatId] || 0) + 1;
      }
    });
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([subCatId]) => subCatId);
    return sorted;
  }, [products]);

  useEffect(() => {
    if (filters.length > 0 && !activeFilter) {
      setActiveFilter(filters[0]);
    }
  }, [filters, activeFilter]);

  const filteredProducts = useMemo(() => {
    const allProducts = activeFilter
      ? products.filter(
          product => product.sub_category_id?.toString() === activeFilter?.toString()
        )
      : products;
    return allProducts.slice(0, 8);
  }, [products, activeFilter]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth / 2;
      sliderRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getSubCategoryNameById = (id) => {
    if (!products) return id;
    
    const productWithSubCategory = products.find(p => p.sub_category_id?.toString() === id.toString());

    if (productWithSubCategory && productWithSubCategory.sub_category) {
      return locale === 'ar'
        ? productWithSubCategory.sub_category.name_ar || productWithSubCategory.sub_category.name
        : productWithSubCategory.sub_category.name;
    }
    
    return id;
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

        {filters.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2.5 mb-12">
            {filters.map((filterId) => (
              <button
                key={filterId}
                onClick={() => setActiveFilter(filterId)}
                className={`py-2.5 px-6 text-sm font-medium border rounded-full transition-colors ${
                  activeFilter === filterId
                    ? 'bg-[#ef8172] text-white border-[#ef8172]'
                    : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {getSubCategoryNameById(filterId)}
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
            <button
              onClick={() => scroll('prev')}
              aria-label="Previous products"
              className="absolute top-1/2 -translate-y-1/2 -left-2 md:left-0 w-10 h-10 bg-[#ef8172] text-white rounded-full hidden md:flex items-center justify-center hover:bg-opacity-80 transition-opacity z-10"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div
            ref={sliderRef}
            className="grid grid-cols-2 gap-4 md:flex md:gap-8 md:overflow-x-auto md:snap-x md:snap-mandatory md:pb-4 md:scrollbar-hide"
          >
            {filteredProducts.map((product) => (
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

          {isHovered && (
            <button
              onClick={() => scroll('next')}
              aria-label="Next products"
              className="absolute top-1/2 -translate-y-1/2 -right-2 md:right-0 w-10 h-10 bg-[#ef8172] text-white rounded-full hidden md:flex items-center justify-center hover:bg-opacity-80 transition-opacity z-10"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {buttonText && buttonLink && (
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
