"use client";
import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function ProductDescriptionSection({ description, specifications }) {
  const [activeTab, setActiveTab] = useState("description");
  const locale = useLocale();
  const t = useTranslations("product");
  const isArabic = locale === "ar";

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Tabs */}
        <div className="flex justify-center mb-8 space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-2 rounded-md font-semibold transition ${
              activeTab === "description"
                ? "bg-[#FF671F] text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t("description")}
          </button>
          <button
            onClick={() => setActiveTab("specifications")}
            className={`px-6 py-2 rounded-md font-semibold transition ${
              activeTab === "specifications"
                ? "bg-[#FF671F] text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t("specifications")}
          </button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto text-gray-600 leading-relaxed text-center">
       {activeTab === "description" && (
  <>
    {(isArabic ? description : description) ? (
      <div
        className="prose max-w-none text-gray-700"
        dangerouslySetInnerHTML={{
          __html: isArabic ? description : description
        }}
      />
    ) : (
      <p className="text-gray-400">{t("noDescription")}</p>
    )}
  </>
)}


          {activeTab === "specifications" && (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100">
                    {t("key")}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100">
                    {t("value")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {specifications && specifications.length > 0 ? (
                  specifications.map((spec) => (
                    <tr key={spec.id} className="odd:bg-white even:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {isArabic ? spec.key_ar || spec.key : spec.key}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {isArabic ? spec.value_ar || spec.value : spec.value}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center py-4 text-gray-400">
                      {t("noSpecs")}
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
