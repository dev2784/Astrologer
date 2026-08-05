"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Category {
  id: string;
  nameEn: string;
  nameHi?: string;
  subcategories: { id: string; nameEn: string; nameHi?: string }[];
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pujaId?: string;
  pujaTitle?: string;
}

export default function BookingModal({ isOpen, onClose, pujaId, pujaTitle }: BookingModalProps) {
  const { language } = useLanguage();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [bookingDate, setBookingDate] = useState(""); // Date picker state

  // Category selection states (used when pujaId is not present)
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [subcategories, setSubcategories] = useState<{ id: string; nameEn: string; nameHi?: string }[]>([]);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const gurujiPhone = "+919340553012";
  const gurujiName = language === "hi" ? "आचार्य ऋषि नगर" : "Acharya Rishi nagar";

  // Get today's date in YYYY-MM-DD format to prevent past date selection
  const todayDate = new Date().toISOString().split("T")[0];

  // Fetch categories when opened without a pre-selected pujaId
  useEffect(() => {
    if (isOpen && !pujaId) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`)
        .then((res) => res.json())
        .then((data) => {
          if (data.categories) setCategories(data.categories);
        })
        .catch((err) => console.error("Error fetching categories:", err));
    }
  }, [isOpen, pujaId]);

  // Handle Category dropdown change
  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    setSelectedSubcategoryId("");
    const matchedCat = categories.find((c) => c.id === catId);
    setSubcategories(matchedCat?.subcategories || []);
  };

  if (!isOpen) return null;

  const formattedDate = bookingDate ? ` for Date: ${bookingDate}` : "";
  const whatsappMessage = encodeURIComponent(
    `Pranam Guruji, I want to inquire about booking: ${pujaTitle || "a Puja Service"}${formattedDate}`
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        pujaId: pujaId || null,
        categoryId: selectedCategoryId || null,
        subcategoryId: selectedSubcategoryId || null,
        name,
        phone,
        email,
        address,
        bookingDate, // Included in payload
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMessage(true);
        setTimeout(() => {
          setSuccessMessage(false);
          onClose();
        }, 2000);
      } else {
        alert("Failed to submit booking. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-2xl font-bold transition"
        >
          &times;
        </button>

        <h2 className="text-xl font-serif font-bold text-stone-900 mb-1">
          {language === "hi" ? "पूजा बुकिंग फॉर्म" : "Puja Booking Form"}
        </h2>
        {pujaTitle && <p className="text-xs text-orange-600 font-semibold mb-4">{pujaTitle}</p>}

        {successMessage ? (
          <div className="py-8 text-center space-y-3">
            <span className="text-5xl">✅</span>
            <h3 className="text-lg font-bold text-stone-800">
              {language === "hi" ? "बुकिंग सफलतापूर्वक प्राप्त हुई!" : "Booking Submitted Successfully!"}
            </h3>
            <p className="text-xs text-stone-500">
              {language === "hi" ? "हमारी टीम जल्द ही आपसे संपर्क करेगी।" : "Our team will contact you shortly."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Show Category & Subcategory Selection if pujaId is missing */}
            {!pujaId && (
              <div className="space-y-3 p-3.5 bg-orange-50/50 rounded-xl border border-orange-100">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {language === "hi" ? "श्रेणी चुनें *" : "Select Category *"}
                  </label>
                  <select
                    required
                    value={selectedCategoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-hidden"
                  >
                    <option value="">{language === "hi" ? "-- श्रेणी चुनें --" : "-- Select Category --"}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {language === "hi" && c.nameHi ? c.nameHi : c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                {subcategories.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      {language === "hi" ? "उप-श्रेणी चुनें *" : "Select Subcategory *"}
                    </label>
                    <select
                      required
                      value={selectedSubcategoryId}
                      onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-hidden"
                    >
                      <option value="">{language === "hi" ? "-- उप-श्रेणी चुनें --" : "-- Select Subcategory --"}</option>
                      {subcategories.map((s) => (
                        <option key={s.id} value={s.id}>
                          {language === "hi" && s.nameHi ? s.nameHi : s.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Date Picker Input */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                {language === "hi" ? "पूजा की तिथि *" : "Puja Date *"}
              </label>
              <input
                type="date"
                required
                min={todayDate}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-hidden bg-stone-50/50 text-stone-800"
              />
            </div>

            {/* User Form Inputs */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                {language === "hi" ? "नाम *" : "Full Name *"}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === "hi" ? "अपना नाम दर्ज करें" : "Enter your name"}
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-hidden bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                {language === "hi" ? "मोबाइल नंबर *" : "Phone Number *"}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 00000 00000"
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-hidden bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                {language === "hi" ? "ईमेल (वैकल्पिक)" : "Email Address (Optional)"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-hidden bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                {language === "hi" ? "पता *" : "Full Address *"}
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={language === "hi" ? "अपना पता लिखें" : "Enter your address"}
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-hidden bg-stone-50/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition"
            >
              {loading
                ? language === "hi"
                  ? "भेजा जा रहा है..."
                  : "Submitting..."
                : language === "hi"
                ? "बुकिंग की पुष्टि करें"
                : "Confirm Booking"}
            </button>

            {/* Direct Contact Options */}
            <div className="pt-4 border-t border-stone-200/80 space-y-3 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                {language === "hi" ? "— अथवा सीधे संपर्क करें —" : "— OR DIRECT CONTACT —"}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <a
                  href={`tel:${gurujiPhone}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold text-stone-800 transition"
                >
                  <span>📞</span>
                  <span>{gurujiName}</span>
                </a>

                <a
                  href={`https://wa.me/${gurujiPhone.replace("+", "")}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition"
                >
                  <span>💬</span>
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}