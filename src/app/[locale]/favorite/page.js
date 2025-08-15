'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutGrid, Rows3, List } from 'lucide-react';
import useFavoritesQuery from '../../../hooks/useFavoritesQuery';

import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import ProductCard from '../components/ui/ProductCard';
import storageService from '@/services/storage/storageService';

// ===== استيرادات جديدة =====
import BackendConnector from '@/services/connectors/BackendConnector';
import Swal from 'sweetalert2';

export default function FavoriteProductsPage() {
  const [view, setView] = useState(3);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('FavoriteProducts');

  const user = storageService.getUserInfo();
  
  // ===== تعديل: تأكد أن useFavoritesQuery يعيد setFavorites للتحديث الفوري =====
  const { favorites, setFavorites, isLoading, error } = useFavoritesQuery();

  const favoriteProducts = Array.isArray(favorites)
    ? favorites.map((fav) => fav.product).filter(Boolean)
    : [];

  // ===== START: دالة إزالة المنتج من المفضلة =====
  const handleRemoveFavorite = async (productId) => {
    // 1. Optimistic Update: تحديث الواجهة فوراً قبل انتظار السيرفر
    const originalFavorites = favorites;
    const updatedFavorites = originalFavorites.filter(
      (fav) => fav.product_id !== productId
    );
    setFavorites(updatedFavorites);

    // 2. API Call: إرسال الطلب للسيرفر في الخلفية
    try {
      // نفترض أن لديك دالة جاهزة في BackendConnector
const response = await BackendConnector.removeFromFavorites(productId);

      if (!response.success) {
        // 3. Rollback: إذا فشل الطلب، أعد الحالة الأصلية وأظهر رسالة خطأ
        Swal.fire({
          icon: 'error',
          title: t('errorTitle'),
          text: t('removeError'),
        });
        setFavorites(originalFavorites);
      }
    } catch (error) {
      // 4. Rollback في حالة وجود خطأ في الشبكة
      console.error("Failed to remove favorite:", error);
      Swal.fire({
        icon: 'error',
        title: t('errorTitle'),
        text: t('networkError'),
      });
      setFavorites(originalFavorites);
    }
  };
  // ===== END: دالة إزالة المنتج من المفضلة =====

  const renderContent = () => {
    if (!user) {
      // ... (no changes here)
    }

    if (isLoading) {
      // ... (no changes here)
    }

    if (error) {
      // ... (no changes here)
    }

    if (favoriteProducts.length === 0) {
      // ... (no changes here)
    }

    // ===== تعديل: تمرير دالة الحذف إلى ProductCard =====
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
            onRemoveFavorite={handleRemoveFavorite} // تمرير الدالة هنا
          />
        ))}
      </div>
    );
  };

  return (
    <div className="text-gray-800 min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {t('favoriteProductsTitle')}
          </h1>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* View switcher buttons... no changes here */}
          </div>
        </div>
        <div className="mt-8">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}