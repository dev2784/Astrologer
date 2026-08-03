"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import BookingModal from "@/components/ui/BookingModal";

interface Category {
  id: string;
  nameEn: string;
  nameHi?: string;
  subcategories: { id: string; nameEn: string; nameHi?: string }[];
}

interface Subcategory {
  id: string;
  nameEn: string;
  nameHi?: string;
}

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  
  // State for Navbar Modal trigger
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    fetch("process.env.NEXT_PUBLIC_API_BASE_URL/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) setActiveCategory(data.categories[0]);
        }
      })
      .catch((err) => console.error("Error fetching menu categories:", err));
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-xs border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png" 
              alt={t("brand.name")} 
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
            <Link href="/" className="hover:text-orange-600 transition">
              {t("nav.home")}
            </Link>

            <div className="relative group py-6">
              <button className="flex items-center gap-1 hover:text-orange-600 transition font-semibold">
                {t("nav.services")}
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-2xl shadow-2xl border border-stone-100 p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 grid grid-cols-12 gap-4">
                
                <div className="col-span-5 border-r border-stone-100 pr-3 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1 block">
                    {t("nav.categories")}
                  </span>
                  <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onMouseEnter={() => setActiveCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between ${
                          activeCategory?.id === cat.id
                            ? "bg-orange-50 text-orange-700 font-semibold"
                            : "text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <span className="truncate">
                          {language === "hi" && cat.nameHi ? cat.nameHi : cat.nameEn}
                        </span>
                        <span className="text-xs text-stone-400">›</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-7 pl-2 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1 block">
                    {activeCategory 
                      ? (language === "hi" && activeCategory.nameHi ? activeCategory.nameHi : activeCategory.nameEn)
                      : t("nav.subcategories")}
                  </span>
                  <div className="grid grid-cols-1 gap-1 max-h-72 overflow-y-auto pr-1">
                    {activeCategory?.subcategories && activeCategory.subcategories.length > 0 ? (
                      activeCategory.subcategories.map((sub: Subcategory) => (
                        <Link
                          key={sub.id}
                          href={`/pujas?subcategoryId=${sub.id}`}
                          className="px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-orange-50 hover:text-orange-700 transition block truncate"
                        >
                          {language === "hi" && sub.nameHi ? sub.nameHi : sub.nameEn}
                        </Link>
                      ))
                    ) : (
                      <span className="text-xs text-stone-400 px-3 py-4 block text-center">
                        {t("nav.noSubcategories")}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            <Link href="/about" className="hover:text-orange-600 transition">
              {t("nav.about")}
            </Link>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 bg-stone-50 hover:bg-orange-50 hover:border-orange-200 text-xs font-bold text-stone-700 hover:text-orange-600 transition"
            >
              <span>🌐</span>
              <span>{language === "en" ? "English" : "हिंदी"}</span>
            </button>

            {/* Book Puja Button triggering Modal */}
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold text-sm rounded-full shadow-md hover:shadow-lg hover:brightness-105 transition"
            >
              {t("nav.bookPuja")}
            </button>
          </div>

        </div>
      </header>

      {/* Global Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
}