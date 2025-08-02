"use client";

import { useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { BsCartX } from "react-icons/bs"; // أيقونة للسلة الفارغة
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function CartDrawer({
  items = [],
  isOpen,
  onClose,
  onRemoveItem,
}) {
  const locale = useLocale();
  const t = useTranslations("cartDrawer");
  
  // ✅ Check for RTL support
  const isRTL = locale === 'ar';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const validItems = items.filter((item) => item.product);

  const subtotal = validItems.reduce(
    (sum, item) =>
      sum +
      ((item.product?.price_after_discount ?? item.product?.price ?? 0) *
        item.quantity),
    0
  );
  
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out
          ${isRTL ? 'left-0' : 'right-0'}
          ${isOpen ? 'translate-x-0' : (isRTL ? '-translate-x-full' : 'translate-x-full')}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">{t("cartTitle")}</h2>
          <button onClick={onClose} aria-label={t("closeDrawer")} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all">
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Content */}
        {validItems.length === 0 ? (
          // Empty Cart View
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-gray-500">
            <BsCartX size={70} className="mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{t("emptyCartTitle")}</h3>
            <p className="text-sm mb-6">{t("emptyCartMessage")}</p>
            <button onClick={onClose} className="bg-black text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              {t("continueShopping")}
            </button>
          </div>
        ) : (
          // Items List
          <div className="flex-grow p-5 overflow-y-auto">
            <div className="space-y-6">
              {validItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <Link href={`/${locale}/product/${item.product.id}`} className="flex-shrink-0">
                    <img
                      src={item.product?.images?.[0]?.image || "/default.png"}
                      alt={item.product?.name || "Product Image"}
                      className="w-24 h-24 object-cover border border-gray-100 rounded-lg"
                    />
                  </Link>
                  <div className="flex-grow">
                    <Link href={`/${locale}/product/${item.product.id}`} className="font-bold text-gray-800 text-base leading-tight hover:text-black transition-colors block mb-1">
                      {isRTL ? item.product?.name_ar || item.product?.name : item.product?.name || t("noName")}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × ${(item.product?.price_after_discount ?? item.product?.price ?? 0).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={t("removeItem")}
                    className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all flex-shrink-0"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
{validItems.length > 0 && (
  <div className="p-5 border-t border-gray-200 bg-white space-y-4 flex-shrink-0">
    <div className="flex justify-between items-center mb-4">
      <span className="font-semibold text-gray-800 text-lg">{t("subtotal")}</span>
      <span className="font-extrabold text-2xl text-black">
        ${subtotal.toFixed(2)}
      </span>
    </div>
    <p className="text-xs text-gray-500 text-center mb-4">{t("shippingMessage")}</p>

  {/* أزرار جنب بعض */}
<div className="flex gap-4">
  <Link href={`/${locale}/checkout`} className="flex-grow">
    <button
      className="w-full bg-black text-white py-3 rounded-lg text-base font-bold hover:bg-gray-800 transition-transform hover:scale-[1.02] duration-300 cursor-pointer"
    >
      {t("goToCheckout")}
    </button>
  </Link>
  <Link href={`/${locale}/cart`} className="flex-grow">
    <button
      className="w-full bg-white text-black border border-gray-300 py-3 rounded-lg text-base font-bold hover:bg-gray-100 transition-transform hover:scale-[1.02] duration-300 cursor-pointer"
    >
      {t("goToCart")}
    </button>
  </Link>
</div>


    <div className="text-center mt-4">
      <button onClick={onClose} className="text-sm text-gray-600 hover:text-black underline">
        {t("orContinueShopping")}
      </button>
    </div>
  </div>
)}

      </div>
    </>
  );
}