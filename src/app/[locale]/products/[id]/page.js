"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import useProductQuery from "@/hooks/useProductQuery";
import Breadcrumbs from "../../components/ProductPage/Breadcrumbs";
import ProductGallery from "../../components/ProductPage/ProductGallery";
import ProductDetails from "../../components/ProductPage/ProductDetails";
import ProductDescriptionSection from "../../components/ProductPage/ProductDescriptionSection";
import RelatedProductsSection from "../../components/ProductPage/RelatedProductsSection";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";

export default function ProductPage() {
  const { id } = useParams();
  const { product, isLoading, error } = useProductQuery(id);
  const [mainImage, setMainImage] = useState("");
  const [activeSize, setActiveSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const locale = useLocale();
  const isArabic = locale === "ar";

  const handleCartToggle = () => setIsCartOpen(!isCartOpen);
  const handleMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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

  // ✅ This is the corrected useEffect hook
  useEffect(() => {
    if (product) {
      const fallbackImage = product.images?.[0]?.image || "";
      setMainImage(fallbackImage);
      setActiveSize(product.sizes?.[0] || "100g");
      // The line that reset the quantity has been removed.
    }
  }, [product]);

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error.message || "An error occurred"}</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

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
    <div className="text-gray-800 ">
      <Header onCartToggle={handleCartToggle} onMenuToggle={handleMenuToggle} />

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
              activeSize={activeSize}
              setActiveSize={setActiveSize}
              quantity={quantity}
              handleQuantityChange={handleQuantityChange}
            />
          </main>
        </div>

        <ProductDescriptionSection
          description={isArabic ? product.description_ar : product.description}
          specifications={translatedSpecifications}
        />

        <RelatedProductsSection products={product.related || []} />
        <ScrollToTopButton show={showScrollBtn} onClick={scrollToTop} />
      </div>

      <Footer />
    </div>
  );
}
