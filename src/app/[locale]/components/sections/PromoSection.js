'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useOnScreen } from '../../../../hooks/useOnScreen'; // Adjust path
import { promoCards } from '../../../../lib/data'; // Adjust path

export default function PromoSection() {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  const router = useRouter();
  const locale = useLocale();

  const handleClick = (promo) => {
    router.push(`/${locale}/subcategory`);
  };

  return (
    <section
      ref={ref}
      className={`pb-20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promoCards.map((promo) => (
            <div
              key={promo.title}
              onClick={() => handleClick(promo)}
              className="relative h-72 bg-cover bg-center bg-gray-100 p-8 flex flex-col justify-start items-start rounded-lg cursor-pointer"
              style={{ backgroundImage: `url(${promo.image})` }}
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold text-gray-900 max-w-[80%] leading-snug mb-4">
                  {promo.title}
                </h3>
                <span className="text-sm font-medium text-gray-900 underline hover:text-black">
                  Shop Now
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
