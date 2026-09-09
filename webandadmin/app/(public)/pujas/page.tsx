"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

type Puja = {
  id: string;
  titleEn: string;
  titleHi: string;
  slug: string;
  imageUrl?: string | null;
  estimatedTime?: string | null;
  category?: { nameEn: string; nameHi?: string } | null;
  charges?: string | null;
  placeOfPuja?: string | null;
  noOfYajman?: string | null;
};

function PublicPujasContent() {
  const searchParams = useSearchParams();
  const subcategoryId = searchParams.get("subcategoryId");
  const { language, t } = useLanguage();

  const [pujas, setPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fix: Resolve NEXT_PUBLIC_API_BASE_URL via template string
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";
    let url = `${API_URL}/pujas`;

    if (subcategoryId) {
      url += `/${subcategoryId}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.pujas) setPujas(data.pujas);
      })
      .catch((err) => console.error("Failed to load pujas:", err))
      .finally(() => setLoading(false));
  }, [subcategoryId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-orange-50 via-amber-50/40 to-slate-50 py-12 border-b border-amber-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t("pujaList.heroTitle")}
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t("pujaList.heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Card Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 bg-slate-200/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : pujas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto space-y-3">
            <span className="text-4xl">🪔</span>
            <h3 className="text-lg font-bold text-slate-800">{t("pujaList.noPujasFound")}</h3>
            <p className="text-slate-500 text-sm">{t("pujaList.noPujasDesc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pujas.map((puja) => (
              <article
                key={puja.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail Header */}
                <Link href={`/pujas/${puja.slug}`} className="relative h-48 w-full bg-slate-100 overflow-hidden block">
                  <img
                    src={puja.imageUrl || "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&q=80&w=600"}
                    alt={puja.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-xs font-black text-orange-600 shadow-sm">
                    {puja.charges || "₹1999"}
                  </div>
                  {puja.category && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-slate-900/70 backdrop-blur-md rounded-md text-[11px] font-medium text-white">
                      {language === "hi" && puja.category.nameHi ? puja.category.nameHi : puja.category.nameEn}
                    </div>
                  )}
                </Link>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <Link href={`/pujas/${puja.titleEn}`}>
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition line-clamp-1">
                        {language === "hi" && puja.titleHi ? puja.titleHi : puja.titleEn}
                      </h2>
                    </Link>
                    <p className="text-xs font-medium text-slate-500 line-clamp-1">
                      {language === "hi" ? puja.titleEn : puja.titleHi}
                    </p>

                    {/* Specifications Pills */}
                    <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-md font-medium flex items-center gap-1">
                        ⏱️ {puja.estimatedTime}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-100 rounded-md font-medium flex items-center gap-1">
                        📍 {puja.placeOfPuja}
                      </span>
                    </div>
                  </div>

                  {/* Footer Link */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      {t("pujaList.yajmanLabel")}: <strong className="text-slate-800">{puja.noOfYajman}</strong>
                    </span>
                    <Link
                      href={`/pujas/${puja.titleEn}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700 transition"
                    >
                      {t("pujaList.viewDetails")} <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Wrap searchParams hook user with Suspense boundary
export default function PublicPujasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 py-12 flex justify-center items-center">
        <div className="text-slate-500 font-medium">Loading Pujas...</div>
      </div>
    }>
      <PublicPujasContent />
    </Suspense>
  );
}