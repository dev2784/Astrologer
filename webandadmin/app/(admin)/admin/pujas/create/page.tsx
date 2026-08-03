"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner, FullScreenLoader } from "@/components/ui/Loader";
import Alert from "@/components/ui/Alert";
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

export default function CreatePujaPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const [titleEn, setTitleEn] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [placeOfPuja, setPlaceOfPuja] = useState("");
  const [noOfYajman, setNoOfYajman] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [samagri, setSamagri] = useState("");
  const [about, setAbout] = useState("");
  const [benefits, setBenefits] = useState("");
  const [charges, setCharges] = useState("");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      });
  }, []);

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);

  const addFaq = () =>
    setFaqs([
      ...faqs,
      { questionEn: "", answerEn: "", questionHi: "", answerHi: "" },
    ]);
  const removeFaq = (index: number) =>
    setFaqs(faqs.filter((_, i) => i !== index));

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch("http://127.0.0.1:8080/uploads", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        setAlert({ type: "error", message: "Upload failed" });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Error uploading image" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://127.0.0.1:8080/pujas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn,
          titleHi,
          categoryId,
          subcategoryId: subcategoryId || null,
          imageUrl,
          charges,
          placeOfPuja,
          noOfYajman,
          estimatedTime,
          samagri,
          about,
          benefits,
          faqs,
        }),
      });

      if (res.ok) {
        router.push("/admin/pujas");
      } else {
        setAlert({ type: "error", message: "Failed to create puja." });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Failed to create puja." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Create New Puja Service
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {isSubmitting && <FullScreenLoader message="Saving record..." />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (English)
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (Hindi)
            </label>
            <input
              type="text"
              value={titleHi}
              onChange={(e) => setTitleHi(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubcategoryId("");
              }}
              required
              className="w-full px-3 py-2 border rounded-md bg-white"
            >
              <option value="">-- Choose Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameEn} / {cat.nameHi}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory
            </label>
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white"
            >
              <option value="">-- Choose Subcategory (Optional) --</option>
              {selectedCategoryObj?.subcategories?.map((sub: Subcategory) => (
                <option key={sub.id} value={sub.id}>
                  {sub.nameEn} / {sub.nameHi}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Puja Image
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
              className="w-full px-3 py-2 border rounded-md bg-white text-sm file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
            {uploading && <Spinner className="w-5 h-5 text-gray-500" />}
          </div>
          {imageUrl && (
            <div className="mt-3 relative w-32 h-32 rounded-md overflow-hidden border">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Place of Puja
            </label>
            <input
              type="text"
              value={placeOfPuja}
              onChange={(e) => setPlaceOfPuja(e.target.value)}
              placeholder="e.g. Temple / Home"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No. of Yajman
            </label>
            <input
              type="text"
              value={noOfYajman}
              onChange={(e) => setNoOfYajman(e.target.value)}
              placeholder="e.g. 1-4 Persons"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Time (min)
            </label>
            <input
              type="text"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="e.g. 30 to 45 min"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Charges / Dakshina</label>
            <input type="text" value={charges} onChange={(e) => setCharges(e.target.value)} placeholder="e.g. ₹2100" required className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Puja Samagri
          </label>
          <textarea
            value={samagri}
            onChange={(e) => setSamagri(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <RichTextEditor
            label="About Puja"
            value={about}
            onChange={(content: string) => setAbout(content)}
            placeholder="Write detailed information about the puja..."
          />
        </div>
        <div>
          <RichTextEditor
            label="Benefits"
            value={benefits}
            onChange={(content: string) => setBenefits(content)}
            placeholder="List the spiritual and physical benefits..."
          />
        </div>

        {/* Dynamic FAQs Section */}
        <div className="border-t pt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">FAQs</h3>
            <button
              type="button"
              onClick={addFaq}
              className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded hover:bg-slate-200"
            >
              + Add FAQ
            </button>
          </div>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 border rounded-lg space-y-3 relative"
            >
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="absolute top-2 right-3 text-red-600 font-bold text-sm"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Question (English)"
                  value={faq.questionEn}
                  onChange={(e) => {
                    const f = [...faqs];
                    f[index].questionEn = e.target.value;
                    setFaqs(f);
                  }}
                  required
                  className="px-3 py-1.5 border rounded text-sm bg-white"
                />
                <input
                  type="text"
                  placeholder="Question (Hindi)"
                  value={faq.questionHi}
                  onChange={(e) => {
                    const f = [...faqs];
                    f[index].questionHi = e.target.value;
                    setFaqs(f);
                  }}
                  className="px-3 py-1.5 border rounded text-sm bg-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <textarea
                  placeholder="Answer (English)"
                  value={faq.answerEn}
                  onChange={(e) => {
                    const f = [...faqs];
                    f[index].answerEn = e.target.value;
                    setFaqs(f);
                  }}
                  required
                  rows={2}
                  className="px-3 py-1.5 border rounded text-sm bg-white"
                />
                <textarea
                  placeholder="Answer (Hindi)"
                  value={faq.answerHi}
                  onChange={(e) => {
                    const f = [...faqs];
                    f[index].answerHi = e.target.value;
                    setFaqs(f);
                  }}
                  rows={2}
                  className="px-3 py-1.5 border rounded text-sm bg-white"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-orange-600 text-white font-bold rounded-md hover:bg-orange-700 transition"
        >
          Save Puja Service
        </button>
      </form>
    </div>
  );
}
