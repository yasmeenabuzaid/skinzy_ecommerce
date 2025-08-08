"use client";

import React from "react";
import OrderSummaryItem from "./OrderSummaryItem";
import { useTranslations } from "next-intl";
import { useCartContext } from "../../../context/CartContext";

// سعر الصرف من دولار إلى دينار أردني (غيره حسب السوق)
const USD_TO_JOD_RATE = 0.71;

const OrderSummary = ({ extraFee = 0 }) => {
  const t = useTranslations("checkout");
  const { cart, updateCart } = useCartContext();

  const handleRemove = async (id) => {
    await updateCart(id);
  };

  const subtotalUSD = cart.reduce(
    (sum, item) =>
      sum +
      ((item.product?.price_after_discount ?? item.product?.price ?? 0) *
        item.quantity),
    0
  );

  const finalExtraFeeUSD = subtotalUSD > 15 ? 0 : parseFloat(extraFee || 0);

  const totalUSD = subtotalUSD + finalExtraFeeUSD;

  // تحويل الأسعار لدينار أردني
  const subtotalJOD = subtotalUSD * USD_TO_JOD_RATE;
  const extraFeeJOD = finalExtraFeeUSD * USD_TO_JOD_RATE;
  const totalJOD = totalUSD * USD_TO_JOD_RATE;
  return (
    <div className="w-full lg:w-2/5 bg-gray-50 lg:min-h-screen border-l">
      <div className="py-8 px-4 sm:px-10">
        <h2 className="text-lg font-semibold mb-6">{t("orderSummaryTitle")}</h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500">{t("cartEmptyMessage")}</p>
        ) : (
          <>
            {cart.map((item) => (
              <OrderSummaryItem
                key={item.id}
                item={{
                  ...item,
                  product: {
                    ...item.product,
                    displayName:
                      item.product.name_ar && item.product.name_ar.trim() !== ""
                        ? item.product.name_ar
                        : item.product.name,
                  },
                }}
                onRemove={handleRemove}
              />
            ))}

            <div className="py-6 border-t space-y-3 text-sm">
              <div className="flex justify-between">
                <p className="text-gray-600">{t("subtotal")}</p>
                <p className="font-semibold">{subtotalJOD.toFixed(2)} JD</p>
              </div>

              <div className="flex justify-between">
                <p className="text-gray-600">{t("shipping")}</p>
                {subtotalUSD > 15 ? (
                  <p className="font-semibold text-green-600">{t("freeDelivery")}</p>
                ) : (
                  <p className="font-semibold text-gray-800">{extraFeeJOD.toFixed(2)} JD</p>
                )}
              </div>
            </div>

            <div className="py-6 flex justify-between items-center border-t">
              <p className="font-semibold">{t("total")}</p>
              <p>
                <span className="text-xs text-gray-500 mr-2">JD</span>{" "}
                <span className="text-2xl font-semibold">{totalJOD.toFixed(2)}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
