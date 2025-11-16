'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutGrid, Rows3, List, LogIn, HeartCrack } from 'lucide-react'; // ⭐️ 1. إضافة أيقونات جديدة
import useFavoritesQuery from '../../../hooks/useFavoritesQuery';

import ProductCard from '../components/ui/ProductCard';
import storageService from '@/services/storage/storageService';

import BackendConnector from '@/services/connectors/BackendConnector';
import Swal from 'sweetalert2';
import Link from 'next/link'; // ⭐️ 2. إضافة استيراد Link

export default function FavoriteProductsPage() {
  const [view, setView] = useState(3);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('FavoriteProducts');

  const user = storageService.getUserInfo();
  
  // ⭐️ 3. (إصلاح الخطأ 401)
  // نمرر خيار "enabled" للـ Hook
  // هذا يمنع الـ Hook من العمل (وإرسال طلب API) إذا كان المستخدم غير مسجل
  const { favorites, setFavorites, isLoading, error } = useFavoritesQuery({
    enabled: !!user?.accessToken // 👈 لن يعمل الـ Hook إلا إذا كان هناك Token
  });

  const favoriteProducts = Array.isArray(favorites)
    ? favorites.map((fav) => fav.product).filter(Boolean)
    : [];

  const handleRemoveFavorite = async (productId) => {
    const originalFavorites = favorites;
    const updatedFavorites = originalFavorites.filter(
      (fav) => fav.product_id !== productId
    );
    setFavorites(updatedFavorites);

    try {
      // ⭐️ ملاحظة: تأكد أن دالة الحذف ترسل الـ Token (هذا يتم داخل BackendConnector)
      const response = await BackendConnector.removeFromFavorites(productId);

      if (!response.success) {
        Swal.fire({
          icon: 'error',
          title: t('errorTitle'),
          text: t('removeError'),
        });
        setFavorites(originalFavorites);
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      Swal.fire({
        icon: 'error',
        title: t('errorTitle'),
        text: t('networkError'),
      });
      setFavorites(originalFavorites);
    }
  };

  // ⭐️ 4. (تنفيذ طلبك) تحديث دالة عرض المحتوى
  const renderContent = () => {
    
    // ===== الحالة الأولى: المستخدم غير مسجل =====
    // هذا هو التحقق الفوري (Client-side)
    if (!user || !user.accessToken) {
      return (
        <div className="text-center py-20 px-6">
          <LogIn size={60} className="mx-auto text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {t('loginRequiredTitle', 'Login Required')} {/* "يجب تسجيل الدخول" */}
          </h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            {t('loginRequiredMessage', 'Please log in to view your favorite products.')} {/* "الرجاء تسجيل الدخول لعرض منتجاتك المفضلة." */}
          </p>
          <Link href={`/${locale}/auth/login`}>
            <button className="mt-6 bg-[#FF671F] text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              {t('loginButton', 'Log In')} {/* "تسجيل الدخول" */}
            </button>
          </Link>
        </div>
      );
    }

    // ===== الحالة الثانية: المستخدم مسجل، وجاري التحميل =====
    if (isLoading) {
      return (
        <div className="text-center py-20">
          <p>{t('loading', 'Loading...')}</p> {/* "جاري التحميل..." */}
        </div>
      );
    }

    // ===== الحالة الثالثة: حدث خطأ (مثل 401 لانتهاء الصلاحية أو خطأ بالشبكة) =====
    if (error) {
      return (
        <div className="text-center py-20 text-red-600">
          <h2 className="text-xl font-semibold">{t('errorTitle', 'An Error Occurred')}</h2>
          <p>{error.message || t('networkError', 'Failed to fetch favorites.')}</p>
          {/* إذا كان الخطأ 401 (انتهت الجلسة)، يمكننا أيضاً عرض زر تسجيل الدخول */}
          {error.response?.status === 401 && (
             <Link href={`/${locale}/auth/login`}>
              <button className="mt-6 bg-red-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                {t('loginButton', 'Log In')}
              </button>
            </Link>
          )}
        </div>
      );
    }

    // ===== الحالة الرابعة: المستخدم مسجل، ولكن لا يوجد لديه مفضلة =====
    if (favoriteProducts.length === 0) {
      return (
        <div className="text-center py-20 px-6">
           <HeartCrack size={60} className="mx-auto text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {t('noFavoritesTitle', 'No Favorites Yet')} {/* "لا يوجد منتجات مفضلة بعد" */}
          </h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            {t('noFavoritesMessage', 'Add products you love to your favorites to see them here.')} {/* "أضف المنتجات التي تحبها إلى المفضلة لتراها هنا." */}
          </p>
          <Link href={`/${locale}/`}>
            <button className="mt-6 bg-black text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              {t('continueShopping', 'Continue Shopping')} {/* "متابعة التسوق" */}
            </button>
          </Link>
        </div>
      );
    }

    // ===== الحالة الخامسة: عرض المنتجات =====
    return (
      <div
        className={`grid gap-6 ${
          view === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : view === 3
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        }`}
      >
        {favoriteProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onRemoveFavorite={handleRemoveFavorite}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="text-gray-800 min-h-screen flex flex-col bg-white">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {t('favoriteProductsTitle', 'Favorite Products')}
          </h1>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* (أزرار التبديل - تبقى كما هي) */}
            <button
              onClick={() => setView(2)}
              className={`p-2 rounded-md ${view === 2 ? 'bg-[#FF671F] text-white' : 'bg-gray-200 text-gray-600'}`}
              aria-label="Grid View (2 columns)"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setView(3)}
              className={`p-2 rounded-md ${view === 3 ? 'bg-[#FF671F] text-white' : 'bg-gray-200 text-gray-600'}`}
              aria-label="Grid View (3 columns)"
            >
              <Rows3 size={20} />
            </button>
            <button
              onClick={() => setView(1)}
              className={`p-2 rounded-md ${view === 1 ? 'bg-[#FF671F] text-white' : 'bg-gray-200 text-gray-600'}`}
              aria-label="List View"
            >
              <List size={20} />
            </button>
          </div>
        </div>
        <div className="mt-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}