'use client';
import React from 'react';
import { useOnScreen } from '../../../../hooks/useOnScreen';
import useCategoryQuery from '../../../../hooks/useCategoriesQuery';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

// مكون الهيكل العظمي (Skeleton) بتصميم محدث
const CategorySkeleton = () => (
    <div className="animate-pulse">
        <div className="aspect-square w-full bg-gray-200 rounded-xl"></div>
        <div className="h-4 bg-gray-200 rounded-md mt-3 w-3/4 mx-auto"></div>
    </div>
);

export default function CategoriesSection() {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    const { categories, isLoadingCategories, errorCategories } = useCategoryQuery();

    const t = useTranslations('categories');
    const locale = useLocale();

    return (
        <section
            ref={ref}
            className={`py-20 bg-gray-50 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
            <div className="container mx-auto px-4 text-center">
                <p className="text-orange-500 font-semibold mb-2 uppercase tracking-wider">{t('shopByCategories')}</p>
                <h2 className="text-4xl font-bold text-gray-800 mb-12">{t('seasonCollection')}</h2>

                {isLoadingCategories && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                        {Array.from({ length: 6 }).map((_, index) => <CategorySkeleton key={index} />)}
                    </div>
                )}
                {errorCategories && (
                    <p className="text-red-500 text-sm mt-4">{errorCategories}</p>
                )}
                
                {!isLoadingCategories && categories?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id || cat.name}
                                href={`/${locale}/category/${cat.slug || cat.id}`}
                                aria-label={locale === 'ar' ? cat.name_ar || cat.name : cat.name}
                                // ✨ تم التعديل هنا: البوردر أصبح ظاهرًا دائمًا بلون برتقالي فاتح
                                className="group relative block aspect-square w-full rounded-xl overflow-hidden shadow-sm transition-all duration-300 border-2 border-orange-100 hover:border-orange-500 hover:shadow-xl"
                            >
                                <img
                                    src={cat.image}
                                    alt={locale === 'ar' ? cat.name_ar || cat.name : cat.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-lg font-semibold text-white text-center drop-shadow-md">
                                        {locale === 'ar' ? cat.name_ar || cat.name : cat.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!isLoadingCategories && categories.length === 0 && !errorCategories && (
                    <p className="text-gray-500">{t('noCategoriesFound')}</p>
                )}
            </div>
        </section>
    );
}