'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutGrid, Rows3, List, ChevronRight } from 'lucide-react';
import useProductByCategory from '../../../../hooks/useProductByCategory.js';
import ProductCard from '../../components/ui/ProductCard';
import Link from 'next/link';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

const Breadcrumbs = ({ categoryName, locale, t }) => (
    <nav className="flex items-center text-sm text-white drop-shadow">
        <Link href={`/${locale}`} className="opacity-80 hover:opacity-100">{t('home')}</Link>
        <ChevronRight size={16} className="mx-1" />
        <span className="font-medium">{categoryName}</span>
    </nav>
);

export default function ProductListPage() {
    const [view, setView] = useState(3);
    const params = useParams();
    const CategoryId = params?.id;
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('ProductPage');

    const { products, isLoading, error } = useProductByCategory({ CategoryId });
    
    const categoryInfo = useMemo(() => {
        if (!products || products.length === 0) return null;
        const firstProduct = products[0];
        return {
            name: locale === 'ar' ? firstProduct.category?.name_ar : firstProduct.category?.name,
            image: firstProduct.category?.image || '/default-banner.png'
        };
    }, [products, locale]);

    // ✨ --- START: Correction --- ✨
    // The useMemo hook is moved here to the top level, before any conditional returns.
    // This ensures Hooks are called in the same order on every render.
    const gridClasses = useMemo(() => {
        switch(view) {
            case 2: return 'grid-cols-1 sm:grid-cols-2';
            case 3: return 'grid-cols-2 lg:grid-cols-3';
            case 'list': return 'grid-cols-1';
            default: return 'grid-cols-2 lg:grid-cols-3';
        }
    }, [view]);
    // ✨ --- END: Correction --- ✨

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen text-gray-500">{t('loading')}</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="text-gray-800 bg-white">
          <Header />
    

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b pb-4 gap-4">
                    <p className="text-gray-600 font-medium text-sm sm:text-base">
                        {t('showing')} {products.length} {t('products')}
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

                {products.length > 0 ? (
                    <div className={`grid gap-6 ${gridClasses}`}>
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500">{t('noProductsFound')}</p>
                    </div>
                )}
            </div>
                  <Footer />
            
        </div>
    );
}