'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LayoutGrid, Rows3, List } from 'lucide-react';
import useProductBySubCategory from '../../../../hooks/useProductBySubCategory';

import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import ProductCard from '../../components/ui/ProductCard';
import FilterAccordion from '../../components/products/FilterAccordion';

export default function ProductListPage() {
  const [view, setView] = useState(3);
  const params = useParams();
  const subCategoryId = params?.id;
  const router = useRouter();
  const locale = useLocale();

  const { products, isLoading, error } = useProductBySubCategory({ subCategoryId });

  if (isLoading) {
    return <div className="text-center p-10 text-gray-500">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="text-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <aside className="lg:col-span-1 border-r pr-8">
            <h2 className="text-xl font-bold mb-2">Filter</h2>

            <FilterAccordion title="Availability">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="h-4 w-4" />
                <span className="ml-3">In Stock</span>
              </label>
            </FilterAccordion>

            <FilterAccordion title="Price">
              <div className="flex items-center gap-4">
                <input type="text" placeholder="From" className="w-1/2 border rounded-md p-2 text-sm" />
                <input type="text" placeholder="To" className="w-1/2 border rounded-md p-2 text-sm" />
              </div>
            </FilterAccordion>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 bg-[#f9f9f9] p-4 rounded-md">
              <p className="text-gray-600">{products.length} products</p>
              <div className="flex items-center gap-3 mt-3 md:mt-0">
                <select className="border rounded-md p-2 text-sm">
                  <option>Best selling</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
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

            <div className={`grid gap-6 ${
              view === 2 ? 'grid-cols-2' :
              view === 3 ? 'grid-cols-3' :
              'grid-cols-1'
            }`}>
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
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
