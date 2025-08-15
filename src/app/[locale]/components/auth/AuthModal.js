import { useState } from 'react';
import Swal from 'sweetalert2';
import BackendConnector from '@/services/connectors/BackendConnector';
import storageService from '@/services/storage/storageService';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
    const [isLoginView, setIsLoginView] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const t = useTranslations('auth');

    if (!isOpen) return null;

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setFullName('');
        setLoading(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            Swal.fire("خطأ", t('fillAllFields'), 'warning');
            return;
        }
        setLoading(true);
        try {
            const response = await BackendConnector.login({ email, password });
            if (response?.success) {
                storageService.setUserInfo({ accessToken: response.accessToken, user: response.user });
                resetForm();
                onAuthSuccess();
            } else {
                Swal.fire("خطأ", response?.message || t('loginFail'), 'error');
            }
        } catch {
            Swal.fire("خطأ", "حدث خطأ غير متوقع", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!fullName || !email || !password) {
            Swal.fire("خطأ", t('fillAllFields'), 'warning');
            return;
        }
        const [firstName, ...rest] = fullName.trim().split(' ');
        const lastName = rest.join(' ') || ' ';
        setLoading(true);
        try {
            const response = await BackendConnector.register({
                Fname: firstName,
                Lname: lastName,
                email,
                password,
                password_confirmation: password
            });
            if (response?.success) {
                Swal.fire("نجاح!", t('registerSuccess'), 'success');
                setIsLoginView(true);
            } else {
                Swal.fire("خطأ", response?.message || t('registerFail'), 'error');
            }
        } catch {
            Swal.fire("خطأ", "حدث خطأ غير متوقع أثناء التسجيل", 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative transform transition-all duration-300 scale-100">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
                    <X size={24} />
                </button>

                <div className="flex border-b mb-6">
                    <button onClick={() => setIsLoginView(true)} className={`flex-1 py-3 font-semibold text-center transition-colors ${isLoginView ? 'text-[#FF671F] border-b-2 border-[#FF671F]' : 'text-gray-500 hover:text-gray-800'}`}>
                        {t('loginBtn')}
                    </button>
                    <button onClick={() => setIsLoginView(false)} className={`flex-1 py-3 font-semibold text-center transition-colors ${!isLoginView ? 'text-[#FF671F] border-b-2 border-[#FF671F]' : 'text-gray-500 hover:text-gray-800'}`}>
                        {t('registerBtn')}
                    </button>
                </div>

                {isLoginView ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-gray-800">{t('loginTitle')}</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('emailLabel')}</label>
                            <input type="email" placeholder={t('loginPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF671F] focus:border-[#FF671F]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('passwordLabel')}</label>
                            <input type="password" placeholder={t('passwordPlaceholder')} value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF671F] focus:border-[#FF671F]" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-[#FF671F] text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-md">
                            {loading ? '...جاري الدخول' : t('loginBtn')}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-gray-800">{t('registerTitle')}</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('fullNameLabel')}</label>
                            <input type="text" placeholder={t('fullNamePlaceholder')} value={fullName} onChange={e => setFullName(e.target.value)} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF671F] focus:border-[#FF671F]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('emailLabel')}</label>
                            <input type="email" placeholder={t('loginPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF671F] focus:border-[#FF671F]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('passwordLabel')}</label>
                            <input type="password" placeholder={t('passwordPlaceholder')} value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF671F] focus:border-[#FF671F]" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-[#FF671F] text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-md">
                            {loading ? '...جاري التسجيل' : t('registerBtn')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
