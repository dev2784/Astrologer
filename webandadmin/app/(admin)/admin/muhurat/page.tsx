"use client";
import { adminFetch } from "@/lib/admin-api";

import { useState, useEffect } from "react";

interface MuhuratItem {
  id: string;
  date: string;
  tithi: string;
  muhurat: string;
  details?: string;
}

export default function AdminMuhuratPage() {
  const [muhurats, setMuhurats] = useState<MuhuratItem[]>([]);
  const [date, setDate] = useState("");
  const [tithi, setTithi] = useState("");
  const [muhurat, setMuhurat] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";


  const fetchMuhurats = () => {
    adminFetch(`${API_URL}/muhurat`)
      .then((res) => res.json())
      .then((data) => {
        if (data.muhurats) setMuhurats(data.muhurats);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMuhurats();
  }, []);

  const handleExcelUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!excelFile) {
      alert("Please select an Excel file (.xlsx or .xls)");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const res = await adminFetch(`${API_URL}/muhurat/bulk-upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Bulk upload successful!");
        setExcelFile(null);
        fetchMuhurats();
        // Refresh your list here if you have a fetch function
      } else {
        alert(data.error || "Failed to upload Excel file");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await adminFetch(`${API_URL}/muhurat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, tithi, muhurat, details }),
      });

      if (res.ok) {
        setDate("");
        setTithi("");
        setMuhurat("");
        setDetails("");
        fetchMuhurats();
      } else {
        alert("Failed to add Muhurat");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Muhurat entry?")) return;

    try {
      const res = await adminFetch(`${API_URL}/muhurat/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchMuhurats();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Manage Today&apos;s &amp; Upcoming Muhurat</h1>

      {/* Excel Bulk Upload Card */}
      <div className="bg-amber-50/50 border border-amber-200 p-6 rounded-2xl shadow-xs">
        <h2 className="text-lg font-bold text-amber-900 mb-2">📁 Bulk Upload Muhurats (Excel)</h2>
        <p className="text-xs text-amber-800 mb-4">
          Upload an <code>.xlsx</code> or <code>.csv</code> file. Column headers must be:{" "}
          <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-bold">
            date, tithi, muhurat, details
          </span>
        </p>

        <form onSubmit={handleExcelUpload} className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-stone-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-600 file:text-white hover:file:bg-amber-700 transition"
          />

          <button
            type="submit"
            disabled={uploading || !excelFile}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
          >
            {uploading ? "Uploading..." : "Import Excel"}
          </button>
        </form>
      </div>

      {/* Entry Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Add New Muhurat</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              English Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tithi (Hindi / Sanskrit) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. शुक्ल पक्ष एकादशी / Vivah Muhurat"
              value={tithi}
              onChange={(e) => setTithi(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Muhurat Time / Period *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Abhijit Muhurat: 11:45 AM - 12:35 PM"
              value={muhurat}
              onChange={(e) => setMuhurat(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Details / Guidelines (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Enter auspicious notes or specific puja guidelines..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm transition"
            >
              {loading ? "Adding..." : "Save Muhurat"}
            </button>
          </div>
        </form>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Tithi</th>
              <th className="p-4">Muhurat Timing</th>
              <th className="p-4">Details</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {muhurats.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-medium text-slate-900">
                  {new Date(m.date).toISOString().split("T")[0]}
                </td>
                <td className="p-4 font-bold text-orange-600">{m.tithi}</td>
                <td className="p-4">{m.muhurat}</td>
                <td className="p-4 text-xs text-slate-500 max-w-xs truncate">{m.details || "—"}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-red-600 hover:text-red-800 text-xs font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}