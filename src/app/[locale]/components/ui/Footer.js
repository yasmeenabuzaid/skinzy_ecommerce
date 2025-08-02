'use client';
import React from 'react';
import { useOnScreen } from '../../../../hooks/useOnScreen';
import { Twitter, Facebook, Instagram, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const [ref] = useOnScreen({ threshold: 0.1 });

  return (
    <footer ref={ref} className="bg-gray-100 pt-20 mt-10 transition-all duration-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16">
          <div>
            <h3 className="text-lg font-semibold mb-5">Don&apos;t miss offer</h3>
            <form className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full py-3 pl-5 pr-12 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#ef8172] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-[#ef8172] transition-colors"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5">Quick links</h3>
            <ul className="space-y-2.5">
              {['Search', 'About Us', 'Contact', 'Faq'].map(link => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(/\s+/g, '')}`} className="text-gray-500 hover:text-gray-800 text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5">Store policy</h3>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Refund Policy', 'Shipping Policy'].map(link => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(/\s+/g, '')}`} className="text-gray-500 hover:text-gray-800 text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5">Company</h3>
            <address className="text-gray-500 text-sm not-italic leading-relaxed space-y-2">
              <p>99 New Theme St. XY, USA 12345</p>
              <Link href="mailto:demo@example.com" className="hover:text-gray-800">demo@example.com</Link><br />
              <Link href="tel:+0123456789" className="hover:text-gray-800">+01 123 456 789</Link>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <Link href="#" aria-label="Twitter" className="hover:text-gray-800"><Twitter size={18} /></Link>
            <Link href="#" aria-label="Facebook" className="hover:text-gray-800"><Facebook size={18} /></Link>
            <Link href="#" aria-label="Instagram" className="hover:text-gray-800"><Instagram size={18} /></Link>
          </div>
          <p>© Skinzy Care. All Rights Reserved.</p>
          <img src="https://i.imgur.com/2Y0wS3n.png" alt="Payment methods" className="h-6" />
        </div>
      </div>
    </footer>
  );
}
