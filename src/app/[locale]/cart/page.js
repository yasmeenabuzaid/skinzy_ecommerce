"use client";
import React from "react";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { useCartContext } from "../../../context/CartContext"; 
import Link from "next/link";
import { useLocale } from 'next-intl';
const TrashIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

export default function CartPage() {
  const { cart, updateCartq, updateCart } = useCartContext();
  const locale = useLocale();

  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const handleQuantityChange = (id, quantity) => {
    if (quantity >= 1) {
      updateCartq(id, quantity);
    }
  };

  const handleRemoveItem = (id) => {
    updateCart(id);
  };

  return (
    <div className="text-gray-800">
      <Header />

      <div className="bg-white min-h-screen font-sans">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <h1 className="text-3xl font-semibold text-gray-800 mb-8">Your cart</h1>

          {cart.length > 0 ? (
            <>
              <div className="hidden md:grid grid-cols-6 gap-4 text-sm text-gray-500 uppercase pb-4 border-b">
                <div className="col-span-3">Product</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="text-right">Total</div>
              </div>

              <div className="border-b">
                {cart.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center py-6">
                    <div className="col-span-3 flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-md flex-shrink-0">
                       <img
                  src={
                    item.product?.images?.[0]?.image ||
                    "/default.png"
                  }
                  alt={item.product?.name || "Product Image"}
                  className="w-20 h-20 object-cover border border-gray-200 rounded-md"
                />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-500 text-sm">{item.product?.brand}</p>
                        <p className="font-bold text-gray-800">{item.product?.name}</p>
                        <p className="text-sm text-gray-600 mt-1">${item.product?.price?.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-center items-center gap-2">
                      <div className="flex items-center border rounded-md">
                        <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="px-3 py-1">-</button>
                        <input type="text" value={item.quantity} readOnly className="w-10 text-center border-l border-r" />
                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="px-3 py-1">+</button>
                      </div>
                      <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right font-semibold text-gray-800">
                      ${(item.product?.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-between items-start gap-8 flex-col md:flex-row">
                <div className="w-full md:w-1/2">
                  <button className="bg-[#d77979] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#c96a6a]">
                    Continue shopping
                  </button>
                </div>
                <div className="w-full md:w-1/3 text-right">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold">Subtotal</span>
                    <span className="text-lg font-semibold">${subtotal.toFixed(2)} USD</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-6">
                    Taxes and <a href="#" className="underline">shipping</a> calculated at checkout
                  </p>
                     <Link
                  href={`/${locale}/checkout`}
                >
                  <button className="w-full bg-[#d77979] text-white px-6 py-4 rounded-md font-bold text-lg hover:bg-[#c96a6a]">
                    Check out
                  </button>
                     </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <a href="#" className="text-[#d77979] underline font-semibold">Continue shopping</a>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
