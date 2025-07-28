"use client";

import React from "react";
import OrderSummaryItem from "./OrderSummaryItem";
import { useLocale } from "next-intl";
import { useCartContext } from "../../../context/CartContext"; // عدلي المسار حسب الحاجة

const OrderSummary = ({ extraFee = 0 }) => {
  const locale = useLocale();
  const { cart, updateCart } = useCartContext();

  const handleRemove = async (id) => {
    await updateCart(id);
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      ((item.product?.price_after_discount ?? item.product?.price ?? 0) *
        item.quantity),
    0
  );

  const finalExtraFee = subtotal > 15 ? 0 : parseFloat(extraFee || 0);

  const total = subtotal + finalExtraFee;

  return (
    <div className="w-full lg:w-2/5 bg-gray-50 lg:min-h-screen border-l">
      <div className="py-8 px-4 sm:px-10">
        <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          <>
            {cart.map((item) => (
              <OrderSummaryItem key={item.id} item={item} onRemove={handleRemove} />
            ))}

            <div className="py-6 border-t space-y-3 text-sm">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-semibold">${subtotal.toFixed(2)}</p>
              </div>

              <div className="flex justify-between">
                <p className="text-gray-600">Shipping</p>
                {subtotal > 15 ? (
                  <p className="font-semibold text-green-600">Free Delivery!</p>
                ) : (
                  <p className="font-semibold text-gray-800">
                    ${finalExtraFee.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            <div className="py-6 flex justify-between items-center border-t">
              <p className="font-semibold">Total</p>
              <p>
                <span className="text-xs text-gray-500 mr-2">USD</span>{" "}
                <span className="text-2xl font-semibold">${total.toFixed(2)}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
