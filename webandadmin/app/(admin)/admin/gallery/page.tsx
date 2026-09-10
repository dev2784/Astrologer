"use client";
import useSWR from "swr";
import { adminFetch, adminJsonFetcher } from "@/lib/admin-api";

import { useState } from "react";
import { Upload, Trash2, Plus, Image as ImageIcon, Loader2 } from "lucide-react";

interface GalleryItem {
  id: string;
  titleEn: string;
  titleHi?: string;
  imageUrl: string;
  createdAt: string;
}

export default function AdminGalleryPage() {
  
  // Form State
  const [titleEn, setTitleEn] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";



  const { data, isLoading: loading, mutate } = useSWR<{ items: GalleryItem[] }>(
    `${API_URL}/gallery`, adminJsonFetcher, { shouldRetryOnError: false },
  );
  const items = data?.items || [];
  const fetchGallery = () => { void mutate(); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !file) return alert("Please provide a title and select an image.");

    setUploading(true);

    try {
      // 1. Upload Image to Cloudinary via existing /upload route
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await adminFetch(`${API_URL}/uploads`, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || "Image upload failed");
      }

      // 2. Save Gallery record to Database
      const saveRes = await adminFetch(`${API_URL}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn,
          titleHi,
          imageUrl: uploadData.url,
        }),
      });

      const saveData = await saveRes.json();
      if (saveData.success) {
        // Reset form
        setTitleEn("");
        setTitleHi("");
        setFile(null);
        setPreviewUrl("");
        fetchGallery();
      } else {
        alert("Failed to save gallery entry");
      }
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error adding gallery item");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const res = await adminFetch(`${API_URL}/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await mutate({ items: items.filter(item => item.id !== id) });
      }
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">Gallery Management</h1>
        <p className="text-slate-500 text-sm mt-1">Upload and manage ritual photos displayed on the homepage gallery.</p>
      </div>

      {/* Upload Form Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-orange-600" /> Add New Photo
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* File Selector & Preview */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl p-4 bg-slate-50/50 transition cursor-pointer relative min-h-[160px]">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-36 w-full object-cover rounded-xl" />
            ) : (
              <label htmlFor="gallery-file" className="flex flex-col items-center cursor-pointer text-center">
                <Upload size={28} className="text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-600">Click to upload image</span>
                <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
              </label>
            )}
            <input
              id="gallery-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Title Inputs */}
          <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Title (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahamrityunjay Havan Ujjain"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Title (Hindi - Optional)</label>
                <input
                  type="text"
                  placeholder="उदा. महामृत्युंजय हवन उज्जैन"
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 text-sm self-end w-full sm:w-auto"
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} /> Save to Gallery
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Gallery Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Current Gallery Photos ({items.length})</h2>

        {loading ? (
          <p className="text-slate-400 text-sm">Loading gallery...</p>
        ) : items.length === 0 ? (
          <p className="text-slate-500 text-sm italic">No images in gallery yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs group relative">
                <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 p-2 bg-red-600/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-red-700"
                    title="Delete Image"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="p-3">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{item.titleEn}</h4>
                  {item.titleHi && <p className="text-[11px] text-slate-500 truncate">{item.titleHi}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}