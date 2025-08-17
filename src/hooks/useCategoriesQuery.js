import { useQuery } from '@tanstack/react-query';
import BackendConnector from '../services/connectors/BackendConnector';

const useCategoryQuery = () => {
  const {
    data: categories = [],        // Rename 'data' to 'categories' and set a default empty array
    isLoading: isLoadingCategories, // Rename 'isLoading' for consistency
    error: errorCategories,         // Rename 'error'
  } = useQuery({
    // A unique key to identify and cache this data
    queryKey: ['categories'],

    // The function that will fetch the data from your backend
    queryFn: BackendConnector.fetchCategories,

    // This function transforms the data to a consistent format after fetching
    select: (result) => {
      // If the API returns a direct array of categories
      if (Array.isArray(result)) {
        return result;
      }
      // If the API returns an object like { categories: [...] }
      return result?.categories || [];
    },
  });

  return { categories, isLoadingCategories, errorCategories };
};

export default useCategoryQuery;