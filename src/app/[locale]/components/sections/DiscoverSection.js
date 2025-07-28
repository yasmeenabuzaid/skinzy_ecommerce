import React, { useState, useEffect, useRef } from 'react';

// --- Hooks ---
// Hook مخصص لمعرفة ما إذا كان العنصر ظاهرًا على الشاشة
const useOnScreen = (options) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            // تحديث الحالة عندما يتقاطع العنصر مع منفذ العرض
            if (entry.isIntersecting) {
                setIsVisible(true);
                // اختياري: إيقاف المراقبة بعد أن يصبح العنصر مرئيًا لمنع إعادة التشغيل
                if (entry.target) {
                   observer.unobserve(entry.target);
                }
            }
        }, options);

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
};

// --- المكونات المساعدة ---

// مكون لإضافة تأثيرات الحركة عند ظهور الأقسام
const AnimatedSection = ({ children, className = '' }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1, triggerOnce: true });
    return (
        <section 
            ref={ref} 
            className={`${className} transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            {children}
        </section>
    );
};


// --- مكون قسم "اكتشف المزيد" ---
const DiscoverSection = () => (
    <AnimatedSection className="py-20">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <p className="text-gray-500 mb-1.5">Latest Collection</p>
                <h2 className="text-4xl font-semibold text-gray-800">More To Discover</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* البطاقة الأولى */}
                <div className="text-center">
                    <a href="#" className="block mb-6 group overflow-hidden rounded-lg">
                        <img 
                            src="https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                            alt="Woman holding a cosmetic jar" 
                            className="w-full h-auto object-cover aspect-[16/10] transition-transform duration-300 group-hover:scale-105" 
                        />
                    </a>
                    <h3 className="text-xl font-medium text-gray-800 mb-3">Quality and comfort for your kids.</h3>
                    <a href="#" className="font-medium text-gray-800 underline hover:text-[#ef8172] transition-colors text-sm">Shop To Look</a>
                </div>
                {/* البطاقة الثانية */}
                <div className="text-center">
                    <a href="#" className="block mb-6 group overflow-hidden rounded-lg">
                        <img 
                            src="https://images.pexels.com/photos/7262911/pexels-photo-7262911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                            alt="Woman applying a cosmetic product" 
                            className="w-full h-auto object-cover aspect-[16/10] transition-transform duration-300 group-hover:scale-105" 
                        />
                    </a>
                    <h3 className="text-xl font-medium text-gray-800 mb-3">Make the wishes of your babies a reality.</h3>
                    <a href="#" className="font-medium text-gray-800 underline hover:text-[#ef8172] transition-colors text-sm">Shop To Look</a>
                </div>
            </div>
        </div>
    </AnimatedSection>
);


// --- المكون الرئيسي للتطبيق (لعرض القسم) ---
export default function App() {
    return (
        <div className="font-sans bg-white" style={{fontFamily: "'Poppins', sans-serif"}}>
            <main>
              <DiscoverSection />
            </main>
        </div>
    );
}
