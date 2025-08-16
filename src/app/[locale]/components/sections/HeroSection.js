'use client';
import React from 'react';
import { useLocale, useTranslations } from "next-intl";

// Chevron icons مع دعم RTL
const ChevronLeft = ({ isRTL, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    style={{ transform: isRTL ? 'scaleX(-1)' : 'scaleX(1)' }} 
    {...props}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = ({ isRTL, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    style={{ transform: isRTL ? 'scaleX(-1)' : 'scaleX(1)' }}
    {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

function HeroSection() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const heroSlides = [
    {
      image: '/hero1.png',
      offer: t("slides.0.offer"),
      title: t("slides.0.title"),
      description: t("slides.0.description"),
      buttonText: t("slides.0.buttonText"),
    },
    {
      image: '/hero2.png',
      offer: t("slides.1.offer"),
      title: t("slides.1.title"),
      description: t("slides.1.description"),
      buttonText: t("slides.1.buttonText"),
    },
    
  ];
  
  const nextSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  React.useEffect(() => {
    const slideInterval = setInterval(nextSlide, 7000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  return (
    <section className="relative h-[calc(100vh-136px)] min-h-[500px] w-full overflow-hidden bg-gray-100 group">
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div
              className={`max-w-lg transition-all duration-1000 ease-in-out text-center ${
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              } ${
                isRTL
                  ? 'lg:mr-[12%] lg:text-right' 
                  : 'lg:ml-[12%] lg:text-left'
              }`}
            >
              {/* الخط أسود بدرجات راقية */}
              <p className="text-[#444444] font-medium mb-2 text-lg">{slide.offer}</p>
              
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-black mb-5 tracking-wide">
                {slide.title}
              </h1>
              
              <p className="text-gray-700 mb-8 text-base leading-relaxed">{slide.description}</p>
              
              <a
                href={`/${locale}/subcategory`}
                className="inline-block bg-white text-black font-semibold py-3 px-8 rounded-full border border-black hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {slide.buttonText}
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* الأسهم */}
      <button
        onClick={prevSlide}
        className={`absolute top-1/2 -translate-y-1/2 w-11 h-11 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 ease-in-out flex items-center justify-center hover:bg-black/70 z-20 ${
          isRTL ? 'right-4 md:right-10' : 'left-4 md:left-10'
        }`}
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} isRTL={isRTL} />
      </button>

      <button
        onClick={nextSlide}
        className={`absolute top-1/2 -translate-y-1/2 w-11 h-11 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 ease-in-out flex items-center justify-center hover:bg-black/70 z-20 ${
          isRTL ? 'left-4 md:left-10' : 'right-4 md:right-10'
        }`}
        aria-label="Next Slide"
      >
        <ChevronRight size={24} isRTL={isRTL} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-black scale-125' : 'bg-gray-400 hover:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="font-sans">
      <HeroSection />
    </div>
  );
}
