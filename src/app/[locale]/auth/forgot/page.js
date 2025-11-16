// File Location: app/[locale]/auth/forgot/page.js

"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import BackendConnector from '@/services/connectors/BackendConnector';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

const ForgotPasswordPage = () => {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('forgotPassword'); // Assuming you have translations for this page

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            Swal.fire(t('error'), t('emailRequired'), 'error');
            return;
        }

        try {
            setLoading(true);
        const response = await BackendConnector.forgotPassword({ email, locale });

            if (response?.success) {
                Swal.fire({
                    title: t('successTitle'),
                    text: t('successText'), // e.g., "A password reset link has been sent to your email."
                    icon: 'success',
                    confirmButtonText: t('ok'),
                });
            } else {
                 Swal.fire(t('error'), response?.message || t('failed'), 'error');
            }
        } catch (err) {
            Swal.fire(t('error'), t('failed'), 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-gray-800">
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center">{t('title')}</h2>
                    <p className="text-gray-500 text-center mt-2 mb-8">{t('subtitle')}</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF671F] focus:border-[#FF671F] transition-colors"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#FF671F] text-white font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-sm disabled:bg-gray-400"
                            >
                                {loading ? t('sending') : t('sendLink')}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-8">
                        <Link href={`/${locale}/auth/login`} className="font-semibold text-[#FF671F] hover:underline">
                            {t('backToLogin')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;