"use client";

import React, { useState } from "react";
import { User, MapPin, LogOut, CreditCard } from "lucide-react"; // ✨ Using icons for clarity

// These are your existing components. No changes needed inside them.
import AccountDetailsView from "./AccountDetailsView";
import AddressesView from "./AddressesView";
import AddAddressView from "./AddAddressView";

// ✨ A helper component for clean navigation links
const NavLink = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg transition-all duration-200 font-semibold
      ${
        isActive
          ? "bg-[#FF671F] text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);


export default function AccountPage() {
  const [view, setView] = useState("details"); // Default view is 'details'

  const renderContent = () => {
    switch (view) {
      case "addresses":
        return <AddressesView onAddAddress={() => setView("addAddress")} />;
      case "addAddress":
        return <AddAddressView onCancel={() => setView("addresses")} />;
      // ✨ Added more views for a complete example
      case "orders":
        // return <OrdersView />;
        return <div className="bg-white p-8 rounded-xl shadow-sm"><h2>My Orders</h2><p>Order history will be displayed here.</p></div>;
      case "details":
      default:
        return <AccountDetailsView />;
    }
  };

  return (
    // ✨ Main container with a soft background color
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:py-12">

        {/* ✨ Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">My Account</h1>
          <p className="mt-1 text-lg text-gray-500">Welcome back! Manage your details and orders here.</p>
        </header>

        {/* ✨ Dashboard Layout: Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
          
          {/* ✨ Sidebar Navigation */}
          <aside className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
              <NavLink
                icon={<User size={20} />}
                label="Account Details"
                isActive={view === "details"}
                onClick={() => setView("details")}
              />
              <NavLink
                icon={<MapPin size={20} />}
                label="My Addresses"
                isActive={view === "addresses" || view === "addAddress"}
                onClick={() => setView("addresses")}
              />
              {/* <NavLink
                icon={<CreditCard size={20} />}
                label="Order History"
                isActive={view === "orders"}
                onClick={() => setView("orders")}
              /> */}
              <div className="pt-2 mt-2 border-t border-gray-200">
                <NavLink
                  icon={<LogOut size={20} />}
                  label="Logout"
                  isActive={false}
                  // onClick={() => handleLogout()} // Add your logout logic here
                />
              </div>
            </div>
          </aside>

          {/* ✨ Main Content Area */}
          <main className="lg:col-span-9">
            {/* The content will dynamically render inside this area */}
            <div className="animate-fadeIn">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// You can keep your view components in separate files as they are.
// Example: ./AccountDetailsView.js
// const AccountDetailsView = () => (
//   <div className="bg-white p-8 rounded-xl shadow-sm">
//     <h2 className="text-2xl font-bold mb-6">Account Details</h2>
//     {/* Form fields go here */}
//   </div>
// );