"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { User, MapPin, LogOut, Plus, Trash2, Home } from "lucide-react";
import Swal from "sweetalert2";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
// --- Services & External Connectors ---
import storageService from "@/services/storage/storageService";
import BackendConnector from "@/services/connectors/BackendConnector";

// ====================================================================
// 1. Sub-Components (Views) - All within this file
// ====================================================================

// ------------------------------------------
// AccountDetailsView: Displays user's main info
// ------------------------------------------
const AccountDetailsView = ({ onViewAddresses, onLogout }) => {
    const t = useTranslations("AccountDetailsView");
    const [userName, setUserName] = useState("");
    const [addressInfo, setAddressInfo] = useState({ count: 0, location: "", loading: true });

    useEffect(() => {
        const userInfo = storageService.getUserInfo();
        if (userInfo?.user?.Fname && userInfo?.user?.Lname) {
            setUserName(`${userInfo.user.Fname} ${userInfo.user.Lname}`);
        }

        const fetchPrimaryAddress = async () => {
            try {
                const res = await BackendConnector.getAddresses();
                const addresses = res?.addresses || [];
                const primary = addresses.find(a => a.is_default) || addresses[0];
                setAddressInfo({
                    count: addresses.length,
                    location: primary ? `${primary.city?.name}, ${primary.country}` : t("noAddress"),
                    loading: false
                });
            } catch (error) {
                console.error(error);
                setAddressInfo({ count: 0, location: t("loadError"), loading: false });
            }
        };

        fetchPrimaryAddress();
    }, [t]);

    const UserIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-4 h-4 mr-2 text-gray-600">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    );

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
                <div className="lg:col-span-2">
                    <h2 className="text-3xl font-bold tracking-tight mb-4 text-gray-800">{t("account")}</h2>
                    <button onClick={onLogout} className="text-sm text-gray-600 hover:text-black transition-colors underline flex items-center">
                        <UserIcon />
                        {t("logout")}
                    </button>
                </div>
                <div className="mt-8 lg:mt-0">
                    <div className="lg:pl-4">
                        <h3 className="text-xl font-semibold tracking-tight mb-3 text-gray-800">{t("accountDetails")}</h3>
                        <div className="text-gray-600 space-y-1">
                            <p>{userName || t("loadingUser")}</p>
                            {addressInfo.loading ? <p>{t("loadingAddress")}</p> : <p>{addressInfo.location}</p>}
                        </div>
                        <button onClick={onViewAddresses} className="text-sm text-gray-600 hover:text-black transition-colors underline mt-4 inline-block">
                            {t("viewAddresses", { count: addressInfo.count })}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ------------------------------------------
// AddressesView: Displays a list of user addresses
// ------------------------------------------
const AddressesView = ({ onAddAddress }) => {
    const t = useTranslations("AddressesView");
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAddresses = useCallback(async () => {
        try {
            setLoading(true);
            const res = await BackendConnector.getAddresses();
            setAddresses(res?.addresses || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const handleDelete = (id) => {
        Swal.fire({
            title: t("deleteConfirmTitle"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e11d48",
            confirmButtonText: t("deleteConfirmButton"),
            cancelButtonText: t("cancel"),
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await BackendConnector.deleteAddress(id);
                    fetchAddresses();
                    Swal.fire(t("deleteSuccessTitle"), t("deleteSuccessText"), "success");
                } catch (error) {
                    Swal.fire(t("deleteErrorTitle"), "", "error");
                }
            }
        });
    };

    const AddressCard = ({ address, onDelete }) => (
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{address.title || t('defaultTitle')}</h3>
                    {address.is_default && (<span className="flex items-center gap-1 text-xs font-semibold bg-rose-100 text-rose-700 px-2 py-1 rounded-full"><Home size={14} /> {t('defaultBadge')}</span>)}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                    <p>{address.full_address}</p>
                    <p>{address.city?.name}, {address.country}</p>
                </div>
            </div>
            <div className="mt-5 flex justify-end">
                <button onClick={() => onDelete(address.id)} className="text-sm font-semibold text-red-600 hover:text-red-800 flex items-center gap-1">
                    <Trash2 size={14} /> {t('deleteButton')}
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t('title')}</h2>
                <button onClick={onAddAddress} className="flex items-center gap-2 bg-[#FF671F] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#e65c00] transition-colors shadow-sm">
                    <Plus size={18} /> {t('addNewAddress')}
                </button>
            </div>
            {loading ? <p>{t('loading')}</p> : addresses.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg"><p className="text-gray-500">{t('noAddresses')}</p></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (<AddressCard key={address.id} address={address} onDelete={handleDelete} />))}
                </div>
            )}
        </div>
    );
};


// ------------------------------------------
// AddAddressView: Form to add a new address
// ------------------------------------------
const AddAddressView = ({ onCancel, onSubmitSuccess }) => {
    const t = useTranslations("AddAddressView");
    const [title, setTitle] = useState("");
    const [fullAddress, setFullAddress] = useState("");
    const [cityId, setCityId] = useState("");
    const [cities, setCities] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await BackendConnector.getCities();
                setCities(res?.cities || []);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCities();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullAddress || !cityId) {
            Swal.fire({ icon: 'error', title: t("error"), text: t("fillFields") });
            return;
        }
        setIsSubmitting(true);
        const addressData = { title, full_address: fullAddress, city_id: cityId, country: "Jordan" };
        try {
            await BackendConnector.addAddress(addressData);
            Swal.fire({ icon: 'success', title: t("success"), text: t("addressAdded") });
            if (onSubmitSuccess) onSubmitSuccess();
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: t("failed"), text: t("addressFailed") });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{t("addTitle")}</h2>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <input type="text" placeholder={t("titlePlaceholder")} value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF671F]" />
                <textarea placeholder={t("fullAddressPlaceholder")} value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF671F]" rows={3} required />
                <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md mb-6 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF671F]" required>
                    <option value="">{t("selectCity")}</option>
                    {cities.map((city) => (<option key={city.id} value={city.id}>{city.name}</option>))}
                </select>
                <div className="flex flex-col items-center gap-4">
                    <button type="submit" disabled={isSubmitting} className="bg-[#FF671F] text-white px-8 py-3 rounded-md hover:bg-[#e65c00] transition-colors w-full disabled:bg-gray-400">
                        {isSubmitting ? t("saving") : t("addAddress")}
                    </button>
                    <button type="button" onClick={onCancel} className="text-sm text-gray-600 hover:text-gray-900 transition-colors underline">{t("cancel")}</button>
                </div>
            </form>
        </div>
    );
};


// ====================================================================
// 2. Main Component (ProfilePage) - This brings all views together
// ====================================================================
export default function ProfilePage() {
    const [view, setView] = useState("details"); // 'details', 'addresses', 'addAddress'
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("ProfilePage");

    // Check if user is logged in
    useEffect(() => {
        const userInfo = storageService.getUserInfo();
        if (!userInfo?.accessToken) {
            router.replace(`/${locale}/auth/login`);
        }
    }, [router, locale]);

    const handleLogout = () => {
        Swal.fire({
            title: t("logoutConfirmTitle"),
            text: t("logoutConfirmText"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t("logoutConfirmButton"),
            cancelButtonText: t("cancel"),
        }).then((result) => {
            if (result.isConfirmed) {
                storageService.deleteAll();
                window.location.href = `/${locale}`; // Redirect to home page
            }
        });
    };

    const renderContent = () => {
        switch (view) {
            case "addresses":
                return <AddressesView onAddAddress={() => setView("addAddress")} />;
            case "addAddress":
                return <AddAddressView onCancel={() => setView("addresses")} onSubmitSuccess={() => setView("addresses")} />;
            case "details":
            default:
                return <AccountDetailsView onViewAddresses={() => setView("addresses")} onLogout={handleLogout} />;
        }
    };

    const NavLink = ({ icon, label, isActive, onClick }) => (
        <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg transition-all duration-200 font-semibold ${isActive ? "bg-[#FF671F] text-white shadow-md" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
          <div className="text-gray-800 ">
            <Header />
        <div className="bg-gray-50 min-h-[70vh]">
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <header className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{t("mainTitle")}</h1>
                    <p className="mt-1 text-lg text-gray-500">{t("welcomeMessage")}</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
                    <aside className="lg:col-span-3 mb-8 lg:mb-0">
                        <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
                            <NavLink icon={<User size={20} />} label={t("navAccountDetails")} isActive={view === "details"} onClick={() => setView("details")} />
                            <NavLink icon={<MapPin size={20} />} label={t("navMyAddresses")} isActive={view === "addresses" || view === "addAddress"} onClick={() => setView("addresses")} />
                            <div className="pt-2 mt-2 border-t border-gray-200">
                                <NavLink icon={<LogOut size={20} />} label={t("navLogout")} isActive={false} onClick={handleLogout} />
                            </div>
                        </div>
                    </aside>

                    <main className="lg:col-span-9">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
            <Footer />
            </div>
    );
}
