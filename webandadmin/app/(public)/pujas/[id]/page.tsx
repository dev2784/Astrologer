"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import BookingModal from "@/components/ui/BookingModal";

interface FAQ {
  questionEn: string;
  answerEn: string;
  questionHi?: string;
  answerHi?: string;
}

interface Puja {
  id: string;
  titleEn: string;
  titleHi: string;
  charges: string;
  placeOfPuja: string;
  noOfYajman: string;
  estimatedTime: string;
  imageUrl?: string;
  about?: string;
  samagri?: string;
  benefits?: string;
  category?: { nameEn: string; nameHi?: string };
  subcategory?: { nameEn: string; nameHi?: string };
  faqs?: FAQ[];
}

export default function PublicPujaDetailPage() {
  const params = useParams();
  const id = params?.id;
  const { language, t } = useLanguage();

  const [puja, setPuja] = useState<Puja | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"about" | "samagri" | "benefits" | "faqs">("about");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pujas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.puja) setPuja(data.puja);
      })
      .catch((err) => console.error("Error fetching puja detail:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-4 max-w-7xl mx-auto animate-pulse space-y-8">
        <div className="h-8 bg-stone-200 rounded w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-96 bg-stone-200 rounded-2xl" />
          <div className="lg:col-span-4 h-80 bg-stone-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!puja) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <span className="text-5xl">🪔</span>
        <h1 className="text-2xl font-bold text-stone-800">Puja Service Not Found</h1>
        <Link href="/pujas" className="px-5 py-2.5 bg-orange-600 text-white rounded-full font-semibold text-sm">
          {t("pujaDetail.backToPujas")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/50 pb-16">
      {/* Title Header */}
      <section className="bg-white border-b border-stone-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex items-center justify-between">
            <Link href="/pujas" className="text-xs font-semibold text-stone-500 hover:text-orange-600 transition flex items-center gap-1">
              <span>←</span> {t("pujaDetail.backToPujas")}
            </Link>
            {puja.category && (
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                {language === "hi" && puja.category.nameHi ? puja.category.nameHi : puja.category.nameEn}
                {puja.subcategory && ` • ${language === "hi" && puja.subcategory.nameHi ? puja.subcategory.nameHi : puja.subcategory.nameEn}`}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900">
            {language === "hi" && puja.titleHi ? puja.titleHi : puja.titleEn}
          </h1>
          <p className="text-base text-stone-500 font-medium">
            {language === "hi" ? puja.titleEn : puja.titleHi}
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-stone-200 shadow-xs bg-stone-100">
              <img
                src={puja.imageUrl || "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&q=80&w=1200"}
                alt={puja.titleEn}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 bg-orange-50/60 p-4 rounded-xl border border-orange-100 text-center">
              <div>
                <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">{t("pujaDetail.location")}</span>
                <span className="text-sm font-semibold text-stone-800">📍 {puja.placeOfPuja}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">{t("pujaDetail.duration")}</span>
                <span className="text-sm font-semibold text-stone-800">⏱️ {puja.estimatedTime}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">{t("pujaDetail.yajmanCapacity")}</span>
                <span className="text-sm font-semibold text-stone-800">👥 {puja.noOfYajman}</span>
              </div>
            </div>

            {/* Content Tabs Header */}
            <div className="border-b border-stone-200 flex gap-6 text-sm font-semibold">
              <button
                onClick={() => setActiveTab("about")}
                className={`pb-3 transition relative ${activeTab === "about" ? "text-orange-600 border-b-2 border-orange-600" : "text-stone-500 hover:text-stone-800"}`}
              >
                {t("pujaDetail.aboutTab")}
              </button>
              <button
                onClick={() => setActiveTab("samagri")}
                className={`pb-3 transition relative ${activeTab === "samagri" ? "text-orange-600 border-b-2 border-orange-600" : "text-stone-500 hover:text-stone-800"}`}
              >
                {t("pujaDetail.samagriTab")}
              </button>
              <button
                onClick={() => setActiveTab("benefits")}
                className={`pb-3 transition relative ${activeTab === "benefits" ? "text-orange-600 border-b-2 border-orange-600" : "text-stone-500 hover:text-stone-800"}`}
              >
                {t("pujaDetail.benefitsTab")}
              </button>
              <button
                onClick={() => setActiveTab("faqs")}
                className={`pb-3 transition relative ${activeTab === "faqs" ? "text-orange-600 border-b-2 border-orange-600" : "text-stone-500 hover:text-stone-800"}`}
              >
                {t("pujaDetail.faqsTab")} ({puja.faqs?.length || 0})
              </button>
            </div>

            {/* Content Rendering */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs min-h-[250px]">
              {activeTab === "about" && (
                <div
                  className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4 [&>p]:break-words [&>p]:max-w-full [&>table]:w-full [&>table]:overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: puja.about || "<p>No description provided.</p>" }}
                />
              )}

              {activeTab === "samagri" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-stone-900">{t("pujaDetail.samagriHeading")}</h3>
                  <p className="text-stone-700 whitespace-pre-wrap leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100 text-sm [&>p]:break-words [&>p]:max-w-full [&>table]:w-full [&>table]:overflow-x-auto">
                    {puja.samagri || t("pujaDetail.noSamagri")}
                  </p>
                </div>
              )}

              {activeTab === "benefits" && (
                <div
                  className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4 [&>p]:break-words [&>p]:max-w-full [&>table]:w-full [&>table]:overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: puja.benefits || "<p>No specific benefits listed.</p>" }}
                />
              )}

              {activeTab === "faqs" && (
                <div className="space-y-3">
                  {puja.faqs && puja.faqs.length > 0 ? (
                    puja.faqs.map((faq, idx) => (
                      <div key={idx} className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50/50">
                        <button
                          onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                          className="w-full text-left p-4 font-semibold text-stone-900 flex justify-between items-center gap-4 hover:bg-stone-100/60 transition text-sm sm:text-base"
                        >
                          <span>{language === "hi" && faq.questionHi ? faq.questionHi : faq.questionEn}</span>
                          <span className="text-stone-400 font-bold">{openFaqIndex === idx ? "−" : "+"}</span>
                        </button>
                        {openFaqIndex === idx && (
                          <div className="px-4 pb-4 text-sm text-stone-600 border-t border-stone-200/60 pt-3 bg-white">
                            <p>{language === "hi" && faq.answerHi ? faq.answerHi : faq.answerEn}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-500 text-sm py-4 text-center">{t("pujaDetail.noFaqs")}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-2xl p-6 border border-stone-200 shadow-lg space-y-6">
              <div className="space-y-1 pb-4 border-b border-stone-100">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{t("pujaDetail.totalCharges")}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-orange-600">{puja.charges || "₹1999"}</span>
                  <span className="text-xs text-stone-500 font-medium">{t("pujaDetail.includedNotice")}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{t("pujaDetail.benefit1")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{t("pujaDetail.benefit2")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{t("pujaDetail.benefit3")}</span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-xl hover:brightness-105 transition flex items-center justify-center gap-2"
              >
                <span>{t("pujaDetail.bookNow")}</span>
                <span>→</span>
              </button>

              <p className="text-[11px] text-center text-stone-400">
                {t("pujaDetail.needHelp")}
              </p>
            </div>
          </div>
          {/* Place Modal Component at bottom of layout */}
          <BookingModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              pujaId={puja.id}
              pujaTitle={language === "hi" && puja.titleHi ? puja.titleHi : puja.titleEn}
            />
        </div>
      </main>
    </div>
  );
}