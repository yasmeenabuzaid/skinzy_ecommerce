"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import BackendConnector from '@/services/connectors/BackendConnector';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Header from '../../components/ui/Header'; // Adjust path if needed
import Footer from '../../components/ui/Footer'; // Adjust path if needed
// --- Icons ---
const Eye = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOff = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('register');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      Swal.fire(t('error'), t('fillAllFields'), 'error');
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire(t('error'), t('passwordMismatch'), 'error');
      return;
    }

    const [firstName, ...rest] = fullName.trim().split(' ');
    const lastName = rest.join(' ') || ' ';

    const registrationData = {
      Fname: firstName,
      Lname: lastName,
      email,
      password,
      password_confirmation: confirmPassword,
    };

    try {
      setLoading(true);
      const data = await BackendConnector.register(registrationData);

      if (data?.success) {
        await Swal.fire({
            title: t('success'), 
            text: t('accountCreated'), 
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        router.push(`/${locale}/auth/login`);
      } else {
        Swal.fire(t('error'), data?.message || t('registrationFailed'), 'error');
      }
    } catch (err) {
      Swal.fire(t('error'), err?.response?.data?.message || t('somethingWentWrong'), 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="text-gray-800">
            <Header />
                  <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-lg">
          <Link href="/" className="text-3xl font-bold text-gray-800 mb-4 block text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Skinzy Care
          </Link>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mt-4">{t('createAccount')}</h2>
          <p className="text-gray-500 text-center mt-2 mb-8">{t('fillInfo')}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              {/* ✨ محاذاة النص لليمين في العربي */}
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1 text-start">{t('fullName')}</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF671F] focus:border-[#FF671F] transition-colors text-start"
                placeholder={t('fullNamePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-start">{t('email')}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF671F] focus:border-[#FF671F] transition-colors text-start"
                placeholder={t('emailPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-start">{t('password')}</label>
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  // ✨ إضافة مساحة للأيقونة
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF671F] focus:border-[#FF671F] transition-colors text-start pe-12"
                  placeholder={t('passwordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  // ✨ تغيير موقع الأيقونة حسب اللغة
                  className="absolute inset-y-0 end-0 pe-4 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label="Toggle password visibility"
                >
                  {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 text-start">{t('confirmPassword')}</label>
              <div className="relative">
                <input
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  // ✨ إضافة مساحة للأيقونة
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF671F] focus:border-[#FF671F] transition-colors text-start pe-12"
                  placeholder={t('confirmPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  // ✨ تغيير موقع الأيقونة حسب اللغة
                  className="absolute inset-y-0 end-0 pe-4 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label="Toggle confirm password visibility"
                >
                  {confirmPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF671F] text-white font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-sm disabled:bg-opacity-70"
              >
                {loading ? t('registering') : t('register')}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            {t('alreadyHaveAccount')}{' '}
            <Link href={`/${locale}/auth/login`} className="font-semibold text-[#FF671F] hover:underline">
              {t('signIn')}
            </Link>
          </p>
        </div>
      </div>
  <Footer />
        </div>  );
};