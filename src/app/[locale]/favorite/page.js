'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LayoutGrid, Rows3, List } from 'lucide-react';
import useFavoritesQuery from '../../../hooks/useFavoritesQuery';

import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import ProductCard from '../components/ui/ProductCard';
import storageService from '@/services/storage/storageService';

export default function FavoriteProductsPage() {
  const [view, setView] = useState(3);
  const router = useRouter();
  const locale = useLocale();

  const user = storageService.getUserInfo();
  // ملاحظة: سيتم استدعاء useFavoritesQuery دائماً. سيقوم الهوك داخلياً بالتحقق من وجود المستخدم.
  const { favorites, isLoading, error } = useFavoritesQuery();

  const favoriteProducts = Array.isArray(favorites)
    ? favorites.map((fav) => fav.product).filter(Boolean)
    : [];

  const renderContent = () => {
    // إذا لم يكن المستخدم مسجلاً، اعرض رسالة تسجيل الدخول
    if (!user) {
      return (
        <div className="text-center text-lg text-gray-600 py-20 w-full">
          يجب عليك تسجيل الدخول لعرض المنتجات المفضلة.
          <br />
          <button
            onClick={() => router.push(`/${locale}/login`)}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            تسجيل الدخول
          </button>
        </div>
      );
    }

    // إذا كان هناك خطأ في التحميل، اعرض رسالة الخطأ
    if (error) {
        return (
            <div className="text-center p-10 text-black w-full">
              {error}
            </div>
        );
    }

    // إذا كان التحميل جارياً، اعرض رسالة التحميل
    if (isLoading) {
        return (
            <div className="text-center p-10 text-gray-500 w-full">
                جاري تحميل المنتجات المفضلة...
            </div>
        );
    }
    
    // إذا كان المستخدم مسجلاً ولكن لا يوجد منتجات مفضلة
    if (favoriteProducts.length === 0) {
      return (
        <div className="text-center text-lg text-gray-600 py-20 w-full">
          لا توجد منتجات في قائمة المفضلة.
          <br />
          <button
            onClick={() => router.push(`/${locale}/products`)}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            تصفح المنتجات
          </button>
        </div>
      );
    }

    // إذا كان كل شيء على ما يرام، اعرض المنتجات
    return (
      <div
        className={`grid gap-6 ${
          view === 2
            ? 'grid-cols-2'
            : view === 3
            ? 'grid-cols-3'
            : 'grid-cols-1'
        }`}
      >
        {favoriteProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => router.push(`/${locale}/products/${product.id}`)}
            className="cursor-pointer"
          >
            <ProductCard product={product} isFavorite={true} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="text-gray-800 min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* شريط الأدوات - يظهر دائماً */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">المنتجات المفضلة</h1>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <select className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>ترتيب حسب: الأكثر شيوعاً</option>
              <option>السعر: من الأقل للأعلى</option>
              <option>السعر: من الأعلى للأقل</option>
            </select>
            <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-md p-0.5">
              <button
                onClick={() => setView(2)}
                className={`p-2 rounded-md ${view === 2 ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                aria-label="Grid view 2 columns"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setView(3)}
                className={`p-2 rounded-md ${view === 3 ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                aria-label="Grid view 3 columns"
              >
                <Rows3 size={20} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-md ${view === 'list' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                aria-label="List view"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* منطقة عرض المحتوى المتغير */}
        <div className="mt-8">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}