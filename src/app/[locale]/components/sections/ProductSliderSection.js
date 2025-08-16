'use client';
// ✨ --- START: Correction --- ✨
// The missing hooks (useRef, useState, etc.) have been added to the import statement.
import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
// ✨ --- END: Correction --- ✨
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// --- Custom Hooks & Components ---
import useProductsQuery from '../../../../hooks/useProductsQuery';
import ProductCard from '../ui/ProductCard.js';

// ====================================================================
// 1. Helper Components (مكونات مساعدة)
// ====================================================================

/**
 * زر التنقل للسلايدر (يمين ويسار)
 */
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

/**
 * حالة التحميل (Loading Skeleton)
 */
const LoadingState = ({ t, title, subtitle }) => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <p className="text-gray-500 mb-1.5">{subtitle || t('defaultSubtitle')}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
      </div>
      {/* Skeleton for filters */}
      <div className="flex justify-center flex-wrap gap-2.5 mb-12 animate-pulse">
        <div className="bg-gray-200 rounded-full h-10 w-28"></div>
        <div className="bg-gray-200 rounded-full h-10 w-32"></div>
        <div className="bg-gray-200 rounded-full h-10 w-24"></div>
      </div>
      {/* Skeleton for products */}
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

/**
 * حالة عرض الخطأ
 */
const ErrorState = ({ t, error }) => (
  <section className="py-20">
    <div className="container mx-auto px-4 text-center text-red-600 bg-red-50 p-8 rounded-lg">
      <h3 className="text-xl font-semibold mb-2">{t('error')}</h3>
      <p>{error.message}</p>
    </div>
  </section>
);


// ====================================================================
// 2. Main Component (المكون الرئيسي)
// ====================================================================

export default function ProductSliderSection({
  title,
  subtitle,
  buttonText,
  buttonLink,
}) {
  const sliderRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('');
  const [canScroll, setCanScroll] = useState({ prev: false, next: true });
  const locale = useLocale();
  const t = useTranslations('productSlider');

  // جلب كل المنتجات (للفلترة)
  const { products, isLoading, error } = useProductsQuery();

  // استخلاص الفلاتر الأكثر شيوعاً
  const filters = useMemo(() => {
    if (!products || products.length === 0) return [];
    const counts = {};
    products.forEach(product => {
      const subCatId = product.sub_category_id;
      if (subCatId) {
        counts[subCatId] = (counts[subCatId] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([subCatId]) => subCatId);
  }, [products]);

  // تعيين الفلتر النشط تلقائياً عند تحميل البيانات
  useEffect(() => {
    if (filters.length > 0 && !activeFilter) {
      setActiveFilter(filters[0]);
    }
  }, [filters, activeFilter]);

  // فلترة المنتجات بناءً على الفلتر النشط
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const allProducts = activeFilter
      ? products.filter(p => p.sub_category_id?.toString() === activeFilter?.toString())
      : products;
    return allProducts.slice(0, 15); // عرض 15 منتج كحد أقصى
  }, [products, activeFilter]);

  // دالة للتحقق من إمكانية التحريك
  const checkScrollability = useCallback(() => {
    const el = sliderRef.current;
    if (el) {
      const isAtStart = el.scrollLeft <= 0;
      const isAtEnd = el.scrollWidth - el.scrollLeft - el.clientWidth <= 1;
      setCanScroll({ prev: !isAtStart, next: !isAtEnd });
    }
  }, []);

  // إضافة مستمع للتحقق من التحريك
  useEffect(() => {
    const el = sliderRef.current;
    if (el && filteredProducts.length > 0) {
      el.addEventListener('scroll', checkScrollability, { passive: true });
      window.addEventListener('resize', checkScrollability);
      checkScrollability();
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      }
    };
  }, [filteredProducts, checkScrollability]);
  
  // دالة لتحريك السلايدر
  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // دالة لجلب اسم الفئة الفرعية
  const getSubCategoryNameById = (id) => {
    if (!products) return id;
    const productWithSubCategory = products.find(p => p.sub_category_id?.toString() === id.toString());
    if (productWithSubCategory?.sub_category) {
      return locale === 'ar'
        ? productWithSubCategory.sub_category.name_ar || productWithSubCategory.sub_category.name
        : productWithSubCategory.sub_category.name;
    }
    return id;
  };

  if (isLoading) return <LoadingState t={t} title={title} subtitle={subtitle} />;
  if (error) return <ErrorState t={t} error={error} />;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* --- Section Header --- */}
        <div className="text-center mb-8">
          <p className="text-gray-500 mb-1.5">{subtitle || t('defaultSubtitle')}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
        </div>

        {/* --- Filter Buttons --- */}
        {filters.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2.5 mb-12">
            {filters.map((filterId) => (
              <button
                key={filterId}
                onClick={() => setActiveFilter(filterId)}
                className={`py-2.5 px-6 text-sm font-medium border rounded-full transition-all duration-300 ${
                  activeFilter === filterId
                    ? 'bg-[#FF671F] text-white border-[#FF671F] shadow-md'
                    : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                {getSubCategoryNameById(filterId)}
              </button>
            ))}
          </div>
        )}

        {/* --- Slider Container --- */}
        <div className="relative px-0 md:px-8">
          <SliderButton direction="prev" onClick={() => scroll('prev')} aria-label="Previous products" disabled={!canScroll.prev} />

          <div
            ref={sliderRef}
            className="grid grid-flow-col auto-cols-[calc(50%-0.5rem)] sm:auto-cols-[calc(33.33%-0.66rem)] lg:auto-cols-[calc(25%-0.75rem)] gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 no-scrollbar"
          >
            {filteredProducts.map((product) => (
              <div key={product.id} className="snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <SliderButton direction="next" onClick={() => scroll('next')} aria-label="Next products" disabled={!canScroll.next} />
        </div>

        {/* --- "Browse All" Button --- */}
        {buttonText && buttonLink && (
          <div className="text-center mt-12">
            <Link href={buttonLink}>
              <span className="inline-block bg-white text-gray-800 font-semibold py-3 px-8 rounded-full border border-gray-300 hover:bg-[#FF671F] hover:text-white hover:border-[#FF671F] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1">
                {buttonText || t('defaultButtonText')}
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
