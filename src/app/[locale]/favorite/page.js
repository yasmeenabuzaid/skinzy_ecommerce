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

export default function FavoriteProductsPage() {
  const [view, setView] = useState(3);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('FavoriteProducts'); 

  const user = storageService.getUserInfo();
  const { favorites, isLoading, error } = useFavoritesQuery();

  const favoriteProducts = Array.isArray(favorites)
    ? favorites.map((fav) => fav.product).filter(Boolean)
    : [];

  const renderContent = () => {
    if (!user) {
      return (
        <div className="text-center text-lg text-gray-600 py-20 w-full">
          {t('loginRequired')}
          <br />
          <button
            onClick={() => router.push(`/${locale}/login`)}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {t('login')}
          </button>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-10 text-black w-full">
          {error}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="text-center p-10 text-gray-500 w-full">
          {t('loadingFavorites')}
        </div>
      );
    }

    if (favoriteProducts.length === 0) {
      return (
        <div className="text-center text-lg text-gray-600 py-20 w-full">
          {t('noFavorites')}
          <br />
       <button
  onClick={() => router.push(`/${locale}/subcategory`)}
  className="mt-6 px-6 py-3 bg-black text-white shadow-md hover:bg-black-700 transition duration-300 ease-in-out"
>
  {t('browseProducts')}
</button>

        </div>
      );
    }

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
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {t('favoriteProductsTitle')}
          </h1>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* <select className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>{t('sortByPopular')}</option>
              <option>{t('sortByPriceAsc')}</option>
              <option>{t('sortByPriceDesc')}</option>
            </select> */}
            <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-md p-0.5">
              <button
                onClick={() => setView(2)}
                className={`p-2 rounded-md ${view === 2 ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                aria-label={t('gridView2Cols')}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setView(3)}
                className={`p-2 rounded-md ${view === 3 ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                aria-label={t('gridView3Cols')}
              >
                <Rows3 size={20} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-md ${view === 'list' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                aria-label={t('listView')}
              >
                <List size={20} />
              </button>
            </div>
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
