'use client';
import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import ProductCard from '../ui/ProductCard.js'; // تأكد من المسار

// ====================================================================
// A. Helper Components (مكونات مساعدة)
// ====================================================================

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

const LoadingState = ({ t, title, subtitle }) => (
    <section className="py-20 bg-gray-50">
        {/* ... (كود الـ Skeleton) ... */}
    </section>
);
// ... (يمكنك إضافة ErrorState هنا أيضاً)


// ====================================================================
// B. Main Component (المكون الموحد)
// ====================================================================

export default function ProductSection({
    title,
    subtitle,
    buttonText,
    buttonLink,
    products, 
    isLoading, 
    error,
    // ⭐️ خاصية تحديد العرض: 'slider' (افتراضي) أو 'grid'
    layout = 'slider', 
    // خاصية لفلترة البيانات الممررة (مثلاً 'bestsellers' أو 'discounted')
    filterType = 'none', 
}) {
    const sliderRef = useRef(null);
    const [canScroll, setCanScroll] = useState({ prev: false, next: true });
    const locale = useLocale();
    const t = useTranslations('productSlider');

    // ⭐️ منطق فلترة وترتيب البيانات الممررة
    const displayedProducts = useMemo(() => {
        if (!products) return [];

        let filtered = [...products];

        if (filterType === 'bestsellers') {
            filtered.sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0));
        } else if (filterType === 'discounted') {
             filtered = filtered.filter(p => p.price_after_discount && parseFloat(p.price_after_discount) < parseFloat(p.price));
        }
        
        // تقييد العدد المعروض
        return filtered.slice(0, 15); 
    }, [products, filterType]);


    // منطق السلايدر (يعمل فقط إذا كان layout = 'slider')
    const checkScrollability = useCallback(() => {
        const el = sliderRef.current;
        if (el) {
            const isAtStart = el.scrollLeft <= 0;
            const isAtEnd = el.scrollWidth - el.scrollLeft - el.clientWidth <= 1;
            setCanScroll({ prev: !isAtStart, next: !isAtEnd });
        }
    }, []);

    useEffect(() => {
        const el = sliderRef.current;
        if (layout === 'slider' && el && displayedProducts.length > 0) {
            const handleScroll = () => checkScrollability();
            const handleResize = () => checkScrollability();
            el.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('resize', handleResize);
            checkScrollability();
            return () => {
                el.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [displayedProducts, checkScrollability, layout]);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.clientWidth;
            sliderRef.current.scrollBy({
                left: direction === 'next' ? scrollAmount : -scrollAmount,
                behavior: 'smooth',
            });
        }
    };


    if (isLoading) return <LoadingState t={t} title={title} subtitle={subtitle} />;
    if (error) return <ErrorState t={t} error={error} />;
    if (displayedProducts.length === 0) return null;


    // ⭐️ تحديد محتوى العرض النهائي
    const renderContent = () => {
        if (layout === 'grid') {
            // عرض الشبكة
            return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {displayedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            );
        }

        // عرض السلايدر (Layout === 'slider')
        return (
            <div className="relative px-0 md:px-8">
                <SliderButton direction="prev" onClick={() => scroll('prev')} aria-label="Previous products" disabled={!canScroll.prev} />
                <div
                    ref={sliderRef}
                    className="grid grid-flow-col auto-cols-[calc(50%-0.5rem)] sm:auto-cols-[calc(33.33%-0.66rem)] lg:auto-cols-[calc(25%-0.75rem)] gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 no-scrollbar"
                >
                    {displayedProducts.map((product) => (
                        <div key={product.id} className="snap-start">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
                <SliderButton direction="next" onClick={() => scroll('next')} aria-label="Next products" disabled={!canScroll.next} />
            </div>
        );
    };


    return (
        <section className={`py-16 md:py-20 ${layout === 'grid' ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4">
                {/* --- Section Header --- */}
                <div className="text-center mb-12">
                    <p className="text-[#FF671F] font-semibold mb-1.5">{subtitle || t('defaultSubtitle')}</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
                </div>

                {renderContent()}

                {/* --- "Browse All" Button --- */}
                {buttonText && buttonLink && (
                    <div className="text-center mt-12">
                        <Link href={buttonLink}>
                            <span className="inline-block bg-white text-gray-800 font-semibold py-3 px-8 rounded-full border border-gray-300 hover:bg-[#FF671F] hover:text-white hover:border-[#FF671F] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1">
                                {buttonText || t('browseProducts')}
                            </span>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}