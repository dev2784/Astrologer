"use client";
import { adminFetch } from "@/lib/admin-api";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Puja = {
  id: string;
  titleEn: string;
  titleHi: string;
  imageUrl?: string | null;
  estimatedTime?: string | null;
  category?: { nameEn: string } | null;
  subcategory?: { nameEn: string } | null;
  placeOfPuja?: string | null;
  noOfYajman?: string | null;
  charges?: string | null;
  about?: string | null;
  samagri?: string | null;
  benefits?: string | null;
  faqs?: { questionEn: string; questionHi: string; answerEn: string; answerHi: string }[];
};

export default function PujaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [puja, setPuja] = useState<Puja | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pujas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.puja) setPuja(data.puja);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return <div className="p-8 text-center">Loading details...</div>;
  if (!puja) return <div className="p-8 text-center text-red-600">Puja not found.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{puja.titleEn} <span className="text-gray-400 font-normal">/ {puja.titleHi}</span></h1>
          <p className="text-sm text-gray-500 mt-1">Category: <span className="font-semibold text-slate-700">{puja.category?.nameEn}</span> {puja.subcategory && `> ${puja.subcategory.nameEn}`}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/pujas/${puja.id}/edit`} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700">Edit</Link>
          <button onClick={() => router.push("/admin/pujas")} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded hover:bg-gray-200">Back</button>
        </div>
      </div>

      {puja.imageUrl && (
        <div className="w-full h-72 rounded-lg overflow-hidden border">
          <img src={puja.imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-lg border text-sm">
        <div><span className="font-semibold text-gray-600 block">Charges / Dakshina:</span> {puja.charges}</div>
        <div><span className="font-semibold text-gray-600 block">Place of Puja:</span> {puja.placeOfPuja}</div>
        <div><span className="font-semibold text-gray-600 block">No. of Yajman:</span> {puja.noOfYajman}</div>
        <div><span className="font-semibold text-gray-600 block">Estimated Time:</span> {puja.estimatedTime}</div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">About Puja</h3>
          <div
                  className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4 [&>p]:break-words [&>p]:max-w-full [&>table]:w-full [&>table]:overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: puja.about || "<p>No specific Detail listed.</p>" }}
                />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Puja Samagri</h3>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{puja.samagri || "No samagri listed."}</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Benefits</h3>
          <div
                  className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4 [&>p]:break-words [&>p]:max-w-full [&>table]:w-full [&>table]:overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: puja.benefits || "<p>No specific benefits listed.</p>" }}
                />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Frequently Asked Questions ({puja.faqs?.length || 0})</h3>
          <div className="space-y-3">
            {puja.faqs?.map((faq: { questionEn: string; questionHi: string; answerEn: string; answerHi: string }, idx: number) => (
              <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                <p className="font-semibold text-slate-900">{faq.questionEn} {faq.questionHi && <span className="text-gray-400 font-normal">/ {faq.questionHi}</span>}</p>
                <p className="text-sm text-gray-600 mt-1">{faq.answerEn} {faq.answerHi && <span className="text-gray-400">/ {faq.answerHi}</span>}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}