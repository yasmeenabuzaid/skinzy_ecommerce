'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

// Components
import ScrollToTopButton from './ui/ScrollToTopButton';
// import CartDrawer from './cart/CartDrawer'; // (Uncomment if needed later)
import HeroSection from './sections/HeroSection';
import BrandsSection from './sections/BrandsSection';
import CategoriesSection from './sections/CategoriesSection';
import ProductSection from './sections/ProductSection';
import PromoSection from './sections/PromoSection';
import DiscoverSection from './sections/DiscoverSection';
import DealOfTheDaySection from './sections/DealOfTheDaySection';
import TestimonialSection from './sections/TestimonialSection';

export default function HomePage({ products, categories }) { 
  // 1. تحديد النيم سبيس الخاص بالصفحة الرئيسية
  const t = useTranslations('HomePage');
  const locale = useLocale();
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : 'auto';
  }, [isCartOpen]);

  return (
    <div className='text-black'>
      {/* <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}

      <main>
        <HeroSection />
        <div className="h-10" />
        
        <BrandsSection />
        <div className="h-10" />
        
        {/* Categories Section */}
        <CategoriesSection 
          categories={categories} 
          isLoading={false}
          error={null}
        />
        
        <div className="h-10" />

        {/* 🟢 Section 1: Trending Products */}
        <ProductSection
          title={t('trendingTitle')}       // "Trending Products"
          subtitle={t('trendingSubtitle')} // "Discover Our Best Sellers"
          products={products}
          isLoading={false}
          error={null}
          layout="slider" 
          filterType="bestsellers" 
          buttonText={t('viewAll')}        // "View all"
          buttonLink={`/${locale}/subcategory`}
        />
        
        <PromoSection />
        <div className="h-10" />

        {/* 🟢 Section 2: Highlights / Discounts */}
        <ProductSection
          title={t('highlightsTitle')}     // "This Week's Highlights"
          subtitle={t('highlightsSubtitle')} // "Shop By Discounts"
          products={products}
          isLoading={false}
          error={null}
          layout="grid" 
          filterType="discounted" 
          buttonText={t('viewAll')}
          buttonLink={`/${locale}/subcategory`}
        />
        
        <DiscoverSection />
        <div className="h-10" />
        
        <DealOfTheDaySection />
        <div className="h-10" />
        
        {/* 🟢 Section 3: Grid Example */}
        <ProductSection
          title={t('gridExampleTitle')}    // "Grid Section Example"
          subtitle={t('gridExampleSubtitle')} // "Another Grid"
          products={products}
          isLoading={false}
          error={null}
          layout="grid" 
          filterType="none" 
          buttonText={t('viewAll')}
          buttonLink={`/${locale}/subcategory`}
        />
        
        <div className="h-10" />

        <TestimonialSection />
      </main>

      <ScrollToTopButton />
    </div>
  );
}