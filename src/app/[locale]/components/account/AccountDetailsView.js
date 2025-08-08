import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import localStorageService from "@/services/storage/localStorageService";
import storageService from "@/services/storage/storageService";
import Swal from "sweetalert2";
import UserIcon from "./UserIcon";
import { useLocale } from "next-intl";
import useAddressQuery from "@/hooks/useAddressQuery";

const AccountDetailsView = ({ onViewAddresses }) => {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  const { country, city, addressCount, loading, error } = useAddressQuery();

  useEffect(() => {
    const userInfo = storageService.getUserInfo();
    if (userInfo?.user?.Fname && userInfo?.user?.Lname) {
      setUserName(`${userInfo.user.Fname} ${userInfo.user.Lname}`);
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم تسجيل خروجك من الحساب.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، تسجيل الخروج",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorageService.deleteAll();
        window.location.href = "/";
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-16">
      <div className="lg:col-span-2">
        <h1 className="text-4xl font-light tracking-tight mb-6">Account</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-black transition-colors underline flex items-center mb-12"
        >
          <UserIcon />
          Log out
        </button>

        <div className="mt-8">
          <h2 className="text-2xl font-light tracking-tight mb-4">Order history</h2>
          <p className="text-gray-500">You haven&apos;t placed any orders yet.</p>
        </div>
      </div>

      <div className="mt-12 lg:mt-0">
        <div className="lg:pl-8">
          <h2 className="text-2xl font-light tracking-tight mb-4">Account details</h2>
          <div className="text-gray-600 space-y-1">
            <p>{userName || "اسم المستخدم غير متوفر"}</p>
            {loading ? (
              <p>جارٍ تحميل العنوان...</p>
            ) : error ? (
              <p>حدث خطأ أثناء تحميل العنوان</p>
            ) : (
              <p>{country || "الدولة غير متوفرة"} / {city || "المدينة غير متوفرة"}</p>
            )}
          </div>
          <button
            onClick={onViewAddresses}
            className="text-sm text-gray-600 hover:text-black transition-colors underline mt-4 inline-block"
          >
            View addresses ({addressCount})
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsView;
