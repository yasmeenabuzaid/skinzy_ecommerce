"use client";

import { useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function CartDrawer({
  items = [],
  isOpen,
  onClose,
  onRemoveItem,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const validItems = items.filter((item) => item.product);

  const subtotal = validItems.reduce(
    (sum, item) =>
      sum +
      ((item.product?.price_after_discount ?? item.product?.price ?? 0) *
        item.quantity),
    0
  );

  const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);
  const locale = useLocale();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 bg-opacity-40 z-40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">سلة المشتريات</h2>
          <button onClick={onClose} aria-label="Close drawer">
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-180px)]">
          {validItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">السلة فارغة</p>
          ) : (
            validItems.map((item) => (
              <div key={item.id} className="flex gap-4 mb-5">
                <img
                  src={
                    item.product?.images?.[0]?.image ||
                    "/default.png"
                  }
                  alt={item.product?.name || "Product Image"}
                  className="w-20 h-20 object-cover border border-gray-200 rounded-md"
                />
                <div className="flex-grow">
                  <p className="font-medium text-sm text-gray-800 mb-1">
                    {item.product?.name || "No name"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} × $
                    {(item.product?.price_after_discount ??
                      item.product?.price ??
                      0
                    ).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  aria-label="Remove item"
                  className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">عدد المنتجات:</span>
            <span className="text-sm font-medium text-gray-800">
              {totalItems}
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">الإجمالي:</span>
            <span className="text-lg font-semibold text-gray-800">
              ${subtotal.toFixed(2)}
            </span>
          </div>
                            <Link href={`/${locale}/checkout`}>

          <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition-colors">
            الذهاب للدفع
          </button>
                            </Link>

        </div>
      </div>
    </>
  );
}
