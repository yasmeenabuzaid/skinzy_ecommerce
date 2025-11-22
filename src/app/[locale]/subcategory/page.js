import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductListClient from '../components/ProductListClient';
import conn from '../../../services/connectors/BackendConnector';

export const metadata = {
    title: 'Products',
};

export default async function ProductsPage({ params, searchParams }) {
    const locale = params.locale;
    const t = await getTranslations({ locale, namespace: 'ProductPage' });
    
    // 1. استخراج المتغيرات (الصفحة والفلتر إن وجد)
    const page = searchParams?.page || 1;
    const brandId = searchParams?.brand; // دعم فلترة البراند من الرابط

    // 2. تجهيز خيارات البحث
    const fetchParams = {
        page: page,
    };
    // إذا كان هناك فلتر للبراند، نضيفه للطلب
    if (brandId) {
        fetchParams.brand_id = brandId;
    }

    // 3. جلب البيانات من السيرفر
    // نستخدم fetchProducts العامة ونمرر لها الباراميترز
    const response = await conn.fetchProducts(fetchParams);

    // 4. معالجة البيانات
    let paginator = {};
    if (response && response.current_page) {
        paginator = response;
    } else if (response && response.data) {
        paginator = response.data;
    }

    const products = paginator.data || [];
    
    const paginationInfo = {
        currentPage: paginator.current_page || parseInt(page),
        lastPage: paginator.last_page || 1,
        total: paginator.total || 0
    };

    return (
        <div className="text-gray-800 bg-white">
            <div className="container mx-auto px-4 pt-8">
                
                {/* ✨ --- Section Header (Server Side) --- ✨ */}
                <div className="py-8 bg-gray-50 rounded-lg mb-2 text-center">
                    <h1 className="text-4xl font-bold text-gray-800">{t('ourProducts')}</h1>
                    <div className="mt-4 flex justify-center">
                        <nav className="flex items-center text-sm text-gray-500">
                            <Link href={`/${locale}`} className="hover:text-orange-500 transition-colors">
                                {t('home')}
                            </Link>
                            <ChevronRight size={16} className="mx-1" />
                            <span className="font-medium text-gray-700">{t('products')}</span>
                        </nav>
                    </div>
                </div>

                {/* ✨ --- Product List (Client Side) --- ✨ */}
                {/* نمرر null للـ categoryId لأننا في صفحة عامة */}
                <ProductListClient 
                    initialProducts={products} 
                    paginationInfo={paginationInfo}
                    categoryId={null} 
                />
            </div>
        </div>
    );
}