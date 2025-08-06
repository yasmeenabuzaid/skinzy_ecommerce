"use client";
import React from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react'; 
import { useCartContext } from "../../../../context/CartContext";
import BackendConnector from "@/services/connectors/BackendConnector";
import Swal from "sweetalert2";
import storageService from "@/services/storage/storageService";
import { useRouter } from 'next/navigation';
import { useLocale } from "next-intl";

export default function ProductCard({ product }) {
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0].image
      : '/placeholder.png';

  const { addCart } = useCartContext();
  const router = useRouter();
  const locale = useLocale();

  const addToFavorites = async () => {
    const userInfo = storageService.getUserInfo();

    if (!userInfo?.accessToken) {
      Swal.fire("Error", "You must login to add to favorites", "error");
      return;
    }

    try {
      const response = await BackendConnector.addToFavorites({
        product_id: product.id,
        user_id: userInfo.id,
      });
      if (response?.success) {
        Swal.fire("Success", "Product added to favorites", "success");
      } else {
        Swal.fire("Error", response?.message || "Failed to add", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while adding", "error");
    }
  };

  const productName = locale === 'ar' ? product.name_ar : product.name;
  const smallDescription =
    locale === 'ar' ? product.small_description_ar : product.small_description;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden group text-center bg-white transition-shadow hover:shadow-xl">
      <div className="relative bg-gray-100 p-5 h-64 flex items-center justify-center">
        <img src={productImage} alt={productName} className="max-w-full max-h-full object-contain" />
        {product.sale && (
          <span className="absolute top-4 left-4 bg-[#ef8172] text-white text-xs font-medium py-1 px-2.5 rounded">
            Sale
          </span>
        )}
        <div className="absolute top-5 right-5 flex flex-col gap-2.5 transition-all transform translate-x-0">
          <button
            onClick={() => addCart({ productId: product.id })}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#ef8172] hover:text-white transition-colors"
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>

          <button
            onClick={addToFavorites}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#ef8172] hover:text-white transition-colors"
            title="Add to Favorites"
          >
            <Heart size={18} />
          </button>

          <button
            onClick={() => router.push(`/product/${product.id}`)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#ef8172] hover:text-white transition-colors"
            title="View Product"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>
      <div className="p-5 text-center">
        <h3 className="text-base font-semibold text-gray-800 h-7 overflow-hidden">{productName}</h3>

        <p className="text-sm text-gray-600 mb-4 leading-relaxed h-16 overflow-hidden whitespace-pre-line">
          {smallDescription}
        </p>

        <p className={`text-lg font-semibold ${
          product.price && product.price_after_discount < product.price
            ? 'text-[#ef8172]'
            : 'text-gray-900'
        }`}>
          {product.price && product.price_after_discount < product.price && (
            <span className="text-gray-400 line-through font-normal text-sm mr-2">
              ${product.price.toFixed(2)}
            </span>
          )}
          ${product.price_after_discount
            ? product.price_after_discount.toFixed(2)
            : product.price?.toFixed(2) || '0.00'}
        </p>
      </div>
    </div>
  );
}
