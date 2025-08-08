"use client";
import React, { useContext, useState, useEffect, createContext } from "react";
import BackendConnector from "@/services/connectors/BackendConnector";
import Swal from "sweetalert2";
import storageService from "@/services/storage/storageService";
import { useTranslations } from "next-intl";

const CartContext = createContext({});

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const t = useTranslations("cart");

  const fetchCart = async () => {
    const userInfo = storageService.getUserInfo();
    if (!userInfo?.accessToken) return;
    try {
      setIsFetching(true);
      const data = await BackendConnector.fetchCart();
      setIsFetching(false);

      if (data.success) {
        setCart(data.cart || []);
      } else {
        console.error("Fetch cart failed:", data.message);
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addCart = async ({ productId, quantity = 1, size = null }) => {
    const userInfo = storageService.getUserInfo();
    if (!userInfo?.accessToken) {
      Swal.fire(t("error"), t("loginRequired"), "error");
      return;
    }

    try {
      const resp = await BackendConnector.addCart({ productId, quantity, size });

      if (resp?.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Add cart error:", error);
      Swal.fire(t("error"), t("addError"), "error");
    }
  };

  const deleteCart = async (id) => {
    try {
      const data = await BackendConnector.deleteCart({ id });
      if (data.success) {
        setCart((prev) => prev.filter((item) => item.id !== id));
      } else {
        console.error("Delete cart failed:", data.message);
      }
    } catch (error) {
      console.error("Delete cart error:", error);
    }
  };

  const updateCart = async (id, quantity) => {
    Swal.fire({
      title: t("removingProduct"),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const data = await BackendConnector.updateCart({ id, quantity });

      if (data?.success) {
        await fetchCart();

        Swal.fire({
          icon: "success",
          title: t("deleteSuccess"),
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.error("Update cart failed:", data?.message);
        Swal.fire(t("error"), t("updateFailed"), "error");
      }
    } catch (error) {
      console.error("Update cart error:", error);
      Swal.fire(t("error"), t("updateError"), "error");
    }
  };

  const updateCartq = async (id, quantity) => {
    Swal.fire({
      title: t("modifyingQuantity"),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const data = await BackendConnector.updateCartq({ id, quantity });

      if (data?.success) {
        await fetchCart();

        Swal.fire({
          icon: "success",
          title: t("updateSuccess"),
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.error("Update cart failed:", data?.message);
        Swal.fire(t("error"), t("updateFailed"), "error");
      }
    } catch (error) {
      console.error("Update cart error:", error);
      Swal.fire(t("error"), t("updateError"), "error");
    }
  };

  return (
    <CartContext.Provider
      value={{
        addCart,
        deleteCart,
        updateCart,
        updateCartq,
        cart,
        isFetching,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
