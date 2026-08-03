"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const BATCH_SIZE = 10;

type Puja = {
  id: string;
  titleEn: string;
  titleHi: string;
  imageUrl?: string | null;
  estimatedTime?: string | null;
  category?: { nameEn: string } | null;
};

export default function PujasListPage() {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(0);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const fetchPujas = async (currentSkip = 0, currentSearch = "", append = false) => {
    setIsLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pujas?search=${encodeURIComponent(currentSearch)}&skip=${currentSkip}&take=${BATCH_SIZE}`);
    const data = await res.json();
    
    if (data.pujas) {
      setPujas((prev) => append ? [...prev, ...data.pujas] : data.pujas);
      setTotal(data.total);
      setHasMore(data.hasMore);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSkip(0);
      fetchPujas(0, search.length >= 3 ? search : "", false);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const handleLoadMore = () => {
    const nextSkip = skip + BATCH_SIZE;
    setSkip(nextSkip);
    fetchPujas(nextSkip, search.length >= 3 ? search : "", true);
  };

  const confirmDelete = (id: string, title: string) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Puja?",
      message: `Are you sure you want to delete "${title}"?`,
      onConfirm: async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pujas/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchPujas(0, "", false);
        }
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Puja Services</h1>
          <p className="text-gray-500 mt-1">Total Pujas: {total}</p>
        </div>
        <Link href="/admin/pujas/create" className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 transition">
          + Add New Puja
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <input
          type="text"
          placeholder="Search pujas (min 3 chars)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />

        {pujas.length === 0 && !isLoading ? (
          <p className="text-gray-500 text-center py-8">No pujas found.</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {pujas.map((puja) => (
              <div key={puja.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  {puja.imageUrl ? (
                    <img src={puja.imageUrl} alt="" className="w-16 h-16 object-cover rounded-md border" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md border flex items-center justify-center text-xs text-gray-400">No Image</div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{puja.titleEn} <span className="text-gray-400 font-normal">/ {puja.titleHi}</span></h3>
                    <p className="text-xs text-gray-500">Category: <span className="font-medium text-slate-700">{puja.category?.nameEn}</span> | Time: {puja.estimatedTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/pujas/${puja.id}`} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded hover:bg-slate-200">View</Link>
                  <Link href={`/admin/pujas/${puja.id}/edit`} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded hover:bg-blue-100">Edit</Link>
                  <button onClick={() => confirmDelete(puja.id, puja.titleEn)} className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded hover:bg-red-100">Delete</button>
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="pt-4 text-center">
                <button onClick={handleLoadMore} disabled={isLoading} className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-md border hover:bg-gray-200">
                  {isLoading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmationModal isOpen={modalConfig.isOpen} title={modalConfig.title} message={modalConfig.message} onConfirm={modalConfig.onConfirm} onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))} />
    </div>
  );
}