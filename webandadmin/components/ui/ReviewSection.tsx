"use client";

import { useState, useEffect } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Review {
  id: string;
  userName: string;
  userCity?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewSection({ pujaId }: { pujaId: string }) {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | string>(0);
  const [loading, setLoading] = useState(true);

  // Form State with userPhone included
  const [formData, setFormData] = useState({
    userName: "",
    userPhone: "",
    userCity: "",
    rating: 5,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

  useEffect(() => {
    if (pujaId) fetchReviews();
  }, [pujaId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/reviews/puja/${pujaId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
      }
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.comment) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, pujaId }),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitSuccess(true);
        setFormData({ userName: "", userPhone: "", userCity: "", rating: 5, comment: "" });
      } else {
        alert(data.error || "Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200/80 shadow-xs mt-10">
      
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            {language === "hi" ? "श्रद्धालुओं की समीक्षाएं" : "Devotee Reviews"}
          </h3>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            {reviews.length} {language === "hi" ? "समीक्षाएं दर्ज की गईं" : "verified reviews"}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200/60 self-start sm:self-auto">
          <div className="flex items-center text-amber-500">
            <Star size={22} className="fill-amber-400" />
            <span className="text-2xl font-black text-amber-900 ml-2">{avgRating}</span>
          </div>
          <span className="text-stone-400 font-bold text-sm">/ 5</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="py-6 space-y-4">
        {loading ? (
          <p className="text-stone-400 text-xs sm:text-sm py-4">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-stone-500 text-xs sm:text-sm italic py-4">
            {language === "hi" ? "अभी तक कोई समीक्षा नहीं है। पहली समीक्षा लिखें!" : "No reviews yet. Be the first to share your experience!"}
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-stone-50/70 p-4 md:p-5 rounded-xl border border-stone-200/60 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">{r.userName}</h4>
                  {r.userCity && <span className="text-xs text-stone-400">{r.userCity}</span>}
                </div>
                
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-stone-200 fill-stone-200"}
                    />
                  ))}
                </div>
              </div>

              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">{r.comment}</p>
              
              <span className="text-[10px] text-stone-400 block pt-1">
                {new Date(r.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Submit Form with Mobile Number Field */}
      <div className="pt-6 border-t border-stone-100">
        <h4 className="text-base sm:text-lg font-bold text-stone-900 mb-4">
          {language === "hi" ? "अपनी समीक्षा लिखें" : "Write a Review"}
        </h4>

        {submitSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
            <CheckCircle2 color="#16a34a" size={20} className="shrink-0" />
            <span className="text-xs sm:text-sm font-medium">
              {language === "hi"
                ? "धन्यवाद! आपकी समीक्षा स्वीकृति के लिए भेज दी गई है।"
                : "Thank you! Your review has been submitted for admin approval."}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input Grid (3 Fields) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                required
                placeholder={language === "hi" ? "आपका नाम *" : "Your Name *"}
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-stone-50/50 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="tel"
                placeholder={language === "hi" ? "मोबाइल नंबर (वैकल्पिक)" : "Mobile Number (Optional)"}
                value={formData.userPhone}
                onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-stone-50/50 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                placeholder={language === "hi" ? "शहर (वैकल्पिक)" : "City (Optional)"}
                value={formData.userCity}
                onChange={(e) => setFormData({ ...formData, userCity: e.target.value })}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-stone-50/50 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Rating Selector */}
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1.5 uppercase tracking-wider">
                {language === "hi" ? "रेटिंग चुनें" : "Rating"}
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 focus:outline-none transition hover:scale-110"
                  >
                    <Star
                      size={22}
                      className={star <= formData.rating ? "text-amber-400 fill-amber-400" : "text-stone-300"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              required
              rows={3}
              placeholder={language === "hi" ? "अपना अनुभव यहाँ लिखें..." : "Write your experience here..."}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-stone-50/50 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            ></textarea>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-xs flex items-center gap-2 text-xs sm:text-sm"
            >
              <Send size={15} />
              {isSubmitting ? "Submitting..." : language === "hi" ? "समीक्षा भेजें" : "Submit Review"}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}