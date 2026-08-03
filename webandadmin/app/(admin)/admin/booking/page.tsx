"use client";

import { useState, useEffect } from "react";

type BookingStatus = "PENDING" | "COMPLETED" | "CANCELLED";

interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  status: BookingStatus;
  createdAt: string;
  puja?: { titleEn: string; titleHi: string; charges: string };
}

const PAGE_SIZE = 10;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BookingStatus>("PENDING");

  // Date Filter State (YYYY-MM-DD format)
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Pagination State
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Fetch all bookings
  const fetchBookings = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8080/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) setBookings(data.bookings);
      })
      .catch((err) => console.error("Error fetching bookings:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
  }, []);

  // Reset pagination count back to 10 whenever tab or date filter changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(PAGE_SIZE);
  }, [activeTab, selectedDate]);

  // Update Status Action
  const handleStatusUpdate = async (id: string, newStatus: BookingStatus) => {
    // Debug log to make sure id is actually being passed on frontend
    console.log("Sending PATCH for ID:", id);
  
    try {
      const res = await fetch(`http://127.0.0.1:8080/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }), // Body ONLY carries status
      });
  
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status.");
    }
  };

  // Helper for quick date shortcuts
  const setQuickDate = (type: "today" | "yesterday" | "clear") => {
    if (type === "clear") {
      setSelectedDate("");
      return;
    }
    const today = new Date();
    if (type === "yesterday") {
      today.setDate(today.getDate() - 1);
    }
    setSelectedDate(today.toISOString().split("T")[0]);
  };

  // 1. Filter bookings by Tab AND Date
  // 2. Sort in Descending order by createdAt date
  const filteredAndSortedBookings = bookings
    .filter((b) => {
      const matchesTab = b.status === activeTab;
      if (!selectedDate) return matchesTab;
      const bookingDate = new Date(b.createdAt).toISOString().split("T")[0];
      return matchesTab && bookingDate === selectedDate;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Paginated subset of filtered items
  const visibleBookings = filteredAndSortedBookings.slice(0, visibleCount);

  // Helper for total tab counts
  const getStatusCount = (status: BookingStatus) =>
    bookings.filter((b) => {
      const matchesTab = b.status === status;
      if (!selectedDate) return matchesTab;
      const bookingDate = new Date(b.createdAt).toISOString().split("T")[0];
      return matchesTab && bookingDate === selectedDate;
    }).length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header & Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Puja Bookings Management</h1>
          <p className="text-xs text-slate-500">
            Manage booking requests, filter by date, and track status
          </p>
        </div>

        {/* Date Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
            <span className="text-xs text-slate-400 font-bold">📅 Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-semibold text-slate-700 outline-hidden bg-transparent cursor-pointer"
            />
          </div>

          <button
            onClick={() => setQuickDate("today")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
              selectedDate === new Date().toISOString().split("T")[0]
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Today
          </button>

          <button
            onClick={() => setQuickDate("yesterday")}
            className="px-3 py-1.5 text-xs font-bold bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
          >
            Yesterday
          </button>

          {selectedDate && (
            <button
              onClick={() => setQuickDate("clear")}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition cursor-pointer"
            >
              Clear Filter ✕
            </button>
          )}
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`pb-3 px-4 font-semibold text-sm transition relative flex items-center gap-2 cursor-pointer ${
            activeTab === "PENDING"
              ? "text-orange-600 border-b-2 border-orange-600 font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>⏳ Pending</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">
            {getStatusCount("PENDING")}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("COMPLETED")}
          className={`pb-3 px-4 font-semibold text-sm transition relative flex items-center gap-2 cursor-pointer ${
            activeTab === "COMPLETED"
              ? "text-emerald-600 border-b-2 border-emerald-600 font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>✅ Completed</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800">
            {getStatusCount("COMPLETED")}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("CANCELLED")}
          className={`pb-3 px-4 font-semibold text-sm transition relative flex items-center gap-2 cursor-pointer ${
            activeTab === "CANCELLED"
              ? "text-rose-600 border-b-2 border-rose-600 font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>❌ Cancelled</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-rose-100 text-rose-800">
            {getStatusCount("CANCELLED")}
          </span>
        </button>
      </div>

      {/* Booking Table Section */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 text-sm">Loading bookings...</div>
      ) : filteredAndSortedBookings.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
          No {activeTab.toLowerCase()} bookings found {selectedDate ? `for ${selectedDate}` : ""}.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Puja Service</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Date Requested</th>
                  {activeTab === "PENDING" && <th className="p-4 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-slate-900">{b.name}</td>

                    <td className="p-4 space-y-0.5">
                      <div className="font-semibold text-orange-600">{b.phone}</div>
                      {b.email && <div className="text-xs text-slate-400">{b.email}</div>}
                    </td>

                    <td className="p-4 font-medium text-slate-800">
                      {b.puja ? (
                        <>
                          <div>{b.puja.titleEn}</div>
                          <div className="text-xs text-slate-400">{b.puja.titleHi}</div>
                        </>
                      ) : (
                        <span className="text-xs text-amber-600 italic">General Inquiry</span>
                      )}
                    </td>

                    <td className="p-4 text-xs text-slate-600 max-w-xs truncate">{b.address}</td>

                    <td className="p-4 text-xs text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {activeTab === "PENDING" && (
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStatusUpdate(b.id, "COMPLETED")}
                            title="Mark as Completed"
                            className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200 flex items-center justify-center font-bold text-sm transition shadow-xs cursor-pointer"
                          >
                            ✓
                          </button>

                          <button
                            onClick={() => handleStatusUpdate(b.id, "CANCELLED")}
                            title="Mark as Cancelled"
                            className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 flex items-center justify-center font-bold text-sm transition shadow-xs cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Load More Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
            <div>
              Showing <strong className="text-slate-800">{visibleBookings.length}</strong> of{" "}
              <strong className="text-slate-800">{filteredAndSortedBookings.length}</strong> entries
            </div>

            {visibleCount < filteredAndSortedBookings.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Load More ({filteredAndSortedBookings.length - visibleCount} remaining)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}