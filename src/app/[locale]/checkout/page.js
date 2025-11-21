"use client";

import React, { useEffect, useState, useCallback } from "react";
import OrderSummary from "./OrderSummary";
import { useLocale, useTranslations } from "next-intl";
import BackendConnector from "@/services/connectors/BackendConnector";
import { useCartContext } from "../../../context/CartContext";
import StripePayment from "./StripePayment.js";
// 1. استبدال سويت اليرت بـ توست
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// --- استيراد المكونات الجديدة ---
import Modal from "../components/ui/Modal"; 
import AddAddressView from "../components/account/AddAddressView"; 

const FREE_SHIPPING_THRESHOLD = 20;

const FormInput = ({ id, label, type = "text", optional = false }) => (
  <div className="relative mb-4">
    <input id={id} name={id} type={type} placeholder={label} className="w-full px-3 py-3 border border-gray-300 rounded-md peer placeholder-transparent focus:outline-none focus:ring-2 focus:ring-black" />
    <label htmlFor={id} className="absolute left-3 -top-2.5 text-xs text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-black">
      {label} {optional && <span className="text-gray-400">({label ? "optional" : ""})</span>}
    </label>
  </div>
);

const SelectInput = ({ id, label, options = [], value, onChange }) => (
  <div className="relative mb-4">
    <select id={id} name={id} className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" value={value} onChange={onChange} required>
      <option value="">-- {label} --</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    <label htmlFor={id} className="absolute left-3 -top-2.5 text-xs text-gray-500 bg-white px-1">{label}</label>
  </div>
);

export default function CheckoutPage() {
  const locale = useLocale();
  const t = useTranslations("checkout");
  const { cart, fetchCart, fetchCartCount } = useCartContext();
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [stripeData, setStripeData] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingMethod, setShippingMethod] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + ((item.product?.price_after_discount ?? item.product?.price ?? 0) * item.quantity), 0);
  const deliveryFee = shippingMethod === "home_delivery" ? (subtotal > FREE_SHIPPING_THRESHOLD ? 0 : parseFloat(selectedAddress?.city?.delivery_fee || 0)) : 0;

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await BackendConnector.getAddresses();
      const fetchedAddresses = res?.addresses || [];
      setAddresses(fetchedAddresses);
      return fetchedAddresses;
    } catch (error) {
      console.error(t("orderFailText"), error);
      setAddresses([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddressAdded = async (newAddress) => {
    setIsAddressModalOpen(false);
    const updatedAddresses = await fetchAddresses();

    if (newAddress && newAddress.id) {
        const newlyAdded = updatedAddresses.find(addr => addr.id === newAddress.id);
        if (newlyAdded) {
            setSelectedAddress(newlyAdded);
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddress || !shippingMethod || !paymentMethod || (paymentMethod === "stripe" && !paymentProof)) {
      toast.error(t("fillAllRequired"));
      return;
    }
    setSubmitting(true);
    const formData = new FormData(e.target);
    formData.set("address_id", selectedAddress.id);
    formData.set("shipping_method", shippingMethod);
    formData.set("payment_method", paymentMethod);
    if (paymentMethod === "stripe" && paymentProof) {
      formData.append("image", paymentProof);
    }

    const toastId = toast.loading(t("submittingOrder") || "Processing order...");

    try {
      await BackendConnector.handleCheckout(formData);
      await fetchCart();
      await fetchCartCount();
      
      // 2. رسالة نجاح بدلاً من Swal
      toast.success(t("orderSuccessText") || "Order placed successfully!", { id: toastId });
      
      setTimeout(() => {
          router.push("/");
      }, 1500);

    } catch (error) {
      console.error(t("orderFailText"), error);
      toast.error(t("orderFailText") || "Failed to place order", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="text-gray-800">
      <div className="bg-white font-sans">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row" encType="multipart/form-data">
          <div className="w-full lg:w-3/5">
            <div className="py-8 px-4 sm:px-16 lg:px-24">
              <h1 className="text-3xl font-bold text-center mb-8">{t("checkoutFormTitle")}</h1>

              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">{t("contactInformation")}</h2>
                <FormInput id="mobile" label={t("mobileNumber")} type="tel" />
                <FormInput id="email" label={t("emailAddress")} type="email" optional />
                <FormInput id="note" label={t("note")} optional />
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">{t("shippingMethod")}</h2>
                <SelectInput id="shipping_method" label={t("chooseShippingMethod")} options={[{ value: "home_delivery", label: t("homeDelivery") }]} value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)} />
                <p className="text-sm text-gray-500 mt-1">{t("note")}: {t("homeDeliveryOnlyNoPickup")}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">{t("shippingAddress")}</h2>
                {loading ? (
                  <p className="text-gray-500">{t("loadingAddresses")}</p>
                ) : addresses.length === 0 ? (
                  <div className="text-center p-4 border rounded-md bg-gray-50">
                    <p className="text-gray-600">
                      {t("noAddressesMessage")}{" "}
                      <button type="button" onClick={() => setIsAddressModalOpen(true)} className="text-blue-600 underline hover:text-blue-800 cursor-pointer font-semibold">
                        {t("addAddressLinkText")}
                      </button>
                    </p>
                  </div>
                ) : (
                  <SelectInput id="address_id" label={t("selectAddress")} options={addresses.map((address) => ({ value: address.id, label: `${address.full_address}, ${address.city?.name || ""}` }))} value={selectedAddress?.id || ""} onChange={(e) => {
                      const selected = addresses.find((addr) => addr.id == e.target.value);
                      setSelectedAddress(selected);
                  }}/>
                )}
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">{t("paymentMethod")}</h2>
                <select id="payment_method" name="payment_method" className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
                  <option value="">{`-- ${t("choosePaymentMethod")} --`}</option>
                  <option value="cash_on_delivery">{t("cashOnDelivery")}</option>
                  <option value="stripe">{t("creditCardStripe")}</option>
                </select>
              </div>

              {paymentMethod === "stripe" && <StripePayment onDataChange={setStripeData} onImageUpload={setPaymentProof} />}
              
              <button type="submit" disabled={submitting || cart.length === 0 || !selectedAddress} className={`w-full bg-[#FF671F] text-white px-6 py-3 rounded-md hover:bg-[#FF671F]/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed`}>
                {submitting ? t("submittingOrder") : t("placeOrder")}
              </button>
              
              {cart.length === 0 && <p className="mt-2 text-[#FF671F] font-semibold">{t("cartEmpty")}</p>}
            </div>
          </div>
          <OrderSummary extraFee={deliveryFee} />
        </form>
      </div>

      <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)}>
        <AddAddressView onCancel={() => setIsAddressModalOpen(false)} onSubmitSuccess={handleAddressAdded} />
      </Modal>
    </div>
  );
}