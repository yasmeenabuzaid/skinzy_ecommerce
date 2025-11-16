'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutGrid, Rows3, List, ChevronRight } from 'lucide-react';
import useProductByCategory from '../../../../hooks/useProductByCategory.js';
import ProductCard from '../../components/ui/ProductCard';
import Link from 'next/link';

// (هذا الكود ما تغير)
const Breadcrumbs = ({ categoryName, locale, t }) => (
    <nav className="flex items-center text-sm text-white drop-shadow">
        <Link href={`/${locale}`} className="opacity-80 hover:opacity-100">{t('home')}</Link>
        <ChevronRight size={16} className="mx-1" />
        <span className="font-medium">{categoryName}</span>
    </nav>
);

export default function ProductListPage() {
    const [view, setView] = useState(3);
    const [page, setPage] = useState(1); // 🔽 1. إضافة State للصفحة
    const params = useParams();
    const CategoryId = params?.id;
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('ProductPage');

    // 🔽 2. تمرير "page" واستقبال "paginationInfo" و "isLoading"
    const { products, paginationInfo, isLoading, error } = useProductByCategory({ CategoryId, page });
    
    // (هذا الكود ما تغير)
    const categoryInfo = useMemo(() => {
        if (!products || products.length === 0) return null;
        const firstProduct = products[0];
        return {
            name: locale === 'ar' ? firstProduct.category?.name_ar : firstProduct.category?.name,
            image: firstProduct.category?.image || '/default-banner.png'
        };
    }, [products, locale]);

    // (هذا الكود ما تغير)
    const gridClasses = useMemo(() => {
        switch(view) {
            case 2: return 'grid-cols-1 sm:grid-cols-2';
            case 3: return 'grid-cols-2 lg:grid-cols-3';
            case 'list': return 'grid-cols-1';
            default: return 'grid-cols-2 lg:grid-cols-3';
        }
    }, [view]);


    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-500">Error: {error.message}</div>;
    }

    // 🔽 3. إضافة حالة تحميل أولية
    if (isLoading && !products.length) {
        return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
    }

    return (
        <div className="text-gray-800 bg-white">
    
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b pb-4 gap-4">
                    <p className="text-gray-600 font-medium text-sm sm:text-base">
                        {/* 🔽 4. استخدام "total" بدل "products.length" */}
                        {t('showing')} {paginationInfo?.total || 0} {t('products')}
                    </p>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <select className="flex-grow sm:flex-grow-0 border border-gray-300 rounded-md p-2 text-sm focus:ring-orange-500 focus:border-orange-500 bg-white">
                            <option>{t('sort.bestSelling')}</option>
                            <option>{t('sort.lowToHigh')}</option>
                            <option>{t('sort.highToLow')}</option>
                        </select>
                        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-md">
                            <button onClick={() => setView(3)} className={`p-2 rounded transition-colors ${view === 3 ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`} aria-label="3 columns">
                                <Rows3 size={20} />
                            </button>
                            <button onClick={() => setView(2)} className={`p-2 rounded transition-colors ${view === 2 ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`} aria-label="2 columns">
                                <LayoutGrid size={20} />
                            </button>
                            <button onClick={() => setView('list')} className={`p-2 rounded transition-colors ${view === 'list' ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`} aria-label="List view">
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 🔽 5. تعديل بسيط على شرط العرض */}
                {!isLoading && products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500">no products found</p>
                    </div>
                ) : (
                    <div className={`grid gap-6 ${gridClasses}`}>
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* 🔽 6. إضافة أزرار الـ Pagination */}
                {paginationInfo && paginationInfo.lastPage > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-12">
                        <button
                            onClick={() => setPage(p => p - 1)}
                            disabled={paginationInfo.currentPage <= 1 || isLoading}
                            className="bg-orange-500 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('pagination.previous')}
                        </button>
                        <span className="text-lg font-medium">
                            {t('pagination.page')} {paginationInfo.currentPage} {t('pagination.of')} {paginationInfo.lastPage}
                        </span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={paginationInfo.currentPage >= paginationInfo.lastPage || isLoading}
                            className="bg-orange-500 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('pagination.next')}
                        </button>
                    </div>
                )}

            </div>
            
        </div>
    );
}