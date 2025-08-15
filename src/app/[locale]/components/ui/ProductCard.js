"use client";
import React from 'react';
import { ShoppingCart, Heart, Eye, X } from 'lucide-react'; 
import { useCartContext } from "../../../../context/CartContext";
import BackendConnector from "@/services/connectors/BackendConnector";
import Swal from "sweetalert2";
import storageService from "@/services/storage/storageService";
import { useRouter } from 'next/navigation';
import { useLocale } from "next-intl";

export default function ProductCard({ product, onRemoveFavorite }) {
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0].image
      : '/placeholder.png';

  const { addCart } = useCartContext();
  const router = useRouter();
  const locale = useLocale();

  const handleActionClick = (e, action) => {
    e.stopPropagation(); 
    action();
  };

  const addToFavorites = async () => {
    // ... no changes to this function logic ...
  };

  const productName = locale === 'ar' ? product.name_ar : product.name;
  const smallDescription =
    locale === 'ar' ? product.small_description_ar : product.small_description;

  return (
    <div className="relative border border-gray-200 rounded-lg overflow-hidden group text-center bg-white transition-shadow duration-300 hover:shadow-xl">
      
      {onRemoveFavorite && (
        <button
          onClick={(e) => handleActionClick(e, () => onRemoveFavorite(product.id))}
          className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/80 text-red-600 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 hover:text-white transition-all duration-200 cursor-pointer"
          title="Remove from Favorites"
        >
          <X size={18} />
        </button>
      )}

      <div onClick={() => router.push(`/${locale}/products/${product.id}`)} className="cursor-pointer">
        <div className="relative bg-gray-100 p-5 h-64 flex items-center justify-center">
          <img src={productImage} alt={productName} className="max-w-full max-h-full object-contain" />
          {product.code && (
            <span className="absolute top-4 left-4 bg-[#FF671F] text-white text-xs font-medium py-1 px-2.5 rounded">
              {product.code}
            </span>
          )}

          <div className="absolute top-1/2 -translate-y-1/2 right-4 flex flex-col gap-2.5">
            {/* ===== START: تمت إضافة cursor-pointer هنا ===== */}
            <button
              onClick={(e) => handleActionClick(e, () => addCart({ productId: product.id }))}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#FF671F] hover:text-white transition-colors cursor-pointer"
              title="Add to Cart"
            >
              <ShoppingCart size={18} />
            </button>

            <button
              onClick={(e) => handleActionClick(e, addToFavorites)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#FF671F] hover:text-white transition-colors cursor-pointer"
              title="Add to Favorites"
            >
              <Heart size={18} />
            </button>

            <button
              onClick={(e) => handleActionClick(e, () => router.push(`/${locale}/products/${product.id}`))}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#FF671F] hover:text-white transition-colors cursor-pointer"
              title="View Product"
            >
              <Eye size={18} />
            </button>
            {/* ===== END: التعديل ===== */}
          </div>

        </div>
        <div className="p-5 text-center">
          <h3 className="text-base font-semibold text-gray-800 h-7 overflow-hidden">{productName}</h3>

          <p className="text-sm text-gray-600 mb-4 leading-relaxed h-16 overflow-hidden whitespace-pre-line">
            {smallDescription}
          </p>

          <div className="text-center mt-2">
            {product.price && product.price_after_discount < product.price ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-400 line-through text-sm">
                  {product.price.toFixed(2)} JOD
                </span>
                <span className="text-[#FF671F] font-semibold text-lg">
                  {product.price_after_discount.toFixed(2)} JOD
                </span>
              </div>
            ) : (
              <span className="text-gray-900 font-semibold text-lg">
                {product.price_after_discount
                  ? `${product.price_after_discount.toFixed(2)} JOD`
                  : `${product.price?.toFixed(2) || '0.00'} JOD`}
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}