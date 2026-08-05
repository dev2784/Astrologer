"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Category {
  id: string;
  nameEn: string;
  subcategories: { id: string; nameEn: string }[];
}

function BreadcrumbsContent() {
  const searchParams = useSearchParams();
  const subcategoryId = searchParams.get("subcategoryId");

  // Store all categories in memory
  const [categories, setCategories] = useState<Category[]>([]);

  // 1. Fetch data EXACTLY ONCE when the component mounts
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error("Breadcrumb fetch error:", err));
  }, []); // Empty dependency array = only runs once!

  // 2. Instantly calculate the active breadcrumbs whenever the URL changes
  const { activeCategory, activeSubcategory } = useMemo(() => {
    if (!subcategoryId || categories.length === 0) {
      return { activeCategory: null, activeSubcategory: null };
    }

    for (const cat of categories) {
      const matchedSub = cat.subcategories?.find((sub) => sub.id === subcategoryId);
      if (matchedSub) {
        return { 
          activeCategory: cat.nameEn, 
          activeSubcategory: matchedSub.nameEn 
        };
      }
    }

    return { activeCategory: null, activeSubcategory: null };
  }, [subcategoryId, categories]); // Re-calculates instantly without network requests

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
        <Link 
          href="/pujas" 
          className={`hover:text-orange-600 transition ${!activeCategory ? "text-orange-600 font-bold" : ""}`}
        >
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

// Wrap the hook user inside Suspense boundary for Next.js App Router
export default function Breadcrumbs() {
  return (
    <Suspense fallback={
      <nav className="bg-stone-100/70 border-b border-stone-200/60 py-2.5 px-4 sm:px-6 lg:px-8 text-xs font-medium text-stone-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link href="/" className="hover:text-orange-600 transition">Home</Link>
          <span className="text-stone-400">/</span>
          <Link href="/pujas" className="text-orange-600 font-bold">Services</Link>
        </div>
      </nav>
    }>
      <BreadcrumbsContent />
    </Suspense>
  );
}