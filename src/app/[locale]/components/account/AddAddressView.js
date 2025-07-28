import React, { useState, useEffect } from "react";
import BackendConnector from "@/services/connectors/BackendConnector";

const AddAddressView = ({ onCancel, onSubmitSuccess }) => {
  const [title, setTitle] = useState(""); // مثل "المنزل"
  const [fullAddress, setFullAddress] = useState("");
  const [cityId, setCityId] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Jordan");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [cities, setCities] = useState([]);

  // تحميل المدن من الباكند
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

    // تحقق من الحقول المطلوبة
    if (!fullAddress || (!cityId)) {
      alert("يرجى تعبئة العنوان والمدينة");
      return;
    }

    // إذا اختار المدينة "Other" (id = 14) تأكد من تعبئة customCity
    if (cityId === "14" && !customCity.trim()) {
      alert("يرجى كتابة اسم المدينة الأخرى");
      return;
    }

    const addressData = {
      title,
      full_address: fullAddress,
      city_id: cityId || null,  // ترسل city_id دائماً
      custom_city: cityId === "14" ? customCity : null, // ترسل custom_city فقط لو المدينة 14
      state,
      postal_code: postalCode,
      country,
      latitude: latitude || null,
      longitude: longitude || null,
    };

    try {
      await BackendConnector.addAddress(addressData);
      alert("تم إضافة العنوان بنجاح");
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.error("فشل في إضافة العنوان:", error);
      alert("حدث خطأ أثناء إضافة العنوان");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-light tracking-tight text-center mb-10">
        Add a new address
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title (مثلاً: المنزل)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />
        <textarea
          placeholder="Full Address"
          value={fullAddress}
          onChange={(e) => setFullAddress(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none"
          rows={3}
          required
        />
        <select
          value={cityId}
          onChange={(e) => {
            setCityId(e.target.value);
            if (e.target.value !== "14") {
              setCustomCity("");
            }
          }}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 bg-white"
        >
          <option value="">اختر المدينة</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        {cityId === "14" && (
          <input
            type="text"
            placeholder="اكتب اسم المدينة"
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md mb-4"
            required
          />
        )}
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />
        <input
          type="text"
          placeholder="Postal/ZIP code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 bg-white"
        >
          <option value="Jordan">Jordan</option>
          {/* اضف دول اخرى اذا احتجت */}
        </select>
        <input
          type="number"
          step="0.0000001"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />
        <input
          type="number"
          step="0.0000001"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />

        <div className="flex flex-col items-center gap-4">
          <button
            type="submit"
            className="bg-red-400 text-white px-8 py-3 rounded-md hover:bg-red-500 transition-colors w-full sm:w-auto"
          >
            Add address
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-600 hover:text-black transition-colors underline"
          >
            or Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressView;
