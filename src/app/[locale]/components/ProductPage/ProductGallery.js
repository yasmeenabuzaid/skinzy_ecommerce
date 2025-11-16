"use client";
import { useEffect } from "react";

export default function ProductGallery({ mainImage, thumbnails, setMainImage }) {
  // يتم تعيين الصورة الرئيسية الآن من المكون الأب (ProductPage)
  useEffect(() => {
    if (!mainImage && thumbnails.length > 0) {
      setMainImage(thumbnails[0]);
    }
  }, [thumbnails, mainImage, setMainImage]);

  return (
    <div className="flex flex-col gap-4">
      {/* 1. حاوية الصورة الرئيسية */}
      <div className="relative w-full aspect-square border rounded-lg bg-white shadow-sm overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt="Main product"
            className="w-full h-full object-contain p-2"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* 2. حاوية الصور المصغرة (شريط أفقي قابل للتمرير) */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {thumbnails.length > 0 ? (
          thumbnails.map((thumb, index) => (
            <div
              key={index}
              onClick={() => setMainImage(thumb)}
              className={`
                flex-shrink-0  /* يمنع الصور من الانكماش */
                w-24 h-24      /* حجم ثابت وموحد */
                border rounded-lg overflow-hidden cursor-pointer 
                ${
                  mainImage === thumb
                    ? "border-2 border-[#FF671F]"
                    : "border-gray-200"
                }
              `}
            >
              <img
                src={thumb}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))
        ) : (
          <div className="w-full text-center text-gray-400 py-10">
            No Images Available
          </div>
        )}
      </div>
    </div>
  );
}