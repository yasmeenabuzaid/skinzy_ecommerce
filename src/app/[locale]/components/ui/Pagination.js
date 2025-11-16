'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        // منطق لعرض أرقام الصفحات بشكل ذكي (مثلاً: 1 ... 4 5 6 ... 10)
        // للتبسيط، سنعرض كل الأرقام إذا كانت قليلة
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <nav className="flex items-center justify-center space-x-2">
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
                <ChevronLeft size={20} />
            </button>

            {getPageNumbers().map((page, index) =>
                typeof page === 'number' ? (
                    <button
                        key={index}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 text-sm rounded-md ${
                            currentPage === page
                                ? 'bg-orange-500 text-white font-bold'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={index} className="px-4 py-2 text-sm">
                        {page}
                    </span>
                )
            )}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
                <ChevronRight size={20} />
            </button>
        </nav>
    );
};

export default Pagination;
