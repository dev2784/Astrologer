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
  const pathname = usePathname();
  const subcategoryId = searchParams.get("subcategoryId");

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  // 1. Fetch Categories ONLY ONCE when the app loads
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
  }, []);

  // 2. React FORCEFULLY to any URL change or Data load
  useEffect(() => {
    // If we leave the subcategory page, reset immediately
    if (!subcategoryId || categories.length === 0) {
      setActiveCategory(null);
      setActiveSubcategory(null);
      return;
    }

    let foundCat = null;
    let foundSub = null;

    // Search the cached categories for the current URL's subcategoryId
    for (const cat of categories) {
      const matchedSub = cat.subcategories?.find((sub) => sub.id === subcategoryId);
      if (matchedSub) {
        foundCat = cat.nameEn;
        foundSub = matchedSub.nameEn;
        break;
      }
    }

    // Set the new breadcrumb text
    setActiveCategory(foundCat);
    setActiveSubcategory(foundSub);

  }, [subcategoryId, pathname, categories]); // Watches URL and data strictly

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

// Wrap inside Suspense with a Route-Aware Key
function BreadcrumbsWrapper() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // This is the magic trick. Creating a unique string from the URL
  // forces React to re-evaluate this component on every single click.
  const urlKey = `${pathname}?${searchParams.toString()}`;

  return <BreadcrumbsContent key={urlKey} />;
}

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
      <BreadcrumbsWrapper />
    </Suspense>
  );
}