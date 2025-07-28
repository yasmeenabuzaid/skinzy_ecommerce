"use client";
export default function Breadcrumbs({ productName }) {
  return (
    <nav className="text-sm text-gray-500 mb-8">
      <a href="/" className="hover:underline">Home</a>
      <span className="mx-2">/</span>
      <span>{productName}</span>
    </nav>
  );
}
