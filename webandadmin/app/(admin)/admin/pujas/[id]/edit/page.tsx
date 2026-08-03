"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Alert from "@/components/ui/Alert";
import { Spinner, FullScreenLoader } from "@/components/ui/Loader";
import RichTextEditor from "@/components/ui/RichTextEditor";

interface Category {
  id: string;
  nameEn: string;
  nameHi: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  nameEn: string;
  nameHi: string;
}

interface FaqItem {
  questionEn: string;
  answerEn: string;
  questionHi: string;
  answerHi: string;
}

export default function EditPujaPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [alertData, setAlertData] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form States
  const [titleEn, setTitleEn] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [placeOfPuja, setPlaceOfPuja] = useState("");
  const [noOfYajman, setNoOfYajman] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [charges, setCharges] = useState("");
  const [samagri, setSamagri] = useState("");
  const [about, setAbout] = useState("");
  const [benefits, setBenefits] = useState("");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  // Fetch initial categories and puja details
  useEffect(() => {
    if (!id) return;

    async function loadInitialData() {
      try {
        const [catRes, pujaRes] = await Promise.all([
          fetch("http://127.0.0.1:8080/categories"),
          fetch(`http://127.0.0.1:8080/pujas/${id}`),
        ]);

        const catData = await catRes.json();
        const pujaData = await pujaRes.json();

        if (catData.categories) setCategories(catData.categories);

        if (pujaData.puja) {
          const p = pujaData.puja;
          setTitleEn(p.titleEn || "");
          setTitleHi(p.titleHi || "");
          setCategoryId(p.categoryId || "");
          setSubcategoryId(p.subcategoryId || "");
          setImageUrl(p.imageUrl || "");
          setPlaceOfPuja(p.placeOfPuja || "");
          setNoOfYajman(p.noOfYajman || "");
          setEstimatedTime(p.estimatedTime || "");
          setCharges(p.charges || "");
          setSamagri(p.samagri || "");
          setAbout(p.about || "");
          setBenefits(p.benefits || "");
          setFaqs(p.faqs || []);

          // If category exists, filter subcategories
          if (p.categoryId && catData.categories) {
            const selectedCat = catData.categories.find((c: Category) => c.id === p.categoryId);
            if (selectedCat) setSubcategories(selectedCat.subcategories || []);
          }
        }
      } catch (err) {
        console.error("Error loading edit data:", err);
        setAlertData({ type: "error", message: "Failed to load record details." });
      } finally {
        setLoadingData(false);
      }
    }

    loadInitialData();
  }, [id]);

  // Handle category change to update subcategory options
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCatId = e.target.value;
    setCategoryId(selectedCatId);
    setSubcategoryId("");

    const selectedCat = categories.find((c) => c.id === selectedCatId);
    setSubcategories(selectedCat ? selectedCat.subcategories || [] : []);
  };

  // Image upload handler
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);
    try {
      const res = await fetch("http://127.0.0.1:8080/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        setAlertData({ type: "error", message: "Image upload failed." });
      }
    } catch (err) {
      console.error(err);
      setAlertData({ type: "error", message: "Network error during image upload." });
    } finally {
      setUploadingImage(false);
    }
  };

  // FAQ management handlers
  const addFaq = () => setFaqs([...faqs, { questionEn: "", answerEn: "", questionHi: "", answerHi: "" }]);
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
  const updateFaq = (index: number, field: string, value: string) => {
    const updated = [...faqs];
    updated[index][field as keyof FaqItem] = value;
    setFaqs(updated);
  };

  // Submit update form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setAlertData(null);

    try {
      const res = await fetch(`http://127.0.0.1:8080/pujas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn,
          titleHi,
          categoryId,
          subcategoryId: subcategoryId || null,
          imageUrl,
          placeOfPuja,
          noOfYajman,
          estimatedTime,
          charges,
          samagri,
          about,
          benefits,
          faqs,
        }),
      });

      if (res.ok) {
        setAlertData({ type: "success", message: "Puja updated successfully!" });
        setTimeout(() => router.push(`/admin/pujas/${id}`), 1000);
      } else {
        const errData = await res.json();
        setAlertData({ type: "error", message: errData.error || "Failed to update puja." });
      }
    } catch (err) {
      console.error(err);
      setAlertData({ type: "error", message: "A network error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return <FullScreenLoader message="Loading puja record..." />;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Edit Puja Service</h1>
        <Link href={`/admin/pujas/${id}`} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded hover:bg-gray-200">
          Cancel
        </Link>
      </div>

      <Alert type={alertData?.type} message={alertData?.message || null} onClose={() => setAlertData(null)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {submitting && <FullScreenLoader message="Saving changes..." />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
            <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (Hindi)</label>
            <input type="text" value={titleHi} onChange={(e) => setTitleHi(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={categoryId} onChange={handleCategoryChange} required className="w-full px-3 py-2 border rounded-md bg-white">
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nameEn}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory (Optional)</label>
            <select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-white">
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.nameEn}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Puja Image</label>
          <div className="flex items-center gap-4">
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-3 py-2 border rounded-md bg-white text-sm file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700" />
            {uploadingImage && <span className="text-sm text-gray-500">Uploading...</span>}
          </div>
          {imageUrl && (
            <div className="mt-3 relative w-32 h-32 rounded-md overflow-hidden border">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Place of Puja</label>
            <input type="text" value={placeOfPuja} onChange={(e) => setPlaceOfPuja(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. of Yajman</label>
            <input type="text" value={noOfYajman} onChange={(e) => setNoOfYajman(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
            <input type="text" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Charges / Dakshina</label>
            <input type="text" value={charges} onChange={(e) => setCharges(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>

        <RichTextEditor label="About Puja" value={about} onChange={(content) => setAbout(content)} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Puja Samagri</label>
          <textarea rows={3} value={samagri} onChange={(e) => setSamagri(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <RichTextEditor label="Benefits" value={benefits} onChange={(content) => setBenefits(content)} />

        <div className="space-y-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">FAQs</h3>
            <button type="button" onClick={addFaq} className="px-3 py-1 bg-slate-800 text-white text-sm rounded-md font-semibold">
              + Add FAQ
            </button>
          </div>
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 border rounded-lg bg-slate-50 space-y-3 relative">
              <button type="button" onClick={() => removeFaq(index)} className="absolute top-2 right-3 text-red-600 font-bold text-lg">
                &times;
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Question (En)" value={faq.questionEn} onChange={(e) => updateFaq(index, "questionEn", e.target.value)} className="px-3 py-2 border rounded-md bg-white text-sm" />
                <input type="text" placeholder="Question (Hi)" value={faq.questionHi} onChange={(e) => updateFaq(index, "questionHi", e.target.value)} className="px-3 py-2 border rounded-md bg-white text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Answer (En)" value={faq.answerEn} onChange={(e) => updateFaq(index, "answerEn", e.target.value)} className="px-3 py-2 border rounded-md bg-white text-sm" />
                <input type="text" placeholder="Answer (Hi)" value={faq.answerHi} onChange={(e) => updateFaq(index, "answerHi", e.target.value)} className="px-3 py-2 border rounded-md bg-white text-sm" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link href={`/admin/pujas/${id}`} className="px-5 py-2 bg-gray-100 text-gray-700 font-semibold rounded-md">
            Cancel
          </Link>
          <button type="submit" disabled={submitting} className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 transition flex items-center gap-2">
            {submitting && <Spinner />}
            Update Puja
          </button>
        </div>
      </form>
    </div>
  );
}