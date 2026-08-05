"use client";

import { useState, useEffect } from "react";

// Mocking the structure you will get from the API
interface PanchangData {
  day: string;
  sunrise: string;
  sunset: string;
  tithi: { 
    details: { tithi_name: string }
  };
  nakshatra: { 
    details: { nak_name: string }
  };
  yoga: { 
    details: { yog_name: string } 
  };
  karana: { 
    details: { karan_name: string } 
  };
  hindu_maah: { 
    purnimanta: string 
  };
  paksha: string;
  ritu: string;
  ayana: string;
  vikram_samvat: number;
  shaka_samvat: number;
  sun_sign: string;
  moon_sign: string;
}
export default function UjjainPanchangView({ selectedDate }: { selectedDate: any }) {
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

  useEffect(() => {
    !selectedDate ? selectedDate = new Date() : selectedDate
    
    setLoading(true);
    fetch(`${API_URL}/panchang?date=${selectedDate}`)
      .then(res => res.json())
      .then(data => {
      	console.log(data)
        if (data.data) setPanchang(data.data);
      })
      .catch(err => console.error("Panchang load error", err))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Ujjain Panchang...</div>;
  if (!panchang) return <div className="p-8 text-center text-red-500">Failed to load Panchang data.</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Header: Location & Samvat */}
      <div className="bg-orange-600 text-white p-5 text-center">
        <h2 className="text-xl font-bold font-serif">Ujjain Panchang</h2>
        <p className="text-orange-100 text-sm mt-1">
          Vikram Samvat {panchang.vikram_samvat} • {panchang.hindu_maah.purnimanta} Maah • {panchang.paksha} Paksha
        </p>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Sun & Moon Timings */}
        <div className="grid grid-cols-2 gap-4 text-center border-b border-slate-100 pb-6">
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
            <span className="block text-2xl mb-1">🌅</span>
            <span className="text-xs font-bold text-slate-500 uppercase">Sunrise</span>
            <span className="block text-slate-900 font-semibold">{panchang.sunrise}</span>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <span className="block text-2xl mb-1">🌇</span>
            <span className="text-xs font-bold text-slate-500 uppercase">Sunset</span>
            <span className="block text-slate-900 font-semibold">{panchang.sunset}</span>
          </div>
        </div>

        {/* Core Panchang Elements */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Core Elements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block text-xs">Tithi</span>
              <span className="font-bold text-slate-900">{panchang.tithi.details.tithi_name}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block text-xs">Nakshatra</span>
              <span className="font-bold text-slate-900">{panchang.nakshatra.details.nak_name}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block text-xs">Yoga</span>
              <span className="font-bold text-slate-900">{panchang.yog.details.yog_name}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block text-xs">Karana</span>
              <span className="font-bold text-slate-900">{panchang.karan.details.karan_name}</span>
            </div>
          </div>
        </div>

        {/* Astrological Details */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Astrological Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 border border-slate-200 rounded-lg">
              <span className="block text-slate-400">Sun Sign</span>
              <span className="font-bold text-slate-800">{panchang.sun_sign}</span>
            </div>
            <div className="p-2 border border-slate-200 rounded-lg">
              <span className="block text-slate-400">Moon Sign</span>
              <span className="font-bold text-slate-800">{panchang.moon_sign}</span>
            </div>
            <div className="p-2 border border-slate-200 rounded-lg">
              <span className="block text-slate-400">Ritu</span>
              <span className="font-bold text-slate-800">{panchang.ritu}</span>
            </div>
            <div className="p-2 border border-slate-200 rounded-lg">
              <span className="block text-slate-400">Ayana</span>
              <span className="font-bold text-slate-800">{panchang.ayana}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}