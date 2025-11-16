'use client';

import React, { useState } from 'react'; // 🔽 *** تم إضافة useState *** 🔽
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LayoutGrid, Rows3, List } from 'lucide-react';
import useProductsByBrandQuery from '../../../../hooks/useProductsByBrandQuery';
import { useTranslations } from 'next-intl';
import ProductCard from '../../components/ui/ProductCard';

export default function BrandProductsPage() {
  const [view, setView] = useState(3);
  const [page, setPage] = useState(1); // 🔽 *** إضافة State للصفحة الحالية *** 🔽
  const params = useParams();
  const brandId = params?.id;
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('BrandProductsPage');

  // 🔽 *** تمرير "page" للـ Hook واستقبال "paginationInfo" *** 🔽
  const { products, paginationInfo, isLoading } = useProductsByBrandQuery({ 
    brandId, 
    page 
  });

  // 🔽 *** دوال للتحكم بالصفحات *** 🔽
  const handleNextPage = () => {
    if (paginationInfo.currentPage < paginationInfo.lastPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (paginationInfo.currentPage > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  // 🔽 *** إضافة حالة Loading بسيطة *** 🔽
  if (isLoading && products.length === 0) {
    return <div className="container mx-auto px-4 py-8 text-center">{t('loading')}</div>
  }

  return (
    <div className="text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 bg-[#f9f9f9] p-4 rounded-md">
          <h1 className="text-xl font-bold">{t('title')}</h1>
          <div className="flex items-center gap-3 mt-3 md:mt-0">
            {/* <select className="border rounded-md p-2 text-sm">
              <option>Best selling</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select> */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setView(2)}
                className={`p-2 rounded-md ${
                  view === 2 ? 'bg-black text-white' : 'bg-white border'
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setView(3)}
                className={`p-2 rounded-md ${
                  view === 3 ? 'bg-black text-white' : 'bg-white border'
                }`}
              >
                <Rows3 size={20} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-md ${
                  view === 'list' ? 'bg-black text-white' : 'bg-white border'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center text-gray-500 p-10">{t('noProducts')}</div>
        ) : (
          <div
            className={`grid gap-6 ${
              view === 2 ? 'grid-cols-2' : view === 3 ? 'grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`/${locale}/products/${product.id}`)}
                className="cursor-pointer"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* 🔽 *** إضافة قسم الـ Pagination *** 🔽 */}
        {products.length > 0 && paginationInfo.lastPage > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrevPage}
              disabled={paginationInfo.currentPage <= 1 || isLoading}
              className="bg-gray-800 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('previous')}
            </button>
            <span className="text-lg">
              {t('page')} {paginationInfo.currentPage} {t('of')} {paginationInfo.lastPage}
            </span>
            <button
              onClick={handleNextPage}
              disabled={paginationInfo.currentPage >= paginationInfo.lastPage || isLoading}
              className="bg-gray-800 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('next')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}