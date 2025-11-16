'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

// ⭐️ 1. استيراد هوك المنتجات
import useProductsQuery from '../../hooks/useProductsQuery'; 
// ⭐️ 2. إعادة استيراد هوك التصنيفات
import useCategoryQuery from '../../hooks/useCategoriesQuery'; 

// Import Components (باقي المكونات الثابتة)
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import CartDrawer from './components/cart/CartDrawer';
import HeroSection from './components/sections/HeroSection';
import BrandsSection from './components/sections/BrandsSection';
import CategoriesSection from './components/sections/CategoriesSection';
import PromoSection from './components/sections/PromoSection';
import ProductSection from './components/sections/ProductSection'; 
import DealOfTheDaySection from './components/sections/DealOfTheDaySection';
import DiscoverSection from './components/sections/DiscoverSection';
import TestimonialSection from './components/sections/TestimonialSection';


// ⭐️ المكون لم يعد يستقبل التصنيفات كـ prop
export default function HomePage() { 
    const t = useTranslations();
    const locale = useLocale();
    const [isCartOpen, setIsCartOpen] = useState(false);

    // ⭐️ جلب بيانات المنتجات
    const { products, isLoading, error } = useProductsQuery();

    // ⭐️ جلب بيانات التصنيفات هنا
    const { 
        categories: categoriesData, 
        isLoadingCategories, 
        errorCategories: errorCategories 
    } = useCategoryQuery(); 
    
    // 💡 الآن، كل من المنتجات والتصنيفات ستبدأ الجلب مع تحميل المكون

    useEffect(() => {
        document.body.style.overflow = isCartOpen ? 'hidden' : 'auto';
    }, [isCartOpen]);

    return (
        <div className='text-black'>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            <main>
                <HeroSection />
                <div className="h-10" />
                <BrandsSection />
                <div className="h-10" />
                
                {/* ⭐️ تمرير بيانات التصنيفات التي تم جلبها في نفس الصفحة */}
                <CategoriesSection 
                    categories={categoriesData}
                    isLoading={isLoadingCategories} 
                    error={errorCategories}
                />
                
                <div className="h-10" />

                {/* ⭐️ القسم 1: سلايدر للمنتجات الأكثر مبيعاً */}
                <ProductSection
                    title="Trending Products"
                    subtitle="Discover Our Best Sellers"
                    products={products} 
                    isLoading={isLoading}
                    error={error}
                    layout="slider" 
                    filterType="bestsellers" 
                    buttonText="View all"
                    buttonLink={`/${locale}/subcategory`}
                />
                <div className="h-10" />
                
                {/* ... (باقي الأقسام) */}
                <PromoSection />
                <div className="h-10" />

                <ProductSection
                    title="This Week's Highlights"
                    subtitle="Shop By Discounts"
                    products={products} 
                    isLoading={isLoading}
                    error={error}
                    layout="grid" 
                    filterType="discounted" 
                    buttonText="View all"
                    buttonLink={`/${locale}/subcategory`}
                />
                <div className="h-10" />

                <DiscoverSection />
                <div className="h-10" />
                <DealOfTheDaySection />
                <div className="h-10" />
                
                {/* التأكد من إضافة ProductSection أخرى هنا إذا كانت مكررة في النسخة الأصلية */}
                <ProductSection
                    title="Grid Section Example"
                    subtitle="Another Grid"
                    products={products} 
                    isLoading={isLoading}
                    error={error}
                    layout="grid" 
                    filterType="none" // لا توجد فلترة محددة
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