import React, { useState, useEffect } from "react";
import BackendConnector from "@/services/connectors/BackendConnector";

const AddAddressView = ({ onCancel, onSubmitSuccess }) => {
  const [title, setTitle] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [cityId, setCityId] = useState("");
  const [customCity, setCustomCity] = useState("");
  
  // Optional fields, kept for completeness
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Jordan");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  
  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [hasError, setHasError] = useState(false); 

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoadingCities(true);
      setHasError(false);
      try {
        // الآن من المفترض أن تُعيد الدالة مصفوفة المدن مباشرةً
        const res = await BackendConnector.getCities(); 
        
        // ✅ تبسيط منطق المعالجة (بعد تعديل BackendConnector)
        if (Array.isArray(res)) {
            setCities(res);
        } else if (res && typeof res === 'object' && res.length) {
            // معالجة احتياطية في حال استمرار إرجاع كائن شبيه بالمصفوفة
            const processedCities = Object.values(res).filter(item => typeof item === 'object' && item !== null && 'id' in item);
            setCities(processedCities);
        } else {
            setCities([]);
        }

      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
        setHasError(true); 
      } finally {
        setIsLoadingCities(false);
      }
    };
    
    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 💡 ملاحظة: تم استبدال 'alert' بمربع رسائل مُخصص (مُفترض) لتجنب أخطاء iframe

    if (!fullAddress || !cityId) {
      console.error("Please fill in the address and city fields.");
      return;
    }

    // Check if "Other" (ID 14) is selected but no custom name is provided
    if (cityId === "14" && !customCity.trim()) {
      console.error("Please specify the other city name.");
      return;
    }

    const addressData = {
      title,
      full_address: fullAddress,
      // Sending city_id as a number (after parsing) is safer for the backend
      city_id: parseInt(cityId), 
      // Only send custom_city if "Other" (ID 14) is selected
      custom_city: cityId === "14" ? customCity : null, 
      state,
      postal_code: postalCode,
      country,
      latitude: latitude || null,
      longitude: longitude || null,
    };

    try {
      const response = await BackendConnector.addAddress(addressData);
      
      
      if (onSubmitSuccess) {
        onSubmitSuccess(response?.address || response?.data || response);
      }
    } catch (error) {
      console.error("Failed to add address:", error);
      console.error("An error occurred while adding the address");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
        Add a New Address
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title (e.g., Home, Work)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF671F]"
        />
        <textarea
          placeholder="Full Address"
          value={fullAddress}
          onChange={(e) => setFullAddress(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF671F]"
          rows={3}
          required
        />
        
        {/* Cities Dropdown */}
        <select
          value={cityId}
          onChange={(e) => {
            setCityId(e.target.value);
            // Reset custom city if user switches away from "Other"
            if (e.target.value !== "14") setCustomCity("");
          }}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF671F]"
          required
          disabled={isLoadingCities || hasError} // Disable on loading or error
        >
          <option value="">
             {isLoadingCities ? "Loading cities..." : hasError ? "Error loading cities" : "Select City"}
          </option>
          
          {/* Ensure we map only if cities array is populated */}
          {cities.length > 0 && cities.map((city) => (
            <option key={city.id} value={String(city.id)}>
              {city.name}
            </option>
          ))}
          
        </select>

        {/* Custom City Input: Only shows if ID 14 is selected */}
        {cityId === "14" && (
          <input
            type="text"
            placeholder="Enter the city name"
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF671F]"
            required
          />
        )}

        <div className="flex flex-col items-center gap-4 mt-4">
          <button
            type="submit"
            className="bg-[#FF671F] text-white px-8 py-3 rounded-md hover:bg-[#e65c00] transition-colors w-full sm:w-auto"
          >
            Add Address
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors underline"
          >
            or Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressView;