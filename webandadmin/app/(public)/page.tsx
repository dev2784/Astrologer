"use client";

import { useState } from "react";
import { Calendar, Phone, Flame, Users, Star } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import BookingModal from "@/components/ui/BookingModal";

export default function HomePage() {
  const { language, t } = useLanguage();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-red-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 leading-tight">
            {t("home.heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-red-100 mb-10 max-w-2xl mx-auto">
            {t("home.heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/services"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition shadow-lg text-lg"
            >
              {t("nav.bookPuja")}
            </Link>
            <Link
              href="/muhurat"
              className="px-8 py-4 bg-transparent border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white font-bold rounded-lg transition text-lg flex items-center justify-center gap-2"
            >
              <Calendar size={20} />
              {t("home.checkMuhurat")}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-serif text-slate-900">
            {t("home.primaryServices")}
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {language === "hi" ? "शादी ब्याह एवं विवाह" : "Shadi Byah & Vivah"}
              </h3>
              <p className="text-slate-600 mb-4 line-clamp-3 text-sm sm:text-base">
                {language === "hi"
                  ? "कुंडली मिलान, हल्दी, फेरे और शुभ मुहूर्त गणना के साथ प्रामाणिक वैदिक विवाह अनुष्ठान।"
                  : "Complete Vedic marriage ceremonies, including Kundli Milan, Haldi, Phere, and precise Muhurat calculations for a prosperous union."}
              </p>
            </div>
            <a href="/pujas" className="text-red-800 font-semibold hover:text-orange-600 transition inline-flex items-center gap-1">
              {t("pujaList.viewDetails")} &rarr;
            </a>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
                <Flame size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {language === "hi" ? "हवन एवं यज्ञ" : "Havan & Yagya"}
              </h3>
              <p className="text-slate-600 mb-4 line-clamp-3 text-sm sm:text-base">
                {language === "hi"
                  ? "शास्त्रोक्त नवग्रह शांति, रुद्राभिषेक और वास्तु हवन से अपने घर और व्यवसाय को शुद्ध करें।"
                  : "Purify your home or business with authentic Navagraha Shanti, Rudrabhishek, and Vastu Havans performed with strict adherence to shastras."}
              </p>
            </div>
            <a href="/pujas" className="text-red-800 font-semibold hover:text-orange-600 transition inline-flex items-center gap-1">
              {t("pujaList.viewDetails")} &rarr;
            </a>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
                <Star size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {language === "hi" ? "ज्योतिष एवं कुंडली परामर्श" : "Jyotish & Kundli"}
              </h3>
              <p className="text-slate-600 mb-4 line-clamp-3 text-sm sm:text-base">
                {language === "hi"
                  ? "जन्मपत्रिका के आधार पर विस्तृत ज्योतिषीय परामर्श, दोष निवारण और रत्न सुझाव।"
                  : "Detailed astrological consultations, dosha remedies, and personalized gemstone recommendations based on your exact birth chart."}
              </p>
            </div>
            <a href="/pujas" className="text-red-800 font-semibold hover:text-orange-600 transition inline-flex items-center gap-1">
              {t("pujaList.viewDetails")} &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* 3. TRUST & LEAD CAPTURE SECTION */}
      <section id="book" className="bg-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          
          {/* Trust Text */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-4">
              {language === "hi" ? "परामर्श के लिए संपर्क करें" : "Request a Consultation"}
            </h2>
            <p className="text-slate-700 mb-6 text-lg">
              {language === "hi"
                ? "अपनी आवश्यकता और विवरण साझा करें। हम पंचांग का अवलोकन करके शुभ मुहूर्त के लिए आपसे शीघ्र संपर्क करेंगे।"
                : "Provide your details and the service you require. We will review the Panchang and contact you to finalize the auspicious timing."}
            </p>
            <div className="flex items-center gap-4 text-slate-800 font-medium">
              <Phone className="text-orange-600" />
              <span>
                {language === "hi" ? "सीधा संपर्क" : "Direct Inquiry"}: +91 919340553012
              </span>
            </div>
          </div>

          {/* Quick Lead Form */}
          <div className="flex-1 w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {language === "hi" ? "पूरा नाम" : "Full Name"}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder={language === "hi" ? "अपना नाम दर्ज करें" : "Enter your name"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {language === "hi" ? "फोन नंबर" : "Phone Number"}
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="+91"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {language === "hi" ? "आवश्यक सेवा" : "Service Required"}
                </label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white">
                  <option>{language === "hi" ? "विवाह / शादी" : "Vivah / Marriage"}</option>
                  <option>{language === "hi" ? "गृह प्रवेश" : "Griha Pravesh"}</option>
                  <option>{language === "hi" ? "हवन / यज्ञ" : "Havan / Yagya"}</option>
                  <option>{language === "hi" ? "ज्योतिष परामर्श" : "Astrology Consultation"}</option>
                  <option>{language === "hi" ? "अन्य" : "Other"}</option>
                </select>
              </div>
              <button
                type="submit"
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full py-4 bg-red-900 text-white font-bold rounded-lg hover:bg-red-800 transition mt-2"
              >
                {language === "hi" ? "अनुरोध भेजें" : "Submit Request"}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Booking Modal Integration */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}