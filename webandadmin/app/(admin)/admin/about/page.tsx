"use client";

import { useState, useEffect } from "react";
import { Save, Upload, Loader2, Star, CheckCircle2 } from "lucide-react";

export default function AdminAboutPage() {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    yearsExp: 20,
    pujasDone: 5000,
    whatsappNo: "919340553012",
    descriptionEn: "",
    descriptionHi: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

  useEffect(() => {
    fetchAboutDetails();
  }, []);

  const fetchAboutDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/about`);
      const data = await res.json();
      if (data.success && data.about) {
        setFormData({
          name: data.about.name || "",
          image: data.about.image || "",
          yearsExp: data.about.yearsExp || 20,
          pujasDone: data.about.pujasDone || 5000,
          whatsappNo: data.about.whatsappNo || "919340553012",
          descriptionEn: data.about.descriptionEn || "",
          descriptionHi: data.about.descriptionHi || "",
        });
        if (data.about.image) setPreviewUrl(data.about.image);
      }
    } catch (err) {
      console.error("Failed to fetch about details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(false);

    try {
      let imageUrl = formData.image;

      // 1. Upload new image if selected
      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);

        const uploadRes = await fetch(`${API_URL}/uploads`, {
          method: "POST",
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();
        if (uploadJson.url) {
          imageUrl = uploadJson.url;
        }
      }

      // 2. Save Updated Details
      const res = await fetch(`${API_URL}/about`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(true);
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        setTimeout(() => setSuccessMessage(false), 4000);
      } else {
        alert("Failed to update details");
      }
    } catch (err) {
      console.error("Error saving about details:", err);
      alert("Error saving details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading About section settings...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">Manage About Section</h1>
        <p className="text-slate-500 text-sm mt-1">Update Pandit Ji profile picture, biography, experience, and contact numbers.</p>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle2 color="#16a34a" size={20} />
          <span className="text-sm font-semibold">About section updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        
        {/* Profile Picture Upload */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Profile Image</label>
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-orange-100 bg-orange-50 shrink-0 relative shadow-sm">
              <img
                src={previewUrl || "./pandit-logo.png"}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <label htmlFor="about-image" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs cursor-pointer inline-flex items-center gap-2 transition">
                <Upload size={16} /> Choose New Photo
              </label>
              <input id="about-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <p className="text-[11px] text-slate-400 mt-2">Recommended: Square PNG/JPG up to 5MB</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Acharya / Pandit Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp Number (With Country Code) *</label>
            <input
              type="text"
              required
              placeholder="919340553012"
              value={formData.whatsappNo}
              onChange={(e) => setFormData({ ...formData, whatsappNo: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Years Experience */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Years of Experience</label>
            <input
              type="number"
              required
              value={formData.yearsExp}
              onChange={(e) => setFormData({ ...formData, yearsExp: Number(e.target.value) })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Pujas Performed Count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pujas Performed Count</label>
            <input
              type="number"
              required
              value={formData.pujasDone}
              onChange={(e) => setFormData({ ...formData, pujasDone: Number(e.target.value) })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Description English */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Biography / About Description (English) *</label>
          <textarea
            required
            rows={4}
            value={formData.descriptionEn}
            onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        {/* Description Hindi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Biography / About Description (Hindi)</label>
          <textarea
            rows={4}
            value={formData.descriptionHi}
            onChange={(e) => setFormData({ ...formData, descriptionHi: e.target.value })}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl transition flex items-center justify-center gap-2 text-sm"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span>{saving ? "Saving Changes..." : "Save About Details"}</span>
        </button>

      </form>
    </div>
  );
}