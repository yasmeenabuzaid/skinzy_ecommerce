import React, { useState, useEffect } from "react";
import BackendConnector from "../../../../services/connectors/BackendConnector";
import Swal from "sweetalert2";

const AddressesView = ({ onBack, onAddAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await BackendConnector.getAddresses();
      setAddresses(res?.addresses || []);
    } catch (error) {
      console.error("خطأ في جلب العناوين:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف العنوان نهائيًا.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await BackendConnector.deleteAddress(id);
          setAddresses((prev) => prev.filter((address) => address.id !== id));
          Swal.fire("تم الحذف!", "تم حذف العنوان بنجاح.", "success");
        } catch (error) {
          console.error("فشل في حذف العنوان:", error);
          Swal.fire("خطأ", "حدث خطأ أثناء حذف العنوان.", "error");
        }
      }
    });
  };

  return (
    <div className="flex flex-col items-center text-center px-4">
      <h1 className="text-4xl font-light tracking-tight mb-4">Addresses</h1>

      <button
        onClick={onBack}
        className="text-sm text-gray-600 hover:text-black transition-colors underline mb-8"
      >
        Return to Account details
      </button>

      <button
        onClick={onAddAddress}
        className="bg-red-400 text-white px-6 py-3 rounded-md hover:bg-red-500 transition-colors mb-12"
      >
        Add a new address
      </button>

      {loading ? (
        <p>جاري تحميل العناوين...</p>
      ) : addresses.length === 0 ? (
        <p className="text-gray-500">لا يوجد عناوين بعد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-7xl">
          {[...addresses]
            .sort((a, b) => {
              const cityA = a.city?.name?.toLowerCase() || "";
              const cityB = b.city?.name?.toLowerCase() || "";
              if (cityA < cityB) return -1;
              if (cityA > cityB) return 1;
              return 0;
            })
            .map((address, index) => (
              <div
                key={address.id || index}
                className="border p-6 rounded-md shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-2">Address {index + 1}</h3>
                <div className="text-gray-600 mb-4">
                  <p>{address.full_address || "عنوان غير متوفر"}</p>
                  <p>
                    {address.city?.name || "مدينة غير معروفة"},{" "}
                    {address.country || "دولة غير معروفة"}
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  {/* <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors">
                    Edit
                  </button> */}
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="bg-red-400 text-white px-6 py-2 rounded-md hover:bg-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AddressesView;
