"use client";
export default function ProductDescriptionSection({ description }) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <button className="bg-[#d77979] text-white px-6 py-2 rounded-md font-semibold transition">
            Description
          </button>
        </div>
        <div className="max-w-4xl mx-auto text-center text-gray-600 leading-relaxed">
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
}
