"use client";
import { useCartContext } from "@/context/CartContext";
import { Heart, Minus, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import storageService from "@/services/storage/storageService";
import BackendConnector from "@/services/connectors/BackendConnector";
import AuthModal from "../../components/auth/AuthModal";
import Link from "next/link";

// تحويل السعر إلى رقم قبل تنسيقه
const formatPrice = (price) =>
  typeof Number(price) === "number"
    ? `${Number(price).toFixed(2)} JOD`
    : "السعر غير متوفر";

export default function ProductDetails({
  product,
  quantity,
  handleQuantityChange,
  // ⭐️ 1. سنعتمد على هذه الـ props فقط لاختيار الفاريشن
  selectedVariation, 
  setSelectedVariation,
}) {
  const { addCart } = useCartContext();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const [userInfo, setUserInfo] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // ⭐️ 2. تم حذف الحالة الداخلية `selectedOptions`
  // نحن نعتمد كلياً على `selectedVariation` القادم من الأب.

  useEffect(() => {
    setUserInfo(storageService.getUserInfo());
  }, []);

  const translations = {
    ar: {
      Color: "اللون",
      Scent: "الرائحة",
      Size: "الحجم",
      Weight: "الوزن",
      chooseVariant: "اختر المواصفات:",
      quantity: "الكمية",
      addToCart: "أضف إلى السلة",
      addedToCart: "تمت الإضافة إلى السلة بنجاح!",
      continueBtn: "متابعة",
      warningTitle: "تنبيه",
      favoriteError: "حدث خطأ أثناء إضافة المنتج للمفضلة.",
      favoriteAdded: "تمت إضافة المنتج للمفضلة بنجاح!",
      favoriteFailed: "فشلت إضافة المنتج للمفضلة.",
      favoriteErrorOccured: "حدث خطأ غير متوقع.",
      addToFavoritesAria: "إضافة إلى المفضلة",
      noOptions: "لا توجد خيارات متاحة.",
    },
    en: {
      Color: "Color",
      Scent: "Scent",
      Size: "Size",
      Weight: "Weight",
      chooseVariant: "Choose Options:",
      quantity: "Quantity",
      addToCart: "Add to Cart",
      addedToCart: "Added to cart successfully!",
      continueBtn: "Continue",
      warningTitle: "Warning",
      favoriteError: "Error adding product to favorites.",
      favoriteAdded: "Product added to favorites successfully!",
      favoriteFailed: "Failed to add product to favorites.",
      favoriteErrorOccured: "An unexpected error occurred.",
      addToFavoritesAria: "Add to favorites",
      noOptions: "No options available.",
    },
  };

  const t = translations[locale] || translations.en;
  const mainProduct = product;

  const subCategoryName =
    locale === "ar"
      ? mainProduct.subCategory?.name_ar
      : mainProduct.subCategory?.name;
  const brandName =
    locale === "ar" ? mainProduct.brand?.name_ar : mainProduct.brand?.name;

  // ⭐️ 3. تجميع التنويعات للعرض (يبقى كما هو)
  const groupedVariations = (mainProduct.variations || []).reduce((acc, variation) => {
    const type = variation.variation_type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(variation);
    return acc;
  }, {});
  // { Color: [...], Size: [...] }

  // ⭐️ 4. تعديل المنطق ليعتمد فقط على `selectedVariation` (الذي يأتي كـ prop)
  const activeVariation = selectedVariation; // أصبح المصدر المباشر

  const activePrice = activeVariation?.price || mainProduct.price;
  const activePriceAfterDiscount =
    activeVariation?.price_after_discount || mainProduct.price_after_discount;

  const activeName = activeVariation
    ? locale === "ar"
      ? `${mainProduct.name_ar} - ${activeVariation.variation_value}`
      : `${mainProduct.name} - ${activeVariation.variation_value}`
    : locale === "ar"
    ? mainProduct.name_ar
    : mainProduct.name;

  const activeCode = activeVariation?.code || mainProduct.code;

  // ⭐️ 5. تبسيط دالة تحديث الخيار
  const handleOptionSelect = (variation) => {
    // نقوم فقط بتحديث الحالة في المكون الأب (page.js)
    // وهذا سيؤدي لتحديث الصورة وتحديث `selectedVariation` هنا
    setSelectedVariation(variation);
  };

  // ⭐️ 6. تحديث دالة إضافة السلة
  const _performAddToCart = () => {
    addCart({
      productId: mainProduct.id,
      quantity: quantity,
      // نرسل قيمة التنويع المختار (أو "default" إذا لم يختر شيء)
      size: selectedVariation?.variation_value || "default",
      // ❗️ تأكد أن سلة المشتريات تتوقع `size` وليس `options`
    });
    Swal.fire({
      title: t.addedToCart,
      icon: "success",
      confirmButtonText: t.continueBtn,
      confirmButtonColor: "#FF671F",
      timer: 2000,
      timerProgressBar: true,
    });
  };

  // ... (بقية الدوال المساعدة تبقى كما هي)
  const _performAddToFavorites = async () => {
    const currentUserInfo = storageService.getUserInfo();
    const userId = currentUserInfo?.user?.id;
    if (!userId) {
      Swal.fire(t.warningTitle, t.favoriteError, "error");
      return;
    }
    try {
      const response = await BackendConnector.addToFavorites({
        product_id: mainProduct.id,
        user_id: userId,
      });
      Swal.fire(
        t.warningTitle,
        response?.message ||
          (response?.favorite ? t.favoriteAdded : t.favoriteFailed),
        response?.favorite ? "success" : "error"
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || t.favoriteErrorOccured;
      Swal.fire(t.warningTitle, errorMessage, "error");
    }
  };
  const handleAuthRequired = (action) => {
    setPendingAction(() => action);
    setIsAuthModalOpen(true);
  };
  const handleAddToCart = () => {
    if (!userInfo?.accessToken) {
      handleAuthRequired(_performAddToCart);
    } else {
      _performAddToCart();
    }
  };
  const addToFavorites = () => {
    if (!userInfo?.accessToken) {
      handleAuthRequired(_performAddToFavorites);
    } else {
      _performAddToFavorites();
    }
  };
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setUserInfo(storageService.getUserInfo());
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };


  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
        }}
        onAuthSuccess={handleAuthSuccess}
      />

      <div className="flex flex-col space-y-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-3 text-sm font-semibold">
            {subCategoryName && (
              <Link
                href={`/${locale}/subcategory/${mainProduct.subCategory?.id}`}
                className="text-orange-600 hover:underline"
              >
                {subCategoryName}
              </Link>
            )}
            {subCategoryName && brandName && (
              <span className="text-gray-300">|</span>
            )}
            {brandName && (
              <Link
                href={`/${locale}/products?brand=${mainProduct.brand?.id}`}
                className="text-gray-500 hover:underline"
              >
                {brandName}
              </Link>
            )}
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight flex items-center gap-3">
            <span>{activeName}</span>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {activeCode}
            </span>
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            {locale === "ar"
              ? product.small_description_ar
              : product.small_description}
          </p>
        </div>

        <p className="text-3xl font-bold text-gray-800">
          {activePriceAfterDiscount > 0 &&
          activePriceAfterDiscount < activePrice ? (
            <>
              <span className="text-xl font-semibold text-[#FF671F] me-3">
                {formatPrice(activePriceAfterDiscount)}
              </span>
              <span className="text-lg text-gray-400 line-through font-medium">
                {formatPrice(activePrice)}
              </span>
            </>
          ) : (
            formatPrice(activePrice)
          )}
        </p>

        {/* ================================================ */}
        {/* ⭐️ قسم التنويعات (Variations) المُجمَّع ⭐️ */}
        {/* ================================================ */}
        <div className="flex flex-col gap-5">
          {Object.keys(groupedVariations).length > 0 ? (
            Object.entries(groupedVariations).map(([type, variations]) => (
              <div key={type}>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  {t[type] || type}:
                </h3>
                <div className="flex flex-wrap gap-3">
                  {variations.map((variation) => {
                    // ⭐️ 7. المقارنة تتم الآن مقابل `selectedVariation` مباشرة
                    const isCurrent = selectedVariation?.id === variation.id;

                    return (
                      <button
                        key={variation.id}
                        // ⭐️ 8. تمرير كائن "variation" الكامل للدالة
                        onClick={() => handleOptionSelect(variation)}
                        type="button"
                        className={`border rounded-lg py-2 px-4 cursor-pointer transition-all duration-200 text-sm font-medium
                          ${
                            isCurrent
                              ? "ring-2 ring-offset-1 border-[#FF671F] ring-[#FF671F] bg-[#FFF1E6] text-[#FF671F]"
                              : "border-gray-300 hover:border-gray-500 bg-white text-gray-700"
                          }`}
                      >
                        <span>
                          {variation.variation_value}
                        </span>
                        
                        {variation.price && (
                          <span className="text-xs text-gray-600 block mt-1 text-center">
                            {formatPrice(variation.price)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p>{t.noOptions}</p>
          )}
        </div>
        {/* ================================================ */}
        {/* ⭐️ نهاية قسم التنويعات (Variations) ⭐️ */}
        {/* ================================================ */}

        <div className="flex items-center gap-8">
          <div>
            <label className="font-semibold text-gray-800 mb-2 block text-sm">
              {t.quantity}
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-3 text-gray-500 hover:bg-gray-100 transition rounded-l-lg"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                readOnly
                className="w-14 text-center font-bold border-l border-r border-gray-300 focus:outline-none py-2"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-3 text-gray-500 hover:bg-gray-100 transition rounded-r-lg"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-[#FF671F] to-[#FF671F] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {t.addToCart}
          </button>
          <button
            onClick={addToFavorites}
            className="w-full sm:w-auto bg-white border-2 border-gray-300 py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:border-[#FF671F] hover:text-[#FF671F] hover:bg-[#FFF1E6] flex items-center justify-center gap-2 text-gray-700"
            aria-label={t.addToFavoritesAria}
          >
            <Heart size={20} />
          </button>
        </div>
      </div>
    </>
  );
}