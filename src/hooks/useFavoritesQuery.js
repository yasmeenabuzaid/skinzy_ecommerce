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
        const data = result.data || result;

        if (!Array.isArray(data.favorites)) {
          throw new Error(data?.message || 'Invalid data');
        }

        setFavorites(data.favorites);
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
  }, []);

  // ✅ أرجعي setFavorites حتى نقدر نحدث state من الخارج
  return { favorites, setFavorites, isLoading, error };
};

export default useFavoritesQuery;
