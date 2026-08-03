"use client";

import { useState, useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

interface Subcategory {
  id: string;
  nameEn: string;
  nameHi: string;
}

interface Category {
  id: string;
  nameEn: string;
  nameHi: string;
  descriptionEn?: string;
  descriptionHi?: string;
  subcategories: Subcategory[];
}

const BATCH_SIZE = 10;

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [displayLimit, setDisplayLimit] = useState(BATCH_SIZE);

  // Debounce search input so it waits for typing to settle
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim().length === 0 || searchQuery.trim().length >= 3) {
        setDebouncedSearch(searchQuery);
        setDisplayLimit(BATCH_SIZE); // Reset batch window on new search
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { categories, hasMore, isLoading, refreshCategories } = useCategories(
    debouncedSearch,
    0,
    displayLimit
  );

  // Edit Mode States
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catNameEn, setCatNameEn] = useState("");
  const [catNameHi, setCatNameHi] = useState("");
  const [catDescEn, setCatDescEn] = useState("");
  const [catDescHi, setCatDescHi] = useState("");
  
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [subNameEn, setSubNameEn] = useState("");
  const [subNameHi, setSubNameHi] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // Confirmation Modal States
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // --- Category Actions ---
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCatId 
      ? `http://127.0.0.1:8080/categories/${editingCatId}` 
      : "http://127.0.0.1:8080/categories";
    
    const method = editingCatId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        nameEn: catNameEn, 
        nameHi: catNameHi, 
        descriptionEn: catDescEn, 
        descriptionHi: catDescHi 
      }),
    });

    if (res.ok) {
      resetCatForm();
      refreshCategories();
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setCatNameEn(cat.nameEn);
    setCatNameHi(cat.nameHi);
    setCatDescEn(cat.descriptionEn || "");
    setCatDescHi(cat.descriptionHi || "");
  };

  const confirmDeleteCategory = (id: string, name: string) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Category?",
      message: `Are you sure you want to delete "${name}"? This will permanently delete all associated subcategories.`,
      onConfirm: async () => {
        const res = await fetch(`http://127.0.0.1:8080/categories/${id}`, { method: "DELETE" });
        if (res.ok) refreshCategories();
        closeModal();
      },
    });
  };

  const resetCatForm = () => {
    setEditingCatId(null);
    setCatNameEn("");
    setCatNameHi("");
    setCatDescEn("");
    setCatDescHi("");
  };

  // --- Subcategory Actions ---
  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubId && !selectedCategoryId) return alert("Please select a parent category.");

    const url = editingSubId 
      ? `http://127.0.0.1:8080/categories/subcategories/${editingSubId}` 
      : "http://127.0.0.1:8080/categories/subcategories";
    
    const method = editingSubId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        nameEn: subNameEn, 
        nameHi: subNameHi, 
        categoryId: selectedCategoryId 
      }),
    });

    if (res.ok) {
      resetSubForm();
      refreshCategories();
    }
  };

  const handleEditSubcategory = (sub: Subcategory, parentId: string) => {
    setEditingSubId(sub.id);
    setSubNameEn(sub.nameEn);
    setSubNameHi(sub.nameHi);
    setSelectedCategoryId(parentId);
  };

  const confirmDeleteSubcategory = (id: string, name: string) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Subcategory?",
      message: `Are you sure you want to delete "${name}"?`,
      onConfirm: async () => {
        const res = await fetch(`http://127.0.0.1:8080/categories/subcategories/${id}`, { method: "DELETE" });
        if (res.ok) refreshCategories();
        closeModal();
      },
    });
  };

  const resetSubForm = () => {
    setEditingSubId(null);
    setSubNameEn("");
    setSubNameHi("");
    setSelectedCategoryId("");
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 relative">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Categories & Subcategories</h1>
        <p className="text-gray-500 mt-1">Server-side search ($\ge 3$ chars) and dynamic batch loading (10 per load).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Category Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {editingCatId ? "Edit Parent Category" : "1. Create Parent Category"}
          </h2>
          <form onSubmit={handleSaveCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
              <input type="text" value={catNameEn} onChange={(e) => setCatNameEn(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (Hindi)</label>
              <input type="text" value={catNameHi} onChange={(e) => setCatNameHi(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
              <textarea value={catDescEn} onChange={(e) => setCatDescEn(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Hindi)</label>
              <textarea value={catDescHi} onChange={(e) => setCatDescHi(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 transition">
                {editingCatId ? "Update Category" : "Add Category"}
              </button>
              {editingCatId && (
                <button type="button" onClick={resetCatForm} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">Cancel</button>
              )}
            </div>
          </form>
        </div>

        {/* Subcategory Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {editingSubId ? "Edit Subcategory" : "2. Create Subcategory"}
          </h2>
          <form onSubmit={handleSaveSubcategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Parent Category</label>
              <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} required className="w-full px-3 py-2 border rounded-md bg-white">
                <option value="">-- Choose Category --</option>
                {categories.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>{cat.nameEn} / {cat.nameHi}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name (English)</label>
              <input type="text" value={subNameEn} onChange={(e) => setSubNameEn(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name (Hindi)</label>
              <input type="text" value={subNameHi} onChange={(e) => setSubNameHi(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2 bg-red-900 text-white font-semibold rounded-md hover:bg-red-800 transition">
                {editingSubId ? "Update Subcategory" : "Add Subcategory"}
              </button>
              {editingSubId && (
                <button type="button" onClick={resetSubForm} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">Cancel</button>
              )}
            </div>
          </form>
        </div>

      </div>

      {/* Structured List View with Server Search & Load More */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Current Structure</h2>
            <p className="text-xs text-gray-400 mt-0.5">Type at least 3 characters to filter server data</p>
          </div>
          <input
            type="text"
            placeholder="Search (min 3 chars)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        {isLoading && categories.length === 0 ? (
          <div className="py-8 text-center text-gray-500">Loading records...</div>
        ) : categories.length === 0 ? (
          <p className="text-gray-500 py-4 text-center">No categories found.</p>
        ) : (
          <div className="space-y-6">
            {categories.map((cat: Category) => (
              <div key={cat.id} className="border-b pb-6 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-red-900">{cat.nameEn} <span className="text-gray-400 font-normal">/ {cat.nameHi}</span></h3>
                    <p className="text-sm text-gray-600">{cat.descriptionEn} {cat.descriptionHi && `(${cat.descriptionHi})`}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditCategory(cat)} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded border border-blue-200 font-medium hover:bg-blue-100">Edit</button>
                    <button onClick={() => confirmDeleteCategory(cat.id, cat.nameEn)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded border border-red-200 font-medium hover:bg-red-100">Delete</button>
                  </div>
                </div>

                <div className="pl-6 mt-4 flex flex-wrap gap-3">
                  {cat.subcategories.length === 0 ? (
                    <span className="text-xs text-gray-400 italic">No subcategories</span>
                  ) : (
                    cat.subcategories.map((sub: Subcategory) => (
                      <div key={sub.id} className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium border">
                        <span>{sub.nameEn} / {sub.nameHi}</span>
                        <button onClick={() => handleEditSubcategory(sub, cat.id)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => confirmDeleteSubcategory(sub.id, sub.nameEn)} className="text-red-600 hover:underline">×</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="pt-4 text-center">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setDisplayLimit((prev) => prev + BATCH_SIZE)}
                  className="px-6 py-2.5 bg-slate-100 text-slate-800 text-sm font-semibold rounded-md border border-gray-300 hover:bg-slate-200 transition disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Load More (10)"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
      />
    </div>
  );
}