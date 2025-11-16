"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackendConnector from '@/services/connectors/BackendConnector';
import { useLocale, useTranslations } from 'next-intl';
import storageService from '@/services/storage/storageService';
import Link from 'next/link';

// --- Icons ---
const Eye = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const EyeOff = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
);

export default function LoginPage() {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('login');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email || !password) {
            setError(t('fillAllFields'));
            return;
        }

        try {
            setLoading(true);
            const response = await BackendConnector.login({ email, password });
            console.log('Login response:', response);

            if (response?.status) {
                storageService.setUserInfo({
                    accessToken: response.accessToken,
                    user: response.data,
                });

                setMessage(t('loginSuccess'));

                setTimeout(() => {
                    router.replace(`/${locale}`);
                }, 1500);
            } else {
                setError(response?.message || t('failed'));
            }
        } catch (err) {
            setError(err?.response?.data?.message || t('failed'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-gray-800">
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-lg">
                    <Link href="/" className="text-3xl font-bold text-gray-800 mb-4 block text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Skinzy Care
                    </Link>

                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mt-4">{t('welcomeBack')}</h2>
                    <p className="text-gray-500 text-center mt-2 mb-8">{t('subtitle')}</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-start">{t('email')}</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF671F] focus:border-[#FF671F] transition-colors text-start"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('password')}</label>
                                <Link href={`/${locale}/auth/forgot`} className="text-sm text-[#FF671F] hover:underline">{t('forgotPassword')}</Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF671F] focus:border-[#ff8c57] transition-colors text-start pe-12"
                                    placeholder={t('password')}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 end-0 px-4 flex items-center text-gray-500 hover:text-gray-700"
                                    aria-label="Toggle password visibility"
                                >
                                    {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#FF671F] text-white font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-sm disabled:bg-opacity-70"
                            >
                                {loading ? t('signingIn') : t('signIn')}
                            </button>
                        </div>

                        {/* رسائل الخطأ أو النجاح */}
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                        {message && <p className="text-green-500 text-center mt-4">{message}</p>}
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-8">
                        {t('noAccount')}{' '}
                        <Link href={`/${locale}/auth/register`} className="font-semibold text-[#FF671F] hover:underline">{t('createAccount')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
