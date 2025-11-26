'use client';

import React, { useState, useEffect } from "react";
import Breadcrumbs from "./Breadcrumbs"; 
import ProductGallery from "./ProductGallery"; 
import ProductDetails from "./ProductDetails"; 
import ProductDescriptionSection from "./ProductDescriptionSection"; 
import ScrollToTopButton from "../ui/ScrollToTopButton"; 
import ProductSection from '../sections/ProductSection';
import { useLocale, useTranslations } from "next-intl";

// 🟢 استيراد الكونتكس (تأكد من صحة المسار حسب مشروعك)
// قد يكون المسار مثلاً: "@/context/CartContext" أو نفس الملف إذا كانوا بنفس المجلد
import { useCartContext } from "../../../../context/CartContext"; 

export default function ProductPageClient({ product , products}) {
  const [mainImage, setMainImage] = useState("");
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  
  const t = useTranslations('ProductPage');
  const locale = useLocale();
  const isArabic = locale === "ar";

  // 🟢 تفعيل الكونتكس
  const { addCart } = useCartContext();

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  // 🟢 دالة الإضافة للسلة التي تجمع البيانات وترسلها
  const handleAddToCart = () => {
    if (!product) return;

    // يمكنك إضافة تحقق هنا إذا كان الفاريشن إجباري
    // if (product.variations?.length > 0 && !selectedVariation) {
    //   alert("Please select an option");
    //   return;
    // }

    addCart({
        productId: product.id,
        quantity: quantity,
        variationId: selectedVariation ? selectedVariation.id : null
    });
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

  useEffect(() => {
    if (product) {
      const defaultVariation = product.variations?.[0] || null;
      setSelectedVariation(defaultVariation);
      
      const variationImage = product.images?.find(
        (img) => img.variation_id === defaultVariation?.id
      )?.image;
      
      const fallbackImage = product.images?.[0]?.image || "";
      setMainImage(variationImage || fallbackImage);
    }
  }, [product]);

  useEffect(() => {
    if (selectedVariation) {
      const newVariationImage = product.images?.find(
        (img) => img.variation_id === selectedVariation.id
      )?.image;

      if (newVariationImage) {
        setMainImage(newVariationImage);
      }
    }
  }, [selectedVariation, product]);

  const translatedProduct = {
    ...product,
    name: isArabic ? product.name_ar : product.name,
    small_description: isArabic ? product.small_description_ar : product.small_description,
  };

  const translatedSpecifications = product.specifications?.map((spec) => ({
    ...spec,
    key: isArabic ? spec.key_ar : spec.key,
    value: isArabic ? spec.value_ar : spec.value,
  })) || [];

  return (
    <div className="text-gray-800">
      <div className="bg-white text-gray-800 font-sans mr-10 ml-10">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs />

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ProductGallery
              mainImage={mainImage}
              thumbnails={product.images?.map((img) => img.image) || []}
              setMainImage={setMainImage}
            />

            {/* 🟢 تم تمرير دالة الإضافة onAddToCart هنا */}
            <ProductDetails
              product={translatedProduct}
              selectedVariation={selectedVariation}
              setSelectedVariation={setSelectedVariation}
              quantity={quantity}
              handleQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart} 
            />
          </main>
        </div>

        <ProductDescriptionSection
          description={isArabic ? product.description_ar : product.description}
          specifications={translatedSpecifications}
        />

        <ScrollToTopButton show={showScrollBtn} onClick={scrollToTop} />
         <ProductSection
                  title={t('gridExampleTitle')}   
                  subtitle={t('gridExampleSubtitle')} 
                  products={products}
                  isLoading={false}
                  error={null}
                  layout="grid" 
                  filterType="none" 
                  buttonText={t('viewAll')}
                  buttonLink={`/${locale}/subcategory`}
                />
      </div>
    </div>
  );
}