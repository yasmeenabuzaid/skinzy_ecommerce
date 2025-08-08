"use client";
import { useCartContext } from "@/context/CartContext";
import { Star, Heart, Minus, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";
import storageService from "@/services/storage/storageService";
import BackendConnector from "@/services/connectors/BackendConnector";

const formatPrice = (price) =>
  typeof price === "number" ? `$${price.toFixed(2)}` : "السعر غير متوفر";

export default function ProductDetails({
  product,
  activeSize,
  setActiveSize,
  quantity,
  handleQuantityChange,
}) {
  const { addCart } = useCartContext();
  const router = useRouter();
  const { locale } = useParams();

  // ترجمات حسب اللغة
  const translations = {
    ar: {
      chooseVariant: "اختر الإصدار:",
      quantity: "الكمية",
      addToCart: "أضف إلى السلة",
      addToFavoritesAria: "أضف إلى المفضلة",
      alertSelectSize: "يرجى اختيار المقاس أو الإصدار قبل الإضافة إلى السلة",
      alertQuantityOne: "الكمية يجب أن تكون على الأقل 1",
      addedToCart: "تمت إضافة المنتج إلى السلة بنجاح",
      warningTitle: "تنبيه",
      continueBtn: "متابعة",
      favoriteError: "يجب تسجيل الدخول لإضافة للمفضلة",
      favoriteAdded: "تمت إضافة المنتج إلى المفضلة",
      favoriteFailed: "فشل في الإضافة",
      favoriteErrorOccured: "حدث خطأ أثناء الإضافة",
      okBtn: "حسنًا",
      noOptions: "لا توجد خيارات متاحة",
    },
    en: {
      chooseVariant: "Choose Variant:",
      quantity: "Quantity",
      addToCart: "Add to Cart",
      addToFavoritesAria: "Add to Favorites",
      alertSelectSize: "Please select size or variant before adding to cart",
      alertQuantityOne: "Quantity must be at least 1",
      addedToCart: "Product successfully added to cart",
      warningTitle: "Warning",
      continueBtn: "Continue",
      favoriteError: "You must be logged in to add to favorites",
      favoriteAdded: "Product added to favorites",
      favoriteFailed: "Failed to add",
      favoriteErrorOccured: "An error occurred while adding",
      okBtn: "OK",
      noOptions: "No options available",
    },
  };

  const t = translations[locale] || translations.en;

  const isVariation = product.type === "variation";
  const mainProduct = isVariation ? product.parent_product : product;

  const handleAddToCart = () => {
    if (!activeSize) {
      Swal.fire({
        title: t.warningTitle,
        text: t.alertSelectSize,
        icon: "warning",
        confirmButtonText: t.okBtn,
      });
      return;
    }
    if (quantity < 1) {
      Swal.fire({
        title: t.warningTitle,
        text: t.alertQuantityOne,
        icon: "warning",
        confirmButtonText: t.okBtn,
      });
      return;
    }
    addCart({ productId: product.id, quantity, size: activeSize });
    Swal.fire({
      title: t.addedToCart,
      icon: "success",
      confirmButtonText: t.continueBtn,
    });
  };

const addToFavorites = async () => {
  const userInfo = storageService.getUserInfo();
  if (!userInfo?.accessToken) {
    Swal.fire(t.warningTitle, t.favoriteError, "error");
    return;
  }
  try {
    const response = await BackendConnector.addToFavorites({
      product_id: product.id,
      user_id: userInfo.id,
    });

    // إذا فيه favorite في الرد، نعتبرها ناجحة
    if (response?.favorite) {
      Swal.fire(t.warningTitle, response.message || t.favoriteAdded, "success");
    } else {
      Swal.fire(t.warningTitle, response?.message || t.favoriteFailed, "error");
    }
  } catch (error) {
    console.error("Add to favorites error:", error);
    Swal.fire(t.warningTitle, t.favoriteErrorOccured, "error");
  }
};


  const variationOptions = isVariation
    ? [mainProduct, ...(mainProduct.variations || [])]
    : [product, ...(product.variations || [])];

  const sizeOptions = variationOptions.map((v) => ({
    id: v.id,
    name: v.name,
    price: v.price,
    image: v.images?.[0]?.image,
  }));

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
          {mainProduct.name}
        </h1>
        <p className="mt-2 text-lg text-gray-500">{mainProduct.small_description}</p>
      </div>

  <p className="text-3xl font-bold text-gray-800">
  {product.price_after_discount ? (
    <>
      <span className="text-xl font-semibold text-red-600 mr-3">
        {formatPrice(product.price_after_discount)}
      </span>
      <span className="text-lg text-gray-400 line-through font-medium">
        {formatPrice(product.price)}
      </span>
    </>
  ) : (
    formatPrice(product.price)
  )}

  {mainProduct.originalPrice && !product.priceAfterDiscount && (
    <span className="text-lg text-gray-400 line-through ml-3 font-medium">
      {formatPrice(mainProduct.originalPrice)}
    </span>
  )}
</p>


      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">{t.chooseVariant}</h3>
        <div className="flex flex-wrap gap-3">
          {sizeOptions.length > 0 ? (
            sizeOptions.map((option) => {
              const isCurrent = product.id === option.id;
              const isActive = activeSize === option.name;

              return (
                <div
                  key={option.id}
                  onClick={() => {
                    if (!isCurrent) {
                      router.push(`/${locale}/products/${option.id}`);
                    }
                    setActiveSize(option.name);
                  }}
                  className={`border rounded-lg p-2 cursor-pointer transition-all duration-200 flex items-center gap-3 w-full sm:w-auto ${
                    isActive
                      ? "ring-2 ring-offset-1 border-[#FF671F] ring-[#FF671F]"
                      : "border-gray-300 hover:border-[#FF671F]"
                  }`}
                >
                  {option.image ? (
                    <img
                      src={option.image}
                      alt={option.name}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 rounded-md"></div>
                  )}
                  <div>
                    <span className="font-semibold text-gray-800 text-sm block">{option.name}</span>
                    <span className="text-xs text-gray-600 mt-1">{formatPrice(option.price)}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p>{t.noOptions}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div>
          <label className="font-semibold text-gray-800 mb-2 block text-sm">{t.quantity}</label>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-3 text-gray-500 hover:bg-gray-100 transition rounded-l-lg"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>

            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                const val = Math.max(1, Number(e.target.value));
                handleQuantityChange(val - quantity);
              }}
              className="w-14 text-center font-bold border-l border-r border-gray-300 focus:outline-none py-2"
            />

            <button
              onClick={() => handleQuantityChange(1)}
              className="p-3 text-gray-500 hover:bg-gray-100 transition rounded-r-lg"
              aria-label="Increase quantity"
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
  );
}
