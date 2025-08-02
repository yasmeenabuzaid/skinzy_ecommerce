'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

const useOnScreen = (options) => {
    const ref = useRef(null);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasBeenVisible) {
                setHasBeenVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        const currentRef = ref.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [options, hasBeenVisible]);

    return [ref, hasBeenVisible];
};

const AnimatedSection = ({ children, className = '' }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    return (
        <section
            ref={ref}
            className={`${className} transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
            {children}
        </section>
    );
};

const DiscoverSection = () => {
    const locale = useLocale();
    const t = useTranslations('discoverSection');

    // نصوص وصور عربية وإنجليزية
    const content = [
        {
            image:
                locale === 'ar'
                    ? 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                    : 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // ممكن تستبدل بصورة عربية خاصة لو عندك
            alt: locale === 'ar' ? 'امرأة تمسك عبوة تجميل' : 'Woman holding a cosmetic jar',
            title: locale === 'ar' ? 'جودة وراحة لأطفالك.' : 'Quality and comfort for your kids.',
            linkText: t('shopToLook'),
        },
        {
            image:
                locale === 'ar'
                    ? 'https://images.pexels.com/photos/7262911/pexels-photo-7262911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                    : 'https://images.pexels.com/photos/7262911/pexels-photo-7262911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // ممكن صورة عربية
            alt: locale === 'ar' ? 'امرأة تضع منتج تجميل' : 'Woman applying a cosmetic product',
            title: locale === 'ar' ? 'حقق أماني أطفالك.' : 'Make the wishes of your babies a reality.',
            linkText: t('shopToLook'),
        },
    ];

    return (
        <AnimatedSection className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <p className="text-gray-500 mb-1.5">{t('latestCollection')}</p>
                    <h2 className="text-4xl font-semibold text-gray-800">{t('moreToDiscover')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {content.map(({ image, alt, title, linkText }, index) => (
                        <div key={index} className="text-center">
                            <Link href="/shop" className="block mb-6 group overflow-hidden rounded-lg">
                                <img
                                    src={image}
                                    alt={alt}
                                    className="w-full h-auto object-cover aspect-[16/10] transition-transform duration-300 group-hover:scale-105"
                                />
                            </Link>
                            <h3 className="text-xl font-medium text-gray-800 mb-3">{title}</h3>
                            <Link
                                href="/shop"
                                className="font-medium text-gray-800 underline hover:text-[#ef8172] transition-colors text-sm"
                            >
                                {linkText}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};

export default function App() {
    return (
        <div className="font-sans bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <main>
                <DiscoverSection />
            </main>
        </div>
    );
}
