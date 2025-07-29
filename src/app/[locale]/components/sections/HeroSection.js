import React from 'react';
import { useLocale } from "next-intl";

const ChevronLeft = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const heroSlides = [
  {
    image: 'https://images.pexels.com/photos/3609620/pexels-photo-3609620.jpeg',
    offer: 'Special Offer',
    title: 'Get Flat 25% OFF Cosmetic Sets!',
    description: 'Your little one will love creating their own course with this mini toy set.',
    buttonText: 'Shop Now',
  },
  {
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1887&auto=format&fit=crop',
    offer: 'New Arrivals',
    title: 'Discover Our Latest Collection',
    description: 'Premium quality products for your daily skincare routine.',
    buttonText: 'Explore More',
  },
  {
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=2070&auto=format&fit=crop',
    offer: 'Limited Time',
    title: 'Summer Sale is Here!',
    description: "Get up to 50% off on selected items",
    buttonText: 'View Deals',
  },
];

function HeroSection() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const locale = useLocale();

  const nextSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

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
          <div className="absolute inset-0"></div>

          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div
              className={`max-w-lg ml-0 lg:ml-[12%] text-center lg:text-left transition-all duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <p className="text-gray-800 font-medium mb-2 text-lg">{slide.offer}</p>
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900 mb-5">
                {slide.title}
              </h1>
              <p className="text-gray-700 mb-8 text-base">{slide.description}</p>
              <a
                href={`/${locale}/subcategory`}
                className="inline-block bg-white text-gray-800 font-semibold py-3 px-8 rounded-full border border-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {slide.buttonText}
              </a>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 left-4 md:left-10 w-11 h-11 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 ease-in-out flex items-center justify-center hover:bg-black/70 z-20"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-4 md:right-10 w-11 h-11 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 ease-in-out flex items-center justify-center hover:bg-black/70 z-20"
        aria-label="Next Slide"
      >
        <ChevronRight size={24} />
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
