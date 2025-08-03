"use client";
import React from 'react';
import { ShoppingBag, Heart, Repeat, Eye, Star } from 'lucide-react';
import Link from 'next/link';
import { useCartContext } from "../../../../context/CartContext"; // تأكد أنك استخدمت نفس المسار
import BackendConnector from "@/services/connectors/BackendConnector";
import Swal from "sweetalert2";
import storageService from "@/services/storage/storageService";
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
    const productImage =
        product.images && product.images.length > 0
            ? product.images[0].image
            : '/placeholder.png';

    const { addCart } = useCartContext();
    const router = useRouter();

    // ❤️ إضافة للمفضلة
    const addToFavorites = async () => {
        const userInfo = storageService.getUserInfo();

        if (!userInfo?.accessToken) {
            Swal.fire("خطأ", "يجب تسجيل الدخول لإضافة للمفضلة", "error");
            return;
        }

        try {
            const response = await BackendConnector.addToFavorites({
                product_id: product.id,
                user_id: userInfo.id,
            });
           console.log(response)
            if (response?.success) {
                Swal.fire("تم", "تمت إضافة المنتج إلى المفضلة", "success");
            } else {
                Swal.fire("خطأ", response?.message || "فشل في الإضافة", "error");
            }
        } catch (error) {
            Swal.fire("خطأ", "حدث خطأ أثناء الإضافة", "error");
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden group text-center bg-white transition-shadow hover:shadow-xl">
            <div className="relative bg-gray-100 p-5 h-64 flex items-center justify-center">
                <img src={productImage} alt={product.name} className="max-w-full max-h-full object-contain" />
                {product.sale && (
                    <span className="absolute top-4 left-4 bg-[#ef8172] text-white text-xs font-medium py-1 px-2.5 rounded">
                        Sale
                    </span>
                )}
                <div className="absolute top-5 right-5 flex flex-col gap-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform group-hover:translate-x-0 translate-x-3">
                    {/* 🛍️ إضافة إلى السلة */}
                    <button
                        onClick={() => addCart({ productId: product.id })}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#ef8172] hover:text-white transition-colors"
                    >
                        <ShoppingBag size={18} />
                    </button>

                    {/* ❤️ المفضلة */}
                    <button
                        onClick={addToFavorites}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#ef8172] hover:text-white transition-colors"
                    >
                        <Heart size={18} />
                    </button>

                    {/* <button
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#ef8172] hover:text-white transition-colors"
                    >
                        <Repeat size={18} />
                    </button> */}

                    {/* 👁️ عرض المنتج */}
                    <button
                        onClick={() => router.push(`/product/${product.id}`)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#ef8172] hover:text-white transition-colors"
                    >
                        <Eye size={18} />
                    </button>
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-base font-medium text-gray-800 mb-2.5 h-12 overflow-hidden">{product.name}</h3>
                {/* <div className="flex justify-center items-center gap-1 mb-2.5 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            fill={i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'}
                            stroke="currentColor"
                        />
                    ))}
                    <span className="text-gray-500 text-xs ml-1.5">({product.reviews || 0})</span>
                </div> */}
                <p className={`text-lg font-semibold ${product.sale ? 'text-[#ef8172]' : 'text-gray-900'}`}>
                    {product.originalPrice && (
                        <span className="text-gray-400 line-through font-normal text-sm mr-2">${product.originalPrice.toFixed(2)}</span>
                    )}
                    ${product.price ? product.price.toFixed(2) : '0.00'}
                </p>
            </div>
        </div>
    );
}
