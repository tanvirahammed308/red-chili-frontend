// components/admin/products/Pagination.tsx
"use client";

import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8">
      <div className="flex justify-center items-center gap-2 flex-wrap">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg border border-red-300 hover:bg-red-50 transition disabled:opacity-50"
        >
          <FaAngleDoubleLeft className="text-red-600" />
          <span className="hidden sm:inline ml-1">First</span>
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg border border-red-300 hover:bg-red-50 transition disabled:opacity-50"
        >
          <FaChevronLeft className="text-red-600" />
          <span className="hidden sm:inline ml-1">Prev</span>
        </button>

        <div className="flex gap-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] h-10 px-3 py-2 rounded-lg font-medium transition ${
                currentPage === page
                  ? "bg-red-600 text-white shadow-md"
                  : "border border-red-300 text-red-700 hover:bg-red-50"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg border border-red-300 hover:bg-red-50 transition disabled:opacity-50"
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <FaChevronRight className="text-red-600" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg border border-red-300 hover:bg-red-50 transition disabled:opacity-50"
        >
          <span className="hidden sm:inline mr-1">Last</span>
          <FaAngleDoubleRight className="text-red-600" />
        </button>
      </div>
    </div>
  );
}