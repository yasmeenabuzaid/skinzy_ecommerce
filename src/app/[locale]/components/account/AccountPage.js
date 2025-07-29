"use client";

import React, { useState } from "react";
import AccountDetailsView from "./AccountDetailsView";
import AddressesView from "./AddressesView";
import AddAddressView from "./AddAddressView";
import Link from "next/link";

export default function AccountPage() {
  const [view, setView] = useState("account");

  const renderContent = () => {
    switch (view) {
      case "addresses":
        return <AddressesView onBack={() => setView("account")} onAddAddress={() => setView("addAddress")} />;
      case "addAddress":
        return <AddAddressView onCancel={() => setView("addresses")} />;
      default:
        return <AccountDetailsView onViewAddresses={() => setView("addresses")} />;
    }
  };

  return (
    <div className="bg-white text-gray-800 font-sans min-h-screen">
      <header className="border-b border-gray-200">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
           <Link href="/" className="text-sm text-gray-600 hover:text-black transition-colors">
  Home
</Link>

          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 my-12 lg:my-16">
        {renderContent()}
      </main>
    </div>
  );
}
