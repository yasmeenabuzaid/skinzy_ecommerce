'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

// --- Custom Hooks & Components ---
import useProductsQuery from '../../../../hooks/useProductsQuery';
import ProductCard from '../ui/ProductCard.js';

// ====================================================================
// 1. Helper Components (No changes here)
// ====================================================================

const LoadingState = () => (
    <section className="py-20 md:py-28 bg-orange-50">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <div className="h-4 bg-orange-400 rounded-md w-1/4 mx-auto mb-3 animate-pulse"></div>
                <div className="h-10 bg-orange-400 rounded-md w-1/2 mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="bg-orange-400 rounded-lg h-56 w-full mb-4"></div>
                        <div className="h-4 bg-orange-400 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-orange-400 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ErrorState = ({ t, error }) => (
    <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4">
            <div className="text-center text-red-800 bg-red-100 border border-red-300 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{t('error')}</h3>
                <p>{error.message}</p>
            </div>
        </div>
    </section>
);

// ====================================================================
// 2. Main Component (تم تطبيق التعديلات هنا)
// ====================================================================

export default function FeaturedProductsSection({
    title,
    subtitle,
    buttonText,
    buttonLink,
}) {
    const locale = useLocale();
    const t = useTranslations('FeaturedProducts');

    const { products, isLoading, error } = useProductsQuery();

    const featuredProducts = useMemo(() => {
        if (!products) return [];
        return products
            .filter(p => p.price_after_discount && parseFloat(p.price_after_discount) > 0)
            .slice(0, 4);
    }, [products]);

    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState t={t} error={error} />;
    if (!featuredProducts || featuredProducts.length === 0) return null;

    return (
        <section className="py-20 md:py-28 bg-orange-50 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* ✨ تعديل الحاوية: إضافة gap ودعم الاتجاهين LTR/RTL */}
                <div className="mb-16 md:flex md:justify-between md:items-center md:gap-12">
                    {/* Left Side: Title & Subtitle */}
                    {/* ✨ تعديل محاذاة النص من text-left إلى text-start */}
                    <div className="text-center md:text-start md:flex-1 mb-8 md:mb-0">
                        <p className="text-orange-500 font-semibold mb-2 uppercase tracking-wider">
                            {subtitle || t('defaultSubtitle')}
                        </p>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                            {title}
                        </h2>
                    </div>

                    {/* Right Side: Brand Description */}
                    {/* ✨ تعديل محاذاة النص وتحديد عرض العمود ليبقى متناسقاً */}
                    <div className="text-center md:text-start md:w-full md:max-w-md">
                        <p className="text-gray-600 leading-relaxed">
                            {t('brandDescription')}
                        </p>
                    </div>
                </div>

                {/* --- Product Grid --- */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* --- "Browse All" Button --- */}
                {buttonText && buttonLink && (
                    <div className="text-center mt-16">
                        <Link href={buttonLink}>
                            <span className="inline-block bg-[#FF671F] text-white font-semibold py-3 px-10 rounded-full hover:bg-opacity-90 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                {buttonText || t('defaultButtonText')}
                            </span>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}