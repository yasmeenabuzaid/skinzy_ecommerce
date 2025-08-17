import { useQuery } from '@tanstack/react-query';
import BackendConnector from '../services/connectors/BackendConnector';

const useProductsQuery = ({ subCategoryId, filter }) => {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    // 1. Dynamic key that includes subCategoryId and filter
    queryKey: ['productsBySubCategory', { subCategoryId, filter }],

    // 2. The function that fetches the data
    queryFn: () => BackendConnector.fetchProductsBySubCategory({ subCategoryId, filter }),

    // 3. Only run this query if subCategoryId is provided
    enabled: !!subCategoryId,

    // 4. Transform the API response into a consistent shape
    select: (result) => {
      if (Array.isArray(result)) {
        return { products: result, groups: [] };
      }
      return {
        products: result?.products || [],
        groups: result?.groups || [],
      };
    },
  });

  return {
    products: data?.products || [],
    groups: data?.groups || [],
    isLoading,
    error,
  };
};

export default useProductsQuery;