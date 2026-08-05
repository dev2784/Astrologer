"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { language } = useLanguage();
  
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const WHATSAPP_NUMBER = "919340553012";
  const EMAIL_ADDRESS = "panditji@example.com"; // Replace with your actual email

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      return alert(language === "hi" ? "कृपया सभी अनिवार्य फ़ील्ड भरें।" : "Please fill all required fields.");
    }
    
    setSubmitStatus("loading");
    try {
      // Ensure you have an API route at /api/contact to handle this POST request
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", email: "", message: "" });
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        throw new Error("Failed to send");
      }
    } catch (err) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. MAP SECTION (Top Banner) */}
      <section className="relative w-full h-[400px] md:h-[500px] bg-slate-200">
        <iframe
          title="Mangalnath Mandir Location"
          src="https://www.google.com/maps?q=Mangalnath+Mandir,+Ujjain,+Madhya+Pradesh&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full grayscale-[20%] contrast-[1.1]"
        ></iframe>
        
        {/* Optional overlay banner over the map */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-900/70 to-transparent pointer-events-none"></div>
        <div className="absolute top-10 w-full text-center pointer-events-none">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white drop-shadow-lg">
            {language === "hi" ? "संपर्क करें" : "Contact Us"}
          </h1>
        </div>
      </section>

      {/* 2. CONTACT INFO & FORM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* LEFT: Contact Information Cards */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Address Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
                <MapPin size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {language === "hi" ? "हमारा पता" : "Our Address"}
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Mangalnath Mandir Road,<br />
                Ujjain, Madhya Pradesh<br />
                India - 456006
              </p>
            </div>

            {/* Direct Contact Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                <Phone size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {language === "hi" ? "सीधा संपर्क" : "Direct Contact"}
              </h3>
              
              <div className="space-y-4">
                <a href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center gap-3 text-slate-700 hover:text-orange-600 font-medium transition text-lg">
                  <Phone size={20} className="text-slate-400" />
                  +{WHATSAPP_NUMBER}
                </a>
                
                <a href={`mailto:${EMAIL_ADDRESS}`} className="flex items-center gap-3 text-slate-700 hover:text-orange-600 font-medium transition text-lg">
                  <Mail size={20} className="text-slate-400" />
                  {EMAIL_ADDRESS}
                </a>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hari%20Om!%20I%20have%20an%20inquiry.`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1ebe57] text-white py-5 rounded-2xl shadow-lg font-bold text-lg transition-colors hover:-translate-y-1"
            >
              <MessageCircle size={24} />
              {language === "hi" ? "व्हाट्सएप पर चैट करें" : "Chat on WhatsApp"}
            </a>
            
          </div>

          {/* RIGHT: Working Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200 h-full flex flex-col justify-center">
              <h2 className="text-3xl font-bold font-serif text-slate-900 mb-2">
                {language === "hi" ? "हमें संदेश भेजें" : "Send Us a Message"}
              </h2>
              <p className="text-slate-500 mb-8">
                {language === "hi" 
                  ? "पूजा बुकिंग, मुहूर्त या अन्य किसी भी जानकारी के लिए नीचे दिए गए फॉर्म को भरें। हम जल्द ही आपसे संपर्क करेंगे।" 
                  : "Fill out the form below for Puja bookings, Muhurat inquiries, or any other questions. We will get back to you shortly."}
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {language === "hi" ? "आपका नाम" : "Your Name"} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none bg-slate-50 hover:bg-slate-100 transition"
                      placeholder={language === "hi" ? "नाम दर्ज करें" : "John Doe"}
                    />
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {language === "hi" ? "फ़ोन नंबर" : "Phone Number"} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none bg-slate-50 hover:bg-slate-100 transition"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {language === "hi" ? "ईमेल आईडी (वैकल्पिक)" : "Email Address (Optional)"}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none bg-slate-50 hover:bg-slate-100 transition"
                    placeholder="example@mail.com"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {language === "hi" ? "आपका संदेश" : "Your Message"} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none bg-slate-50 hover:bg-slate-100 transition resize-none"
                    placeholder={language === "hi" ? "आपकी आवश्यकता या प्रश्न यहाँ लिखें..." : "How can we help you?"}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className={`w-full py-5 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg ${
                    submitStatus === "loading" ? "bg-slate-400 cursor-not-allowed" : 
                    submitStatus === "success" ? "bg-green-600" :
                    submitStatus === "error" ? "bg-red-600" :
                    "bg-orange-600 hover:bg-orange-700 hover:-translate-y-1"
                  }`}
                >
                  {submitStatus === "loading" ? "Sending..." :
                   submitStatus === "success" ? (language === "hi" ? "संदेश सफलतापूर्वक भेजा गया!" : "Message Sent Successfully!") :
                   submitStatus === "error" ? "Failed! Try Again" :
                   <>
                     {language === "hi" ? "संदेश भेजें" : "Send Message"} <Send size={20} />
                   </>
                  }
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}