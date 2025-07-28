"use client";
import React, { useState, useEffect } from "react";


const ACCOUNT_INFO = {
  accountHolderName: "محمد أحمد",
  accountNumber: "1234567890123456",
  qrCodeUrl: "/images/bank-qr-code.png",
};

export default function StripePayment({
  userId,
  orderId,
  customerName,
  orderValue,
  onDataChange,
  onImageUpload,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    user_id: userId || "",
    order_id: orderId || "",
    image: null,
    note: "",
    payment_method: "bank_transfer",
    transaction_id: "",
    bank_name: "",
  });

  useEffect(() => {
    if (onDataChange) onDataChange(formData);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));

    if (onImageUpload) {
      onImageUpload(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert("يرجى رفع صورة إثبات الدفع.");
      return;
    }

    const data = new FormData();
    data.append("payment_method", formData.payment_method);
    data.append("transaction_id", formData.transaction_id);
    data.append("bank_name", formData.bank_name);
    data.append("note", formData.note);
    data.append("image", formData.image);

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        body: data,
        headers: {
          Authorization: "Bearer your_token_here",
        },
      });
      const result = await res.json();
      if (result.success) {
        alert("تم إرسال الطلب بنجاح! شكراً لاستخدامك خدمتنا.");
        if(onSubmit) onSubmit();
      } else {
        alert("حدث خطأ: " + result.message);
      }
    } catch (error) {
      alert("فشل الإرسال: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 border border-gray-300 rounded-md p-4  mx-auto">
      <h3 className="text-lg font-semibold mb-4">معلومات الدفع</h3>

      {/* عرض معلومات الحساب البنكي */}
      <div className="mb-4">
        <p><strong>اسم صاحب الحساب:</strong> {ACCOUNT_INFO.accountHolderName}</p>
        <p><strong>رقم الحساب:</strong> {ACCOUNT_INFO.accountNumber}</p>
      </div>

      {/* عرض كود QR */}
      <div className="mb-6 text-center">
        <p className="mb-2 font-medium">امسح رمز QR أدناه للدفع بسهولة:</p>
        <img
          src={ACCOUNT_INFO.qrCodeUrl}
          alt="رمز QR للدفع البنكي"
          className="mx-auto max-w-xs rounded-md border border-gray-200"
        />
      </div>

      {/* التنبيه */}
      <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md text-center">
        <strong>تنبيه:</strong> طلبك معلق حتى يتم التحقق من المبلغ المدفوع.
      </div>

      

      {/* رقم العملية */}
      <div className="mb-4">
        <label htmlFor="transaction_id" className="block mb-2 font-medium">
          رقم العملية (Transaction ID)
        </label>
        <input
          type="text"
          id="transaction_id"
          name="transaction_id"
          value={formData.transaction_id}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="أدخل رقم العملية إذا كان متوفر"
        />
      </div>

      {/* رفع صورة إثبات الدفع */}
      <div className="mb-6">
        <label htmlFor="image" className="block mb-2 font-medium">
          رفع صورة إثبات الدفع
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-md p-2 w-full"
          required
        />
      </div>

      {formData.image && (
        <div className="mb-4 text-center">
          <p>الملف المحدد: {formData.image.name}</p>
          <img
            src={URL.createObjectURL(formData.image)}
            alt="معاينة إثبات الدفع"
            className="mt-2 max-w-xs rounded-md mx-auto"
          />
        </div>
      )}


    </form>
  );
}
