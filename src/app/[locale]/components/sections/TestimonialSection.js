'use client';
import React, { useState, useEffect } from 'react';
import { useOnScreen } from '../../../../hooks/useOnScreen';
import { useLocale } from 'next-intl';
import Image from 'next/image';

const QuoteIcon = (props) => (
  <svg
    viewBox="0 0 40 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0 34V16.3636L10.9091 0H18.1818L10.9091 16.3636H20V34H0ZM20 34V16.3636L30.9091 0H38.1818L30.9091 16.3636H40V34H20Z"
      fill="currentColor"
    />
  </svg>
);

export default function TestimonialSection() {
  const locale = useLocale();
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = {
    en: [
      {
        quote:
          'This is the best cosmetic product I have ever used. It feels amazing on the skin and the results are visible within a week!',
        name: 'Jane Doe',
        title: 'Beauty Blogger',
        avatar:
          'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
      {
        quote:
          'I highly recommend this skincare line to all my friends and family. The quality is unmatched and the prices are great.',
        name: 'Sarah Smith',
        title: 'Satisfied Customer',
        avatar:
          'https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
      {
        quote:
          'A true game-changer for my daily routine. My skin has never looked better. Absolutely worth every penny!',
        name: 'Emily Johnson',
        title: 'Skincare Enthusiast',
        avatar:
          'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
    ],
    ar: [
      {
        quote:
          'يا جماعة هالمنتج رهيب! أول مرة بحس بشي هيك ناعم ومريح عالبشرة، والنتيجة بتبين بسرعة!',
        name: 'هند علي',
        title: 'مدونة جمال',
        avatar:
          'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
      {
        quote:
          'بنصح الكل يجرب منتجات العناية هذه. الجودة بتجنن والأسعار بتناسب الكل.',
        name: 'ليلى أحمد',
        title: 'زبونة راضية',
        avatar:
          'https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
      {
        quote:
          'غيّر روتيني اليومي للأفضل. بشرتي ما كانت أحلى من هيك. بصراحة بيستاهل كل قرش!',
        name: 'سارة محمد',
        title: 'مهتمة بالعناية بالبشرة',
        avatar:
          'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
    ],
  };

  const localizedTestimonials = testimonials[locale] || testimonials.en;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % localizedTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [localizedTestimonials.length]);

  return (
    <section
      ref={ref}
      className={`bg-[#ffffff] transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 items-center">
        <div className="h-full w-full min-h-[450px] lg:min-h-[600px] relative">
          <Image
            src="https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg"
            alt="Serum bottle held in hand"
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
        </div>
        <div className="p-8 md:p-16 relative">
          <QuoteIcon className="absolute top-8 right-8 w-16 h-16 text-gray-200/50" />
          <div className="relative min-h-[250px]">
            {localizedTestimonials.map((t, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden relative">
                    <Image
                      src={t.avatar}
                      alt={`Avatar of ${t.name}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 text-sm md:text-base">{t.name}</span>
                    <span className="block text-xs text-gray-500">{t.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2.5 mt-10">
            {localizedTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-[#FF671F] w-8' : 'bg-gray-300 w-4'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
