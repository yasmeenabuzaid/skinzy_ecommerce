"use client";
import React, { useState } from "react";

export default function ProductDescriptionSection({ description, specifications }) {
  console.log("spec",specifications)
  const [activeTab, setActiveTab] = useState("description");

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Tabs */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-2 rounded-md font-semibold transition ${
              activeTab === "description"
                ? "bg-[#FF671F] text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specifications")}
            className={`px-6 py-2 rounded-md font-semibold transition ${
              activeTab === "specifications"
                ? "bg-[#FF671F] text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            Specifications
          </button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto text-gray-600 leading-relaxed">
          {activeTab === "description" && (
            <p>{description}</p>
          )}

          {activeTab === "specifications" && (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100">Key</th>
                  <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100">Value</th>
                </tr>
              </thead>
              <tbody>
                {specifications && specifications.length > 0 ? (
                  specifications.map((spec) => (
                    <tr key={spec.id} className="odd:bg-white even:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{spec.key}</td>
                      <td className="border border-gray-300 px-4 py-2">{spec.value}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center py-4 text-gray-400">
                      No specifications available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
