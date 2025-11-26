"use client";
import React, { useContext, useState, useEffect, createContext } from "react";
import BackendConnector from "@/services/connectors/BackendConnector";
import storageService from "@/services/storage/storageService";
import { useTranslations } from "next-intl";
import toast, { Toaster } from 'react-hot-toast';

const CartContext = createContext({});

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const t = useTranslations("cart");

  const fetchCart = async (silent = false) => {
    const userInfo = storageService.getUserInfo();
    if (!userInfo?.accessToken) return;
    try {
      if (!silent) setIsFetching(true);
      const data = await BackendConnector.fetchCart();
      if (!silent) setIsFetching(false);

      if (data.success) {
        setCart(data.cart || []);
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
      if (!silent) setIsFetching(false);
    }
  };

  const fetchCartCount = async () => {
    const userInfo = storageService.getUserInfo();
    if (!userInfo?.accessToken) return;
    try {
      const data = await BackendConnector.fetchCartCount();
      if (data.success) {
        setCartCount(data.count || 0);
      }
    } catch (error) {
      console.error("Fetch cart count error:", error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchCartCount();
  }, []);

  // --- إضافة للكارت (معدلة) ---
  const addCart = async ({ productId, quantity = 1, variationId = null }) => {
    const userInfo = storageService.getUserInfo();
    if (!userInfo?.accessToken) {
      toast.error(t("loginRequired"));
      return;
    }

    const toastId = toast.loading(t("adding"));

    try {
      const resp = await BackendConnector.addCart({ 
          productId, 
          quantity, 
          product_variation_id: variationId // ربط كامل مع قاعدة البيانات
      });

      if (resp?.success) {
        toast.success(t("addSuccess"), { id: toastId });
        await fetchCart(true);
        await fetchCartCount(); // تحديث count من السيرفر
      } else {
        toast.error(t("addError"), { id: toastId });
      }
    } catch (error) {
      toast.error(t("addError"), { id: toastId });
      console.error("Add cart error:", error);
    }
  };

  // --- حذف من الكارت ---
  const deleteCart = async (id) => {
    const previousCart = [...cart];
    const previousCount = cartCount;

    // تحديث مؤقت للسلاسة
    setCart((prev) => prev.filter((item) => item.id !== id));

    toast.success(t("deleteSuccess"), { duration: 2000 });

    try {
      const data = await BackendConnector.updateCart({ id, is_deleted: 1 });
      if (!data.success) {
        throw new Error(data.message);
      }
      await fetchCartCount(); // تحديث count من السيرفر
    } catch (error) {
      setCart(previousCart);
      setCartCount(previousCount);
      toast.error(t("deleteError"));
      console.error("Delete cart error:", error);
    }
  };

  // --- تحديث الكمية ---
  const updateCartq = async (id, quantity) => {
    const previousCart = [...cart];

    setCart((prevCart) => 
      prevCart.map((item) => 
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );

    try {
      const data = await BackendConnector.updateCartq({ id, quantity });
      if (!data?.success) {
        throw new Error(data?.message);
      }
      await fetchCart(true); // تحديث البيانات من السيرفر
    } catch (error) {
      setCart(previousCart);
      toast.error(t("updateError"));
      console.error("Update cart error:", error);
    }
  };

  // دالة updateCart القديمة للتوحيد
  const updateCart = async (id, quantity) => {
      return updateCartq(id, quantity);
  };

  return (
    <CartContext.Provider
      value={{
        addCart,
        deleteCart,
        updateCart,
        updateCartq,
        cartCount,
        cart,
        isFetching,
        fetchCart,
        fetchCartCount
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
