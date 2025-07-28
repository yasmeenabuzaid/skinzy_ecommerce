
// -----------------------------------------------------------------------------

// components/sections/TestimonialSection.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { useOnScreen } from '../../../../hooks/useOnScreen'; // Adjust path

export default function TestimonialSection() {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    const [currentSlide, setCurrentSlide] = useState(0);
    const testimonials = [
        { quote: "Lorem ipsum dolor sit amet, consectetur adiping elitought Cras lacinia magna sed lectus iaculis fringilla.", name: "Manager", title: "PETER, ENGLAND", avatar: "https://i.imgur.com/5D0g821.png" },
        { quote: "This is the best cosmetic product I have ever used. It feels amazing on the skin and the results are visible within a week!", name: "Jane Doe", title: "Beauty Blogger", avatar: "https://i.imgur.com/5D0g821.png" },
        { quote: "I highly recommend Essentia to all my friends and family. The quality is unmatched and the prices are great.", name: "Sarah Smith", title: "Satisfied Customer", avatar: "https://i.imgur.com/5D0g821.png" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <section ref={ref} className={`bg-gray-100 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 items-center">
                <div className="h-full w-full min-h-[400px]">
                    <img src="https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg" alt="Hand holding a serum dropper" className="w-full h-full object-cover" />
                </div>
                <div className="p-8 md:p-16">
                    <div className="relative h-48">
                        {testimonials.map((t, index) => (
                            <div key={index} className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                                <p className="text-xl text-gray-800 leading-relaxed mb-8">&quot;{t.quote}&quot;</p>
                                <div className="flex items-center gap-5">
                                    <img src={t.avatar} alt="Author avatar" className="rounded-full w-[60px] h-[60px]" />
                                    <div>
                                        <span className="font-semibold text-gray-900">{t.name}</span>
                                        <span className="block text-xs text-gray-500 uppercase tracking-wider">{t.title}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2.5 mt-10">
                        {testimonials.map((_, index) => (
                            <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-black' : 'bg-gray-400'}`} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};