"use client";

import { useState } from "react";
import useSWR from 'swr';
import { jsonFetcher } from '@/lib/json-fetcher';
import { useLanguage } from "@/context/LanguageContext";

import type { PanchangData } from "@/lib/content-types";

export default function PublicPanchangPage() {
  const { language } = useLanguage();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

  const formatDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTimeObj = (time?: { hour: number; minute: number; second: number }) => {
    if (!time) return "";
    return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}:${String(time.second).padStart(2, "0")}`;
  };

  // Helper for Choghadiya styling
  const getChoghadiyaColor = (type: string) => {
    if (type === "shubh") return "bg-green-50 text-green-800 border-green-200";
    if (type === "ashubh") return "bg-red-50 text-red-800 border-red-200";
    return "bg-slate-50 text-slate-800 border-slate-200";
  };

  const { data, isLoading: loading } = useSWR<{ data?: PanchangData }>(
    `${API_URL}/panchang?date=${formatDateString(selectedDate)}`, jsonFetcher,
  );
  const panchang = data?.data || null;

  // Calendar Logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthNamesHi = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
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
            {language === "hi" ? "दैनिक पंचांग" : "Daily Panchang"}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            {language === "hi"
              ? "तिथि, नक्षत्र, योग और शुभ मुहूर्त देखने के लिए कैलेंडर में तारीख चुनें।"
              : "Select any date on the calendar to view Tithi, Nakshatra, Yoga, and auspicious timings."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Calendar Card */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-5 sticky top-24">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>📅</span>
                <span>{language === "hi" ? monthNamesHi[month] : monthNamesEn[month]} {year}</span>
              </h2>
              <div className="flex items-center gap-1">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">‹</button>
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
                <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">›</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 border-b border-slate-100 pb-2">
              {(language === "hi" ? weekDaysHi : weekDaysEn).map((day) => <div key={day}>{day}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="h-10" />)}
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
                      isSelected ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md scale-105"
                      : isToday ? "bg-orange-50 text-orange-600 font-extrabold border border-orange-200"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span>{dayNum}</span>
                    {isToday && !isSelected && <span className="absolute bottom-1 w-1 h-1 bg-orange-600 rounded-full"></span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Panchang Data Viewer */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-900">
                {selectedStr === todayStr
                  ? language === "hi" ? "आज का पंचांग" : "Today's Panchang"
                  : `${language === "hi" ? "पंचांग विवरण" : "Panchang for"} ${selectedStr}`}
              </h2>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-24 bg-slate-200 rounded-2xl"></div>
                <div className="h-48 bg-slate-200 rounded-2xl"></div>
              </div>
            ) : !panchang ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2 shadow-sm">
                <span className="text-4xl">📜</span>
                <h3 className="font-bold text-slate-800 text-base">
                  {language === "hi" ? "डेटा उपलब्ध नहीं है" : "Data not available"}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === "hi" ? "इस तिथि के लिए पंचांग डेटा सर्वर पर अपलोड नहीं किया गया है।" : "Panchang data for this date has not been uploaded to the server yet."}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Top Header info */}
                <div className="bg-orange-600 text-white p-5 text-center">
                  <p className="text-orange-100 text-sm font-semibold">
                    Vikram Samvat {panchang.vikram_samvat} • {panchang.hindu_maah?.purnimanta} Maah • {panchang.paksha}
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Sun/Moon Grid */}
                  <div className="grid grid-cols-2 gap-4 text-center border-b border-slate-100 pb-6">
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                      <span className="block text-2xl mb-1">🌅</span>
                      <span className="text-xs font-bold text-slate-500 uppercase">Sunrise</span>
                      <span className="block text-slate-900 font-semibold">{panchang.sunrise || "—"}</span>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                      <span className="block text-2xl mb-1">🌇</span>
                      <span className="text-xs font-bold text-slate-500 uppercase">Sunset</span>
                      <span className="block text-slate-900 font-semibold">{panchang.sunset || "—"}</span>
                    </div>
                  </div>

                  {/* Core Elements */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Core Elements</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-500 block text-xs">Tithi</span>
                        <span className="font-bold text-slate-900">{panchang.tithi?.details?.tithi_name || "—"}</span>
                        <span className="text-xs text-orange-600 block mt-1">Ends {formatTimeObj(panchang.tithi?.end_time)}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-500 block text-xs">Nakshatra</span>
                        <span className="font-bold text-slate-900">{panchang.nakshatra?.details?.nak_name || "—"}</span>
                        <span className="text-xs text-orange-600 block mt-1">Ends {formatTimeObj(panchang.nakshatra?.end_time)}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-500 block text-xs">Yoga</span>
                        <span className="font-bold text-slate-900">{panchang.yog?.details?.yog_name || "—"}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-500 block text-xs">Karana</span>
                        <span className="font-bold text-slate-900">{panchang.karan?.details?.karan_name || "—"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Auspicious & Inauspicious Timings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border border-green-200 bg-green-50 rounded-xl">
                      <h4 className="text-xs font-bold text-green-700 uppercase mb-1">Abhijit Muhurta</h4>
                      <p className="text-sm font-semibold text-green-900">
                        {panchang.abhijit_muhurta?.start && panchang.abhijit_muhurta?.end 
                          ? `${panchang.abhijit_muhurta.start} to ${panchang.abhijit_muhurta.end}` 
                          : "Not Available"}
                      </p>
                    </div>
                    <div className="p-4 border border-red-200 bg-red-50 rounded-xl">
                      <h4 className="text-xs font-bold text-red-700 uppercase mb-1">Rahu Kaal</h4>
                      <p className="text-sm font-semibold text-red-900">
                        {panchang.rahukaal?.start && panchang.rahukaal?.end 
                          ? `${panchang.rahukaal.start} to ${panchang.rahukaal.end}` 
                          : "Not Available"}
                      </p>
                    </div>
                  </div>

                  {/* Astrological Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-4 border-t border-slate-100">
                    <div className="p-2 border border-slate-200 rounded-lg">
                      <span className="block text-slate-400">Sun Sign</span>
                      <span className="font-bold text-slate-800">{panchang.sun_sign || "—"}</span>
                    </div>
                    <div className="p-2 border border-slate-200 rounded-lg">
                      <span className="block text-slate-400">Moon Sign</span>
                      <span className="font-bold text-slate-800">{panchang.moon_sign || "—"}</span>
                    </div>
                    <div className="p-2 border border-slate-200 rounded-lg">
                      <span className="block text-slate-400">Ritu</span>
                      <span className="font-bold text-slate-800">{panchang.ritu || "—"}</span>
                    </div>
                    <div className="p-2 border border-slate-200 rounded-lg">
                      <span className="block text-slate-400">Ayana</span>
                      <span className="font-bold text-slate-800">{panchang.ayana || "—"}</span>
                    </div>
                  </div>

                  {/* CHOGHADIYA SECTION */}
                  <div className="pt-6 border-t border-slate-100 mt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 text-center font-serif">
                      {language === "hi" ? "आज का चौघड़िया" : "Today's Choghadiya"}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Day Choghadiya */}
                      <div>
                        <h4 className="text-sm font-bold text-orange-600 mb-3 flex items-center gap-2">
                          <span>☀️</span> {language === "hi" ? "दिन का चौघड़िया" : "Day Choghadiya"}
                        </h4>
                        <div className="space-y-2">
                          {panchang.choghadiya_day && panchang.choghadiya_day.length > 0 ? (
                            panchang.choghadiya_day.map((slot, i) => (
                              <div key={i} className={`flex justify-between items-center p-2.5 rounded-lg border text-sm ${getChoghadiyaColor(slot.type)}`}>
                                <span className="font-bold w-20">{slot.name}</span>
                                <span className="text-xs font-mono">{slot.start} - {slot.end}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 italic">No day slots recorded.</p>
                          )}
                        </div>
                      </div>

                      {/* Night Choghadiya */}
                      <div>
                        <h4 className="text-sm font-bold text-indigo-600 mb-3 flex items-center gap-2">
                          <span>🌙</span> {language === "hi" ? "रात का चौघड़िया" : "Night Choghadiya"}
                        </h4>
                        <div className="space-y-2">
                          {panchang.choghadiya_night && panchang.choghadiya_night.length > 0 ? (
                            panchang.choghadiya_night.map((slot, i) => (
                              <div key={i} className={`flex justify-between items-center p-2.5 rounded-lg border text-sm ${getChoghadiyaColor(slot.type)}`}>
                                <span className="font-bold w-20">{slot.name}</span>
                                <span className="text-xs font-mono">{slot.start} - {slot.end}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 italic">No night slots recorded.</p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}