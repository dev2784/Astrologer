"use client";

import { useState } from "react";

export default function AdminPanchangManager() {
  const [activeTab, setActiveTab] = useState<"excel" | "manual">("excel");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

  // Manual Form State
  const [manualDate, setManualDate] = useState("");
  const [formData, setFormData] = useState({
    sunrise: "", sunset: "",
    tithi_name: "", tithi_end: "",
    nakshatra_name: "", nakshatra_end: "",
    yog_name: "", karan_name: "",
    hindu_maah: "", paksha: "", ritu: "", ayana: "",
    sun_sign: "", moon_sign: "",
    vikram_samvat: "", shaka_samvat: "",
    abhijit_start: "", abhijit_end: "",
    rahukaal_start: "", rahukaal_end: ""
  });

  const handleExcelUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Select an Excel/CSV file.");

    setLoading(true);
    const payload = new FormData();
    payload.append("file", file);

    try {
      const res = await fetch(`${API_URL}/panchang/bulk-upload`, {
        method: "POST",
        body: payload,
      });
      const data = await res.json();
      alert(data.message || data.error);
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: 0, minute: 0, second: 0 };
    const parts = timeStr.split(":");
    return { hour: parseInt(parts[0] || "0"), minute: parseInt(parts[1] || "0"), second: parseInt(parts[2] || "0") };
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDate) return alert("Date is required.");

    setLoading(true);

    const nestedJsonData = {
      day: new Date(manualDate).toLocaleDateString('en-US', { weekday: 'long' }),
      sunrise: formData.sunrise,
      sunset: formData.sunset,
      tithi: { details: { tithi_name: formData.tithi_name }, end_time: parseTime(formData.tithi_end) },
      nakshatra: { details: { nak_name: formData.nakshatra_name }, end_time: parseTime(formData.nakshatra_end) },
      yog: { details: { yog_name: formData.yog_name } },
      karan: { details: { karan_name: formData.karan_name } },
      hindu_maah: { purnimanta: formData.hindu_maah },
      paksha: formData.paksha,
      ritu: formData.ritu,
      sun_sign: formData.sun_sign,
      moon_sign: formData.moon_sign,
      ayana: formData.ayana,
      vikram_samvat: parseInt(formData.vikram_samvat) || 0,
      shaka_samvat: parseInt(formData.shaka_samvat) || 0,
      abhijit_muhurta: { start: formData.abhijit_start, end: formData.abhijit_end },
      rahukaal: { start: formData.rahukaal_start, end: formData.rahukaal_end }
    };

    try {
      const res = await fetch(`${API_URL}/panchang`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: manualDate, data: nestedJsonData }),
      });
      const resData = await res.json();
      alert(resData.message || resData.error);
    } catch (err) {
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manage Daily Panchang</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-4">
        <button 
          onClick={() => setActiveTab("excel")}
          className={`px-4 py-2 font-bold rounded-lg ${activeTab === "excel" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600"}`}
        >
          Bulk Excel Upload
        </button>
        <button 
          onClick={() => setActiveTab("manual")}
          className={`px-4 py-2 font-bold rounded-lg ${activeTab === "manual" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600"}`}
        >
          Manual Entry Form
        </button>
      </div>

      {/* EXCEL UPLOAD VIEW */}
      {activeTab === "excel" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-600 mb-4">Upload a CSV/Excel file with the exact template headers.</p>
          <form onSubmit={handleExcelUpload} className="flex gap-4 items-center">
            <input type="file" accept=".csv, .xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="border p-2 rounded" />
            <button type="submit" disabled={loading || !file} className="bg-orange-600 text-white px-6 py-2 rounded font-bold hover:bg-orange-700 disabled:opacity-50">
              {loading ? "Uploading..." : "Import"}
            </button>
          </form>
        </div>
      )}

      {/* MANUAL ENTRY VIEW */}
      {activeTab === "manual" && (
        <form onSubmit={handleManualSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase">Target Date (YYYY-MM-DD)</label>
            <input type="date" required value={manualDate} onChange={(e) => setManualDate(e.target.value)} className="w-full border p-2 rounded mt-1" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t pt-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-500 uppercase">{key.replace("_", " ")}</label>
                <input 
                  type={key.includes("end") || key.includes("start") || key.includes("time") ? "text" : "text"} 
                  name={key}
                  placeholder={key.includes("end") ? "HH:MM:SS" : ""}
                  value={formData[key as keyof typeof formData]} 
                  onChange={handleInputChange} 
                  className="w-full border p-2 rounded mt-1 text-sm bg-slate-50" 
                />
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white px-6 py-3 rounded font-bold hover:bg-orange-700 disabled:opacity-50">
            {loading ? "Saving..." : "Save Panchang Data"}
          </button>
        </form>
      )}
    </div>
  );
}