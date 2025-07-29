'use client';
import React from 'react';
import { useOnScreen } from '../../../../hooks/useOnScreen'; 
import useCategoryQuery from '../../../../hooks/useCategoriesQuery'; 
import Link from 'next/link'; 
export default function CategoriesSection() {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    const { categories, isLoadingCategories, errorCategories } = useCategoryQuery();

    return (
        <section
            ref={ref}
            className={`py-20 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
            <div className="container mx-auto px-4 text-center">
                <p className="text-gray-500 mb-1.5">Shop By Categories</p>
                <h2 className="text-4xl font-semibold text-gray-800 mb-12">Our Season Collection</h2>

                {isLoadingCategories && <p className="text-gray-400">Loading categories...</p>}
                {errorCategories && (
                    <p className="text-red-500 text-sm mt-4">{errorCategories}</p>
                )}

                {!isLoadingCategories && categories?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {categories.map((cat) => (
                            <div key={cat.id || cat.name} className="flex flex-col items-center">
                                <div className="w-44 h-44 bg-gray-100 rounded-full flex items-center justify-center mb-5 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                    <img
                                        src={cat.image}
                                        alt={`Image of ${cat.name}`}
                                        className="max-w-[70%] max-h-[70%] object-contain"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">{cat.name}</h3>
                             <Link href={`/category/${cat.slug || cat.id}`} className="text-sm text-gray-500 hover:text-gray-800">
  View all
</Link>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoadingCategories && categories.length === 0 && !errorCategories && (
                    <p className="text-gray-500">No categories found.</p>
                )}
            </div>
        </section>
    );
}
