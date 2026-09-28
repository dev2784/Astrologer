"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Phone, Flame, Users, Star, ArrowRight, 
  MessageCircle, Clock, BookOpen, ChevronRight, Sunrise, Sunset,
  CheckCircle2, Image as ImageIcon, X, ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import BookingModal from "@/components/ui/BookingModal";


import type { PanchangData, PujaSummary, ChoghadiyaSlot } from "@/lib/content-types";

interface GalleryItem {
  id: string;
  titleEn: string;
  titleHi?: string;
  imageUrl: string;
}

interface FeaturedReview {
  id: string;
  userName: string;
  userCity?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface about {
  name: string;
  image: string;
  yearsExp: number;
  pujasDone: number;
  whatsappNo: string;
  descriptionEn: string;
  descriptionHi: string;
}

export default function HomePage() {
  const { language, t } = useLanguage();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPujaTitle, setSelectedPujaTitle] = useState("");

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [aboutData, setAboutData] = useState<about>({
  name: "Acharya Rishi Nagar Ji",
  image: "./pandit-logo.png",
  yearsExp: 20,
  pujasDone: 5000,
  whatsappNo: "919340553012",
  descriptionEn: "Educated from the prestigious Gurukuls of Ujjain, Acharya Ji holds over 20 years of profound experience in Vedic rituals...",
  descriptionHi: "उज्जैन के प्रतिष्ठित गुरुकुल से शिक्षित, आचार्य जी को वैदिक अनुष्ठान...",
});
  
  // Panchang State
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  
  // Dynamic Pujas & Reviews State
  const [latestPujas, setLatestPujas] = useState<PujaSummary[]>([]);
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const [loadingPujas, setLoadingPujas] = useState(true);  
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Contact Form State
  const [formData, setFormData] = useState({ name: "", phone: "", service: "Vivah / Marriage" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";
  const currentWHNumber = "919340553012";

  const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-");        // Replace spaces with hyphens
  };


  useEffect(() => {
    // Fetch Gallery Items
    fetch(`${API_URL}/gallery`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setGalleryItems(data.items);
      })
      .catch(err => console.error("Gallery error:", err));
  }, [API_URL]);

  useEffect(() => {
  // Fetch Dynamic About Data
  fetch(`${API_URL}/about`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success && data.about) setAboutData(data.about);
    })
    .catch((err) => console.error("About fetch error:", err));
}, [API_URL]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    
    // 1. Fetch Today's Panchang
    fetch(`${API_URL}/panchang?date=${today}`)
      .then(res => res.json())
      .then(data => setPanchang(data.data || null))
      .catch(err => console.error("Panchang error:", err));

    // 2. Fetch Latest Pujas
    fetch(`${API_URL}/pujas`)
      .then(res => res.json())
      .then(data => {
        const fetchedPujas = data.pujas || data || [];
        setLatestPujas(fetchedPujas.slice(0, 10));
      })
      .catch(err => console.error("Failed to fetch pujas:", err))
      .finally(() => setLoadingPujas(false));

    // 3. Fetch Featured Approved Reviews
    fetch(`${API_URL}/reviews/featured`)
      .then(res => res.json())
      .then(data => {
        if (data.reviews) setReviews(data.reviews.slice(0, 10));
      })
      .catch(err => console.error("Failed to fetch reviews:", err));
  }, [API_URL]);

  const handleOpenBooking = (pujaName: string) => {
    setSelectedPujaTitle(pujaName);
    setIsBookingModalOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return alert("Please fill all fields.");
    
    setSubmitStatus("loading");
    try {
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

  // Handle Keyboard Navigation (Esc to close, Left/Right arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") setLightboxIndex(prev => prev === null ? null : (prev + galleryItems.length - 1) % galleryItems.length);
      if (e.key === "ArrowRight") setLightboxIndex(prev => prev === null ? null : (prev + 1) % galleryItems.length);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, galleryItems]);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === 0 ? galleryItems.length - 1 : (prev as number) - 1));
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === galleryItems.length - 1 ? 0 : (prev as number) + 1));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION (Parallax Background) */}
      <section 
        className="relative bg-fixed bg-center bg-cover py-32 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[85vh]"
        style={{ backgroundImage: "url('./pbanner.png')" }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>
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

      {/* ================================================================= */}
      {/* 2. STATIC PUJA SECTIONS (ALTERNATING LAYOUT) */}
      {/* ================================================================= */}

      {/* 2.1 VASTU PUJAN (Left Image | Right Details) */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
              <img 
                src="/vastu.png" 
                alt="Vastu Shanti Puja" 
                className="w-full h-full object-fill"
              />
            </div>
            <div className="space-y-6">
              <span className="text-orange-600 font-bold tracking-wider uppercase text-xs sm:text-sm">
                {language === "hi" ? "वास्तु शांति अनुष्ठान" : "Vastu Shanti Rituals"}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                {language === "hi" ? "वास्तु दोष निवारण एवं गृह शांति" : "Vastu Dosha Nivaran & Shanti"}
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                {language === "hi"
                  ? "नये घर या व्यावसायिक स्थल में सुख, समृद्धि और शांति के लिए संपूर्ण वैदिक रीति-रिवाज से वास्तु पूजन एवं हवन संपन्न कराया जाता है।"
                  : "Remove negative energies and bring prosperity to your new home or office with authentic Vastu Shanti Puja performed by Vedic Gurus."}
              </p>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-orange-600" />
                  <span>{language === "hi" ? "दोष निवारण एवं सकारात्मक ऊर्जा स्थापना" : "Negates directional & structural Vastu defects"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-orange-600" />
                  <span>{language === "hi" ? "नवग्रह एवं वास्तु देवता पूजन" : "Comprehensive Navgrah & Vastu Devta Havan"}</span>
                </div>
              </div>
              <Link
                href={`/pujas/${createSlug("Vastu pujan")}`} // Resolves to /pujas/bhat-puja
                className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-md flex items-center gap-2 text-sm inline-flex"
              >
                {language === "hi" ? "वास्तु पूजन बुक करें" : "Book Vastu Puja"}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2.2 PUJAN / GENERAL HAVAN (Left Details | Right Image) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <span className="text-orange-600 font-bold tracking-wider uppercase text-xs sm:text-sm">
                {language === "hi" ? "वैदिक पूजन एवं हवन" : "Vedic Pujan & Havan"}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                {language === "hi" ? "विशेष पूजन एवं सर्वकल्याण यज्ञ" : "Special Pujan & Universal Havan"}
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                {language === "hi"
                  ? "सत्यनारायण कथा, महामृत्युंजय जाप, गणेश पूजन और दुर्गा पाठ का शुद्ध मंत्रोच्चार के साथ आयोजन।"
                  : "Experience complete spiritual upliftment through authentic Vedic Pujas including Satyanarayan Katha, Mahamrityunjay Jaap, and Chandi Paath."}
              </p>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-orange-600" />
                  <span>{language === "hi" ? "शुद्ध सामग्री एवं विद्वान पंडितों द्वारा" : "100% Pure Samagri provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-orange-600" />
                  <span>{language === "hi" ? "व्यक्तिगत एवं सामूहिक अनुष्ठान सुविधा" : "In-person at home or online options"}</span>
                </div>
              </div>            
              <Link
                href={`/pujas/${createSlug("Grahan dosh pujan")}`} // Resolves to /pujas/bhat-puja
                className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-md flex items-center gap-2 text-sm inline-flex"
              >
                {language === "hi" ? "पूजन बुक करें" : "Book Pujan"}
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200 order-1 md:order-2">
              <img 
                src="./yagya.png" 
                alt="Vedic Pujan" 
                className="w-full h-full object-fill"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2.3 MANGAL PUJAN (Left Image | Right Details) */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
              <img 
                src="./mangal.png" 
                alt="Mangal Dosh Shanti" 
                className="w-full h-full object-fill"
              />
            </div>
            <div className="space-y-6">
              <span className="text-orange-600 font-bold tracking-wider uppercase text-xs sm:text-sm">
                {language === "hi" ? "उज्जैन विशेष अनुष्ठान" : "Ujjain Special Ritual"}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                {language === "hi" ? "मंगल दोष निवारण पूजन" : "Mangal Dosh Shanti Puja"}
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                {language === "hi"
                  ? "विवाह में आ रही बाधाओं तथा मंगल ग्रह के अशुभ प्रभाव को समाप्त करने के लिए मंगलनाथ मंदिर उज्जैन परंपरा अनुसार विशेष भात पूजा।"
                  : "Resolve marital delays and astrological Mangal Dosha imbalances with traditional Bhaat Puja and Jaap performed strictly per scriptures."}
              </p>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-orange-600" />
                  <span>{language === "hi" ? "मंगल भात पूजा एवं विशेष अभिषेक" : "Authentic Bhaat Puja & Abhishek"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-orange-600" />
                  <span>{language === "hi" ? "वैवाहिक जीवन में शांति और शीघ्र विवाह योग्य योग" : "Eases delays in marriage"}</span>
                </div>
              </div>
              <Link
                href={`/pujas/${createSlug("Mangal bhat pujan")}`} // Resolves to /pujas/bhat-puja
                className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-md flex items-center gap-2 text-sm inline-flex"
              >
                {language === "hi" ? "मंगल पूजा बुक करें" : "Book Mangal Puja"}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2.4 KALSARP PUJAN (Left Details | Right Image) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <span className="text-orange-600 font-bold tracking-wider uppercase text-xs sm:text-sm">
                {language === "hi" ? "राहु-केतु शांति" : "Rahu-Ketu Shanti"}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                {language === "hi" ? "कालसर्प दोष निवारण पूजा" : "Kalsarp Dosh Nivaran Puja"}
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                {language === "hi"
                  ? "जीवन में अचानक आने वाली रुकावटों, मानसिक तनाव और करियर बाधाओं से मुक्ति पाने के लिए विशेष नाग-नागिन प्रतिमा पूजन और राहु-केतु मंत्र जाप।"
                  : "Overcome sudden life obstacles, mental anxiety, and professional blockages with authentic Kalsarp Dosh Shanti Puja."}
              </p>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-orange-600" />
                  <span>{language === "hi" ? "12 प्रकार के कालसर्प दोषों का वैज्ञानिक समाधान" : "Remedies all 12 types of Kalsarp Yoga"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-orange-600" />
                  <span>{language === "hi" ? "उज्जैन तीर्थ पर विशेष संकल्प पूजन" : "Performed at sacred river banks / Ujjain Kshetra"}</span>
                </div>
              </div>
              <Link
                href={`/pujas/${createSlug("Kalsharp pujan")}`} // Resolves to /pujas/bhat-puja
                className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-md flex items-center gap-2 text-sm inline-flex"
              >
                {language === "hi" ? "कालसर्प पूजा बुक करें" : "Book Kalsarp Puja"}
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200 order-1 md:order-2">
              <img 
                src="./kalsarp.png" 
                alt="Kalsarp Puja" 
                className="w-full h-full object-fill"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 VIVAH / MARRIAGE (Left Image | Right Details) */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
              <img 
                src="./vivah.png" 
                alt="Vivah Sanskar" 
                className="w-full h-full object-fill"
              />
            </div>
            <div className="space-y-6">
              <span className="text-orange-600 font-bold tracking-wider uppercase text-xs sm:text-sm">
                {language === "hi" ? "पाणिग्रहण संस्कार" : "Pani Grahan Sanskar"}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                {language === "hi" ? "विवाह एवं मांगलिक कार्य" : "Vedic Vivah & Marriage Rituals"}
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                {language === "hi"
                  ? "सप्तपदी, कन्यादान, जयमाला और विवाह के सभी 16 संस्कारों को विद्वान आचार्यों के निर्देशन में शुद्ध वैदिक मंत्रोच्चार के साथ संपन्न करें।"
                  : "Complete Vedic wedding ceremonies including Saptapadi, Kanyadaan, and Havan guided strictly according to Sanatan scriptures."}
              </p>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-orange-600" />
                  <span>{language === "hi" ? "शुभ मुहूर्त निर्धारण एवं संपूर्ण विधि-विधान" : "Auspicious Muhurat calculation included"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-orange-600" />
                  <span>{language === "hi" ? "अनुभवी वैदिक पंडितों की पूरी टीम" : "Full team of experienced Pandits provided"}</span>
                </div>
              </div>
              <Link
                href={`/pujas/${createSlug("Shadi,vivah sanskar")}`} // Resolves to /pujas/bhat-puja
                className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-md flex items-center gap-2 text-sm inline-flex"
              >
                {language === "hi" ? "विवाह हेतु बुकिंग करें" : "Book Marriage Service"}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. ABOUT PANDIT JI SECTION (With Direct WhatsApp CTA) */}
      {/* ================================================================= */}
      <section className="py-20 bg-slate-100">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row gap-12 items-center bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-200">
      
      {/* Profile Image */}
      <div className="w-full md:w-2/5 flex justify-center relative">
        <div className="w-64 h-64 md:w-80 md:h-80 bg-orange-200 rounded-full border-8 border-orange-50 overflow-hidden shadow-xl relative">
          <img 
            src={aboutData.image || "./pandit-logo.png"} 
            alt={aboutData.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-4 right-1/4 bg-orange-600 text-white p-3 rounded-full shadow-lg">
          <Star className="w-6 h-6 fill-current" />
        </div>
      </div>

      {/* Profile Details */}
      <div className="w-full md:w-3/5 text-center md:text-left space-y-6">
        <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">
          {language === "hi" ? "हमारे बारे में" : "About Us"}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900">
          {aboutData.name}
        </h2>
        <div className="w-16 h-1 bg-orange-500 mx-auto md:mx-0"></div>
        <p className="text-slate-600 text-lg leading-relaxed">
          {language === "hi" && aboutData.descriptionHi 
            ? aboutData.descriptionHi 
            : aboutData.descriptionEn}
        </p>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="text-center md:text-left">
            <h4 className="text-3xl font-bold text-orange-600">{aboutData.yearsExp}+</h4>
            <p className="text-sm text-slate-500 font-medium">Years Experience</p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-3xl font-bold text-orange-600">{aboutData.pujasDone}+</h4>
            <p className="text-sm text-slate-500 font-medium">Pujas Performed</p>
          </div>
        </div>

        {/* Dynamic WhatsApp Button */}
        <div className="pt-2">
          <a
            href={`https://wa.me/${aboutData.whatsappNo || "919340553012"}?text=Hari%20Om%20Acharya%20Ji!%20I%20want%20to%20consult%20regarding%20a%20Puja.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition text-sm"
          >
            <MessageCircle size={20} />
            <span>
              {language === "hi" ? "आचार्य जी से सीधे व्हाट्सएप पर बात करें" : "Connect with Acharya Ji directly on WhatsApp"}
            </span>
          </a>
        </div>

      </div>
    </div>
  </div>
</section>

      {/* ================================================================= */}
      {/* 4. PANCHANG & CHOGHADIYA SECTION */}
      {/* ================================================================= */}
      {false && (
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
                {panchang?.choghadiya_day?.map((slot: ChoghadiyaSlot, i: number) => (
                  <div key={i} className={`flex justify-between items-center p-3 rounded-lg border text-sm ${getChoghadiyaColor(slot.type)}`}>
                    <span className="font-bold">{slot.name}</span>
                    <span className="text-xs font-mono font-medium">{slot.start} - {slot.end}</span>
                  </div>
                )) ?? <p className="text-slate-400 text-sm text-center py-4">Data loading...</p>}
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
                      <span className="font-bold text-right">{panchang?.tithi?.details?.tithi_name || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                      <span className="text-orange-200 text-sm">Nakshatra</span>
                      <span className="font-bold text-right">{panchang?.nakshatra?.details?.nak_name || "—"}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-black/20 p-3 rounded-lg text-center">
                        <Sunrise size={18} className="mx-auto mb-1 text-orange-300" />
                        <span className="text-xs block text-orange-200">Sunrise</span>
                        <span className="font-mono text-sm font-bold">{panchang?.sunrise || "—"}</span>
                      </div>
                      <div className="bg-black/20 p-3 rounded-lg text-center">
                        <Sunset size={18} className="mx-auto mb-1 text-orange-300" />
                        <span className="text-xs block text-orange-200">Sunset</span>
                        <span className="font-mono text-sm font-bold">{panchang?.sunset || "—"}</span>
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
                {panchang?.choghadiya_night?.map((slot: ChoghadiyaSlot, i: number) => (
                  <div key={i} className={`flex justify-between items-center p-3 rounded-lg border text-sm ${getChoghadiyaColor(slot.type)}`}>
                    <span className="font-bold">{slot.name}</span>
                    <span className="text-xs font-mono font-medium">{slot.start} - {slot.end}</span>
                  </div>
                )) ?? <p className="text-slate-400 text-sm text-center py-4">Data loading...</p>}
              </div>
            </div>

          </div>
        </div>
      </section>

      )}

      {/* ================================================================= */}
      {/* 5. TODAY'S MUHURAT */}
      {/* ================================================================= */}
      {false && (
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
                  `${panchang?.abhijit_muhurta.start} - ${panchang?.abhijit_muhurta.end}` : "Not Available"}
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
                  `${panchang?.rahukaal.start} - ${panchang?.rahukaal.end}` : "Not Available"}
              </p>
              <p className="text-sm text-red-600 mt-2">Inauspicious. Avoid starting important tasks.</p>
            </div>
          </div>
        </div>
      </section>

      )}

      {/* ================================================================= */}
      {/* 6. GALLERY SECTION (Static / Placeholder Dummy Images) */}
      {/* ================================================================= */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-orange-600 font-bold tracking-wider uppercase text-xs sm:text-sm">
              {language === "hi" ? "अनुष्ठान झलकियां" : "Sacred Memories"}
            </span>
            <h2 className="text-3xl font-bold font-serif text-slate-900 mt-1">
              {language === "hi" ? "पूजा एवं अनुष्ठान गैलरी" : "Puja & Anushthan Gallery"}
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
          </div>

          {galleryItems.length === 0 ? (
            <p className="text-slate-400 text-center text-sm py-8">
              {language === "hi" ? "गैलरी लोड हो रही है..." : "Loading gallery images..."}
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryItems.map((item, idx) => (
                <div 
                  key={item.id} 
                  onClick={() => setLightboxIndex(idx)}
                  className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition group cursor-pointer"
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.titleEn} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4 text-white">
                    <h4 className="font-bold text-sm sm:text-base">
                      {language === "hi" && item.titleHi ? item.titleHi : item.titleEn}
                    </h4>
                    <span className="text-[11px] text-orange-300 font-medium">Click to view full image</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* LIGHTBOX / FULLSCREEN IMAGE VIEWER MODAL */}
      {/* ================================================================= */}
      {lightboxIndex !== null && galleryItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition z-50"
            title="Close (Esc)"
          >
            <X size={28} />
          </button>

          {/* Previous Arrow */}
          {galleryItems.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition z-50"
              title="Previous"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Image & Title Container */}
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center space-y-4">
            <img
              src={galleryItems[lightboxIndex].imageUrl}
              alt={galleryItems[lightboxIndex].titleEn}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl animate-fade-in"
            />
            
            <div className="text-center space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {language === "hi" && galleryItems[lightboxIndex].titleHi 
                  ? galleryItems[lightboxIndex].titleHi 
                  : galleryItems[lightboxIndex].titleEn}
              </h3>
              <p className="text-xs text-slate-400">
                {lightboxIndex + 1} of {galleryItems.length}
              </p>
            </div>
          </div>

          {/* Next Arrow */}
          {galleryItems.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition z-50"
              title="Next"
            >
              <ChevronRight size={32} />
            </button>
          )}

        </div>
      )}

      {/* ================================================================= */}
      {/* 7. LATEST REVIEWS SCROLLER SECTION */}
      {/* ================================================================= */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-orange-600 font-bold tracking-wider uppercase text-xs sm:text-sm">
              {language === "hi" ? "श्रद्धालुओं के अनुभव" : "Devotee Experiences"}
            </span>
            <h2 className="text-3xl font-bold font-serif text-slate-900 mt-1">
              {language === "hi" ? "हमारे यजमानों की समीक्षाएं" : "Customer Reviews & Feedback"}
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
          </div>

          {reviews.length === 0 ? (
            <p className="text-slate-400 text-center text-sm py-8">
              {language === "hi" ? "समीक्षाएं लोड हो रही हैं..." : "Loading reviews..."}
            </p>
          ) : (
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-2 custom-scrollbar">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="min-w-[280px] md:min-w-[340px] max-w-[360px] snap-center shrink-0 bg-stone-50/80 p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex text-amber-400 gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                        />
                      ))}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed line-clamp-4">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-200/60 mt-4 flex justify-between items-end">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{rev.userName}</h4>
                      <p className="text-xs text-slate-400">{rev.userCity || "Verified Devotee"}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString("en-GB", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 8. TRUST & LEAD CAPTURE SECTION (Contact) */}
      {/* ================================================================= */}
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

      {/* Internal CSS for horizontal scrollbar styling */}
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
        pujaTitle={selectedPujaTitle}
      />
    </div>
  );
}