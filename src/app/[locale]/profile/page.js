"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import storageService from "@/services/storage/storageService";

import AccountPage from "../components/account/AccountPage";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { useLocale } from 'next-intl';

export default function Account() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const userInfo = storageService.getUserInfo();

    if (!userInfo?.accessToken) {
      router.replace(`/${locale}/auth/login`);
    }
  }, []);

  return (
    <div className="text-gray-800">
      <Header />
      <AccountPage />
      <Footer />
    </div>
  );
}
