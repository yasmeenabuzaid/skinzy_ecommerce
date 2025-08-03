import { useEffect, useState } from 'react';
import BackendConnector from '../services/connectors/BackendConnector';
import storageService from "@/services/storage/storageService";

const useFavoritesQuery = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = storageService.getUserInfo();

    if (!user) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const result = await BackendConnector.fetchFavorites();

        if (!Array.isArray(result)) {
          throw new Error(result?.message || 'Invalid data');
        }

        setFavorites(result);
        setError(null);
      } catch (err) {
        console.error('Favorites fetch error:', err);
        setError(err.message || 'Unknown error');
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []); // لا تضف getUserInfo هنا

  return { favorites, isLoading, error };
};

export default useFavoritesQuery;
