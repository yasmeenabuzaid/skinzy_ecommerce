import React, { useState, useEffect, useRef } from 'react';
import useProductsQuery from '../../../../hooks/useProductsQuery'; 
import Link from "next/link";
import { useLocale, useTranslations } from 'next-intl';

const X = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SearchIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SearchResultCard = ({ product }) => {
  const locale = useLocale();
  const imageUrl =
    product.images?.length > 0 && product.images[0].image
      ? product.images[0].image
      : '/fallback.jpg';

  const productName = locale === 'ar' && product.name_ar ? product.name_ar : product.name;
  const productCode = product.code || '';

  return (
    <Link
      href={`/${locale}/products/${product.id}`}
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <img
        src={imageUrl}
        alt={productName}
        className="w-16 h-16 object-cover rounded-md border border-gray-200"
      />
      <div className="flex-grow">
        <p className="font-semibold text-sm text-gray-800 flex items-center gap-2">
          <span>{productName}</span>
          {productCode && (
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {productCode}
            </span>
          )}
        </p>
        <p className="text-sm text-[#FF671F]">${product.price?.toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const { products, isLoading, error } = useProductsQuery();
  
  const t = useTranslations('searchModal');
  const locale = useLocale();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const containsArabic = (text) => /[\u0600-\u06FF]/.test(text);

  const filteredProducts = query
    ? products.filter(p => {
        const nameToCheck = locale === 'ar' && p.name_ar ? p.name_ar.toLowerCase() : p.name.toLowerCase();
        const codeToCheck = p.code?.toLowerCase() || '';
        const q = query.toLowerCase();
        return nameToCheck.includes(q) || codeToCheck.includes(q);
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center" aria-modal="true" role="dialog">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-white rounded-b-lg shadow-xl mt-16 md:mt-24 flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={t('placeholder')}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF671F] transition-colors mt-7 text-black"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 mt-3.5">
              <SearchIcon size={20} />
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh] p-5">
          {isLoading && (
            <p className="text-center text-gray-500 py-8">{t('loading')}</p>
          )}

          {error && (
            <p className="text-center text-red-500 py-8">{t('error')} {error}</p>
          )}

          {!isLoading && !error && query && filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 py-8">{t('noResults')}</p>
          )}

          {!isLoading && !error && filteredProducts.length > 0 && (
            <div className="space-y-2">
              {filteredProducts.map(product => (
                <SearchResultCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!query && !isLoading && !error && (
            <p className="text-center text-gray-400 py-8">{t('startTyping')}</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={t('close')}
        >
          <X size={28} />
        </button>
      </div>
    </div>
  );
}
