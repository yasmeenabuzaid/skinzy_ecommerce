'use client';
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-10 right-10 w-11 h-11 bg-[#FF671F] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-30 ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
            <ChevronUp size={20} />
        </button>
    );
};