import React from 'react';

const SearchIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default function SearchBar({ onSearchClick }) {
  return (
    <button
      aria-label="Search"
      className="text-gray-700 hover:text-black transition-transform hover:scale-110 cursor-pointer"
      onClick={onSearchClick}
    >
      <SearchIcon size={20} />
    </button>
  );
}
