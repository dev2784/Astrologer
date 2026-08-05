"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface MuhuratItem {
  id: string;
  date: string;
  tithi: string;
  muhurat: string;
  details?: string;
}

export default function PublicMuhuratPage() {
  const { language } = useLanguage();
  
  // Format YYYY-MM-DD
  const getTodayString = () => new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [muhurats, setMuhurats] = useState<MuhuratItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/muhurat?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.muhurats) setMuhurats(data.muhurats);
      })
      .catch((err) => console.error("Error loading Muhurats:", err))
      .finally(() => setLoading(false));
  }, [selectedDate, API_URL]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900">
            {language === "hi" ? "आज का पंचांग एवं शुभ मुहूर्त" : "Daily Panchang & Auspicious Muhurat"}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            {language === "hi"
              ? "शुभ तिथि, चौघड़िया एवं विशिष्ट पूजन मुहूर्त देखने के लिए कैलेंडर में तारीख चुनें।"
              : "Select any date on the calendar to view tithi details and specific auspicious timings."}
          </p>
        </div>

        {/* Main Grid: Calendar Side-By-Side with Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Date Selector / Calendar Card */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>📅</span>
              <span>{language === "hi" ? "तारीख चुनें" : "Select Date"}</span>
            </h2>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-orange-50/30"
            />

            <div className="pt-2 text-xs text-slate-500 space-y-1">
              <p>
                <strong>{language === "hi" ? "चयनित तिथि:" : "Selected Date:"}</strong>{" "}
                <span className="text-orange-600 font-bold">{selectedDate}</span>
              </p>
              <button
                onClick={() => setSelectedDate(getTodayString())}
                className="text-orange-600 hover:underline font-bold text-xs"
              >
                {language === "hi" ? "आज की तिथि पर जाएं" : "Jump to Today"}
              </button>
            </div>
          </div>

          {/* Right Column: Muhurat Details List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-900">
                {selectedDate === getTodayString()
                  ? language === "hi" ? "आज के शुभ मुहूर्त" : "Today's Muhurats"
                  : `${language === "hi" ? "मुहूर्त विवरण" : "Muhurats for"} ${selectedDate}`}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
                {muhurats.length} {language === "hi" ? "प्रविष्टियाँ" : "Entries"}
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((n) => (
                  <div key={n} className="h-32 bg-slate-200 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : muhurats.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                <span className="text-4xl">🪔</span>
                <h3 className="font-bold text-slate-800 text-base">
                  {language === "hi"
                    ? "इस तिथि के लिए कोई विशेष मुहूर्त दर्ज नहीं है"
                    : "No specific Muhurat entries found for this date"}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === "hi"
                    ? "विशेष पंचांग परामर्श के लिए सीधे संपर्क करें।"
                    : "For custom astrological consultation, please submit a booking request."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {muhurats.map((m) => (
                  <article
                    key={m.id}
                    className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-300 transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md">
                          {m.tithi}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-2 flex items-center gap-2">
                          <span>⏱️</span>
                          <span>{m.muhurat}</span>
                        </h3>
                      </div>
                    </div>

                    {m.details && (
                      <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                        {m.details}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}