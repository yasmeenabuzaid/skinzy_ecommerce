import { useState, useEffect } from "react";
import BackendConnector from "../services/connectors/BackendConnector";

const useCategoryQuery = () => {
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

useEffect(() => {
  const fetchCategories = async () => {
    setIsLoadingCategories(true);

    const cacheData = sessionStorage.getItem("categories");
    const cacheTime = sessionStorage.getItem("categoriesCacheTime");
    const now = new Date().getTime();
    const cacheExpiry = 1000 * 60 * 60; 
    if (cacheData && cacheTime && now - cacheTime < cacheExpiry) {
      try {
        const parsed = JSON.parse(cacheData);
        setCategories(parsed);
        setIsLoadingCategories(false);
        return;
      } catch (err) {
        console.warn("Failed to parse cached categories:", err);
      }
    }

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

      sessionStorage.setItem("categories", JSON.stringify(finalCategories));
      sessionStorage.setItem("categoriesCacheTime", now.toString());
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
