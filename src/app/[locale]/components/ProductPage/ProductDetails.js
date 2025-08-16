"use client";
import { useCartContext } from "@/context/CartContext";
import { Heart, Minus, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import storageService from "@/services/storage/storageService";
import BackendConnector from "@/services/connectors/BackendConnector";
import AuthModal from "../../components/auth/AuthModal";
import Link from "next/link";

const formatPrice = (price) =>
  typeof price === "number" ? `${price.toFixed(2)} JOD` : "السعر غير متوفر";

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

  const [userInfo, setUserInfo] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    setUserInfo(storageService.getUserInfo());
  }, []);

  const translations = {
    ar: {
      chooseVariant: "اختر الإصدار:",
      quantity: "الكمية",
      addToCart: "أضف إلى السلة",
      // ... ( باقي الترجمات )
    },
    en: {
      chooseVariant: "Choose Variant:",
      quantity: "Quantity",
      addToCart: "Add to Cart",
      // ... ( باقي الترجمات )
    },
  };

  const t = translations[locale] || translations.en;

  const isVariation = product.type === "variation";
  const mainProduct = isVariation ? product.parent_product : product;
  
  const subCategoryName = locale === 'ar' ? mainProduct.sub_category?.name_ar : mainProduct.sub_category?.name;
  const brandName = locale === 'ar' ? mainProduct.brand?.name_ar : mainProduct.brand?.name;

  const variationOptions = isVariation
    ? [mainProduct, ...(mainProduct.variations || [])]
    : [product, ...(product.variations || [])];

  const sizeOptions = variationOptions.map((v) => ({
    id: v.id,
    name: v.name,
    price: v.price,
    image: v.images?.[0]?.image,
  }));

  const _performAddToCart = () => {
    // ... (logic)
  };

  const _performAddToFavorites = async () => {
    // ... (logic)
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

      {/* ✨ --- START: The Fix --- ✨ */}
      {/* By adding `relative` and `z-10`, we lift this entire component above other elements on the page, */}
      {/* ensuring that the buttons are always clickable, especially on mobile. */}
      <div className="flex flex-col space-y-6 relative z-10">
      {/* ✨ --- END: The Fix --- ✨ */}
        
        <div>
          <div className="flex items-center gap-3 mb-3 text-sm font-semibold">
            {/* ✨ قمت بإعادة الروابط هنا لتحسين تجربة المستخدم */}
            {subCategoryName && (
              <Link href={`/${locale}/subcategory/${mainProduct.sub_category?.id}`} className="text-orange-600 hover:underline">
                {subCategoryName}
              </Link>
            )}
            {subCategoryName && brandName && <span className="text-gray-300">|</span>}
            {brandName && (
              <Link href={`/${locale}/products?brand=${mainProduct.brand?.id}`} className="text-gray-500 hover:underline">
                {brandName}
              </Link>
            )}
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight flex items-center gap-3">
            <span>{locale === 'ar' ? mainProduct.name_ar : mainProduct.name}</span>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {mainProduct.code}
            </span>
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            {locale === 'ar' ? mainProduct.small_description_ar : mainProduct.small_description}
          </p>
        </div>

        <p className="text-3xl font-bold text-gray-800">
          {product.price_after_discount && product.price_after_discount < product.price ? (
            <>
              <span className="text-xl font-semibold text-[#FF671F] me-3">
                {formatPrice(product.price_after_discount)}
              </span>
              <span className="text-lg text-gray-400 line-through font-medium">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            formatPrice(product.price)
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
                  <div key={option.id} onClick={() => { if (!isCurrent) { router.push(`/${locale}/products/${option.id}`); } setActiveSize(option.name); }} className={`border rounded-lg p-2 cursor-pointer transition-all duration-200 flex items-center gap-3 w-full sm:w-auto ${isActive ? "ring-2 ring-offset-1 border-[#FF671F] ring-[#FF671F]" : "border-gray-300 hover:border-[#FF671F]"}`}>
                    {option.image ? (<img src={option.image} alt={option.name} className="w-14 h-14 object-cover rounded-md"/>) : (<div className="w-14 h-14 bg-gray-100 rounded-md"></div>)}
                    <div>
                      <span className="font-semibold text-gray-800 text-sm block">{option.name}</span>
                      <span className="text-xs text-gray-600 mt-1">{formatPrice(option.price)}</span>
                    </div>
                  </div>
                );
              })
            ) : ( <p>{t.noOptions}</p> )}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div>
            <label className="font-semibold text-gray-800 mb-2 block text-sm">{t.quantity}</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => handleQuantityChange(-1)} className="p-3 text-gray-500 hover:bg-gray-100 transition rounded-l-lg"><Minus size={16} /></button>
              <input type="number" min={1} value={quantity} onChange={(e) => { const val = Math.max(1, Number(e.target.value)); handleQuantityChange(val - quantity); }} className="w-14 text-center font-bold border-l border-r border-gray-300 focus:outline-none py-2" />
              <button onClick={() => handleQuantityChange(1)} className="p-3 text-gray-500 hover:bg-gray-100 transition rounded-r-lg"><Plus size={16} /></button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
          <button onClick={handleAddToCart} className="w-full bg-gradient-to-r from-[#FF671F] to-[#FF671F] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">{t.addToCart}</button>
          <button onClick={addToFavorites} className="w-full sm:w-auto bg-white border-2 border-gray-300 py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:border-[#FF671F] hover:text-[#FF671F] hover:bg-[#FFF1E6] flex items-center justify-center gap-2 text-gray-700" aria-label={t.addToFavoritesAria}><Heart size={20} /></button>
        </div>

      </div>
    </>
  );
}