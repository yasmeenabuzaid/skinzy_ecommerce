import { useState, useEffect } from "react";
import BackendConnector from "../services/connectors/BackendConnector";

const useBrandQuery = () => {
  const [brands, setBrands] = useState([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const [errorBrands, setErrorBrands] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoadingBrands(true);
      try {
        const result = await BackendConnector.fetchBrands();

        if (Array.isArray(result)) {
          setBrands(result);
          setErrorBrands(null);
        } else if (result?.message || result?.error) {
          setErrorBrands(result.message || result.error);
          setBrands([]);
        } else {
          setBrands(result.brands || []);
          setErrorBrands(null);
        }
      } catch (err) {
        setErrorBrands(err.message || "Unknown error");
        setBrands([]);
      } finally {
        setIsLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, isLoadingBrands, errorBrands };
};

export default useBrandQuery;
