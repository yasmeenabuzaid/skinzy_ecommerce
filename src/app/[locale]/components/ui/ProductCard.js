"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, X } from 'lucide-react';
import { useCartContext } from "../../../../context/CartContext";
import { useRouter } from 'next/navigation';
import { useLocale } from "next-intl";
import Swal from "sweetalert2";
import storageService from "@/services/storage/storageService";
import BackendConnector from "@/services/connectors/BackendConnector";
import AuthModal from "../../components/auth/AuthModal";

export default function ProductCard({ product, onRemoveFavorite }) {
  const productImage = product.images?.[0]?.image || '/placeholder.png';
  const { addCart } = useCartContext();
  const router = useRouter();
  const locale = useLocale();

  const [userInfo, setUserInfo] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    setUserInfo(storageService.getUserInfo());
  }, []);

  const t = {
    ar: {
      addedToCart: "تمت الإضافة إلى السلة",
      continueBtn: "متابعة",
      favoriteAdded: "تمت الإضافة إلى المفضلة",
      favoriteFailed: "فشل في الإضافة",
      favoriteErrorOccured: "حدث خطأ",
      warningTitle: "تنبيه"
    },
    en: {
      addedToCart: "Added to Cart",
      continueBtn: "Continue",
      favoriteAdded: "Added to Favorites",
      favoriteFailed: "Failed to add",
      favoriteErrorOccured: "An error occurred",
      warningTitle: "Warning"
    }
  }[locale] || {};

  const _performAddToCart = () => {
    addCart({
      productId: product.id,
      quantity: 1,
      size: product.sizes?.[0] || "default",
    });
    Swal.fire({
      title: t.addedToCart,
      icon: "success",
      confirmButtonText: t.continueBtn,
      confirmButtonColor: '#FF671F',
      timer: 2000
    });
  };

  const _performAddToFavorites = async () => {
    const currentUserInfo = storageService.getUserInfo();
    if (!currentUserInfo?.id) return;
    try {
      const response = await BackendConnector.addToFavorites({
        product_id: product.id,
        user_id: currentUserInfo.id,
      });
      Swal.fire(
        t.warningTitle,
        response?.message || (response?.favorite ? t.favoriteAdded : t.favoriteFailed),
        response?.favorite ? "success" : "error"
      );
    } catch (error) {
      console.error("Add to favorites error:", error);
      Swal.fire(t.warningTitle, t.favoriteErrorOccured, "error");
    }
  };

  const handleAuthRequired = (action) => {
    setPendingAction(() => action);
    setIsAuthModalOpen(true);
  };

  const handleAddToCart = () => {
    if (!userInfo?.accessToken) {
      handleAuthRequired(_performAddToCart);
    } else {
      _performAddToCart();
    }
  };

  const handleAddToFavorites = () => {
    if (!userInfo?.accessToken) {
      handleAuthRequired(_performAddToFavorites);
    } else {
      _performAddToFavorites();
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setUserInfo(storageService.getUserInfo());
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation(); // يمنع فتح صفحة المنتج عند الضغط على الأزرار
    action();
  };

  const productName = locale === 'ar' ? product.name_ar : product.name;
  const smallDescription = locale === 'ar' ? product.small_description_ar : product.small_description;

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
        }}
        onAuthSuccess={handleAuthSuccess}
      />

      <div
        onClick={() => router.push(`/${locale}/products/${product.id}`)}
        className="relative border border-gray-200 rounded-lg overflow-hidden group text-center bg-white transition-shadow duration-300 hover:shadow-xl cursor-pointer"
      >
        {onRemoveFavorite && (
          <button
            onClick={(e) => handleActionClick(e, () => onRemoveFavorite(product.id))}
            className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/80 text-red-600 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 hover:text-white transition-all duration-200"
            title="Remove from Favorites"
          >
            <X size={18} />
          </button>
        )}

        <div className="relative bg-gray-100 w-full h-64 flex items-center justify-center">
          <img 
            src={productImage} 
            alt={productName} 
            className="w-full h-full object-cover" 
          />
          {product.code && (
            <span className="absolute top-4 left-4 bg-[#FF671F] text-white text-xs font-medium py-1 px-2.5 rounded">
              {product.code}
            </span>
          )}
          <div className="absolute top-1/2 -translate-y-1/2 right-4 flex flex-col gap-2.5">
            <button
              onClick={(e) => handleActionClick(e, handleAddToCart)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#FF671F] hover:text-white transition-colors"
              title="Add to Cart"
            >
              <ShoppingCart size={18} />
            </button>
            <button
              onClick={(e) => handleActionClick(e, handleAddToFavorites)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#FF671F] hover:text-white transition-colors"
              title="Add to Favorites"
            >
              <Heart size={18} />
            </button>
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
                <span className="text-gray-400 line-through text-sm">{product.price.toFixed(2)} JOD</span>
                <span className="text-[#FF671F] font-semibold text-lg">{product.price_after_discount.toFixed(2)} JOD</span>
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
    </>
  );
}
