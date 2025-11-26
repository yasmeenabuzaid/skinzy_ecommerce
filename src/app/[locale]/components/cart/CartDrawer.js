"use client";
import { useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { BsCartX } from "react-icons/bs";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCartContext } from "@/context/CartContext";

// دالة لجلب السعر الصحيح
const getPriceAsNumber = (item) => {
  const priceAfterDiscount = parseFloat(item.variation?.price_after_discount ?? item.product?.price_after_discount);
  const price = parseFloat(item.variation?.price ?? item.product?.price);

  if (!isNaN(priceAfterDiscount) && priceAfterDiscount > 0) return priceAfterDiscount;
  if (!isNaN(price) && price > 0) return price;
  return 0;
};

// 🟢 دالة ذكية لجلب الصورة (هنا التعديل الجوهري)
const getItemImage = (item) => {
  // 1. الأولوية القصوى: البحث داخل صور المنتج عن صورة تحمل نفس رقم الفاريشن الموجود في السلة
  if (item.product_variation_id && item.product?.images?.length > 0) {
    const matchedImage = item.product.images.find(
      (img) => img.variation_id === item.product_variation_id
    );
    if (matchedImage && matchedImage.image) return matchedImage.image;
  }

  // 2. المحاولة الثانية: إذا كان الفاريشن موجوداً ككائن وله صورة مباشرة
  if (item.variation?.image) {
      if (Array.isArray(item.variation.image) && item.variation.image.length > 0) {
        return item.variation.image[0].image;
      }
      if (typeof item.variation.image === 'string') {
        return item.variation.image;
      }
  }

  // 3. المحاولة الثالثة: الصورة الأولى للمنتج الرئيسي (first_image)
  if (item.product?.first_image?.image) {
    return item.product.first_image.image;
  }

  // 4. المحاولة الرابعة: أول صورة في مصفوفة الصور
  if (item.product?.images && item.product.images.length > 0) {
     return item.product.images[0].image;
  }

  // 5. صورة افتراضية
  return "/default.png";
};

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, updateCart, deleteCart } = useCartContext();
  const locale = useLocale();
  const t = useTranslations("cartDrawer");
  const isRTL = locale === "ar";

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const validItems = cart.filter((item) => item.product);

  const subtotal = validItems.reduce(
    (sum, item) => sum + getPriceAsNumber(item) * item.quantity,
    0
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out
          ${isRTL ? "left-0" : "right-0"}
          ${isOpen ? "translate-x-0" : isRTL ? "-translate-x-full" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">{t("cartTitle")}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <IoMdClose size={24} />
          </button>
        </div>

        {validItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-gray-500">
            <BsCartX size={70} className="mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-800">{t("emptyCartTitle")}</h3>
            <p className="text-sm mb-6">{t("emptyCartMessage")}</p>
            <button onClick={onClose} className="bg-black text-white px-6 py-2 rounded-lg">
              {t("continueShopping")}
            </button>
          </div>
        ) : (
          <div className="flex-grow p-5 overflow-y-auto">
            <div className="space-y-6">
              {validItems.map((item) => {
                // 🟢 استدعاء دالة الصورة هنا
                const imageUrl = getItemImage(item); 
                
                return (
                <div key={item.id} className="flex gap-4 items-start">
                  <Link href={`/${locale}/products/${item.product.id}`} className="flex-shrink-0">
                    <img
                      src={imageUrl} 
                      alt={item.product?.name}
                      className="w-24 h-24 object-cover border border-gray-100 rounded-lg"
                      onError={(e) => { e.target.src = "/default.png"; }}
                    />
                  </Link>

                  <div className="flex-grow">
                    <Link href={`/${locale}/products/${item.product.id}`} className="font-bold text-gray-800 block mb-1">
                      {isRTL ? item.product?.name_ar || item.product?.name : item.product?.name || t("noName")}
                    </Link>

                    {item.variation && (
                      <p className="text-sm text-gray-600 mb-1">
                        {item.variation.color && `Color: ${item.variation.color} `}
                        {item.variation.size && `| Size: ${item.variation.size} `}
                      </p>
                    )}

                    <p className="text-sm mb-2 text-black font-semibold">
                      JD {getPriceAsNumber(item).toFixed(2)}
                    </p>

                    <div className="flex items-center border rounded-md w-fit">
                      <button onClick={() => updateCart(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="px-3 py-1 text-gray-700 disabled:opacity-50">-</button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateCart(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-700">+</button>
                    </div>
                  </div>

                  <button onClick={() => deleteCart(item.id)} className="p-2 text-gray-400 hover:text-red-600">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              )})}
            </div>
          </div>
        )}

        {validItems.length > 0 && (
          <div className="p-5 border-t border-gray-200 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">{t("subtotal")}</span>
              <span className="font-extrabold text-2xl">JD {subtotal.toFixed(2)}</span>
            </div>
            <Link href={`/${locale}/checkout`}>
              <button className="w-full bg-[#FF671F] text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-transform">
                {t("goToCheckout")}
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}