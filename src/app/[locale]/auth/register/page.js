"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import BackendConnector from '@/services/connectors/BackendConnector';
import { useLocale } from 'next-intl';

// Eye Icons
const Eye = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOff = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const RegisterPage = () => {
  const router = useRouter();
  const locale = useLocale();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
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

    if (!fullName || !phone || !email || !password || !confirmPassword) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire('Error', 'Passwords do not match', 'error');
      return;
    }

    const [firstName, ...rest] = fullName.trim().split(' ');
    const lastName = rest.join(' ') || ' ';

    const registrationData = {
      Fname: firstName,
      Lname: lastName,
      mobile: phone,
      email,
      password,
      password_confirmation: confirmPassword,
    };

    try {
      setLoading(true);
      const data = await BackendConnector.register(registrationData);

      if (data?.success) {
        Swal.fire('Success', 'Account created successfully!', 'success');
        router.push(`/${locale}/auth/login`);
      } else {
        Swal.fire('Error', data?.message || 'Registration failed', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Something went wrong. Try again.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-800">
      <Header />

      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto lg:grid rounded-2xl overflow-hidden">
          <div className="p-8 md:p-12 bg-white flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <a href="#" className="text-3xl font-bold text-gray-800 mb-4 block text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Essentia
              </a>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mt-4">Create your account</h2>
              <p className="text-gray-500 text-center mt-2 mb-8">Fill in the information below to get started.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#ef8172] focus:border-[#ef8172] transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#ef8172] focus:border-[#ef8172] transition-colors"
                    placeholder="e.g. 0790000000"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#ef8172] focus:border-[#ef8172] transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#ef8172] focus:border-[#ef8172] transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500 hover:text-gray-700"
                      aria-label="Toggle password visibility"
                    >
                      {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#ef8172] focus:border-[#ef8172] transition-colors"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500 hover:text-gray-700"
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
                    className="w-full bg-[#ef8172] text-white font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-sm"
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
              </form>

              <p className="text-center text-sm text-gray-600 mt-8">
                Already have an account?{' '}
                <a href={`/${locale}/auth/login`} className="font-semibold text-[#ef8172] hover:underline">Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Wrapper
export default function App() {
  return (
    <div className="font-sans bg-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <RegisterPage />
    </div>
  );
}
