// hooks/useAddressQuery.js
import { useEffect, useState } from "react";
import BackendConnector from "@/services/connectors/BackendConnector";

const useAddressQuery = () => {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [addressCount, setAddressCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await BackendConnector.getAddresses();
        const addresses = res.addresses || [];

        setAddressCount(addresses.length); // ✅ عد العناوين

        if (addresses.length > 0) {
          const firstAddress = addresses[0];
          setCountry(firstAddress.country || "");
          setCity(firstAddress.city?.name || "");
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  return { country, city, addressCount, loading, error };
};

export default useAddressQuery;
