"use client";

import { useState, useEffect } from "react";

interface PanchangEntry {
  id: string;
  date: string;
  data: any;
}

interface ChoghadiyaSlot {
  name: string;
  start: string;
  end: string;
  type: "shubh" | "ashubh" | "neutral" | "";
}

export default function AdminPanchangManager() {
  const [activeTab, setActiveTab] = useState<"list" | "excel" | "manual">("list");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [panchangList, setPanchangList] = useState<PanchangEntry[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

  const fetchList = async () => {
    try {
      const res = await fetch(`${API_URL}/panchang`);
      const resData = await res.json();
      if (resData.list) setPanchangList(resData.list);
    } catch (err) {
      console.error("Failed to fetch Panchang list:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "list") fetchList();
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      const res = await fetch(`${API_URL}/panchang/${id}`, { method: "DELETE" });
      if (res.ok) fetchList();
      else alert("Failed to delete entry.");
    } catch (err) {
      console.error(err);
    }
  };

  // --- MANUAL FORM STATE ---
  const [manualDate, setManualDate] = useState("");
  const defaultForm = {
    sunrise: "", sunset: "", tithi_name: "", tithi_end: "",
    nakshatra_name: "", nakshatra_end: "", yog_name: "", karan_name: "",
    hindu_maah: "", paksha: "", ritu: "", ayana: "", sun_sign: "", moon_sign: "",
    vikram_samvat: "", shaka_samvat: "", abhijit_start: "", abhijit_end: "",
    rahukaal_start: "", rahukaal_end: ""
  };
  const [formData, setFormData] = useState(defaultForm);
  
  // Dynamic Arrays for Choghadiya
  const [choghadiyaDay, setChoghadiyaDay] = useState<ChoghadiyaSlot[]>([]);
  const [choghadiyaNight, setChoghadiyaNight] = useState<ChoghadiyaSlot[]>([]);

  // Helpers for Choghadiya state management
  const addChoghadiya = (isDay: boolean) => {
    const newSlot: ChoghadiyaSlot = { name: "", start: "", end: "", type: "" };
    if (isDay) setChoghadiyaDay([...choghadiyaDay, newSlot]);
    else setChoghadiyaNight([...choghadiyaNight, newSlot]);
  };

  const updateChoghadiya = (isDay: boolean, index: number, field: keyof ChoghadiyaSlot, value: string) => {
    if (isDay) {
      const updated = [...choghadiyaDay];
      updated[index] = { ...updated[index], [field]: value };
      setChoghadiyaDay(updated);
    } else {
      const updated = [...choghadiyaNight];
      updated[index] = { ...updated[index], [field]: value };
      setChoghadiyaNight(updated);
    }
  };

  const removeChoghadiya = (isDay: boolean, index: number) => {
    if (isDay) {
      setChoghadiyaDay(choghadiyaDay.filter((_, i) => i !== index));
    } else {
      setChoghadiyaNight(choghadiyaNight.filter((_, i) => i !== index));
    }
  };

  const formatTimeToString = (timeObj: any) => {
    if (!timeObj) return "";
    return `${String(timeObj.hour || 0).padStart(2, "0")}:${String(timeObj.minute || 0).padStart(2, "0")}:${String(timeObj.second || 0).padStart(2, "0")}`;
  };

  // Populate form for Editing
  const handleEdit = (item: PanchangEntry) => {
    setEditId(item.id);
    setManualDate(new Date(item.date).toISOString().split("T")[0]);
    
    const d = item.data;
    setFormData({
      sunrise: d.sunrise || "", sunset: d.sunset || "",
      tithi_name: d.tithi?.details?.tithi_name || "", tithi_end: formatTimeToString(d.tithi?.end_time),
      nakshatra_name: d.nakshatra?.details?.nak_name || "", nakshatra_end: formatTimeToString(d.nakshatra?.end_time),
      yog_name: d.yog?.details?.yog_name || "", karan_name: d.karan?.details?.karan_name || "",
      hindu_maah: d.hindu_maah?.purnimanta || "", paksha: d.paksha || "", ritu: d.ritu || "", ayana: d.ayana || "",
      sun_sign: d.sun_sign || "", moon_sign: d.moon_sign || "",
      vikram_samvat: String(d.vikram_samvat || ""), shaka_samvat: String(d.shaka_samvat || ""),
      abhijit_start: d.abhijit_muhurta?.start || "", abhijit_end: d.abhijit_muhurta?.end || "",
      rahukaal_start: d.rahukaal?.start || "", rahukaal_end: d.rahukaal?.end || ""
    });

    setChoghadiyaDay(d.choghadiya_day || []);
    setChoghadiyaNight(d.choghadiya_night || []);
    setActiveTab("manual");
  };

  const handleExcelUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Select an Excel/CSV file.");
    setLoading(true);
    const payload = new FormData();
    payload.append("file", file);

    try {
      const res = await fetch(`${API_URL}/panchang/bulk-upload`, { method: "POST", body: payload });
      const resData = await res.json();
      alert(resData.message || resData.error);
      if (res.ok) { setFile(null); setActiveTab("list"); }
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
      sunrise: formData.sunrise, sunset: formData.sunset,
      tithi: { details: { tithi_name: formData.tithi_name }, end_time: parseTime(formData.tithi_end) },
      nakshatra: { details: { nak_name: formData.nakshatra_name }, end_time: parseTime(formData.nakshatra_end) },
      yog: { details: { yog_name: formData.yog_name } },
      karan: { details: { karan_name: formData.karan_name } },
      hindu_maah: { purnimanta: formData.hindu_maah },
      paksha: formData.paksha, ritu: formData.ritu, sun_sign: formData.sun_sign, moon_sign: formData.moon_sign, ayana: formData.ayana,
      vikram_samvat: parseInt(formData.vikram_samvat) || 0, shaka_samvat: parseInt(formData.shaka_samvat) || 0,
      abhijit_muhurta: { start: formData.abhijit_start, end: formData.abhijit_end },
      rahukaal: { start: formData.rahukaal_start, end: formData.rahukaal_end },
      // Append new dynamic arrays to payload
      choghadiya_day: choghadiyaDay,
      choghadiya_night: choghadiyaNight
    };

    try {
      const url = editId ? `${API_URL}/panchang/${editId}` : `${API_URL}/panchang`;
      const res = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: manualDate, data: nestedJsonData }),
      });
      const resData = await res.json();
      alert(resData.message || resData.error);
      
      if (res.ok) {
        setEditId(null); setFormData(defaultForm); setManualDate("");
        setChoghadiyaDay([]); setChoghadiyaNight([]);
        setActiveTab("list");
      }
    } catch (err) {
      alert("Submission failed.");
    } finally { setLoading(false); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // UI Helper for Choghadiya Sections
  const renderChoghadiyaSection = (title: string, isDay: boolean, slots: ChoghadiyaSlot[]) => (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 uppercase text-sm">{title}</h3>
        <button 
          type="button" 
          onClick={() => addChoghadiya(isDay)}
          className="text-xs font-bold bg-slate-800 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700"
        >
          + Add Slot
        </button>
      </div>
      
      {slots.length === 0 && <p className="text-xs text-slate-500">No slots added yet.</p>}

      <div className="space-y-3">
        {slots.map((slot, index) => (
          <div key={index} className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <input 
              type="text" placeholder="Name (e.g. Amrit)" required
              value={slot.name} onChange={(e) => updateChoghadiya(isDay, index, "name", e.target.value)}
              className="flex-1 min-w-[100px] border p-2 rounded text-sm outline-none focus:ring-1 focus:ring-orange-500" 
            />
            <input 
              type="text" placeholder="Start HH:MM" required
              value={slot.start} onChange={(e) => updateChoghadiya(isDay, index, "start", e.target.value)}
              className="w-24 border p-2 rounded text-sm outline-none focus:ring-1 focus:ring-orange-500" 
            />
            <input 
              type="text" placeholder="End HH:MM" required
              value={slot.end} onChange={(e) => updateChoghadiya(isDay, index, "end", e.target.value)}
              className="w-24 border p-2 rounded text-sm outline-none focus:ring-1 focus:ring-orange-500" 
            />
            <select 
              value={slot.type} required
              onChange={(e) => updateChoghadiya(isDay, index, "type", e.target.value as any)}
              className="w-28 border p-2 rounded text-sm outline-none focus:ring-1 focus:ring-orange-500 bg-white"
            >
              <option value="" disabled>Type</option>
              <option value="shubh">Shubh (Good)</option>
              <option value="ashubh">Ashubh (Bad)</option>
              <option value="neutral">Neutral</option>
            </select>
            <button 
              type="button" onClick={() => removeChoghadiya(isDay, index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manage Daily Panchang</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-4">
        <button onClick={() => { setActiveTab("list"); setEditId(null); setFormData(defaultForm); setManualDate(""); setChoghadiyaDay([]); setChoghadiyaNight([]); }} className={`px-4 py-2 font-bold rounded-lg ${activeTab === "list" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600"}`}>
          Manage Data
        </button>
        <button onClick={() => { setActiveTab("excel"); setEditId(null); setFormData(defaultForm); setManualDate(""); setChoghadiyaDay([]); setChoghadiyaNight([]); }} className={`px-4 py-2 font-bold rounded-lg ${activeTab === "excel" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600"}`}>
          Bulk Upload
        </button>
        <button onClick={() => { setActiveTab("manual"); if(!editId) {setFormData(defaultForm); setManualDate(""); setChoghadiyaDay([]); setChoghadiyaNight([]);} }} className={`px-4 py-2 font-bold rounded-lg ${activeTab === "manual" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600"}`}>
          {editId ? "✏️ Edit Entry" : "Manual Entry"}
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
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {panchangList.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-slate-500">No data found.</td></tr>
              ) : (
                panchangList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{new Date(item.date).toISOString().split("T")[0]}</td>
                    <td className="p-4 text-orange-600 font-medium">{item.data?.tithi?.details?.tithi_name || "—"}</td>
                    <td className="p-4">{item.data?.nakshatra?.details?.nak_name || "—"}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 text-xs font-bold px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 text-xs font-bold px-3 py-1.5 bg-red-50 rounded-lg hover:bg-red-100 transition">Delete</button>
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
          <form onSubmit={handleExcelUpload} className="flex gap-4 items-center">
            <input type="file" accept=".csv, .xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="border p-2 rounded w-full max-w-sm" />
            <button type="submit" disabled={loading || !file} className="bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50">
              {loading ? "Uploading..." : "Import"}
            </button>
          </form>
        </div>
      )}

      {/* MANUAL ENTRY / EDIT VIEW */}
      {activeTab === "manual" && (
        <form onSubmit={handleManualSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
          {editId && (
            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm font-bold border border-blue-200">
              Editing entry for: {manualDate}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase">Target Date (YYYY-MM-DD)</label>
            <input type="date" required value={manualDate} onChange={(e) => setManualDate(e.target.value)} className="w-full border p-2.5 rounded-lg mt-1 outline-none" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 border-t pt-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-500 uppercase">{key.replace("_", " ")}</label>
                <input 
                  type="text" name={key} placeholder={key.includes("end") || key.includes("start") ? "HH:MM:SS" : ""}
                  value={formData[key as keyof typeof formData]} onChange={handleInputChange} 
                  className="w-full border p-2.5 rounded-lg mt-1 text-sm bg-slate-50 outline-none" 
                />
              </div>
            ))}
          </div>

          {/* DYNAMIC CHOGHADIYA SECTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t pt-6">
            {renderChoghadiyaSection("Day Choghadiya", true, choghadiyaDay)}
            {renderChoghadiyaSection("Night Choghadiya", false, choghadiyaNight)}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50 transition">
            {loading ? "Saving..." : editId ? "Update Panchang Data" : "Save Panchang Data"}
          </button>
        </form>
      )}
    </div>
  );
}