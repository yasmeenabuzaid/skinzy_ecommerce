"use client";
import { useEffect } from "react";

export default function ProductGallery({ mainImage, thumbnails, setMainImage }) {
  useEffect(() => {
    if (!mainImage && thumbnails.length > 0) {
      setMainImage(thumbnails[0]);
    }
  }, [thumbnails, mainImage, setMainImage]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-square border rounded-lg bg-white shadow-sm overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt="Main product"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {thumbnails.length > 0 ? (
          thumbnails.map((thumb, index) => (
            <div
              key={index}
              onClick={() => setMainImage(thumb)}
              className={`aspect-square border rounded-lg overflow-hidden cursor-pointer ${
                mainImage === thumb ? "border-2 border-black" : ""
              }`}
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
          <div className="col-span-4 text-center text-gray-400 py-10">
            No Images Available
          </div>
        )}
      </div>
    </div>
  );
}
