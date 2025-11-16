// File: app/[locale]/auth/reset-password/page.js

"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import BackendConnector from '@/services/connectors/BackendConnector';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

const ResetPasswordPage = () => {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('resetPassword');
    const searchParams = useSearchParams();

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // عند تحميل الصفحة، نقوم بقراءة الـ token والـ email من رابط الـ URL
    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        const emailFromUrl = searchParams.get('email');
        if (tokenFromUrl && emailFromUrl) {
            setToken(tokenFromUrl);
            setEmail(emailFromUrl);
        } else {
            // إذا لم يكن الرابط يحتوي على البيانات، أظهر خطأ
            Swal.fire(t('error'), t('invalidLink'), 'error');
            router.push(`/${locale}/auth/login`);
        }
    }, [searchParams, router, locale, t]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            Swal.fire(t('error'), t('passwordsDoNotMatch'), 'error');
            return;
        }
        if (password.length < 8) {
            Swal.fire(t('error'), t('passwordTooShort'), 'error');
            return;
        }

        try {
            setLoading(true);
            const response = await BackendConnector.resetPassword({
                email,
                token,
                password,
                password_confirmation: passwordConfirmation
            });

            if (response?.success) {
                Swal.fire({
                    title: t('successTitle'),
                    text: t('successText'),
                    icon: 'success',
                }).then(() => {
                    router.push(`/${locale}/auth/login`); // توجيه المستخدم لصفحة الدخول
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">{t('newPassword')}</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF671F] focus:border-[#FF671F]"
                            />
                        </div>
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">{t('confirmPassword')}</label>
                            <input
                                type="password"
                                id="password_confirmation"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#FF671F] focus:border-[#FF671F]"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading || !token} // الزر معطل حتى يتم تحميل التوكن
                                className="w-full bg-[#FF671F] text-white font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-sm disabled:bg-gray-400"
                            >
                                {loading ? t('updating') : t('updatePassword')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;