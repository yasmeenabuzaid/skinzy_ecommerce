'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useOnScreen } from '../../../../hooks/useOnScreen'; 
import { promoCards } from '../../../../lib/data'; 

const ArrowRight = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);


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
              className="relative h-80 rounded-xl cursor-pointer overflow-hidden shadow-lg group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                style={{ backgroundImage: `url(${promo.image})` }}
              ></div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent transition-opacity"></div>

              <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white transition-transform duration-500 ease-in-out transform group-hover:-translate-y-4">
                <h3 className="text-3xl font-bold mb-3 drop-shadow-md">{promo.title}</h3>
                <div className="flex items-center justify-start text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
