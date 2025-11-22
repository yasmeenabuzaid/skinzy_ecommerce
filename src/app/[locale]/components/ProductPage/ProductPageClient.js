'use client';

import React, { useState, useEffect } from "react";
import Breadcrumbs from "./Breadcrumbs"; // تأكد من المسار
import ProductGallery from "./ProductGallery"; // تأكد من المسار
import ProductDetails from "./ProductDetails"; // تأكد من المسار
import ProductDescriptionSection from "./ProductDescriptionSection"; // تأكد من المسار
import ScrollToTopButton from "../ui/ScrollToTopButton"; // تأكد من المسار
import ProductSection from '..//sections/ProductSection';
import { useLocale, useTranslations } from "next-intl";
export default function ProductPageClient({ product , products}) {
  const [mainImage, setMainImage] = useState("");
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
const t = useTranslations('ProductPage');
  const locale = useLocale();
  const isArabic = locale === "ar";

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

  // 1. تعيين الحالة الافتراضية عند تحميل المنتج
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

  // 2. مراقبة تغيير التنويع
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

  // تجهيز البيانات المترجمة
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

            <ProductDetails
              product={translatedProduct}
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
         <ProductSection
                  title={t('gridExampleTitle')}    // "Grid Section Example"
                  subtitle={t('gridExampleSubtitle')} // "Another Grid"
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