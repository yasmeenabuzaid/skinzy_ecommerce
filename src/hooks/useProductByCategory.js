import { useQuery } from '@tanstack/react-query';
import BackendConnector from '../services/connectors/BackendConnector';

const useProductsQuery = ({ CategoryId, filter }) => {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    // 1. The key is now dynamic, changing when CategoryId or filter changes
    queryKey: ['productsByCategory', { CategoryId, filter }],

    // 2. The function that fetches data using the parameters
    queryFn: () => BackendConnector.fetchProductsByCategory({ CategoryId, filter }),

    // 3. The query will only run if CategoryId is provided
    enabled: !!CategoryId,

    // 4. Transform the response to a consistent shape
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