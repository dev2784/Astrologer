"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface GalleryItem {
  id: string;
  titleEn: string;
  titleHi?: string;
  imageUrl: string;
  createdAt?: string;
}

export default function PublicGalleryPage() {
  const { language } = useLanguage();

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

  // Fetch Gallery Items
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/gallery`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setGalleryItems(data.items || []);
      })
      .catch((err) => console.error("Error loading gallery:", err))
      .finally(() => setLoading(false));
  }, [API_URL]);

  // Keyboard controls for Lightbox (Esc to close, Left/Right arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, galleryItems]);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === 0 ? galleryItems.length - 1 : (prev as number) - 1));
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === galleryItems.length - 1 ? 0 : (prev as number) + 1));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60 inline-block">
            {language === "hi" ? "पावन स्मृतियां" : "Sacred Memories"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900">
            {language === "hi" ? "पूजा एवं अनुष्ठान दीर्घा" : "Ritual & Anushthan Gallery"}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            {language === "hi"
              ? "हमारे द्वारा संपन्न कराए गए प्रमुख अनुष्ठान, महायज्ञ एवं दिव्य क्षणों की झलकियां।"
              : "Explore the divine glimpses of sacred Pujas, Havans, and rituals performed per authentic Vedic traditions."}
          </p>
        </div>

        {/* Gallery Content Area */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon size={20} className="text-orange-600" />
              <span>{language === "hi" ? "सभी तस्वीरें" : "All Photos"}</span>
            </h2>
            <span className="text-xs font-semibold px-3 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-100">
              {galleryItems.length} {language === "hi" ? "तस्वीरें" : "Photos"}
            </span>
          </div>

          {loading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="h-56 bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : galleryItems.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 space-y-3">
              <span className="text-5xl">🖼️</span>
              <h3 className="font-bold text-slate-800 text-base">
                {language === "hi" ? "गैलरी में अभी कोई तस्वीर उपलब्ध नहीं है" : "No gallery photos available"}
              </h3>
              <p className="text-xs text-slate-500">
                {language === "hi"
                  ? "शीघ्र ही नई तस्वीरें जोड़ी जाएंगी।"
                  : "Photos of recent Vedic rituals will be uploaded soon."}
              </p>
            </div>
          ) : (
            /* Photos Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {galleryItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative h-60 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  
                  {/* Hover Overlay with Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4 text-white">
                    <h3 className="font-bold text-sm sm:text-base leading-snug">
                      {language === "hi" && item.titleHi ? item.titleHi : item.titleEn}
                    </h3>
                    <span className="text-[11px] text-orange-300 font-semibold mt-1 flex items-center gap-1">
                      <span>{language === "hi" ? "बड़ा करके देखें" : "Click to view full screen"}</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* ================================================================= */}
      {/* LIGHTBOX / FULLSCREEN IMAGE VIEWER MODAL */}
      {/* ================================================================= */}
      {lightboxIndex !== null && galleryItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition z-50 focus:outline-none"
            title="Close (Esc)"
          >
            <X size={26} />
          </button>

          {/* Previous Arrow */}
          {galleryItems.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition z-50 focus:outline-none"
              title="Previous"
            >
              <ChevronLeft size={30} />
            </button>
          )}

          {/* Image & Title Container */}
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center space-y-4">
            <img
              src={galleryItems[lightboxIndex].imageUrl}
              alt={galleryItems[lightboxIndex].titleEn}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl transition duration-300"
            />
            
            <div className="text-center space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {language === "hi" && galleryItems[lightboxIndex].titleHi 
                  ? galleryItems[lightboxIndex].titleHi 
                  : galleryItems[lightboxIndex].titleEn}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {lightboxIndex + 1} / {galleryItems.length}
              </p>
            </div>
          </div>

          {/* Next Arrow */}
          {galleryItems.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition z-50 focus:outline-none"
              title="Next"
            >
              <ChevronRight size={30} />
            </button>
          )}

        </div>
      )}

    </div>
  );
}