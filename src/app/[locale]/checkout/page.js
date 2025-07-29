"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import OrderSummary from "./OrderSummary";
import { useLocale } from "next-intl";
import BackendConnector from "@/services/connectors/BackendConnector";
import { useCartContext } from "../../../context/CartContext";
import StripePayment from "./StripePayment.js";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const FREE_SHIPPING_THRESHOLD = 15;

const FormInput = ({ id, label, type = "text", optional = false }) => (
  <div className="relative mb-4">
    <input
      id={id}
      name={id}
      type={type}
      placeholder={label}
      className="w-full px-3 py-3 border border-gray-300 rounded-md peer placeholder-transparent focus:outline-none focus:ring-2 focus:ring-black"
    />
    <label
      htmlFor={id}
      className="absolute left-3 -top-2.5 text-xs text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-black"
    >
      {label} {optional && <span className="text-gray-400">(optional)</span>}
    </label>
  </div>
);

const SelectInput = ({ id, label, options = [], value, onChange }) => (
  <div className="relative mb-4">
    <select
      id={id}
      name={id}
      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
      value={value}
      onChange={onChange}
      required
    >
      <option value="">-- {label} --</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <label
      htmlFor={id}
      className="absolute left-3 -top-2.5 text-xs text-gray-500 bg-white px-1"
    >
      {label}
    </label>
  </div>
);

export default function CheckoutPage() {
  const locale = useLocale();
  const { cart } = useCartContext();
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [stripeData, setStripeData] = useState({});

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingMethod, setShippingMethod] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      ((item.product?.price_after_discount ?? item.product?.price ?? 0) *
        item.quantity),
    0
  );

  const deliveryFee =
    shippingMethod === "home_delivery"
      ? subtotal > FREE_SHIPPING_THRESHOLD
        ? 0
        : parseFloat(selectedAddress?.city?.delivery_fee || 0)
      : 0;

  useEffect(() => {
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
    fetchAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0 || !selectedAddress || !shippingMethod || !paymentMethod || (paymentMethod === "stripe" && !paymentProof)) {
      alert("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    setSubmitting(true);

    const formData = new FormData(e.target);
    formData.set("address_id", selectedAddress.id);
    formData.set("shipping_method", shippingMethod);
    formData.set("payment_method", paymentMethod);

    Object.entries(stripeData).forEach(([key, value]) => {
      if (key === "image") {
        if (value) formData.append("image", value);
      } else {
        formData.append(key, value);
      }
    });

    try {
      await BackendConnector.handleCheckout(formData);
      Swal.fire({
        icon: "success",
        title: "تم الطلب بنجاح!",
        text: "سعيدون جدًا بثقتك ونتمنى لك تجربة رائعة مع منتجاتنا",
        confirmButtonText: "موافق",
      }).then(() => router.push("/"));
    } catch (error) {
      console.error("فشل في إرسال الطلب:", error);
      Swal.fire({
        icon: "error",
        title: "فشل في إرسال الطلب",
        text: "حدث خطأ أثناء المعالجة. حاول مرة أخرى لاحقًا.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="text-gray-800">
      <Header />

      <div className="bg-white font-sans">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row"
          encType="multipart/form-data"
        >
          <div className="w-full lg:w-3/5">
            <div className="py-8 px-4 sm:px-16 lg:px-24">
              <h1 className="text-3xl font-bold text-center mb-8">CHECKOUT FORM</h1>

              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">Contact Information</h2>
                <FormInput id="mobile" label="Mobile number" type="tel" />
                <FormInput id="email" label="Email address" type="email" optional />
                <FormInput id="note" label="Note" optional />
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">Shipping Method</h2>
                <SelectInput
                  id="shipping_method"
                  label="Choose shipping method"
                  options={[
                    { value: "home_delivery", label: "Home Delivery" },
                    { value: "pickup", label: "Pickup from Store" },
                  ]}
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
                {loading ? (
                  <p className="text-gray-500">جاري تحميل العناوين...</p>
                ) : (
                  <SelectInput
                    id="address_id"
                    label="Select Address"
                    options={addresses.map((address) => ({
                      value: address.id,
                      label: `${address.full_address}, ${address.city?.name || ""}`,
                    }))}
                    value={selectedAddress?.id || ""}
                    onChange={(e) => {
                      const selected = addresses.find(
                        (addr) => addr.id == e.target.value
                      );
                      setSelectedAddress(selected);
                    }}
                  />
                )}
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                <select
                  id="payment_method"
                  name="payment_method"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="">-- Choose payment method --</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                  <option value="stripe">Credit Card (Stripe)</option>
                </select>

                {shippingMethod === "home_delivery" &&
                  selectedAddress?.city?.delivery_fee !== undefined && (
                    <p className="text-sm text-green-700 font-semibold mt-2">
                      {subtotal > FREE_SHIPPING_THRESHOLD ? (
                        <>✅ التوصيل مجاني لأن إجمالي الطلب أكثر من {FREE_SHIPPING_THRESHOLD} دينار</>
                      ) : (
                        <>رسوم التوصيل: {selectedAddress.city.delivery_fee} دينار</>
                      )}
                    </p>
                  )}
              </div>

              {paymentMethod === "stripe" && (
                <StripePayment
                  onDataChange={setStripeData}
                  onImageUpload={setPaymentProof}
                />
              )}

              <button
                type="submit"
                disabled={submitting || cart.length === 0}
                className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-400"
              >
                {submitting ? "جاري إرسال الطلب..." : "Place Order"}
              </button>

              {cart.length === 0 && (
                <p className="mt-2 text-red-600 font-semibold">
                  عربة التسوق فارغة! الرجاء إضافة منتجات قبل إتمام الطلب.
                </p>
              )}
            </div>
          </div>

          <OrderSummary extraFee={deliveryFee} />
        </form>
      </div>

      <Footer />
    </div>
  );
}
