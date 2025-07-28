"use client";
import React, { useContext, useState, useEffect, createContext } from "react";
import BackendConnector from "../services/connectors/BackendConnector";
import Swal from "sweetalert2";
import storageService from "../services/storage/storageService";

const CartContext = createContext({});

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // جلب محتوى السلة من السيرفر
  const fetchCart = async () => {
    const userInfo = storageService.getUserInfo();
    if (!userInfo?.accessToken) return; // لا تسحب إذا المستخدم غير مسجل دخول
  console.log(userInfo)
  try {
      setIsFetching(true);
      const data = await BackendConnector.fetchCart();
      console.log(data)
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

  // عند تحميل الكومبوننت، جلب السلة
  useEffect(() => {
    fetchCart();
  }, []);

  // إضافة عنصر للسلة
  const addCart = async ({ productId, quantity = 1, size = null }) => {
    const userInfo = storageService.getUserInfo();
    console.log(userInfo)
    if (!userInfo?.accessToken) {
      Swal.fire("خطأ", "يجب تسجيل الدخول لإضافة المنتج إلى السلة", "error");
      return;
    }

    try {
     const resp = await BackendConnector.addCart({ productId, quantity, size });

console.log("Add cart response:", resp);

if (resp?.success) {
  Swal.fire("تم", "تمت إضافة المنتج إلى السلة", "success");
  await fetchCart(); // تحديث السلة
}

    } catch (error) {
      console.error("Add cart error:", error);
      Swal.fire("خطأ", "حدث خطأ أثناء الإضافة إلى السلة", "error");
    }
  };

  // حذف عنصر من السلة
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

  // تحديث كمية عنصر في السلة
const updateCart = async (id, quantity) => {
  // عرض رسالة جاري التحديث
  Swal.fire({
    title: "جاري حذف المنتج من السلة...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const data = await BackendConnector.updateCart({ id, quantity });

    if (data?.success) {
      await fetchCart(); // تحديث السلة بعد التعديل

      // ✅ إظهار رسالة نجاح
      Swal.fire({
        icon: "success",
        title: "تم الحذف بنجاح",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      console.error("Update cart failed:", data?.message);
      Swal.fire("خطأ", "فشل في تعديل الكمية", "error");
    }
  } catch (error) {
    console.error("Update cart error:", error);
    Swal.fire("خطأ", "حدث خطأ أثناء تحديث الكمية", "error");
  }
};
const updateCartq = async (id, quantity) => {
  // عرض رسالة جاري التحديث
  Swal.fire({
    title: "جاري حذف تعديل الكمية...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const data = await BackendConnector.updateCartq({ id, quantity });

    if (data?.success) {
      await fetchCart(); // تحديث السلة بعد التعديل

      // ✅ إظهار رسالة نجاح
      Swal.fire({
        icon: "success",
        title: "تم تغير الكمية بنجاح",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      console.error("Update cart failed:", data?.message);
      Swal.fire("خطأ", "فشل في تعديل الكمية", "error");
    }
  } catch (error) {
    console.error("Update cart error:", error);
    Swal.fire("خطأ", "حدث خطأ أثناء تحديث الكمية", "error");
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
