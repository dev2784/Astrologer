"use client";
import useSWR from "swr";
import { adminFetch, adminJsonFetcher } from "@/lib/admin-api";

import { useState } from "react";

interface ReviewItem {
  id: string;
  userName: string;
  userCity?: string;
  rating: number;
  userPhone?: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  puja?: {
    id: string;
    titleEn: string;
    titleHi: string;
  };
}

export default function AdminReviewsPage() {
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "all">("pending");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

  const { data, isLoading: loading, mutate } = useSWR<{ reviews: ReviewItem[] }>(
    `${API_URL}/reviews/admin/all?status=${statusFilter}`, adminJsonFetcher, { shouldRetryOnError: false },
  );
  const reviews = data?.reviews || [];
  const fetchReviews = () => { void mutate(); };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setActionLoadingId(id);
    const newStatus = !currentStatus;

    try {
      const res = await adminFetch(`${API_URL}/reviews/admin/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: newStatus }),
      });

      if (res.ok) {
        fetchReviews();
      } else {
        alert("Failed to update review status");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;

    setActionLoadingId(id);
    try {
      const res = await adminFetch(`${API_URL}/reviews/admin/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchReviews();
      } else {
        alert("Failed to delete review");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-amber-400 text-xs">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < rating ? "★" : "☆"}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Customer Reviews</h1>
          <p className="text-xs text-slate-500 mt-1">
            Approve or reject user reviews before they appear publicly on the web application.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 self-start sm:self-auto border border-slate-200">
          {(["pending", "approved", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition ${
                statusFilter === tab
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-sm font-medium text-slate-500">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-sm font-medium text-slate-400">
            No reviews found under the &quot;{statusFilter}&quot; filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">User & Location</th>
                  <th className="p-4">Puja Title</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 max-w-md">Comment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    
                    {/* User Info */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{r.userName}</div>
                      {/* Display captured phone number with direct WhatsApp/Call links */}
                      {r.userPhone ? (
                        <a 
                          href={`https://wa.me/${r.userPhone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs font-semibold text-emerald-700 hover:underline block mt-0.5"
                        >
                          📱 {r.userPhone}
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 block">No phone provided</span>
                      )}

                      <div className="text-xs text-slate-400">{r.userCity || "City not specified"}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(r.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-slate-400">{r.userCity || "City not specified"}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(r.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>

                    {/* Associated Puja */}
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 text-xs block">
                        {r.puja?.titleEn || "General Review"}
                      </span>
                      {r.puja?.titleHi && (
                        <span className="text-[11px] text-amber-700 block mt-0.5">
                          {r.puja.titleHi}
                        </span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="p-4">
                      {renderStars(r.rating)}
                      <span className="text-[11px] font-bold text-slate-600 ml-0.5 mt-0.5 block">
                        {r.rating} / 5
                      </span>
                    </td>

                    {/* Comment Body */}
                    <td className="p-4 text-xs text-slate-700 leading-relaxed max-w-xs md:max-w-md">
                      {r.comment}
                    </td>

                    {/* Approval Status Badge */}
                    <td className="p-4">
                      {r.isApproved ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 text-right space-x-2">
                      <button
                        disabled={actionLoadingId === r.id}
                        onClick={() => handleToggleStatus(r.id, r.isApproved)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                          r.isApproved
                            ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            : "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {actionLoadingId === r.id ? "Processing..." : r.isApproved ? "Hide" : "Approve"}
                      </button>

                      <button
                        disabled={actionLoadingId === r.id}
                        onClick={() => handleDelete(r.id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2 py-1.5 transition"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}