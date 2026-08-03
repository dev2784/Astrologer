"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Category {
  id: string;
  nameEn: string;
  subcategories: { id: string; nameEn: string }[];
}

export default function Breadcrumbs() {
  const searchParams = useSearchParams();
  const subcategoryId = searchParams.get("subcategoryId");

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  useEffect(() => {
    if (!subcategoryId) {
      setActiveCategory(null);
      setActiveSubcategory(null);
      return;
    }

    // Fetch categories to resolve the IDs to names
    fetch("process.env.NEXT_PUBLIC_API_BASE_URL/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          for (const cat of data.categories as Category[]) {
            const matchedSub = cat.subcategories?.find((sub) => sub.id === subcategoryId);
            if (matchedSub) {
              setActiveCategory(cat.nameEn);
              setActiveSubcategory(matchedSub.nameEn);
              break;
            }
          }
        }
      })
      .catch((err) => console.error("Breadcrumb fetch error:", err));
  }, [subcategoryId]);

  return (
    <nav className="bg-stone-100/70 border-b border-stone-200/60 py-2.5 px-4 sm:px-6 lg:px-8 text-xs font-medium text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 flex-wrap">
        {/* Main Home Page */}
        <Link href="/" className="hover:text-orange-600 transition flex items-center gap-1">
          <span>Home</span>
        </Link>

        {/* Separator */}
        <span className="text-stone-400">/</span>

        {/* Services / All Pujas */}
        <Link href="/pujas" className={`hover:text-orange-600 transition ${!activeCategory ? "text-orange-600 font-bold" : ""}`}>
          Services
        </Link>

        {/* Dynamic Category */}
        {activeCategory && (
          <>
            <span className="text-stone-400">/</span>
            <span className="text-stone-700 font-semibold">{activeCategory}</span>
          </>
        )}

        {/* Dynamic Subcategory */}
        {activeSubcategory && (
          <>
            <span className="text-stone-400">/</span>
            <span className="text-orange-600 font-bold">{activeSubcategory}</span>
          </>
        )}
      </div>
    </nav>
  );
}