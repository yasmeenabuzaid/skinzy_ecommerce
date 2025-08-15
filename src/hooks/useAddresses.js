// hooks/useAddresses.js
import { useState, useEffect, useCallback } from "react";
import BackendConnector from "@/services/connectors/BackendConnector";

const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await BackendConnector.getAddresses();
      // Sort addresses by city name
      const sortedAddresses = [...(res?.addresses || [])].sort((a, b) => {
        const cityA = a.city?.name?.toLowerCase() || "";
        const cityB = b.city?.name?.toLowerCase() || "";
        return cityA.localeCompare(cityB);
      });
      setAddresses(sortedAddresses);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return { addresses, loading, error, setAddresses, refetch: fetchAddresses };
};

export default useAddresses;