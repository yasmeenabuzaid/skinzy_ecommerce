"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import useProductQuery from "@/hooks/useProductQuery";
import Breadcrumbs from "../../components/ProductPage/Breadcrumbs";
import ProductGallery from "../../components/ProductPage/ProductGallery";
import ProductDetails from "../../components/ProductPage/ProductDetails";
import ProductDescriptionSection from "../../components/ProductPage/ProductDescriptionSection";
// import RelatedProductsSection from "../../components/ProductPage/RelatedProductsSection";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";
import AllProductSliderSection from '../../components/sections/allProductSliderSection';

export default function ProductPage() {
  const { id } = useParams();
  const { product, error } = useProductQuery(id);
  const [mainImage, setMainImage] = useState("");
  
  // ⭐️ 1. استخدام selectedVariation لإدارة التنويعات
  const [selectedVariation, setSelectedVariation] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const locale = useLocale();
  const isArabic = locale === "ar";
  console.log("Product data:", product);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleScroll = () => {
    setShowScrollBtn(window.scrollY > 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ⭐️ 2. تعديل الـ useEffect الرئيسي لتعيين الحالة الافتراضية
  useEffect(() => {
    if (product) {
      // 2أ. تعيين التنويع الافتراضي (الأول في القائمة أو null)
      const defaultVariation = product.variations?.[0] || null;
      setSelectedVariation(defaultVariation);
      
      // 2ب. تعيين الصورة الرئيسية
      // نبحث عن صورة مرتبطة بالتنويع الافتراضي أولاً
      const variationImage = product.images?.find(
        (img) => img.variation_id === defaultVariation?.id
      )?.image;
      
      // إذا لم نجد، نستخدم أول صورة في المنتج كصورة احتياطية
      const fallbackImage = product.images?.[0]?.image || "";

      setMainImage(variationImage || fallbackImage);
    }
  }, [product]); // يعمل فقط عند تحميل بيانات المنتج

  // ⭐️ 3. (إضافة جديدة) useEffect لمراقبة اختيار المستخدم للتنويع
  useEffect(() => {
    if (selectedVariation) {
      // ابحث عن صورة مرتبطة بـ variation_id للتنويع المختار
      const newVariationImage = product.images?.find(
        (img) => img.variation_id === selectedVariation.id
      )?.image;

      // إذا وجدنا صورة مخصصة لهذا التنويع، قم بتعيينها كصورة رئيسية
      if (newVariationImage) {
        setMainImage(newVariationImage);
      }
    }
  }, [selectedVariation, product?.images]); // يعمل عند تغيير selectedVariation


  if (error) return <div className="text-center text-red-500 py-20">{error.message || "An error occurred"}</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  // ⭐️ 4. تمرير بيانات المنتج الأصلية (التي تحتوي على images) إلى ProductDetails
  // مع الحفاظ على الأسماء المترجمة
  const translatedProduct = {
    ...product, // <-- هذا يضمن بقاء مصفوفة images الأصلية
    name: isArabic ? product.name_ar : product.name,
    small_description: isArabic ? product.small_description_ar : product.small_description,
  };

  const translatedSpecifications = product.specifications?.map((spec) => ({
    ...spec,
    key: isArabic ? spec.key_ar : spec.key,
    value: isArabic ? spec.value_ar : spec.value,
  })) || [];

  return (
    <div className="text-gray-800 ">
      <div className="bg-white text-gray-800 font-sans mr-10 ml-10">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs />

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ProductGallery
              mainImage={mainImage}
              thumbnails={product.images?.map((img) => img.image) || []}
              setMainImage={setMainImage}
            />

            {/* ⭐️ 5. تمرير الـ props الصحيحة لـ ProductDetails */}
            <ProductDetails
              product={translatedProduct} // يحتوي على .images
              selectedVariation={selectedVariation}
              setSelectedVariation={setSelectedVariation}
              quantity={quantity}
              handleQuantityChange={handleQuantityChange}
            />
          </main>
        </div>

        <ProductDescriptionSection
          description={isArabic ? product.description_ar : product.description}
          specifications={translatedSpecifications}
        />

        <ScrollToTopButton show={showScrollBtn} onClick={scrollToTop} />
      </div>
    </div>
  );
}