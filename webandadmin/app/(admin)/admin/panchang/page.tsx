"use client";

import { useState, useEffect } from "react";

interface PanchangEntry {
  id: string;
  date: string;
  data: any; // JSON payload
}

export default function AdminPanchangManager() {
  const [activeTab, setActiveTab] = useState<"list" | "excel" | "manual">("list");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [panchangList, setPanchangList] = useState<PanchangEntry[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

  // Fetch all Panchang data for the list view
  const fetchList = async () => {
    try {
      const res = await fetch(`${API_URL}/panchang`);
      const resData = await res.json();
      if (resData.list) setPanchangList(resData.list);
    } catch (err) {
      console.error("Failed to fetch Panchang list:", err);
    }
  };

  // Load list on mount and when switching to the 'list' tab
  useEffect(() => {
    if (activeTab === "list") fetchList();
  }, [activeTab]);

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this date's Panchang?")) return;
    
    try {
      const res = await fetch(`${API_URL}/panchang/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchList(); // Refresh list after deletion
      } else {
        alert("Failed to delete entry.");
      }
    } catch (err) {
      console.error(err);
    }
  };

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
      const resData = await res.json();
      alert(resData.message || resData.error);
      if (res.ok) {
        setFile(null);
        setActiveTab("list"); // Auto-switch to list to see new data
      }
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
      if (res.ok) setActiveTab("list");
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manage Daily Panchang</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-4">
        <button 
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 font-bold rounded-lg ${activeTab === "list" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600"}`}
        >
          Manage Uploaded Data
        </button>
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

      {/* LIST VIEW */}
      {activeTab === "list" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Tithi</th>
                <th className="p-4">Nakshatra</th>
                <th className="p-4">Sunrise</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {panchangList.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-slate-500">No Panchang data uploaded yet.</td></tr>
              ) : (
                panchangList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">
                      {new Date(item.date).toISOString().split("T")[0]}
                    </td>
                    <td className="p-4 text-orange-600 font-medium">
                      {item.data?.tithi?.details?.tithi_name || "—"}
                    </td>
                    <td className="p-4">
                      {item.data?.nakshatra?.details?.nak_name || "—"}
                    </td>
                    <td className="p-4">
                      {item.data?.sunrise || "—"}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-bold px-3 py-1.5 bg-red-50 rounded-lg hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* EXCEL UPLOAD VIEW */}
      {activeTab === "excel" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-600 mb-4">Upload a CSV/Excel file with the exact template headers.</p>
          <form onSubmit={handleExcelUpload} className="flex gap-4 items-center">
            <input type="file" accept=".csv, .xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="border p-2 rounded w-full max-w-sm" />
            <button type="submit" disabled={loading || !file} className="bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50">
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
            <input type="date" required value={manualDate} onChange={(e) => setManualDate(e.target.value)} className="w-full border p-2.5 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 border-t pt-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-500 uppercase">{key.replace("_", " ")}</label>
                <input 
                  type="text" 
                  name={key}
                  placeholder={key.includes("end") ? "HH:MM:SS" : ""}
                  value={formData[key as keyof typeof formData]} 
                  onChange={handleInputChange} 
                  className="w-full border p-2.5 rounded-lg mt-1 text-sm bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none" 
                />
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50 transition">
            {loading ? "Saving..." : "Save Panchang Data"}
          </button>
        </form>
      )}
    </div>
  );
}