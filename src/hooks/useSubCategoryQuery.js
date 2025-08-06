import { useState, useEffect } from "react";
import BackendConnector from "../services/connectors/BackendConnector";

const useCategoryQuery = () => {
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);

      try {
        const result = await BackendConnector.fetchSubCategories();
        let finalCategories = [];

        if (Array.isArray(result)) {
          finalCategories = result;
        } else if (result?.message || result?.error) {
          setErrorCategories(result.message || result.error);
        } else {
          finalCategories = result.categories || [];
        }

        setCategories(finalCategories);
        setErrorCategories(null);
      } catch (err) {
        setErrorCategories(err.message || "Unknown error");
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoadingCategories, errorCategories };
};

export default useCategoryQuery;
