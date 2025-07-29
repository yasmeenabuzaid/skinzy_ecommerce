"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import storageService from "@/services/storage/storageService";

import AccountPage from "../components/account/AccountPage";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import Link from "next/link";
import { useLocale } from 'next-intl';

export default function Account() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const userInfo = storageService.getUserInfo();

    if (!userInfo?.accessToken) {
      Swal.fire("خطأ", "يجب تسجيل الدخول للوصول إلى هذه الصفحة", "error").then(() => {
        router.push(`/${locale}/auth/login`);
      });
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
