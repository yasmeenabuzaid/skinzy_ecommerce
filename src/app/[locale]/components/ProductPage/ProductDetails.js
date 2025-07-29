"use client";
import { useCartContext } from "@/context/CartContext";
import { Star, Heart, Repeat2 } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";

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

  const isVariation = product.type === "variation";
  const mainProduct = isVariation ? product.parent_product : product;

  const handleAddToCart = () => {
    if (!activeSize) {
      Swal.fire({
        title: "تنبيه",
        text: "يرجى اختيار المقاس أو الإصدار قبل الإضافة إلى السلة",
        icon: "warning",
        confirmButtonText: "حسنًا",
      });
      return;
    }

    if (quantity < 1) {
      Swal.fire({
        title: "تنبيه",
        text: "الكمية يجب أن تكون على الأقل 1",
        icon: "warning",
        confirmButtonText: "حسنًا",
      });
      return;
    }

    addCart({
      productId: product.id,
      quantity,
      size: activeSize,
    });

    Swal.fire({
      title: "تمت الإضافة",
      text: "تمت إضافة المنتج إلى السلة بنجاح",
      icon: "success",
      confirmButtonText: "متابعة",
    });
  };

  const variationOptions = isVariation
    ? [mainProduct, ...(mainProduct.variations || [])]
    : [product, ...(product.variations || [])];

  const sizeOptions = variationOptions.map((v) => ({
    id: v.id,
    name: v.name + (v.id === mainProduct.id ? " (الأساسي)" : ""),
    price: v.price,
    image: v.images?.[0]?.image,
    isMain: v.id === mainProduct.id,
  }));

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{mainProduct.name}</h1>

      <div className="flex items-center mb-4">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              fill={i < mainProduct.rating ? "currentColor" : "none"}
              stroke={i < mainProduct.rating ? "currentColor" : "#d1d5db"}
            />
          ))}
        </div>
        <span className="text-gray-500 text-sm mr-2">({mainProduct.reviews || 0})</span>
      </div>

      <p className="text-2xl font-semibold text-gray-800 mb-6">
        {formatPrice(mainProduct.price)}
        {mainProduct.originalPrice && (
          <span className="text-sm text-gray-400 line-through ml-3">
            {formatPrice(mainProduct.originalPrice)}
          </span>
        )}
      </p>

      {/* خيارات الحجم / الإصدار */}
      <div className="flex flex-wrap gap-4 mb-6">
        {sizeOptions.length > 0 ? (
          sizeOptions.map((option) => {
            const isCurrent = product.id === option.id;

            return (
              <div
                key={option.id}
                onClick={() => {
                  if (!isCurrent) {
                    router.push(`/${locale}/products/${option.id}`);
                  } else {
                    setActiveSize(option.name);
                  }
                }}
                className={`border rounded-md p-3 cursor-pointer hover:border-gray-900 transition flex flex-col items-center text-center
                  ${isCurrent ? "border-gray-900 bg-gray-100" : "border-gray-300"}
                `}
              >
                {option.image ? (
                  <img
                    src={option.image}
                    alt={option.name}
                    className="w-20 h-20 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded mb-2 text-gray-500 text-xs">
                    لا توجد صورة
                  </div>
                )}
                <span className="font-medium">{option.name}</span>
                <span className="text-sm text-gray-600 mt-1">
                  {formatPrice(option.price)}
                </span>
              </div>
            );
          })
        ) : (
          <p>لا توجد خيارات متاحة</p>
        )}
      </div>

      {/* التحكم في الكمية */}
      <div className="mb-6 w-32">
        <label className="font-semibold text-gray-700 mb-2 block">الكمية</label>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => {
              const val = Math.max(1, Number(e.target.value));
              handleQuantityChange(val - quantity);
            }}
            className="w-full text-center border-l border-r border-gray-300 focus:outline-none"
          />
          <button
            onClick={() => handleQuantityChange(1)}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={handleAddToCart}
          className="bg-red-600 text-white w-full py-3 rounded-md font-semibold transition hover:bg-red-700"
        >
          أضف إلى السلة
        </button>
        <button className="bg-black text-white w-full py-3 rounded-md font-semibold hover:bg-gray-900 transition">
          اشترِ الآن
        </button>
      </div>

      <div className="flex gap-6 text-gray-600 text-sm">
        <button className="flex items-center gap-2 hover:text-red-600 transition">
          <Heart size={20} /> أضف إلى المفضلة
        </button>
        <button className="flex items-center gap-2 hover:text-gray-900 transition">
          <Repeat2 size={20} /> أضف للمقارنة
        </button>
      </div>

      <div className="mt-8 space-y-2 text-gray-700 text-sm">
        {mainProduct.details?.brand && <DetailItem label="الماركة" value={mainProduct.details.brand} />}
        {mainProduct.details?.shade && <DetailItem label="الظل" value={mainProduct.details.shade} />}
        {mainProduct.details?.finish && <DetailItem label="التشطيب" value={mainProduct.details.finish} />}
        {mainProduct.details?.skin_type && <DetailItem label="نوع البشرة" value={mainProduct.details.skin_type} />}
        {mainProduct.details?.ingredients && <DetailItem label="المكونات" value={mainProduct.details.ingredients} />}
        {mainProduct.details?.expiration_date && <DetailItem label="تاريخ الانتهاء" value={mainProduct.details.expiration_date} />}
        {mainProduct.details?.volume && <DetailItem label="الحجم" value={mainProduct.details.volume} />}
        {mainProduct.details?.usage_instructions && <DetailItem label="تعليمات الاستخدام" value={mainProduct.details.usage_instructions} />}
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <p>
      <span className="font-semibold">{label}:</span> {value}
    </p>
  );
}
