'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutGrid, Rows3, List, ChevronRight } from 'lucide-react';
import useProductsQuery from '../../../hooks/useProductsQuery';
import ProductCard from '../components/ui/ProductCard';
import Link from 'next/link';

import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
// ✨ قمت بحذف Header و Footer من هنا لأنه من الأفضل إضافتهم في ملف layout.js
// يمكنك إعادتهم إذا كان تصميمك يتطلب ذلك

// ✨ مكون بسيط لمسار التنقل (Breadcrumbs)
const Breadcrumbs = ({ t, locale }) => (
    <nav className="flex items-center text-sm text-gray-500">
        <Link href={`/${locale}`} className="hover:text-orange-500">{t('home')}</Link>
        <ChevronRight size={16} className="mx-1" />
        <span className="font-medium text-gray-700">{t('products')}</span>
    </nav>
);


export default function ProductListPage() {
    // ✨ تم تغيير الحالة الافتراضية إلى 4 أعمدة على الشاشات الكبيرة
    const [view, setView] = useState(4);
    const params = useParams();
    const searchParams = useSearchParams();
    const selectedBrandId = searchParams.get("brand");
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('ProductPage');

    const { products, isLoading, error } = useProductsQuery();

    // ✨ أصبح useMemo أفضل هنا لتحسين الأداء عند الفلترة
    const filteredProducts = useMemo(() => {
        if (!products) return [];
        return selectedBrandId
            ? products.filter(product => String(product.brand?.id) === selectedBrandId)
            : products;
    }, [products, selectedBrandId]);

    if (isLoading) {
        return <div className="text-center p-20 text-gray-500">{t('loading')}</div>;
    }

    if (error) {
        return <div className="text-center p-20 text-red-500">Error: {error.message}</div>;
    }

    // ✨ تحديد الكلاسات الخاصة بالشبكة بناءً على حالة العرض
    const gridClasses = {
        4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4', // 4 أعمدة
        3: 'grid-cols-2 md:grid-cols-3',             // 3 أعمدة
        'list': 'grid-cols-1',                       // عرض القائمة
    }[view] || 'grid-cols-2 md:grid-cols-3';


    return (
        <div className="text-gray-800 bg-white">
           <Header />
            <div className="container mx-auto px-4 py-8">
                
                {/* ✨ --- Section Header --- ✨ */}
                <div className="py-8 bg-gray-50 rounded-lg mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800">{t('ourProducts')}</h1>
                    <div className="mt-4 flex justify-center">
                        <Breadcrumbs t={t} locale={locale} />
                    </div>
                </div>

                {/* ✨ --- Control Bar --- ✨ */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 border-b pb-4 gap-4">
                    <p className="text-gray-600 font-medium">
                        {t('showing')} {filteredProducts.length} {t('products')}
                    </p>
                    <div className="flex items-center gap-4">
                        <select className="border border-gray-300 rounded-md p-2 text-sm focus:ring-orange-500 focus:border-orange-500">
                            <option>{t('sort.bestSelling')}</option>
                            <option>{t('sort.lowToHigh')}</option>
                            <option>{t('sort.highToLow')}</option>
                        </select>
                        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-md">
                            <button onClick={() => setView(4)} className={`p-2 rounded ${view === 4 ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`} aria-label="4 columns">
                                <LayoutGrid size={20} />
                            </button>
                            <button onClick={() => setView(3)} className={`p-2 rounded ${view === 3 ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`} aria-label="3 columns">
                                <Rows3 size={20} />
                            </button>
                            <button onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`} aria-label="List view">
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ✨ --- Products Grid --- ✨ */}
                <div className={`grid gap-6 ${gridClasses}`}>
                    {filteredProducts.map(product => (
                        // ✨ تم حذف الـ div الإضافي، لأن ProductCard هو الرابط نفسه
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

            </div>
                  <Footer />
        </div>
    );
}

