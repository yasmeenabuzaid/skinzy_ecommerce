
// components/ui/Footer.jsx
import React from 'react';
import { useOnScreen } from '../../../../hooks/useOnScreen'; // Adjust path
import { Twitter, Facebook, Instagram, ArrowRight } from 'lucide-react';

export default function Footer() {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    return (
        <footer ref={ref} className={`bg-gray-100 pt-20 transition-all duration-700 mt-10`}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16">
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-semibold mb-5">Don&quot;t miss offer</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-5">Enter Your email below to be the first to new collection and product launches.</p>
                        <form className="relative">
                            <input type="email" placeholder="Email" className="w-full py-3 pl-5 pr-12 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#ef8172] focus:outline-none" />
                            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-[#ef8172] transition-colors"><ArrowRight size={18} /></button>
                        </form>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-5">Quick links</h3>
                        <ul className="space-y-2.5">
                            {['Search', 'About Us', 'Contact', 'Faq', 'Blogs'].map(link => <li key={link}><a href="#" className="text-gray-500 hover:text-gray-800 text-sm">{link}</a></li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-5">Store policy</h3>
                        <ul className="space-y-2.5">
                            {['Contact Information', 'Privacy Policy', 'Refund Policy', 'Shipping Policy', 'Terms Of Service'].map(link => <li key={link}><a href="#" className="text-gray-500 hover:text-gray-800 text-sm">{link}</a></li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-5">Company</h3>
                        <address className="text-gray-500 text-sm not-italic leading-relaxed space-y-2">
                            <p>99 New Theme St. XY, USA 12345, Beside The Sun Point Land.</p>
                            <a href="mailto:demo@example.com" className="hover:text-gray-800">demo@example.com</a><br/>
                            <a href="tel:+0123456789" className="hover:text-gray-800">+01 123 456 789</a>
                        </address>
                    </div>
                </div>
                <div className="border-t border-gray-200 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                        <a href="#" aria-label="Twitter" className="hover:text-gray-800"><Twitter size={18} /></a>
                        <a href="#" aria-label="Facebook" className="hover:text-gray-800"><Facebook size={18} /></a>
                        <a href="#" aria-label="Instagram" className="hover:text-gray-800"><Instagram size={18} /></a>
                    </div>
                    <p>Powered by Shopify © 2025, Essentia (Password : 9)</p>
                    <img src="https://i.imgur.com/2Y0wS3n.png" alt="Payment methods" className="h-6" />
                </div>
            </div>
        </footer>
    );
};

// -----------------------------------------------------------------------------
