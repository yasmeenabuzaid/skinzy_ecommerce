'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl'; 
// Import Data
import { trendingProducts, highlightedProducts } from '../../lib/data';

// Import Components
import Header from './components/ui/Header'; 
import Footer from './components/ui/Footer'; 
import ScrollToTopButton from './components/ui/ScrollToTopButton'; 
import CartDrawer from './components/cart/CartDrawer'; 
import HeroSection from './components/sections/HeroSection'; 
import BrandsSection from './components/sections/BrandsSection'; 
import CategoriesSection from './components/sections/CategoriesSection'; 
import PromoSection from './components/sections/PromoSection'; 
import ProductSliderSection from './components/sections/ProductSliderSection'; 
import BestSellers from './components/sections/bestSellers'; 
import AllProductSliderSection from './components/sections/allProductSliderSection'; 
import DealOfTheDaySection from './components/sections/DealOfTheDaySection'; 
import DiscoverSection from './components/sections/DiscoverSection'; 
import TestimonialSection from './components/sections/TestimonialSection'; 
import { useLocale } from 'next-intl';

export default function HomePage() {
    const t = useTranslations(); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
  const locale = useLocale();

    const handleMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const handleCartToggle = () => setIsCartOpen(!isCartOpen);

    useEffect(() => {
        if (isMobileMenuOpen || isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMobileMenuOpen, isCartOpen]);

    return (
        <div className='text-black' >
            <Header 
              onCartToggle={handleCartToggle} 
              onMenuToggle={handleMenuToggle} 
            />
            
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

           <main>
  <HeroSection />
  <div className="h-10" /> 
  
  <BrandsSection />
  <div className="h-10" />

  <CategoriesSection />
  <div className="h-10" />


    <AllProductSliderSection
      title="Products"
      subtitle="Our Products"
      products={trendingProducts}
      filters={['Our Collection', 'Tinted Oils', 'Creams']}
      buttonText="View all"
  buttonLink={`/${locale}/subcategory`}
    />
    <div className="h-10" />


  <PromoSection />
  <div className="h-10" />

  <BestSellers
    title="Trending Products"
    subtitle="Discover Our Products"
    products={trendingProducts}
    filters={['Our Collection', 'Tinted Oils', 'Creams']}
    buttonText="View all"
buttonLink={`/${locale}/subcategory`}
  />
  <div className="h-10" />

  <DealOfTheDaySection />
  <div className="h-10" />

  <ProductSliderSection
    title="This Week's Highlights"
    subtitle="Shop By Discounts"
    products={highlightedProducts}
    buttonText="View all"
buttonLink={`/${locale}/subcategory`}
  />
  <div className="h-10" />

  <DiscoverSection />
  <div className="h-10" />

  <TestimonialSection />
</main>


            <Footer />
            <ScrollToTopButton />
        </div>
    );
}
