"use client";
import Link from "next/link";

export default function Breadcrumbs({ productName }) {
  return (
    <nav className="text-sm text-gray-500 mb-8">
      <Link href="/" className="hover:underline">Home</Link>
      <span className="mx-2">/</span>
      <span>{productName}</span>
    </nav>
  );
}
