// components/products/FilterAccordion.jsx
"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FilterAccordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-b py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left font-semibold text-gray-800"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
}
