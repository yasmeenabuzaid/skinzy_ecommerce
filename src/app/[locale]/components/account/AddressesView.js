// /components/account/views/AddressesView.jsx
import React, { useEffect, useState } from "react";
import BackendConnector from "@/services/connectors/BackendConnector";
import Swal from "sweetalert2";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Home } from "lucide-react";

// ✨ مكون لعرض بطاقة العنوان بشكل أفضل
const AddressCard = ({ address, onDelete }) => {
    const t = useTranslations("AddressesView");
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{address.title || t('defaultTitle')}</h3>
                    {address.is_default && (
                        <span className="flex items-center gap-1 text-xs font-semibold bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                            <Home size={14} /> {t('defaultBadge')}
                        </span>
                    )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                    <p>{address.full_address}</p>
                    <p>{address.city?.name}, {address.country}</p>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
                {/* <button className="text-sm font-semibold text-gray-600 hover:text-black">Edit</button> */}
                <button 
                    onClick={() => onDelete(address.id)}
                    className="text-sm font-semibold text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                    <Trash2 size={14} /> {t('deleteButton')}
                </button>
            </div>
        </div>
    );
};


export default function AddressesView({ onAddAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("AddressesView");

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await BackendConnector.getAddresses();
      setAddresses(res?.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: t("deleteConfirmTitle"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // لون أحمر مناسب
      confirmButtonText: t("deleteConfirmButton"),
      cancelButtonText: t("cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await BackendConnector.deleteAddress(id);
          fetchAddresses(); // ✨ إعادة جلب العناوين لتحديث القائمة
          Swal.fire(t("deleteSuccessTitle"), t("deleteSuccessText"), "success");
        } catch (error) {
          Swal.fire(t("deleteErrorTitle"), "", "error");
        }
      }
    });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{t('title')}</h2>
            <button
                onClick={onAddAddress}
                className="flex items-center gap-2 bg-[#FF671F] text-white font-semibold px-4 py-2 rounded-lg hover:bg-rose-700 transition-all shadow-sm"
            >
                <Plus size={18} /> {t('addButton')}
            </button>
        </div>
      
        {loading ? (
            <p>{t('loading')}</p>
        ) : addresses.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-gray-500">{t('noAddresses')}</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                    <AddressCard key={address.id} address={address} onDelete={handleDelete} />
                ))}
            </div>
        )}
    </div>
  );
};
