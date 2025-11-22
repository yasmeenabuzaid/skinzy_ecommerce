'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutGrid, Rows3, List, LogIn, HeartCrack } from 'lucide-react';
import useFavoritesQuery from '../../../hooks/useFavoritesQuery';
import ProductCard from '../components/ui/ProductCard';
import storageService from '@/services/storage/storageService';
import BackendConnector from '@/services/connectors/BackendConnector';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function FavoriteProductsPage() {
  const [view, setView] = useState(3);
  const [user, setUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // 🟢 1. إضافة State محلي للتحكم في القائمة (الحذف الفوري)
  const [localFavorites, setLocalFavorites] = useState([]);

  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('FavoriteProducts');

  useEffect(() => {
    const userData = storageService.getUserInfo();
    setUser(userData);
    setIsAuthChecking(false);
  }, []);

  // 🟢 2. إزالة setFavorites من هنا لأن الـ Hook لا يرجعها
  const { favorites, isLoading: isQueryLoading, error, refetch } = useFavoritesQuery({
    enabled: !isAuthChecking && !!user?.accessToken
  });

  // 🟢 3. مزامنة البيانات القادمة من السيرفر مع الـ State المحلي
// 🟢 3. مزامنة البيانات القادمة من السيرفر مع الـ State المحلي
  // التعديل: نضع شرطاً للتأكد أن البيانات تغيرت فعلاً قبل التحديث لتجنب الـ Loop
  useEffect(() => {
    if (favorites && Array.isArray(favorites)) {
       setLocalFavorites((prev) => {
          // فحص بسيط: إذا كان الطول مختلفاً أو المحتوى مختلفاً (كنص) نقوم بالتحديث
          // غير ذلك، نحتفظ بالحالة القديمة لنمنع إعادة الرسم (Re-render)
          if (prev.length !== favorites.length || JSON.stringify(prev) !== JSON.stringify(favorites)) {
             return favorites;
          }
          return prev;
       });
    }
  }, [favorites]);

  // استخراج المنتجات من القائمة المحلية
  const favoriteProducts = localFavorites.map((fav) => fav.product).filter(Boolean);

  const handleRemoveFavorite = async (productId) => {
    // حفظ النسخة القديمة في حال حدث خطأ
    const previousFavorites = [...localFavorites];

    // 🟢 4. التحديث الفوري باستخدام State المحلي
    // نحذف العنصر من الشاشة فوراً قبل انتظار السيرفر
    setLocalFavorites((prev) => 
      prev.filter((fav) => fav.product_id !== productId)
    );

    try {
      const response = await BackendConnector.removeFromFavorites(productId);

      if (!response.success) {
        // في حال الفشل، نرجع القائمة القديمة
        setLocalFavorites(previousFavorites);
        toast.error(t('removeError') || "Failed to remove favorite");
      } else {
        toast.success(t('removeSuccess') || "Removed from favorites");
        // اختياري: إعادة جلب البيانات من السيرفر للتأكد
        if (refetch) refetch();
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      // في حال الخطأ، نرجع القائمة القديمة
      setLocalFavorites(previousFavorites);
      toast.error(t('networkError') || "Network error occurred");
    }
  };

  const renderContent = () => {
    // ===== الحالة الصفرية: جاري فحص التخزين المحلي =====
    if (isAuthChecking) {
         return (
        <div className="text-center py-20">
          <div className="animate-pulse flex flex-col items-center">
             <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      );
    }

    // ===== الحالة الأولى: المستخدم غير مسجل =====
    if (!user || !user.accessToken) {
      return (
        <div className="text-center py-20 px-6">
          <LogIn size={60} className="mx-auto text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {t('loginRequiredTitle', 'Login Required')}
          </h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            {t('loginRequiredMessage', 'Please log in to view your favorite products.')}
          </p>
          <Link href={`/${locale}/auth/login`}>
            <button className="mt-6 bg-[#FF671F] text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              {t('loginButton', 'Log In')}
            </button>
          </Link>
        </div>
      );
    }

    // ===== الحالة الثانية: المستخدم مسجل، وجاري تحميل البيانات من السيرفر =====
    // نظهر اللودينج فقط إذا لم يكن لدينا بيانات محلية (عشان ما يختفي المحتوى فجأة عند عمل refetch)
    if (isQueryLoading && localFavorites.length === 0) {
      return (
        <div className="text-center py-20">
          <p>{t('loading', 'Loading...')}</p>
        </div>
      );
    }

    // ===== الحالة الثالثة: حدث خطأ =====
    if (error) {
      return (
        <div className="text-center py-20 text-red-600">
          <h2 className="text-xl font-semibold">{t('errorTitle', 'An Error Occurred')}</h2>
          <p>{error.message || t('networkError', 'Failed to fetch favorites.')}</p>
           {error?.response?.status === 401 && (
             <Link href={`/${locale}/auth/login`}>
               <button className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                 {t('loginButton', 'Log In Again')}
               </button>
             </Link>
           )}
        </div>
      );
    }

    // ===== الحالة الرابعة: لا يوجد مفضلة =====
    if (favoriteProducts.length === 0) {
      return (
        <div className="text-center py-20 px-6">
           <HeartCrack size={60} className="mx-auto text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {t('noFavoritesTitle', 'No Favorites Yet')}
          </h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            {t('noFavoritesMessage', 'Add products you love to your favorites to see them here.')}
          </p>
          <Link href={`/${locale}/`}>
            <button className="mt-6 bg-black text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              {t('continueShopping', 'Continue Shopping')}
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