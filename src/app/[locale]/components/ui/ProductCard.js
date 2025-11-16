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
    const router = useRouter();
    const locale = useLocale();
    const { addCart } = useCartContext();

    // 🔽 *** هاد هو السطر اللي تعدل *** 🔽
    // ضفنا product.first_image?.image كخيار أول
    const productImage = product.first_image?.image || product.full_image_url || product.images?.[0]?.image || '/placeholder.png';

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
        const userId = currentUserInfo?.user?.id; 

        if (!userId) {
            console.error("User ID not found, cannot add to favorites.");
            Swal.fire(t.warningTitle, t.favoriteErrorOccured, "error");
            return; 
        }

        try {
            const response = await BackendConnector.addToFavorites({
                product_id: product.id,
                user_id: userId,
            });

            Swal.fire(
                t.warningTitle,
                response?.message || (response?.favorite ? t.favoriteAdded : t.favoriteFailed),
                response?.favorite ? "success" : "error"
            );

        } catch (error) {
            console.error("Add to favorites error:", error);
            const errorMessage = error.response?.data?.message || t.favoriteErrorOccured;
            Swal.fire(t.warningTitle, errorMessage, "error");
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
        e.stopPropagation();
        action();
    };

    const productName = locale === 'ar' ? product.name_ar : product.name;
    const smallDescription = locale === 'ar' ? product.small_description_ar : product.small_description;

    const price = Number(product.price) || 0;
    const priceAfterDiscount = Number(product.price_after_discount) || 0;
    const isDiscounted = priceAfterDiscount > 0 && priceAfterDiscount < price;
    const savingAmount = isDiscounted ? (price - priceAfterDiscount).toFixed(2) : null;

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
                className="relative border border-gray-200 rounded-xl overflow-hidden group text-center bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
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

                <div className="relative bg-gray-50 w-full h-64 flex items-center justify-center">
                    <img 
                        src={productImage} 
                        alt={productName} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2" 
                    />
                    
                    {isDiscounted && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold py-1 px-3 rounded-full shadow-lg">
                            {savingAmount} JOD OFF
                        </span>
                    )}

                    {product.code && !isDiscounted && (
                        <span className="absolute top-4 left-4 bg-[#FF671F] text-white text-xs font-medium py-1 px-2.5 rounded">
                            {product.code}
                        </span>
                    )}

                    {/* أزرار السلة والمفضلة */}
                    <div 
                        className="
                            absolute top-1/2 -translate-y-1/2 right-4 flex flex-col gap-2.5 
                            opacity-100 md:opacity-0 md:group-hover:opacity-100
                            transform md:translate-x-10 md:group-hover:translate-x-0
                            transition-all duration-300 z-10
                        "
                    >
                        <button
                            onClick={(e) => handleActionClick(e, handleAddToCart)}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-xl hover:bg-[#FF671F] hover:text-white transition-colors duration-200"
                            title="Add to Cart"
                        >
                            <ShoppingCart size={18} />
                        </button>
                        <button
                            onClick={(e) => handleActionClick(e, handleAddToFavorites)}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-xl hover:bg-[#FF671F] hover:text-white transition-colors duration-200"
                            title="Add to Favorites"
                        >
                            <Heart size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-4 md:p-5 text-start">
                    <h3 className="text-base font-semibold text-gray-900 h-7 overflow-hidden transition-colors group-hover:text-[#FF671F]">
                        {productName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 leading-snug h-10 overflow-hidden">
                        {smallDescription}
                    </p>
                    
                    <div className="flex justify-start items-end gap-2 mt-2">
                        {isDiscounted ? (
                            <>
                                <span className="text-[#FF671F] font-bold text-xl">
                                    {priceAfterDiscount.toFixed(2)} JOD
                                </span>
                                <span className="text-gray-400 line-through text-sm font-medium">
                                    {price.toFixed(2)} JOD
                                </span>
                            </>
                        ) : (
                            <span className="text-gray-900 font-bold text-xl">
                                {price.toFixed(2)} JOD
                            </span>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}