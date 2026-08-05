"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Phone, Flame, Users, Star, ArrowRight, 
  MessageCircle, Clock, BookOpen, ChevronRight, Sunrise, Sunset
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import BookingModal from "@/components/ui/BookingModal";

// Mock Latest Pujas Data
const LATEST_PUJAS = [
  { id: 1, titleEn: "Vivah Puja", titleHi: "विवाह पूजा", icon: <Users />, color: "text-pink-600", bg: "bg-pink-100" },
  { id: 2, titleEn: "Rudrabhishek", titleHi: "रुद्राभिषेक", icon: <Flame />, color: "text-orange-600", bg: "bg-orange-100" },
  { id: 3, titleEn: "Navagraha Shanti", titleHi: "नवग्रह शांति", icon: <Star />, color: "text-indigo-600", bg: "bg-indigo-100" },
  { id: 4, titleEn: "Vastu Shanti", titleHi: "वास्तु शांति", icon: <BookOpen />, color: "text-emerald-600", bg: "bg-emerald-100" },
  { id: 5, titleEn: "Griha Pravesh", titleHi: "गृह प्रवेश", icon: <Users />, color: "text-teal-600", bg: "bg-teal-100" },
  { id: 6, titleEn: "Maha Mrityunjaya", titleHi: "महामृत्युंजय", icon: <Flame />, color: "text-red-600", bg: "bg-red-100" },
  { id: 7, titleEn: "Satyanarayan Katha", titleHi: "सत्यनारायण कथा", icon: <BookOpen />, color: "text-amber-600", bg: "bg-amber-100" },
  { id: 8, titleEn: "Namkaran", titleHi: "नामकरण संस्कार", icon: <Users />, color: "text-blue-600", bg: "bg-blue-100" },
  { id: 9, titleEn: "Mundan", titleHi: "मुंडन संस्कार", icon: <Star />, color: "text-purple-600", bg: "bg-purple-100" },
  { id: 10, titleEn: "Kaal Sarp Dosh", titleHi: "काल सर्प दोष निवारण", icon: <Flame />, color: "text-slate-600", bg: "bg-slate-200" },
];

export default function HomePage() {
  const { language, t } = useLanguage();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Panchang State
  const [panchang, setPanchang] = useState<any>(null);
  
  // Contact Form State
  const [formData, setFormData] = useState({ name: "", phone: "", service: "Vivah / Marriage" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

  // Fetch Today's Panchang
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    fetch(`${API_URL}/panchang?date=${today}`)
      .then(res => res.json())
      .then(data => setPanchang(data.data || null))
      .catch(err => console.error(err));
  }, [API_URL]);

  // Handle Contact Submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return alert("Please fill all fields.");
    
    setSubmitStatus("loading");
    try {
      // Replace with your actual email sending API route
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", service: "Vivah / Marriage" });
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        throw new Error("Failed to send");
      }
    } catch (err) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  const getChoghadiyaColor = (type: string) => {
    if (type === "shubh") return "bg-green-50 text-green-700 border-green-200";
    if (type === "ashubh") return "bg-red-50 text-red-700 border-red-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  const currentWHNumber = "919340553012";

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION (Parallax Background) */}
      <section 
        className="relative bg-fixed bg-center bg-cover py-32 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[85vh]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1604005934273-047f3b89b4f6?auto=format&fit=crop&q=80')" }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-in-up">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 font-semibold text-sm mb-6 uppercase tracking-widest backdrop-blur-sm">
            {language === "hi" ? "प्रामाणिक वैदिक अनुष्ठान" : "Authentic Vedic Rituals"}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight text-white drop-shadow-lg">
            {t("home.heroTitle")}
          </h1>
          <p className="text-lg md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-medium drop-shadow">
            {t("home.heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link
              href="/services"
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-full transition-all duration-300 shadow-xl shadow-orange-900/50 hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
            >
              {t("nav.bookPuja")} <ArrowRight size={20} />
            </Link>
            <Link
              href="/muhurat"
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-orange-900 font-bold rounded-full transition-all duration-300 text-lg flex items-center justify-center gap-2 hover:-translate-y-1"
            >
              <Calendar size={20} />
              {t("home.checkMuhurat")}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. LATEST PUJAS SCROLLER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900">
            {language === "hi" ? "हमारी प्रमुख सेवाएं" : "Our Primary Services"}
          </h2>
          <div className="w-24 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>
        </div>
        
        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-10 pt-4 px-4 custom-scrollbar">
          {LATEST_PUJAS.map((puja) => (
            <div 
              key={puja.id} 
              className="min-w-[280px] md:min-w-[320px] snap-center shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-orange-200 transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
            >
              <div className={`w-16 h-16 ${puja.bg} ${puja.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {puja.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {language === "hi" ? puja.titleHi : puja.titleEn}
              </h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                {language === "hi" ? "संपूर्ण विधि-विधान और वैदिक मंत्रोच्चार के साथ पूजा संपन्न कराई जाती है।" : "Performed with complete Vedic rituals and authentic mantras by expert Pandits."}
              </p>
              <Link href="/services" className="text-orange-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                {t("pujaList.viewDetails")} <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link href="/services" className="inline-block px-8 py-3 rounded-full border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-colors duration-300">
            {language === "hi" ? "सभी सेवाएं देखें" : "View All Services"}
          </Link>
        </div>
      </section>

      {/* 3. PANCHANG & CHOGHADIYA SECTION */}
      <section className="py-20 bg-orange-50 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif text-slate-900">
              {language === "hi" ? "आज का पंचांग एवं चौघड़िया" : "Today's Panchang & Choghadiya"}
            </h2>
            <p className="text-slate-600 mt-2">{new Date().toLocaleDateString(language === "hi" ? 'hi-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left: Day Choghadiya */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-orange-600 mb-4 flex items-center gap-2 border-b pb-2">
                <Sunrise size={20} /> {language === "hi" ? "दिन का चौघड़िया" : "Day Choghadiya"}
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {panchang?.choghadiya_day ? panchang.choghadiya_day.map((slot: any, i: number) => (
                  <div key={i} className={`flex justify-between items-center p-3 rounded-lg border text-sm ${getChoghadiyaColor(slot.type)}`}>
                    <span className="font-bold">{slot.name}</span>
                    <span className="text-xs font-mono font-medium">{slot.start} - {slot.end}</span>
                  </div>
                )) : <p className="text-slate-400 text-sm text-center py-4">Data loading...</p>}
              </div>
            </div>

            {/* Middle: Brief Panchang */}
            <div className="bg-gradient-to-br from-red-900 to-orange-900 rounded-2xl p-6 shadow-lg text-white flex flex-col justify-between transform md:scale-105 z-10 relative">
              <div>
                <h3 className="text-xl font-bold font-serif text-orange-200 mb-6 text-center border-b border-white/20 pb-4">
                  {language === "hi" ? "पंचांग सारांश" : "Panchang Summary"}
                </h3>
                
                {panchang ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                      <span className="text-orange-200 text-sm">Tithi</span>
                      <span className="font-bold text-right">{panchang.tithi?.details?.tithi_name || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                      <span className="text-orange-200 text-sm">Nakshatra</span>
                      <span className="font-bold text-right">{panchang.nakshatra?.details?.nak_name || "—"}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-black/20 p-3 rounded-lg text-center">
                        <Sunrise size={18} className="mx-auto mb-1 text-orange-300" />
                        <span className="text-xs block text-orange-200">Sunrise</span>
                        <span className="font-mono text-sm font-bold">{panchang.sunrise || "—"}</span>
                      </div>
                      <div className="bg-black/20 p-3 rounded-lg text-center">
                        <Sunset size={18} className="mx-auto mb-1 text-orange-300" />
                        <span className="text-xs block text-orange-200">Sunset</span>
                        <span className="font-mono text-sm font-bold">{panchang.sunset || "—"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-white/10 rounded-lg"></div>
                    <div className="h-10 bg-white/10 rounded-lg"></div>
                  </div>
                )}
              </div>
              
              <Link href="/panchang" className="mt-8 block w-full py-3 bg-white text-red-900 text-center font-bold rounded-xl hover:bg-orange-100 transition-colors">
                {language === "hi" ? "विस्तृत पंचांग देखें" : "See Full Panchang"}
              </Link>
            </div>

            {/* Right: Night Choghadiya */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-indigo-800 mb-4 flex items-center gap-2 border-b pb-2">
                <Sunset size={20} /> {language === "hi" ? "रात का चौघड़िया" : "Night Choghadiya"}
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {panchang?.choghadiya_night ? panchang.choghadiya_night.map((slot: any, i: number) => (
                  <div key={i} className={`flex justify-between items-center p-3 rounded-lg border text-sm ${getChoghadiyaColor(slot.type)}`}>
                    <span className="font-bold">{slot.name}</span>
                    <span className="text-xs font-mono font-medium">{slot.start} - {slot.end}</span>
                  </div>
                )) : <p className="text-slate-400 text-sm text-center py-4">Data loading...</p>}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. TODAY'S MUHURAT */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-serif text-slate-900 mb-8">
            {language === "hi" ? "आज के प्रमुख मुहूर्त" : "Today's Important Muhurats"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-green-50 border border-green-200 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-200 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={24} />
              </div>
              <h3 className="text-lg font-bold text-green-900 mb-2">Abhijit Muhurta</h3>
              <p className="text-2xl font-mono text-green-700 font-semibold">
                {panchang?.abhijit_muhurta?.start && panchang?.abhijit_muhurta?.end ? 
                  `${panchang.abhijit_muhurta.start} - ${panchang.abhijit_muhurta.end}` : "Not Available"}
              </p>
              <p className="text-sm text-green-600 mt-2">Highly auspicious for new beginnings.</p>
            </div>
            
            <div className="p-6 bg-red-50 border border-red-200 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-red-200 text-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-red-900 mb-2">Rahu Kaal</h3>
              <p className="text-2xl font-mono text-red-700 font-semibold">
                {panchang?.rahukaal?.start && panchang?.rahukaal?.end ? 
                  `${panchang.rahukaal.start} - ${panchang.rahukaal.end}` : "Not Available"}
              </p>
              <p className="text-sm text-red-600 mt-2">Inauspicious. Avoid starting important tasks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT PANDIT JI SECTION */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-200">
            {/* Image Placeholder */}
            <div className="w-full md:w-2/5 flex justify-center relative">
              {/* Add your Pandit ji image url in src below */}
              <div className="w-64 h-64 md:w-80 md:h-80 bg-orange-200 rounded-full border-8 border-orange-50 overflow-hidden shadow-xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1579227114347-15d08fc37cae?auto=format&fit=crop&q=80" 
                  alt="Pandit Ji" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 right-1/4 bg-orange-600 text-white p-3 rounded-full shadow-lg">
                <Star className="w-6 h-6 fill-current" />
              </div>
            </div>

            {/* Text Content */}
            <div className="w-full md:w-3/5 text-center md:text-left space-y-6">
              <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">
                {language === "hi" ? "हमारे बारे में" : "About Us"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900">
                Acharya Pandit Ji
              </h2>
              <div className="w-16 h-1 bg-orange-500 mx-auto md:mx-0"></div>
              <p className="text-slate-600 text-lg leading-relaxed">
                {language === "hi" 
                  ? "काशी (वाराणसी) के प्रतिष्ठित गुरुकुलों से शिक्षित, आचार्य जी को वैदिक अनुष्ठान, ज्योतिष, वास्तु शास्त्र और कर्मकांड में 20 से अधिक वर्षों का गहन अनुभव है। हमारा उद्देश्य प्राचीन वैदिक परंपराओं को पूर्ण शुद्धता और प्रामाणिकता के साथ आपके जीवन में लाना है।"
                  : "Educated from the prestigious Gurukuls of Kashi (Varanasi), Acharya Ji holds over 20 years of profound experience in Vedic rituals, Astrology, Vastu Shastra, and Karmakand. Our mission is to bring ancient Vedic traditions into your life with absolute purity and authenticity."}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="text-center md:text-left">
                  <h4 className="text-3xl font-bold text-orange-600">20+</h4>
                  <p className="text-sm text-slate-500 font-medium">Years Experience</p>
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-3xl font-bold text-orange-600">5000+</h4>
                  <p className="text-sm text-slate-500 font-medium">Pujas Performed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRUST & LEAD CAPTURE SECTION (Contact) */}
      <section id="contact" className="bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          
          {/* Trust Text & WhatsApp */}
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-orange-400">
              {language === "hi" ? "परामर्श के लिए संपर्क करें" : "Request a Consultation"}
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md">
              {language === "hi"
                ? "अपनी आवश्यकता और विवरण साझा करें। हम पंचांग का अवलोकन करके शुभ मुहूर्त के लिए आपसे शीघ्र संपर्क करेंगे।"
                : "Provide your details and the service you require. We will review the Panchang and contact you to finalize the auspicious timing."}
            </p>
            
            <div className="space-y-4 pt-4 border-t border-slate-700">
              <a href={`tel:+${currentWHNumber}`} className="flex items-center gap-4 text-lg font-medium hover:text-orange-400 transition w-max">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-orange-500">
                  <Phone size={24} />
                </div>
                <span>+{currentWHNumber}</span>
              </a>
              
              <a 
                href={`https://wa.me/${currentWHNumber}?text=Hari%20Om!%20I%20would%20like%20to%20know%20more%20about%20booking%20a%20Puja.`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-lg font-medium hover:text-green-400 transition w-max"
              >
                <div className="w-12 h-12 bg-green-900/40 rounded-full flex items-center justify-center text-green-500 border border-green-800">
                  <MessageCircle size={24} />
                </div>
                <span>{language === "hi" ? "व्हाट्सएप पर मैसेज करें" : "Message on WhatsApp"}</span>
              </a>
            </div>
          </div>

          {/* Working Lead Form */}
          <div className="flex-1 w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl text-slate-900">
            <h3 className="text-2xl font-bold mb-6 text-center">
              {language === "hi" ? "अपना विवरण दें" : "Fill Your Details"}
            </h3>
            
            <form className="flex flex-col gap-5" onSubmit={handleContactSubmit}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  {language === "hi" ? "पूरा नाम" : "Full Name"} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none bg-slate-50"
                  placeholder={language === "hi" ? "अपना नाम दर्ज करें" : "Enter your name"}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  {language === "hi" ? "फोन नंबर" : "Phone Number"} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none bg-slate-50"
                  placeholder="+91"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  {language === "hi" ? "आवश्यक सेवा" : "Service Required"}
                </label>
                <select 
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white font-medium"
                >
                  <option>Vivah / Marriage</option>
                  <option>Griha Pravesh</option>
                  <option>Havan / Yagya</option>
                  <option>Astrology Consultation</option>
                  <option>Other</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={submitStatus === "loading"}
                className={`w-full py-4 text-white font-bold rounded-lg transition mt-2 shadow-md ${
                  submitStatus === "loading" ? "bg-slate-400 cursor-not-allowed" : 
                  submitStatus === "success" ? "bg-green-600" :
                  submitStatus === "error" ? "bg-red-600" :
                  "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {submitStatus === "loading" ? "Sending..." :
                 submitStatus === "success" ? "Request Sent Successfully!" :
                 submitStatus === "error" ? "Failed! Try Again" :
                 (language === "hi" ? "अनुरोध भेजें" : "Submit Request")}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Internal CSS for horizontal scrollbar hiding */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f97316;
        }
      `}} />

      {/* Booking Modal Integration */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}