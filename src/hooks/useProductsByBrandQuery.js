import { useQuery } from "@tanstack/react-query";
import BackendConnector from "../services/connectors/BackendConnector";

const useProductsByBrandQuery = ({ brandId, brandSlug, filter }) => {
  const {
    data: products = [], // The final data is the products array, with an empty array as a default
    isLoading,
    error,
  } = useQuery({
    // 1. Dynamic key that changes when parameters change, triggering a refetch
    queryKey: ["productsByBrand", { brandId, brandSlug, filter }],

    // 2. The function that fetches the data from your backend
    queryFn: () =>
      BackendConnector.fetchProductsByBrand({
        brandId,
        brandSlug,
        filter,
      }),

    // 3. The query will only run if either brandId or brandSlug is provided
    enabled: !!(brandId || brandSlug),

    // 4. This function transforms the raw API data into a clean products array
    select: (result) => {
      if (Array.isArray(result)) {
        return result;
      }
      // The library handles error objects automatically.
      // This handles the case where data is nested inside a 'products' property.
      return result?.products || [];
    },
  });

  return { products, isLoading, error };
};

export default useProductsByBrandQuery;