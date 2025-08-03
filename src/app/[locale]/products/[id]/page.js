"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  console.log("single product", product);
  
  const handleCartToggle = () => setIsCartOpen(!isCartOpen);
  const handleMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => {
      const newQty = Math.max(1, prev + amount);
      return newQty;
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
      const fallbackImage = product.images?.[0]?.image || "";
      setMainImage(fallbackImage);
      setActiveSize(product.sizes?.[0] || "100g");
      setQuantity(1);
    }
  }, [product]);

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="text-gray-800">
      <Header onCartToggle={handleCartToggle} onMenuToggle={handleMenuToggle} />

      <div className="bg-white text-gray-800 font-sans">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs />

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ProductGallery
              mainImage={mainImage}
              thumbnails={product.images?.map(img => img.image) || []}
              setMainImage={setMainImage}
            />

            <ProductDetails
              product={product}
              activeSize={activeSize}
              setActiveSize={setActiveSize}
              quantity={quantity}
              handleQuantityChange={handleQuantityChange}
            />
          </main>
        </div>

        <ProductDescriptionSection 
          description={product.description} 
          specifications={product.specifications} 
        />

        <RelatedProductsSection products={product.related || []} />
        <ScrollToTopButton show={showScrollBtn} onClick={scrollToTop} />
      </div>

      <Footer />
    </div>
  );
}
