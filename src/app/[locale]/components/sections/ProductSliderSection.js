'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

// --- Custom Hooks & Components ---
import useProductsQuery from '../../../../hooks/useProductsQuery';
import ProductCard from '../ui/ProductCard.js';

// ====================================================================
// 1. Helper Components (مكونات مساعدة)
// ====================================================================

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
// 2. Main Component (المكون الرئيسي بتصميم Grid)
// ====================================================================

// ✨ تم تغيير اسم المكون ليعكس التصميم الجديد
export default function FeaturedProductsGrid({
  title,
  subtitle,
  buttonText,
  buttonLink,
}) {
  const [activeFilter, setActiveFilter] = useState('');
  const locale = useLocale();
  const t = useTranslations('productSlider'); // يمكنك تغيير الاسم لاحقاً

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
    // ✨ يمكنك التحكم بعدد المنتجات المعروضة هنا
    return allProducts.slice(0, 8); 
  }, [products, activeFilter]);

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

        {/* ✨ --- Products Grid Container (تم التعديل هنا) --- ✨ */}
        {/* تم استبدال السلايدر بشبكة متجاوبة */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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