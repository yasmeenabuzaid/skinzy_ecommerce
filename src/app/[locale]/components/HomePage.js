'use client'; // ⭐️ يبقى "use client" لوجود useState

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

// ❌ 1. لم نعد بحاجة لهذه الهوكس
// import useProductsQuery from '../../hooks/useProductsQuery'; 
// import useCategoryQuery from '../../hooks/useCategoriesQuery'; 

// ... (باقي imports المكونات كما هي)
import ScrollToTopButton from './ui/ScrollToTopButton';
import CartDrawer from './cart/CartDrawer';
import HeroSection from './sections/HeroSection';
import BrandsSection from './sections/BrandsSection';
import CategoriesSection from './sections/CategoriesSection';
import ProductSection from './sections/ProductSection';
import PromoSection from './sections/PromoSection';
import DiscoverSection from './sections/DiscoverSection';
import DealOfTheDaySection from './sections/DealOfTheDaySection';
import TestimonialSection from './sections/TestimonialSection';
// ... (الخ)


// ⭐️ 2. المكون أصبح يستقبل البيانات كـ props
export default function HomePage({ products, categories }) { 
  const t = useTranslations();
  const locale = useLocale();
  
  // ⭐️ هذا الكود التفاعلي يبقى كما هو
  const [isCartOpen, setIsCartOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : 'auto';
  }, [isCartOpen]);


  // ❌ 3. نحذف كل ما يتعلق بـ data fetching من هنا
  // const { products, isLoading, error } = useProductsQuery();
  // const { 
  //     categories: categoriesData, 
  //     isLoadingCategories, 
  //     errorCategories: errorCategories 
  // } = useCategoryQuery(); 
  
  
  return (
    <div className='text-black'>
      {/* هذا المكون تفاعلي ويبقى هنا */}
      {/* <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}

      <main>
        <HeroSection />
        <div className="h-10" />
        <BrandsSection />
        <div className="h-10" />
        
        {/* ⭐️ 4. نمرر الـ props مباشرة */}
        {/* 💡 ملاحظة: لم نعد بحاجة لـ isLoading/error هنا */}
        <CategoriesSection 
          categories={categories} // ⬅️ من الـ props
          isLoading={false}       // ⬅️ البيانات جاهزة
          error={null}            // ⬅️ لا يوجد خطأ
        />
        
        <div className="h-10" />

        {/* ⭐️ 5. نمرر الـ props مباشرة */}
        <ProductSection
          title="Trending Products"
          subtitle="Discover Our Best Sellers"
          products={products} // ⬅️ من الـ props
          isLoading={false}   // ⬅️ البيانات جاهزة
          error={null}        // ⬅️ لا يوجد خطأ
          layout="slider" 
          filterType="bestsellers" 
          buttonText="View all"
          buttonLink={`/${locale}/subcategory`}
        />
        
        {/* ... (طبق نفس المبدأ على باقي الأقسام) ... */}
        
        <PromoSection />
        <div className="h-10" />

        <ProductSection
          title="This Week's Highlights"
          subtitle="Shop By Discounts"
          products={products} // ⬅️ من الـ props
          isLoading={false}   // ⬅️ البيانات جاهزة
          error={null}        // ⬅️ لا يوجد خطأ
          layout="grid" 
          filterType="discounted" 
          buttonText="View all"
          buttonLink={`/${locale}/subcategory`}
        />
        
        {/* ... (الخ) ... */}
        
        <DiscoverSection />
        <div className="h-10" />
        <DealOfTheDaySection />
        <div className="h-10" />
        
        <ProductSection
          title="Grid Section Example"
          subtitle="Another Grid"
          products={products} // ⬅️ من الـ props
          isLoading={false}
          error={null}
          layout="grid" 
          filterType="none" 
          buttonText="View all"
          buttonLink={`/${locale}/subcategory`}
        />
        <div className="h-10" />

        <TestimonialSection />
      </main>

      <ScrollToTopButton />
    </div>
  );
}