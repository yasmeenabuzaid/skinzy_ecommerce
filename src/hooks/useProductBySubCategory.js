import { useQuery } from '@tanstack/react-query';
import BackendConnector from '../services/connectors/BackendConnector';

// 🔽 1. إضافة "page" كمتغير
const useProductBySubCategory = ({ subCategoryId, filter, page }) => {
  // 🔽 2. تغيير اسم "data" إلى "paginatedData" ليكون أوضح
  const { data: paginatedData, isLoading, error } = useQuery({
    // 🔽 3. إضافة "page" للـ queryKey
    queryKey: ['productsBySubCategory', { subCategoryId, filter, page }],
    // 🔽 4. تمرير "page" للـ API
    queryFn: () => BackendConnector.fetchProductsBySubCategory({ subCategoryId, filter, page }),
    enabled: !!subCategoryId,
    // 🔽 5. حذف "select" عشان يرجع كل الأوبجكت
    // select: (result) => result?.data || [], <-- هذا السطر انحذف
  });

  // 🔽 6. تجهيز الداتا للـ Component
  const products = paginatedData?.data || [];
  const paginationInfo = {
    currentPage: paginatedData?.current_page || 1,
    lastPage: paginatedData?.last_page || 1,
    total: paginatedData?.total || 0,
    links: paginatedData?.links || [],
  };

  // 🔽 7. إرجاع المنتجات ومعلومات الـ pagination
  return { products, paginationInfo, isLoading, error };
};

export default useProductBySubCategory;