"use client";
import { useQuery } from "@tanstack/react-query";
import BackendConnector from "../services/connectors/BackendConnector";

const useProductQuery = (id) => {
  const {
    data: product, // Rename 'data' to 'product' for clarity
    isLoading,
    error,
  } = useQuery({
    // 1. Dynamic key: Changes when the 'id' prop changes, triggering a refetch
    queryKey: ["product", id],

    // 2. The query function automatically receives the queryKey
    queryFn: ({ queryKey }) => BackendConnector.fetchSingleProduct(queryKey[1]), // queryKey[1] is the id

    // 3. Only run the query if an 'id' is provided
    enabled: !!id,

    // 4. Transform the data to a consistent format
    select: (result) => result?.product || result,
  });

  return { product, isLoading, error };
};

export default useProductQuery;