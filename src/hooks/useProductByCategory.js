import { useQuery } from '@tanstack/react-query';
import BackendConnector from '../services/connectors/BackendConnector';

// 🔽 1. إضافة "page" كمتغير
const useProductsQuery = ({ CategoryId, filter, page }) => {
  const {
    data, // "data" رح يكون هو الـ Paginator Object الكامل
    isLoading,
    error,
  } = useQuery({
    // 🔽 2. إضافة "page" للـ queryKey
    queryKey: ['productsByCategory', { CategoryId, filter, page }],

    // 🔽 3. تمرير "page" للـ fetch function
    queryFn: () => BackendConnector.fetchProductsByCategory({ CategoryId, filter, page }),

    enabled: !!CategoryId,

    // 4. ❌❌❌ حذفنا دالة "select" من هنا ❌❌❌
  });

  // 🔽 5. تجهيز الداتا من الـ Paginator Object
  const products = data?.data || [];
  const paginationInfo = {
      currentPage: data?.current_page || 1,
      lastPage: data?.last_page || 1,
      total: data?.total || 0,
  };

  // 🔽 6. إرجاع المنتجات ومعلومات الـ pagination
  return {
    products, // "data.data" صارت "products"
    paginationInfo, // "data.current_page" ...الخ صارت "paginationInfo"
    groups: [], // (بما إن الـ endpoint هاد ما برجع groups)
    isLoading,
    error,
  };
};

export default useProductsQuery;