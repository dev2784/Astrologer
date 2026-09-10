"use client";

import { useState } from "react";
import useSWR from 'swr';
import { jsonFetcher } from '@/lib/json-fetcher';
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

  // Selected date state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Calendar view Month/Year navigation state
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

  // Format Date object to YYYY-MM-DD string
  const formatDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch Muhurats whenever selectedDate changes
  const { data, isLoading: loading } = useSWR<{ muhurats?: MuhuratItem[] }>(
    `${API_URL}/muhurat?date=${formatDateString(selectedDate)}`, jsonFetcher,
  );
  const muhurats = data?.muhurats || [];

  // Calendar Grid Generation Logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthNamesEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthNamesHi = [
    "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
  ];

  const weekDaysEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekDaysHi = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];

  const todayStr = formatDateString(new Date());
  const selectedStr = formatDateString(selectedDate);

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
          
          {/* Left Column: Custom Interactive Calendar Card */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-5 sticky top-24">
            
            {/* Calendar Header / Month Nav */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>📅</span>
                <span>
                  {language === "hi" ? monthNamesHi[month] : monthNamesEn[month]} {year}
                </span>
              </h2>

              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 transition"
                  aria-label="Previous Month"
                >
                  ‹
                </button>
                <button
                  onClick={() => {
                    const now = new Date();
                    setCurrentMonth(now);
                    setSelectedDate(now);
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition"
                >
                  {language === "hi" ? "आज" : "Today"}
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 transition"
                  aria-label="Next Month"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 border-b border-slate-100 pb-2">
              {(language === "hi" ? weekDaysHi : weekDaysEn).map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {/* Blank leading slots for month start padding */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10" />
              ))}

              {/* Day numbers */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateObj = new Date(year, month, dayNum);
                const dateStr = formatDateString(dateObj);

                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedStr;

                return (
                  <button
                    key={dayNum}
                    onClick={() => setSelectedDate(dateObj)}
                    className={`h-10 w-full rounded-2xl flex items-center justify-center text-sm font-semibold transition-all duration-200 relative ${
                      isSelected
                        ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md scale-105"
                        : isToday
                        ? "bg-orange-50 text-orange-600 font-extrabold border border-orange-200"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span>{dayNum}</span>
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 bg-orange-600 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Date Label */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">{language === "hi" ? "चयनित तिथि:" : "Selected Date:"}</span>
              <span className="font-extrabold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                {selectedStr}
              </span>
            </div>
          </div>

          {/* Right Column: Muhurat Details List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-900">
                {selectedStr === todayStr
                  ? language === "hi" ? "आज के शुभ मुहूर्त" : "Today's Muhurats"
                  : `${language === "hi" ? "मुहूर्त विवरण" : "Muhurats for"} ${selectedStr}`}
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
                        {
                          m.muhurat && (
                            
                        <h3 className="text-lg font-bold text-slate-900 mt-2 flex items-center gap-2">
                          <span>⏱️</span>
                          <span>{m.muhurat}</span>
                        </h3>
                            )
                        }
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