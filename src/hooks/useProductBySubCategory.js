import { useState, useEffect } from "react";
import BackendConnector from "../services/connectors/BackendConnector";

const useProductsQuery = ({ subCategoryId, filter }) => {
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!subCategoryId) return;

      setIsLoading(true);
      try {
        const result = await BackendConnector.fetchProductsBySubCategory({
          subCategoryId,
          filter, 
        });

        if (Array.isArray(result)) {
          setProducts(result);
          setGroups([]);
          setError(null);
        } else if (result?.message || result?.error) {
          setError(result.message || result.error);
          setProducts([]);
          setGroups([]);
        } else {
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
  }, [subCategoryId, filter]); 

  return { products, groups, isLoading, error };
};

export default useProductsQuery;
