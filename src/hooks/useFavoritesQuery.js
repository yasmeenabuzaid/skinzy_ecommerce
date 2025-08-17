"use client";
import { useQuery } from "@tanstack/react-query";
import BackendConnector from "../services/connectors/BackendConnector";
import storageService from "@/services/storage/storageService";

const useFavoritesQuery = () => {
  const user = storageService.getUserInfo();

  const {
    data: favorites = [], // Default to an empty array
    isLoading,
    error,
  } = useQuery({
    // 1. Key is now tied to the user's ID
    queryKey: ["favorites", user?.id],

    // 2. The function to fetch the data
    queryFn: BackendConnector.fetchFavorites,

    // 3. Only run the query if a user is logged in
    enabled: !!user,

    // 4. Transform the response to get a clean array
    select: (result) => {
      const data = result.data || result;
      return data?.favorites || [];
    },
  });

  // Note: We no longer return 'setFavorites'. See explanation below.
  return { favorites, isLoading, error };
};

export default useFavoritesQuery;