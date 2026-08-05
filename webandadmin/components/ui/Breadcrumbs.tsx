"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";

interface Category {
  id: string;
  nameEn: string;
  subcategories: { id: string; nameEn: string }[];
}

function BreadcrumbsContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname(); // Added to track actual route changes
  const subcategoryId = searchParams.get("subcategoryId");

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  useEffect(() => {
    // 1. Flag to prevent race conditions if the user clicks multiple links quickly
    let isMounted = true; 

    // 2. Always reset state when the URL changes so old data doesn't get stuck
    setActiveCategory(null);
    setActiveSubcategory(null);

    if (!subcategoryId) {
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        // 3. Only update state if this is the most recent link clicked
        if (!isMounted) return; 

        let foundCategory = null;
        let foundSubcategory = null;

        if (data.categories) {
          for (const cat of data.categories as Category[]) {
            const matchedSub = cat.subcategories?.find((sub) => sub.id === subcategoryId);
            if (matchedSub) {
              foundCategory = cat.nameEn;
              foundSubcategory = matchedSub.nameEn;
              break;
            }
          }
        }

        // Apply the found categories (will remain null if ID was invalid)
        setActiveCategory(foundCategory);
        setActiveSubcategory(foundSubcategory);
      })
      .catch((err) => console.error("Breadcrumb fetch error:", err));

    // Cleanup function runs when the component unmounts or before the next effect runs
    return () => {
      isMounted = false;
    };
  }, [subcategoryId, pathname]); // Re-run whenever the ID or Path changes

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