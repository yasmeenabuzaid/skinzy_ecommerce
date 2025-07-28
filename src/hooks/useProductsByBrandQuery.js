import { useState, useEffect } from "react";
import BackendConnector from "../services/connectors/BackendConnector";


const useProductsByBrandQuery = ({ brandId, brandSlug, filter }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!brandId && !brandSlug) return;

      setIsLoading(true);
      try {
        const result = await BackendConnector.fetchProductsByBrand({
          brandId,
          brandSlug,
          filter,
        });
        console.log('Response from API:', result);

        if (Array.isArray(result)) {
          setProducts(result);
          setError(null);
        } else if (result?.message || result?.error) {
          setError(result.message || result.error);
          setProducts([]);
        } else {
          setProducts([]);
          setError("لا توجد منتجات");
        }
      } catch (err) {
        setError(err.message || "Unknown error");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [brandId, brandSlug, filter]);

  return { products, isLoading, error };
};


export default useProductsByBrandQuery;
