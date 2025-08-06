"use client";
import { useState, useEffect } from "react";
import BackendConnector from "../services/connectors/BackendConnector";

const useProductQuery = (id) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const result = await BackendConnector.fetchSingleProduct(id);
        if (result?.message || result?.error) {
          setError(result.message || result.error);
          setProduct(null);
        } else {
          setProduct(result.product || result);
          setError(null);
        }
      } catch (err) {
        setError(err.message || "Unknown error");
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, isLoading, error };
};

export default useProductQuery;
