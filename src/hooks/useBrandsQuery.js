import { useQuery } from '@tanstack/react-query';
import BackendConnector from '../services/connectors/BackendConnector';

const useBrandQuery = () => {
  const {
    data: brands = [], // `data` is renamed to `brands` with a default value
    isLoading: isLoadingBrands, // Renaming for consistency
    error: errorBrands,
  } = useQuery({
    // 1. A unique key to cache the brands data
    queryKey: ['brands'],

    // 2. The function to fetch the data
    queryFn: BackendConnector.fetchBrands,

    // 3. Transform the API response into a consistent array format
    select: (result) => {
      if (Array.isArray(result)) {
        return result; // Handles the case where the API returns a direct array
      }
      // Handles the case where the API returns an object like { brands: [...] }
      // The library handles error objects automatically
      return result?.brands || [];
    },
  });

  return { brands, isLoadingBrands, errorBrands };
};

export default useBrandQuery;