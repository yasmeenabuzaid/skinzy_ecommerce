import { useState, useEffect } from "react";
import BackendConnector from "../services/connectors/BackendConnector";

const useProductsQuery = () => {
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await BackendConnector.fetchProducts();
        console.log(result);

        if (Array.isArray(result)) {
          // إذا الـ API يرجع مصفوفة مباشرة
          setProducts(result);
          setGroups([]);
          setError(null);
        } else if (result?.message || result?.error) {
          setError(result.message || result.error);
          setProducts([]);
          setGroups([]);
        } else {
          // إذا كانت البيانات في شكل كائن يحتوي على products و groups
          setProducts(result.products || []);
          setGroups(result.groups || []);
          setError(null);
        }
      } catch (err) {
        setError(err.message || "Unknown error");
        setProducts([]);
        setGroups([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, groups, isLoading, error };
};

export default useProductsQuery;
