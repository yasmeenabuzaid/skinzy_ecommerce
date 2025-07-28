'use client';
import React from 'react';
import { useOnScreen } from '../../../../hooks/useOnScreen';

export default function DealOfTheDaySection() {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className={`py-20 bg-[#f8f9fa] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="container mx-auto px-4 max-w-screen-xl grid grid-cols-1 md:grid-cols-2 items-center gap-20">

        <div className="flex justify-start">
          <div className="w-full aspect-square overflow-hidden rounded-xl">
            <img
              src="https://images.pexels.com/photos/7262995/pexels-photo-7262995.jpeg"
              alt="Radiant Glow Face Serum"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* --- عامود النص --- */}
        <div className="text-center md:text-left">
          <p className="text-gray-500 mb-3 text-sm tracking-wider">DEAL OF THE DAYS</p>
          <h2 className="text-4xl font-semibold text-gray-800 leading-tight mb-4">
            Radiant Glow Face Serum
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 max-w-lg">
            Lorem Ipsum is simply dummy text of the printing industry, reoym Ipsum has been the industry's standard dummy text ever since the 1500s.
          </p>
          <a
            href="#"
            className="inline-block bg-white text-gray-800 font-medium py-2.5 px-8 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            Discover More
          </a>
        </div>

      </div>
    </section>
  );
}
