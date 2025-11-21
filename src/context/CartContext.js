"use client";
import React, { useContext, useState, useEffect, createContext } from "react";
import BackendConnector from "@/services/connectors/BackendConnector";
import storageService from "@/services/storage/storageService";
import { useTranslations } from "next-intl";
import toast, { Toaster } from 'react-hot-toast'; // استيراد التوست

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

  // --- إضافة للكارت ---
  const addCart = async ({ productId, quantity = 1, size = null }) => {
    const userInfo = storageService.getUserInfo();
    if (!userInfo?.accessToken) {
      toast.error(t("loginRequired")); // استبدال Swal بـ toast
      return;
    }

    // تحديث وهمي سريع للعدد (اختياري)
    setCartCount(prev => prev + 1); 

    const toastId = toast.loading(t("adding")); // إظهار لودينج صغير

    try {
      const resp = await BackendConnector.addCart({ productId, quantity, size });
      
      if (resp?.success) {
        toast.success(t("addSuccess"), { id: toastId }); // تحويل اللودينج لنجاح
        await fetchCart(true); // تحديث صامت للداتا الحقيقية
        await fetchCartCount();
      } else {
        toast.error(t("addError"), { id: toastId });
        setCartCount(prev => prev - 1); // تراجع في حالة الفشل
      }
    } catch (error) {
      toast.error(t("addError"), { id: toastId });
      setCartCount(prev => prev - 1); // تراجع
    }
  };

  // --- حذف من الكارت (تحديث فوري) ---
  const deleteCart = async (id) => {
    // 1. حفظ النسخة القديمة احتياطاً
    const previousCart = [...cart];
    const previousCount = cartCount;

    // 2. التحديث الفوري للواجهة (حذف العنصر فوراً)
    setCart((prev) => prev.filter((item) => item.id !== id));
    setCartCount((prev) => Math.max(0, prev - 1));
    
    // رسالة صغيرة
    toast.success(t("deleteSuccess"), { duration: 2000 });

    try {
      // 3. إرسال الطلب للسيرفر
      const data = await BackendConnector.deleteCart({ id });
      
      if (!data.success) {
        throw new Error(data.message);
      }
      // في حالة النجاح، لا نفعل شيئاً لأننا حدثنا الواجهة بالفعل
      // يمكن عمل fetch في الخلفية للتأكد من الداتا
      fetchCartCount(); 
    } catch (error) {
      // 4. في حالة الفشل: استرجاع النسخة القديمة
      setCart(previousCart);
      setCartCount(previousCount);
      toast.error(t("deleteError"));
    }
  };

  // --- تحديث الكمية (تحديث فوري) ---
  const updateCartq = async (id, quantity) => {
    // 1. حفظ النسخة القديمة
    const previousCart = [...cart];

    // 2. التحديث الفوري للواجهة (تغيير الرقم فوراً أمام اليوزر)
    setCart((prevCart) => 
      prevCart.map((item) => 
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );

    try {
      // 3. إرسال الطلب للسيرفر بدون لودينج مزعج
      const data = await BackendConnector.updateCartq({ id, quantity });
      
      if (!data?.success) {
        throw new Error(data?.message);
      }
      
      // نجاح صامت، أو يمكن عمل fetch silent للتأكد من الأسعار
      fetchCart(true); 
      
    } catch (error) {
      // 4. تراجع عند الخطأ
      setCart(previousCart);
      toast.error(t("updateError"));
      console.error("Update cart error:", error);
    }
  };

  // دالة updateCart القديمة (إذا كنت تستخدمها لحذف المنتج عند نقص الكمية لصفر)
  const updateCart = async (id, quantity) => {
     // يمكنك تطبيق نفس منطق updateCartq هنا
     // ...
  };

  return (
    <CartContext.Provider
      value={{
        addCart,
        deleteCart,
        updateCart, // تأكد من توحيد استخدامك للدوال
        updateCartq,
        cartCount,
        cart,
        isFetching,
        fetchCart,
        fetchCartCount
      }}
    >
      {/* ضروري لإظهار التوست في التطبيق */}
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);