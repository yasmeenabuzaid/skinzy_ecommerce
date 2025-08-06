import React from 'react';

const SearchIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MobileSearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function SearchBar({ onSearchClick }) {
  return (
    <button
      aria-label="Search"
      className="text-gray-700 hover:text-black transition-transform hover:scale-110 cursor-pointer"
      onClick={onSearchClick}
    >
      <span className="block md:hidden">
        <MobileSearchIcon />
      </span>

      <span className="hidden md:block">
        <SearchIcon className="w-6 h-6" />
      </span>
    </button>
  );
}
