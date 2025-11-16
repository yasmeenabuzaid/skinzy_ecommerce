import { useQuery } from "@tanstack/react-query";
import BackendConnector from "../services/connectors/BackendConnector";

// 🔽 *** تم إضافة "page" هنا *** 🔽
const useProductsByBrandQuery = ({ brandId, brandSlug, filter, page }) => {
  const {
    data: paginatedData, // 🔽 غيرنا الاسم لـ paginatedData
    isLoading,
    error,
  } = useQuery({
    // 🔽 *** تم إضافة "page" للـ queryKey *** 🔽
    queryKey: ["productsByBrand", { brandId, brandSlug, filter, page }],
    queryFn: () =>
      BackendConnector.fetchProductsByBrand({
        brandId,
        brandSlug,
        filter,
        page, // 🔽 *** تم تمرير "page" للـ API *** 🔽
      }),
    enabled: !!(brandId || brandSlug),
    
    // 🔽 *** تم حذف "select" *** 🔽
    //  عشان يرجّع الأوبجكت كامل من الـ API
    //  select: (result) => result?.data || [],  <-- هذا السطر انحذف
  });

  // 🔽 *** جهزنا الداتا والـ paginationInfo بمتغيرات منفصلة *** 🔽
  const products = paginatedData?.data || [];
  const paginationInfo = {
    currentPage: paginatedData?.current_page || 1,
    lastPage: paginatedData?.last_page || 1,
    total: paginatedData?.total || 0,
    links: paginatedData?.links || [],
  };

  // 🔽 *** رجعنا المنتجات ومعلومات الـ pagination *** 🔽
  return { products, paginationInfo, isLoading, error };
};

export default useProductsByBrandQuery;