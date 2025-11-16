'use client';

import React, { useState } from 'react'; // "useState" موجود
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LayoutGrid, Rows3, List } from 'lucide-react';
import useProductBySubCategory from '../../../../hooks/useProductBySubCategory';
import ProductCard from '../../components/ui/ProductCard';

export default function ProductListPage() {
  const [view, setView] = useState(3);
  const [page, setPage] = useState(1); // 🔽 1. إضافة "page" state
  const params = useParams();
  const subCategoryId = params?.id;
  const router = useRouter();
  const locale = useLocale();

  // 🔽 2. تمرير "page" واستقبال "paginationInfo" و "isLoading"
  const { products, paginationInfo, isLoading, error } = useProductBySubCategory({ 
    subCategoryId, 
    page 
  });

  // 🔽 3. إضافة دوال التنقل
  const handleNextPage = () => {
    if (paginationInfo.currentPage < paginationInfo.lastPage) {
      setPage((prevPage) => prevPage + 1);
      window.scrollTo(0, 0); // اختياري: لرفع الشاشة لفوق
    }
  };

  const handlePrevPage = () => {
    if (paginationInfo.currentPage > 1) {
      setPage((prevPage) => prevPage - 1);
      window.scrollTo(0, 0); // اختياري: لرفع الشاشة لفوق
    }
  };


  if (error) {
    // تعديل بسيط لإظهار رسالة الخطأ
    return <div className="text-center p-10 text-red-500">Error: {error.message || 'Failed to fetch products'}</div>;
  }

  // 🔽 4. إضافة حالة تحميل أولية
  if (isLoading && products.length === 0) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  return (
    <div className="text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Main content */}
          <main className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 bg-[#f9f9f9] p-4 rounded-md">
              {/* 🔽 5. استخدام "total" من "paginationInfo" للعدد الكلي */}
              <p className="text-gray-600">{paginationInfo.total} products found</p>
              <div className="flex items-center gap-3 mt-3 md:mt-0">
                <div className="flex items-center gap-1">
                  <button onClick={() => setView(2)} className={`p-2 rounded-md ${view === 2 ? 'bg-black text-white' : 'bg-white border'}`}>
                    <LayoutGrid size={20} />
                  </button>
                  <button onClick={() => setView(3)} className={`p-2 rounded-md ${view === 3 ? 'bg-black text-white' : 'bg-white border'}`}>
                    <Rows3 size={20} />
                  </button>
                  <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-black text-white' : 'bg-white border'}`}>
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* 🔽 6. إضافة حالة "لا يوجد منتجات" */}
            {products.length === 0 && !isLoading ? (
               <div className="text-center text-gray-500 p-10">No products found.</div>
            ) : (
              <div
                className={`grid gap-6 ${
                  view === 2 ? 'grid-cols-2' :
                  view === 3 ? 'grid-cols-3' :
                  'grid-cols-1'
                }`}
              >
                {products.map(product => (
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
            
            {/* 🔽 7. إضافة أزرار الـ Pagination */}
            {products.length > 0 && paginationInfo.lastPage > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={handlePrevPage}
                  disabled={paginationInfo.currentPage <= 1 || isLoading}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-lg">
                  Page {paginationInfo.currentPage} of {paginationInfo.lastPage}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={paginationInfo.currentPage >= paginationInfo.lastPage || isLoading}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}