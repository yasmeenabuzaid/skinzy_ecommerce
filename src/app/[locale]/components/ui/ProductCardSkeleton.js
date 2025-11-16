const ProductCardSkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 w-full">
      <div className="animate-pulse flex flex-col space-y-4">
        {/* مكان الصورة */}
        <div className="rounded bg-gray-200 h-48 w-full"></div>
        <div className="space-y-3">
          {/* مكان اسم المنتج */}
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          {/* مكان السعر */}
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
