import React, { useState, useEffect } from "react";
import BackendConnector from "@/services/connectors/BackendConnector";

const AddAddressView = ({ onCancel, onSubmitSuccess }) => {
  const [title, setTitle] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [cityId, setCityId] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Jordan");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await BackendConnector.getCities();
        setCities(res?.cities || []);
      } catch (error) {
        console.error("خطأ في جلب المدن:", error);
      }
    };
    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullAddress || !cityId) {
      alert("يرجى تعبئة العنوان والمدينة");
      return;
    }
    if (cityId === "14" && !customCity.trim()) {
      alert("يرجى كتابة اسم المدينة الأخرى");
      return;
    }

    const addressData = {
      title,
      full_address: fullAddress,
      city_id: cityId,
      custom_city: customCity, // Pass custom city if exists
      state,
      postal_code: postalCode,
      country,
      latitude: latitude || null,
      longitude: longitude || null,
    };

    try {
      // *** التعديل الرئيسي هنا ***
      // استقبل الرد من الباكند الذي يحتوي على العنوان الجديد
      const response = await BackendConnector.addAddress(addressData);
      
      alert("تم إضافة العنوان بنجاح");
      
      // مرّر العنوان الجديد بالكامل إلى دالة onSubmitSuccess
      if (onSubmitSuccess) {
        onSubmitSuccess(response?.address);
      }
    } catch (error) {
      console.error("فشل في إضافة العنوان:", error);
      alert("حدث خطأ أثناء إضافة العنوان");
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
        <select
          value={cityId}
          onChange={(e) => {
            setCityId(e.target.value);
            if (e.target.value !== "14") setCustomCity("");
          }}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF671F]"
          required
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
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