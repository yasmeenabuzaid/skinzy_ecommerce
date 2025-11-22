'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutGrid, Rows3, List, ChevronRight } from 'lucide-react';
import ProductCard from './ui/ProductCard'; 
// تأكد من أن ملف ProductCard موجود في المسار components/ui/ProductCard
import Link from 'next/link';

export default function ProductListClient({ initialProducts, paginationInfo, categoryId }) {
    const [view, setView] = useState(3);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const locale = useLocale();
    const t = useTranslations('ProductPage');

    const products = initialProducts || [];

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage);
        router.push(`${pathname}?${params.toString()}`);
    };

    const gridClasses = useMemo(() => {
        switch(view) {
            case 2: return 'grid-cols-1 sm:grid-cols-2';
            case 3: return 'grid-cols-2 lg:grid-cols-3';
            case 'list': return 'grid-cols-1';
            default: return 'grid-cols-2 lg:grid-cols-3';
        }
    }, [view]);

    return (
        <div className="text-gray-800 bg-white">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b pb-4 gap-4">
                    <p className="text-gray-600 font-medium text-sm sm:text-base">
                        {t('showing')} {paginationInfo?.total || 0} {t('products')}
                    </p>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                     
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

                {products.length === 0 ? (
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

                {paginationInfo && paginationInfo.lastPage > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-12">
                        <button
                            onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                            disabled={paginationInfo.currentPage <= 1}
                            className="bg-orange-500 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('pagination.previous')}
                        </button>
                        <span className="text-lg font-medium">
                            {t('pagination.page')} {paginationInfo.currentPage} {t('pagination.of')} {paginationInfo.lastPage}
                        </span>
                        <button
                            onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                            disabled={paginationInfo.currentPage >= paginationInfo.lastPage}
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